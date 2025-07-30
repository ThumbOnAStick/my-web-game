/**
 * Manages the combat state of a character including attack types, timing, and restrictions
 */
const heavyDamage = 25;
const lightDamage = 3;

export class CharacterCombatState {
    constructor() 
    {
        this.isCharging = false;
        this.swinging = false;  
        this.dodging = false;  
        this.parried = false;
        this.swingType = 'none'; // 'heavy', 'light', or 'none'
    }

    /**
     * @param {boolean} isSwinging 
     */
    setSwinging(isSwinging) {
        this.swinging = isSwinging;
        if (!isSwinging) {
            this.swingType = 'none'; // Reset swing type when not swinging
        }
    }

    /**
     * @param {boolean} isDodging 
     */
    setDodging(isDodging) {
        this.dodging = isDodging;
    }

    /**
     * 
     * @param {boolean} isCharging 
     */
    setCharging(isCharging)
    {
        this.isCharging = isCharging;
    }

      /**
     * 
     * @param {boolean} parried 
     */
    setParried(parried)
    {
        this.parried = parried;
    }
  

    /**
     * @param {string} type - 'heavy', 'light', or 'none'
     */
    setSwingType(type) 
    {
        this.swingType = type;
        if (type !== 'none') {
            this.swinging = true;
        }
    }

    /**
     * 
     * @param {String} other 
     * @returns 
     */
    cannotBeParried(other)
    {
        return other == this.swingType && this.swinging;
    }

    canParry()
    {
        return !this.dodging && this.isCharging;
    }

    /**
     * Check if character can move based on current combat state
     * @returns {boolean}
     */
    canMove() 
    {
        return !this.swinging && !this.dodging && !this.parried;
    }

    /**
     * Check if character can attack based on current combat state
     * @returns {boolean}
     */
    canAttack() 
    {
        return !this.swinging && !this.dodging && !this.parried;
    }

    /**
     * Get the hitbox lifetime based on current swing type
     * @returns {number} Lifetime in seconds
     */
    getSwingHitboxLifetime() {
        switch(this.swingType) {
            case 'heavy':
                return 0.3;
            case 'light':
                return 0.1;
            default:
                return 0;
        }
    }

    /**
     * Get the damage amount based on current swing type
     * @returns {number} Damage amount
     */
    getSwingDamage() {
        switch(this.swingType) {
            case 'heavy':
                return heavyDamage;
            case 'light':
                return lightDamage;
            default:
                return 0;
        }
    }

     getSwingRange() 
     {
        switch(this.swingType) {
            case 'heavy':
                return 100;
            case 'light':
                return 150;
            default:
                return 0;
        }
    }

    /**
     * Reset all combat states to default
     */
    reset() {
        this.swinging = false;
        this.dodging = false;
        this.swingType = 'none';
    }
}
