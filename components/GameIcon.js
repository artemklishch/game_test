import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.mjs';

export class GameIcon {
    constructor(image, angleStep, angleOffset, iconRadius, desiredSize, index) {
        const angle = index * angleStep + angleStep / 2 + angleOffset;
        const x = Math.cos(angle) * iconRadius;
        const y = Math.sin(angle) * iconRadius;

        this.sprite = PIXI.Sprite.from(image);
        this.sprite.anchor.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;

        this.ready = new Promise(resolve => {
            if (this.sprite.texture.baseTexture.valid) {
                resolve();
            } else {
                this.sprite.texture.baseTexture.on('loaded', resolve);
            }
        });
    }
}

