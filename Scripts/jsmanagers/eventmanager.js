import { Character } from "../jsgameobjects/character.js";

export class EventManager 
{
    constructor() 
    {
        this.listeners = new Map(); // eventName -> array of callbacks
        this.eventHistory = []; // for debugging
        this.delayedEvents = []; // for delayed events
        this.freezingFrames = 0;
        this.scoreChanges = 0;
        /**@type {Character} */
        this.scoreChanger = null;
    }

    // Register listeners for events
    /**@param {Function} callback  */
    on(eventName, callback) 
    {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName).push(callback);
    }

    // Emit events to all listeners (with optional delay)
    emit(eventName, data, delay = 0) {
        if (delay > 0) {
            // Schedule delayed event
            this.delayedEvents.push({
                eventName,
                data,
                // 1000 = 1 second
                executeTime: Date.now() + delay * 1000,
                id: crypto.randomUUID()
            });
        } else {
            // Execute immediately
            this.executeEvent(eventName, data);
        }
    }

    // Execute an event immediately
    executeEvent(eventName, data) {
        this.eventHistory.push({ eventName, data, timestamp: Date.now() });
        
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).forEach(callback => {
                callback(data);
            });
        }
    }

    // Process delayed events (call this in your game loop)
    update() 
    {
        const now = Date.now();
        const eventsToExecute = [];
        
        // Find events ready to execute
        this.delayedEvents = this.delayedEvents.filter(delayedEvent => {
            if (now >= delayedEvent.executeTime) {
                eventsToExecute.push(delayedEvent);
                return false; // Remove from delayed events
            }
            return true; // Keep in delayed events
        });

        // Execute ready events
        eventsToExecute.forEach(delayedEvent => {
            this.executeEvent(delayedEvent.eventName, delayedEvent.data);
        });

    }

    // Cancel a delayed event by ID
    cancelDelayedEvent(eventId) {
        this.delayedEvents = this.delayedEvents.filter(event => event.id !== eventId);
    }

    // Clear all delayed events
    clearDelayedEvents() 
    {
        this.delayedEvents = [];
    }

    clearScoreChanges()
    {
        this.scoreChanges = 0;
    }

    /**
     * 
     * @param {Number} scoreChanges 
     * @param {Character} character 
     */
    setScoreChanges(scoreChanges, character)
    {
        this.scoreChanges = scoreChanges;
        this.scoreChanger = character;
    }

    /**
     * 
     * @param {Number} frames 
     */
    freezeFor(frames)
    {
        this.freezingFrames = frames;
    }

    /**
     * 
     * @returns {boolean}
     */
    updateFreeze()
    {
        if(this.freezingFrames > 0)
        {
            this.freezingFrames = this.freezingFrames - 1;
            return true;
        }
        return false;
    }

}

export const gameEventManager = new EventManager();