import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.mjs';
import { ReelGame } from "./components/ReelGame.js";

export class App {
    constructor() {
        this.createApp()
        window.addEventListener('resize', this.onResize.bind(this));
    }

    createApp() {
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x1099bb,
        });
        document.getElementById('root').appendChild(this.app.view);
        this.reelGame = new ReelGame(this.app, this.onSpin.bind(this));
        this.app.stage.addChild(this.reelGame.container);
    }

    onResize() {
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        this.reelGame.reelGameResize(this.app);
    }

    onSpin() {
        const duration = App.getRandomTime();
        const targetIndex = this.reelGame.reel.getTargetIndexAfterSpin(duration, 0.02);
        this.reelGame.reel.spinToIcon(targetIndex, duration);

        const blinkInterval = 100;
        const originalColor = 0x1099bb;
        let elapsed = 0;
        let lastBlink = 0;
        let blinkState = false;

        const animate = (now) => {
            if (elapsed - lastBlink > blinkInterval) {
                blinkState = !blinkState;
                this.app.renderer.background.color = blinkState ? 0xFF0000 : 0xFFFFFF;
                lastBlink = elapsed;
            }
            if (elapsed < duration) {
                elapsed += 16;
                requestAnimationFrame(animate);
            } else {
                this.app.renderer.background.color = originalColor;
            }
        };
        requestAnimationFrame(animate);
    }

    static getRandomTime() {
        const time = Math.floor(Math.random() * 10) * 1000;
        if (time === 0) {
            return App.getRandomTime();
        }
        return time;
    }
}