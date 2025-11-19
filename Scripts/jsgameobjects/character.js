// @ts-nocheck
import { Bone } from "../jsanimation/bone.js";
import { SpritePart } from "../jsanimation/spritepart.js";
import { Rig } from "../jsanimation/rig.js";
import { AnimationController } from "../jsanimation/animatoincontroller.js";
import { gameEventManager } from "../jsmanagers/eventmanager.js";
import * as EventHandler from "../jsutils/eventhandlers.js";
import { GameObject } from "./gameobject.js";
import { Rigidbody2D } from "../jscomponents/rigidbody.js";
import { Resources } from "../jscomponents/resources.js";
import { CharacterCombatState } from "../jscomponents/charactercombatstate.js";
import { CharacterAnimationMixin } from "./mixins/CharacterAnimationMixin.js";
import { CharacterMovementMixin } from "./mixins/CharacterMovementMixin.js";
import { CharacterCombatMixin } from "./mixins/CharacterCombatMixin.js";
import { CharacterScoreMixin } from "./mixins/CharacterScoreMixin.js";
import { ShrinkController } from "../jscomponents/shrinkcontroller.js";
import { buildShrinkController } from "../jsutils/shrinkhelper.js";

// Angle constants for better readability
const ANGLE_90_DEG = Math.PI / 2;
const ANGLE_120_DEG = (120 * Math.PI) / 180;
const ANGLE_60_DEG = (60 * Math.PI) / 180;
const ANGLE_30_DEG = (30 * Math.PI) / 180;

// Default configurations for each animation
const animationDefaults = {
  idle: { loop: true, autoPlay: true },
  swing: { loop: false },
  dodge: { loop: false },
  lightswing: { loop: false },
  spinswing: { loop: false },
  thrustswing: { loop: false },
  stagger: { loop: false },
};

// Animation transition durations (in seconds) for smooth switching between animations
const animationSettings = {
  idle: { transitionDuration: 0.4 },
  swing: { transitionDuration: 0.2 },
  lightswing: { transitionDuration: 0.15 },
  dodge: { transitionDuration: 0.15 },
  stagger: { transitionDuration: 0.5 },
  spinswing: { transitionDuration: 0.1 },
  thrustswing: { transitionDuration: 0.1 },
};

/**
 * @extends {GameObject}
 */
export class Character extends GameObject {
  constructor(x, y, width = 40, height = 60, resources, isOpponent = false) {
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
    /**@type {Rigidbody2D} */
    this.rigidbody = new Rigidbody2D(
      this.width / 2,
      this.height / 2,
      this.movementSpeed
    );
    //#endregion
    
    //#region Score system
    this.maxScore = 100;
    this.currentScore = 50; // Starting score
    this.defeated = false;
    //#endregion

    //#region Animation setup
    // Create bones
    this.bodyBone = new Bone("body", 30, 0, null); // root bone
    this.neckBone = new Bone("neck", 10, ANGLE_30_DEG, this.bodyBone); // Structural(Not visible)
    this.headBone = new Bone(
      "head",
      this.headLength,
      ANGLE_30_DEG,
      this.neckBone
    );
    this.armBone = new Bone("arm", 30, ANGLE_120_DEG, this.bodyBone); // Structural(Not visible)
    this.weaponBone = new Bone("weapon", 30, -ANGLE_90_DEG, this.armBone, true);
    this.bodyBone.addChild(this.neckBone);
    this.bodyBone.addChild(this.armBone);
    this.neckBone.addChild(this.headBone);
    this.armBone.addChild(this.weaponBone);

    // Create rig
    this.rig = new Rig(this.bodyBone);

    // Attach sprite parts (images must be loaded in resources)
    this.rig.addPart(
      "body",
      new SpritePart(resources.getImage("body"), 40, 60, ANGLE_90_DEG)
    );
    this.rig.addPart(
      "head",
      new SpritePart(resources.getImage("head"), 40, 40)
    );
    this.rig.addPart(
      "weapon",
      new SpritePart(resources.getImage("weapon"), 20, 50, ANGLE_90_DEG)
    );

    // Adjust facing
    if (this.isOpponent) {
      this.flip();
    }

    // Animation system
    this.animationController =
      /**@type {AnimationController} */ new AnimationController(this.rig);
    this.wasGrounded = true; // Track previous grounded state
    this.drawSize = 1;
    //#endregion
    
    this.shrinkController = buildShrinkController(1, 0.7, 1 )
  }

  //#region Utility Functions
  /** @returns {{x: number, y: number}} */
  selfCoordinate() {
    // Return the center position of the root bone (character's center)
    return { x: this.x, y: this.y };
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
   * @param {number} newSize
   */
  setDrawSize(newSize) {
    this.drawSize = newSize;
  }
  shouldPlayIdleAnimation() {
    if (this.combatState.swinging) {
      return false;
    }

    return (
      this.animationController.currentAnimation !=
        this.animationController.animations["idle"] &&
      this.animationController.currentAnimation &&
      !this.animationController.currentAnimation.isPlaying &&
      !this.animationController.isTransitioning()
    );
  }

  updateIdleAnimation() {
    if (this.shouldPlayIdleAnimation()) {
      // @ts-ignore
      this.playIdleAnimation();
    }
  }

  /**
   * @param {HTMLCanvasElement} canvas
   */
  update(canvas) {
    // update idle states
    this.updateIdleAnimation();

    // Update animation controller
    this.animationController.update();

    // Update rigidbody
    this.rigidbody.update(canvas, this);

    // Update shrink controller
    // if (this.shrinkController.stage == ShrinkStage.RUNNING)
      this.drawSize = this.shrinkController.getSize();
  }

  /**
   *
   * @param {*} ctx
   * @param {Resources} resources
   * @param {*} showDebug
   */
  draw(ctx, resources, showDebug = true) {
    // Draw position with red dot at character center (root bone position)
    if (showDebug) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Set root bone position directly to character's center position
    this.bodyBone.position.x = this.x;
    this.bodyBone.position.y = this.y;
    // Draw the rig (body, head, weapon)
    this.rig.draw(
      ctx,
      resources,
      showDebug,
      this.facing > 0 ? 1 : -1,
      this.drawSize
    );
  }

  /**
   * Set the opponent character
   * @param {Character} opponent
   */
  setOpponent(opponent) {
    this.opponent = opponent;
  }
  //#endregion
}

// Apply mixins to Character class
Object.assign(Character.prototype, CharacterAnimationMixin);
Object.assign(Character.prototype, CharacterMovementMixin);
Object.assign(Character.prototype, CharacterCombatMixin);
Object.assign(Character.prototype, CharacterScoreMixin);
