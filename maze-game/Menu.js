class Menu {
  constructor() {
    this.buttonWidth = 200;
    this.buttonHeight = 50;
    this.buttonSpacing = 15;
    this.startY = 250;
    
    this.tabWidth = 150;
    this.tabHeight = 40;
    this.tabSpacing = 10;
    this.tabStartY = 50;
    
    this.sliderWidth = 400;
    this.sliderHeight = 20;
    this.elementSpacing = 60;
    
    this.btnPlay = new Button("Играть", 0, 0, this.buttonWidth, this.buttonHeight);
    this.btnSettings = new Button("Настройки", 0, 0, this.buttonWidth, this.buttonHeight);
    this.btnAuthors = new Button("Авторы", 0, 0, this.buttonWidth, this.buttonHeight);
    this.btnExit = new Button("Выход", 0, 0, this.buttonWidth, this.buttonHeight);
    this.btnBack = new Button("Назад", 0, 0, this.buttonWidth, this.buttonHeight);
    
    this.btnTabGraphics = new Button("Графика", 0, 0, this.tabWidth, this.tabHeight);
    this.btnTabSound = new Button("Звук", 0, 0, this.tabWidth, this.tabHeight);
    this.btnTabControls = new Button("Управление", 0, 0, this.tabWidth, this.tabHeight);
    this.btnTabGame = new Button("Игра", 0, 0, this.tabWidth, this.tabHeight);
    
    this.btnReset = new Button("Сброс", 0, 0, 120, 35);
    
    let resolutions = ["800x600", "1024x768", "1280x720", "1920x1080"];
    let currentResIndex = 0;
    this.dropdownResolution = new Dropdown("Разрешение экрана", 0, 0, this.sliderWidth, 35, resolutions, currentResIndex);
    this.sliderRenderDistance = new Slider("Дальность прорисовки", 0, 0, this.sliderWidth, this.sliderHeight, 10, 100, 30);
    this.sliderFOV = new Slider("Поле зрения (FOV)", 0, 0, this.sliderWidth, this.sliderHeight, 45, 120, 60);
    
    this.sliderMazeSize = new Slider("Размер лабиринта", 0, 0, this.sliderWidth, this.sliderHeight, 10, 30, 15);
    this.checkboxShowMap = new Checkbox("Показывать мини-карту", 0, 0, 20, false);
  }
  
  drawMainMenu(tileSize) {
    if (typeof width === 'undefined' || typeof height === 'undefined') {
      return;
    }
    
    try {
      background(135, 206, 235);
      
      if (this.btnPlay) this.btnPlay.setPosition(width/2, this.startY);
      if (this.btnSettings) this.btnSettings.setPosition(width/2, this.startY + this.buttonHeight + this.buttonSpacing);
      if (this.btnAuthors) this.btnAuthors.setPosition(width/2, this.startY + (this.buttonHeight + this.buttonSpacing) * 2);
      if (this.btnExit) this.btnExit.setPosition(width/2, this.startY + (this.buttonHeight + this.buttonSpacing) * 3);
      
      fill(255, 0, 0);
      textAlign(CENTER, CENTER);
      textSize(48);
      text("MAZE GAME 3D", width/2, 100);
      
      if (this.btnPlay) this.btnPlay.draw();
      if (this.btnSettings) this.btnSettings.draw();
      if (this.btnAuthors) this.btnAuthors.draw();
      if (this.btnExit) this.btnExit.draw();
    } catch(e) {
      console.error('Ошибка в drawMainMenu:', e);
    }
  }
  
  drawSettings(settings) {
    if (typeof width === 'undefined' || typeof height === 'undefined') {
      return;
    }
    
    if (!settings) {
      console.error('Settings не передан в drawSettings');
      return;
    }
    
    try {
      background(101, 67, 33);
      
      if (this.btnBack) this.btnBack.setPosition(width/2, height - 80);
      
      this.drawSettingsTabs(settings);
      
      let contentY = this.tabStartY + this.tabHeight + 30;
      switch(settings.activeTab) {
        case 0:
          this.drawGameSettings(settings, contentY);
          break;
        case 1:
          this.drawGraphicsSettings(settings, contentY);
          break;
        case 2:
          this.drawSoundSettings(settings, contentY);
          break;
        case 3:
          this.drawControlsSettings(settings, contentY);
          break;
      }
      
      if (this.btnBack) this.btnBack.draw();
    } catch(e) {
      console.error('Ошибка в drawSettings:', e);
    }
  }
  
  drawSettingsTabs(settings) {
    if (typeof width === 'undefined') {
      return;
    }
    
    if (!settings) {
      return;
    }
    
    try {
      let totalTabsWidth = this.tabWidth * 4 + this.tabSpacing * 3;
      let tabsStartX = (width - totalTabsWidth) / 2;
      
      if (this.btnTabGame) this.btnTabGame.setPosition(tabsStartX + this.tabWidth/2, this.tabStartY);
      if (this.btnTabGraphics) this.btnTabGraphics.setPosition(tabsStartX + this.tabWidth + this.tabSpacing + this.tabWidth/2, this.tabStartY);
      if (this.btnTabSound) this.btnTabSound.setPosition(tabsStartX + this.tabWidth * 2 + this.tabSpacing * 2 + this.tabWidth/2, this.tabStartY);
      if (this.btnTabControls) this.btnTabControls.setPosition(tabsStartX + this.tabWidth * 3 + this.tabSpacing * 3 + this.tabWidth/2, this.tabStartY);
      
      if (settings.activeTab === 0) {
        if (this.btnTabGame) {
          this.btnTabGame.normalColor = [91, 160, 242];
          this.btnTabGame.draw();
        }
      } else {
        if (this.btnTabGame) {
          this.btnTabGame.normalColor = [74, 144, 226];
          this.btnTabGame.draw();
        }
      }
      
      if (settings.activeTab === 1) {
        if (this.btnTabGraphics) {
          this.btnTabGraphics.normalColor = [91, 160, 242];
          this.btnTabGraphics.draw();
        }
      } else {
        if (this.btnTabGraphics) {
          this.btnTabGraphics.normalColor = [74, 144, 226];
          this.btnTabGraphics.draw();
        }
      }
      
      if (settings.activeTab === 2) {
        if (this.btnTabSound) {
          this.btnTabSound.normalColor = [91, 160, 242];
          this.btnTabSound.draw();
        }
      } else {
        if (this.btnTabSound) {
          this.btnTabSound.normalColor = [74, 144, 226];
          this.btnTabSound.draw();
        }
      }
      
      if (settings.activeTab === 3) {
        if (this.btnTabControls) {
          this.btnTabControls.normalColor = [91, 160, 242];
          this.btnTabControls.draw();
        }
      } else {
        if (this.btnTabControls) {
          this.btnTabControls.normalColor = [74, 144, 226];
          this.btnTabControls.draw();
        }
      }
    } catch(e) {
      console.error('Ошибка в drawSettingsTabs:', e);
    }
  }
  
  drawGraphicsSettings(settings, startY) {
    if (typeof width === 'undefined') {
      return;
    }
    
    let leftMargin = (width - this.sliderWidth) / 2;
    let y = startY;
    
    this.dropdownResolution.setPosition(leftMargin, y);
    y += this.elementSpacing;
    
    this.sliderRenderDistance.setPosition(leftMargin, y);
    y += this.elementSpacing;
    
    this.sliderFOV.setPosition(leftMargin, y);
    y += this.elementSpacing + 20;
    
    this.btnReset.setPosition(leftMargin + this.sliderWidth - 60, y);
    
    this.sliderRenderDistance.draw();
    this.sliderFOV.draw();
    this.dropdownResolution.draw();
    this.btnReset.draw();
    
    this.updateGraphicsSettings(settings);
  }
  
  updateGraphicsSettings(settings) {
    if (typeof resizeCanvas === 'undefined') {
      return;
    }
    
    let resolution = this.dropdownResolution.getSelectedValue();
    let parts = resolution.split("x");
    if (parts.length === 2) {
      let newWidth = parseInt(parts[0]);
      let newHeight = parseInt(parts[1]);
      
      if (settings.resolutionWidth !== newWidth || settings.resolutionHeight !== newHeight) {
        settings.resolutionWidth = newWidth;
        settings.resolutionHeight = newHeight;
        resizeCanvas(settings.resolutionWidth, settings.resolutionHeight);
      }
    }
    
    settings.renderDistance = this.sliderRenderDistance.getValue();
    settings.fovDegrees = this.sliderFOV.getValue();
    settings.fov = settings.fovDegrees * Math.PI / 180;
  }
  
  drawSoundSettings(settings, startY) {
    textAlign(LEFT, TOP);
    textSize(18);
    fill(255);
    
    let y = startY;
    let lineHeight = 30;
    let leftMargin = 50;
    
    text("Настройки звука:", leftMargin, y);
    y += lineHeight * 1.5;
    
    text("Звук включен: " + (settings.soundEnabled ? "Да" : "Нет"), leftMargin, y);
    y += lineHeight;
    
    text("Общая громкость: " + Math.floor(settings.masterVolume * 100) + "%", leftMargin, y);
    y += lineHeight;
    
    text("Громкость музыки: " + Math.floor(settings.musicVolume * 100) + "%", leftMargin, y);
    y += lineHeight;
    
    text("Громкость эффектов: " + Math.floor(settings.sfxVolume * 100) + "%", leftMargin, y);
    y += lineHeight * 1.5;
    
    textSize(14);
    fill(200);
    text("(Настройки звука будут доступны для изменения в будущих версиях)", leftMargin, y);
    y += lineHeight * 2;
    
    this.btnReset.setPosition(leftMargin, y);
    this.btnReset.draw();
  }
  
  drawControlsSettings(settings, startY) {
    textAlign(LEFT, TOP);
    textSize(18);
    fill(255);
    
    let y = startY;
    let lineHeight = 30;
    let leftMargin = 50;
    
    text("Настройки управления:", leftMargin, y);
    y += lineHeight * 1.5;
    
    text("Чувствительность мыши: " + settings.mouseSensitivity.toFixed(3), leftMargin, y);
    y += lineHeight;
    
    text("Скорость ходьбы: " + settings.walkSpeed.toFixed(1), leftMargin, y);
    y += lineHeight;
    
    text("Скорость бега: " + settings.runSpeed.toFixed(1), leftMargin, y);
    y += lineHeight;
    
    text("Инвертировать мышь: " + (settings.invertMouse ? "Да" : "Нет"), leftMargin, y);
    y += lineHeight * 1.5;
    
    textSize(16);
    fill(255);
    text("Управление:", leftMargin, y);
    y += lineHeight;
    
    textSize(14);
    fill(200);
    text("WASD / ЦФЫВ - движение", leftMargin, y);
    y += lineHeight - 5;
    text("Стрелки - поворот", leftMargin, y);
    y += lineHeight - 5;
    text("Shift - бег", leftMargin, y);
    y += lineHeight - 5;
    text("ESC - вернуться в меню", leftMargin, y);
    y += lineHeight * 1.5;
    
    textSize(14);
    fill(200);
    text("(Настройки управления будут доступны для изменения в будущих версиях)", leftMargin, y);
    y += lineHeight * 2;
    
    this.btnReset.setPosition(leftMargin, y);
    this.btnReset.draw();
  }
  
  drawGameSettings(settings, startY) {
    if (typeof width === 'undefined') {
      return;
    }
    
    let leftMargin = (width - this.sliderWidth) / 2;
    let y = startY;
    
    this.sliderMazeSize.setPosition(leftMargin, y);
    this.sliderMazeSize.draw();
    y += this.elementSpacing;
    
    this.checkboxShowMap.setPosition(leftMargin, y);
    this.checkboxShowMap.draw();
    y += this.elementSpacing + 20;
    
    this.btnReset.setPosition(leftMargin + this.sliderWidth - 60, y);
    this.btnReset.draw();
    
    this.updateGameSettings(settings);
  }
  
  updateGameSettings(settings) {
    let mazeSize = this.sliderMazeSize.getValue();
    settings.mazeWidth = mazeSize;
    settings.mazeHeight = mazeSize;
    settings.showMap = this.checkboxShowMap.isChecked();
  }
  
  resetGameSettings(settings) {
    settings.resetGameSettings();
    this.sliderMazeSize.setValue(settings.mazeWidth);
    this.checkboxShowMap.setChecked(settings.showMap);
  }
  
  drawAuthors() {
    if (typeof width === 'undefined' || typeof height === 'undefined') {
      return;
    }
    
    try {
      background(44, 62, 80);
      
      if (this.btnBack) this.btnBack.setPosition(width/2, height - 80);
      
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(36);
      text("Авторы", width/2, 80);
      
      textSize(20);
      fill(255);
      textAlign(CENTER, CENTER);
      text("Maze Game 3D", width/2, 200);
      textSize(16);
      text("3D лабиринт с процедурной генерацией", width/2, 240);
      text("Исследуйте случайно сгенерированные лабиринты", width/2, 270);
      text("и найдите выход!", width/2, 300);
      textSize(14);
      fill(200);
      text("Версия 1.0", width/2, 350);
      text("Разработано на p5.js", width/2, 380);
      
      if (this.btnBack) this.btnBack.draw();
    } catch(e) {
      console.error('Ошибка в drawAuthors:', e);
    }
  }
  
  drawLoading() {
    if (typeof width === 'undefined' || typeof height === 'undefined') {
      return;
    }
    
    try {
      background(101, 67, 33);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(32);
      text("Генерация лабиринта...", width/2, height/2);
    } catch(e) {
      console.error('Ошибка в drawLoading:', e);
    }
  }
  
  drawUI(showMap, tileSize) {
  }
  
  drawMap(maze, player, exit) {
    if (typeof width === 'undefined' || !maze || !player) {
      return;
    }
    
    let mapSize = 150;
    let mapX = width - mapSize - 10;
    let mapY = 10;
    
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(mapX, mapY, mapSize, mapSize);
    
    let scale = mapSize / (maze.width * maze.tileSize);
    
    for (let x = 0; x < maze.width; x++) {
      for (let y = 0; y < maze.height; y++) {
        if (maze.cells[x][y]) {
          fill(0);
        } else {
          fill(255);
        }
        noStroke();
        rect(mapX + x * maze.tileSize * scale, mapY + y * maze.tileSize * scale, 
             maze.tileSize * scale, maze.tileSize * scale);
      }
    }
    
    if (exit != null) {
      fill(255, 0, 0);
      noStroke();
      let exitX = mapX + exit.x * scale;
      let exitY = mapY + exit.y * scale;
      let exitSize = exit.radius * 2 * scale;
      ellipse(exitX, exitY, exitSize, exitSize);
    }
    
    fill(0, 0, 255);
    noStroke();
    let px = mapX + player.x * scale;
    let py = mapY + player.y * scale;
    ellipse(px, py, 8, 8);
  }
  
  resetGraphicsSettings(settings) {
    settings.resetGraphicsSettings();
    
    let resolutions = ["800x600", "1024x768", "1280x720", "1920x1080"];
    let currentResIndex = 0;
    let currentRes = settings.resolutionWidth + "x" + settings.resolutionHeight;
    for (let i = 0; i < resolutions.length; i++) {
      if (resolutions[i] === currentRes) {
        currentResIndex = i;
        break;
      }
    }
    this.dropdownResolution.setSelectedIndex(currentResIndex);
    this.sliderRenderDistance.setValue(settings.renderDistance);
    this.sliderFOV.setValue(settings.fovDegrees);
    
    if (typeof resizeCanvas !== 'undefined') {
      resizeCanvas(settings.resolutionWidth, settings.resolutionHeight);
    }
  }
  
  resetSoundSettings(settings) {
    settings.resetSoundSettings();
  }
  
  resetControlsSettings(settings) {
    settings.resetControlsSettings();
  }
}

