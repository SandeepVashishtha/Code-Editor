import { loadPyodide } from 'pyodide';

let pyodideInstance = null;

export const pythonExecute = async code => {
  if (!pyodideInstance) {
    pyodideInstance = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.1/full/'
    });
  }

  try {
    await pyodideInstance.loadPackagesFromImports(code);
    let output = '';
    pyodideInstance.globals.set('print', s => {
      output += s + '\n';
    });
    await pyodideInstance.runPythonAsync(code);
    return output || 'No output';
  } catch (error) {
    return error.toString();
  }
};
