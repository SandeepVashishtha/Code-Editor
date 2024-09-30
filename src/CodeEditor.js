import React, { useState, useRef, useEffect, useCallback } from 'react';
import Editor from "@monaco-editor/react";
import './styles.css';
import useResizeObserver from './useResizeObserver';

const CodeEditor = () => {
  const [code, setCode] = useState(`function helloWorld() {
  console.log("Hello, world!");
}

helloWorld();`);
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const editorRef = useRef(null);

  useEffect(() => {
    // This effect is now empty as we're using the Monaco Editor React wrapper
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleRunCode = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const iframeWindow = iframe.contentWindow;
    
    let consoleOutput = '';
    iframeWindow.console.log = (message) => {
      consoleOutput += message + '\n';
    };

    try {
      iframeWindow.eval(code);
      setOutput(consoleOutput || 'No output');
    } catch (error) {
      setOutput(error.toString());
    }

    document.body.removeChild(iframe);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleResize = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  }, []);

  const resizeRef = useResizeObserver(handleResize);

  return (
    <div className="container" ref={resizeRef}>
      <div className="header">
        <div className="header-title">Code Editor</div>
        <div className="header-controls">
          <select value={language} onChange={handleLanguageChange}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="cpp">C++</option>
          </select>
          <button className="run-button" onClick={handleRunCode}>
            <i className="fas fa-play"></i> Run Code
          </button>
        </div>
      </div>
      <div className="editor-container">
        <div className="monaco-editor">
          <Editor
            height="100%"
            defaultLanguage={language}
            language={language}
            value={code}
            onMount={handleEditorDidMount}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            options={{
              backgroundColor: '#1e1e1e'
            }}
          />
        </div>
        <div className="output-console">
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
