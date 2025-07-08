// main.js
// Entry point for the web game - now using modular class structure

// @ts-ignore
import { GameManager } from './gamemanager.js';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('gameCanvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

// Create and initialize the game manager
const gameManager = new GameManager(canvas, ctx);

// Initialize and start the game
async function startGame() {
    try {
        await gameManager.initialize();
        gameManager.start();
    } catch (error) {
        console.error('Failed to start game:', error);
    }
}

// Start the game
startGame();
