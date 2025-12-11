/**
 * @fileoverview Generic service interfaces for game framework dependency injection
 * 
 * These interfaces are designed to be game-agnostic and reusable across different projects.
 * They define contracts that service implementations must fulfill, enabling:
 * - Loose coupling between modules
 * - Easy unit testing with mock implementations
 * - Swappable implementations for different platforms/engines
 * 
 * @module jscore/interfaces
 * @version 1.0.0
 */

// ============================================
// INPUT PROVIDER INTERFACE
// ============================================

/**
 * Generic input handling interface
 * Implementations handle keyboard, mouse, touch, or gamepad input
 * 
 * @typedef {Object} IInputProvider
 * @property {function(): void} update - Process input state each frame
 * @property {function(string): boolean} isKeyDown - Check if a key is currently pressed
 * @property {function(string): boolean} isKeyPressed - Check if key was just pressed this frame
 * @property {function(string): boolean} isKeyReleased - Check if key was just released this frame
 * @property {function(): {x: number, y: number}} getMousePosition - Get current mouse/pointer position
 * @property {function(number): boolean} isMouseButtonDown - Check if mouse button is down (0=left, 1=middle, 2=right)
 * @property {function(): void} reset - Reset input state
 */
export const IInputProvider = /** @type {IInputProvider} */ ({});


// ============================================
// ENTITY PROVIDER INTERFACE
// ============================================

/**
 * Generic entity management interface
 * Manages game entities (characters, enemies, NPCs, etc.)
 * 
 * @typedef {Object} IEntityProvider
 * @property {function(): Object[]} getEntities - Get all managed entities
 * @property {function(string): Object|null} getEntityById - Get entity by unique ID
 * @property {function(string): Object[]} getEntitiesByTag - Get entities with a specific tag
 * @property {function(Object): void} addEntity - Add an entity to management
 * @property {function(string): boolean} removeEntity - Remove entity by ID
 * @property {function(): void} clear - Remove all entities
 */
export const IEntityProvider = /** @type {IEntityProvider} */ ({});


// ============================================
// SCORE PROVIDER INTERFACE
// ============================================

/**
 * Generic score/stats tracking interface
 * 
 * @typedef {Object} IScoreProvider
 * @property {function(string): number} getScore - Get score for a player/team ID
 * @property {function(string, number): void} setScore - Set score for a player/team ID
 * @property {function(string, number): void} addScore - Add to score for a player/team ID
 * @property {function(): Object<string, number>} getAllScores - Get all scores as key-value pairs
 * @property {function(): void} reset - Reset all scores
 */
export const IScoreProvider = /** @type {IScoreProvider} */ ({});


// ============================================
// TIME PROVIDER INTERFACE
// ============================================

/**
 * Generic time/tick management interface
 * Provides consistent timing for game logic
 * 
 * @typedef {Object} ITimeProvider
 * @property {function(): void} update - Process time updates
 * @property {function(function(number): void): void} onTick - Register a tick callback (receives tick count)
 * @property {function(function(number): void): void} offTick - Unregister a tick callback
 * @property {function(): number} getCurrentTick - Get current tick count
 * @property {function(): number} getDeltaTime - Get time since last frame in seconds
 * @property {function(): number} getElapsedTime - Get total elapsed time in seconds
 * @property {function(): number} getTickRate - Get ticks per second
 */
export const ITimeProvider = /** @type {ITimeProvider} */ ({});


// ============================================
// COLLISION PROVIDER INTERFACE
// ============================================

/**
 * Generic collision/physics object management interface
 * Handles collision detection and physics bodies
 * 
 * @typedef {Object} ICollisionProvider
 * @property {function(Object[]): void} update - Update collision checks against entities
 * @property {function(Object): string} addCollider - Add a collider, returns ID
 * @property {function(string): boolean} removeCollider - Remove collider by ID
 * @property {function(): Object[]} getColliders - Get all active colliders
 * @property {function(Object): Object[]} queryOverlap - Get all colliders overlapping with bounds
 * @property {function(Object, Object): boolean} checkCollision - Check collision between two bounds
 */
export const ICollisionProvider = /** @type {ICollisionProvider} */ ({});


// ============================================
// VFX PROVIDER INTERFACE
// ============================================

