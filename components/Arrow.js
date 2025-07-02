import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.mjs';
import { arrowImg } from "../utils/constants.js";

export class Arrow {
    constructor(app) {
        this.arrow = PIXI.Sprite.from(arrowImg);
        this.arrow.tint = 0xFF0000;
        this.arrow.anchor.set(0.5);
        this.arrowPosition(app)
    }

    arrowPosition(app){
        const circleRadius = app.screen.width > app.screen.height ? app.screen.height / 3 : app.screen.width / 3;
        this.arrow.x = app.screen.width / 2;
        this.arrow.y = app.screen.height / 2 + circleRadius + 35;
    }
}