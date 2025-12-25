let tileSize = 40;

let gameState;
let maze;
let player;
let raycaster;
let menu;
let mazeRenderer;
let exit;
let settings;

let bgMenu;
let sfxStep;
let sfxRun;

let numRays = 320;
let fov = Math.PI / 3;

function setup() {
  try {
    console.log('Инициализация игры...');
    
    // Проверяем, что все классы загружены
    if (typeof GameState === 'undefined') {
      throw new Error('GameState не загружен');
    }
    if (typeof Settings === 'undefined') {
      throw new Error('Settings не загружен');
    }
    if (typeof Menu === 'undefined') {
      throw new Error('Menu не загружен');
    }
    if (typeof Maze === 'undefined') {
      throw new Error('Maze не загружен');
    }
    if (typeof Player === 'undefined') {
      throw new Error('Player не загружен');
    }
    if (typeof Exit === 'undefined') {
      throw new Error('Exit не загружен');
    }
    if (typeof Raycaster === 'undefined') {
      throw new Error('Raycaster не загружен');
    }
    
    createCanvas(800, 600);
    console.log('Canvas создан:', width, height);
    
    gameState = new GameState();
    console.log('GameState создан');
    
    settings = new Settings();
    settings.loadSettings();
    console.log('Settings созданы, mazeWidth:', settings.mazeWidth, 'mazeHeight:', settings.mazeHeight);
    
    menu = new Menu();
    console.log('Menu создан');
    
    // Устанавливаем правильное разрешение в dropdown после создания canvas
    let resolutions = ["800x600", "1024x768", "1280x720", "1920x1080"];
    let currentRes = width + "x" + height;
    for (let i = 0; i < resolutions.length; i++) {
      if (resolutions[i] === currentRes) {
        menu.dropdownResolution.setSelectedIndex(i);
        break;
      }
    }
    
    menu.sliderRenderDistance.setValue(settings.renderDistance);
    menu.sliderFOV.setValue(settings.fovDegrees);
    menu.sliderMazeSize.setValue(settings.mazeWidth);
    menu.checkboxShowMap.setChecked(settings.showMap);
    
    raycaster = new Raycaster(numRays, settings.fov);
    console.log('Raycaster создан');
    
    mazeRenderer = new MazeRenderer();
    console.log('MazeRenderer создан');
    
    // Загрузка звуков (опционально, игра работает и без них)
    try {
      bgMenu = loadSound('maze-game/data/Backmenu.mp3', () => {
        if (bgMenu) {
          bgMenu.setLoop(true);
          bgMenu.setVolume(0.5);
        }
      }, () => {
        console.log('Ошибка загрузки фоновой музыки');
      });
      sfxStep = loadSound('maze-game/data/step.mp3', () => {
        if (sfxStep) sfxStep.setVolume(0.3);
      });
      sfxRun = loadSound('maze-game/data/running.mp3', () => {
        if (sfxRun) sfxRun.setVolume(0.3);
      });
    } catch(e) {
      console.log('Звуки не загружены:', e);
    }
    
    generateMaze();
    console.log('Игра инициализирована');
  } catch(e) {
    console.error('Критическая ошибка в setup():', e);
    console.error(e.stack);
  }
}

function draw() {
  try {
    if (typeof width === 'undefined' || typeof height === 'undefined') {
      return; // Canvas еще не создан
    }
    
    if (!gameState || !menu) {
      background(50);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(20);
      text("Загрузка...", width/2, height/2);
      return;
    }
    
    switch(gameState.currentState) {
      case GameState.MENU:
        if (menu && typeof menu.drawMainMenu === 'function') {
          menu.drawMainMenu(tileSize);
        }
        ensureBackgroundMusic();
        break;
      case GameState.LOADING:
        if (menu && typeof menu.drawLoading === 'function') {
          menu.drawLoading();
        }
        ensureBackgroundMusic();
        break;
      case GameState.GAME:
        drawGame();
        break;
      case GameState.SETTINGS:
        if (menu && typeof menu.drawSettings === 'function' && settings) {
          menu.drawSettings(settings);
        }
        ensureBackgroundMusic();
        break;
      case GameState.AUTHORS:
        if (menu && typeof menu.drawAuthors === 'function') {
          menu.drawAuthors();
        }
        ensureBackgroundMusic();
        break;
    }
  } catch(e) {
    console.error('Ошибка в draw():', e);
    console.error('Stack:', e.stack);
    if (typeof width !== 'undefined' && typeof height !== 'undefined') {
      background(255, 0, 0);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(16);
      let errorMsg = e.message || e.toString() || 'Неизвестная ошибка';
      text('Ошибка: ' + errorMsg, width/2, height/2);
      if (e.stack) {
        textSize(12);
        text('Проверьте консоль (F12)', width/2, height/2 + 30);
      }
    } else {
      console.error('Canvas не создан, невозможно отобразить ошибку');
    }
  }
}

