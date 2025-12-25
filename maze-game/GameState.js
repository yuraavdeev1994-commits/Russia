class GameState {
  static MENU = 0;
  static LOADING = 1;
  static GAME = 2;
  static SETTINGS = 3;
  static AUTHORS = 4;
  
  constructor() {
    this.currentState = GameState.MENU;
  }
  
  setState(state) {
    this.currentState = state;
  }
  
  isMenu() {
    return this.currentState === GameState.MENU;
  }
  
  isLoading() {
    return this.currentState === GameState.LOADING;
  }
  
  isGame() {
    return this.currentState === GameState.GAME;
  }
  
  isSettings() {
    return this.currentState === GameState.SETTINGS;
  }
  
  isAuthors() {
    return this.currentState === GameState.AUTHORS;
  }
}

