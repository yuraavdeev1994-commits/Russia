class Dropdown {
  constructor(label, x, y, w, h, options, defaultIndex) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.options = options;
    this.selectedIndex = defaultIndex;
    this.isOpen = false;
    
    this.normalColor = [74, 144, 226];
    this.hoverColor = [91, 160, 242];
    this.textColor = [255, 255, 255];
    this.bgColor = [101, 67, 33];
  }
  
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  
  draw() {
    fill(this.textColor[0], this.textColor[1], this.textColor[2]);
    textAlign(LEFT, CENTER);
    textSize(16);
    text(this.label + ":", this.x, this.y - 15);
    
    let currentColor = this.isButtonHovered() ? this.hoverColor : this.normalColor;
    fill(currentColor[0], currentColor[1], currentColor[2]);
    stroke(0);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h, 5);
    
    fill(this.textColor[0], this.textColor[1], this.textColor[2]);
    textAlign(LEFT, CENTER);
    textSize(14);
    text(this.options[this.selectedIndex], this.x + 10, this.y + this.h/2);
    
    fill(this.textColor[0], this.textColor[1], this.textColor[2]);
    triangle(this.x + this.w - 20, this.y + this.h/2 - 5,
             this.x + this.w - 10, this.y + this.h/2 - 5,
             this.x + this.w - 15, this.y + this.h/2 + 5);
    
    if (this.isOpen) {
      fill(this.bgColor[0], this.bgColor[1], this.bgColor[2]);
      stroke(0);
      strokeWeight(2);
      let listHeight = this.h * this.options.length;
      rect(this.x, this.y + this.h, this.w, listHeight, 5);
      
      for (let i = 0; i < this.options.length; i++) {
        let optionY = this.y + this.h + i * this.h;
        
        if (i === this.selectedIndex) {
          fill(this.hoverColor[0], this.hoverColor[1], this.hoverColor[2]);
        } else if (this.isOptionHovered(i)) {
          fill(this.normalColor[0], this.normalColor[1], this.normalColor[2]);
        } else {
          fill(this.bgColor[0], this.bgColor[1], this.bgColor[2]);
        }
        
        stroke(0);
        strokeWeight(1);
        rect(this.x, optionY, this.w, this.h);
        
        fill(this.textColor[0], this.textColor[1], this.textColor[2]);
        textAlign(LEFT, CENTER);
        textSize(14);
        text(this.options[i], this.x + 10, optionY + this.h/2);
      }
      
      noFill();
      stroke(0);
      strokeWeight(2);
      rect(this.x, this.y + this.h, this.w, listHeight, 5);
    }
  }
  
  isButtonHovered() {
    if (typeof mouseX === 'undefined' || typeof mouseY === 'undefined') {
      return false;
    }
    return mouseX >= this.x && mouseX <= this.x + this.w &&
           mouseY >= this.y && mouseY <= this.y + this.h;
  }
  
  isOptionHovered(index) {
    if (!this.isOpen || typeof mouseX === 'undefined' || typeof mouseY === 'undefined') return false;
    return mouseX >= this.x && mouseX <= this.x + this.w &&
           mouseY >= this.y + this.h + index * this.h && mouseY <= this.y + this.h + (index + 1) * this.h;
  }
  
  mousePressed() {
    if (this.isButtonHovered()) {
      this.isOpen = !this.isOpen;
    } else if (this.isOpen) {
      for (let i = 0; i < this.options.length; i++) {
        if (this.isOptionHovered(i)) {
          this.selectedIndex = i;
          this.isOpen = false;
          break;
        }
      }
      if (mouseX < this.x || mouseX > this.x + this.w || 
          mouseY < this.y + this.h || mouseY > this.y + this.h + this.options.length * this.h) {
        this.isOpen = false;
      }
    } else {
      this.isOpen = false;
    }
  }
  
  getSelectedIndex() {
    return this.selectedIndex;
  }
  
  getSelectedValue() {
    return this.options[this.selectedIndex];
  }
  
  setSelectedIndex(index) {
    if (index >= 0 && index < this.options.length) {
      this.selectedIndex = index;
    }
  }
}