/**
 * Generic visual effects management interface
 * Handles particles, animations, and visual feedback
 * 
 * @typedef {Object} IVFXProvider
 * @property {function(): void} update - Update all VFX objects
 * @property {function(Object): string} spawn - Spawn VFX from config object, returns ID
 * @property {function(string): boolean} remove - Remove VFX by ID
 * @property {function(Object): void} draw - Draw all VFX (receives render context)
 * @property {function(): void} clear - Remove all VFX
 * @property {function(): number} getActiveCount - Get number of active VFX
 */
export const IVFXProvider = /** @type {IVFXProvider} */ ({});


// ============================================
// SEQUENCE PROVIDER INTERFACE
// ============================================

/**
 * Generic sequence/tutorial/cutscene management interface
 * Handles linear sequences of steps or events
 * 
 * @typedef {Object} ISequenceProvider
 * @property {function(): void} update - Update sequence state
 * @property {function(): void} start - Start the sequence
 * @property {function(): void} stop - Stop and reset the sequence
 * @property {function(): void} pause - Pause the sequence
 * @property {function(): void} resume - Resume the sequence
 * @property {function(Object): void} addStep - Add a step to the sequence
 * @property {function(): number} getCurrentStepIndex - Get current step index
 * @property {function(): number} getTotalSteps - Get total number of steps
 * @property {function(): boolean} isComplete - Check if sequence is complete
 * @property {function(): boolean} isRunning - Check if sequence is running
 */
export const ISequenceProvider = /** @type {ISequenceProvider} */ ({});


// ============================================
// GAME STATE INTERFACE
// ============================================

/**
 * Generic game state management interface
 * Tracks high-level game state and transitions
 * 
 * @typedef {Object} IGameState
 * @property {function(): string} getState - Get current state name
 * @property {function(string, Object=): void} setState - Transition to new state with optional data
 * @property {function(string): boolean} isState - Check if current state matches
 * @property {function(string, function(Object): void): void} onStateChange - Register state change listener
 * @property {function(): Object} getData - Get state-associated data
 * @property {function(string, any): void} setData - Set state data by key
 * @property {function(): void} reset - Reset to initial state
 */
export const IGameState = /** @type {IGameState} */ ({});


// ============================================
// GAME LOOP INTERFACE
// ============================================

/**
 * Generic game loop management interface
 * Controls the main update/render cycle
 * 
 * @typedef {Object} IGameLoop
 * @property {function(): boolean} isRunning - Check if loop is active
 * @property {function(): void} start - Start the game loop
 * @property {function(): void} stop - Stop the game loop completely
 * @property {function(): void} pause - Pause the game loop (can resume)
 * @property {function(): void} resume - Resume a paused loop
 * @property {function(function(number): void): void} onUpdate - Register update callback
 * @property {function(function(number): void): void} onRender - Register render callback
 * @property {function(): number} getFPS - Get current frames per second
 */
export const IGameLoop = /** @type {IGameLoop} */ ({});


// ============================================
// AI CONTROLLER INTERFACE
// ============================================

/**
 * Generic AI controller interface
 * Handles AI decision-making and behavior
 * 
 * @typedef {Object} IAIController
 * @property {function(): void} update - Update AI decision making
 * @property {function(Object): void} setTarget - Set the entity this AI controls
 * @property {function(number): void} setDifficulty - Set AI difficulty (0-1 normalized)
 * @property {function(Object): void} setBehavior - Set behavior tree/state machine
 * @property {function(): void} enable - Enable AI processing
 * @property {function(): void} disable - Disable AI processing
 * @property {function(): boolean} isEnabled - Check if AI is enabled
 */
export const IAIController = /** @type {IAIController} */ ({});


// ============================================
// RESOURCE PROVIDER INTERFACE
// ============================================

/**
 * Generic resource/asset management interface
 * Handles loading and caching of game assets
 * 
 * @typedef {Object} IResourceProvider
 * @property {function(string, string): Promise<any>} load - Load resource by key and path
 * @property {function(Object[]): Promise<void>} loadBatch - Load multiple resources [{key, path, type}]
 * @property {function(string): any} get - Get loaded resource by key
 * @property {function(string): boolean} has - Check if resource is loaded
 * @property {function(string): void} unload - Unload resource by key
 * @property {function(): void} clear - Unload all resources
 * @property {function(): number} getLoadProgress - Get loading progress (0-1)
 * @property {function(function(number): void): void} onProgress - Register progress callback
 */
