import { Tutorial } from "../tutorial.js";
import { gameEventManager } from "../../jsmanagers/eventmanager.js";
import * as EventHandler from "../../jsutils/eventhandlers.js";

export class MovementTutorial extends Tutorial {
    constructor() {
        super();
        this.handleMove = this.handleMove.bind(this);
        this.subtitle = "Tutorial_Movement";
    }

    bindEvents() {
        gameEventManager.on(EventHandler.characterMoveEvent, this.handleMove);
    }

    handleMove(data) {
        if (this.isCompleted) return;
        if (data.character && !data.character.isOpponent) {
            this.complete();
        }
    }
}
