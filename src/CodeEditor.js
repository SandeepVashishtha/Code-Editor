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
        '}'
      ].join('\n'),
      language: 'javascript',
      theme: 'vs-dark',
      automaticLayout: true, // Automatically adjust layout
    });

    editor.onDidLayoutChange(() => {
      editor.layout();
    });

    return () => editor.dispose();
  }, []);

  const handleRunClick = () => {
    const code = monaco.editor.getModels()[0].getValue();
    try {
      const result = eval(code);
      setOutput(result !== undefined ? result : 'No output');
    } catch (error) {
      setOutput(error.toString());
    }
  };

  return (
    <div className="container">
      <div className="header">
        <span>Custom Code Editor</span>
        <button className="run-button" onClick={handleRunClick}>Run</button>
      </div>
      <div className="editor-container">
        <div ref={editorRef} className="monaco-editor"></div>
      </div>
      <div className="output-console">
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
