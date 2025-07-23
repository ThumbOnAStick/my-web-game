// Represents a visual part (sprite) attached to a bone
export class SpritePart {
    constructor(image, width, height, angleOffset = 0) {
        this.image = image;
        this.width = width;
        this.height = height;
        this.angleOffset = angleOffset || 0; // Optional angle offset for rotation
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx, x, y, angle, showDebug = false, alpha = 1) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.rotate(this.angleOffset);
        ctx.drawImage(
            this.image,
            0, 0, this.image.width, this.image.height,
            -this.width / 2, -this.height / 2, this.width, this.height
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