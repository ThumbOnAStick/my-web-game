import { Resources } from './resources.js';
import { Bone, SpritePart, Rig } from './Animnation.js';

// Angle constants for better readability
const ANGLE_90_DEG = Math.PI / 2;
const ANGLE_120_DEG = (120 * Math.PI) / 180;

export class Character {
    constructor(x, y, resources) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.velocityY = 0;
        this.gravity = 1.5;
        this.jumpStrength = -20;
        this.grounded = true;        // --- Rigging system setup ---
        // Create bones
        this.bodyBone = new Bone('body', 30, -ANGLE_90_DEG, null); // root bone
        this.neckBone = new Bone('neck', 5, 0, this.bodyBone); // Structural(Not visible)
        this.headBone = new Bone('head', 40, 0, this.neckBone);
        this.armBone = new Bone('arm', 20, ANGLE_120_DEG, this.bodyBone); // Structural(Not visible)
        this.weaponBone = new Bone('weapon', 20, -ANGLE_90_DEG, this.armBone);
        this.bodyBone.addChild(this.neckBone);
        this.bodyBone.addChild(this.armBone);
        this.neckBone.addChild(this.headBone);
        this.armBone.addChild(this.weaponBone);

        // Create rig
        this.rig = new Rig(this.bodyBone);        // Attach sprite parts (images must be loaded in resources)
        this.rig.addPart('body', new SpritePart(resources.getImage('body'), 40, 60, ANGLE_90_DEG));
        this.rig.addPart('head', new SpritePart(resources.getImage('head'), 40, 40));
        this.rig.addPart('weapon', new SpritePart(resources.getImage('weapon'), 20, 50, ANGLE_90_DEG));
    }

    update() {
        this.y += this.velocityY;
        if (!this.grounded) {
            this.velocityY += this.gravity;
        }
        // Ground collision
        if (this.y + this.height >= 400) { // Assuming canvas height is 400
            this.y = 400 - this.height;
            this.velocityY = 0;
            this.grounded = true;
        }
    }

    jump()
    {
        if (this.grounded) {
            this.velocityY = this.jumpStrength;
            this.grounded = false;
        }
    } 
    
    draw(ctx, resources, showDebug = true) {
        // Set root bone position to character's position
        this.bodyBone.position.x = this.x + this.width / 2;
        this.bodyBone.position.y = this.y + this.height / 2;
        // Draw the rig (body, head, weapon)
        this.rig.draw(ctx, resources, showDebug);
    }

    collidesWith(obstacle) {
        return (
            this.x < obstacle.x + obstacle.width &&
            this.x + this.width > obstacle.x &&
            this.y < obstacle.y + obstacle.height &&
            this.y + this.height > obstacle.y
        );
    }
}
