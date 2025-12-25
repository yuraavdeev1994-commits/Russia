class Checkbox {
  constructor(label, x, y, size, defaultValue) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.size = size;
    this.checked = defaultValue;
    
    this.boxColor = [74, 144, 226];
    this.checkedColor = [91, 160, 242];
    this.textColor = [255, 255, 255];
    this.borderColor = [0, 0, 0];
  }
  
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  
  draw() {
    textSize(16);
    textAlign(LEFT, CENTER);
    fill(this.textColor[0], this.textColor[1], this.textColor[2]);
    text(this.label + ":", this.x, this.y);
    
    let textW = textWidth(this.label + ": ");
    let boxX = this.x + textW + 10;
    let boxY = this.y - this.size/2;
    
    if (this.checked) {
      fill(this.checkedColor[0], this.checkedColor[1], this.checkedColor[2]);
    } else {
      fill(this.boxColor[0], this.boxColor[1], this.boxColor[2]);
    }
    stroke(this.borderColor[0], this.borderColor[1], this.borderColor[2]);
    strokeWeight(2);
    rect(boxX, boxY, this.size, this.size, 3);
    
    if (this.checked) {
      stroke(this.textColor[0], this.textColor[1], this.textColor[2]);
      strokeWeight(3);
      line(boxX + 4, boxY + this.size/2, boxX + this.size/2, boxY + this.size - 4);
      line(boxX + this.size/2, boxY + this.size - 4, boxX + this.size - 4, boxY + 4);
      noStroke();
    }
  }
  
  isMouseOver() {
    if (typeof mouseX === 'undefined' || typeof mouseY === 'undefined' || typeof textWidth === 'undefined') {
      return false;
    }
    
    textSize(16);
    textAlign(LEFT, CENTER);
    let textW = textWidth(this.label + ": ");
    let boxX = this.x + textW + 10;
    let boxY = this.y - this.size/2;
    
    let overBox = mouseX >= boxX && mouseX <= boxX + this.size &&
                  mouseY >= boxY && mouseY <= boxY + this.size;
    
    let overText = mouseX >= this.x && mouseX <= this.x + textW + 10 + this.size &&
                   mouseY >= this.y - this.size/2 && mouseY <= this.y + this.size/2;
    
    return overBox || overText;
  }
  
  mousePressed() {
    if (this.isMouseOver()) {
      this.checked = !this.checked;
    }
  }
  
  isChecked() {
    return this.checked;
  }
  
  setChecked(value) {
    this.checked = value;
  }
}

