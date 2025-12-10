import { gameEventManager } from "../jsmanagers/eventmanager.js";
import { changeDifficultyEvent, startGameEvent } from "../jsutils/ui/uieventhandler.js";
import { UISize } from "../jsutils/ui/uisize.js";
import { createTextButtonCentered, createSliderCentered } from "../jsutils/ui/uiutil.js";
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
            this.ctx,
            this.callStartGameEvent,
        )); 
        
        // Difficulty Slider
        const difficultySlider = createSliderCentered(
            centerX,
            centerY,
            UISize.Slider,
            /** @type {string[]} */ (["Level0", "Level1", "Level2"]),
            this.ctx,
            /** @param {number} index */
            (index) => { gameEventManager.emit(changeDifficultyEvent, index); }
        );
        this.canvasUIElements.push(difficultySlider);
    }

    callStartGameEvent(){
        gameEventManager.emit(startGameEvent);
    }

}