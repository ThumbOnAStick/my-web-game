// ResourceManager.js
// Handles all resource loading for the game

import { Resources } from '../jscomponents/resources.js';
import { GameManager } from './gamemanager.js';

export class ResourceManager {
    constructor() 
    {
        this.resources = new Resources();
        this.resourcesLoaded = false;
        this.spriteNames = ['head', 'body', 'weapon', 'flash'];
        this.spritePaths = ['./Assets/Head.png', './Assets/Body.png', './Assets/Sword.png', './Assets/Flash.png'];
        this.audioNames = ['parry', 'dodge', 'clapping'];
        this.audioPaths = ['./Assets/blocked.wav', './Assets/dodge.wav', './Assets/clapping.wav'];
        this.languageCodes = ['English', 'ChineseSimplified']
        this.languagePaths = ['./Assets/Languages/English.xml', './Assets/Languages/ChineseSimplified.xml']
        this.selectedLanguage = 'English';
    }

    async trytoLoadAllResources() 
    {
        return new Promise((resolve, reject) => {
            let imagesReady = false;
            let soundsReady = false;
            let languagesReady = false;

            const checkComplete = () => {
                if (imagesReady && soundsReady && languagesReady) {
                    console.log("All resources loaded successfully.");
                    this.resourcesLoaded = true;
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

            this.resources.loadAllLanguages(this.languageCodes, this.languagePaths, () => {
                languagesReady = true;
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

    setSelectedLanguage(code){
        this.selectedLanguage = code;
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

    /**
     * 
     * @param {String} elementName 
     * @returns {String}
     */
    getTranslation(elementName)
    {
        if (!elementName) return "";
        if (!this.resourcesLoaded) return null;
        return this.resources.getLanguageText(this.selectedLanguage, elementName)
    }

    /**
     * 
     * @param {String[]} elementNames 
     * @returns {String[]}
     */
    getTranslations(elementNames) {
        return elementNames.map(name => this.getTranslation(name));
    }

    /**
     * Get a translation with formatted arguments
     * @param {String} elementName 
     * @param {Array} args 
     * @returns {String}
     */
    getFormattedTranslation(elementName, args) {
        let text = this.getTranslation(elementName);
        if (!text) return "";
        
        if (args && args.length > 0) {
            args.forEach((arg, index) => {
                text = text.replace(`{${index}}`, arg);
            });
        }
        return text;
    }
}
