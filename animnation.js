// 2D Rigging Animation Classes

// Represents a single bone in the rig
export class Bone {
    constructor(name, length, angle = 0, parent = null) {
        this.name = name;
        this.length = length;
        this.angle = angle;
        this.parent = parent;
        this.children = [];
        this.position = { x: 0, y: 0 };
    }

    addChild(bone) {
        bone.parent = this;
        this.children.push(bone);
    }

    getWorldPosition(facingDirection = 1) {
        if (this.parent) {
            const parentPos = this.parent.getWorldPosition(facingDirection);
            const angle = this.parent.getWorldAngle();
            return {
                x: parentPos.x + Math.cos(angle) * facingDirection * this.parent.length,
                y: parentPos.y + Math.sin(angle) * this.parent.length
            };
        }
        return this.position;
    }
    getWorldAngle(facingDirection = 1) {
        let result = this.parent ? this.parent.getWorldAngle() + this.angle: this.angle - Math.PI / 2; // Adjust for initial angle offset
        return facingDirection < 1? Math.PI - result : result; // Adjust for facing direction
    }
}

// Represents a visual part (sprite) attached to a bone
export class SpritePart {
    constructor(image, width, height, angleOffset = 0) {
        this.image = image;
        this.width = width;
        this.height = height;
        this.angleOffset = angleOffset || 0; // Optional angle offset for rotation
    }
    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx, x, y, angle, showDebug = true) {
        ctx.save();
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
}

// Manages the hierarchy of bones and parts
export class Rig {

    constructor(rootBone) {
        this.rootBone = rootBone;
        /** @type {Object<string, SpritePart>} */
        this.parts = {};
        this.dir = 1;
    }

    addPart(boneName, part = new SpritePart(null, 0, 0)) {
        this.parts[boneName] = part;
    }

    draw(ctx, resources, showDebug = true, facingDirection = 1) {
        this._drawBone(ctx, this.rootBone, resources, showDebug, facingDirection);
    }

    _drawBone(ctx, bone = new Bone(), resources, showDebug = true, facingDirection = 1) {
        const pos = bone.getWorldPosition(facingDirection);
        const angle = bone.getWorldAngle(facingDirection);
        const baseAngle = bone.angle;

        if (showDebug)
            this._drawBoneArrow(ctx, pos.x, pos.y, angle, baseAngle, bone.length, bone.name);
        else 
        {
            // Draw part if available and not in debug mode
            if (this.parts[bone.name]) {
                this.parts[bone.name].draw(ctx, pos.x, pos.y, angle, showDebug);
            }
        }

        // Draw bone as black arrow
        for (const child of bone.children) {
            this._drawBone(ctx, child, resources, showDebug, facingDirection);
        }
    }

    // Only visible in debug mode
    /** @param {CanvasRenderingContext2D} ctx */
    _drawBoneArrow(ctx, x, y, angle, baseAngle, length, boneName) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Set arrow style
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 2;

        // Draw arrow shaft
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(length, 0);
        ctx.stroke();

        // Draw arrowhead
        const arrowHeadSize = Math.min(length * 0.2, 10);
        ctx.beginPath();
        ctx.moveTo(length, 0);
        ctx.lineTo(length - arrowHeadSize, -arrowHeadSize * 0.5);
        ctx.lineTo(length - arrowHeadSize, arrowHeadSize * 0.5);
        ctx.closePath();
        ctx.fill();

        // Draw bone label
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        // Convert angle from radians to degrees and round
        const angleDeg = Math.round(baseAngle * 180 / Math.PI);
        ctx.fillText(`${boneName} (${angleDeg}°)`, length / 2, -5);

        // Draw bone joint (small circle at base)
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// Handles keyframes and interpolation for animating the rig
export class Animation {
    constructor(keyframes = []) {
        this.keyframes = keyframes; // [{ time, boneName, angle }]
        this.currentTime = 0;
        this.duration = 0;
        this.loop = true;
        this.isPlaying = false;
        this._calculateDuration();
    }

