import { ControllerStatus } from "./controllerstatus.js";

export class Controller {
    constructor() {
        this.status = ControllerStatus.OFF;
    }
    
   turnOn() {
        this.status = ControllerStatus.RUNNING;
    }

    turnOff() {
        this.status = ControllerStatus.OFF;
    }   
}