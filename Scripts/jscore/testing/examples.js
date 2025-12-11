/**
 * @fileoverview Example tests demonstrating mock service usage
 * 
 * Run this file directly in browser console or via a test runner
 * to see how mock services can be used for testing.
 * 
 * @example
 * // In browser console:
 * import { runExampleTests } from './Scripts/jscore/testing/examples.js';
 * runExampleTests();
 */

import { createTestContext, assert, TestRunner } from './testutils.js';
import { ServiceKeys } from '../servicecontainer.js';


/**
 * Run all example tests
 */
export async function runExampleTests() {
    const runner = new TestRunner();

    // ============================================
    // Input Provider Tests
    // ============================================
    
    runner.test('MockInputProvider - key press detection', () => {
        const ctx = createTestContext();
        
        // Initially no keys pressed
        assert.isFalse(ctx.input.isKeyDown('Space'));
        
        // Simulate key press
        ctx.input.simulateKeyDown('Space');
        assert.isTrue(ctx.input.isKeyDown('Space'));
        assert.isTrue(ctx.input.isKeyPressed('Space')); // Just pressed this frame
        
        // After update, still down but not "just pressed"
        ctx.input.update();
        assert.isTrue(ctx.input.isKeyDown('Space'));
        assert.isFalse(ctx.input.isKeyPressed('Space'));
        
        // Simulate key release
        ctx.input.simulateKeyUp('Space');
        assert.isFalse(ctx.input.isKeyDown('Space'));
        assert.isTrue(ctx.input.isKeyReleased('Space'));
    });

    runner.test('MockInputProvider - mouse tracking', () => {
        const ctx = createTestContext();
        
        ctx.input.simulateMouseMove(100, 200);
        const pos = ctx.input.getMousePosition();
        assert.equals(pos.x, 100);
        assert.equals(pos.y, 200);
        
        ctx.input.simulateMouseDown(0);
        assert.isTrue(ctx.input.isMouseButtonDown(0));
        
        ctx.input.simulateMouseUp(0);
        assert.isFalse(ctx.input.isMouseButtonDown(0));
    });

    // ============================================
    // Event Manager Tests
    // ============================================

    runner.test('MockEventManager - event emission and listening', () => {
        const ctx = createTestContext();
        let received = null;
        
        ctx.events.on('test_event', (data) => {
            received = data;
        });
        
        ctx.events.emit('test_event', { value: 42 });
        
        assert.isNotNullish(received);
        assert.equals(received.value, 42);
        assert.isTrue(ctx.events.wasEmitted('test_event'));
    });

    runner.test('MockEventManager - once listener', () => {
        const ctx = createTestContext();
        let callCount = 0;
        
        ctx.events.once('one_time', () => {
            callCount++;
        });
        
        ctx.events.emit('one_time');
        ctx.events.emit('one_time');
        
        assert.equals(callCount, 1, 'Should only be called once');
    });

    runner.test('MockEventManager - history tracking', () => {
        const ctx = createTestContext();
        
        ctx.events.emit('event_a', 'data1');
        ctx.events.emit('event_b', 'data2');
        ctx.events.emit('event_a', 'data3');
        
        const history = ctx.events.getEmittedEventsByName('event_a');
        assert.equals(history.length, 2);
    });

    // ============================================
    // Time Provider Tests
    // ============================================

    runner.test('MockTimeProvider - tick advancement', () => {
        const ctx = createTestContext();
        let tickCount = 0;
        
        ctx.time.onTick(() => {
            tickCount++;
        });
        
        ctx.time.advanceTicks(5);
        
        assert.equals(tickCount, 5);
        assert.equals(ctx.time.getCurrentTick(), 5);
    });

    runner.test('MockTimeProvider - time tracking', () => {
        const ctx = createTestContext();
        
        ctx.time.setDeltaTime(0.016); // 60fps
        ctx.time.advanceTime(1); // 1 second
        
        assert.isTrue(ctx.time.getElapsedTime() >= 1);
    });

    // ============================================
    // Game State Tests
    // ============================================

    runner.test('MockGameState - state transitions', () => {
        const ctx = createTestContext();
        
        assert.equals(ctx.gameState.getState(), 'idle');
        
        ctx.gameState.setState('playing', { level: 1 });
        assert.equals(ctx.gameState.getState(), 'playing');
        assert.equals(ctx.gameState.getData().level, 1);
        
        ctx.gameState.setState('gameover');
        assert.isTrue(ctx.gameState.wasStateEntered('playing'));
        assert.isTrue(ctx.gameState.wasStateEntered('gameover'));
    });

    runner.test('MockGameState - state change listeners', () => {
        const ctx = createTestContext();
        let pauseTriggered = false;
        
        ctx.gameState.onStateChange('paused', () => {
            pauseTriggered = true;
        });
        
        ctx.gameState.setState('paused');
        assert.isTrue(pauseTriggered);
    });

    // ============================================
    // Entity Provider Tests
    // ============================================

    runner.test('MockEntityProvider - entity management', () => {
        const ctx = createTestContext();
        
        const entity1 = ctx.entities.createTestEntity({ tags: ['enemy'] });
        const entity2 = ctx.entities.createTestEntity({ tags: ['enemy'] });
        const entity3 = ctx.entities.createTestEntity({ tags: ['player'] });
        
        assert.equals(ctx.entities.getCount(), 3);
        
        const enemies = ctx.entities.getEntitiesByTag('enemy');
        assert.equals(enemies.length, 2);
        
        ctx.entities.removeEntity(entity1.id);
        assert.equals(ctx.entities.getCount(), 2);
    });

    // ============================================
    // VFX Provider Tests
    // ============================================

    runner.test('MockVFXProvider - effect spawning', () => {
        const ctx = createTestContext();
        
        ctx.vfx.spawn({ type: 'explosion', x: 100, y: 200 });
        ctx.vfx.spawn({ type: 'spark', x: 50, y: 50 });
        
        assert.equals(ctx.vfx.getActiveCount(), 2);
        assert.isTrue(ctx.vfx.wasSpawnedWith({ type: 'explosion' }));
    });

    // ============================================
    // Audio Provider Tests
    // ============================================

    runner.test('MockAudioProvider - sound playback tracking', () => {
        const ctx = createTestContext();
        
        ctx.audio.play('explosion');
        ctx.audio.play('footstep');
        ctx.audio.play('footstep');
        
        assert.isTrue(ctx.audio.wasPlayed('explosion'));
        assert.equals(ctx.audio.getPlayCount('footstep'), 2);
    });

    // ============================================
    // Integration Tests
    // ============================================

    runner.test('TestContext - tick simulation', () => {
        const ctx = createTestContext();
        let updateCount = 0;
        
        ctx.gameLoop.onUpdate(() => {
            updateCount++;
        });
        
        ctx.gameLoop.start();
        ctx.tickMany(10);
        
        assert.equals(updateCount, 10);
        assert.equals(ctx.time.getCurrentTick(), 10);
    });

    runner.test('Service container - service access', () => {
        const ctx = createTestContext();
        
        const input = ctx.services.get(ServiceKeys.INPUT);
        assert.isNotNullish(input);
        assert.equals(input, ctx.input);
    });

    // Run all tests
    return await runner.run();
}


// Export for direct execution
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.runExampleTests = runExampleTests;
}
