export class TickManager
{
    /**
     * 
     * @param {Number} lastTickTime 
     * @param {Number} tickInterval 16 ticks persecond
     */
    constructor(lastTickTime, tickInterval = 16)
    {
        this.lastTickTime = lastTickTime;
        this.currentTick = 0;
        /** @type {Function[]} */
        this.callbacks = [];
        this.tickInterval = tickInterval;
    }

    /**
     * 
     * @param {Function} callback 
     */
    append(callback)
    {
        this.callbacks.push(callback);
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
        for(let i = 0; i < this.callbacks.length; i++)
        {
            this.callbacks[i](this.currentTick);
        }
    }
}