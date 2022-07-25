const playerFactory = (name, sign) => {
    return {name, sign};
}

const gameBoard = (function() {
    const playerModeBtn = document.querySelector('.player');
    const computerModeBtn = document.querySelector('.computer');
    const mainMenu = document.querySelector('.menu');
    const chooseOpponentMenu = document.querySelector('.choose-opponent');
    const difficultyMenu = document.querySelector('.difficulty');
    const playerNamesMenu = document.querySelector('.player-names');
    const playerNamesForm = document.querySelector('#playerNamesForm');
    const difficultyForm = document.querySelector('#difficultyForm');
    const yourName = document.querySelector('.your-name');
    const theirName = document.querySelector('.opponent-name');
    const allCells = document.querySelectorAll('.cell');
    const statusMsg = document.querySelector('.status');
    const restartBtn = document.querySelector('.restart');
    const myWins = document.querySelector('.my-wins');
    const theirWins = document.querySelector('.their-wins');

    let player1 = playerFactory("Player 1", 'X');
    let player2 = playerFactory("Player 2", 'O');

    let gameActive = true;
    let currentPlayer = player1;
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let myWinsCounter = 0;
    let theirWinsCounter = 0;
    let difficultyMode = null;

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

    computerModeBtn.addEventListener("click", function() {
        chooseOpponentMenu.setAttribute('hidden', '');
        difficultyMenu.removeAttribute('hidden');
    })

    playerNamesForm.addEventListener('submit', function(e) {
        e.preventDefault();

        player1.name = yourName.textContent = document.querySelector('[name="player1"]').value;
        player2.name = theirName.textContent = document.querySelector('[name="player2"]').value;

        statusMsg.textContent = currentPlayerTurn();
        
        mainMenu.classList.add('deactivate');
    });

    difficultyForm.addEventListener('submit', function(e) {
        e.preventDefault();

        player1.name = yourName.textContent = "Player";
        player2.name = theirName.textContent = "Computer";

        difficultyMode = document.querySelector('[name="game-mode"]:checked').value

        mainMenu.classList.add('deactivate');
    });

    

    ['mouseenter', 'mouseleave', 'click'].forEach((event) => {
        allCells.forEach((cell) => cell.addEventListener(event, handleCell));
    });

    function handleCell(e) {
        const cellNode = e.target;
        const cellNodeIndex = parseInt(cellNode.getAttribute('data-cell'));
        if (gameBoard[cellNodeIndex] !== "" || !gameActive) return;
        if (currentPlayer === player2 && difficultyMode) return;

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
                if (difficultyMode && gameActive) setTimeout(computerMove, 500);
        }
    }

    function computerMove() {
        let availableSpaces = gameBoard.map((value,index) => {return index}).filter((value) => {return !gameBoard[value]});
        let winningConditionsForPlayer = (playerSign) => winningConditions.filter(function(condition) {
            return condition.every(function(index) {
                return gameBoard[index] == playerSign || !gameBoard[index];
            });
        });

        let getBestMoveForPlayer = (playerSign) => {
            let lowestScore = Infinity;
            let conditionToWin;
            for (let conditionSpaces of winningConditionsForPlayer(playerSign)) {
                let score = 0;
                for (let space of conditionSpaces) {
                    if (availableSpaces.includes(space)) score++;
                }
                if (score < lowestScore) {lowestScore = score;conditionToWin=conditionSpaces;}
            }
            if (!conditionToWin) return;
            for (let position of conditionToWin) {
                if (availableSpaces.includes(position) && lowestScore == 1) {
                    bestMove = position;
                    return;
                }
            }
        }

        let bestMove = availableSpaces[Math.floor(Math.random()*availableSpaces.length)];
        while (difficultyMode != "easy") {
            getBestMoveForPlayer(player1.sign);
            if (difficultyMode == "hard") {
                if (availableSpaces.includes(4)) {
                    bestMove = 4;
                    break;
                }
                getBestMoveForPlayer(player2.sign);
            }
            break;
        }

        gameBoard[bestMove] = allCells[bestMove].textContent = currentPlayer.sign;
        checkResults();
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

            if (roundWon) {
                statusMsg.textContent = winningMessage();
                (currentPlayer === player1) ? myWins.textContent = ++myWinsCounter : theirWins.textContent = ++theirWinsCounter;
            } else {
                statusMsg.textContent = drawMessage();
            }

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