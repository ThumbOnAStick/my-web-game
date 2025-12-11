import { Tutorial } from "../tutorial.js";
import * as EventHandler from "../../jsutils/events/eventhandlers.js";

export class MovementTutorial extends Tutorial {
    constructor() {
        super();
        this.handleMove = this.handleMove.bind(this);
        this.subtitle = "Tutorial_Movement";
    }

    bindEvents() {
        this.eventManager.on(EventHandler.characterMoveEvent, this.handleMove);
    }

    handleMove(data) {
        if (this.isCompleted) return;
        if (data.character && !data.character.isOpponent) {
            this.complete();
        }
    }
}
