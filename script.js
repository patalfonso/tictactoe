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
                if (difficultyMode) setTimeout(function() {computerMove(cellNodeIndex)}, 500);
        }
    }

    function computerMove(cellNodeIndex) {
        if (!gameActive) return;
        switch(difficultyMode) {
            case "easy":
                while (true) {
                    cIndex = Math.floor(Math.random()*gameBoard.length);
                    if (!gameBoard[cIndex]) break;
                }
                break;

            case "medium":
                for (let winCondition of winningConditions) {
                    if(winCondition.includes(cellNodeIndex)) {
                        for (var ig = 0; ig < 4; ig++) {
                            cIndex = ig;
                            if (!gameBoard[cIndex]) break;
                        }
                    }
                };
                break;

            case "hard":
                for (var i = 0; i < winningConditions.length; i++) {
                    if(!winningConditions[i].includes(cellNodeIndex)) continue;
                    correct = 0;
                    for (var ii = 0; ii < winningConditions[i].length; ii++) {
                        if (gameBoard[winningConditions[i][ii]] == "X") correct++;
                        if (!gameBoard[winningConditions[i][ii]]) {
                            cIndex = winningConditions[i][ii];
                        };
                        bestSpot = null;
                        if (correct == 2 && ii == 2) {
                            for (var ig = 0; ig < 4; ig++) {
                                cIndex = winningConditions[i][ig];
                                bestSpot = winningConditions[i][ig];
                                if (!gameBoard[cIndex]) break;
                            };
                        };
                    };
                    if (bestSpot) break;
                };
                if (typeof(cIndex) == "undefined") {
                    for (var i = 0; i < winningConditions.length; i++) {
                        if(winningConditions[i].includes(cellNodeIndex)) {
                            cIndex = Math.floor(Math.random()*winningConditions[i].length);
                            while (true) {
                                if (!gameBoard[cIndex]) break;
                                cIndex = Math.floor(Math.random()*gameBoard.length);
                            }
                        }
                    };
                };
                break;
        }
        gameBoard[cIndex] = allCells[cIndex].textContent = currentPlayer.sign;
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