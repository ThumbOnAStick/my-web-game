import { GameObject } from "./gameobject.js";

export class Obstacle extends GameObject
{
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {*} width 
     * @param {*} height 
     * @param {*} creationTicks 
     * @param {boolean} destroyedOnTouch 
     * @param {*} speed 
     * @param {*} duration 
     * @param {*} id 
     * @param {GameObject} source
     */
    constructor(x, y, width, height, creationTicks, destroyedOnTouch = false, speed = 0, duration = 0, id = null, source = null) {
        super(x, y, width, height, source); // Call GameObject constructor
        
        // Obstacle-specific properties
        this.speed = speed;
        this.creationTicks = creationTicks;
        this.direction = 1;
        this.destroyedOnTouch = destroyedOnTouch;
        this.duration = duration; // Duration is one second per unit
        this.id = id; // Override GameObject's UUID with custom id
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
                characterCoordinate.x >= this.getCenterX() &&
                characterCoordinate.x <= this.getCenterX() + this.width &&
                characterCoordinate.y >= this.getCenterY() &&
                characterCoordinate.y <= this.getCenterY() + this.height
            ) 
            {
               console.log(`Collision detected! ${this.id},,,,, ${characterId}`)
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

    getCenterX()
    {
        return this.x - this.width/2;
    }

    getCenterY()
    {
        return this.y - this.height/2;
    }

    // Override GameObject's draw method
    draw(ctx, resources = null, showDebug = false) {
        ctx.save();
        ctx.fillStyle = 'green';
        ctx.globalAlpha = 0.2;
        ctx.fillRect(this.getCenterX(), this.getCenterY(), this.width, this.height);
        ctx.restore();
        
        // Draw red dot in debug mode
        if (showDebug) 
        {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}