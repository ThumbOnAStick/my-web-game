import { ShrinkController } from "../jscomponents/shrinkcontroller.js";

/**
 * Build a shrink controller that oscillates between min and max
 * @param {number} duration - Duration in seconds for one complete cycle (min->max->min)
 * @param {number} min - Minimum size value
 * @param {number} max - Maximum size value
 * @returns {ShrinkController} 
 */
export function buildShrinkController(duration, min, max) 
{
    // Calculate speed per frame (assuming 60 fps)
    // For a full cycle: (max - min) * 2 needs to happen in duration seconds
    // At 60 fps: duration * 60 frames total
    const totalDistance = (max - min) * 2;
    const framesPerCycle = duration * 60;
    const speed = totalDistance / framesPerCycle;
    
    let result = new ShrinkController(speed, min, max);
    return result;
}