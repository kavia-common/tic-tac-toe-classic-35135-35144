import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /tic tac toe/i });
  expect(heading).toBeInTheDocument();
});

test('supports move history navigation with undo/redo', () => {
  render(<App />);

  // Click first cell (Cell 1)
  const cell1 = screen.getByRole('button', { name: /cell 1/i });
  fireEvent.click(cell1);

  // Status should show next player O
  expect(screen.getByText(/turn: o/i)).toBeInTheDocument();

  // Undo should be enabled now; click Undo
  const undoBtn = screen.getByRole('button', { name: /undo last move/i });
  expect(undoBtn).not.toBeDisabled();
  fireEvent.click(undoBtn);

  // After undo, status should be Turn: X again
  expect(screen.getByText(/turn: x/i)).toBeInTheDocument();

  // Redo should be enabled; click Redo
  const redoBtn = screen.getByRole('button', { name: /redo next move/i });
  expect(redoBtn).not.toBeDisabled();
  fireEvent.click(redoBtn);

  // After redo, Turn: O again
  expect(screen.getByText(/turn: o/i)).toBeInTheDocument();

  // Move list should have a "Go to start" button
  const goToStart = screen.getByRole('button', { name: /go to start/i });
  expect(goToStart).toBeInTheDocument();

  // Jump to start
  fireEvent.click(goToStart);
  expect(screen.getByText(/turn: x/i)).toBeInTheDocument();
});
