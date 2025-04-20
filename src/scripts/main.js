import { Game } from './modules/Game.class.js';

// === Sélection des éléments DOM ===
const game = new Game();
const boardEl = document.querySelector('.game-field');
const scoreEl = document.querySelector('.game-score');
const buttonEl = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

// === Mise à jour de l'interface ===
function updateUI() {
  const state = game.getState();
  const rows = boardEl.querySelectorAll('tr');

  // Met à jour les cellules du plateau
  state.forEach((row, i) => {
    const cells = rows[i].querySelectorAll('td');

    row.forEach((value, j) => {
      const cell = cells[j];

      cell.textContent = value || '';

      cell.className = 'field-cell';

      cell.setAttribute('data-value', value || '');

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.classList.add('animated');
        setTimeout(() => cell.classList.remove('animated'), 200);
      }
    });
  });

  // Met à jour le score
  scoreEl.textContent = game.getScore();

  // Affiche les bons messages (start, win, lose)
  const gameStatus = game.getStatus();
  const messages = {
    idle: messageStart,
    win: messageWin,
    lose: messageLose,
  };

  Object.entries(messages).forEach(([key, el]) => {
    el.classList.toggle('hidden', gameStatus !== key);
  });

  // Met à jour le bouton
  buttonEl.textContent = gameStatus === 'idle' ? 'Start' : 'Restart';
  buttonEl.classList.toggle('start', gameStatus === 'idle');
  buttonEl.classList.toggle('restart', gameStatus !== 'idle');
}

// === Gestion du clavier ===
function handleKeyPress(e) {
  const validKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (!validKeys.includes(e.key) || game.getStatus() !== 'playing') {
    return;
  }

  const moved = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  }[e.key]();

  if (moved) {
    updateUI();

    // // Pour le debug
    // console.log('State:', game.getState());

    // console.log('Status:', game.getStatus());

    // console.log('Score:', game.getScore());
  }
}
document.addEventListener('keydown', handleKeyPress);

// === Bouton Start / Restart ===
buttonEl.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  updateUI();
});

// === Initialisation ===
updateUI();