    static async loadFromCSV(csvPath) {
        try {
            const response = await fetch(csvPath);
            const text = await response.text();
            const keyframes = this._parseCSV(text);
            return new Animation(keyframes);
        }
        catch (error) {
            console.error('Failed to load animation from CSV:', error);
            return new Animation();
        }
    } 
    static _parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const keyframes = [];

        // Skip header line if it exists, and ignore comment lines starting with #
        let startIndex = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('#')) continue; // Skip comment lines
            if (line.toLowerCase().includes('time')) {
                startIndex = i + 1; // Skip header
                break;
            }
            if (line && !line.startsWith('#')) {
                startIndex = i; // No header found, start from first data line
                break;
            }
        }

        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && !line.startsWith('#')) { // Skip empty lines and comments
                const [time, boneName, angle] = line.split(',');
                keyframes.push({
                    time: parseFloat(time),
                    boneName: boneName.trim(),
                    angle: parseFloat(angle) // Already in radians
                });
            }
        }

        // Sort keyframes by time
        keyframes.sort((a, b) => a.time - b.time);
        return keyframes;
    }

    _calculateDuration() {
        if (this.keyframes.length > 0) {
            this.duration = Math.max(...this.keyframes.map(kf => kf.time));
        }
    }

    play() {
        this.isPlaying = true;
    }

    pause() {
        this.isPlaying = false;
    }

    stop() {
        this.isPlaying = false;
        this.currentTime = 0;
    }

    update(deltaTime) {
        if (!this.isPlaying) return;

        this.currentTime += deltaTime;

        if (this.loop && this.currentTime > this.duration) {
            this.currentTime = this.currentTime % this.duration;
        } else if (!this.loop && this.currentTime > this.duration) {
            this.currentTime = this.duration;
            this.isPlaying = false;
        }
    }

    apply(rig) {
        // Get unique bone names from keyframes
        const boneNames = [...new Set(this.keyframes.map(kf => kf.boneName))];

        for (const boneName of boneNames) {
            const bone = this._findBone(rig.rootBone, boneName);
            if (!bone) continue;

            // Get keyframes for this bone
            const boneKeyframes = this.keyframes.filter(kf => kf.boneName === boneName);
            if (boneKeyframes.length === 0) continue;

            // Find the appropriate keyframe(s) for interpolation
            const angle = this._interpolateAngle(boneKeyframes, this.currentTime);
            bone.angle = angle;
        }
    }

    _interpolateAngle(keyframes, time) {
        if (keyframes.length === 0) return 0;
        if (keyframes.length === 1) return keyframes[0].angle;

        // Find the two keyframes to interpolate between
        let prevKeyframe = keyframes[0];
        let nextKeyframe = keyframes[keyframes.length - 1];

        for (let i = 0; i < keyframes.length - 1; i++) {
            if (time >= keyframes[i].time && time <= keyframes[i + 1].time) {
                prevKeyframe = keyframes[i];
                nextKeyframe = keyframes[i + 1];
                break;
            }
        }

        // If time is before first keyframe
        if (time <= keyframes[0].time) {
            return keyframes[0].angle;
        }

        // If time is after last keyframe
        if (time >= keyframes[keyframes.length - 1].time) {
            return keyframes[keyframes.length - 1].angle;
        }

        // Linear interpolation
        const timeDiff = nextKeyframe.time - prevKeyframe.time;
        if (timeDiff === 0) return prevKeyframe.angle;

        const progress = (time - prevKeyframe.time) / timeDiff;
        return prevKeyframe.angle + (nextKeyframe.angle - prevKeyframe.angle) * progress;
    }

    _findBone(bone, name) {
        if (bone.name === name) return bone;
        for (const child of bone.children) {
            const found = this._findBone(child, name);
            if (found) return found;
        }
        return null;
    }
}

// Handles smooth transitions between animations
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

// Handles animations
export class AnimationController{
    constructor(rig) {
        this.rig = rig;
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

    playAnimation(name, useTransition = true, transitionDuration = 0.3) {
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
    playAnimationWithTransition(name, duration = 0.3) {
        this.playAnimation(name, true, duration);
    }

    playAnimationInstant(name) {
        this.playAnimation(name, false);
    }

    isTransitioning() {
        return this.transition && this.transition.isTransitioning;
    }
}