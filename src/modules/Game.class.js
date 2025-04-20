'use strict';

export class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.initialState = initialState;

    if (this.board.every((row) => row.every((cell) => cell === 0))) {
      this.addNewTile();
      this.addNewTile();
    }
  }

  move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const newBoard = Array(4)
      .fill()
      .map(() => Array(4).fill(0));
    let moved = false;
    let scoreAdded = 0;

    const processLine = (line) => {
      const arr = line.filter((x) => x !== 0);
      const merged = [];

      for (let i = 0; i < arr.length; i++) {
        if (i < arr.length - 1 && arr[i] === arr[i + 1]) {
          merged.push(arr[i] * 2);
          scoreAdded += arr[i] * 2;
          i++;
        } else {
          merged.push(arr[i]);
        }
      }

      return merged.concat(Array(4 - merged.length).fill(0));
    };

    for (let i = 0; i < 4; i++) {
      let line;

      switch (direction) {
        case 'left':
          line = this.board[i];
          newBoard[i] = processLine(line);
          break;
        case 'right':
          line = [...this.board[i]].reverse();
          newBoard[i] = processLine(line).reverse();
          break;
        case 'up':
          line = this.board.map((row) => row[i]);

          const processed = processLine(line);

          processed.forEach((val, j) => (newBoard[j][i] = val));
          break;
        case 'down':
          line = [...this.board.map((row) => row[i])].reverse();

          const processedDown = processLine(line);

          processedDown.reverse().forEach((val, j) => (newBoard[j][i] = val));

          break;
      }
    }

    moved = JSON.stringify(this.board) !== JSON.stringify(newBoard);

    if (moved) {
      this.board = newBoard;
      this.score += scoreAdded;
      this.addNewTile();
      this.checkGameStatus();
    }

    return moved;
  }
  moveLeft() {
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
  }

  addNewTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }
  checkGameStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    const hasEmpty = this.board.some((row) => row.includes(0));
    let hasMoves = hasEmpty;

    if (!hasEmpty) {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
            hasMoves = true;
          }

          if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
            hasMoves = true;
          }
        }
      }
    }

    this.status = hasMoves ? 'playing' : 'lose';
  }
  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
    }
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'playing';

    if (this.board.every((row) => row.every((cell) => cell === 0))) {
      this.addNewTile();
      this.addNewTile();
    }

    this.checkGameStatus();
  }
}
