import React from 'react';
import './App.css';
import CodeEditor from './CodeEditor';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <div className='App'>
      <ErrorBoundary>
        <CodeEditor />
      </ErrorBoundary>
    </div>
  );
}

export default App;
