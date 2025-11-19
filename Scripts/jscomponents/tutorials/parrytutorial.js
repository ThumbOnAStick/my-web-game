import { Tutorial } from "../tutorial.js";
import { gameEventManager } from "../../jsmanagers/eventmanager.js";
import * as EventHandler from "../../jsutils/eventhandlers.js";

export class ParryTutorial extends Tutorial {
    constructor() {
        super();
        this.handleParry = this.handleParry.bind(this);
        this.subtitle = "Tutorial_Parry";
    }

    bindEvents() {
        gameEventManager.on(EventHandler.spawnParryFlashEvent, this.handleParry);
    }

    handleParry(data) {
        if (this.isCompleted) return;
        // data is the character who parried (spawned the flash)
        if (data && !data.isOpponent) {
            this.complete();
        }
    }
}
