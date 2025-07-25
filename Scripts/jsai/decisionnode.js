import { TerminalNode } from "./terminalnode.js";
import { AIMetaData } from "./aimetadata.js";

export class DecisionNode
{
    /**
     * 
     * @param {TerminalNode[]|TerminalNode|null} tNodes 
     * @param {DecisionNode[]|DecisionNode|null} dNodes
     */
    constructor(tNodes = [], dNodes = [])
    {
        this.tNodes = /**@type {TerminalNode[]} */ Array.isArray(tNodes) ? tNodes : (tNodes ? [tNodes] : []);
        this.dNodes = /**@type {DecisionNode[]} */ Array.isArray(dNodes) ? dNodes : (dNodes ? [dNodes] : []);
    }

    /**
     * 
     * @param {AIMetaData} data 
     */
    evaluate(data)
    {

    }
}

export class DecisionNodeSquence extends DecisionNode {
    /**
     * 
     * @param {AIMetaData} data 
     */
    evaluate(data) 
    {
        super.evaluate(data);
        if (this.tNodes) 
        {
            for (let i = 0; i < this.tNodes.length; i++) 
            {
                this.tNodes[i].call(data);
            }
        }
        if (this.dNodes) 
        {
            for (let i = 0; i < this.dNodes.length; i++) 
            {
                this.dNodes[i].evaluate(data);
            }
        }

    }

    /**
 * 
 * @param {DecisionNode} dNode 
 */
    appendDNode(dNode)
    {
        this.dNodes.push(dNode);
    }

    /**
     * 
     * @param {TerminalNode} tNode 
     */
    appendTNode(tNode)
    {
        if(this.tNodes.length < 2)
        {
            this.tNodes.push(tNode);
        }
    }
}

export class DecisionNodeChance extends DecisionNode
{
    /**
     * 
     * @param {Function} callback 
     * @param {TerminalNode[]} tNodes 
     * @param {DecisionNode[]} dNodes
     */
    constructor(callback, tNodes = null, dNodes = null)
    {
        super(tNodes, dNodes);
        this.callback = callback;
    }

    /**
     * 
     * @param {AIMetaData} data 
     */
    evaluate(data)
    {
        super.evaluate(data)
        const result = this.callback(data);
        if(this.dNodes.length > 0) // When child dNodes exist
        {
            if(result) // The first node will be called if callback returns true
            {
                this.dNodes[0].evaluate(data);
            }
            else if(this.dNodes.length > 1)
            {
                this.dNodes[1].evaluate(data);
            }
        }

        if(this.tNodes.length > 0) // When child tNodes exist
        {
            if(result)
            {
                this.tNodes[0].call(data);
            }
            else if(this.tNodes.length > 1)
            {
                this.tNodes[1].call(data);
            }
        }
    }

    /**
     * 
     * @param {DecisionNode} dNode 
     */
    appendDNode(dNode)
    {
        if(this.dNodes.length < 2)
        {
            this.dNodes.push(dNode);
        }
    }

    /**
     * 
     * @param {TerminalNode} tNode 
     */
    appendTNode(tNode)
    {
        if(this.tNodes.length < 2)
        {
            this.tNodes.push(tNode);
        }
    }
}
