import { DebugLevel, debugManager } from "./debugmanager.js";
import { ResourceManager } from "./resourcemanager.js";

export class AudioManager {
    /**
     * @param {ResourceManager} resourceManager 
     */
    constructor(resourceManager) {
        this.resourceManager = resourceManager;
    }

    /**
     * 
     * @param {String} clipName 
     */
    playOnce(clipName) {
        if (this.resourceManager)
            try {
                const sound = this.resourceManager.getSound(clipName);
                if (sound) {
                    sound.play();
                }
            } catch (e) {
            }
    }


}