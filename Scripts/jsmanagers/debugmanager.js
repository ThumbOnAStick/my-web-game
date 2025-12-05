export class DebugManager {
    /**
     * @param {import("./gamemanager.js").GameManager} gameManager 
     */
    constructor(gameManager) {
        this.gameManager = gameManager;
        
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
}
