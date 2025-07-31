// ResourceManager.js
// Handles all resource loading for the game

import { Resources } from '../jscomponents/resources.js';

export class ResourceManager {
    constructor() 
    {
        this.resources = new Resources();
        this.resourcesLoaded = false;
        this.spriteNames = ['head', 'body', 'weapon', 'flash'];
        this.spritePaths = ['./Assets/Head.png', './Assets/Body.png', './Assets/Sword.png', './Assets/Flash.png'];
        this.audioNames = ['parry', 'dodge'];
        this.audioPaths = ['./Assets/blocked.wav', './Assets/dodge.wav'];
    }

    async trytoLoadAllResources() 
    {
        return new Promise((resolve, reject) => {
            let imagesReady = false;
            let soundsReady = false;

            const checkComplete = () => {
                if (imagesReady && soundsReady) {
                    console.log("All resources loaded successfully.");
                    resolve();
                }
            };

            // Load images with callback
            this.resources.loadAllImages(this.spriteNames, this.spritePaths, () => {
                imagesReady = true;
                checkComplete();
            });

            // Load sounds with callback  
            this.resources.loadAllSounds(this.audioNames, this.audioPaths, () => {
                soundsReady = true;
                checkComplete();
            });

        });
    }

    /**@returns {Resources} */
    getResources() {
        return this.resources;
    }

    isLoaded() {
        return this.resourcesLoaded;
    }

    getImage(name) 
    {
        return this.resources.getImage(name);
    }

    /**
     * 
     * @param {String} name 
     * @returns {HTMLAudioElement}
     */
    getSound(name)
    {
        return this.resources.getSound(name);
    }
}
