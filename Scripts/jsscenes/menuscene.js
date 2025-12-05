import { gameEventManager } from "../jsmanagers/eventmanager.js";
import { startGameEvent } from "../jsutils/evenhandlerui.js";
import { UISize } from "../jsutils/uisize.js";
import { createTextButtonCentered } from "../jsutils/uiutil.js";
import { CanvasScene } from "./canvasscene.js";

export class MenuScene extends CanvasScene {

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    constructor(ctx) {
        super(ctx);      
    }

    init(){
        super.init();
        let centerX = this.ctx.canvas.width / 2;
        let centerY = this.ctx.canvas.height / 2;
        // Start Button        
        this.canvasUIElements.push(createTextButtonCentered(
            centerX,
            centerY,
            UISize.ButtonCommon,
            "Start",
            this.callStartGameEvent
        )); 
        
    }

    callStartGameEvent(){
        gameEventManager.emit(startGameEvent);
    }

}