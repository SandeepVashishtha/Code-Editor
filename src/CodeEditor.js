import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import './styles.css';

const CodeEditor = () => {
    const editorRef = useRef(null);

    useEffect(() => {
        const editor = monaco.editor.create(editorRef.current, {
            value: [
                'function helloWorld() {',
                '\tconsole.log("Hello, world!");',
                '}'
            ].join('\n'),
            language: 'javascript',
            theme: 'vs-dark', // Use dark theme
        });

        return () => editor.dispose();
    }, []);

    const handleRunClick = () => {
        const code = monaco.editor.getModels()[0].getValue();
        // For now, just log the code to the console
        console.log('Running code:\n', code);
        // Here you can add actual code execution logic if needed
    };

    return (
        <div className="editor-container">
            <div className="editor-header">
                <span className="editor-title">Custom Code Editor</span>
                <button className="run-button" onClick={handleRunClick}>Run</button>
            </div>
            <div className="editor-content" ref={editorRef}></div>
        </div>
    );
};

export default CodeEditor;
