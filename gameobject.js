export class GameObject 
{
    constructor(x, y, width = 0, height = 0)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = crypto.randomUUID();
    }

    /**@param canvas @type {HTMLCanvasElement}  */
    update(canvas) 
    {
        // Base implementation - can be overridden by subclasses
    }

    /**@param ctx @type {CanvasRenderingContext2D} */
    draw(ctx, showDebug = false) 
    {
        // Base implementation - can be overridden by subclasses
        if (showDebug) {
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    /** @returns {{x: number, y: number}} */
    getPosition()
    {
        return { x: this.x, y: this.y };
    }

    collidesWith(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }
}