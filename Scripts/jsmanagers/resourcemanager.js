// ResourceManager.js
// Handles all resource loading for the game using manifest-based configuration

import { Resources } from '../jscomponents/resources.js';

/**
 * @typedef {Object} AssetManifest
 * @property {string} version
 * @property {string} basePath
 * @property {Object<string, string>} sprites
 * @property {{sfx: Object<string, string>, music: Object<string, string>}} audio
 * @property {Object<string, string>} animations
 * @property {Object<string, string>} languages
 * @property {Object<string, {description: string, sprites?: string[], audio?: string[], animations?: string[], languages?: string[]}>} bundles
 */

export class ResourceManager {
    #selectedLanguage;
    /** @type {AssetManifest|null} */
    #manifest = null;

    constructor() {
        this.resources = new Resources();
        this.resourcesLoaded = false;
        this.#selectedLanguage = 'English';
        /** @type {Set<string>} - Track which bundles have been loaded */
        this.loadedBundles = new Set();
    }

    /**
     * Load the asset manifest
     * @returns {Promise<AssetManifest>}
     */
    async loadManifest() {
        if (this.#manifest) return this.#manifest;
        
        const response = await fetch('./Assets/manifest.json');
        this.#manifest = await response.json();
        return this.#manifest;
    }

    /**
     * Get full path from manifest base path
     * @param {string} relativePath 
     * @returns {string}
     */
    #getFullPath(relativePath) {
        const basePath = this.#manifest?.basePath || './Assets';
        return `${basePath}/${relativePath}`;
    }

    /**
     * Load all core resources (called at game startup)
     */
    async trytoLoadAllResources() {
        await this.loadManifest();
        await this.loadBundle('core');
        this.resourcesLoaded = true;
        console.log("Core resources loaded successfully.");
    }

    /**
     * Load a specific bundle of resources
     * @param {string} bundleName - Name of the bundle from manifest
     * @returns {Promise<void>}
     */
    async loadBundle(bundleName) {
        if (this.loadedBundles.has(bundleName)) {
            console.log(`Bundle '${bundleName}' already loaded, skipping.`);
            return;
        }

        await this.loadManifest();
        const bundle = this.#manifest.bundles[bundleName];
        
        if (!bundle) {
            console.warn(`Bundle '${bundleName}' not found in manifest.`);
            return;
        }

        console.log(`Loading bundle: ${bundleName} - ${bundle.description}`);
        
        const promises = [];

        // Load sprites
        if (bundle.sprites?.length) {
            promises.push(this.#loadSprites(bundle.sprites));
        }

        // Load audio (both sfx and music keys)
        if (bundle.audio?.length) {
            promises.push(this.#loadAudio(bundle.audio));
        }

        // Load animations
        if (bundle.animations?.length) {
            promises.push(this.#loadAnimations(bundle.animations));
        }

        // Load languages
        if (bundle.languages?.length) {
            promises.push(this.#loadLanguages(bundle.languages));
        }

        await Promise.all(promises);
        this.loadedBundles.add(bundleName);
        console.log(`Bundle '${bundleName}' loaded.`);
    }

    /**
     * @param {string[]} spriteKeys 
     */
    async #loadSprites(spriteKeys) {
        const sprites = this.#manifest.sprites;
        const names = [];
        const paths = [];

        for (const key of spriteKeys) {
            if (sprites[key]) {
                names.push(key);
                paths.push(this.#getFullPath(sprites[key]));
            }
        }

        return new Promise(resolve => {
            if (names.length === 0) return resolve();
            this.resources.loadAllImages(names, paths, resolve);
        });
    }

    /**
     * @param {string[]} audioKeys 
     */
    async #loadAudio(audioKeys) {
        const { sfx, music } = this.#manifest.audio;
        const names = [];
        const paths = [];

        for (const key of audioKeys) {
            // Check both sfx and music sections
            if (sfx[key]) {
                names.push(key);
                paths.push(this.#getFullPath(sfx[key]));
            } else if (music[key]) {
                names.push(key);
                paths.push(this.#getFullPath(music[key]));
            }
        }

        return new Promise(resolve => {
            if (names.length === 0) return resolve();
            this.resources.loadAllSounds(names, paths, resolve);
        });
    }

    /**
     * @param {string[]} animationKeys 
     */
    async #loadAnimations(animationKeys) {
        // Animations are loaded by CharacterManager, just store paths
        // This could be expanded to preload animation data
        console.log(`Animation keys registered: ${animationKeys.join(', ')}`);
        return Promise.resolve();
    }

    /**
     * @param {string[]} languageKeys 
     */
    async #loadLanguages(languageKeys) {
        const languages = this.#manifest.languages;
        const names = [];
        const paths = [];

        for (const key of languageKeys) {
            if (languages[key]) {
                names.push(key);
                paths.push(this.#getFullPath(languages[key]));
            }
        }

        return new Promise(resolve => {
            if (names.length === 0) return resolve();
            this.resources.loadAllLanguages(names, paths, resolve);
        });
    }

    /**
     * Get animation path from manifest
     * @param {string} animationKey 
     * @returns {string|null}
     */
    getAnimationPath(animationKey) {
        if (!this.#manifest) return null;
        const relativePath = this.#manifest.animations[animationKey];
        return relativePath ? this.#getFullPath(relativePath) : null;
    }

    /**
     * Get all animation paths (for CharacterManager)
     * @returns {Object<string, string>}
     */
    getAnimationPaths() {
        if (!this.#manifest) return {};
        /** @type {Object<string, string>} */
        const result = {};
        for (const [key, path] of Object.entries(this.#manifest.animations)) {
            result[key] = this.#getFullPath(path);
        }
        return result;
    }

    /** @returns {Resources} */
    getResources() {
        return this.resources;
    }

    isLoaded() {
        return this.resourcesLoaded;
    }

    getImage(name) {
        return this.resources.getImage(name);
    }

    setSelectedLanguage(code) {
        this.#selectedLanguage = code;
    }

    /**
     * @param {String} name 
     * @returns {HTMLAudioElement}
     */
    getSound(name) {
        return this.resources.getSound(name);
    }

    /**
     * @param {String} elementName 
     * @returns {String}
     */
    getTranslation(elementName) {
        if (!elementName) return "";
        if (!this.resourcesLoaded) return null;
        return this.resources.getLanguageText(this.#selectedLanguage, elementName);
    }

    getCurrentLanguage(){
        return this.#selectedLanguage;
    }

    /**
     * Called by globaluimanager
     * @param {String} languageCode 
     */
    selectTranslation(languageCode) {
        this.#selectedLanguage = languageCode;
    }

    /**
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
