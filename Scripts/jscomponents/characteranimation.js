// CharacterAnimation.js
// Handles animation logic for a character

export class CharacterAnimation {
    constructor(animationController) {
        this.animationController = animationController;
    }

    async loadAnimation(name, animationPath, options = {}, animationDefaults) {
        await this.animationController.loadAnimation(name, animationPath);
        if (!this.animationController.animations[name]) {
            console.warn(`Animation '${name}' failed to load from ${animationPath}`);
            return false;
        }
        const finalOptions = { ...animationDefaults[name], ...options };
        if (finalOptions.loop !== undefined) {
            this.animationController.animations[name].loop = finalOptions.loop;
        }
        if (finalOptions.autoPlay) {
            this.animationController.playAnimation(name);
        }
        return true;
    }

    playAnimation(name, animationSettings) {
        if (!this.animationController.animations[name]) {
            console.warn(`Animation '${name}' not loaded`);
            return;
        }
        const settings = animationSettings[name] || { transitionDuration: 0.3 };
        this.animationController.playAnimationWithTransition(name, settings.transitionDuration);
    }

    playImmediate(name) {
        this.animationController.playAnimation(name);
    }

    update() {
        this.animationController.update();
    }

    getCurrentAnimation() {
        return this.animationController.currentAnimation;
    }
}
