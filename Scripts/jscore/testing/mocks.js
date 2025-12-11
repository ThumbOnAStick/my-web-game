/**
 * @fileoverview Mock service implementations for testing
 * 
 * These mocks implement the interfaces defined in interfaces.js
 * and can be used to test modules in isolation without dependencies.
 * 
 * @module jscore/testing/mocks
 */

// ============================================
// MOCK INPUT PROVIDER
// ============================================

/**
 * Mock input provider for testing input-dependent code
 * @implements {import('../interfaces.js').IInputProvider}
 */
export class MockInputProvider {
    constructor() {
        /** @type {Set<string>} */
        this._keysDown = new Set();
        /** @type {Set<string>} */
        this._keysPressed = new Set();
        /** @type {Set<string>} */
        this._keysReleased = new Set();
        /** @type {{x: number, y: number}} */
        this._mousePosition = { x: 0, y: 0 };
        /** @type {Set<number>} */
        this._mouseButtonsDown = new Set();
    }

    update() {
        // Clear per-frame state
        this._keysPressed.clear();
        this._keysReleased.clear();
    }

    reset() {
        this._keysDown.clear();
        this._keysPressed.clear();
        this._keysReleased.clear();
        this._mouseButtonsDown.clear();
        this._mousePosition = { x: 0, y: 0 };
    }

    isKeyDown(key) {
        return this._keysDown.has(key);
    }

    isKeyPressed(key) {
        return this._keysPressed.has(key);
    }

    isKeyReleased(key) {
        return this._keysReleased.has(key);
    }

    getMousePosition() {
        return { ...this._mousePosition };
    }

    isMouseButtonDown(button) {
        return this._mouseButtonsDown.has(button);
    }

    // ============ Test Helpers ============

    /**
     * Simulate pressing a key
     * @param {string} key 
     */
    simulateKeyDown(key) {
        if (!this._keysDown.has(key)) {
            this._keysPressed.add(key);
        }
        this._keysDown.add(key);
    }

    /**
     * Simulate releasing a key
     * @param {string} key 
     */
    simulateKeyUp(key) {
        if (this._keysDown.has(key)) {
            this._keysReleased.add(key);
        }
        this._keysDown.delete(key);
    }

    /**
     * Simulate mouse movement
     * @param {number} x 
     * @param {number} y 
     */
    simulateMouseMove(x, y) {
        this._mousePosition = { x, y };
    }

    /**
     * Simulate mouse button press
     * @param {number} button - 0=left, 1=middle, 2=right
     */
    simulateMouseDown(button = 0) {
        this._mouseButtonsDown.add(button);
    }

    /**
     * Simulate mouse button release
     * @param {number} button 
     */
    simulateMouseUp(button = 0) {
        this._mouseButtonsDown.delete(button);
    }
}


// ============================================
// MOCK EVENT MANAGER
// ============================================

/**
 * Mock event manager for testing event-driven code
 * @implements {import('../interfaces.js').IEventManager}
 */
export class MockEventManager {
    constructor() {
        /** @type {Map<string, Function[]>} */
        this._listeners = new Map();
        /** @type {Array<{event: string, data: any, timestamp: number}>} */
        this._emittedEvents = [];
    }

    on(event, callback) {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, []);
        }
        this._listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (!this._listeners.has(event)) return;
        const listeners = this._listeners.get(event);
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    once(event, callback) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            callback(...args);
        };
        this.on(event, wrapper);
    }

    emit(event, ...data) {
        this._emittedEvents.push({ 
            event, 
            data: data.length === 1 ? data[0] : data, 
            timestamp: Date.now() 
        });
        
        if (this._listeners.has(event)) {
            this._listeners.get(event).forEach(cb => cb(...data));
        }
    }

    removeAllListeners(event) {
        this._listeners.delete(event);
    }

    clear() {
        this._listeners.clear();
        this._emittedEvents = [];
    }

    // ============ Test Helpers ============

    /**
     * Get all emitted events (for assertions)
     * @returns {Array<{event: string, data: any, timestamp: number}>}
     */
    getEmittedEvents() {
        return [...this._emittedEvents];
    }

    /**
     * Get emitted events filtered by name
     * @param {string} eventName 
     * @returns {Array<{event: string, data: any, timestamp: number}>}
     */
    getEmittedEventsByName(eventName) {
        return this._emittedEvents.filter(e => e.event === eventName);
    }

    /**
     * Check if an event was emitted
     * @param {string} eventName 
     * @returns {boolean}
     */
    wasEmitted(eventName) {
        return this._emittedEvents.some(e => e.event === eventName);
    }

    /**
     * Get count of listeners for an event
     * @param {string} eventName 
     * @returns {number}
     */
    getListenerCount(eventName) {
        return this._listeners.get(eventName)?.length ?? 0;
    }

    /**
     * Clear emitted events history (but keep listeners)
     */
    clearHistory() {
        this._emittedEvents = [];
    }
}


