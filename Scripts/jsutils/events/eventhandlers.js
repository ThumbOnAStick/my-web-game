/**
 * Event registration module.
 * This file is responsible for registering all event handlers to gameEventManager.
 * Handler implementations are in separate modules (combateventhandler.js, uieventhandler.js).
 */
import { gameEventManager } from "../../jsmanagers/eventmanager.js";
import { ServiceKeys } from "../../jscore/servicecontainer.js";

// Import combat event handlers and constants
import {
    createCombatEventHandlers,
    characterSwingEvent,
    characterLightSwingEvent,
    characterSpinSwingEvent,
    characterThrustSwingEvent,
    characterSwitchSwingTypeEvent,
    characterMoveEvent,
    characterJumpEvent,
    characterDodgeEvent,
    postCharacterSwingEvent,
    settleCharacterSwingEvent,
    resetCharacterDodgingEvent,
    resetCharacterParriedEvent,
    setScoreChangesEvent,
    clearScoreChangesEvent,
    spawnParryFlashEvent,
    playNamedClipEvent,
    handleCharacterShrinkEvent
} from "../combat/combateventhandler.js";

// Import UI event handlers and constants
import {
    initialize_ui,
    changeSubtitle,
    changeSubtitleEvent,
    startGame,
    startGameEvent,
    changeDifficulty,
    changeDifficultyEvent,
    restartGameEvent,
    restartGame
} from "../ui/uieventhandler.js";
import { gameOverEvent, onGameOver, initSceneEvents } from "../scene/sceneeventhandler.js";

// Re-export event constants for external use
export {
    characterSwingEvent,
    characterLightSwingEvent,
    characterSpinSwingEvent,
    characterThrustSwingEvent,
    characterSwitchSwingTypeEvent,
    characterMoveEvent,
    characterJumpEvent,
    characterDodgeEvent,
    postCharacterSwingEvent,
    settleCharacterSwingEvent,
    resetCharacterDodgingEvent,
    resetCharacterParriedEvent,
    setScoreChangesEvent,
    clearScoreChangesEvent,
    spawnParryFlashEvent,
    playNamedClipEvent,
    handleCharacterShrinkEvent
} from "../combat/combateventhandler.js";

// Initialize event listeners with service container
/**
 * Initialize and register all event handlers with the game event manager.
 * @param {import('../../jscore/servicecontainer.js').ServiceContainer} services - Service container with all required services
 * @param {import('../../jsscenes/scene.js').IScene} rootScene - Root scene for UI event handling
 */
export function initialize(services, rootScene) {
    // Get services from container
    const obstacleManager = services.get(ServiceKeys.COLLISION);
    const vfxManager = services.get(ServiceKeys.VFX);
    const audioManager = services.get(ServiceKeys.AUDIO);
    const gameState = services.get(ServiceKeys.GAME_STATE);
    const aiController = services.get(ServiceKeys.AI);

    // Initialize UI event handler with service container
    initialize_ui(services, rootScene);
    
    initSceneEvents(rootScene, aiController);

    // Create combat handlers
    const combatHandlers = createCombatEventHandlers(obstacleManager, vfxManager, audioManager, gameState);

    // Register combat events
    gameEventManager.on(characterSwingEvent, combatHandlers.handleHeavySwingEvent);
    gameEventManager.on(characterLightSwingEvent, combatHandlers.handleLightSwingEvent);
    gameEventManager.on(characterSpinSwingEvent, combatHandlers.handleSpinSwingEvent);
    gameEventManager.on(characterThrustSwingEvent, combatHandlers.handleThrustSwingEvent);
    gameEventManager.on(characterSwitchSwingTypeEvent, combatHandlers.handleSwitchSwingTypeEvent);
    gameEventManager.on(characterMoveEvent, combatHandlers.handleCharacterMoveEvent);
    gameEventManager.on(characterJumpEvent, combatHandlers.handleCharacterJumpEvent);
    gameEventManager.on(characterDodgeEvent, combatHandlers.handleCharacterDodgeEvent);
    gameEventManager.on(postCharacterSwingEvent, combatHandlers.handlePostSwingEvent);
    gameEventManager.on(resetCharacterDodgingEvent, combatHandlers.resetCharacterDodging);
    gameEventManager.on(resetCharacterParriedEvent, combatHandlers.resetCharacterParried);
    gameEventManager.on(settleCharacterSwingEvent, combatHandlers.settleCharacterSwing);
    gameEventManager.on(setScoreChangesEvent, combatHandlers.setScoreChanges);
    gameEventManager.on(clearScoreChangesEvent, combatHandlers.resetScoreChanges);
    gameEventManager.on(spawnParryFlashEvent, combatHandlers.spawnParryFlash);
    gameEventManager.on(playNamedClipEvent, combatHandlers.playSoundClip);

    // Register UI events
    gameEventManager.on(changeSubtitleEvent, changeSubtitle);
    gameEventManager.on(startGameEvent, startGame);
    gameEventManager.on(changeDifficultyEvent, changeDifficulty);
    gameEventManager.on(restartGameEvent, restartGame);

    // Resiger game over event
    gameEventManager.on(gameOverEvent, onGameOver)
}