class Exit {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  
  checkCollision(player) {
    let dx = player.x - this.x;
    let dy = player.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius;
  }
  
  draw2D() {
    fill(0, 255, 0, 150);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }
}

