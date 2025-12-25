class Slider {
  constructor(label, x, y, w, h, minValue, maxValue, defaultValue) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.currentValue = defaultValue;
    this.isDragging = false;
    
    this.trackColor = [85, 85, 85];
    this.fillColor = [74, 144, 226];
    this.thumbColor = [255, 255, 255];
    this.textColor = [255, 255, 255];
  }
  
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  
  draw() {
    fill(this.textColor[0], this.textColor[1], this.textColor[2]);
    textAlign(LEFT, CENTER);
    textSize(16);
    text(this.label + ": " + this.currentValue, this.x, this.y - 15);
    
    fill(this.trackColor[0], this.trackColor[1], this.trackColor[2]);
    noStroke();
    rect(this.x, this.y, this.w, this.h, 3);
    
    let normalizedValue = map(this.currentValue, this.minValue, this.maxValue, 0, 1);
    let thumbX = this.x + normalizedValue * this.w;
    
    fill(this.fillColor[0], this.fillColor[1], this.fillColor[2]);
    rect(this.x, this.y, thumbX - this.x, this.h, 3);
    
    fill(this.thumbColor[0], this.thumbColor[1], this.thumbColor[2]);
    stroke(0);
    strokeWeight(2);
    ellipse(thumbX, this.y + this.h/2, this.h + 6, this.h + 6);
    noStroke();
  }
  
  isMouseOver() {
    if (typeof mouseX === 'undefined' || typeof mouseY === 'undefined') {
      return false;
    }
    return mouseX >= this.x && mouseX <= this.x + this.w &&
           mouseY >= this.y - 10 && mouseY <= this.y + this.h + 10;
  }
  
  mousePressed() {
    if (this.isMouseOver()) {
      this.isDragging = true;
      this.updateValue();
    }
  }
  
  mouseDragged() {
    if (this.isDragging) {
      this.updateValue();
    }
  }
  
  mouseReleased() {
    this.isDragging = false;
  }
  
  updateValue() {
    if (typeof mouseX === 'undefined' || typeof map === 'undefined') {
      return;
    }
    let mouseXLocal = Math.max(this.x, Math.min(mouseX, this.x + this.w));
    let normalizedValue = map(mouseXLocal, this.x, this.x + this.w, 0, 1);
    this.currentValue = Math.floor(map(normalizedValue, 0, 1, this.minValue, this.maxValue));
    this.currentValue = Math.max(this.minValue, Math.min(this.currentValue, this.maxValue));
  }
  
  getValue() {
    return this.currentValue;
  }
  
  setValue(value) {
    this.currentValue = Math.max(this.minValue, Math.min(value, this.maxValue));
  }
}

