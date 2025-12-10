export const DebugLevel = {
    Log: "log",
    Warning: "warning",
    Error: "error"
}

const DebugColors = {
    [DebugLevel.Log]: "white",
    [DebugLevel.Warning]: "yellow",
    [DebugLevel.Error]: "red"
}

export class DebugMessage{
    /**
     * @param {String} _debugLevel 
     * @param {String} _message
     */
    constructor(_debugLevel, _message){
        this.debugLevel = _debugLevel;
        this.message = _message;
        this.creationTime = new Date().toTimeString().split(' ')[0];
    }

    
}


export class DebugManager {
    constructor() {
        /** @type {import("./gamemanager.js").GameManager} */
        this.gameManager = null;


        /**@type {HTMLInputElement} */
        this.debugCheckbox = /** @type {HTMLInputElement} */ (
            document.getElementById("debugCheckbox")
        );
        this.debugSlider = /** @type {HTMLInputElement} */ (
            document.getElementById("debugSlider")
        );
        this.loseGameButton = /** @type {HTMLInputElement} */ (
            document.getElementById("loseGameButton")
        );

        this.console = /** @type {HTMLInputElement} */ (
            document.getElementById("console")
        );


        /// Log console
        this.maxDisplayMessage = 3;
        /**@type {DebugMessage[]} */
        this.messages = [];
        
    }

    /**
     * @param {import("./gamemanager.js").GameManager} gameManager 
     */
    initialize(gameManager) {
        this.gameManager = gameManager;
        this.setupControls();
    }

    setupControls() {
        if (this.debugCheckbox) {
            this.debugCheckbox.addEventListener("change", () => {
                this.gameManager.canvas.focus();
            });
        }

        if (this.debugSlider) {
            this.debugSlider.addEventListener("input", () => {
                this.gameManager.characterManager.setDrawSize(
                    parseFloat(this.debugSlider.value) / 50.0
                );
            });
        }

        if (this.loseGameButton) {
            this.loseGameButton.addEventListener("click", () => {
                if (this.gameManager.gameLoopManager.isRunning) {
                    const labelPC = this.gameManager.getTranslation("PC");
                    this.gameManager.gameState.endGame(labelPC);
                }
            });
        }
    }

    isDebugMode() {
        return this.debugCheckbox ? this.debugCheckbox.checked : false;
    }

    /**
     * 
     * @param {String} message
     * @param {String} level 
     */
    popMessage(message, level){
        this.messages.push(new DebugMessage(level, message));
        this.updateConsole();
    }

    updateConsole() {
        if (!this.console) return;
        
        // Clear current content
        this.console.innerHTML = "";
        
        // Keep only the last maxDisplayMessage messages
        if (this.messages.length > this.maxDisplayMessage) {
            this.messages = this.messages.slice(this.messages.length - this.maxDisplayMessage);
        }

        // Render messages
        this.messages.forEach(msg => {
            const div = document.createElement("div");
            div.textContent = msg.message + msg.creationTime;
            div.style.color = DebugColors[msg.debugLevel] || "black";
            this.console.appendChild(div);
        });
    }

    
}

export const debugManager = new DebugManager();
