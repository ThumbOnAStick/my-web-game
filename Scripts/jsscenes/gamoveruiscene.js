import { gameEventManager } from "../jsmanagers/eventmanager.js";
import { ServiceKeys } from "../jscore/servicecontainer.js";
import { restartGameEvent } from "../jsutils/ui/uieventhandler.js";
import { UISize } from "../jsutils/ui/uisize.js";
import { createTextButtonCentered } from "../jsutils/ui/uiutil.js";
import { CanvasScene } from "./canvasscene.js";
import { debugManager } from "../jsmanagers/debugmanager.js";


export class GameOverScene extends CanvasScene {
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {import("../jscore").ServiceContainer} services
     */
    constructor(ctx, services) {
        super(ctx, services);
    }

    /**
     * Get event manager from services (fallback to global for backwards compatibility)
     * @returns {import("../jsmanagers/eventmanager.js").EventManager}
     */
    get eventManager() {
        return this.services?.get(ServiceKeys.EVENTS) ?? gameEventManager;
    }

    init() {
        super.init();
        const centerX = this.ctx.canvas.width / 2;
        const centerY = this.ctx.canvas.height / 2;

        // Start Button        
        this.uiElements.push(createTextButtonCentered(
            centerX,
            centerY,
            UISize.ButtonCommon,
            "Start",
            () => this.onRestartButtonPressed(),
        ));

        debugManager.popMessage("Try to init game over scene");
    }

    onRestartButtonPressed(){
        this.eventManager.emit(restartGameEvent)
    }

    // TODO: Implement game over scene
    update(deltaTime) {
        super.update(deltaTime);
    }

}