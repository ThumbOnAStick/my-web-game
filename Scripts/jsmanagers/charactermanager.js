// CharacterManager.js
// Manages character creation, loading, and updates
import { Resources } from '../jscomponents/resources.js';
import { Character } from '../jsgameobjects/character.js';
import { debugManager } from './debugmanager.js';

export class CharacterManager {
    constructor(canvas, resources) {
        this.canvas = canvas;
        this.resources = resources;
        /**@type {Character[]} */
        this.characters = [];
        this.globalDrawSize = 1;
        /** @type {Object<string, string>|null} - Animation paths from manifest */
        this.animationPaths = null;
    }

    /**
     * @param {Resources} resources 
     */
    initialize(resources){
        this.resources = resources;
    }

    /**
     * Set animation paths from ResourceManager
     * @param {Object<string, string>} paths - Map of animation key to full path
     */
    setAnimationPaths(paths) {
        this.animationPaths = paths;
    }


    /**
     * Load and create all characters
     */
    async loadCharacters() {
        const characterHeight = 60;

        // Player character
        const player = new Character(
            50,
            this.canvas.height - characterHeight / 2,
            40, // width
            characterHeight, // height
            this.resources
        );

        // Opponent character
        const opponent = new Character(
            this.canvas.width - 50,
            this.canvas.height - characterHeight / 2,
            40, // width
            characterHeight, // height
            this.resources,
            true
        );

        this.characters = [player, opponent];
        
        // Set opponents
        player.setOpponent(opponent);
        opponent.setOpponent(player);

        console.log('Characters loaded successfully');
    }

    /**
     * Load animations for all characters
     * Uses paths from manifest via setAnimationPaths()
     */
    async loadAnimations() {
        if (!this.animationPaths) {
            console.warn('Animation paths not set. Call setAnimationPaths() first.');
            // Fallback to legacy paths
            this.animationPaths = {
                idle: './Assets/Animations/character_idle_animation.csv',
                swing: './Assets/Animations/character_swing_animation.csv',
                lightswing: './Assets/Animations/character_lightswing_animation.csv',
                spinswing: './Assets/Animations/character_spinswing_animation.csv',
                thrust: './Assets/Animations/character_thrust_animation.csv',
                dodge: './Assets/Animations/character_dodge_animation.csv',
                stagger: './Assets/Animations/character_stagger_animation.csv'
            };
        }

        try {
            for (const character of this.characters) {
                // @ts-ignore
                await character.loadAnimation('idle', this.animationPaths.idle);
                // @ts-ignore
                await character.loadAnimation('swing', this.animationPaths.swing);
                // @ts-ignore
                await character.loadAnimation('lightswing', this.animationPaths.lightswing);
                // @ts-ignore
                await character.loadAnimation('spinswing', this.animationPaths.spinswing);
                // @ts-ignore
                await character.loadAnimation('thrustswing', this.animationPaths.thrust);
                // @ts-ignore
                await character.loadAnimation('dodge', this.animationPaths.dodge);
                // @ts-ignore
                await character.loadAnimation('stagger', this.animationPaths.stagger);
            }
            console.log('Animations loaded successfully');
        } catch (error) {
            console.error('Failed to load animations:', error);
        }
    }

    /**
     * 
     * @param {Number} newDrawSize 
     */
    setDrawSize(newDrawSize) {
        this.globalDrawSize = newDrawSize
        for (const character of this.characters) {
            character.setDrawSize(this.globalDrawSize)
        }
    }

    /**
     * Update all characters
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        for (const character of this.characters) {
            character.update(this.canvas, deltaTime);
        }
    }

    /**
     * Reset all characters to their initial state
     */
    resetCharacters() {
        const characterHeight = 60;
        const player = this.characters[0];
        const opponent = this.characters[1];

        // Reset player position and physics
        player.y = this.canvas.height - characterHeight;
        if (player.rigidbody) {
            player.rigidbody.velocityY = 0;
        }
        if(opponent){
            // @ts-ignore
            player.adjustHitFacing(opponent);
        }
        player.grounded = true;

        // Reset positions
        player.x = 50;
        opponent.x = this.canvas.width - 100;

        // Reset scores and animations
        for (const character of this.characters) {
            // @ts-ignore
            character.resetScore();
            // @ts-ignore
            character.playIdleAnimation();
        }

        debugManager.popMessage("All characters have been reset.")
    }

    /**
     * Get the player character (first character)
     * @returns {Character}
     */
    getPlayer() {
        return this.characters[0];
    }

    /**
     * Get the opponent character (second character)
     * @returns {Character}
     */
    getOpponent() {
        return this.characters[1];
    }

    /**
     * Get all characters
     * @returns {Character[]}
     */
    getCharacters() {
        return this.characters;
    }

    /**
     * Get player's current score
     * @returns {number}
     */
    getPlayerScore() {
        return this.getPlayer().currentScore;
    }

    /**
     * Get opponent's current score
     * @returns {number}
     */
    getOpponentScore() {
        return this.getOpponent().currentScore;
    }
}
