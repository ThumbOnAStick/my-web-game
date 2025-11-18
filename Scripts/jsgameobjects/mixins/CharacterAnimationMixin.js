// CharacterAnimationMixin.js
// Contains all animation-related methods for Character

export const CharacterAnimationMixin = {
  /**
   * Load an animation for the character
   * @param {string} name - Animation name
   * @param {string} animationPath - Path to animation file
   * @param {object} options - Animation options
   */
  async loadAnimation(name, animationPath, options = {}) {
    await this.animationController.loadAnimation(name, animationPath);

    if (!this.animationController.animations[name]) {
      console.warn(`Animation '${name}' failed to load from ${animationPath}`);
      return false;
    }

    const animationDefaults = {
      idle: { loop: true, autoPlay: true },
      swing: { loop: false },
      dodge: { loop: false },
      lightswing: { loop: false },
      spinswing: { loop: false },
      thrustswing: { loop: false },
      stagger: { loop: false },
    };

    const finalOptions = { ...animationDefaults[name], ...options };

    if (finalOptions.loop !== undefined) {
      this.animationController.animations[name].loop = finalOptions.loop;
    }

    if (finalOptions.autoPlay) {
      this.animationController.playAnimation(name);
    }

    return true;
  },

  /**
   * Play animation with transition
   * @param {string} name - Animation name
   */
  playAnimation(name) {
    if (!this.animationController.animations[name]) {
      console.warn(`Animation '${name}' not loaded`);
      return;
    }

    const animationSettings = {
      idle: { transitionDuration: 0.4 },
      swing: { transitionDuration: 0.2 },
      lightswing: { transitionDuration: 0.15 },
      dodge: { transitionDuration: 0.15 },
      stagger: { transitionDuration: 0.5 },
      spinswing: { transitionDuration: 0.1 },
      thrustswing: { transitionDuration: 0.1 },
    };

    const settings = animationSettings[name] || { transitionDuration: 0.3 };
    this.animationController.playAnimationWithTransition(
      name,
      settings.transitionDuration
    );
  },

  playHeavySwingAnimation() {
    this.playAnimation("swing");
  },

  playLightSwingAnimation() {
    this.playAnimation("lightswing");
  },

  playSpinSwingAnimation() {
    this.playAnimation("spinswing");
  },

  playThrustSwingAnimation() {
    this.playAnimation("thrustswing");
  },

  playIdleAnimation(immediate = false) {
    if (immediate) {
      this.animationController.playAnimation("idle");
    } else {
      this.playAnimation("idle");
    }
  },

  playDodgeAnimation() {
    this.playAnimation("dodge");
  },

  playStaggerAnimation(immediate = false) {
    if (immediate) {
      this.animationController.playAnimation("stagger");
    } else {
      this.playAnimation("stagger");
    }
  },

  shouldPlayIdleAnimation() {
    const currentAnim = this.animationController.currentAnimation;
    if (!currentAnim) return true;

    return (
      (currentAnim === "swing" ||
        currentAnim === "lightswing" ||
        currentAnim === "spinswing" ||
        currentAnim === "thrustswing" ||
        currentAnim === "dodge" ||
        currentAnim === "stagger") &&
      !this.animationController.isPlaying()
    );
  },

  updateIdleAnimation() {
    if (this.shouldPlayIdleAnimation()) {
      this.playIdleAnimation();
    }
  },

  turnOnSmear() {
    this.rig.turnOnSmear();
  },

  turnOffSmear() {
    this.rig.turnOffSmear();
  }
  
};
