import { Bone, SpritePart, Rig, AnimationController } from './animnation.js';
import { gameEventManager } from './eventmanager.js';
import * as EventHandler from './eventhandlers.js';
import { GameObject } from './gameobject.js';
import { Rigidbody } from './rigidbody.js';
import { Resources } from './resources.js';

// Angle constants for better readability
const ANGLE_90_DEG = Math.PI / 2;
const ANGLE_120_DEG = (120 * Math.PI) / 180;
const ANGLE_60_DEG = (60 * Math.PI) / 180;
const ANGLE_30_DEG = (30 * Math.PI) / 180;

export class Character extends GameObject 
{
    constructor(x, y, width = 40, height = 60, resources, isOpponent = false) {
        // Note: x, y represent the CENTER position of the character (root bone center)
        super(x, y, width, height); // Call parent constructor

        this.facing = 1;
        this.gravity = 1.5;
        this.jumpStrength = -20;
        this.movementSpeed = 5; // Speed of character movement
        this.swinging = false; // Track if currently swinging
        this.isOpponent = isOpponent;
        this.characterId = crypto.randomUUID();
        this.headLength = 40;

        //#region rigidbody system
        /**@type {Rigidbody} */
        this.rigidbody = new Rigidbody(this.width/2, this.height/2, this.movementSpeed);
        //#endregion

        //#region Score system
        this.maxScore = 100;
        this.currentScore = 50; // Starting score
        this.defeated = false;
        //#endregion 
        
        //#region Animation setup
        // Create bones
        this.bodyBone = new Bone('body', 30, 0, null); // root bone
        this.neckBone = new Bone('neck', 10, ANGLE_30_DEG, this.bodyBone); // Structural(Not visible)
        this.headBone = new Bone('head', this.headLength, ANGLE_30_DEG, this.neckBone);
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
        this.animationController = /**@type {AnimationController} */ new AnimationController(this.rig);
        this.wasGrounded = true; // Track previous grounded state
        //#endregion
    }

    //#region Animation System
    async loadAnimation(name, animationPath, options = {}) 
    {
        await this.animationController.loadAnimation(name, animationPath);
        
        // Only proceed if animation was successfully loaded
        if (!this.animationController.animations[name]) {
            console.warn(`Animation '${name}' failed to load from ${animationPath}`);
            return false;
        }
        
        // Predefined animation defaults (only for existing animations)
        const animationDefaults = 
        {
            'idle': { loop: true, autoPlay: true },
            'swing': { loop: false },
            'dodge': { loop: false }
        };
        
        // Merge defaults with custom options
        const finalOptions = { ...animationDefaults[name], ...options };
        
        // Apply loop setting
        if (finalOptions.loop !== undefined) {
            this.animationController.animations[name].loop = finalOptions.loop;
        }
        
        // Auto-play if requested
        if (finalOptions.autoPlay) 
        {
            this.animationController.playAnimation(name);
        }
        
        return true;
    }

    /**
     * @param {string} name - Animation name ('idle', 'swing', 'dodge', etc.)
     */
    playAnimation(name) 
    {
        if (!this.animationController.animations[name]) {
            console.warn(`Animation '${name}' not loaded`);
            return;
        }

        // Animation-specific settings
        const animationSettings = {
            'idle': { transitionDuration: 0.4 },
            'swing': { transitionDuration: 0.2 },
            'dodge': { transitionDuration: 0.15 }
        };

        const settings = animationSettings[name] || { transitionDuration: 0.3 };
        this.animationController.playAnimationWithTransition(name, settings.transitionDuration);
    }

    playHeavySwingAnimation() 
    {
        this.setSwinging(true);
        this.playAnimation('swing');
    }

    playIdleAnimation() 
    {
        this.setSwinging(false);
        this.playAnimation('idle');
    }   

    playDodgeAnimation() 
    {
        this.playAnimation('dodge');
    }
    //#endregion

    //#region Movement and Physics
    jump() 
    {
        if (this.grounded) 
        {
            this.grounded = false;
            console.log('try to jump');
            this.rigidbody.applyForce(10,0,-1)
        }
    } 

    /**
     * @param {number} dir
     */
    move(dir)
    {
        this.facing = dir; // Set facing for animation
        this.rigidbody.move(dir);
    }

    /**
     * 
     * @param {GameObject} other 
     */
    adjustHitFacing(other)
    {
        const direction = other.x - this.x;
        this.facing = direction > 0? 1 : -1;
    }

    flip()
    {
        this.facing = -this.facing;
    }
    //#endregion

    //#region Combat System
    /**
     * @param {boolean} isSwinging 
     */
    setSwinging(isSwinging) {
        this.swinging = isSwinging;
    }

    callSwingEvent() {
        gameEventManager.emit(EventHandler.characterSwingEvent, this);
    }

    performHeavyattack() 
    {
        if (!this.swinging) {
            this.playHeavySwingAnimation();
        }
        // Calls for a swing event
        this.callSwingEvent();
    }
    //#endregion

    //#region Score System
    /**
     * 
     * @param {Number} amount 
     * @returns 
     */
    takeDamage(amount) 
    {
        if (this.defeated) return;
        
        this.currentScore = Math.max(0, this.currentScore - amount);
        
        if (this.currentScore <= 0) 
        {
            this.defeated = true;
            // To be implemented - defeat animation
        }
        else
        {
            // Dodged
            this.playDodgeAnimation();
        }
    }

    score(amount) {
        if (this.defeated) return;
        
        this.currentScore = Math.min(this.maxScore, this.currentScore + amount);
    }

    getScorePercentage() {
        return this.currentScore / this.maxScore;
    }
    //#endregion

    //#region Utility Functions
    /** @returns {{x: number, y: number}} */
    selfCoordinate()
    {
        // Return the center position of the root bone (character's center)
        return {x : this.x, y : this.y};
    }

    collidesWith(obstacle) {
        // Character position is center, so calculate collision bounds from center
        const charLeft = this.x - this.width / 2;
        const charRight = this.x + this.width / 2;
        const charTop = this.y - this.height / 2;
        const charBottom = this.y + this.height / 2;
        
        return (
            charLeft < obstacle.x + obstacle.width &&
            charRight > obstacle.x &&
            charTop < obstacle.y + obstacle.height &&
            charBottom > obstacle.y
        );
    }
    //#endregion

    //#region Core Update and Rendering
    /**
     * @param {HTMLCanvasElement} canvas
     */
    update(canvas) 
    {
        // Check if other animation finished and switch back to idle
        if (this.swinging && 
            this.animationController.currentAnimation != this.animationController.animations['idle'] && 
            this.animationController.currentAnimation && 
            !this.animationController.currentAnimation.isPlaying &&
            !this.animationController.isTransitioning()) {
            this.playIdleAnimation();
        }

        // Update animation
        this.animationController.update();

        // Update rigidbody
        this.rigidbody.update(canvas, this);
    }

    /**
     * 
     * @param {*} ctx 
     * @param {Resources} resources 
     * @param {*} showDebug 
     */
    draw(ctx, resources, showDebug = true) 
    {
        // Draw position with red dot at character center (root bone position)
        if (showDebug) {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        // Set root bone position directly to character's center position
        this.bodyBone.position.x = this.x;
        this.bodyBone.position.y = this.y;
        // Draw the rig (body, head, weapon)
        this.rig.draw(ctx, resources, showDebug, this.facing > 0 ? 1 : -1);
    }
    //#endregion
}