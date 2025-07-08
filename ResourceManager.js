// ResourceManager.js
// Handles all resource loading for the game

import { Resources } from './resources.js';

export class ResourceManager {
    constructor() {
        this.resources = new Resources();
        this.resourcesLoaded = false;
        this.spriteNames = ['head', 'body', 'weapon'];
        this.spritePaths = ['./Assets/Head.png', './Assets/Body.png', './Assets/Sword.png'];
    }

    async loadAllResources() {
        return new Promise((resolve, reject) => {
            this.resources.loadAllImages(this.spriteNames, this.spritePaths, () => {
                this.resourcesLoaded = true;
                console.log('All Resources loaded successfully');
                resolve();
            });
        });
    }

    drawLoadingScreen(ctx, canvas) {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Loading Images...', canvas.width / 2 - 100, canvas.height / 2);
    }

    /**@returns {Resources} */
    getResources() {
        return this.resources;
    }

    isLoaded() {
        return this.resourcesLoaded;
    }

    getImage(name) {
        return this.resources.getImage(name);
    }
}
