import { Bone } from '../jsanimation/bone.js';
import { SpritePart } from '../jsanimation/spritepart.js';
import { Rig } from '../jsanimation/rig.js';
import { AnimationController } from '../jsanimation/animatoincontroller.js';
import { gameEventManager } from '../jsmanagers/eventmanager.js';
import * as EventHandler from '../jsutils/eventhandlers.js';
import { GameObject } from './gameobject.js';
import { Rigidbody } from '../jscomponents/rigidbody.js';
import { Resources } from '../jscomponents/resources.js';
import { CharacterCombatState } from '../jscomponents/charactercombatstate.js';

// Angle constants for better readability
const ANGLE_90_DEG = Math.PI / 2;
const ANGLE_120_DEG = (120 * Math.PI) / 180;
const ANGLE_60_DEG = (60 * Math.PI) / 180;
const ANGLE_30_DEG = (30 * Math.PI) / 180;

// Default configurations for each animation 
const animationDefaults = {
    'idle': { loop: true, autoPlay: true },     
    'swing': { loop: false },                  
    'dodge': { loop: false },                  
    'lightswing': { loop: false },              
    'stagger' : {loop: false}
};

// Animation transition durations (in seconds) for smooth switching between animations
const animationSettings = {
    'idle': { transitionDuration: 0.4 },         
    'swing': { transitionDuration: 0.2 },        
    'lightswing': { transitionDuration: 0.15 },  
    'dodge': { transitionDuration: 0.15 },     
    'stagger' : {transitionDuration : 0.5}
};

export class Character extends GameObject 
{
    constructor(x, y, width = 40, height = 60, resources, isOpponent = false) 
    {
        // Note: x, y represent the CENTER position of the character (root bone center)
        super(x, y, width, height); // Call parent constructor

        this.facing = 1;
        this.gravity = 1.5;
        this.jumpStrength = -20;
        this.movementSpeed = 5; // Speed of character movement
        this.isOpponent = isOpponent;
        this.headLength = 40;

        //#region Combat system
        /**@type {CharacterCombatState} */
        this.combatState = new CharacterCombatState();
        //#endregion

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

        
        // Merge defaults with custom options
        const finalOptions = { ...animationDefaults[name], ...options };
        
        // Apply loop setting
        if (finalOptions.loop !== undefined) 
        {
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

        const settings = animationSettings[name] || { transitionDuration: 0.3 };
        this.animationController.playAnimationWithTransition(name, settings.transitionDuration);
    }

    playHeavySwingAnimation() 
    {
        this.playAnimation('swing');
    }

    playLightSwingAnimation() 
    {
        this.playAnimation('lightswing');
    }

    playIdleAnimation(immediate = false) 
    {
        if (immediate) 
        {
            // Play immediately without transition
            this.animationController.playAnimation('idle');
        } 
        else
        {
            // Use normal transition
            this.playAnimation('idle');
        }
    }   

    playDodgeAnimation() 
    {
        this.playAnimation('dodge');
    }

    playStaggerAnimation(immediate = false) 
    {
        if (immediate) 
        {
            this.animationController.playAnimation('stagger');
        } 
        else
        {
            this.playAnimation('stagger');
        }
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

    cannotMove()
    {
        return !this.combatState.canMove();
    }

    /**
     * @param {number} dir
     */
    move(dir)
    {
        if(this.cannotMove())
        {
            return;
        }
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
    setSwinging(isSwinging) 
    {
        this.combatState.setSwinging(isSwinging);
    }

    /**
     * @param {boolean} isCharging 
     */
    setIsCharging(isCharging) 
    {
        this.combatState.setCharging(isCharging);
    }

    setDodging(isDodging)
    {
        this.combatState.setDodging(isDodging);
    }

    setParried(isParried)
    {
        this.combatState.setParried(isParried);
    }

    /**
     * @param {string} type 
     */
    setSwingType(type)
    {
        this.combatState.setSwingType(type);
    }

    getSwingHitboxLifetime()
    {
        return this.combatState.getSwingHitboxLifetime();
    }

    getSwingDamage()
    {
        return this.combatState.getSwingDamage();
    }

    getSwingRange()
    {
        return this.combatState.getSwingRange();
    }

    get swinging()
    {
        return this.combatState.swinging;
    }

    get dodging()
    {
        return this.combatState.dodging;
    }

    get swingType()
    {
        return this.combatState.swingType;
    }

    callHeavySwingEvent() 
    {
        gameEventManager.emit(EventHandler.characterSwingEvent, this);
    }

    callLightSwingEvent() 
    {
        gameEventManager.emit(EventHandler.characterLightSwingEvent, this);
    }

    performHeavyattack() 
    {
        if (this.combatState.canAttack()) 
        {
            this.setSwingType('heavy');
            this.playHeavySwingAnimation();
            // Calls for a swing event
            this.callHeavySwingEvent();
        }
    }

    performLightAttack() 
    {
        if (this.combatState.canAttack()) 
        {
            this.setSwingType('light');
            this.playLightSwingAnimation();
            // Calls for a light swing event
            this.callLightSwingEvent();
        }
    }
    //#endregion

    //#region Score System
    /**
     * 
     * @param {Number} amount 
     * @returns 
     */
    loseScore(amount) 
    {
        if (this.defeated) return;
        
        this.currentScore = Math.max(0, this.currentScore - amount);

        gameEventManager.emit(EventHandler.setScoreChangesEvent,{value: -amount, character: this}); // Notify event manager
        
        if (this.currentScore <= 0) 
        {
            this.defeated = true;
            // To be implemented - defeat animation
        }
        else
        {
            // Dodged
        }
    }

    resetScore()
    {
        this.currentScore = 50;
        this.defeated = false;
    }

    score(amount) 
    {
        if (this.defeated) return;
        this.currentScore = Math.min(this.maxScore, this.currentScore + amount); 
        gameEventManager.emit(EventHandler.setScoreChangesEvent, {value: amount, character: this}); // Notify event manager
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
    
    shouldPlayIdleAnimation()
    {
        if(this.combatState.swinging)
        {
            return false;
        }

        return this.animationController.currentAnimation != this.animationController.animations['idle'] && 
            this.animationController.currentAnimation && 
            !this.animationController.currentAnimation.isPlaying &&
            !this.animationController.isTransitioning();
    }

    updateIdleAnimation()
    {
        if(this.shouldPlayIdleAnimation())
        {
            this.playIdleAnimation();
        }
    }
    
    /**
     * @param {HTMLCanvasElement} canvas
     */
    update(canvas) 
    {
        // update idle states
         this.updateIdleAnimation();

        // Update animation controller
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