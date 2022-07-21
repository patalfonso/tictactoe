const playerFactory = (name, sign) => {
    return {name, sign};
}

const gameBoard = (function() {
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

    });

    playerNamesForm.addEventListener('submit', function(e) {
        e.preventDefault();

        player1.name = yourName.textContent = document.querySelector('[name="player1"]').value;
        player2.name = theirName.textContent = document.querySelector('[name="player2"]').value;

        statusMsg.textContent = currentPlayerTurn();
        
        mainMenu.classList.add('deactivate');
    });

    ['mouseenter', 'mouseleave', 'click'].forEach((event) => {
        allCells.forEach((cell) => cell.addEventListener(event, handleCell));
    });

    function handleCell(e) {
        const cellNode = e.target;
        const cellNodeIndex = parseInt(cellNode.getAttribute('data-cell'));
        if (gameBoard[cellNodeIndex] !== "" || !gameActive) return;

        switch(e.type) {
            case "mouseenter":
                cellNode.classList.add('hover');
                cellNode.textContent = currentPlayer.sign;
                break;
            case "mouseleave":
                cellNode.classList.remove('hover');
                cellNode.textContent = '';
                break;
            default: 
                cellNode.classList.remove('hover');
                gameBoard[cellNodeIndex] = cellNode.textContent = currentPlayer.sign;
                checkResults();

        }
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

        let roundDraw = !gameBoard.includes("");
        if (roundWon || roundDraw) {
            statusMsg.style.cssText = 'color: var(--bright-color)';
            gameActive = false;
            statusMsg.textContent = (roundWon) ? winningMessage() : drawMessage();
            return;
        }

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
        statusMsg.style.cssText = 'color: var(--dark-color)';
        statusMsg.textContent = currentPlayerTurn();
        allCells.forEach(cell => cell.textContent = "");
    }
})();