// ============================================
// MOCK TIME PROVIDER
// ============================================

/**
 * Mock time provider for testing time-dependent code
 * @implements {import('../interfaces.js').ITimeProvider}
 */
export class MockTimeProvider {
    constructor() {
        this._currentTick = 0;
        this._deltaTime = 0.016; // ~60fps
        this._elapsedTime = 0;
        this._tickRate = 60;
        /** @type {Function[]} */
        this._tickCallbacks = [];
    }

    update() {
        this._currentTick++;
        this._elapsedTime += this._deltaTime;
        this._tickCallbacks.forEach(cb => cb(this._currentTick));
    }

    onTick(callback) {
        this._tickCallbacks.push(callback);
    }

    offTick(callback) {
        const index = this._tickCallbacks.indexOf(callback);
        if (index > -1) {
            this._tickCallbacks.splice(index, 1);
        }
    }

    getCurrentTick() {
        return this._currentTick;
    }

    getDeltaTime() {
        return this._deltaTime;
    }

    getElapsedTime() {
        return this._elapsedTime;
    }

    getTickRate() {
        return this._tickRate;
    }

    // ============ Test Helpers ============

    /**
     * Advance time by a number of ticks
     * @param {number} ticks 
     */
    advanceTicks(ticks) {
        for (let i = 0; i < ticks; i++) {
            this.update();
        }
    }

    /**
     * Advance time by seconds
     * @param {number} seconds 
     */
    advanceTime(seconds) {
        const ticks = Math.floor(seconds * this._tickRate);
        this._elapsedTime += seconds;
        for (let i = 0; i < ticks; i++) {
            this._currentTick++;
            this._tickCallbacks.forEach(cb => cb(this._currentTick));
        }
    }

    /**
     * Set the delta time
     * @param {number} dt 
     */
    setDeltaTime(dt) {
        this._deltaTime = dt;
    }

    /**
     * Reset time state
     */
    reset() {
        this._currentTick = 0;
        this._elapsedTime = 0;
        this._tickCallbacks = [];
    }
}


// ============================================
// MOCK GAME STATE
// ============================================

/**
 * Mock game state for testing state-dependent code
 * @implements {import('../interfaces.js').IGameState}
 */
export class MockGameState {
    constructor() {
        this._state = 'idle';
        this._data = {};
        /** @type {Map<string, Function[]>} */
        this._stateChangeListeners = new Map();
        /** @type {Array<{from: string, to: string, data: any}>} */
        this._stateHistory = [];
    }

    getState() {
        return this._state;
    }

    setState(state, data = {}) {
        const oldState = this._state;
        this._state = state;
        this._data = { ...this._data, ...data };
        
        this._stateHistory.push({ from: oldState, to: state, data });
        
        if (this._stateChangeListeners.has(state)) {
            this._stateChangeListeners.get(state).forEach(cb => cb(data));
        }
    }

    isState(state) {
        return this._state === state;
    }

    onStateChange(state, callback) {
        if (!this._stateChangeListeners.has(state)) {
            this._stateChangeListeners.set(state, []);
        }
        this._stateChangeListeners.get(state).push(callback);
    }

    getData() {
        return { ...this._data };
    }

    setData(key, value) {
        this._data[key] = value;
    }

    reset() {
        this._state = 'idle';
        this._data = {};
        this._stateHistory = [];
    }

    // ============ Test Helpers ============

