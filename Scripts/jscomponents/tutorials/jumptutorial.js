import { Tutorial } from "../tutorial.js";
import * as EventHandler from "../../jsutils/events/eventhandlers.js";

export class JumpTutorial extends Tutorial {
    constructor() {
        super();
        this.handleJump = this.handleJump.bind(this);
        this.subtitle = "Tutorial_Jump";
    }

    bindEvents() {
        this.eventManager.on(EventHandler.characterJumpEvent, this.handleJump);
    }

    handleJump(data) {
        if (this.isCompleted) return;
        if (data.character && !data.character.isOpponent) {
            this.complete();
        }
    }
}
