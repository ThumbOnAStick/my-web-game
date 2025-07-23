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

    update(deltaTime) 
    {
        if (!this.isPlaying) return;

        this.currentTime += deltaTime;

        if (this.loop && this.currentTime > this.duration) 
        {
            this.currentTime = this.currentTime % this.duration;
        } 
        else if (!this.loop && this.currentTime > this.duration) 
        {
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