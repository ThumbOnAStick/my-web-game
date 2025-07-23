import { GameObject } from "../jsgameobjects/gameobject.js";

export class Rigidbody
{
    /**
     * @param {*} offsetX 
     * @param {*} offsetY 
     * @param {*} movementSpeed 
     * @param {Number} drag
     */
    constructor(offsetX, offsetY, movementSpeed, drag = 2.5) 
    {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.velocityY = 0;
        this.velocityX = 0;
        this.drag = drag;
        this.mass = 1;
        this.movementSpeed = movementSpeed;
        this.gravity = 0.5; // Add missing gravity property
    }

    move(dir)
    {
        this.velocityX = this.movementSpeed * dir;
    }

    /**
     * @param {GameObject} self
     * @param {GameObject} other
     * @param {Number} amount
     */
    applyForceTo(amount, self, other, applyHorizontal = true, applyVertical = false, checkSource = false)
    {
        let target = other;
        if(checkSource && other.source)
        {
            target = other.source;
        }
        const forceHorizontal = applyHorizontal? target.x - self.x : 0;
        const forceVertical = applyVertical? target.y - self.y : 0;
        this.applyForce(amount, forceHorizontal, forceVertical);
    }

    /**
     * 
     * @param {Number} amount 
     * @param {Number} forceHorizontal 
     * @param {Number} forceVertical 
     * @returns 
     */
    applyForce(amount, forceHorizontal, forceVertical = 0)
    {
        // Normalize direction
        const length = Math.sqrt(forceHorizontal * forceHorizontal + forceVertical * forceVertical);
        if (length === 0) return;

        this.velocityX = (amount * forceHorizontal) / length;
        this.velocityY = (amount * forceVertical) / length;
    }

    /**@param {HTMLCanvasElement} canvas */
    /**@param {GameObject} gameObject */
    update(canvas = null, gameObject = null)
    {
        if(!canvas || !gameObject) return;

        //#region Horizontal checks
        if(Math.abs(this.velocityX) > 0.1)
        {
            // Move the object when velocityX is greater than 0.1
            gameObject.x += this.velocityX;
            this.velocityX *= (1 - this.drag * 0.1);            
        }

        if (gameObject.x - this.offsetX < 0) // Left Boundary 
        {
            gameObject.x = this.offsetX;
        } 
        else if (gameObject.x + gameObject.width > canvas.width) // Right Boundary
        {
            gameObject.x = canvas.width - gameObject.width;
        }
        //#endregion

        //#region Vertical checks
        if (!gameObject.grounded) 
        {
            gameObject.y += this.velocityY; // Apply vertical movement
            this.velocityY += this.gravity;
        }
        if (gameObject.y + this.offsetY >= canvas.height) 
        {
            gameObject.y = canvas.height - this.offsetY;
            this.velocityY = 0;
            gameObject.grounded = true;
        } else {
            gameObject.grounded = false;
        }
        //#endregion

    }
 
    
}