function drawGame() {
  if (!player || !maze || !raycaster || !settings) {
    return;
  }
  
  if (raycaster.fov !== settings.fov) {
    raycaster.fov = settings.fov;
  }
  
  ensureBackgroundMusic();
  
  if (maze !== null && maze !== undefined && (maze.width !== settings.mazeWidth || maze.height !== settings.mazeHeight)) {
    generateMaze();
  }
  
  player.update(maze);
  
  if (exit !== null && exit !== undefined && exit.checkCollision(player)) {
    generateMaze();
  }
  
  raycaster.render(player, maze, exit, settings.renderDistance);
  
  if (settings.showMap && menu) {
    menu.drawMap(maze, player, exit);
  }
  
  if (menu) {
    menu.drawUI(settings.showMap, tileSize);
  }
}

function generateMaze() {
  try {
    if (!settings) {
      console.error('Settings не определен при генерации лабиринта');
      return;
    }
    maze = new Maze(tileSize, settings.mazeWidth, settings.mazeHeight);
    
    let startPos = maze.getStartPosition();
    let startX = startPos[0] * tileSize + tileSize / 2.0;
    let startY = startPos[1] * tileSize + tileSize / 2.0;
    
    let attempts = 0;
    while (maze.checkCollision(startX, startY) && attempts < 100) {
      startX += 5;
      startY += 5;
      attempts++;
    }
    
    if (player === null || player === undefined) {
      player = new Player(startX, startY);
    } else {
      player.reset(startX, startY);
    }
    
    let exitPos = maze.getExitPosition();
    exit = new Exit(exitPos.x, exitPos.y, tileSize * 0.4);
  } catch(e) {
    console.error('Ошибка генерации лабиринта:', e);
  }
}

function mousePressed() {
  if (gameState.isMenu()) {
    if (menu.btnPlay.isMouseOver()) {
      gameState.setState(GameState.LOADING);
      setTimeout(() => {
        generateMaze();
        gameState.setState(GameState.GAME);
        if (bgMenu) bgMenu.stop();
        stopMovementSounds();
      }, 500);
    } else if (menu.btnSettings.isMouseOver()) {
      gameState.setState(GameState.SETTINGS);
    } else if (menu.btnAuthors.isMouseOver()) {
      gameState.setState(GameState.AUTHORS);
    } else if (menu.btnExit.isMouseOver()) {
      window.location.href = 'index.html';
    }
  } else if (gameState.isSettings() || gameState.isAuthors()) {
    if (menu.btnBack.isMouseOver()) {
      gameState.setState(GameState.MENU);
      if (bgMenu && (!bgMenu.isPlaying || !bgMenu.isPlaying())) {
        bgMenu.play();
      }
      stopMovementSounds();
      settings.saveSettings();
    }
    if (gameState.isSettings()) {
      if (menu.btnTabGame.isMouseOver()) {
        settings.activeTab = 0;
      } else if (menu.btnTabGraphics.isMouseOver()) {
        settings.activeTab = 1;
      } else if (menu.btnTabSound.isMouseOver()) {
        settings.activeTab = 2;
      } else if (menu.btnTabControls.isMouseOver()) {
        settings.activeTab = 3;
      }
      
      if (menu.btnReset.isMouseOver()) {
        switch(settings.activeTab) {
          case 0:
            menu.resetGameSettings(settings);
            break;
          case 1:
            menu.resetGraphicsSettings(settings);
            break;
          case 2:
            menu.resetSoundSettings(settings);
            break;
          case 3:
            menu.resetControlsSettings(settings);
            break;
        }
      }
      
      if (settings.activeTab === 0) {
        if (menu.sliderMazeSize.isMouseOver()) {
          menu.sliderMazeSize.mousePressed();
        }
        let wasChecked = menu.checkboxShowMap.isChecked();
        menu.checkboxShowMap.mousePressed();
        if (menu.checkboxShowMap.isChecked() !== wasChecked) {
          menu.updateGameSettings(settings);
        }
      }
      
      if (settings.activeTab === 1) {
        menu.dropdownResolution.mousePressed();
        menu.sliderRenderDistance.mousePressed();
        menu.sliderFOV.mousePressed();
      }
    }
  }
}

function mouseDragged() {
  if (gameState.isSettings()) {
    if (settings.activeTab === 0) {
      if (menu.sliderMazeSize.isDragging) {
        menu.sliderMazeSize.mouseDragged();
      }
    } else if (settings.activeTab === 1) {
      menu.sliderRenderDistance.mouseDragged();
      menu.sliderFOV.mouseDragged();
    }
  }
}

function mouseReleased() {
  if (gameState.isSettings()) {
    if (settings.activeTab === 0) {
      menu.sliderMazeSize.mouseReleased();
    } else if (settings.activeTab === 1) {
      menu.sliderRenderDistance.mouseReleased();
      menu.sliderFOV.mouseReleased();
    }
  }
}

