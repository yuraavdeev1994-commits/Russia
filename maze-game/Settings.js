class Settings {
  constructor() {
    this.activeTab = 0;
    
    this.numRays = 320;
    this.fov = Math.PI / 3;
    this.showFPS = false;
    this.resolutionWidth = 800;
    this.resolutionHeight = 600;
    this.renderDistance = 30;
    this.fovDegrees = 60;
    
    this.masterVolume = 1.0;
    this.musicVolume = 0.7;
    this.sfxVolume = 0.8;
    this.soundEnabled = true;
    
    this.mouseSensitivity = 0.003;
    this.walkSpeed = 0.5;
    this.runSpeed = 1.2;
    this.invertMouse = false;
    
    this.mazeWidth = 15;
    this.mazeHeight = 15;
    this.showMap = false;
  }
  
  saveSettings() {
    // Сохранение настроек в localStorage
    localStorage.setItem('mazeGameSettings', JSON.stringify({
      renderDistance: this.renderDistance,
      fovDegrees: this.fovDegrees,
      mazeWidth: this.mazeWidth,
      mazeHeight: this.mazeHeight,
      showMap: this.showMap
    }));
  }
  
  loadSettings() {
    const saved = localStorage.getItem('mazeGameSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      this.renderDistance = settings.renderDistance || 30;
      this.fovDegrees = settings.fovDegrees || 60;
      this.mazeWidth = settings.mazeWidth || 15;
      this.mazeHeight = settings.mazeHeight || 15;
      this.showMap = settings.showMap || false;
      this.fov = this.fovDegrees * Math.PI / 180;
    }
  }
  
  resetGraphicsSettings() {
    this.numRays = 320;
    this.fov = Math.PI / 3; // 60 градусов
    this.showFPS = false;
    this.resolutionWidth = 800;
    this.resolutionHeight = 600;
    this.renderDistance = 30;
    this.fovDegrees = 60;
    this.fov = Math.PI / 3;
  }
  
  resetSoundSettings() {
    this.masterVolume = 1.0;
    this.musicVolume = 0.7;
    this.sfxVolume = 0.8;
    this.soundEnabled = true;
  }
  
  resetControlsSettings() {
    this.mouseSensitivity = 0.003;
    this.walkSpeed = 0.5;
    this.runSpeed = 1.2;
    this.invertMouse = false;
  }
  
  resetGameSettings() {
    this.mazeWidth = 15;
    this.mazeHeight = 15;
    this.showMap = false;
  }
}

