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
            // If data is a Character, remove existing delayed events with same eventName and character ID
            if (data instanceof Character) {
                this.delayedEvents = this.delayedEvents.filter(delayedEvent => {
                    const isSameEvent = delayedEvent.eventName === eventName;
                    const isSameCharacter = delayedEvent.data instanceof Character && 
                                           delayedEvent.data.id === data.id;
                    return !(isSameEvent && isSameCharacter);
                });
            }
            
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

/**
 * Default event manager instance.
 * 
 * NOTE: For better testability and reusability, prefer injecting the event manager
 * via the service container (ServiceKeys.EVENTS) rather than importing this singleton.
 * This singleton is maintained for backward compatibility.
 * 
 * @type {EventManager}
 */
export const gameEventManager = new EventManager();

/**
 * Set up a different event manager instance (useful for testing)
 * @param {EventManager} manager - The event manager to use
 * @deprecated Use ServiceContainer instead
 */
export function setEventManager(manager) {
    Object.assign(gameEventManager, manager);
}