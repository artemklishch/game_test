import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.mjs';
import { Reel } from "./Reel.js";
import { PlayButton } from "./PlayButton.js";
import { Arrow } from "./Arrow.js";

export class ReelGame {
    constructor(app, onSpin) {
        this.container = new PIXI.Container();
        this.makeReelGame(app, onSpin)
    }

    makeReelGame(app, onSpin) {
        this.reel = new Reel(app)
        this.reelPositions(app)
        this.container.addChild(this.reel.container);

        this.playButton = new PlayButton(app, onSpin)
        this.container.addChild(this.playButton.button);

        this.arrow = new Arrow(app)
        this.container.addChild(this.arrow.arrow);
    }

    reelGameResize(app) {
        this.reelPositions(app)
        this.reel.updateCircle()
        this.reel.updateIconSizesAndPositions()
        this.playButton.buttonPosition(app)
        this.arrow.arrowPosition(app)
    }

    reelPositions(app) {
        this.reel.container.x = app.screen.width / 2;
        this.reel.container.y = app.screen.height / 2;
    }
}