// Luxury Romantic Particle & Confetti Engine
// Supports: Ambient Floating Hearts/Bokeh + Grand Celebration Rose Petals & Confetti

class RomanticParticles {
  constructor() {
    this.bgCanvas = null;
    this.bgCtx = null;
    this.confettiCanvas = null;
    this.confettiCtx = null;
    this.ambientParticles = [];
    this.celebrationParticles = [];
    this.animatingCelebration = false;
    this.mouse = { x: -100, y: -100, active: false };
  }

  init() {
    this.bgCanvas = document.getElementById('bgCanvas');
    if (this.bgCanvas) {
      this.bgCtx = this.bgCanvas.getContext('2d');
      this.resizeCanvas(this.bgCanvas);
      this.createAmbientParticles();
    }

    this.confettiCanvas = document.getElementById('confettiCanvas');
    if (this.confettiCanvas) {
      this.confettiCtx = this.confettiCanvas.getContext('2d');
      this.resizeCanvas(this.confettiCanvas);
    }

    window.addEventListener('resize', () => {
      if (this.bgCanvas) this.resizeCanvas(this.bgCanvas);
      if (this.confettiCanvas) this.resizeCanvas(this.confettiCanvas);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    });

    this.startAmbientLoop();
  }

  resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // AMBIENT BACKGROUND PARTICLES
  createAmbientParticles() {
    const count = Math.min(window.innerWidth > 768 ? 55 : 30, 70);
    this.ambientParticles = [];
    // Multiple color palettes for more variety
    const colorPalettes = [
      { base: 330, range: 40 },  // Pinks/reds
      { base: 280, range: 30 },  // Purples
      { base: 30, range: 20 },   // Oranges/golds
      { base: 160, range: 25 },  // Teals/mints
      { base: 200, range: 20 },  // Blues
    ];
    for (let i = 0; i < count; i++) {
      const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
      const hue = palette.base + Math.floor(Math.random() * palette.range) - palette.range / 2;
      const types = ['heart', 'bokeh', 'sparkle'];
      const type = types[Math.floor(Math.random() * types.length)];
      this.ambientParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 16 + 8,
        type: type,
        speedY: Math.random() * 0.8 + 0.25,
        speedX: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.55 + 0.18,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.025,
        hue: hue,
        saturation: 85 + Math.random() * 15,
        lightness: 55 + Math.random() * 20,
        sparklePhase: Math.random() * Math.PI * 2
      });
    }
  }

  startAmbientLoop() {
    const loop = () => {
      if (this.bgCtx && this.bgCanvas) {
        this.bgCtx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
        
        for (let p of this.ambientParticles) {
          p.y -= p.speedY;
          p.x += Math.sin(p.y * 0.01) * 0.4 + p.speedX;
          p.rotation += p.rotSpeed;

          // Mouse interaction (gentle deflection)
          if (this.mouse.active) {
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 100) {
              const angle = Math.atan2(dy, dx);
              const force = (100 - dist) * 0.05;
              p.x += Math.cos(angle) * force;
              p.y += Math.sin(angle) * force;
            }
          }

          if (p.y < -30) {
            p.y = this.bgCanvas.height + 20;
            p.x = Math.random() * this.bgCanvas.width;
          }

          this.bgCtx.save();
          this.bgCtx.translate(p.x, p.y);
          this.bgCtx.rotate(p.rotation);
          this.bgCtx.globalAlpha = p.opacity;

          const color = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.opacity})`;

          if (p.type === 'heart') {
            this.drawHeart(this.bgCtx, 0, 0, p.size, color);
          } else if (p.type === 'sparkle') {
            // Sparkle - rotating cross/star shape
            const sparkleSize = p.size * (0.5 + Math.sin(p.sparklePhase + Date.now() * 0.003) * 0.3);
            this.bgCtx.fillStyle = color;
            this.bgCtx.beginPath();
            // Vertical line
            this.bgCtx.moveTo(0, -sparkleSize);
            this.bgCtx.lineTo(0, sparkleSize);
            // Horizontal line
            this.bgCtx.moveTo(-sparkleSize, 0);
            this.bgCtx.lineTo(sparkleSize, 0);
            // Diagonal lines
            this.bgCtx.moveTo(-sparkleSize * 0.7, -sparkleSize * 0.7);
            this.bgCtx.lineTo(sparkleSize * 0.7, sparkleSize * 0.7);
            this.bgCtx.moveTo(-sparkleSize * 0.7, sparkleSize * 0.7);
            this.bgCtx.lineTo(sparkleSize * 0.7, -sparkleSize * 0.7);
            this.bgCtx.lineWidth = Math.max(1, p.size * 0.12);
            this.bgCtx.strokeStyle = color;
            this.bgCtx.stroke();
            // Center glow
            const glow = this.bgCtx.createRadialGradient(0, 0, 0, 0, 0, sparkleSize);
            glow.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, 90%, ${p.opacity})`);
            glow.addColorStop(1, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 0)`);
            this.bgCtx.fillStyle = glow;
            this.bgCtx.beginPath();
            this.bgCtx.arc(0, 0, sparkleSize, 0, Math.PI * 2);
            this.bgCtx.fill();
          } else {
            // Soft Bokeh Circle
            const gradient = this.bgCtx.createRadialGradient(0, 0, 0, 0, 0, p.size);
            gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness + 10}%, ${p.opacity * 0.8})`);
            gradient.addColorStop(1, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 0)`);
            this.bgCtx.fillStyle = gradient;
            this.bgCtx.beginPath();
            this.bgCtx.arc(0, 0, p.size, 0, Math.PI * 2);
            this.bgCtx.fill();
          }

          this.bgCtx.restore();
        }
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  // Draw Heart Shape on Canvas
  drawHeart(ctx, x, y, size, fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // top left curve
    ctx.bezierCurveTo(
      x, y, 
      x - size / 2, y, 
      x - size / 2, y + topCurveHeight
    );
    // bottom left curve
    ctx.bezierCurveTo(
      x - size / 2, y + (size + topCurveHeight) / 2, 
      x, y + (size + topCurveHeight) / 1.5, 
      x, y + size
    );
    // bottom right curve
    ctx.bezierCurveTo(
      x, y + (size + topCurveHeight) / 1.5, 
      x + size / 2, y + (size + topCurveHeight) / 2, 
      x + size / 2, y + topCurveHeight
    );
    // top right curve
    ctx.bezierCurveTo(
      x + size / 2, y, 
      x, y, 
      x, y + topCurveHeight
    );
    ctx.closePath();
    ctx.fill();
  }

  // Draw Rose Petal on Canvas
  drawPetal(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.bezierCurveTo(x + size * 0.8, y - size * 0.5, x + size * 0.8, y + size * 0.5, x, y + size);
    ctx.bezierCurveTo(x - size * 0.8, y + size * 0.5, x - size * 0.8, y - size * 0.5, x, y - size);
    ctx.fill();
  }

  // GRAND CELEBRATION BURST
  triggerCelebration(originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
    this.celebrationParticles = [];
    this.animatingCelebration = true;

    const colors = [
      '#ff2a6d', '#ff5376', '#ff7597', '#ff85a1', 
      '#f72585', '#ffd166', '#ffffff', '#ffccd5',
      '#e0aaff', '#c77dff', '#ffb703',
      '#00f5d4', '#ff6b9d', '#a855f7', '#ec4899',
      '#ff9f1c', '#2ec4b6', '#ff006e', '#8338ec'
    ];

    // Initial Explosive Burst
    for (let i = 0; i < 180; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 16 + 5;
      const types = ['heart', 'petal', 'sparkle', 'ribbon'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      this.celebrationParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 8,
        gravity: 0.28,
        drag: 0.965,
        size: Math.random() * 16 + 8,
        type: type,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.15 + 0.05,
        opacity: 1,
        life: 1.0,
        decay: Math.random() * 0.005 + 0.003
      });
    }

    // Continuous Shower of Falling Petals, Hearts & Sparkles for next 8 seconds
    let showerInterval = setInterval(() => {
      if (!this.animatingCelebration) {
        clearInterval(showerInterval);
        return;
      }
      for (let j = 0; j < 6; j++) {
        const types = ['petal', 'heart', 'sparkle'];
        const type = types[Math.floor(Math.random() * types.length)];
        this.celebrationParticles.push({
          x: Math.random() * window.innerWidth,
          y: -20,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 4 + 1.5,
          gravity: type === 'sparkle' ? 0.02 : 0.06,
          drag: 0.99,
          size: Math.random() * (type === 'sparkle' ? 12 : 18) + (type === 'sparkle' ? 6 : 10),
          type: type,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * (type === 'sparkle' ? 0.15 : 0.08),
          flip: Math.random() * Math.PI,
          flipSpeed: Math.random() * 0.1,
          opacity: 1,
          life: 1.0,
          decay: type === 'sparkle' ? 0.002 : 0.003
        });
      }
    }, 100);

    // Stop continuous spawn after 9s
    setTimeout(() => {
      clearInterval(showerInterval);
    }, 9000);

    this.runCelebrationLoop();
  }

  runCelebrationLoop() {
    const loop = () => {
      if (!this.animatingCelebration || !this.confettiCtx || !this.confettiCanvas) return;

      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

      for (let i = this.celebrationParticles.length - 1; i >= 0; i--) {
        const p = this.celebrationParticles[i];

        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.flip += p.flipSpeed;
        p.life -= p.decay;

        if (p.life <= 0 || p.y > this.confettiCanvas.height + 50) {
          this.celebrationParticles.splice(i, 1);
          continue;
        }

        this.confettiCtx.save();
        this.confettiCtx.translate(p.x, p.y);
        this.confettiCtx.rotate(p.rotation);
        this.confettiCtx.scale(Math.cos(p.flip), 1);
        this.confettiCtx.globalAlpha = Math.max(0, p.life);

        if (p.type === 'heart') {
          this.drawHeart(this.confettiCtx, 0, 0, p.size, p.color);
        } else if (p.type === 'petal') {
          this.drawPetal(this.confettiCtx, 0, 0, p.size, p.color);
        } else if (p.type === 'sparkle') {
          // Celebration sparkle - more elaborate
          const sparkleSize = p.size * (0.6 + Math.sin(p.flip) * 0.4);
          this.confettiCtx.strokeStyle = p.color;
          this.confettiCtx.lineWidth = Math.max(1.5, p.size * 0.15);
          this.confettiCtx.lineCap = 'round';
          this.confettiCtx.beginPath();
          // Main cross
          this.confettiCtx.moveTo(0, -sparkleSize);
          this.confettiCtx.lineTo(0, sparkleSize);
          this.confettiCtx.moveTo(-sparkleSize, 0);
          this.confettiCtx.lineTo(sparkleSize, 0);
          // Diagonals
          this.confettiCtx.moveTo(-sparkleSize * 0.7, -sparkleSize * 0.7);
          this.confettiCtx.lineTo(sparkleSize * 0.7, sparkleSize * 0.7);
          this.confettiCtx.moveTo(-sparkleSize * 0.7, sparkleSize * 0.7);
          this.confettiCtx.lineTo(sparkleSize * 0.7, -sparkleSize * 0.7);
          this.confettiCtx.stroke();
          // Center glow
          const glow = this.confettiCtx.createRadialGradient(0, 0, 0, 0, 0, sparkleSize);
          glow.addColorStop(0, p.color);
          glow.addColorStop(1, 'transparent');
          this.confettiCtx.fillStyle = glow;
          this.confettiCtx.beginPath();
          this.confettiCtx.arc(0, 0, sparkleSize, 0, Math.PI * 2);
          this.confettiCtx.fill();
        } else {
          // Ribbon confetti
          this.confettiCtx.fillStyle = p.color;
          this.confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }

        this.confettiCtx.restore();
      }

      if (this.celebrationParticles.length > 0) {
        requestAnimationFrame(loop);
      } else {
        this.animatingCelebration = false;
        this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
      }
    };

    loop();
  }
}

window.romanticParticles = new RomanticParticles();
