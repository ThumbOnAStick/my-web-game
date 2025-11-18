import { GameObject } from "../jsgameobjects/gameobject.js";
import { Controller } from "./controller.js";
import { ControllerStatus } from "./controllerstatus.js";



export class ShrinkController extends Controller{
    /**
     * 
     * @param {Number} speed 
     * @param {Number} min
     * @param {Number} max
     */
    constructor(speed, min, max) {
        super();
        this.size = 1;
        this.speed = speed 
        this.direction = 1;
        this.min = min;
        this.max = max;
    }

    reverse(){
        this.direction = -this.direction;
    }

  
    /**
     * 
     * @returns {Number}
     */
    getSize() {
        if (this.status === ControllerStatus.OFF){
            this.size = 1;
            return 1;  
        } 
        
        let realSpeed = this.direction * this.speed;
        this.size = this.size + realSpeed;
        
        if (this.size >= this.max) {
            this.size = this.max;
            this.reverse();
        } else if (this.size <= this.min) {
            this.size = this.min;
            this.reverse();
        }
        return this.size;
    }
}