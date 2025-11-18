// CharacterManager.js
// Manages character creation, loading, and updates
import { Character } from '../jsgameobjects/character.js';

export class CharacterManager {
    constructor(canvas, resources) {
        this.canvas = canvas;
        this.resources = resources;
        /**@type {Character[]} */
        this.characters = [];
        this.globalDrawSize = 1;
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
        console.log('Characters loaded successfully');
    }

    /**
     * Load animations for all characters
     */
    async loadAnimations() {
        try {
            // Load animations for all characters
            for (const character of this.characters) {
                // @ts-ignore
                await character.loadAnimation('idle', './Assets/character_idle_animation.csv');
                // @ts-ignore
                await character.loadAnimation('swing', './Assets/character_swing_animation.csv');
                // @ts-ignore
                await character.loadAnimation('lightswing', './Assets/character_lightswing_animation.csv');
                // @ts-ignore
                await character.loadAnimation('spinswing', './Assets/character_spinswing_animation.csv');
                // @ts-ignore
                await character.loadAnimation('thrustswing', './Assets/character_thrust_animation.csv');
                // @ts-ignore
                await character.loadAnimation('dodge', './Assets/character_dodge_animation.csv');
                // @ts-ignore
                await character.loadAnimation('stagger', './Assets/character_stagger_animation.csv');
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
     */
    updateCharacters() {
        for (const character of this.characters) {
            character.update(this.canvas);
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

        console.log('Characters reset');
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
