export class EventManager 
{
    constructor() {
        this.listeners = new Map(); // eventName -> array of callbacks
        this.eventHistory = []; // for debugging
        this.delayedEvents = []; // for delayed events
    }

    // Register listeners for events
    /**@param {VoidFunction} callback  */
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
    update() {
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
    clearDelayedEvents() {
        this.delayedEvents = [];
    }

}

export const gameEventManager = new EventManager();