    /**
     * Get state transition history
     * @returns {Array<{from: string, to: string, data: any}>}
     */
    getStateHistory() {
        return [...this._stateHistory];
    }

    /**
     * Check if state was ever entered
     * @param {string} state 
     * @returns {boolean}
     */
    wasStateEntered(state) {
        return this._stateHistory.some(h => h.to === state);
    }
}


// ============================================
// MOCK ENTITY PROVIDER
// ============================================

/**
 * Mock entity provider for testing entity-dependent code
 * @implements {import('../interfaces.js').IEntityProvider}
 */
export class MockEntityProvider {
    constructor() {
        /** @type {Map<string, Object>} */
        this._entities = new Map();
        /** @type {Map<string, Set<string>>} */
        this._tagIndex = new Map();
    }

    getEntities() {
        return Array.from(this._entities.values());
    }

    getEntityById(id) {
        return this._entities.get(id) ?? null;
    }

    getEntitiesByTag(tag) {
        const ids = this._tagIndex.get(tag);
        if (!ids) return [];
        return Array.from(ids).map(id => this._entities.get(id)).filter(Boolean);
    }

    addEntity(entity) {
        if (!entity.id) {
            entity.id = `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        this._entities.set(entity.id, entity);
        
        // Index tags
        if (entity.tags) {
            for (const tag of entity.tags) {
                if (!this._tagIndex.has(tag)) {
                    this._tagIndex.set(tag, new Set());
                }
                this._tagIndex.get(tag).add(entity.id);
            }
        }
    }

    removeEntity(id) {
        const entity = this._entities.get(id);
        if (!entity) return false;
        
        // Remove from tag index
        if (entity.tags) {
            for (const tag of entity.tags) {
                this._tagIndex.get(tag)?.delete(id);
            }
        }
        
        return this._entities.delete(id);
    }

    clear() {
        this._entities.clear();
        this._tagIndex.clear();
    }

    // ============ Test Helpers ============

    /**
     * Get entity count
     * @returns {number}
     */
    getCount() {
        return this._entities.size;
    }

    /**
     * Create a simple test entity
     * @param {Partial<{id: string, x: number, y: number, tags: string[]}>} props 
     * @returns {Object}
     */
    createTestEntity(props = {}) {
        const entity = {
            id: props.id ?? `test_${Date.now()}`,
            x: props.x ?? 0,
            y: props.y ?? 0,
            tags: props.tags ?? [],
            ...props
        };
        this.addEntity(entity);
        return entity;
    }
}


// ============================================
// MOCK VFX PROVIDER
// ============================================

/**
 * Mock VFX provider for testing visual effect code
 * @implements {import('../interfaces.js').IVFXProvider}
 */
export class MockVFXProvider {
    constructor() {
        /** @type {Map<string, Object>} */
        this._effects = new Map();
        /** @type {Array<Object>} */
        this._spawnHistory = [];
    }

    update() {
        // No-op for mock
    }

    spawn(config) {
        const id = `vfx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const effect = { id, ...config, spawnTime: Date.now() };
        this._effects.set(id, effect);
        this._spawnHistory.push(effect);
        return id;
    }

    remove(id) {
        return this._effects.delete(id);
    }

    draw(_ctx) {
        // No-op for mock
    }

    clear() {
        this._effects.clear();
    }

    getActiveCount() {
        return this._effects.size;
    }

    // ============ Test Helpers ============

    /**
     * Get all spawned effects history
     * @returns {Array<Object>}
     */
    getSpawnHistory() {
        return [...this._spawnHistory];
    }

    /**
     * Check if a VFX was spawned with specific properties
     * @param {Object} props 
     * @returns {boolean}
     */
    wasSpawnedWith(props) {
        return this._spawnHistory.some(effect => {
            return Object.entries(props).every(([key, value]) => effect[key] === value);
        });
    }

    /**
     * Clear history but keep active effects
     */
    clearHistory() {
        this._spawnHistory = [];
    }
}


// ============================================
// MOCK AUDIO PROVIDER
// ============================================

/**
 * Mock audio provider for testing audio code
 * @implements {import('../interfaces.js').IAudioProvider}
 */
export class MockAudioProvider {
    constructor() {
        /** @type {Array<{action: string, sound: string, timestamp: number}>} */
        this._history = [];
        this._masterVolume = 1;
        this._muted = false;
        /** @type {Map<string, {volume: number, playing: boolean}>} */
        this._instances = new Map();
    }

