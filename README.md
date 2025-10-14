# 🚀 Code Editor

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-0.52.0-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-Pyodide-3776AB?style=for-the-badge&logo=python&logoColor=white)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2025-ff6b35?style=flat&logo=github)](https://hacktoberfest.com)

A modern, interactive code editor built with React and Monaco Editor that allows users to write and execute **JavaScript** and **Python** code directly in the browser! 🎯

## ✨ Features

- 🟨 **JavaScript Support**: Execute JavaScript code instantly in the browser
- 🐍 **Python Support**: Run Python code using Pyodide (no server required!)
- 🎨 **Monaco Editor**: Professional-grade code editor with IntelliSense
- 🌙 **Dark Theme**: Easy on the eyes with syntax highlighting
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Execution**: See results immediately in the output console
- 🛠️ **Error Handling**: Clear error messages and debugging information
- 🚀 **No Setup Required**: Start coding immediately - no installation needed!

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sandeepvashishtha/Code-Editor.git
   cd Code-Editor
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm start
   ```

4. **Open your browser**:
   Visit `http://localhost:3000` and start coding! 🎉

## 🎮 Usage

### JavaScript

1. Select **JavaScript** from the language dropdown
2. Write your JavaScript code in the editor
3. Click **▶️ Run Code** to execute
4. View the output in the console panel

```javascript
// Example: Try this code!
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(`Fibonacci(10) = ${fibonacci(10)}`);
```

### Python  

1. Select **Python** from the language dropdown (wait for Python environment to load)
2. Write your Python code in the editor
3. Click **▶️ Run Code** to execute
4. View the output in the console panel

```python
# Example: Try this code!
import math

def calculate_circle_area(radius):
    return math.pi * radius ** 2

radius = 5
area = calculate_circle_area(radius)
print(f"Circle with radius {radius} has area: {area:.2f}")
```

## 🛠️ Built With

- **React 18** - Modern JavaScript library for building user interfaces
- **Monaco Editor** - The code editor that powers VS Code
- **Pyodide** - Python runtime for the browser
- **Create React App** - Tool for setting up modern React applications

## 🤝 Contributing

We welcome contributions from developers of all skill levels! 🌟

### Quick Start for Contributors

1. Check out our [**Contributing Guide**](CONTRIBUTING.md) 📖
2. Look for issues labeled [`good first issue`](https://github.com/RhythmPahwa14/Code-Editor/labels/good%20first%20issue) or [`hacktoberfest`](https://github.com/RhythmPahwa14/Code-Editor/labels/hacktoberfest)  
3. Fork the repository and create your feature branch
4. Make your changes and test thoroughly
5. Submit a pull request with a clear description

### 🎃 Hacktoberfest 2024

This project participates in **Hacktoberfest**! Here are some great ways to contribute:

- 🐛 **Fix bugs** - Help improve stability and user experience
- ✨ **Add features** - Implement new programming language support
- 📚 **Improve docs** - Make the project more accessible
- 🎨 **Enhance UI** - Improve the visual design and user experience
- 🧪 **Add tests** - Help ensure code quality

Check out our [Hacktoberfest issues](https://github.com/RhythmPahwa14/Code-Editor/labels/hacktoberfest) to get started!

## 🚀 Roadmap

- [ ] 🟦 **TypeScript Support** - Add TypeScript language support
- [ ] 🌐 **HTML/CSS/JS Playground** - Multi-file web development environment  
- [ ] 💾 **Local Storage** - Save and restore code sessions
- [ ] 🔍 **Search & Replace** - Advanced find and replace functionality
- [ ] 🎨 **Multiple Themes** - Light theme and custom theme support
- [ ] 📁 **File Management** - Import/export functionality
- [ ] 🔗 **Share Code** - Generate shareable links for code snippets
- [ ] 🐛 **Debugging Tools** - Integrated debugging capabilities

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - The amazing code editor
- [Pyodide](https://pyodide.org/) - Python runtime for the browser
- [React](https://reactjs.org/) - The UI library powering this app
- All our [contributors](https://github.com/RhythmPahwa14/Code-Editor/graphs/contributors) 🌟

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/RhythmPahwa14/Code-Editor?style=social)
![GitHub forks](https://img.shields.io/github/forks/RhythmPahwa14/Code-Editor?style=social)
![GitHub issues](https://img.shields.io/github/issues/RhythmPahwa14/Code-Editor)
![GitHub pull requests](https://img.shields.io/github/issues-pr/RhythmPahwa14/Code-Editor)

---

<!-- markdownlint-disable MD033 -->
<div align="center">

<!-- markdownlint-disable MD036 -->
**⭐ If you find this project helpful, please give it a star! ⭐**

Made with ❤️ for the developer community

</div>