function keyPressed() {
  if (gameState.isMenu()) {
    if (key === ' ') {
      gameState.setState(GameState.LOADING);
      setTimeout(() => {
        generateMaze();
        gameState.setState(GameState.GAME);
      }, 500);
    }
  } else if (gameState.isSettings() || gameState.isAuthors()) {
    if (keyCode === ESCAPE) {
      gameState.setState(GameState.MENU);
      return false;
    }
  } else if (gameState.isGame()) {
    if (keyCode === ESCAPE || key === 'r' || key === 'R') {
      gameState.setState(GameState.MENU);
      if (bgMenu && (!bgMenu.isPlaying || !bgMenu.isPlaying())) {
        bgMenu.play();
      }
      stopMovementSounds();
      return false;
    }
    
    if (player !== null && player !== undefined) {
      // Обработка стрелок и Shift
      if (keyCode === LEFT_ARROW) {
        player.keyRotateLeft = true;
        updateMovementSounds();
      } else if (keyCode === RIGHT_ARROW) {
        player.keyRotateRight = true;
        updateMovementSounds();
      } else if (keyCode === SHIFT) {
        player.isRunning = true;
        updateMovementSounds();
      }
      
      // Обработка WASD и ЦФЫВ
      if (key === 'w' || key === 'W' || key === 'ц' || key === 'Ц') {
        player.keyUp = true;
        updateMovementSounds();
      } else if (key === 's' || key === 'S' || key === 'ы' || key === 'Ы') {
        player.keyDown = true;
        updateMovementSounds();
      } else if (key === 'a' || key === 'A' || key === 'ф' || key === 'Ф') {
        player.keyLeft = true;
        updateMovementSounds();
      } else if (key === 'd' || key === 'D' || key === 'в' || key === 'В') {
        player.keyRight = true;
        updateMovementSounds();
      }
    }
  }
}

function keyReleased() {
  if (player !== null && player !== undefined) {
    // Обработка стрелок и Shift
    if (keyCode === LEFT_ARROW) {
      player.keyRotateLeft = false;
      updateMovementSounds();
    } else if (keyCode === RIGHT_ARROW) {
      player.keyRotateRight = false;
      updateMovementSounds();
    } else if (keyCode === SHIFT) {
      player.isRunning = false;
      updateMovementSounds();
    }
    
    // Обработка WASD и ЦФЫВ
    if (key === 'w' || key === 'W' || key === 'ц' || key === 'Ц') {
      player.keyUp = false;
      updateMovementSounds();
    } else if (key === 's' || key === 'S' || key === 'ы' || key === 'Ы') {
      player.keyDown = false;
      updateMovementSounds();
    } else if (key === 'a' || key === 'A' || key === 'ф' || key === 'Ф') {
      player.keyLeft = false;
      updateMovementSounds();
    } else if (key === 'd' || key === 'D' || key === 'в' || key === 'В') {
      player.keyRight = false;
      updateMovementSounds();
    }
  }
}

function ensureBackgroundMusic() {
  if (!gameState) return;
  
  try {
    if (gameState.isGame()) {
      if (bgMenu && bgMenu.isPlaying && typeof bgMenu.isPlaying === 'function' && bgMenu.isPlaying()) {
        bgMenu.stop();
      }
    } else {
      if (bgMenu) {
        if (!bgMenu.isPlaying || (typeof bgMenu.isPlaying === 'function' && !bgMenu.isPlaying())) {
          bgMenu.play();
        }
      }
      stopMovementSounds();
    }
  } catch(e) {
    console.log('Ошибка в ensureBackgroundMusic:', e);
  }
}

function stopMovementSounds() {
  try {
    if (sfxStep && sfxStep.isPlaying && typeof sfxStep.isPlaying === 'function' && sfxStep.isPlaying()) {
      sfxStep.stop();
    }
    if (sfxRun && sfxRun.isPlaying && typeof sfxRun.isPlaying === 'function' && sfxRun.isPlaying()) {
      sfxRun.stop();
    }
  } catch(e) {
    console.log('Ошибка в stopMovementSounds:', e);
  }
}

function updateMovementSounds() {
  try {
    if (player === null || player === undefined) {
      stopMovementSounds();
      return;
    }
    let moving = player.keyUp || player.keyDown || player.keyLeft || player.keyRight;
    let running = moving && player.isRunning;
    
    if (running) {
      if (sfxStep && sfxStep.isPlaying && typeof sfxStep.isPlaying === 'function' && sfxStep.isPlaying()) {
        sfxStep.stop();
      }
      if (sfxRun && (!sfxRun.isPlaying || (typeof sfxRun.isPlaying === 'function' && !sfxRun.isPlaying()))) {
        if (sfxRun.setLoop) sfxRun.setLoop(true);
        sfxRun.play();
      }
    } else if (moving) {
      if (sfxRun && sfxRun.isPlaying && typeof sfxRun.isPlaying === 'function' && sfxRun.isPlaying()) {
        sfxRun.stop();
      }
      if (sfxStep && (!sfxStep.isPlaying || (typeof sfxStep.isPlaying === 'function' && !sfxStep.isPlaying()))) {
        if (sfxStep.setLoop) sfxStep.setLoop(true);
        sfxStep.play();
      }
    } else {
      stopMovementSounds();
    }
  } catch(e) {
    console.log('Ошибка в updateMovementSounds:', e);
  }
}

