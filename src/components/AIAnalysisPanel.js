/**
 * AI Analysis Panel Component
 * Displays AI-powered error explanations and code suggestions
 */

import React from 'react';
import './AIAnalysisPanel.css';

const AIAnalysisPanel = ({ analysis, isLoading, onClose, onApplyFix, onHighlightError }) => {
  if (!analysis && !isLoading) {
    return null;
  }

  const hasFixableIssues = analysis && analysis.fixedCode;

  return (
    <div className='ai-analysis-overlay' onClick={onClose}>
      <div className='ai-analysis-panel' onClick={e => e.stopPropagation()}>
        <div className='ai-panel-header'>
          <div className='ai-panel-title'>
            <span className='ai-icon'>🤖</span>
            <h3>AI Code Assistant</h3>
            <span className='ai-badge'>Gemini 2.0 Flash</span>
          </div>
          <button className='ai-close-btn' onClick={onClose} aria-label='Close'>
            ✕
          </button>
        </div>

        <div className='ai-panel-content'>
          {isLoading ? (
            <div className='ai-loading'>
              <div className='ai-loading-spinner'></div>
              <p>🔍 Analyzing your code with AI...</p>
              <p className='ai-loading-subtext'>This may take a few seconds</p>
            </div>
          ) : analysis ? (
            <>
              {analysis.success === false && (
                <div className='ai-error-message'>
                  <span className='error-icon'>⚠️</span>
                  <p>
                    {analysis.explanation || 'Unable to analyze code. Please check your API key.'}
                  </p>
                </div>
              )}

              {analysis.success !== false && (
                <>
                  {analysis.explanation && (
                    <div className='ai-section ai-explanation'>
                      <h4>
                        <span className='section-icon'>💡</span>
                        What Happened
                      </h4>
                      <p>{analysis.explanation}</p>
                    </div>
                  )}

                  {analysis.cause && (
                    <div className='ai-section ai-cause'>
                      <h4>
                        <span className='section-icon'>🎯</span>
                        Root Cause
                      </h4>
                      <p>{analysis.cause}</p>
                    </div>
                  )}

                  {analysis.suggestions && analysis.suggestions.length > 0 && (
                    <div className='ai-section ai-suggestions'>
                      <h4>
                        <span className='section-icon'>🔧</span>
                        How to Fix It
                      </h4>
                      <ul>
                        {analysis.suggestions.map((suggestion, index) => (
                          <li key={index}>
                            <span className='suggestion-bullet'>→</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>

                      {(hasFixableIssues || analysis.errorLine) && (
                        <div className='ai-fix-actions'>
                          {hasFixableIssues && (
                            <button
                              className='ai-apply-fix-btn'
                              onClick={() => onApplyFix && onApplyFix(analysis.fixedCode)}
                              title='Automatically apply the suggested fix'
                            >
                              <span>✨</span>
                              <span>Apply Fix</span>
                            </button>
                          )}
                          {analysis.errorLine && (
                            <button
                              className='ai-highlight-btn'
                              onClick={() =>
                                onHighlightError &&
                                onHighlightError(analysis.errorLine, analysis.errorColumn)
                              }
                              title='Highlight error in editor'
                            >
                              <span>🔍</span>
                              <span>Show Error</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className='ai-footer'>
                    <p className='ai-tip'>
                      <span className='tip-icon'>✨</span>
                      <span>
                        <strong>Pro Tip:</strong> Use this feedback to learn and improve your coding
                        skills!
                      </span>
                    </p>
                  </div>
                </>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPanel;
