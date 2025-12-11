/**
 * @fileoverview Test utilities and helpers for game testing
 * 
 * Provides convenient functions to set up test environments
 * with mock services pre-configured.
 * 
 * @module jscore/testing/testutils
 */

import { ServiceContainer, ServiceKeys } from '../servicecontainer.js';
import {
    MockInputProvider,
    MockEventManager,
    MockTimeProvider,
    MockGameState,
    MockEntityProvider,
    MockVFXProvider,
    MockAudioProvider,
    MockGameLoop
} from './mocks.js';


/**
 * Create a service container pre-populated with mock services
 * @param {Object} [overrides] - Custom service implementations to use instead of mocks
 * @returns {ServiceContainer}
 */
export function createMockServices(overrides = {}) {
    const services = new ServiceContainer();
    
    // Register mock services (or overrides)
    services.register(ServiceKeys.INPUT, overrides.input ?? new MockInputProvider());
    services.register(ServiceKeys.EVENTS, overrides.events ?? new MockEventManager());
    services.register(ServiceKeys.TIME, overrides.time ?? new MockTimeProvider());
    services.register(ServiceKeys.GAME_STATE, overrides.gameState ?? new MockGameState());
    services.register(ServiceKeys.ENTITIES, overrides.entities ?? new MockEntityProvider());
    services.register(ServiceKeys.VFX, overrides.vfx ?? new MockVFXProvider());
    services.register(ServiceKeys.AUDIO, overrides.audio ?? new MockAudioProvider());
    services.register(ServiceKeys.GAME_LOOP, overrides.gameLoop ?? new MockGameLoop());
    
    // Add any additional overrides
    for (const [key, service] of Object.entries(overrides)) {
        if (!services.has(key)) {
            services.register(key, service);
        }
    }
    
    return services;
}


/**
 * Test context that holds mock services and provides helper methods
 */
export class TestContext {
    constructor() {
        /** @type {ServiceContainer} */
        this.services = createMockServices();
    }

    /**
     * Get a mock service by key
     * @template T
     * @param {string} key 
     * @returns {T}
     */
    get(key) {
        return this.services.get(key);
    }

    /** @returns {MockInputProvider} */
    get input() { return this.get(ServiceKeys.INPUT); }
    
    /** @returns {MockEventManager} */
    get events() { return this.get(ServiceKeys.EVENTS); }
    
    /** @returns {MockTimeProvider} */
    get time() { return this.get(ServiceKeys.TIME); }
    
    /** @returns {MockGameState} */
    get gameState() { return this.get(ServiceKeys.GAME_STATE); }
    
    /** @returns {MockEntityProvider} */
    get entities() { return this.get(ServiceKeys.ENTITIES); }
    
    /** @returns {MockVFXProvider} */
    get vfx() { return this.get(ServiceKeys.VFX); }
    
    /** @returns {MockAudioProvider} */
    get audio() { return this.get(ServiceKeys.AUDIO); }
    
    /** @returns {MockGameLoop} */
    get gameLoop() { return this.get(ServiceKeys.GAME_LOOP); }

    /**
     * Reset all mock services to initial state
     */
    reset() {
        this.input.reset();
        this.events.clear();
        this.time.reset();
        this.gameState.reset();
        this.entities.clear();
        this.vfx.clear();
        this.audio.reset();
        this.gameLoop.reset();
    }

    /**
     * Simulate a game frame
     * @param {number} [deltaTime=0.016] 
     */
    tick(deltaTime = 0.016) {
        this.input.update();
        this.time.update();
        this.gameLoop.simulateFrame(deltaTime);
    }

    /**
     * Simulate multiple game frames
     * @param {number} count 
     * @param {number} [deltaTime=0.016] 
     */
    tickMany(count, deltaTime = 0.016) {
        for (let i = 0; i < count; i++) {
            this.tick(deltaTime);
        }
    }
}


/**
 * Create a fresh test context
 * @returns {TestContext}
 */
export function createTestContext() {
    return new TestContext();
}


/**
 * Simple assertion helpers for testing without a framework
 */
export const assert = {
    /**
     * Assert a condition is true
     * @param {boolean} condition 
     * @param {string} [message] 
     */
    isTrue(condition, message = 'Expected true') {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    },

    /**
     * Assert a condition is false
     * @param {boolean} condition 
     * @param {string} [message] 
     */
    isFalse(condition, message = 'Expected false') {
        if (condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    },

    /**
     * Assert two values are equal
     * @param {any} actual 
     * @param {any} expected 
     * @param {string} [message] 
     */
    equals(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(
                `Assertion failed: ${message ?? 'Values not equal'}\n` +
                `  Expected: ${JSON.stringify(expected)}\n` +
                `  Actual: ${JSON.stringify(actual)}`
            );
        }
    },

    /**
     * Assert two values are deeply equal
     * @param {any} actual 
     * @param {any} expected 
     * @param {string} [message] 
     */
    deepEquals(actual, expected, message) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(
                `Assertion failed: ${message ?? 'Objects not equal'}\n` +
                `  Expected: ${JSON.stringify(expected, null, 2)}\n` +
                `  Actual: ${JSON.stringify(actual, null, 2)}`
            );
        }
    },

    /**
     * Assert a value is null or undefined
     * @param {any} value 
     * @param {string} [message] 
     */
    isNullish(value, message = 'Expected null or undefined') {
        if (value != null) {
            throw new Error(`Assertion failed: ${message}, got ${value}`);
        }
    },

    /**
     * Assert a value is not null or undefined
     * @param {any} value 
     * @param {string} [message] 
     */
    isNotNullish(value, message = 'Expected value to exist') {
        if (value == null) {
            throw new Error(`Assertion failed: ${message}`);
        }
    },

    /**
     * Assert a function throws an error
     * @param {Function} fn 
     * @param {string} [message] 
     */
    throws(fn, message = 'Expected function to throw') {
        let threw = false;
        try {
            fn();
        } catch {
            threw = true;
        }
        if (!threw) {
            throw new Error(`Assertion failed: ${message}`);
        }
    }
};


/**
 * Simple test runner for quick validation
 */
export class TestRunner {
    constructor() {
        /** @type {Array<{name: string, fn: Function}>} */
        this._tests = [];
        /** @type {Array<{name: string, passed: boolean, error?: Error}>} */
        this._results = [];
    }

    /**
     * Register a test
     * @param {string} name 
     * @param {Function} fn 
     */
    test(name, fn) {
        this._tests.push({ name, fn });
    }

    /**
     * Run all registered tests
     * @returns {Promise<{passed: number, failed: number, results: Array}>}
     */
    async run() {
        this._results = [];
        let passed = 0;
        let failed = 0;

        for (const { name, fn } of this._tests) {
            try {
                await fn();
                this._results.push({ name, passed: true });
                passed++;
                console.log(`✓ ${name}`);
            } catch (error) {
                this._results.push({ name, passed: false, error });
                failed++;
                console.error(`✗ ${name}`);
                console.error(`  ${error.message}`);
            }
        }

        console.log(`\nResults: ${passed} passed, ${failed} failed`);
        return { passed, failed, results: this._results };
    }
}
