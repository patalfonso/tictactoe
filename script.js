
//FACTORY FUNCTION: Player Objects
const playerFactory = (name, sign) => {
    return {name, sign};
}

//Module Pattern IIFE: Main Logic of Game
const gameBoard = (function() {

    // Create player objects
    const player1 = playerFactory('Player 1', 'X');
    const player2 = playerFactory('Player 2', 'O');

    // Initialize game state
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

const gameMessage = (function() {
    const statusMsg = document.querySelector('.status');

    const winningMessage = () => `${gameBoard.currentPlayer.name} has won!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `It's ${gameBoard.currentPlayer.name}'s turn`;

    statusMsg.textContent = currentPlayerTurn();

    return {statusMsg, winningMessage, drawMessage, currentPlayerTurn};
})();

//Module Pattern IIFE: Display Game/Manipulate DOM
const gameController = (function() {
    const allCells = document.querySelectorAll('.cell');

    allCells.forEach((cell) => cell.addEventListener("click", handleCellClick));

    function handleCellClick(e) {
        // Stores node of clicked cell
        const clickedCell = e.target;
        // Stores node's data-cell property's value
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell'));
        // Break out of function if cell has been played or if game is inactive
        if (gameBoard.gameState[clickedCellIndex] !== "" || !gameBoard.gameActive) return;
        // Stores currentPlayer's sign in array and displays in UI
        registerCellPlayed(clickedCell, clickedCellIndex);
        // Check for winner and/or change currentPlayer
        checkResults();
    }

    function registerCellPlayed(clickedCell, clickedCellIndex) {
        // Stores currentPlayer's sign in gameState array
        gameBoard.gameState[clickedCellIndex] = gameBoard.currentPlayer.sign;
        // Display currentPlayer's sign in the UI
        clickedCell.textContent = gameBoard.currentPlayer.sign;
    
    }
    
    function checkResults() {
        // Check for winner
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = gameBoard.winningConditions[i];
            let a = gameBoard.gameState[winCondition[0]];
            let b = gameBoard.gameState[winCondition[1]];
            let c = gameBoard.gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break
            }
        }
    
        // If there is winner, display winningMessage and make game inactive
        if (roundWon) {
                gameMessage.statusMsg.textContent = gameMessage.winningMessage();
                gameBoard.gameActive = false;
                return;
        }
    
        // If there is a draw, display drawMessage and make game inactive
        let roundDraw = !gameBoard.gameState.includes("");
        if (roundDraw) {
            gameMessage.statusMsg.textContent = gameMessage.drawMessage();
            gameBoard.gameActive = false;
            return;
        }
    
        // Change currentPlayer
        changeCurrentPlayer();
    }
    
    function changeCurrentPlayer() {
        // Re-assigns currentPlayer variable
        gameBoard.currentPlayer = (gameBoard.currentPlayer === gameBoard.player1 ) ? gameBoard.player2 : gameBoard.player1;
        // Updates currentPlayerTurn message
        gameMessage.statusMsg.textContent = gameMessage.currentPlayerTurn();
    
    }

    return {allCells}
})();

const gameRestart = (function() {
    document.querySelector('.restart').addEventListener("click", function() {
        gameBoard.gameActive = true;
        gameBoard.currentPlayer = gameBoard.player1;
        gameBoard.gameState = ["", "", "", "", "", "", "", "", ""];
        gameMessage.statusMsg.textContent = gameMessage.currentPlayerTurn();
        gameController.allCells.forEach(cell => cell.textContent = "");
    });
})();