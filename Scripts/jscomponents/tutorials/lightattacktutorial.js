import { Tutorial } from "../tutorial.js";
import * as EventHandler from "../../jsutils/events/eventhandlers.js";

export class LightAttackTutorial extends Tutorial {
    constructor() {
        super();
        this.handleAttack = this.handleAttack.bind(this);
        this.subtitle = "Tutorial_LightAttack";
    }

    bindEvents() {
        this.eventManager.on(EventHandler.characterLightSwingEvent, this.handleAttack);
    }

    handleAttack(data) {
        if (this.isCompleted) return;
        if (data.character && !data.character.isOpponent) {
            this.complete();
        }
    }
}
