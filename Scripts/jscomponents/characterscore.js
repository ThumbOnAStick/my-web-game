// CharacterScore.js
// Handles score and defeat logic for a character

export class CharacterScore {
    constructor(maxScore = 100, initialScore = 50) {
        this.maxScore = maxScore;
        this.currentScore = initialScore;
        this.defeated = false;
    }

    loseScore(amount) {
        if (this.defeated) return;
        this.currentScore = Math.max(0, this.currentScore - amount);
        if (this.currentScore <= 0) {
            this.defeated = true;
        }
    }

    resetScore() {
        this.currentScore = 50;
        this.defeated = false;
    }

    score(amount) {
        if (this.defeated) return;
        this.currentScore = Math.min(this.maxScore, this.currentScore + amount);
    }

    getScorePercentage() {
        return this.currentScore / this.maxScore;
    }
}
