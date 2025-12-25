class Button {
  constructor(label, x, y, w, h) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    this.normalColor = [74, 144, 226];
    this.hoverColor = [91, 160, 242];
    this.pressedColor = [58, 128, 210];
    this.textColor = [255, 255, 255];
    
    this.isHovered = false;
    this.isPressed = false;
  }
  
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  
  draw() {
    this.isHovered = this.isMouseOver();
    
    let currentColor = this.normalColor;
    if (this.isPressed) {
      currentColor = this.pressedColor;
    } else if (this.isHovered) {
      currentColor = this.hoverColor;
    }
    
    fill(currentColor[0], currentColor[1], currentColor[2]);
    stroke(0);
    strokeWeight(2);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h, 5);
    
    fill(this.textColor[0], this.textColor[1], this.textColor[2]);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(this.label, this.x, this.y);
    
    rectMode(CORNER);
  }
  
  isMouseOver() {
    if (typeof mouseX === 'undefined' || typeof mouseY === 'undefined') {
      return false;
    }
    return mouseX >= this.x - this.w/2 && mouseX <= this.x + this.w/2 &&
           mouseY >= this.y - this.h/2 && mouseY <= this.y + this.h/2;
  }
  
  setPressed(pressed) {
    this.isPressed = pressed;
  }
}

