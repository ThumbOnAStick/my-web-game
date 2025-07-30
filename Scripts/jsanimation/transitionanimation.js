import { Animation } from "./animation.js";
import { Bone } from "./bone.js";

export class TransitionAnimation {
    constructor(fromAnimation, toAnimation, transitionDuration = 0.3) {
        this.fromAnimation = fromAnimation;
         /**@type {Animation} */
        this.toAnimation = toAnimation;
        this.transitionDuration = transitionDuration;
        this.currentTime = 0;
        this.isPlaying = false;
        this.isTransitioning = false;
        this.fromAngles = {}; // Store starting angles for each bone
        this.toAngles = {};   // Store target angles for each bone
    }

    start(rig) {
        // Handle zero or negative duration
        if (this.transitionDuration <= 0) {
            console.warn('Transition duration is zero or negative, applying instantly');
            this.isPlaying = false;
            this.isTransitioning = false;
            return;
        }
        
        this.isPlaying = true;
        this.isTransitioning = true;
        this.currentTime = 0;
        
        // Capture current bone angles as starting point
        this._captureCurrentAngles(rig);
        
        // Get target angles from the target animation's first frame
        this._captureTargetAngles(rig);
    }

    _captureCurrentAngles(rig) {
        this.fromAngles = {};
        this._captureBoneAngles(rig.rootBone, this.fromAngles);
    }

    _captureTargetAngles(rig) {
        this.toAngles = {};
        
        // Safely get target angles by reading animation keyframes directly
        this._getAnimationAnglesAtTime(this.toAnimation, 0, rig.rootBone, this.toAngles);
    }

    /**
     * Safely extract bone angles from animation keyframes without applying to rig
     * @param {Animation} animation 
     * @param {number} time 
     * @param {Bone} bone 
     * @param {Object} angleStorage 
     */
    _getAnimationAnglesAtTime(animation, time, bone, angleStorage) {
        // Get the angle for this bone at the specified time from keyframes
        const angle = this._getBoneAngleFromKeyframes(animation, bone.name, time);
        angleStorage[bone.name] = angle !== null ? angle : bone.angle; // Fallback to current angle
        
        // Recursively process children
        for (const child of bone.children) {
            this._getAnimationAnglesAtTime(animation, time, child, angleStorage);
        }
    }

    /**
     * Extract angle for a specific bone at a specific time from animation keyframes
     * @param {Animation} animation 
     * @param {string} boneName 
     * @param {number} time 
     * @returns {number|null}
     */
    _getBoneAngleFromKeyframes(animation, boneName, time) {
        const boneKeyframes = animation.keyframes.filter(kf => kf.boneName === boneName);
        
        if (boneKeyframes.length === 0) {
            return null; // No keyframes for this bone
        }

        // If time is 0 or before first keyframe, return first keyframe angle
        if (time <= boneKeyframes[0].time) {
            return boneKeyframes[0].angle;
        }

        // If time is after last keyframe, return last keyframe angle
        if (time >= boneKeyframes[boneKeyframes.length - 1].time) {
            return boneKeyframes[boneKeyframes.length - 1].angle;
        }

        // Find keyframes to interpolate between
        for (let i = 0; i < boneKeyframes.length - 1; i++) {
            const currentKf = boneKeyframes[i];
            const nextKf = boneKeyframes[i + 1];

            if (time >= currentKf.time && time <= nextKf.time) {
                // Linear interpolation between keyframes
                const progress = (time - currentKf.time) / (nextKf.time - currentKf.time);
                return currentKf.angle + (nextKf.angle - currentKf.angle) * progress;
            }
        }

        // Fallback (shouldn't reach here)
        return boneKeyframes[0].angle;
    }

    _captureBoneAngles(bone, angleStorage) {
        angleStorage[bone.name] = bone.angle;
        for (const child of bone.children) {
            this._captureBoneAngles(child, angleStorage);
        }
    }

    update(deltaTime) {
        if (!this.isPlaying) return false;

        // Cap deltaTime to prevent large jumps
        const cappedDeltaTime = Math.min(deltaTime, 0.033); // Cap at ~30fps
        this.currentTime += cappedDeltaTime;

        if (this.currentTime >= this.transitionDuration) {
            this.isPlaying = false;
            this.isTransitioning = false;
            return true; // Transition complete
        }

        return false; // Still transitioning
    }

    apply(rig) {
        if (!this.isTransitioning) return;
        
        const progress = Math.min(this.currentTime / this.transitionDuration, 1.0);
        // Use easing function for smoother transitions
        const easedProgress = this._easeInOutCubic(progress);
        this._applyTransitionToRig(rig, easedProgress);
    }

    _applyTransitionToRig(rig, progress) {
        this._interpolateBoneAngles(rig.rootBone, progress);
    }

    _interpolateBoneAngles(bone, progress) {
        const fromAngle = this.fromAngles[bone.name] || bone.angle;
        const toAngle = this.toAngles[bone.name] || bone.angle;
        
        // Linear interpolation with easing
        bone.angle = fromAngle + (toAngle - fromAngle) * progress;
        
        for (const child of bone.children) 
        {
            this._interpolateBoneAngles(child, progress);
        }
    }

    _easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    stop() {
        this.isPlaying = false;
        this.isTransitioning = false;
        this.currentTime = 0;
    }
}