class Maze {
  constructor(tileSize, width, height) {
    this.tileSize = tileSize;
    this.width = width;
    this.height = height;
    this.cells = [];
    this.visited = [];
    this.tiles = [];
    this.exitPosition = null;
    this.generate();
  }
  
  generate() {
    this.tiles = [];
    
    for (let x = 0; x < this.width; x++) {
      this.cells[x] = [];
      this.visited[x] = [];
      for (let y = 0; y < this.height; y++) {
        this.cells[x][y] = true;
        this.visited[x][y] = false;
      }
    }
    
    let maxStartX = Math.max(1, Math.floor((this.width / 2 - 1)));
    let maxStartY = Math.max(1, Math.floor((this.height / 2 - 1)));
    let startX = 1 + (maxStartX > 0 ? Math.floor(Math.random() * maxStartX) * 2 : 1);
    let startY = 1 + (maxStartY > 0 ? Math.floor(Math.random() * maxStartY) * 2 : 1);
    startX = Math.max(1, Math.min(startX, this.width - 2));
    startY = Math.max(1, Math.min(startY, this.height - 2));
    
    this.carveMaze(startX, startY);
    
    let exitX = this.width - 2 - (startX - 1);
    let exitY = this.height - 2 - (startY - 1);
    exitX = Math.max(1, Math.min(exitX, this.width - 2));
    exitY = Math.max(1, Math.min(exitY, this.height - 2));
    
    this.cells[exitX][exitY] = false;
    if (exitX < this.width - 1 && this.cells[exitX + 1][exitY]) {
      this.cells[exitX + 1][exitY] = false;
    }
    if (exitY < this.height - 1 && this.cells[exitX][exitY + 1]) {
      this.cells[exitX][exitY + 1] = false;
    }
    
    this.exitPosition = {x: exitX * this.tileSize + this.tileSize / 2, y: exitY * this.tileSize + this.tileSize / 2};
    
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.cells[x][y]) {
          this.tiles.push({x: x * this.tileSize, y: y * this.tileSize});
        }
      }
    }
  }
  
  carveMaze(x, y) {
    if (x < 1 || x >= this.width - 1 || y < 1 || y >= this.height - 1) {
      return;
    }
    
    if (this.visited[x][y]) {
      return;
    }
    
    this.visited[x][y] = true;
    this.cells[x][y] = false;
    
    let directions = [0, 1, 2, 3];
    for (let i = 0; i < 4; i++) {
      let j = Math.floor(Math.random() * 4);
      let temp = directions[i];
      directions[i] = directions[j];
      directions[j] = temp;
    }
    
    for (let dir of directions) {
      let newX = x;
      let newY = y;
      
      switch(dir) {
        case 0: newY -= 2; break;
        case 1: newX += 2; break;
        case 2: newY += 2; break;
        case 3: newX -= 2; break;
      }
      
      if (newX >= 1 && newX < this.width - 1 && 
          newY >= 1 && newY < this.height - 1 && 
          !this.visited[newX][newY]) {
        this.cells[(x + newX) / 2][(y + newY) / 2] = false;
        this.carveMaze(newX, newY);
      }
    }
  }
  
  checkCollision(x, y) {
    let radius = this.tileSize * 0.3;
    
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      let checkX = x + Math.cos(angle) * radius;
      let checkY = y + Math.sin(angle) * radius;
      
      let gridX = Math.floor(checkX / this.tileSize);
      let gridY = Math.floor(checkY / this.tileSize);
      
      if (gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height) {
        return true;
      }
      
      if (this.cells[gridX][gridY]) {
        return true;
      }
    }
    
    return false;
  }
  
  isWall(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return true;
    }
    return this.cells[x][y];
  }
  
  getStartPosition() {
    for (let x = 1; x < this.width - 1; x++) {
      for (let y = 1; y < this.height - 1; y++) {
        if (!this.cells[x][y]) {
          return [x, y];
        }
      }
    }
    return [1, 1];
  }
  
  getExitPosition() {
    return this.exitPosition;
  }
}

