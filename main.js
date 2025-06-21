// main.js
// Entry point for the web game

import { Character } from './character.js';
import { Obstacle } from './obstacle.js';
import { Resources } from './Resources.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resources = new Resources();
const character = new Character(50, canvas.height - 100);
const spriteNames = ['head', 'body'];  
const spritePaths = ['./Assets/Head.png', './Assets/Body.png']; 
const obstacles = [];
let score = 0;
let gameOver = false;
let resourcesLoaded = false;

function spawnObstacle() {
    const height = 40 + Math.random() * 40;
    const y = canvas.height - height;
    obstacles.push(new Obstacle(canvas.width, y, 30, height));
}

function drawLoadingResources()
{
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Loading resources...', canvas.width / 2 - 100, canvas.height / 2);
}

function loadResources() {
    drawLoadingResources();
    function onLoad() {
        resourcesLoaded = true;
        update();  
        console.log('All Resources loaded successfully');
    }
    // Use Resources class to load images
    resources.loadAll(spriteNames, spritePaths, onLoad);
}

function drawGameOver(){
    ctx.font = '40px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
}

function update() {
    if (gameOver) 
    {
        drawGameOver();
        requestAnimationFrame(update);
        return;
    }
    requestAnimationFrame(update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    character.update();
    character.draw(ctx, resources);

    // Update and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update();
        obstacles[i].draw(ctx);
        // Collision detection
        if (character.collidesWith(obstacles[i])) {
            gameOver = true;
        }
        // Remove off-screen obstacles
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
        }
    }

    // Draw score
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 30);


}

function resetGame() {
    character.y = canvas.height - 100;
    gameOver = false;
    score = 0;
    obstacles.length = 0; // Clear obstacles in place
}

// Controls
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        character.jump();
    } else if (e.code === 'KeyR' && gameOver) {
        resetGame();
    }
});

// Load resources and start the game
loadResources();
// Remove update() call from global scope, it is now called after loading completes

// Obstacle spawn interval
setInterval(() => {
    if (!gameOver) spawnObstacle();
}, 1500);
