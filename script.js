
//Factory function for player objects
const playerFactory = (name, sign) => {
    return {name, sign};
}

const gameBoard = (function() {
    // DOM NODES
    const playerModeBtn = document.querySelector('.player');
    const mainMenu = document.querySelector('.menu');
    const chooseOpponentMenu = document.querySelector('.choose-opponent');
    const playerNamesMenu = document.querySelector('.player-names');
    const playerNamesForm = document.querySelector('#playerNamesForm');
    const yourName = document.querySelector('.your-name');
    const theirName = document.querySelector('.opponent-name');
    const allCells = document.querySelectorAll('.cell');
    const statusMsg = document.querySelector('.status');
    const restartBtn = document.querySelector('.restart');

    // Initialize
    let player1 = playerFactory("Player 1", 'X');
    let player2 = playerFactory("Player 2", 'O');

    let gameActive = true;
    let currentPlayer = player1;
    let gameBoard = ['', '', '', '', '', '', '', '', ''];

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

    // Status messages
    const winningMessage = () => `${currentPlayer.name} has won!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `It's ${currentPlayer.name}'s turn`;

    playerModeBtn.addEventListener("click", function() {
        chooseOpponentMenu.setAttribute('hidden', '');
        playerNamesMenu.removeAttribute('hidden');

    })

    playerNamesForm.addEventListener('submit', function(e) {
        e.preventDefault();

        player1.name = yourName.textContent = document.querySelector('[name="player1"]').value;
        player2.name = theirName.textContent = document.querySelector('[name="player2"]').value;

        statusMsg.textContent = currentPlayerTurn();
        
        mainMenu.classList.add('deactivate');
    })

    allCells.forEach((cell) => cell.addEventListener("click", handleCellClick));

    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell'));
        if (gameBoard[clickedCellIndex] !== "" || !gameActive) return;
        registerCellPlayed(clickedCell, clickedCellIndex);
        checkResults();
    }

    function registerCellPlayed(clickedCell, clickedCellIndex) {
        gameBoard[clickedCellIndex] = clickedCell.textContent = currentPlayer.sign;

    }
    
    function checkResults() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            let a = gameBoard[winCondition[0]];
            let b = gameBoard[winCondition[1]];
            let c = gameBoard[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break
            }
        }

        // If there is winner, display winningMessage, deactivate game, and exit out of function
        if (roundWon) {
                statusMsg.textContent = winningMessage();
                gameActive = false;
                return;
        }

        // If there is a draw, display drawMessage, deactivate game, and exit out of function
        let roundDraw = !gameBoard.includes("");
        if (roundDraw) {
            statusMsg.textContent = drawMessage();
            gameActive = false;
            return;
        }

        // Change currentPlayer ONLY if it doesn't have a winner or a draw
        changeCurrentPlayer();
    }

    function changeCurrentPlayer() {
        currentPlayer = (currentPlayer === player1 ) ? player2 : player1;
        statusMsg.textContent = currentPlayerTurn();

    } 

    restartBtn.addEventListener("click", restartGame);

    function restartGame() {
        gameActive = true;
        currentPlayer = player1;
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        statusMsg.textContent = currentPlayerTurn();
        allCells.forEach(cell => cell.textContent = "");
    }
})();

