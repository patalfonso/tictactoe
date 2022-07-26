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

        //an array of available (or empty) indexes from gameBoard
        let availableSpaces = gameBoard.map((value, index) => index).filter((value) => !gameBoard[value]);

        //declares bestMove with a random element from availableSpaces array
        let bestMove = availableSpaces[Math.floor(Math.random()*availableSpaces.length)];

        //an array of all possible winCondition(s) of a particular player ('X' or 'O')
        let winningConditionsForPlayer = (playerSign) => winningConditions.filter((winCondition) => winCondition.every((index) => gameBoard[index] == playerSign || !gameBoard[index]));

        let getBestMoveForPlayer = (playerSign) => {
            let leastSpacesNeededToWin = Infinity; // Start the least spaces needed to win with a number greater 3
            let bestWinCondition; // Define best win condition

            for (let winCondition of winningConditionsForPlayer(playerSign)) { // For each win condition that the player can win ("X" or "O")
                let spacesNeededToWin = 0; // Define spaces needed to win starting at 0

                for (let index of winCondition) { // Grabs all index spots from every winCondition
                    if (availableSpaces.includes(index)) spacesNeededToWin++; // Counts how many spaces needed to fulfill the winCondition 1 or 2 or 3
                }
                if (spacesNeededToWin < leastSpacesNeededToWin) { // If spaces needed to win is less than any previous counts then do this
                    leastSpacesNeededToWin = spacesNeededToWin; // Change the previous amount of spaces needed to win with the new one that needs less spaces to win
                    bestWinCondition = winCondition; // Set best win condition
                }
            }

            if (!bestWinCondition) return; // If no bet win condition set then break out and we will just use the random bestMove set at beginning

            // Grab the empty spot from the best win condition and set bestMove
            for (let index of bestWinCondition) { 
                if (availableSpaces.includes(index) && leastSpacesNeededToWin == 1) bestMove = index;
            }
        }

        //Execute for medium and hard mode
        while (difficultyMode == "medium" || difficultyMode == "hard") {
            getBestMoveForPlayer(player1.sign); //best block move
            if (difficultyMode == "hard") {
                if (availableSpaces.includes(4)) {
                    bestMove = 4;
                    break;
                }
                getBestMoveForPlayer(player2.sign); //best win move
            }
            break;
        }

        //Updates Gameboard UI and gameBoard array
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