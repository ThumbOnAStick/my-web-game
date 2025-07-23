import { Animation } from "./animation.js";
import { Rig } from "./rig.js";
import { TransitionAnimation } from "./transitionanimation.js";

export class AnimationController
{
    /**
     * 
     * @param {Rig} rig 
     */
    constructor(rig) {
        this.rig = rig;
        /**@type {Object<string, Animation>} */
        this.animations = {};
        this.currentAnimation = null;
        this.lastTime = 0;
        this.transition = null;
        this.pendingAnimation = null; // Animation to play after transition
    }

    async loadAnimation(name, csvPath) {
        const animation = await Animation.loadFromCSV(csvPath);
        if (animation && animation.keyframes.length > 0) {
            this.animations[name] = animation;
            if (!this.currentAnimation) {
                this.currentAnimation = animation;
                this.currentAnimation.play();
            }
            return true;
        } else {
            console.warn(`Failed to load animation '${name}' from ${csvPath}`);
            return false;
        }
    }

    playAnimation(name, useTransition = true, transitionDuration = 0.3) 
    {
        if (!this.animations[name]) {
            console.warn(`Animation '${name}' not found. Available animations:`, Object.keys(this.animations));
            return;
        }

        const targetAnimation = this.animations[name];

        // If same animation or no current animation, play directly
        if (!useTransition || !this.currentAnimation || this.currentAnimation === targetAnimation) {
            this._playAnimationDirect(targetAnimation);
            return;
        }

        // Start transition
        this.transition = new TransitionAnimation(this.currentAnimation, targetAnimation, transitionDuration);
        this.transition.start(this.rig);
        this.pendingAnimation = targetAnimation;
    }

    /**
     * 
     * @param {Animation} animation 
     */
    _playAnimationDirect(animation) {
        this.currentAnimation = animation;
        this.currentAnimation.stop();
        this.currentAnimation.play();
        this.transition = null;
        this.pendingAnimation = null;
    }

    update() {
        const currentTime = performance.now() / 1000; // Convert to seconds
        const deltaTime = this.lastTime === 0 ? 0 : currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Handle transition
        if (this.transition && this.transition.isTransitioning) {
            const transitionComplete = this.transition.update(deltaTime);
            this.transition.apply(this.rig);
            
            if (transitionComplete) {
                // Transition finished, switch to pending animation
                this._playAnimationDirect(this.pendingAnimation);
            }
            return; // Don't update main animation during transition
        }

        // Normal animation update
        if (this.currentAnimation) {
            this.currentAnimation.update(deltaTime);
            this.currentAnimation.apply(this.rig);
        }
    }

    // Convenience methods for common transitions
    playAnimationWithTransition(name, duration = 0.3) 
    {
        this.playAnimation(name, true, duration);
    }

    playAnimationInstant(name) {
        this.playAnimation(name, false);
    }

    isTransitioning() {
        return this.transition && this.transition.isTransitioning;
    }
}