import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.x/dist/pixi.mjs';
import { IMAGES } from '../utils/constants.js';
import { GameIcon } from "./GameIcon.js";

export class Reel {
    static DEFAULT_SPEED = 0.02;

    constructor() {
        this.container = new PIXI.Container()

        this.radius = window.innerWidth > window.innerHeight ? window.innerHeight / 3 : window.innerWidth / 3;

        this.circle = new PIXI.Graphics();
        this.circle.beginFill(0xFFFFFF);
        this.drawCircle();
        this.circle.endFill();
        this.container.addChild(this.circle);

        this.icons = [];
        this.makeReelIcons().then(() => {
            this.updateIconSizesAndPositions();
        });
    }

    drawCircle() {
        this.circle.clear();
        this.circle.beginFill(0xFFFFFF);
        this.circle.drawCircle(0, 0, this.radius);
        this.circle.endFill();
        this.drawDivisions();
    }

    drawDivisions(index) {
        const divisions = IMAGES.length;
        const angleStep = (2 * Math.PI) / divisions;
        const angleOffset = -Math.PI / 2;
        const sectionColors = IMAGES.map((_, i) => i === index ? 0x00FF00 : 0xFFFFFF);

        for (let i = 0; i < divisions; i++) {
            const startAngle = i * angleStep + angleOffset;
            const endAngle = startAngle + angleStep;

            this.circle.beginFill(sectionColors[i % sectionColors.length]);
            this.circle.moveTo(0, 0);
            this.circle.arc(0, 0, this.radius, startAngle, endAngle);
            this.circle.lineTo(0, 0);
            this.circle.endFill();
        }

        this.circle.lineStyle(2, 0x000000);
        for (let i = 0; i < divisions; i++) {
            const angle = i * angleStep + angleOffset;
            const x = Math.cos(angle) * this.radius;
            const y = Math.sin(angle) * this.radius;
            this.circle.moveTo(0, 0);
            this.circle.lineTo(x, y);
        }
    }

    updateCircle() {
        this.radius = window.innerWidth > window.innerHeight ? window.innerHeight / 3 : window.innerWidth / 3;
        this.drawCircle();
    }

    async makeReelIcons() {
        this.radius = window.innerWidth > window.innerHeight ? window.innerHeight / 3 : window.innerWidth / 3;
        const angleStep = (2 * Math.PI) / IMAGES.length;
        const angleOffset = -Math.PI / 2;
        const iconRadius = this.radius * 0.65;
        const iconSize = this.radius * 0.4;

        const iconPromises = IMAGES.map((image, index) => {
            const icon = new GameIcon(image, angleStep, angleOffset, iconRadius, iconSize, index);
            this.container.addChild(icon.sprite);
            this.icons.push(icon);
            return icon.ready;
        });

        await Promise.all(iconPromises);
    }

    updateIconSizesAndPositions() {
        this.radius = window.innerWidth > window.innerHeight ? window.innerHeight / 3 : window.innerWidth / 3;
        const angleStep = (2 * Math.PI) / this.icons.length;
        const angleOffset = -Math.PI / 2;
        const iconRadius = this.radius * 0.65;
        const maxIconSize = this.radius * 0.3;

        this.icons.forEach((icon, index) => {
            const angle = index * angleStep + angleStep / 2 + angleOffset;
            const x = Math.cos(angle) * iconRadius;
            const y = Math.sin(angle) * iconRadius;

            const textureMax = Math.max(icon.sprite.texture.width, icon.sprite.texture.height);
            const scale = maxIconSize / textureMax;
            icon.sprite.scale.set(scale);

            icon.sprite.x = x;
            icon.sprite.y = y;
        });
    }

    spinToIcon(targetIndex, duration = 3000, extraSpins = 3) {
        if (this._rotationFrame) cancelAnimationFrame(this._rotationFrame);

        const iconsCount = this.icons.length;
        const angleStep = (2 * Math.PI) / iconsCount;
        const angleOffset = -Math.PI / 2;
        const targetAngle = ((-(targetIndex * angleStep + angleStep / 2 + angleOffset)) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

        let currentRotation = this.container.rotation % (2 * Math.PI);
        if (currentRotation < 0) currentRotation += 2 * Math.PI;

        let delta = targetAngle - currentRotation;
        if (delta < 0) delta += 2 * Math.PI;

        const endAngle = currentRotation + delta + extraSpins * 2 * Math.PI;

        const startTime = performance.now();

        const animate = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            this.container.rotation = currentRotation + (endAngle - currentRotation) * ease;
            const elapsedIcon = now / 10;
            this.icons.forEach((icon) => {
                icon.sprite.rotation = -(elapsedIcon * Reel.DEFAULT_SPEED);
            });

            if (t < 1) {
                this._rotationFrame = requestAnimationFrame(animate);
            } else {
                this.container.rotation = targetAngle;
                this._rotationFrame = null;
                this.winnerAnimate(targetIndex)
                cancelAnimationFrame(this._rotationFrame)
            }
        };

        this._rotationFrame = requestAnimationFrame(animate);
    }

    getTargetIndexAfterSpin(duration, speed = Reel.DEFAULT_SPEED) {
        const frames = (duration / 1000) * 60;
        const totalRotation = speed * frames;
        const finalRotation = (this.container.rotation - totalRotation) % (2 * Math.PI);

        const iconsCount = this.icons.length;
        const angleStep = (2 * Math.PI) / iconsCount;
        const angleOffset = -Math.PI / 2 + angleStep / 2;

        let minDiff = Infinity;
        let closestIndex = 0;
        for (let i = 0; i < iconsCount; i++) {
            const iconAngle = -(i * angleStep + angleOffset);
            const diff = Math.abs(((finalRotation - iconAngle + Math.PI) % (2 * Math.PI)) - Math.PI);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = i;
            }
        }
        return closestIndex;
    }

    winnerAnimate(slotIndex) {
        const index = slotIndex + 1 >= IMAGES.length ? 0 : slotIndex + 1
        const icon = this.icons[index];
        const originalScale = icon.sprite.scale.x;
        const targetScale = originalScale * 1.2;
        const duration = 500;

        let startTime = null;

        const animate = (now) => {
            if (!startTime) startTime = now;
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            const ease = t * (2 - t);

            icon.sprite.scale.set(originalScale + (targetScale - originalScale) * ease);
            this.drawDivisions(index)

            if (t < 1) {
                this._winnerAnimate = requestAnimationFrame(animate);
            } else {
                icon.sprite.scale.set(originalScale);
                this.drawDivisions()
                cancelAnimationFrame(this._winnerAnimate)
            }
        };

        requestAnimationFrame(animate);
    }
}