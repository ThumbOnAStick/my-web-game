// oxlint-disable no-unused-vars
// GameManager.js
// Main game manager that coordinates all systems
import * as Eventhandler from "../jsutils/events/eventhandlers.js";
import { ObstacleManager } from "./obstaclemanager.js";
import { GameState } from "../jscomponents/gamestate.js";
import { gameEventManager } from "./eventmanager.js";
import { Character } from "../jsgameobjects/character.js";
import { Resources } from "../jscomponents/resources.js";
import { InputManager } from "./inputmanager.js";
import { ResourceManager } from "./resourcemanager.js";
import { GlobalUIManager } from "./globaluimanager.js";
import { AIController } from "../jsai/aicontroller.js";
import { TickManager } from "./tickmanager.js";
import { VFXManager } from "./vfxmanager.js";
import { AudioManager } from "./audiomanager.js";
import { GameLoopManager } from "./gameloopmanager.js";
import { CharacterManager } from "./charactermanager.js";
import { RenderManager } from "./rendermanager.js";
import { GameInitializer } from "./gameinitializer.js";
import { TutorialManager } from "./tutorialmanager.js";
import { setupTutorials } from "../jsutils/tutorial/tutorialhelper.js";
import { debugManager } from "./debugmanager.js";
import { CanvasScene } from "../jsscenes/canvasscene.js";
import { MenuScene } from "../jsscenes/menuscene.js";
import { SCENENAMES } from "../jsutils/scene/scenenames.js";
import { buildDefaultRootScene } from "../jsutils/scene/scenehelper.js";
import { ServiceContainer, ServiceKeys } from "../jscore/servicecontainer.js";

export class GameManager {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {*} ctx
   */
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    /**@type {Resources} */
    this.resources = null;
    /**@type {AIController} */
    this.aiController = null;
    /**@type {VFXManager} */
    this.vfxManager = null; // Can't load vfxManager before resources are loaded

    // Initialize game state
    this.gameState = new GameState();

    // Initialize  managers
    this.inputManager = new InputManager(canvas);
    this.obstacleManager = new ObstacleManager();
    this.resourceManager = new ResourceManager();
    this.audioManager = new AudioManager(this.resourceManager);
    this.uiManager = new GlobalUIManager(ctx, canvas, this.inputManager, this.resourceManager);
    this.tickManager = new TickManager(Date.now());
    this.gameLoopManager = new GameLoopManager();
    this.characterManager = new CharacterManager(canvas, null); // Will be set after resources load
    this.renderManager = new RenderManager(ctx, canvas, this.uiManager, null); // VFX manager set later
    this.gameInitializer = new GameInitializer(this);
    // Pass event manager for dependency injection
    this.tutorialManager = new TutorialManager(this.gameState, this.resourceManager, gameEventManager);
    this.debugManager = debugManager;
    this.debugManager.initialize(this);
    this.vfxManager = new VFXManager(this.resourceManager);
    this.renderManager.vfxManager = this.vfxManager;
    
    // Set up manager references
    this.inputManager.setGameManager(this);

    // Build service container for dependency injection
    this.services = this._buildServiceContainer();

    // Set up root scene
    this.rootScene = buildDefaultRootScene(this);

    // Set up game loop callback
    this.gameLoopManager.setUpdateCallback(
      /**
       * @param {number} deltaTime - Time elapsed since last frame in milliseconds
       */
      (deltaTime) => this.update(deltaTime)
    );
  }

  /**
   * Build and populate the service container with all game services
   * @returns {ServiceContainer}
   * @private
   */
  _buildServiceContainer() {
    const services = new ServiceContainer();
    
    // Core systems
    services.register(ServiceKeys.INPUT, this.inputManager);
    services.register(ServiceKeys.TIME, this.tickManager);
    services.register(ServiceKeys.EVENTS, gameEventManager);
    services.register(ServiceKeys.GAME_LOOP, this.gameLoopManager);
    services.register(ServiceKeys.GAME_STATE, this.gameState);
    
    // Entity management
    services.register(ServiceKeys.ENTITIES, this.characterManager);
    services.register(ServiceKeys.COLLISION, this.obstacleManager);
    
    // Resources & rendering
    services.register(ServiceKeys.RESOURCES, this.resourceManager);
    services.register(ServiceKeys.AUDIO, this.audioManager);
    services.register(ServiceKeys.VFX, this.vfxManager);
    services.register(ServiceKeys.RENDER, this.renderManager);
    
    // AI & gameplay
    services.register(ServiceKeys.SEQUENCE, this.tutorialManager);
    
    // Debug
    services.register(ServiceKeys.DEBUG, this.debugManager);
    
    // AI is registered later after initialization
    // services.register(ServiceKeys.AI, this.aiController);
    
    return services;
  }

  /**
   * Register the AI controller after it's created during initialization
   * @param {AIController} aiController
   */
  registerAIController(aiController) {
    this.aiController = aiController;
    this.services.register(ServiceKeys.AI, aiController);
  }

  async initialize() {
    await this.gameInitializer.initialize();
    // Update character manager with loaded resources
 
  }

  start() {
    if (!this.gameInitializer.getIsInitialized()) {
      console.warn("Game not initialized yet");
      return;
    }
    this.gameLoopManager.start();
  }

  stop() {
    this.gameLoopManager.stop();
  }

  /**
   * Main update loop - delegates to scenes and shared systems
   * @param {Number} deltaTime 
   */
  update(deltaTime) {
    // Update UI Manager (global UI elements)
    this.uiManager.update();

    // Update event manager for delayed events
    gameEventManager.update();

    // Update scene (scene handles its own entity updates)
    this.rootScene.update(deltaTime);

    // Render everything
    this.render();
  }

  /**
   * Main render loop - clears screen and delegates to scene
   * Scene is responsible for rendering its own entities
   */
  render() {
    // Clear screen before drawing
    this.renderManager.clearScreen();

    // Scene handles all rendering (UI, entities, VFX)
    this.rootScene.render();
  }

  gotoMenu() {
    // Reset characters
    this.characterManager.resetCharacters();

    // Clear obstacles
    this.obstacleManager.clearObstacles();

    // Reveal UI
    // this.gameState.gotoMenu();
  }

  /**
   *
   * @param {*} element
   * @returns {String}
   */
  getTranslation(element) {
    return this.resourceManager.getTranslation(element);
  }

}
