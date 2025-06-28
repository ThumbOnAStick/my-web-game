// obstacle.js
// A trigger area, reacts when touched

export class Obstacle {
    constructor(x, y, width, height, destroyedOnTouch = false, speed = 6) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = 1;
    }

    flip()
    {
        this.direction *= -1; // Reverse direction
        this.x += this.width * 2 * this.direction; // Move to the other side
    }

    /** @param characterCoordinate @type {{x: number, y: number}} */
    /** @returns {boolean} */
    update(characterCoordinate = null) 
    {
        this.x += this.speed * this.direction;
        // Collition detection
        if (characterCoordinate) {
            if (this.x < characterCoordinate.x + 50 && // Assuming character width is 50
                this.x + this.width > characterCoordinate.x &&
                this.y < characterCoordinate.y + 60 && // Assuming character height is 60
                this.y + this.height > characterCoordinate.y) {
                return true; // Collision detected
            }
        }
        return false;
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
