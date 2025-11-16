import { GameObject } from "../jsgameobjects/gameobject.js";

/**
 * @enum {string}
 */
export const ShrinkStage = {
    OFF: 'off',
    RUNNING: 'running'
};

export class ShrinkController{
    /**
     * 
     * @param {Number} speed 
     * @param {Number} min
     * @param {Number} max
     */
    constructor(speed, min, max) {
        this.size = 1;
        this.speed = speed 
        this.direction = 1;
        this.min = min;
        this.max = max;
        this.stage = ShrinkStage.OFF;
    }

    reverse(){
        this.direction = -this.direction;
    }

    turnOn() {
        this.stage = ShrinkStage.RUNNING;
    }

    turnOff() {
        this.stage = ShrinkStage.OFF;
    }

    /**
     * 
     * @returns {Number}
     */
    getSize() {
        if (this.stage === ShrinkStage.OFF){
            this.size = 1;
            return 1;  
        } 
        
        let realSpeed = this.direction * this.speed;
        this.size = this.size + realSpeed;
        
        if (this.size >= this.max) {
            this.size = this.max;
            this.reverse();
        } else if (this.size <= this.min) {
            this.size = this.min;
            this.reverse();
        }
        return this.size;
    }
}