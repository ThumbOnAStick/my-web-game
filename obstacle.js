// obstacle.js
// A trigger area, reacts when touched

export class Obstacle 
{
    constructor(x, y, width, height, creationTicks, destroyedOnTouch = false, speed = 0, duration = 0, id = 1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.creationTicks = creationTicks;
        this.direction = 1;
        this.destroyedOnTouch = destroyedOnTouch;
        // Duration is one second per unit. 
        this.duration = duration;
        this.id = id;
    }

    flip()
    {
        this.direction *= -1; // Reverse direction
        this.x += this.width * 2 * this.direction; // Move to the other side
    }

    /** @param characterCoordinate @type {{x: number, y: number}} */
    /** @returns {boolean} */
    collideWithCharacter(characterCoordinate = null, characterId = null) 
    {
         // Collision detection: check if point is inside rectangle
        if (characterCoordinate && characterId != this.id) 
        {
             if (
                characterCoordinate.x >= this.x &&
                characterCoordinate.x <= this.x + this.width &&
                characterCoordinate.y >= this.y &&
                characterCoordinate.y <= this.y + this.height
            ) {
                return true; // Collision detected
            }
        }
        return false;
    }

    /** @returns  {boolean}*/
    shouldDestroy(tick)
    {
        return tick > this.creationTicks + this.duration * 1000;
    }

    draw(ctx, showDebug = false) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw red dot in debug mode
        if (showDebug) {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
