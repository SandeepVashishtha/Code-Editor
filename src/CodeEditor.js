import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import './styles.css';

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [output, setOutput] = useState('');

  useEffect(() => {
    const editor = monaco.editor.create(editorRef.current, {
      value: [
        'function helloWorld() {',
        '\tconsole.log("Hello, world!");',
        '}',
        '',
        'helloWorld();'
      ].join('\n'),
      language: 'javascript',
      theme: 'vs-dark',
      automaticLayout: true,
    });

    return () => editor.dispose();
  }, []);

  const handleRunClick = () => {
    const code = monaco.editor.getModels()[0].getValue();

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const iframeWindow = iframe.contentWindow;
    const iframeDocument = iframe.contentDocument || iframeWindow.document;

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

  return (
    <div className="container">
      <div className="header">
        <span>Code Editor</span>
        <button className="run-button" onClick={handleRunClick}>
          <i className="fas fa-play"></i> Run Code
        </button>
      </div>
      <div className="editor-container">
        <div ref={editorRef} className="monaco-editor"></div>
        <div className="output-console">
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
