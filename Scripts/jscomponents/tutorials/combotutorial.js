import { Tutorial } from "../tutorial.js";
import { gameEventManager } from "../../jsmanagers/eventmanager.js";
import * as EventHandler from "../../jsutils/eventhandlers.js";

export class ComboTutorial extends Tutorial {
    constructor() {
        super();
        this.handleCombo = this.handleCombo.bind(this);
        this.subtitle = "Tutorial_Combo";
    }

    bindEvents() {
        gameEventManager.on(EventHandler.characterSpinSwingEvent, this.handleCombo);
        gameEventManager.on(EventHandler.characterThrustSwingEvent, this.handleCombo);
    }

    handleCombo(data) {
        if (this.isCompleted) return;
        if (data.character && !data.character.isOpponent) {
            this.complete();
        }
    }
}
