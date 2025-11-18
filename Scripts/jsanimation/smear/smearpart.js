import { SpritePart } from "../spritepart.js";

export class SmearPart {


    /**
     * 
     * @param {*} options 
     * @param {Number} creationFrame 
     * @param {Number} lifetime
     */
    constructor(options, creationFrame, lifetime = 10){
        this.options = options;
        this.creationFrame = creationFrame;
        this.lifetime = lifetime;
        this.alpha = 1;
    }

    /**
     * @param {Number} currentFrame
     * @returns {boolean}
     */
    shouldDrop(currentFrame) {
        return currentFrame > this.creationFrame + this.lifetime 
    }

    /**
     * 
     * @param {SpritePart} spritePart 
     */
    draw(spritePart) {
        this.alpha -= 0.1;
        let ctx = this.options.ctx;
        let x = this.options.x;
        let y = this.options.y;
        let width = this.options.width;
        let height = this.options.height;
        let size = this.options.size;
        let angle = this.options.angle;
        let angleOffset = this.options.angleOffset
        let image = spritePart.image;
        ctx.save();
        ctx.globalAlpha = Math.min(this.options.alpha, this.alpha);
        
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.rotate(angleOffset);
        
        // Scale the destination size, not the source
        const scaledWidth = width * size;
        const scaledHeight = height * size;
        
        ctx.drawImage(
            image,
            0, 0, image.width, image.height,  // Source: full image
            -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight  // Destination: scaled
        );
        ctx.restore();
    }
}