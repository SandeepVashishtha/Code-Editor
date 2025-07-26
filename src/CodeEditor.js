import React, { useState, useRef, useCallback, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import './styles.css';
import useResizeObserver from './useResizeObserver';

const CodeEditor = () => {
  const [code, setCode] = useState(`// Welcome to the Code Editor! 
// Try running this JavaScript code:

function greetUser(name) {
  console.log(\`Hello, \${name}! Welcome to the Code Editor! 🎉\`);
  console.log("This is a modern, interactive code editor.");
  console.log("You can write and execute JavaScript and Python code!");
}

greetUser("Developer");

// Try changing the name above and run the code again!`);
  const [output, setOutput] = useState('🌟 Welcome to the Code Editor! Click "Run Code" to execute your code.');
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('⏳ Running your code...');
    
    let result = '';
    try {
      switch (language) {
        case 'javascript':
          result = await executeJavaScript(code);
          break;
        case 'python':
          if (pyodideReady) {
            result = await pythonExecute(code);
          } else {
            result = "⚠️ Python environment is not ready yet. Please wait and try again.";
          }
          break;
        default:
          result = '❌ Language not supported yet.';
      }
    } catch (error) {
      result = `❌ Error: ${error.message}`;
    }
    
    setOutput(result || '✅ Code executed successfully (no output)');
    setIsRunning(false);
  };

  const executeJavaScript = (code) => {
    return new Promise((resolve) => {
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
        resolve(consoleOutput || '✅ Code executed successfully (no console output)');
      } catch (error) {
        resolve(`❌ JavaScript Error: ${error.toString()}`);
      } finally {
        document.body.removeChild(iframe);
      }
    });
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    // Set default code for each language
    switch (event.target.value) {
      case 'javascript':
        setCode(`// Welcome to JavaScript! 
// Try running this interactive example:

function calculateFactorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * calculateFactorial(n - 1);
}

const numbers = [3, 5, 7];
console.log("🔢 Factorial Calculator");
console.log("======================");

numbers.forEach(num => {
  const result = calculateFactorial(num);
  console.log(\`Factorial of \${num} is: \${result}\`);
});

console.log("\\n✨ Try changing the numbers array above!");`);
        break;
      case 'python':
        setCode(`# Welcome to Python! 
# Try running this interactive example:

def fibonacci_sequence(n):
    """Generate fibonacci sequence up to n terms"""
    sequence = []
    a, b = 0, 1
    for _ in range(n):
        sequence.append(a)
        a, b = b, a + b
    return sequence

def print_fibonacci_info(terms):
    print(f"🐍 Fibonacci Sequence Generator")
    print("=" * 35)
    
    fib_seq = fibonacci_sequence(terms)
    print(f"First {terms} Fibonacci numbers:")
    print(fib_seq)
    
    if terms > 0:
        golden_ratio = fib_seq[-1] / fib_seq[-2] if len(fib_seq) > 1 else 1
        print(f"\\nGolden Ratio approximation: {golden_ratio:.6f}")

# Try changing this number!
print_fibonacci_info(10)
print("\\n✨ Try changing the number above!")`);
        break;
      default:
        setCode('// Code here');
    }
  };

  const handleResize = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  }, []);

  const resizeRef = useResizeObserver(handleResize);

  useEffect(() => {
    const loadPyodide = async () => {
      setPyodideLoading(true);
      try {
        pyodideRef.current = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.1/full/"
        });
        setPyodideReady(true);
      } catch (error) {
        console.error("Failed to load Pyodide:", error);
      } finally {
        setPyodideLoading(false);
      }
    };

    loadPyodide();
  }, []);

  const pythonExecute = async (code) => {
    if (!pyodideRef.current) {
      return "Pyodide is not loaded yet.";
    }

    try {
      // removing the previous execution state for pythonExecute function
      pyodideRef.current.runPython(`globals().clear()`);

      await pyodideRef.current.loadPackagesFromImports(code);
      let output = '';
      pyodideRef.current.globals.set('print', (s) => {
        output += s + '\n';
      });
      await pyodideRef.current.runPythonAsync(code);
      return output || '✅ Python code executed successfully (no output)';
    } catch (error) {
      return `❌ Python Error: ${error.toString()}`;
    }
  };

  return (
    <div className="container" ref={resizeRef}>
      <div className="header">
        <div className="header-title">🚀 Code Editor</div>
        <div className="header-controls">
          <select value={language} onChange={handleLanguageChange}>
            <option value="javascript">JavaScript</option>
            <option value="python">
              Python {pyodideLoading ? "(Loading...)" : pyodideReady ? "✅" : "❌"}
            </option>
          </select>
          <button 
            className="run-button" 
            onClick={handleRunCode}
            disabled={(pyodideLoading && language === 'python') || isRunning}
          >
            {pyodideLoading && language === 'python' ? (
              <>⏳ Loading Python...</>
            ) : isRunning ? (
              <>⏳ Running...</>
            ) : (
              <>▶️ Run Code</>
            )}
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
              backgroundColor: '#1e1e1e',
              fontSize: 14,
              lineHeight: 20,
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              selectOnLineNumbers: true,
              automaticLayout: true
            }}
          />
        </div>
        <div className="output-console">
          <h3>📋 Output</h3>
          {pyodideLoading ? (
            <div className="loading-state">🐍 Loading Python environment...</div>
          ) : (
            <pre>{output}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
