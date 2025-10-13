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
  console.log("You can write and execute JavaScript, Python, TypeScript, and more!");
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
        case 'typescript':
          result = await executeTypeScript(code);
          break;
        case 'python':
          if (pyodideReady) {
            result = await pythonExecute(code);
          } else {
            result = "⚠️ Python environment is not ready yet. Please wait and try again.";
          }
          break;
        case 'html':
          result = await executeHTML(code);
          break;
        case 'css':
          result = formatCSS(code);
          break;
        case 'json':
          result = formatJSON(code);
          break;
        case 'markdown':
          result = previewMarkdown(code);
          break;
        default:
          result = `❌ Language "${language}" is not supported yet.\n\n🔧 Supported languages: JavaScript, TypeScript, Python, HTML, CSS, JSON, Markdown`;
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

  const executeTypeScript = async (code) => {
    try {
      // For now, we'll transpile TypeScript to JavaScript using a simple approach
      // In a real implementation, you'd want to use the TypeScript compiler
      const jsCode = code
        .replace(/: string|: number|: boolean|: any/g, '') // Remove simple type annotations
        .replace(/interface \w+\s*{[^}]*}/g, '') // Remove interfaces
        .replace(/type \w+\s*=\s*[^;]+;/g, ''); // Remove type aliases
      
      return await executeJavaScript(jsCode);
    } catch (error) {
      return `❌ TypeScript Error: ${error.toString()}\n\n💡 Note: This is a simplified TypeScript execution. For full TS support, consider using a proper TypeScript compiler.`;
    }
  };

  const executeHTML = async (code) => {
    try {
      // Validate HTML structure
      if (!code.trim()) {
        return '⚠️ No HTML code provided.';
      }
      
      // Basic HTML validation
      const hasDoctype = code.toLowerCase().includes('<!doctype');
      const hasHtml = code.toLowerCase().includes('<html');
      const hasBody = code.toLowerCase().includes('<body');
      
      let feedback = '✅ HTML Processed Successfully!\n\n';
      feedback += `� Analysis:\n`;
      feedback += `- Document Type: ${hasDoctype ? '✅ Present' : '⚠️ Missing DOCTYPE'}\n`;
      feedback += `- HTML Tag: ${hasHtml ? '✅ Present' : '⚠️ Missing <html>'}\n`;
      feedback += `- Body Tag: ${hasBody ? '✅ Present' : '⚠️ Missing <body>'}\n`;
      feedback += `- Lines of Code: ${code.split('\n').length}\n\n`;
      feedback += `🌐 This HTML would render in a browser.\n💡 Tip: Add some CSS and JavaScript to make it interactive!`;
      
      return feedback;
    } catch (error) {
      return `❌ HTML Error: ${error.toString()}`;
    }
  };

  const formatCSS = (code) => {
    try {
      // Basic CSS validation and formatting
      if (!code.trim()) {
        return '⚠️ No CSS code provided.';
      }
      
      // Simple CSS validation
      const hasValidCSS = code.includes('{') && code.includes('}');
      if (!hasValidCSS) {
        return '❌ Invalid CSS: Missing braces { }';
      }
      
      return `✅ CSS Formatted Successfully!\n\n🎨 Your CSS code looks good!\n📏 ${code.split('\n').length} lines of CSS\n💡 This CSS can be applied to HTML elements to style your webpage.`;
    } catch (error) {
      return `❌ CSS Error: ${error.toString()}`;
    }
  };

  const formatJSON = (code) => {
    try {
      const parsed = JSON.parse(code);
      const formatted = JSON.stringify(parsed, null, 2);
      return `✅ JSON Formatted Successfully!\n\n📋 Formatted JSON:\n${formatted}\n\n📊 Object contains ${Object.keys(parsed).length} root properties.`;
    } catch (error) {
      return `❌ JSON Error: ${error.message}\n\n💡 Check your JSON syntax - ensure all quotes are double quotes and no trailing commas.`;
    }
  };

  const previewMarkdown = (code) => {
    try {
      if (!code.trim()) {
        return '⚠️ No Markdown content provided.';
      }
      
      // Basic markdown processing (simplified)
      let processed = code
        .replace(/^# (.*$)/gm, '📝 Heading 1: $1')
        .replace(/^## (.*$)/gm, '📘 Heading 2: $1')
        .replace(/^### (.*$)/gm, '📙 Heading 3: $1')
        .replace(/\*\*(.*?)\*\*/g, '🔵 Bold: $1')
        .replace(/\*(.*?)\*/g, '🔸 Italic: $1')
        .replace(/`(.*?)`/g, '💻 Code: $1')
        .replace(/^- (.*$)/gm, '• $1');
      
      return `✅ Markdown Preview:\n\n${processed}\n\n💡 This is a simplified preview. In a full markdown editor, this would render as formatted HTML.`;
    } catch (error) {
      return `❌ Markdown Error: ${error.toString()}`;
    }
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
      case 'typescript':
        setCode(`// Welcome to TypeScript!
// Try this strongly-typed example:

interface User {
  name: string;
  age: number;
  email: string;
}

function createUser(name: string, age: number, email: string): User {
  return { name, age, email };
}

function greetUser(user: User): string {
  return \`Hello \${user.name}! You are \${user.age} years old.\`;
}

// Try changing these values!
const user = createUser("Alice", 30, "alice@example.com");
console.log("🟦 TypeScript Example");
console.log("====================");
console.log(greetUser(user));
console.log(\`Email: \${user.email}\`);

console.log("\\n✨ Try modifying the user data above!");`);
        break;
      case 'html':
        setCode(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container { 
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
        }
        button {
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 Welcome to HTML!</h1>
        <p>This is a sample HTML page with embedded CSS and JavaScript.</p>
        <button onclick="showMessage()">Click Me!</button>
        <div id="message"></div>
    </div>

    <script>
        function showMessage() {
            document.getElementById('message').innerHTML = 
                '<h3>🎉 Hello from JavaScript!</h3><p>You clicked the button!</p>';
        }
    </script>
</body>
</html>`);
        break;
      case 'css':
        setCode(`/* Welcome to CSS! 
   Try this modern styling example: */

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 40px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.button {
  display: inline-block;
  background: #4CAF50;
  color: white;
  padding: 15px 30px;
  text-decoration: none;
  border-radius: 25px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 25px rgba(0,0,0,0.2);
}

/* Try modifying these styles! */`);
        break;
      case 'json':
        setCode(`{
  "project": {
    "name": "Code Editor",
    "version": "1.0.0",
    "description": "A modern, interactive code editor",
    "technologies": [
      "React",
      "Monaco Editor",
      "JavaScript",
      "Python",
      "TypeScript"
    ],
    "features": {
      "codeExecution": true,
      "multiLanguage": true,
      "syntaxHighlighting": true,
      "darkTheme": true
    },
    "stats": {
      "linesOfCode": 1000,
      "contributors": 5,
      "stars": 42
    },
    "contact": {
      "email": "developer@example.com",
      "github": "https://github.com/username/code-editor"
    }
  }
}`);
        break;
      case 'markdown':
        setCode(`# Welcome to Markdown! 📝

Markdown is a lightweight markup language for creating formatted text.

## Features ✨

- **Bold text** and *italic text*
- \`Inline code\` and code blocks
- Lists and links
- Headers and formatting

### Code Example

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

### Lists

- Item 1
- Item 2  
- Item 3

### Links

[Visit GitHub](https://github.com)

---

**Try editing this markdown content above!** 

> This is a blockquote. Markdown makes it easy to format text without HTML.

### Table Example

| Language   | File Extension | Usage        |
|------------|----------------|--------------|
| JavaScript | .js            | Web Development |
| Python     | .py            | Data Science    |
| Markdown   | .md            | Documentation   |`);
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
            <option value="typescript">TypeScript</option>
            <option value="python">
              Python {pyodideLoading ? "(Loading...)" : pyodideReady ? "✅" : "❌"}
            </option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
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
