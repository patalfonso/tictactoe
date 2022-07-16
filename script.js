// MENU SCREEN
const playerMode = document.querySelector('.player');
const computerMode = document.querySelector('.computer');
const gameModes = document.querySelectorAll('span');
const menu = document.querySelector('.menu');
const subMenus = document.querySelectorAll('.sub-menu');
const chooseOpponentMenu = document.querySelector('.choose-opponent');
const playerNamesMenu = document.querySelector('.player-names');
const difficultyMenu = document.querySelector('.difficulty');
// opponents.forEach((opponent) => opponent.addEventListener("click", function() {menu.classList.add('deactivate')}));

playerMode.addEventListener("click", function() {
    chooseOpponentMenu.setAttribute("hidden", "");
    playerNamesMenu.removeAttribute("hidden");
})

computerMode.addEventListener("click", function() {
    chooseOpponentMenu.setAttribute("hidden", "");
    difficultyMenu.removeAttribute("hidden");
    
})

// MAIN GAME
const allCells = document.querySelectorAll('.cell');
const statusMsg = document.querySelector('.status');
const restartBtn = document.querySelector('.restart');

//Factory function for player objects
const playerFactory = (name, sign) => {
    return {name, sign};
}
const player1 = playerFactory('Player 1', 'X');
const player2 = playerFactory('Player 2', 'O');

// Status messages using function expressions
const winningMessage = () => `${currentPlayer.name} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer.name}'s turn`;

// Intializing game state
let gameActive = true;
let currentPlayer = player1;
let gameBoard = ['', '', '', '', '', '', '', '', ''];
statusMsg.textContent = currentPlayerTurn();

// Cell Clicks
allCells.forEach((cell) => cell.addEventListener("click", handleCellClick));

function handleCellClick(e) {
    // Stores node of clicked cell
    const clickedCell = e.target;
    // Stores node's data-cell property's value
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell'));
    // Break out of function if cell has been played or if game is inactive
    if (gameBoard[clickedCellIndex] !== "" || !gameActive) return;
    // Stores currentPlayer's sign in array and displays in UI
    registerCellPlayed(clickedCell, clickedCellIndex);
    // Check for winner and/or change currentPlayer
    checkResults();
}

// Restart Button
restartBtn.addEventListener("click", restartGame);

function restartGame() {
    gameActive = true;
    currentPlayer = player1;
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    statusMsg.textContent = currentPlayerTurn();
    allCells.forEach(cell => cell.textContent = "");
}

// Other functions
function registerCellPlayed(clickedCell, clickedCellIndex) {
    // Stores currentPlayer's sign in gameBoard array
    gameBoard[clickedCellIndex] = currentPlayer.sign;
    // Display currentPlayer's sign in the UI
    clickedCell.textContent = currentPlayer.sign;

}

// Array of Winning Conditions
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

function checkResults() {
    // Check for winner
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameBoard[winCondition[0]];
        let b = gameBoard[winCondition[1]];
        let c = gameBoard[winCondition[2]];
        if (a === '' || b === '' || c === '') {urrentPlaye
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break
        }
    }

    // If there is winner, display winningMessage and make game inactive
    if (roundWon) {
            statusMsg.textContent = winningMessage();
            gameActive = false;
            return;
    }

    // If there is a draw, display drawMessage and make game inactive
    let roundDraw = !gameBoard.includes("");
    if (roundDraw) {
        statusMsg.textContent = drawMessage();
        gameActive = false;
        return;
    }

    // Change currentPlayer
    changeCurrentPlayer();
}

function changeCurrentPlayer() {
    // Re-assigns currentPlayer variable
    currentPlayer = (currentPlayer === player1 ) ? player2 : player1;
    // Updates currentPlayerTurn message
    statusMsg.textContent = currentPlayerTurn();

}