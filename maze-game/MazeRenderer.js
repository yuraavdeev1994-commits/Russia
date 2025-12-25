class MazeRenderer {
  render2D(maze, player) {
    push();
    translate(0, 0);
    
    for (let tile of maze.tiles) {
      fill(255);
      stroke(0);
      strokeWeight(1);
      rect(tile.x, tile.y, maze.tileSize, maze.tileSize);
    }
    
    fill(255, 0, 0);
    noStroke();
    ellipse(player.x, player.y, 2, 2);
    
    stroke(255, 0, 0);
    strokeWeight(2);
    line(player.x, player.y, 
         player.x + Math.cos(player.angle) * 20, 
         player.y + Math.sin(player.angle) * 20);
    
    pop();
  }
}

