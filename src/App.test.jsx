import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders the Code Editor title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Code Editor/i, { selector: '.header-title' });
  expect(titleElement).toBeInTheDocument();
});

test('renders the output console welcome message', async () => {
  render(<App />);
  const consoleMessage = await screen.findByText(/Welcome to the Code Editor/i);
  expect(consoleMessage).toBeInTheDocument();
});

test('renders programming language dropdown', async () => {
  render(<App />);
  const dropdown = screen.getByRole('combobox');
  expect(dropdown).toBeInTheDocument();
});

test('renders Run Code button', async () => {
  render(<App />);
  const runButton = screen.getByRole('button', { name: /Run Code/i });
  expect(runButton).toBeInTheDocument();
});
