import React, { useEffect, useMemo, useState } from 'react';
import './index.css';
import './App.css';

// Utility to calculate winner and winning line
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

// Cell component
function Cell({ value, onClick, isWinning, index, disabled }) {
  const label = `Cell ${index + 1}${value ? `, ${value}` : ''}`;
  // PUBLIC_INTERFACE
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      aria-label={label}
      tabIndex={0}
      className={`ttt-cell ${isWinning ? 'winning' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
    >
      {value}
    </div>
  );
}

// Board component
function Board({ squares, onPlay, winningLine, gameOver, nextPlayer }) {
  // PUBLIC_INTERFACE
  const renderCell = (i) => {
    const isWinning = winningLine.includes(i);
    const disabled = !!squares[i] || gameOver;
    return (
      <Cell
        key={i}
        index={i}
        value={squares[i]}
        isWinning={isWinning}
        disabled={disabled}
        onClick={() => onPlay(i)}
      />
    );
  };

  return (
    <div className="board-wrapper" aria-label="Tic Tac Toe board" role="grid" aria-rowcount={3} aria-colcount={3}>
      <div className="board-grid">
        {Array.from({ length: 9 }).map((_, i) => renderCell(i))}
      </div>
      <div className="board-shadow" aria-hidden="true" />
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * This is the main Tic Tac Toe App.
   * - Renders a centered 3x3 board.
   * - Tracks alternating X/O turns.
   * - Detects winner/draw and highlights winning line.
   * - Provides Reset/New Game and Undo (optional history).
   * - Accessible via keyboard (Tab + Enter/Space) and announces status via aria-live.
   */
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [step, setStep] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const currentSquares = history[step];

  const { winner, line } = useMemo(() => calculateWinner(currentSquares), [currentSquares]);
  const movesPlayed = currentSquares.filter(Boolean).length;
  const isDraw = !winner && movesPlayed === 9;
  const gameOver = Boolean(winner) || isDraw;

  useEffect(() => {
    // Set page background and theme variables
    document.documentElement.style.setProperty('--primary', '#3b82f6');
    document.documentElement.style.setProperty('--success', '#06b6d4');
    document.documentElement.style.setProperty('--secondary', '#64748b');
    document.documentElement.style.setProperty('--bg', '#f9fafb');
    document.documentElement.style.setProperty('--surface', '#ffffff');
    document.documentElement.style.setProperty('--text', '#111827');
  }, []);

  // PUBLIC_INTERFACE
  const handlePlay = (i) => {
    if (currentSquares[i] || winner) return;
    const next = currentSquares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    const nextHistory = history.slice(0, step + 1).concat([next]);
    setHistory(nextHistory);
    setStep(step + 1);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setHistory([Array(9).fill(null)]);
    setStep(0);
    setXIsNext(true);
  };

  // PUBLIC_INTERFACE
  const handleUndo = () => {
    if (step > 0 && !winner) {
      setStep(step - 1);
      setXIsNext(!xIsNext);
    }
  };

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
      ? 'Draw!'
      : `Turn: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="app-root">
      <div className="container">
        <header className="header">
          <h1 className="title" aria-label="Tic Tac Toe">Tic Tac Toe</h1>
          <p className={`status ${winner ? 'status-win' : isDraw ? 'status-draw' : ''}`} aria-live="polite">
            {statusText}
          </p>
        </header>

        <main>
          <Board
            squares={currentSquares}
            onPlay={handlePlay}
            winningLine={line}
            gameOver={gameOver}
            nextPlayer={xIsNext ? 'X' : 'O'}
          />
        </main>

        <footer className="controls">
          <button className="btn primary" onClick={handleReset} aria-label="Reset game and start a new one">
            New Game
          </button>
          <button
            className="btn secondary"
            onClick={handleUndo}
            disabled={step === 0 || winner}
            aria-label="Undo last move"
          >
            Undo
          </button>
        </footer>
      </div>
    </div>
  );
}

export default App;
