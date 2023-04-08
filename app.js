document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const tRow = 10;
    let nextRandom = 0;
    let timerID;
    let score = 0;
    const colors = [
        'orange', 'red', 'purple', 'green', 'blue'
    ]

    //add class to border
    const rightBorder = squares.filter((item, index) => index % tRow === 9);
    rightBorder.forEach(i => i.classList.add('right_border'));

    const leftBorder = squares.filter((item, index) => index % tRow === 0);
    leftBorder.forEach(i => i.classList.add('left_border'));
  
    

    //Tetrominoes
    const lTetromino = [
        [1, tRow + 1, tRow * 2 + 1, 2],
        [tRow, tRow + 1, tRow + 2, tRow * 2 + 2],
        [1, tRow + 1, tRow * 2 + 1, tRow * 2],
        [tRow, tRow * 2, tRow * 2 + 1, tRow * 2 + 2]
    ]

    const zTetromino = [
        [tRow, tRow + 1, 1, 2],
        [0, tRow, tRow + 1, tRow * 2 + 1],
        [tRow, tRow + 1, 1, 2],
        [0, tRow, tRow + 1, tRow * 2 + 1]
    ]

    const tTetromino = [
        [1, tRow, tRow + 1, tRow + 2],
        [1, tRow + 1, tRow * 2 + 1, tRow + 2],
        [tRow, tRow + 1, tRow + 2, tRow * 2 + 1],
        [1, tRow, tRow + 1, tRow * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, tRow, tRow + 1],
        [0, 1, tRow, tRow + 1],
        [0, 1, tRow, tRow + 1],
        [0, 1, tRow, tRow + 1]
    ]

    const iTetromino = [
        [1, tRow + 1, tRow * 2 + 1, tRow * 3 + 1],
        [tRow, tRow + 1, tRow + 2, tRow + 3],
        [1, tRow + 1, tRow * 2 + 1, tRow * 3 + 1],
        [tRow, tRow + 1, tRow + 2, tRow + 3]
    ]

    const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPotition = 4;
    let currentRotation = 0;

    //randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random() * theTetrominos.length);
    let currentTetro = theTetrominos[random][currentRotation];
    //random will be reasign after freeze function is activated


    //draw the tetromino
    function draw() {
        currentTetro.forEach(index => {
            squares[currentPotition + index].classList.add('tetromino');
            squares[currentPotition + index].style.backgroundColor = colors[random];
        })
    }

    //undraw the tetromino
    function undraw() {
        currentTetro.forEach(index => {
            squares[currentPotition + index].classList.remove('tetromino');
            squares[currentPotition + index].style.backgroundColor = '';
        })
    }

    //assign functions to keyCodes//
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keyup', control);

    //move down every second
    //timerID = setInterval(moveDown, 1000);

    //move down function
    function moveDown() {
        undraw();
        currentPotition += tRow;
        draw();
        freeze();
    }

    //freeze function
    function freeze() {
        if (currentTetro.some(index => squares[currentPotition + index + tRow].classList.contains('taken'))) {
            currentTetro.forEach(index => squares[currentPotition + index].classList.add('taken'));
            //start new tetro//
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominos.length);
            currentTetro = theTetrominos[random][currentRotation];
            currentPotition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }



    //move left and stop at the edge//
    function moveLeft() {
        undraw();
        const isAtLeftEdge = currentTetro.some(index => (currentPotition + index) % tRow === 0);
        if (!isAtLeftEdge) currentPotition -= 1;
        if (currentTetro.some(index => squares[currentPotition + index].classList.contains('taken'))) {
            currentPotition += 1;
        }
        draw();
    }

    //move right and stop at the edge//
    function moveRight() {
        undraw();
        const isAtRightEdge = currentTetro.some(index => (currentPotition + index) % tRow === 9);
        if (!isAtRightEdge) currentPotition += 1;
        if (currentTetro.some(index => squares[currentPotition + index].classList.contains('taken'))) {
            currentPotition -= 1;
        }

        draw();
    }

    //rotate the tetromino//
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === currentTetro.length) {
            currentRotation = 0
        }
        currentTetro = theTetrominos[random][currentRotation];

        if(currentTetro.some(index => squares[currentPotition + index].classList.contains('right_border')) && 
        currentTetro.some(index => squares[currentPotition + index].classList.contains('left_border'))) {
            currentRotation--; //why can't I do this??
        }
        currentTetro = theTetrominos[random][currentRotation];
        draw();
    }

    //show next tetromino//
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;


    //the tetrominos without rotation//
    const nextTetrominos = [
        [0, 1, displayWidth, displayWidth * 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [0, displayWidth, displayWidth * 2, displayWidth * 3], //iTetromino
    ]

    //display the shape in mini-grid display//
    function displayShape() {
        displaySquares.forEach(box => {
            box.classList.remove('tetromino');
            box.style.backgroundColor = '';
        })
        nextTetrominos[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        })
    }

    //add funcitonality to the button//
    startBtn.addEventListener('click', () => {
        if (timerID) {
            clearInterval(timerID)
            timerID = null;
        } else {
            draw()
            timerID = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominos.length)
            displayShape();
        }
    })

    //add score//
    function addScore() {
        for (let i = 0; i < 199; i += tRow) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = '';
                })
                const squaresRemoved = squares.splice(i, tRow)
                squares = squaresRemoved.concat(squares)

                squares.forEach(cell => grid.appendChild(cell)) //what does this line mean?
            }
        }
    }

    //game over//
    function gameOver() {
        if (currentTetro.some(index => squares[currentPotition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'End'
            clearInterval(timerID)
        }
    }
})