import { ResourceManager } from "./resourcemanager.js";

export class AudioManager
{
    /**
     * @param {ResourceManager} resourceManager 
     */
    constructor(resourceManager)
    {
        this.resourceManager = resourceManager;
    }

    /**
     * 
     * @param {String} clipName 
     */
    playOnce(clipName)
    {
        if(this.resourceManager)
            this.resourceManager.getSound(clipName).play();   
    }
}