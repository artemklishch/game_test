import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.mjs';

export class PlayButton {
    constructor(app, onSpin) {
        this.button = new PIXI.Container();
        this.button.eventMode = 'static';
        this.button.cursor = 'pointer';
        this.button.buttonMode = true;
        this.createButton(app, onSpin);
    }

    createButton(app, onClick) {
        this.rect = new PIXI.Graphics();
        const rectWidth = 140;
        const rectHeight = 50;
        this.rect.beginFill(0xFF0000);
        this.rect.drawRoundedRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight, 12);
        this.rect.endFill();

        this.text = new PIXI.Text('SPIN', {
            fontFamily: 'Arial',
            fontSize: 28,
            fill: 0xFFFFFF,
        });
        this.text.anchor.set(0.5);

        this.button.addChild(this.rect);
        this.button.addChild(this.text);

        this.button.hitArea = new PIXI.RoundedRectangle(
            -rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight, 12
        );

        this.buttonPosition(app);

        this.button.on('pointerdown', onClick, this);
    }

    buttonPosition(app) {
        const circleRadius = app.screen.width > app.screen.height ? app.screen.height / 3 : app.screen.width / 3;
        this.button.x = app.screen.width / 2;
        this.button.y = app.screen.height / 2 + circleRadius + 90;
    }

}