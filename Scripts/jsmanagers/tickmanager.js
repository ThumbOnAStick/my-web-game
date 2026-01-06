import { debugManager } from "./debugmanager.js";

export class TickManager
{
    #paused;
    /**
     * 
     * @param {Number} lastTickTime 
     * @param {Number} tickInterval 16 ticks persecond
     */
    constructor(lastTickTime, tickInterval = 16)
    {
        this.lastTickTime = lastTickTime;
        this.currentTick = 0;
        /** @type {Map<String, Function>} */
        this.callbacks = new Map();
        this.tickInterval = tickInterval;
    }

    /**
     * @param {String} key
     * @param {Function} callback 
     */
    append(key, callback)
    {
        this.callbacks.set(key, callback);
    }

    /**
     * 
     * @param {String} key 
     */
    remove(key){
        this.callbacks.delete(key); 
    }

    pause(){
        this.#paused = true;
    }

    unpause(){
        this.#paused = false;
    }

    get paused(){
        return this.#paused;
    }

    update()
    {
        const now = Date.now();
        if (now - this.lastTickTime >= this.tickInterval) 
        {
            this.currentTick++;
            this.lastTickTime = now;
            
            // Run tick-based updates
            this.tickUpdate();
        }
    }

    tickUpdate()
    {
        if (this.paused) return;
        this.callbacks.forEach(callback => {
            callback(this.currentTick);
        });
    }
}