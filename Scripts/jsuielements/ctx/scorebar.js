// oxlint-disable no-unused-vars
import { UIElementCanvas, UIElementConfigurations } from "./uielement.js";
import { COLORS, getHealthColor } from "../../jsutils/ui/uicolors.js";
import { GlobalFonts } from "../../jsutils/ui/uiglobalfont.js";
import { gameEventManager } from "../../jsmanagers/eventmanager.js";
import { Character } from "../../jsgameobjects/character.js";
import { DebugLevel, debugManager } from "../../jsmanagers/debugmanager.js";
import { SnappedSlider } from "./snappedslider.js";

export class ScoreBar extends UIElementCanvas{
    /**
     * 
     * @param {UIElementConfigurations} config 
     * @param {CanvasRenderingContext2D} ctx 
     */
    constructor(config, ctx){
        super(config, ctx)
        this.labelKey = "";
        this.label = "";
        this.character = null;
        this.score = 0;
    }

    /**
     * Must be called in game scene.
     * @param {number} initialScore
     * @param {Character} character
     * @param {string} labelKey
     */
    setupHealthBar(initialScore, character, labelKey){
        // Register health bar event
        this.score = initialScore;
        this.labelKey = labelKey;
        this.character = character;
    }

    onTranslationsChanged(){
        super.onTranslationsChanged();
        this.label = this.config.resourceManager.getTranslation(this.labelKey);
    }

    draw() {
        super.draw();
        if (!this.character){
            debugManager.popMessage("Character does not exist for score bar!", DebugLevel.Error);
            return;  
        } 
        const x = this.config.x;
        const y = this.config.y;
        const barWidth = this.config.width || 200;
        const barHeight = this.config.height || 20;
        const margin = 2;

        // Use provided score or fall back to character's score
        const currentScore = this.score !== null ? this.score : this.character.currentScore;
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
        this.ctx.fillText(`${this.label}: ${currentScore}/${maxScore}`, x, y - 5);
    }


}