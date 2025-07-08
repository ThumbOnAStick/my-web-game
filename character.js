import { Bone, SpritePart, Rig, AnimationController } from './animnation.js';

// Angle constants for better readability
const ANGLE_90_DEG = Math.PI / 2;
const ANGLE_120_DEG = (120 * Math.PI) / 180;
const ANGLE_60_DEG = (60 * Math.PI) / 180;
const ANGLE_30_DEG = (30 * Math.PI) / 180;

export class Character {
    constructor(x, y, height = 60, resources, isOpponent = false) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = height;
        this.velocityY = 0;
        this.dir = 1;
        this.gravity = 1.5;
        this.jumpStrength = -20;
        this.movementSpeed = 5; // Speed of character movement
        this.grounded = true;      
        this.swinging = false; // Track if currently swinging
        this.isOpponent = isOpponent;

        // Health system
        this.maxScore = 100;
        this.currentScore = this.maxScore;
        this.isDead = false;
        
        // --- Rigging system setup ---
        // Create bones
        this.bodyBone = new Bone('body', 30, 0, null); // root bone
        this.neckBone = new Bone('neck', 10, ANGLE_30_DEG, this.bodyBone); // Structural(Not visible)
        this.headBone = new Bone('head', 40, ANGLE_30_DEG, this.neckBone);
        this.armBone = new Bone('arm', 30, ANGLE_120_DEG, this.bodyBone); // Structural(Not visible)
        this.weaponBone = new Bone('weapon', 20, -ANGLE_90_DEG, this.armBone);
        this.bodyBone.addChild(this.neckBone);
        this.bodyBone.addChild(this.armBone);
        this.neckBone.addChild(this.headBone);
        this.armBone.addChild(this.weaponBone);

        // Create rig
        this.rig = new Rig(this.bodyBone);        
        
        // Attach sprite parts (images must be loaded in resources)
        this.rig.addPart('body', new SpritePart(resources.getImage('body'), 40, 60, ANGLE_90_DEG));
        this.rig.addPart('head', new SpritePart(resources.getImage('head'), 40, 40));
        this.rig.addPart('weapon', new SpritePart(resources.getImage('weapon'), 20, 50, ANGLE_90_DEG));

        // Animation system
        this.animationController = new AnimationController(this.rig);
        this.wasGrounded = true; // Track previous grounded state
    }

    async loadAnimation(name, animationPath, options = {}) {
        await this.animationController.loadAnimation(name, animationPath);
        
        // Only proceed if animation was successfully loaded
        if (!this.animationController.animations[name]) {
            console.warn(`Animation '${name}' failed to load from ${animationPath}`);
            return false;
        }
        
        // Predefined animation defaults (only for existing animations)
        const animationDefaults = {
            'idle': { loop: true, autoPlay: true },
            'swing': { loop: false }
        };
        
        // Merge defaults with custom options
        const finalOptions = { ...animationDefaults[name], ...options };
        
        // Apply loop setting
        if (finalOptions.loop !== undefined) {
            this.animationController.animations[name].loop = finalOptions.loop;
        }
        
        // Auto-play if requested
        if (finalOptions.autoPlay) {
            this.animationController.playAnimation(name);
        }
        
        return true;
    }

    /** @returns {{x: number, y: number}} */
    selfCoordinate()
    {
        return { x: this.x, y: this.y};
    }

    playSwingAnimation() {
        if (this.animationController.animations.swing) {
            this.swinging = true; // Set swinging state
            // Use smooth transition for swing animation
            this.animationController.playAnimationWithTransition('swing', 0.2);
        } else {
            console.warn('Swing animation not loaded');
        }
    }

    playIdleAnimation() {
        if (this.animationController.animations.idle) {
            this.swinging = false; // Clear swinging state
            // Use smooth transition for idle animation
            this.animationController.playAnimationWithTransition('idle', 0.4);
        } else {
            console.warn('Idle animation not loaded');
        }
    }   

    /**@param canvas @type {HTMLCanvasElement}  */
    update(canvas) 
    {
        // Check if swing animation finished and switch back to idle
        if (this.swinging && 
            this.animationController.currentAnimation === this.animationController.animations.swing && 
            this.animationController.currentAnimation && 
            !this.animationController.currentAnimation.isPlaying &&
            !this.animationController.isTransitioning()) {
            this.playIdleAnimation();
        }

        // Update animation
        this.animationController.update();

        this.y += this.velocityY;
        if (!this.grounded) {
            this.velocityY += this.gravity;
        }
        
        // Ground collision
        if (this.y + this.height >= canvas.height) { // Assuming canvas height is 400
            this.y = canvas.height - this.height;
            this.velocityY = 0;
            
            // Check if just landed
            if (!this.grounded && this.wasGrounded !== this.grounded && !this.swinging) 
            {
                this.playIdleAnimation();
            }
            
            this.grounded = true;
        }
        
        // Update previous grounded state
        this.wasGrounded = this.grounded;
    }

    jump() 
    {
        if (this.grounded) {
            this.velocityY = this.jumpStrength;
            this.grounded = false;
        }
    } 

    /** @param canvas  @type {HTMLCanvasElement} */
    move(dir, canvas)
    {
        this.x += dir * this.movementSpeed;
        this.dir = dir; // Update direction
        // Boundary check for canvas edges
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }

    }

    attack()
    {
        if (!this.swinging) {
            this.playSwingAnimation();
        }
    }

    // Health system methods
    takeDamage(amount) {
        if (this.isDead) return;
        
        this.currentScore = Math.max(0, this.currentScore - amount);
        
        if (this.currentScore <= 0) {
            this.isDead = true;
            // Could trigger death animation here
        }
    }

    heal(amount) {
        if (this.isDead) return;
        
        this.currentScore = Math.min(this.maxScore, this.currentScore + amount);
    }

    getScorePercentage() {
        return this.currentScore / this.maxScore;
    }
    
    draw(ctx, resources, showDebug = true) {
        // Set root bone position to character's position
        this.bodyBone.position.x = this.x + this.width / 2;
        this.bodyBone.position.y = this.y + this.height / 2;
        // Draw the rig (body, head, weapon)
        this.rig.draw(ctx, resources, showDebug, this.dir > 0 ? 1 : -1);
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
