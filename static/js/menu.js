import {
  handleInput,
  toggleMusic
} from './util.js';

class Menu {
  constructor(width, height) {
    this.showMenu = 0;
    this.height = height;
    this.state = 'title';
    this.width = width;
    this.menuY = 0;
    this.menuX = 1;
    this.menuPhrase = {
      0: '音量大小',
      1: '選擇場景',
      2: '遊戲開始'
    };
    this.menu = {
      0: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      1: ['城市', '太空'],
      2: [""]
    };
    this.selectedOptions = {
      0: '5',
      1: '城市',
      2: ''
    };
    this.arrowUpBlink = 0;
    this.arrowDownBlink = 0;
    this.menuTitle = { pos: 0, direction: 1 };
    this.lastOperationTime = null;
    this.operationInterval = 30;
    this.lastStarfieldDraw = 0;  // 初始化為0，表示從未繪製過
    this.refrashStarInterval = 1000;
    this.setRandomStarfieldInterval(); // 初始設定隨機間隔
  }

  reset() {
    this.showMenu = 0;
    this.state = 'title';
    this.menuY = 0;
    this.menuX = 1;
    // this.updateTime = 0.10;
    // this.updateAnimationsTime = 20 / 120;
    this.menuPhrase = {
      0: '音量大小',
      1: '選擇場景',
      2: '遊戲開始'
    };
    this.menu = {
      0: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      1: ['城市', '太空'],
      2: ['']
    };
    this.selectedOptions = {
      0: '5',
      1: '城市',
      2: ''
    };
    this.arrowUpBlink = 0;
    this.arrowDownBlink = 0;
    this.menuTitle = { pos: 0, direction: 1 };
    // this.animations = this.animations;
    this.lastOperationTime = null; 
    this.operationInterval = 30; 
    this.refrashStarInterval = 1000;
  }
  
  update() {
    const {
        arrowup, arrowdown, arrowleft, arrowright,
    } = handleInput.map;
    const maxX = Object.keys(this.menu).length - 1;
    const maxY = this.menu[this.menuX].length - 1;
    const lastMenuOption = Object.keys(this.menu).length - 1;

    if (handleInput.mapPress.enter && !this.showMenu) {
        toggleMusic('event', 'musicOn');
        this.showMenu = 1;
        this.menuTitle.pos = 0;
        handleInput.mapPress.enter = false;
    }

    if (this.showMenu) {
        const now = Date.now();
        if (!this.lastOperationTime || now - this.lastOperationTime >= this.operationInterval) {
            this.lastOperationTime = now; 

            if (arrowdown && !this.arrowDownProcessed) {
                this.arrowDownProcessed = true; 
                this.arrowDownBlink = !this.arrowDownBlink;
                this.menuX = (this.menuX < maxX) ? this.menuX + 1 : 0;
                this.menuY = this.menu[this.menuX].findIndex((item) => item === this.selectedOptions[this.menuX]);
            } else if (!arrowdown) {
                this.arrowDownProcessed = false; 
            }

            if (arrowup && !this.arrowUpProcessed) {
                this.arrowUpProcessed = true; 
                this.arrowUpBlink = 1;
                this.menuX = (this.menuX > 0) ? this.menuX - 1 : maxX;
                this.menuY = this.menu[this.menuX].findIndex((item) => item === this.selectedOptions[this.menuX]);
            } else if (!arrowup) {
                this.arrowUpProcessed = false; 
            }

            if (arrowright && !this.arrowRightProcessed) {
                this.arrowRightProcessed = true;
                this.menuY = (this.menuY < maxY) ? this.menuY + 1 : 0;
            } else if (!arrowright) {
                this.arrowRightProcessed = false;
            }

            if (arrowleft && !this.arrowLeftProcessed) {
                this.arrowLeftProcessed = true;
                this.menuY = (this.menuY > 0) ? this.menuY - 1 : maxY;
            } else if (!arrowleft) {
                this.arrowLeftProcessed = false;
            }

            if (this.menuX !== lastMenuOption) {
                this.selectedOptions[this.menuX] = this.menu[this.menuX][this.menuY];
                handleInput.mapPress.enter = false;
            }
        }

        if (handleInput.mapPress.enter && this.menuX === lastMenuOption) {
            if(this.selectedOptions[1] === '城市'){
                this.state = '城市';
                this.play = true;
            }
            else if(this.selectedOptions[1] === '太空'){
                this.state = '太空';
                this.play = true;      
            }
            handleInput.mapPress.enter = false;
        }
    }
}


