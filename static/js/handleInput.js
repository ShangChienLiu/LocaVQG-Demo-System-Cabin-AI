class HandleInput {
  constructor() {
    const fullScreenBtn = document.getElementById('fullScreenBtn');
    fullScreenBtn.addEventListener('click', (event) => HandleInput.toggleFullScreen(event));
    const pauseButton = document.querySelector('#pauseBtn');
    pauseButton.addEventListener('click', (event) => this.pause(event));
    const muteButton = document.querySelector('#muteBtn');
    muteButton.addEventListener('click', (event) => this.mute(event));
    window.addEventListener('keydown', (event) => this.handler(event));
    window.addEventListener('keyup', (event) => this.handler(event));
    window.addEventListener('keypress', (event) => this.handler(event));

    this.map = {};
    this.mapPress = {enter: false };
  }

  /**
   *
   * @param {KeyboardEvent} event
   */
  handler(event) {
    const key = event.key.toLowerCase();
    
    if (event.type === 'keypress') {
        if (!event.repeat) {
            this.mapPress[key] = !this.mapPress[key];
        }
    } else if (event.type === 'keyup' || event.type === 'keydown') {
        if (!event.repeat || event.type === 'keyup') {
            this.map[key] = event.type === 'keydown';
        }
    }
}

  isKeyDown(key) {
    return Boolean(this.map[key.toLowerCase()]);
  }

  static toggleFullScreen() {
    const gameContainer = document.documentElement;
    if (!document.fullscreenElement) {
      gameContainer.requestFullscreen().catch((err) => {
        alert(`Error, can't enable full-screen ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
}

export default HandleInput;
