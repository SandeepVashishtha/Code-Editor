import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleRunCode = async () => {
    let result = '';
    switch (language) {
      case 'javascript':
        result = await executeJavaScript(code);
        break;
      case 'python':
        if (pyodideReady) {
          result = await pythonExecute(code);
        } else {
          result = "Pyodide is not ready yet. Please wait and try again.";
        }
        break;
      default:
        result = 'Language not supported yet.';
    }
    setOutput(result);
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
        resolve(consoleOutput || 'No output');
      } catch (error) {
        resolve(error.toString());
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
        setCode(`function helloWorld() {
  console.log("Hello, world!");
}

helloWorld();`);
        break;
      case 'python':
        setCode(`def hello_world():
    print("Hello, world!")

hello_world()`);
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
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.22.1/full/"
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
      return output || 'No output';
    } catch (error) {
      return error.toString();
    }
  };

  return (
    <div className="container" ref={resizeRef}>
      <div className="header">
        <div className="header-title">Code Editor</div>
        <div className="header-controls">
          <select value={language} onChange={handleLanguageChange}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
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
          {pyodideLoading ? (
            <p>Loading Pyodide...</p>
          ) : (
            <pre>{output}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
