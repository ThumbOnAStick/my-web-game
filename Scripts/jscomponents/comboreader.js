import { Character } from "../jsgameobjects/character.js";
import * as ComboHandler from '../jsutils/combohandler.js';

/**
 * Helps InputManager to analyze combos
 */
const emitDuration = 0.2;
export class ComboReader {

    constructor() 
    {
        this.combo = new Uint8Array();
        this.cycleStarted = false;
        this.lastCycleStartTicks = 0;
    }

    /**
     * Can only be called when there's no combo pending
     * @param {Number} input 
     */
    #startCycle(input) {
        this.cycleStarted = true;
        this.lastCycleStartTicks = Date.now();
        this.combo = new Uint8Array(1);
        this.combo[0] = input;
    }

    stopCycle() {
        this.cycleStarted = false;
    }

    /**
     * @returns {boolean}
     */
    shouldEmit() {
        return Date.now() - this.lastCycleStartTicks > emitDuration * 1000;
    }

    /**
     * @param {Character} character
     */
    update(character) 
    {
        if (this.cycleStarted && this.shouldEmit())
        {
            this.stopCycle();
            ComboHandler.handleCombos(character, this.combo);
            return;
        }
    }

    /**
     * Can only be called when combo is pending
     * @param {number} input 
     */
    #append(input) {
        if (!this.cycleStarted) {
            return;
        }
        const newArray = new Uint8Array(this.combo.length + 1);
        newArray.set(this.combo);
        newArray[this.combo.length] = input;
        this.combo = newArray;

    }

    /**
     * Either start cycle or append when input received
     * @param {Number} input
     */
    receiveInput(input) {
        if (this.cycleStarted) 
        {
            this.#append(input);
        }
        else 
        {
            this.#startCycle(input);
        }
    }


}