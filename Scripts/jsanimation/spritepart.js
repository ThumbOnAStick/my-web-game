// Represents a visual part (sprite) attached to a bone
export class SpritePart 
{
    /**
     * 
     * @param {HTMLImageElement} image 
     * @param {number} width 
     * @param {number} height 
     * @param {number} angleOffset 
     */
    constructor(image, width, height, angleOffset = 0) 
    {
        this.image = image;
        this.width = width;
        this.height = height;
        this.angleOffset = angleOffset || 0; // Optional angle offset for rotation
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x
     * @param {number} y
     * @param {number} angle
     * @param {boolean} showDebug
     * @param {number} alpha
     * @param {number} size
     * @param {number} facingDirection
     */
    draw(ctx, x, y, angle, showDebug = false, alpha = 1, size = 1, facingDirection = 1) {
        ctx.save();
        ctx.globalAlpha = alpha;
        
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.rotate(this.angleOffset);
        
        // Scale the destination size, not the source
        const scaledWidth = this.width * size;
        const scaledHeight = this.height * size;
        
        ctx.drawImage(
            this.image,
            0, 0, this.image.width, this.image.height,  // Source: full image
            -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight  // Destination: scaled
        );
        ctx.restore();
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {HTMLCanvasElement} canvas
     */
    applyTransparency(ctx, canvas) 
    {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 0) 
            { // If pixel is not transparent
                data[i + 3] = 155;     // Apply transparency
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

}