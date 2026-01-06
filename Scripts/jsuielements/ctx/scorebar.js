// oxlint-disable no-unused-vars
import { UIElementCanvas, UIElementConfigurations } from "./uielement.js";
import { COLORS, getHealthColor } from "../../jsutils/ui/uicolors.js";
import { GlobalFonts } from "../../jsutils/ui/uiglobalfont.js";
import { gameEventManager } from "../../jsmanagers/eventmanager.js";
import { Character } from "../../jsgameobjects/character.js";
import { DebugLevel, debugManager } from "../../jsmanagers/debugmanager.js";
import { SnappedSlider } from "./snappedslider.js";

const LABELkEY = "Score";

export class ScoreBar extends UIElementCanvas{
    /**
     * 
     * @param {UIElementConfigurations} config 
     * @param {CanvasRenderingContext2D} ctx 
     */
    constructor(config, ctx){
        super(config, ctx)
        this.label = "";
        this.character = null;
    }

    /**
     * Must be called in game scene.
     * @param {Character} character
     */
    setupScoreBar(character){
        // Register health bar event
        this.character = character;
    }

    onTranslationsChanged(){
        super.onTranslationsChanged();
        this.label = this.config.resourceManager.getTranslation(LABELkEY);
    }

    draw() {
        super.draw();
        if (!this.character){
            return;  
        } 
        const x = this.config.x;
        const y = this.config.y;
        const barWidth = this.config.width || 200;
        const barHeight = this.config.height || 20;
        const margin = 2;

        // Use provided score or fall back to character's score
        const currentScore = this.character.currentScore;
        const maxScore = this.character.maxScore || 100; // Default max score
        const scorePercentage = currentScore / maxScore;

        // Background (dark)
        this.ctx.fillStyle = COLORS.border;
        this.ctx.fillRect(x, y, barWidth + margin, barHeight + margin);

        // Health bar (color based on health percentage)
        const healthWidth = barWidth * scorePercentage;
        this.ctx.fillStyle = getHealthColor(scorePercentage);

        this.ctx.fillRect(x, y, healthWidth, barHeight);

        // Health text
        this.ctx.font = GlobalFonts.normal;
        this.ctx.fillStyle = COLORS.primary;
        this.ctx.fillText(`${this.label}: ${currentScore}/${maxScore}`, x, y + this.config.height * 2);
    }


}