// Entry point for the web game
import Game from './game.js';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

let game;

function init() {
    game = new Game(ctx);
    game.start();
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    game.update();
    game.render();
    requestAnimationFrame(gameLoop);
}

window.onload = init;