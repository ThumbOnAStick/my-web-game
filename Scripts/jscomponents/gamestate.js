export class GameState{
    constructor()
    {
        this.isGameOver = false;
        this.winner = null;
    }

    updatePlayerScore(amount)
    {
        if (this.isGameOver) return;        
        if (amount <= 0) 
        {
            this.endGame('opponent');
        }
    }

    updateOpponentScore(amount)
    {
        if (this.isGameOver) return;        
        if (amount <= 0) 
        {
            this.endGame('player');
        }
    }

    endGame(winner) 
    {
        this.isGameOver = true;
        this.winner = winner;
        console.log(`Game Over! Winner: ${winner}`);
     }

    reset()
    {
        this.isGameOver = false;
        this.winner = null;
    }


    getWinner() {
        return this.winner;
    }



}