// CharacterCombatMixin.js
// Contains all combat-related methods for Character
import { gameEventManager } from "../../jsmanagers/eventmanager.js";
import * as EventHandler from "../../jsutils/eventhandlers.js";


export const CharacterCombatMixin = {
  /**
   * Set swinging state
   * @param {boolean} isSwinging
   */
  setSwinging(isSwinging) {
    this.combatState.setSwinging(isSwinging);
  },

  /**
   * Set charging state
   * @param {boolean} isCharging
   */
  setIsCharging(isCharging) {
    this.combatState.setCharging(isCharging);
  },

  setDodging(isDodging) {
    this.combatState.setDodging(isDodging);
  },

  setParried(isParried) {
    this.combatState.setParried(isParried);
  },

  /**
   * Set swing type
   * @param {string} type - 'heavy', 'light', or 'none'
   */
  setSwingType(type) {
    this.combatState.setSwingType(type);
  },

  getSwingHitboxLifetime() {
    return this.combatState.getSwingHitboxLifetime();
  },

  getSwingDamage() {
    return this.combatState.getSwingDamage();
  },

  getSwingRange() {
    return this.combatState.getSwingRange();
  },

  getSwinging() {
    return this.combatState.swinging;
  },

  getDodging() {
    return this.combatState.dodging;
  },

  getSwingType() {
    return this.combatState.swingType;
  },

  callHeavySwingEvent() {
    gameEventManager.emit(EventHandler.characterSwingEvent, { character: this });
  },

  callLightSwingEvent() {
    gameEventManager.emit(EventHandler.characterLightSwingEvent, { character: this });
  },

  callSpinSwingEvent() {
    gameEventManager.emit(EventHandler.characterSpinSwingEvent, { character: this });
  },

  callSpinThrustEvent() {
    gameEventManager.emit(EventHandler.characterThrustSwingEvent, { character: this });
  },

  performHeavyattack() {
    if (this.combatState.canAttack()) {
      this.setSwingType("heavy");
      this.playHeavySwingAnimation();
      this.callHeavySwingEvent();
    }
  },

  performLightAttack() {
    if (this.combatState.canAttack()) {
      this.setSwingType("light");
      this.playLightSwingAnimation();
      this.callLightSwingEvent();
    }
  },

  performSpinAttack() {
    if (this.combatState.canAttack()) {
      this.setSwingType("heavy");
      this.playSpinSwingAnimation();
      this.callSpinSwingEvent();
    }
  },

  performThrustAttack() {
    if (this.combatState.canAttack()) {
      this.setSwingType("light");
      this.playThrustSwingAnimation();
      this.callSpinThrustEvent();
    }
  },
};