  setRandomStarfieldInterval() {
    this.starfieldInterval = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;  // 生成100到2000之間的隨機數
  }

  renderBackground(render){
    const now = Date.now();
    const canvasWidth = 3840;
    const canvasHeight = 2160;

    // 繪製半透明的黑色矩形，使星星逐漸變暗
    render.renderingContext.fillStyle = 'rgba(0,0,0,0.05)';  // 最後一個數字是透明度，您可以調整它
    render.renderingContext.fillRect(0, 0, canvasWidth, canvasHeight);

    if (now - this.lastStarfieldDraw >= this.starfieldInterval) {
      render.drawStarfield();
      this.lastStarfieldDraw = now;
      this.setRandomStarfieldInterval();  // 畫完星星後設定下一次的隨機間隔
    }
    if (now - this.lastStarfieldDraw >= this.refrashStarInterval) {
      this.lastStarfieldDraw = now;
      render.renderingContext.clearRect(0, 0, canvasWidth, canvasHeight);
    }
  }

  renderSelection(render) {
    const canvasWidth = 3840;
    const canvasHeight = 2160;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const scaleX = canvasWidth / 640;
    const scaleY = canvasHeight / 360;

    render.renderingContext.clearRect(0, 0, canvasWidth, canvasHeight);

    render.drawText('#FFFFFF', 'Cabin AI', centerX, canvasHeight * 0.11, 3 * scaleX, 'RaceSport');
  
    if (!this.showMenu) {
      if (this.menuTitle.pos >= 12) this.menuTitle.direction = -1;
      if (this.menuTitle.pos <= -12) this.menuTitle.direction = 1;
      this.menuTitle.pos += (this.menuTitle.direction / 2);
      
      render.drawText('#FFFFFF', '跨世代的智慧座艙AI解決方案', centerX, centerY, 2 * scaleX);
      render.drawText('#FFFFFF', 'Press B/A 🔴', centerX, centerY + 50 * scaleY, 1 * scaleX);
    }
  
    if (this.showMenu) {
      if (this.menuTitle.pos >= 4) this.menuTitle.direction = -1;
      if (this.menuTitle.pos <= -4) this.menuTitle.direction = 1;
      this.menuTitle.pos += (this.menuTitle.direction / 2);
      const maxX = Object.keys(this.menu).length - 1;
      const menuLow = this.menuX - 1 >= 0 ? this.menuX - 1 : maxX;
      const menuHigh = this.menuX + 1 <= maxX ? this.menuX + 1 : 0;
      const lowText = `${this.menuPhrase[menuLow]} ${this.selectedOptions[menuLow]}`;
      const highText = `${this.menuPhrase[menuHigh]} ${this.selectedOptions[menuHigh]}`;
  
      render.roundRect('rgb(26, 27, 103, 0.9)', canvasWidth * 0.15, canvasHeight * 0.25, canvasWidth * 0.7, canvasHeight * 0.47, 20 * scaleX, true, false);
      const phrase = `${this.menuPhrase[this.menuX]} ${this.menu[this.menuX][this.menuY]}`;
      render.drawText('#FFFFFF', highText, centerX, centerY + 55 * scaleY, 1.6 * scaleX);
      render.drawText('rgb(206, 62, 60, 0.9)', phrase, centerX, centerY + (this.menuTitle.pos) * scaleY, 1.6 * scaleX, 'MicrosoftYaheiBold');
      render.drawText('#FFFFFF', lowText, centerX, centerY - 55 * scaleY, 1.6 * scaleX);
      render.drawText('#FFFFFF', '選單:🔼🔽    選擇:◀️▶️', centerX, centerY + 105 * scaleY, 1 * scaleX);
      render.drawText('#FFFFFF', '遊戲開始 ➟ B/A 🔴', centerX, centerY + 135 * scaleY, 1 * scaleX);
    }
  }   
}

export default Menu;