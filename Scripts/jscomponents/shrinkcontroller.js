import { GameObject } from "../jsgameobjects/gameobject.js";

export class ShrinkController{
    /**
     * 
     * @param {Number} speed 
     */
    constructor(speed) {
        this.size = 1;
        this.speed = speed 
        this.direction = 1;
    }

    reverse(){
        this.direction = -this.direction;
    }

    update() {
        this.size = this.size + this.speed;
    }
}