/**
 * @enum {string}
 */
export const SwingType = {
    LIGHT: 'light',
    HEAVY: 'heavy',
    NONE: 'none'
};



/**
 * Manages the combat state of a character including attack types, timing, and restrictions
 */
const heavyDamage = 5;
const lightDamage = 3;

export class CharacterCombatState {
    constructor() 
    {
        this.isCharging = false;
        this.swinging = false;  
        this.dodging = false;  
        this.parried = false;
        this.swingType = SwingType.NONE;
    }

    /**
     * @param {boolean} isSwinging 
     */
    setSwinging(isSwinging) {
        this.swinging = isSwinging;
        if (!isSwinging) {
            this.swingType = SwingType.NONE;
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
     * @param {string} type - SwingType enum value
     */
    setSwingType(type) 
    {
        this.swingType = type;
        if (type !== SwingType.NONE) {
            this.swinging = true;
        }
    }


    switchSwingType() 
    {
       if(this.swingType == SwingType.HEAVY){
            this.setSwingType(SwingType.LIGHT);
       }else this.setSwingType(SwingType.HEAVY);
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
            case SwingType.HEAVY:
                return 0.2;
            case SwingType.LIGHT:
                return 0.3;
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
            case SwingType.HEAVY:
                return heavyDamage;
            case SwingType.LIGHT:
                return lightDamage;
            default:
                return 0;
        }
    }

     getSwingRange() 
     {
        switch(this.swingType) {
            case SwingType.HEAVY:
                return 100;
            case SwingType.LIGHT:
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
        this.swingType = SwingType.NONE;
    }
}
