export class GameState{
    constructor(){
        this.characterScore = 50;
        this.opponentScore = 50;
        this.isGameOver = false;
        this.maxScore = 50;
        this.winner = null;
    }

    updateCharacterScore(amount){
        if (this.isGameOver) return;
        this.characterScore = Math.max(0, this.characterScore + amount);
        
        if (this.characterScore <= 0) {
            this.endGame('opponent');
        }
    }

    updateOpponentScore(amount){
        if (this.isGameOver) return;
        this.opponentScore = Math.max(0, this.opponentScore + amount);
        
        if (this.opponentScore <= 0) {
            this.endGame('character');
        }
    }

    endGame(winner) {
        this.isGameOver = true;
        this.winner = winner;
        console.log(`Game Over! Winner: ${winner}`);
        // Could emit events here if EventManager is available
    }

    reset(){
        this.characterScore = 50;
        this.opponentScore = 50;
        this.isGameOver = false;
        this.winner = null;
    }

    // Getter methods
    getCharacterScore() {
        return this.characterScore;
    }

    getOpponentScore() {
        return this.opponentScore;
    }

    getWinner() {
        return this.winner;
    }

    getCharacterScorePercentage() {
        return this.characterScore / this.maxScore;
    }

    getOpponentScorePercentage() {
        return this.opponentScore / this.maxScore;
    }
}