'use strict';

import { Game } from './modules/Game.class.js';

const game = new Game();
const boardEl = document.querySelector('.game-field');
const scoreEl = document.querySelector('.score-value');
const statusEl = document.querySelector('.game-status');
const buttonEl = document.querySelector('.control-button');

function updateUI() {
  // Atualizar tabuleiro
  game.getState().forEach((row, i) => {
    row.forEach((value, j) => {
      const cell = boardEl.children[i * 4 + j];
      cell.textContent = value || '';
      cell.className = `field-cell${value ? ` field-cell--${value}` : ''}`;
    });
  });

  // Atualizar score e status
  scoreEl.textContent = game.getScore();
  statusEl.textContent = {
    'idle': 'Press Start to Play',
    'playing': '',
    'won': 'Winner! Congrats! You did it!',
    'game-over': 'Game Over! No more moves!'
  }[game.getStatus()];

  // Atualizar botão
  buttonEl.textContent = game.getStatus() === 'idle' ? 'Start' : 'Restart';
  buttonEl.className = `control-button ${game.getStatus() === 'idle' ? 'start' : 'restart'}`;
}

document.addEventListener('keydown', e => {
  if (game.getStatus() !== 'playing') return;

  const keyHandler = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown()
  }[e.key];

  if (keyHandler) {
    keyHandler() && updateUI();
  }
});

buttonEl.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  updateUI();
});

// Inicialização
updateUI();
