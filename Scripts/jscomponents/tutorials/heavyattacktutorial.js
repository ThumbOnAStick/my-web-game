import { Tutorial } from "../tutorial.js";
import * as EventHandler from "../../jsutils/events/eventhandlers.js";

export class HeavyAttackTutorial extends Tutorial {
    constructor() {
        super();
        this.handleAttack = this.handleAttack.bind(this);
        this.subtitle = "Tutorial_HeavyAttack";
    }

    bindEvents() {
        this.eventManager.on(EventHandler.characterSwingEvent, this.handleAttack);
    }

    handleAttack(data) {
        if (this.isCompleted) return;
        if (data.character && !data.character.isOpponent) {
            this.complete();
        }
    }
}
