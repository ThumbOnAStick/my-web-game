/**
 * Export classes that can be used as a library for 3D projects.
 */

// ============ Event Management ============
export { EventManager, gameEventManager } from './jsmanagers/eventmanager.js';

// ============ Game Objects ============
export { GameObject } from './jsgameobjects/gameobject.js';
export { Obstacle } from './jsgameobjects/obstacle.js';

// ============ Animation System ============
export { Animation } from './jsanimation/animation.js';
export { AnimationController } from './jsanimation/animatoincontroller.js';
export { TransitionAnimation } from './jsanimation/transitionanimation.js';
export { Bone } from './jsanimation/bone.js';
export { Rig } from './jsanimation/rig.js';
export { SpritePart } from './jsanimation/spritepart.js';

// ============ AI System ============
export { AIController } from './jsai/aicontroller.js';
export { AIMetadata } from './jsai/aimetadata.js';
export { DecisionNode } from './jsai/decisionnode.js';
export { TerminalNode } from './jsai/terminalnode.js';

// ============ Components ============
export { CharacterAnimation } from './jscomponents/characteranimation.js';
export { CharacterCombatState } from './jscomponents/charactercombatstate.js';
export { ComboReader } from './jscomponents/comboreader.js';
export { GameState } from './jscomponents/gamestate.js';
export { Resources } from './jscomponents/resources.js';
export { RigidBody } from './jscomponents/rigidbody.js';
export { ShrinkController } from './jscomponents/shrinkcontroller.js';

// ============ Managers ============
export { AudioManager } from './jsmanagers/audiomanager.js';
export { CharacterManager } from './jsmanagers/charactermanager.js';
export { GameInitializer } from './jsmanagers/gameinitializer.js';
export { GameLoopManager } from './jsmanagers/gameloopmanager.js';
export { GameManager } from './jsmanagers/gamemanager.js';
export { InputManager } from './jsmanagers/inputmanager.js';
export { ObstacleManager } from './jsmanagers/obstaclemanager.js';
export { RenderManager } from './jsmanagers/rendermanager.js';
export { ResourceManager } from './jsmanagers/resourcemanager.js';
export { TickManager } from './jsmanagers/tickmanager.js';
export { UIManager } from './jsmanagers/uimanager.js';
export { VFXManager } from './jsmanagers/vfxmanager.js';

// ============ Utilities ============
export { Colors } from './jsutils/colors.js';
export { CombatHandler } from './jsutils/combathandler.js';
export { ComboHandler } from './jsutils/combohandler.js';
export { DecisionTreeHelper } from './jsutils/decisiontreehelper.js';
export { ErrorLogger } from './jsutils/errorlogger.js';

// ============ Mixins ============
export { CharacterAnimationMixin } from './jsgameobjects/mixins/CharacterAnimationMixin.js';
export { CharacterCombatMixin } from './jsgameobjects/mixins/CharacterCombatMixin.js';
export { CharacterMovementMixin } from './jsgameobjects/mixins/CharacterMovementMixin.js';
export { CharacterScoreMixin } from './jsgameobjects/mixins/CharacterScoreMixin.js';

// ============ VFX Objects ============
export { VFXObject } from './jsgameobjects/vfxobjects/vfxobject.js';
