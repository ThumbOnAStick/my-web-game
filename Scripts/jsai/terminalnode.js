import { AIMetaData } from "./aimetadata.js";

export class TerminalNode
{
    /**
     * @param {TerminalNode} nextNode 
     * @param {Function} callback
     */
    constructor(callback, nextNode = null)
    {
        this.nextNode = nextNode;
        this.callback = /**@type {Function} */ callback;
    }

    /**
     * 
     * @param {AIMetaData} data 
     */
    call(data)
    {
        if (this.callback) {
            this.callback(data);
        }
    }
}