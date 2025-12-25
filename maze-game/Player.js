class Player {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.angle = 0;
    this.walkSpeed = 0.5;
    this.runSpeed = 1.2;
    this.rotationSpeed = 0.05;
    
    this.keyUp = false;
    this.keyDown = false;
    this.keyLeft = false;
    this.keyRight = false;
    
    this.keyRotateLeft = false;
    this.keyRotateRight = false;
    
    this.isRunning = false;
  }
  
  update(maze) {
    let currentSpeed = this.isRunning ? this.runSpeed : this.walkSpeed;
    
    let newX = this.x;
    let newY = this.y;
    
    if (this.keyRotateLeft) {
      this.angle -= this.rotationSpeed;
    }
    if (this.keyRotateRight) {
      this.angle += this.rotationSpeed;
    }
    
    let deltaX = 0;
    let deltaY = 0;
    
    if (this.keyUp) {
      deltaX += Math.cos(this.angle) * currentSpeed;
      deltaY += Math.sin(this.angle) * currentSpeed;
    }
    if (this.keyDown) {
      deltaX -= Math.cos(this.angle) * currentSpeed;
      deltaY -= Math.sin(this.angle) * currentSpeed;
    }
    
    if (this.keyLeft) {
      deltaX += Math.cos(this.angle - Math.PI/2) * currentSpeed;
      deltaY += Math.sin(this.angle - Math.PI/2) * currentSpeed;
    }
    if (this.keyRight) {
      deltaX += Math.cos(this.angle + Math.PI/2) * currentSpeed;
      deltaY += Math.sin(this.angle + Math.PI/2) * currentSpeed;
    }
    
    newX = this.x + deltaX;
    if (!maze.checkCollision(newX, this.y)) {
      this.x = newX;
    }
    
    newY = this.y + deltaY;
    if (!maze.checkCollision(this.x, newY)) {
      this.y = newY;
    }
  }
  
  setPosition(newX, newY) {
    this.x = newX;
    this.y = newY;
  }
  
  reset(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.angle = 0;
  }
}

