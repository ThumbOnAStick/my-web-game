import { ServiceContainer, ServiceKeys } from "../../jscore/servicecontainer.js";
import { CharacterManager } from "../../jsmanagers/charactermanager.js";
import { DebugLevel, debugManager } from "../../jsmanagers/debugmanager.js";
import { Indicator } from "../../jsuielements/ctx/indicator.js";
import { ScoreBar } from "../../jsuielements/ctx/scorebar.js";
import { indicatorOffset } from "../../jsutils/ui/uioffsets.js";
import { UISize } from "../../jsutils/ui/uisize.js";
import { createIndicator, createTopLeftScoreBar, createTopRightScoreBar } from "../../jsutils/ui/uiutil.js";
import { CanvasScene } from "../canvasscene.js";

export class GameUIScene extends CanvasScene {
    /**@type {ScoreBar} */
    #playerScoreBar;
    /**@type {ScoreBar} */
    #opponentScoreBar;
    /**@type {Indicator} */
    #playerIndicator;
    /**@type {Indicator} */
    #opponentIndicator;

    /** @returns {CharacterManager}*/
    get characterManager() {
        return this.services.get(ServiceKeys.ENTITIES);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {ServiceContainer} services 
     */
    constructor(ctx, services) {
        super(ctx, services);
    }
    initializeUIElements() {
        try {
            super.initializeUIElements();
            this.#opponentScoreBar = createTopRightScoreBar();
            this.#playerScoreBar = createTopLeftScoreBar();
            this.#opponentScoreBar.setupScoreBar(this.characterManager.getOpponent());
            this.#playerScoreBar.setupScoreBar(this.characterManager.getPlayer());
            this.#playerIndicator = createIndicator(indicatorOffset);
            this.#opponentIndicator = createIndicator(indicatorOffset);
            this.#playerIndicator.setupIndicator(this.characterManager.getPlayer());
            this.#opponentIndicator.setupIndicator(this.characterManager.getOpponent());
            this.uiElements.push(this.#opponentScoreBar);
            this.uiElements.push(this.#playerScoreBar);
            this.uiElements.push(this.#playerIndicator);
            this.uiElements.push(this.#opponentIndicator);
        } catch (e) {
            debugManager.popMessage(`Game UI Scene Initialization Error: ${e}`, DebugLevel.Error);
        }

    }

}