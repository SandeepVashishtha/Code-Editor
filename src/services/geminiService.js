/**
 * Gemini AI Service
 * Handles AI-powered code analysis using Google's Gemini 2.0 Flash API (Free Tier)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the Gemini API with the provided API key
   * @param {string} apiKey - Your Gemini API key
   */
  initialize(apiKey) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      // Using gemini-2.0-flash-exp (free tier model)
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      this.isInitialized = true;
      console.log('✅ Gemini AI Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
      throw error;
    }
  }

  /**
   * Analyze code for errors and provide AI-powered suggestions
   * @param {string} code - The code to analyze
   * @param {string} language - Programming language
   * @param {string} errorMessage - The error message from execution
   * @returns {Promise<Object>} - AI analysis with explanation and suggestions
   */
  async analyzeError(code, language, errorMessage) {
    if (!this.isInitialized) {
      throw new Error('Gemini AI Service is not initialized. Please set your API key.');
    }

    try {
      const prompt = this.buildErrorAnalysisPrompt(code, language, errorMessage);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAIResponse(text);
    } catch (error) {
      console.error('Error analyzing code:', error);
      return {
        success: false,
        error: error.message,
        explanation:
          'Unable to analyze error at this time. Please check your API key and try again.',
        suggestions: []
      };
    }
  }

  /**
   * Analyze code before execution for potential issues
   * @param {string} code - The code to analyze
   * @param {string} language - Programming language
   * @returns {Promise<Object>} - AI analysis with potential issues and suggestions
   */
  async analyzeCodeBeforeRun(code, language) {
    if (!this.isInitialized) {
      throw new Error('Gemini AI Service is not initialized. Please set your API key.');
    }

    try {
      const prompt = this.buildPreExecutionPrompt(code, language);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAIResponse(text);
    } catch (error) {
      console.error('Error analyzing code:', error);
      return {
        success: false,
        error: error.message,
        explanation: 'Unable to analyze code at this time.',
        suggestions: []
      };
    }
  }

  /**
   * Get code optimization suggestions
   * @param {string} code - The code to optimize
   * @param {string} language - Programming language
   * @returns {Promise<Object>} - AI suggestions for optimization
   */
  async getOptimizationSuggestions(code, language) {
    if (!this.isInitialized) {
      throw new Error('Gemini AI Service is not initialized. Please set your API key.');
    }

    try {
      const prompt = `You are an expert ${language} developer. Analyze the following code and provide optimization suggestions.

Code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. Performance improvements
2. Code quality enhancements
3. Best practices recommendations
4. Potential bug prevention

Format your response as:
EXPLANATION: [Brief overview of the code quality]
SUGGESTIONS:
- [Suggestion 1]
- [Suggestion 2]
- [Suggestion 3]
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAIResponse(text);
    } catch (error) {
      console.error('Error getting optimization suggestions:', error);
      return {
        success: false,
        error: error.message,
        explanation: 'Unable to get optimization suggestions at this time.',
        suggestions: []
      };
    }
  }

  /**
   * Build prompt for error analysis
   */
  buildErrorAnalysisPrompt(code, language, errorMessage) {
    return `You are an expert programming tutor specializing in ${language}. A student has encountered an error while running their code.

Code:
\`\`\`${language}
${code}
\`\`\`

Error Message:
${errorMessage}

Please analyze this error and provide:
1. A clear, beginner-friendly explanation of what went wrong
2. The root cause of the error
3. Step-by-step instructions to fix it
4. Best practices to avoid similar errors
5. If possible, the corrected code

Format your response EXACTLY as follows:
EXPLANATION: [Your clear explanation in 2-3 sentences]
CAUSE: [Root cause in 1-2 sentences]
ERROR_LINE: [Line number where error occurred, or 0 if unknown]
ERROR_COLUMN: [Column number where error occurred, or 0 if unknown]
SUGGESTIONS:
- [Fix step 1]
- [Fix step 2]
- [Fix step 3]
- [Best practice tip]
FIXED_CODE:
\`\`\`${language}
[If you can provide a corrected version of the code, put it here. Otherwise write "Manual fix required"]
\`\`\`

Keep it concise and educational. Focus on helping beginners understand and learn.`;
  }

  /**
   * Build prompt for pre-execution analysis
   */
  buildPreExecutionPrompt(code, language) {
    return `You are an expert ${language} code reviewer. Analyze the following code for potential issues BEFORE execution.

Code:
\`\`\`${language}
${code}
\`\`\`

Check for:
1. Syntax errors or potential runtime errors
2. Logical issues that might cause unexpected behavior
3. Common mistakes beginners make
4. Security concerns or bad practices

If the code looks good, provide positive feedback and explain what the code does.

Format your response EXACTLY as follows:
EXPLANATION: [Your assessment of the code]
SUGGESTIONS:
- [Suggestion 1 or "No issues found!"]
- [Suggestion 2]
- [Suggestion 3]

Keep it educational and encouraging.`;
  }

  /**
   * Parse AI response into structured format
   */
  parseAIResponse(text) {
    const response = {
      success: true,
      explanation: '',
      cause: '',
      suggestions: [],
      errorLine: null,
      errorColumn: null,
      fixedCode: null,
      rawResponse: text
    };

    try {
      // Extract explanation
      const explanationMatch = text.match(
        /EXPLANATION:\s*([^\n]+(?:\n(?!CAUSE:|ERROR_LINE:|SUGGESTIONS:|FIXED_CODE:)[^\n]+)*)/i
      );
      if (explanationMatch) {
        response.explanation = explanationMatch[1].trim();
      }

      // Extract cause (if present)
      const causeMatch = text.match(
        /CAUSE:\s*([^\n]+(?:\n(?!ERROR_LINE:|SUGGESTIONS:|FIXED_CODE:)[^\n]+)*)/i
      );
      if (causeMatch) {
        response.cause = causeMatch[1].trim();
      }

      // Extract error line number
      const errorLineMatch = text.match(/ERROR_LINE:\s*(\d+)/i);
      if (errorLineMatch && parseInt(errorLineMatch[1]) > 0) {
        response.errorLine = parseInt(errorLineMatch[1]);
      }

      // Extract error column number
      const errorColumnMatch = text.match(/ERROR_COLUMN:\s*(\d+)/i);
      if (errorColumnMatch && parseInt(errorColumnMatch[1]) > 0) {
        response.errorColumn = parseInt(errorColumnMatch[1]);
      }

      // Extract suggestions
      const suggestionsMatch = text.match(/SUGGESTIONS:\s*([\s\S]*?)(?:FIXED_CODE:|$)/i);
      if (suggestionsMatch) {
        const suggestionsText = suggestionsMatch[1];
        const suggestions = suggestionsText
          .split('\n')
          .filter(line => line.trim().startsWith('-') || line.trim().match(/^\d+\./))
          .map(line => line.replace(/^[\s-]*[-\d.]+\s*/, '').trim())
          .filter(s => s.length > 0);

        response.suggestions =
          suggestions.length > 0 ? suggestions : ['Check the code structure and syntax'];
      }

      // Extract fixed code
      const fixedCodeMatch = text.match(/FIXED_CODE:\s*```[\w]*\s*([\s\S]*?)```/i);
      if (fixedCodeMatch) {
        const fixedCode = fixedCodeMatch[1].trim();
        if (fixedCode && !fixedCode.toLowerCase().includes('manual fix required')) {
          response.fixedCode = fixedCode;
        }
      }

      // If no structured format found, use the whole response as explanation
      if (!response.explanation && !response.suggestions.length) {
        response.explanation = text.substring(0, 500);
        response.suggestions = ['Review the AI feedback above'];
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      response.explanation = text.substring(0, 500);
      response.suggestions = ['Review the detailed feedback'];
    }

    return response;
  }

  /**
   * Check if the service is initialized
   */
  isReady() {
    return this.isInitialized;
  }
}

// Export singleton instance
const geminiService = new GeminiService();
export default geminiService;
