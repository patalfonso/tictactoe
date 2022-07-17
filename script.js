
//FACTORY FUNCTION: Player Objects
const playerFactory = (name, sign) => {
    return {name, sign};
}

//Module Pattern IIFE: Game Board Initialization
const gameBoard = (function() {
    const player1 = playerFactory('Player 1', 'X');
    const player2 = playerFactory('Player 2', 'O');

    let gameActive = true;
    let currentPlayer = player1;
    let gameState = ['', '', '', '', '', '', '', '', ''];

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return {player1, player2, currentPlayer, gameActive, gameState, winningConditions}
})();

// Module Pattern IIFE: Game Status Messages
const gameMessage = (function() {
    const statusMsg = document.querySelector('.status');

    const winningMessage = () => `${gameBoard.currentPlayer.name} has won!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `It's ${gameBoard.currentPlayer.name}'s turn`;

    statusMsg.textContent = currentPlayerTurn();

    return {statusMsg, winningMessage, drawMessage, currentPlayerTurn};
})();

//Module Pattern IIFE: Display Game
const gameController = (function() {
    const _registerCellPlayed = (clickedCell, clickedCellIndex) => {
        gameBoard.gameState[clickedCellIndex] = gameBoard.currentPlayer.sign;
        clickedCell.textContent = gameBoard.currentPlayer.sign;
    }

    const _checkResults = () => {
        let _roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = gameBoard.winningConditions[i];
            let a = gameBoard.gameState[winCondition[0]];
            let b = gameBoard.gameState[winCondition[1]];
            let c = gameBoard.gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                _roundWon = true;
                break
            }
        }
    
        if (_roundWon) {
                gameMessage.statusMsg.textContent = gameMessage.winningMessage();
                gameBoard.gameActive = false;
                return;
        }
    
        let _roundDraw = !gameBoard.gameState.includes("");
        if (_roundDraw) {
            gameMessage.statusMsg.textContent = gameMessage.drawMessage();
            gameBoard.gameActive = false;
            return;
        }
    
        _changeCurrentPlayer();
    }

    const _changeCurrentPlayer = () => {
        gameBoard.currentPlayer = (gameBoard.currentPlayer === gameBoard.player1 ) ? gameBoard.player2 : gameBoard.player1;
        gameMessage.statusMsg.textContent = gameMessage.currentPlayerTurn();
    }

    const allCells = document.querySelectorAll('.cell');
    allCells.forEach((cell) => cell.addEventListener("click", (e) => {
            const clickedCell = e.target;
            const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell'));
            if (gameBoard.gameState[clickedCellIndex] !== "" || !gameBoard.gameActive) return;
            _registerCellPlayed(clickedCell, clickedCellIndex);
            _checkResults();
        }
    ));

    return {allCells}
})();

// Module Pattern IIFE: Restart Button
const gameRestart = (function() {
    document.querySelector('.restart').addEventListener("click", function() {
        gameBoard.gameActive = true;
        gameBoard.currentPlayer = gameBoard.player1;
        gameBoard.gameState = ["", "", "", "", "", "", "", "", ""];
        gameMessage.statusMsg.textContent = gameMessage.currentPlayerTurn();
        gameController.allCells.forEach(cell => cell.textContent = "");
    });
})();