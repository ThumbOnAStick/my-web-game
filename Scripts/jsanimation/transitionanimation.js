export class TransitionAnimation {
    constructor(fromAnimation, toAnimation, transitionDuration = 0.3) {
        this.fromAnimation = fromAnimation;
        this.toAnimation = toAnimation;
        this.transitionDuration = transitionDuration;
        this.currentTime = 0;
        this.isPlaying = false;
        this.isTransitioning = false;
        this.fromAngles = {}; // Store starting angles for each bone
        this.toAngles = {};   // Store target angles for each bone
    }

    start(rig) {
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
        
        // Temporarily apply the target animation at time 0 to get initial angles
        const originalCurrentTime = this.toAnimation.currentTime;
        this.toAnimation.currentTime = 0;
        this.toAnimation.apply(rig);
        
        this._captureBoneAngles(rig.rootBone, this.toAngles);
        
        // Restore original state
        this.toAnimation.currentTime = originalCurrentTime;
    }

    _captureBoneAngles(bone, angleStorage) {
        angleStorage[bone.name] = bone.angle;
        for (const child of bone.children) {
            this._captureBoneAngles(child, angleStorage);
        }
    }

    update(deltaTime) {
        if (!this.isPlaying) return false;

        this.currentTime += deltaTime;
        
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
        
        for (const child of bone.children) {
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