// main.js
// Entry point for the web game

import { Character } from './character.js';
import { Obstacle } from './obstacle.js';
import { Resources } from './Resources.js';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('gameCanvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
const debugCheckbox = document.getElementById('debugCheckbox');
const resources = new Resources();
const spriteNames = ['head', 'body', 'weapon'];
const spritePaths = ['./Assets/Head.png', './Assets/Body.png', './Assets/Sword.png']; 
const obstacles = [];
/** @type {Character} */
let character = null; // Character will be an instance of Character class after loading
let score = 0;
let gameOver = false;
let resourcesLoaded = false;

// Track key states for movement
const keys = {
    a: false,
    d: false
};

function spawnObstacle() {
    const height = 40 + Math.random() * 40;
    const y = canvas.height - height;
    obstacles.push(new Obstacle(canvas.width, y, 30, height));
}

function drawLoadingImageResources()
{
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Loading Images...', canvas.width / 2 - 100, canvas.height / 2);
}

function loadResources() {
    drawLoadingImageResources();
    function onLoad() {

        loadCharacter();

        // Load animation after character is created
        loadAnimation();
        
        resourcesLoaded = true;
        update();  
        console.log('All Resources loaded successfully');
    }
    // Use Resources class to load images
    resources.loadAllImages(spriteNames, spritePaths, onLoad);
}

/**
 * Loads and initializes the character
 * @returns {Promise<void>}
 */
async function loadCharacter() 
{
    character = new Character(50, canvas.height - 100, resources); // Instantiate only after images are loaded   
}

/**
 * Loads character animations
 * @returns {Promise<void>}
 */
async function loadAnimation() {
    try {
        // Load only existing animations
        await character.loadAnimation('idle', './Assets/character_idle_animation.csv');
        await character.loadAnimation('swing', './Assets/character_swing_animation.csv');
        console.log('Animations loaded successfully');
    } catch (error) {
        console.error('Failed to load animations:', error);
    }
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
    
    // Handle movement input
    if (character) {
        if (keys.a) {
            character.move(-1, canvas); // Move left
        }
        if (keys.d) {
            character.move(1, canvas); // Move right
        }
    }
    
    character.update(canvas);
    character.draw(ctx, resources, debugCheckbox.checked);

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
    character.velocityY = 0;
    character.grounded = true;
    character.wasGrounded = true;
    gameOver = false;
    score = 0;
    obstacles.length = 0; // Clear obstacles in place
    
    // Restart with idle animation
    character.playIdleAnimation();
}

// Controls
window.addEventListener('keydown', (e) => {
    if (!character) return; // Type guard
    
    if (e.code === 'Space') {
        character.jump();
    } else if (e.code === 'KeyR' && gameOver) {
        resetGame();
    } else if (e.code === 'KeyA') {
        keys.a = true;
    } else if (e.code === 'KeyD') {
        keys.d = true;
    }

    if(e.code == 'KeyJ'){
        character.attack();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyA') {
        keys.a = false;
    } else if (e.code === 'KeyD') {
        keys.d = false;
    }
});



// Debug checkbox event listener
debugCheckbox.addEventListener('change', () => {
    canvas.focus();
});


// Make canvas focusable
canvas.setAttribute('tabindex', '0');

// Load resources and start the game
loadResources();
// Remove update() call from global scope, it is now called after loading completes

// Obstacle spawn interval
setInterval(() => {
    // if (!gameOver) spawnObstacle();
}, 1500);
