class PortraitAnimator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.particles = [];
        this.time = 0;
        this.animStart = 0;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.mouse = {x: 0.5, y: 0.5};
        this.targetMouse = {x: 0.5, y: 0.5};
        this.setup();
        this.loadImage();
    }
    setup() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.targetMouse.x = e.clientX / window.innerWidth;
            this.targetMouse.y = e.clientY / window.innerHeight;
        });
        const btn = document.getElementById('replayBtn');
        if (btn) btn.addEventListener('click', () => this.start());
    }
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * this.dpr;
        this.canvas.height = rect.height * this.dpr;
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.width = rect.width;
        this.height = rect.height;
    }
    loadImage() {
        const img = new Image();
        img.src = 'portrait.jpg';
        img.onload = () => { this.image = img; this.samplePixels(); this.start(); };
    }
    samplePixels() {
        const off = document.createElement('canvas');
        const sw = 220, sh = 280;
        off.width = sw; off.height = sh;
        const octx = off.getContext('2d');
        octx.drawImage(this.image, 0, 0, sw, sh);
        const data = octx.getImageData(0, 0, sw, sh).data;
        this.pixelData = [];
        for (let y = 0; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
                const i = (y * sw + x) * 4;
                const g = (data[i] + data[i+1] + data[i+2]) / 3;
                const b = g / 255;
                if (b < 0.97) {
                    this.pixelData.push({x: x/sw, y: y/sh, bright: b});
                }
            }
        }
        this.buildParticles();
    }
    buildParticles() {
        const count = this.reducedMotion ? 600 : (this.width < 600 ? 1200 : 2000);
        this.particles = [];
        for (let i = 0; i < count; i++) {
            const pd = this.pixelData[i % this.pixelData.length];
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * Math.max(this.width, this.height) * 0.9;
            this.particles.push({
                x: this.width/2 + Math.cos(angle)*dist,
                y: this.height/2 + Math.sin(angle)*dist,
                vx: 0, vy: 0,
                tx: this.width * 0.5 + (pd.x - 0.5) * (this.width * 0.26) + (Math.random()-0.5)*2,
                ty: this.height * 0.5 + (pd.y - 0.5) * (this.height * 0.36) + (Math.random()-0.5)*2,
                bright: pd.bright,
                size: Math.random()*1.2 + 0.25
            });
        }
    }
    start() {
        this.time = 0;
        this.animStart = performance.now();
        if (this.reducedMotion) { this.drawFinal(); return; }
        this.animate();
    }
    animate() {
        const now = performance.now();
        this.time = (now - this.animStart) / 1000;
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.06;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.06;
        this.update();
        this.draw();
        if (this.time < 7.0) requestAnimationFrame(() => this.animate());
    }
    update() {
        const t = this.time;
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            let ax = 0, ay = 0;
            if (t < 1.5) {
                ax = (this.width/2 - p.x) * 0.0006;
                ay = (this.height/2 - p.y) * 0.0006;
                p.vx += (Math.random()-0.5)*0.015;
                p.vy += (Math.random()-0.5)*0.015;
            } else if (t < 4.0) {
                const prog = (t - 1.5) / 2.5;
                const pd = this.pixelData[i % this.pixelData.length];
                p.tx = this.width*0.5 + (pd.x-0.5)*(this.width*0.26) + (this.mouse.x-0.5)*10;
                p.ty = this.height*0.5 + (pd.y-0.5)*(this.height*0.36) + (this.mouse.y-0.5)*10;
                ax = (p.tx - p.x) * 0.007 * prog;
                ay = (p.ty - p.y) * 0.007 * prog;
            } else {
                const pd = this.pixelData[i % this.pixelData.length];
                p.tx = this.width*0.5 + (pd.x-0.5)*(this.width*0.26) + (this.mouse.x-0.5)*8;
                p.ty = this.height*0.5 + (pd.y-0.5)*(this.height*0.36) + (this.mouse.y-0.5)*8;
                ax = (p.tx - p.x) * 0.01;
                ay = (p.ty - p.y) * 0.01;
            }
            p.vx = p.vx * 0.92 + ax;
            p.vy = p.vy * 0.92 + ay;
            p.x += p.vx; p.y += p.vy;
        }
    }
    draw() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(0, 0, this.width, this.height);
        const t = this.time;
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            let alpha = t < 1.5 ? 0.25 : Math.min(1, (t-1.5)/2.2 + p.bright*0.5);
            if (t >= 6) alpha = Math.min(1, p.bright + (t-6)*0.3);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
            const v = Math.floor((1-p.bright)*255);
            ctx.fillStyle = 'rgba(' + (255-v) + ',' + (255-v) + ',' + (255-v) + ',' + alpha + ')';
            ctx.fill();
        }
        if (t > 6 && t < 7) {
            const sy = ((t-6)/1) * this.height;
            const grad = ctx.createLinearGradient(0, sy-15, 0, sy+15);
            grad.addColorStop(0, 'rgba(255,255,255,0)');
            grad.addColorStop(0.5, 'rgba(255,255,255,0.12)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, sy-15, this.width, 30);
        }
    }
    drawFinal() {
        const ctx = this.ctx;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.width, this.height);
        const pd = this.pixelData || [];
        for (let i = 0; i < Math.min(pd.length, 2000); i++) {
            const p = pd[i];
            ctx.beginPath();
            ctx.arc(this.width*0.5 + (p.x-0.5)*this.width*0.26, this.height*0.5 + (p.y-0.5)*this.height*0.36, 0.6, 0, Math.PI*2);
            const v = Math.floor((1-p.bright)*255);
            ctx.fillStyle = 'rgba(' + (255-v) + ',' + (255-v) + ',' + (255-v) + ',' + (0.4 + p.bright*0.6) + ')';
            ctx.fill();
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('portraitCanvas');
    new PortraitAnimator(canvas);
});