export const IResourceProvider = /** @type {IResourceProvider} */ ({});


// ============================================
// EVENT MANAGER INTERFACE
// ============================================

/**
 * Generic event bus interface
 * Provides pub/sub messaging between modules
 * 
 * @typedef {Object} IEventManager
 * @property {function(string, function(...any): void): void} on - Subscribe to event
 * @property {function(string, function(...any): void): void} off - Unsubscribe from event
 * @property {function(string, function(...any): void): void} once - Subscribe to event once
 * @property {function(string, ...any): void} emit - Emit event with data
 * @property {function(string): void} removeAllListeners - Remove all listeners for event
 * @property {function(): void} clear - Remove all listeners for all events
 */
export const IEventManager = /** @type {IEventManager} */ ({});


// ============================================
// AUDIO PROVIDER INTERFACE
// ============================================

/**
 * Generic audio management interface
 * Handles sound effects and music playback
 * 
 * @typedef {Object} IAudioProvider
 * @property {function(string, Object=): string} play - Play sound by key, returns instance ID
 * @property {function(string): void} stop - Stop sound by instance ID
 * @property {function(string): void} stopAll - Stop all instances of sound by key
 * @property {function(string): void} pause - Pause sound by instance ID
 * @property {function(string): void} resume - Resume sound by instance ID
 * @property {function(number): void} setMasterVolume - Set master volume (0-1)
 * @property {function(string, number): void} setVolume - Set volume for instance (0-1)
 * @property {function(): void} mute - Mute all audio
 * @property {function(): void} unmute - Unmute all audio
 * @property {function(): boolean} isMuted - Check if audio is muted
 */
export const IAudioProvider = /** @type {IAudioProvider} */ ({});


// ============================================
// RENDER PROVIDER INTERFACE
// ============================================

/**
 * Generic render management interface
 * Handles drawing and render layers
 * 
 * @typedef {Object} IRenderProvider
 * @property {function(): void} clear - Clear the render target
 * @property {function(): void} beginFrame - Begin a new render frame
 * @property {function(): void} endFrame - End the current render frame
 * @property {function(): Object} getContext - Get the underlying render context
 * @property {function(): {width: number, height: number}} getSize - Get render target size
 * @property {function(number, number): void} setSize - Set render target size
 * @property {function(Object): void} drawSprite - Draw a sprite
 * @property {function(string, number, number, Object=): void} drawText - Draw text at position
 */
export const IRenderProvider = /** @type {IRenderProvider} */ ({});


// ============================================
// STORAGE PROVIDER INTERFACE
// ============================================

/**
 * Generic persistent storage interface
 * Handles save/load of game data
 * 
 * @typedef {Object} IStorageProvider
 * @property {function(string, any): Promise<void>} save - Save data by key
 * @property {function(string): Promise<any>} load - Load data by key
 * @property {function(string): Promise<boolean>} exists - Check if key exists
 * @property {function(string): Promise<void>} remove - Remove data by key
 * @property {function(): Promise<string[]>} keys - Get all stored keys
 * @property {function(): Promise<void>} clear - Clear all stored data
 */
export const IStorageProvider = /** @type {IStorageProvider} */ ({});


// ============================================
// SCENE MANAGER INTERFACE
// ============================================

/**
 * Generic scene management interface
 * Handles scene transitions and lifecycle
 * 
 * @typedef {Object} ISceneManager
 * @property {function(string, Object): void} register - Register a scene by name
 * @property {function(string, Object=): Promise<void>} load - Load and switch to scene
 * @property {function(): void} unloadCurrent - Unload current scene
 * @property {function(): string|null} getCurrentSceneName - Get current scene name
 * @property {function(): Object|null} getCurrentScene - Get current scene instance
 * @property {function(string, Object=): void} push - Push scene onto stack
 * @property {function(): void} pop - Pop scene from stack
 */
export const ISceneManager = /** @type {ISceneManager} */ ({});
