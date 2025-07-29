// main.js
// Entry point for the web game - now using modular class structure

// @ts-ignore
import { GameManager } from './jsmanagers/gamemanager.js';

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('gameCanvas'));
const ctx =/** @type {CanvasRenderingContext2D} */ canvas.getContext('2d');

// Create and initialize the game manager
const gameManager = new GameManager(canvas, ctx);

// Initialize and start the game
async function startGame() {
    try 
    {
        await gameManager.initialize();
        gameManager.start();
    } catch (error) {
        console.error('Failed to start game:', error);
    }
}

// Start the game
startGame();
