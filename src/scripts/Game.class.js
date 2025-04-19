'use strict';

export class Game {
  constructor(initialState) {
    this.board = initialState || Array(4).fill().map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle'; // 'playing', 'won', 'game-over'
    this.addNewTile();
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  addNewTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) emptyCells.push([i, j]);
      }
    }
    
    if (emptyCells.length > 0) {
      const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  move(direction) {
    let moved = false;
    const newBoard = Array(4).fill().map(() => Array(4).fill(0));
    const oldBoard = JSON.stringify(this.board);

    // Implementação genérica do movimento
    for (let i = 0; i < 4; i++) {
      let row = [];
      switch(direction) {
        case 'left': row = this.board[i]; break;
        case 'right': row = [...this.board[i]].reverse(); break;
        case 'up': row = this.board.map(r => r[i]); break;
        case 'down': row = this.board.map(r => r[i]).reverse(); break;
      }

      // Processamento da linha/coluna
      const processed = this.processLine(row);
      
      // Reconstrução do board
      for (let j = 0; j < 4; j++) {
        switch(direction) {
          case 'left': newBoard[i][j] = processed[j]; break;
          case 'right': newBoard[i][3 - j] = processed[j]; break;
          case 'up': newBoard[j][i] = processed[j]; break;
          case 'down': newBoard[3 - j][i] = processed[j]; break;
        }
      }
    }

    moved = JSON.stringify(newBoard) !== oldBoard;
    if (moved) {
      this.board = newBoard;
      this.addNewTile();
      this.checkGameState();
    }
    return moved;
  }

  processLine(line) {
    let arr = line.filter(x => x !== 0);
    let score = 0;
    
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        score += arr[i];
        arr.splice(i + 1, 1);
      }
    }

    this.score += score;
    return [...arr, ...Array(4 - arr.length).fill(0)];
  }

  checkGameState() {
    // Verificar vitória
    if (this.board.some(row => row.includes(2048))) {
      this.status = 'won';
      return;
    }

    // Verificar game over
    const hasMoves = this.board.some((row, i) => 
      row.some((cell, j) => 
        cell === 0 ||
        (j < 3 && cell === row[j + 1]) ||
        (i < 3 && cell === this.board[i + 1][j])
      )
    );
    
    this.status = hasMoves ? 'playing' : 'game-over';
  }

  moveLeft() { return this.move('left'); }
  moveRight() { return this.move('right'); }
  moveUp() { return this.move('up'); }
  moveDown() { return this.move('down'); }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
    }
  }

  restart() {
    this.board = Array(4).fill().map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.addNewTile();
  }
  
