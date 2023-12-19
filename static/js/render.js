class Render {
  /**
   *
   * @param {CanvasRenderingContext2D} renderingContext
   */
  constructor(renderingContext) {
    this.renderingContext = renderingContext;
    this.canvas = renderingContext.canvas; 
  }

  clear(x, y, w, h) {
    this.renderingContext.clearRect(x, y, w, h);
  }

  save() {
    this.renderingContext.save();
  }

  restore() {
    this.renderingContext.restore();
  }

  drawFrame(timestamp) {
    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp;
    }

    const deltaTime = (timestamp - this.lastTimestamp) / 1000.0; // 計算時間差，單位：秒
    const starsToDraw = deltaTime * this.starsPerSecond; // 計算這次應該生成的星星數量

    this.drawStarfield(starsToDraw);

    this.lastTimestamp = timestamp;

    requestAnimationFrame(this.drawFrame.bind(this));
  }

  drawStarfield(stars = 500, colorrange = [0,60,120,180,240,300]) { // 更多色相
    for (let i = 0; i < stars; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const radius = Math.random() * 4; // 更大的星星
      const hue = colorrange[this.getRandom(0, colorrange.length - 1)];
      const sat = this.getRandom(80,100); // 更鮮艷的飽和度
      
      this.drawFilledCircle(x, y, radius, 0, 2 * Math.PI, `hsl(${hue}, ${sat}%, 88%)`);
    }
  }

  drawFilledCircle(x, y, radius, startAngle, endAngle, color = 'white') {
    const { renderingContext } = this;
    renderingContext.beginPath();
    renderingContext.fillStyle = color;
    renderingContext.arc(x, y, radius, startAngle, endAngle);
    renderingContext.fill();
  }

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  
  drawText(color, text, screenX = 300, screenY = 200, fontSize = '2',
    font = 'MicrosoftYahei', align = 'center', colorStroke = 'white', stroke = false) {
    const { renderingContext } = this;
    renderingContext.fillStyle = color;
    renderingContext.font = font;
    renderingContext.font = `${fontSize}em ${font}`;
    renderingContext.textAlign = align;
    renderingContext.textBaseline = 'middle';
    renderingContext.fillText(text, screenX, screenY);
    renderingContext.strokeStyle = colorStroke;
    if (stroke) {
      renderingContext.strokeText(text, screenX, screenY);
    }
    renderingContext.restore();
  }

  /**
   *
   * @param {Sprite} sprite
   * @param {Camera} camera
   * @param {Player} player
   * @param {Number} roadWidth
   * @param {Number} scale
   * @param {Number} destX
   * @param {Number} destY
   * @param {Number} clip
   */

  roundRect(color, x, y, width, height, radius = 5, fill, stroke = true) {
    const { renderingContext } = this;

    const radii = {
      tl: 0, tr: 0, br: 0, bl: 0,
    };
    if (typeof radius === 'number') {
      radii.tl = radius;
      radii.tr = radius;
      radii.br = radius;
      radii.bl = radius;
    }
    renderingContext.fillStyle = color;
    renderingContext.beginPath();
    renderingContext.moveTo(x + radii.tl, y);
    renderingContext.lineTo(x + width - radii.tr, y);
    renderingContext.quadraticCurveTo(x + width, y, x + width, y + radii.tr);
    renderingContext.lineTo(x + width, y + height - radii.br);
    renderingContext.quadraticCurveTo(x + width, y + height, x + width - radii.br, y + height);
    renderingContext.lineTo(x + radii.bl, y + height);
    renderingContext.quadraticCurveTo(x, y + height, x, y + height - radii.bl);
    renderingContext.lineTo(x, y + radii.tl);
    renderingContext.quadraticCurveTo(x, y, x + radii.tl, y);
    renderingContext.closePath();

    if (fill) {
      renderingContext.fill();
    }
    if (stroke) {
      renderingContext.stroke();
    }
  }
}

export default Render;
