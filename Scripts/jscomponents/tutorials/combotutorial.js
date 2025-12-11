import { Tutorial } from "../tutorial.js";
import * as EventHandler from "../../jsutils/events/eventhandlers.js";

export class ComboTutorial extends Tutorial {
    constructor() {
        super();
        this.handleCombo = this.handleCombo.bind(this);
        this.subtitle = "Tutorial_Combo";
    }

    bindEvents() {
        this.eventManager.on(EventHandler.characterSpinSwingEvent, this.handleCombo);
        this.eventManager.on(EventHandler.characterThrustSwingEvent, this.handleCombo);
    }

    handleCombo(data) {
        if (this.isCompleted) return;
        if (data.character && !data.character.isOpponent) {
            this.complete();
        }
    }
}