    play(key, options = {}) {
        const id = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this._history.push({ action: 'play', sound: key, timestamp: Date.now(), options });
        this._instances.set(id, { volume: options.volume ?? 1, playing: true });
        return id;
    }

    stop(id) {
        this._history.push({ action: 'stop', sound: id, timestamp: Date.now() });
        const instance = this._instances.get(id);
        if (instance) {
            instance.playing = false;
        }
    }

    stopAll(key) {
        this._history.push({ action: 'stopAll', sound: key, timestamp: Date.now() });
    }

    pause(id) {
        this._history.push({ action: 'pause', sound: id, timestamp: Date.now() });
    }

    resume(id) {
        this._history.push({ action: 'resume', sound: id, timestamp: Date.now() });
    }

    setMasterVolume(volume) {
        this._masterVolume = Math.max(0, Math.min(1, volume));
    }

    setVolume(id, volume) {
        const instance = this._instances.get(id);
        if (instance) {
            instance.volume = Math.max(0, Math.min(1, volume));
        }
    }

    mute() {
        this._muted = true;
    }

    unmute() {
        this._muted = false;
    }

    isMuted() {
        return this._muted;
    }

    // ============ Test Helpers ============

    /**
     * Get audio action history
     * @returns {Array<{action: string, sound: string, timestamp: number}>}
     */
    getHistory() {
        return [...this._history];
    }

    /**
     * Check if a sound was played
     * @param {string} soundKey 
     * @returns {boolean}
     */
    wasPlayed(soundKey) {
        return this._history.some(h => h.action === 'play' && h.sound === soundKey);
    }

    /**
     * Get play count for a sound
     * @param {string} soundKey 
     * @returns {number}
     */
    getPlayCount(soundKey) {
        return this._history.filter(h => h.action === 'play' && h.sound === soundKey).length;
    }

    /**
     * Clear history
     */
    clearHistory() {
        this._history = [];
    }

    /**
     * Reset all state
     */
    reset() {
        this._history = [];
        this._masterVolume = 1;
        this._muted = false;
        this._instances.clear();
    }
}


// ============================================
// MOCK GAME LOOP
// ============================================

/**
 * Mock game loop for testing loop-dependent code
 * @implements {import('../interfaces.js').IGameLoop}
 */
export class MockGameLoop {
    constructor() {
        this._running = false;
        this._paused = false;
        /** @type {Function[]} */
        this._updateCallbacks = [];
        /** @type {Function[]} */
        this._renderCallbacks = [];
        this._frameCount = 0;
    }

    isRunning() {
        return this._running && !this._paused;
    }

    start() {
        this._running = true;
        this._paused = false;
    }

    stop() {
        this._running = false;
        this._paused = false;
    }

    pause() {
        this._paused = true;
    }

    resume() {
        this._paused = false;
    }

    onUpdate(callback) {
        this._updateCallbacks.push(callback);
    }

    onRender(callback) {
        this._renderCallbacks.push(callback);
    }

    getFPS() {
        return 60; // Fixed for mock
    }

    // ============ Test Helpers ============

    /**
     * Simulate a frame
     * @param {number} deltaTime 
     */
    simulateFrame(deltaTime = 0.016) {
        if (!this._running || this._paused) return;
        
        this._frameCount++;
        this._updateCallbacks.forEach(cb => cb(deltaTime));
        this._renderCallbacks.forEach(cb => cb(deltaTime));
    }

    /**
     * Simulate multiple frames
     * @param {number} count 
     * @param {number} deltaTime 
     */
    simulateFrames(count, deltaTime = 0.016) {
        for (let i = 0; i < count; i++) {
            this.simulateFrame(deltaTime);
        }
    }

    /**
     * Get frame count
     * @returns {number}
     */
    getFrameCount() {
        return this._frameCount;
    }

    /**
     * Reset state
     */
    reset() {
        this._running = false;
        this._paused = false;
        this._updateCallbacks = [];
        this._renderCallbacks = [];
        this._frameCount = 0;
    }
}
