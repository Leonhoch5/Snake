document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');
    const scoreElement = document.getElementById('score');
    const menu = document.getElementById('menu');
    const pauseMenu = document.getElementById('pauseMenu');
    const gameOverScreen = document.getElementById('gameOver');
    const startButton = document.getElementById('startButton');
    const resumeButton = document.getElementById('resumeButton');
    const restartButton = document.getElementById('restartButton');
    
    const rows = 10; // Fixed rows for 10x10 grid
    const cols = 10; // Fixed columns for 10x10 grid
    const totalCells = rows * cols;
    const cells = [];
    let snake = [2, 1, 0]; // Initial snake cells
    let direction = 1; // 1 = right, -1 = left, cols = down, -cols = up
    let foodIndex = 0;
    let intervalTime = 200;
    let interval = 0;
    let canChangeDirection = true;
    let score = 0;
    let isPaused = false;

    // Generate grid cells
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        gridContainer.appendChild(cell);
        cells.push(cell);
    }

    // Show menu initially
    menu.style.display = 'flex';

    // Event listeners for buttons
    startButton.addEventListener('click', startGame);
    resumeButton.addEventListener('click', resumeGame);
    restartButton.addEventListener('click', restartGame);

    function startGame() {
        menu.style.display = 'none';
        resetGame();
        interval = setInterval(moveSnake, intervalTime);
    }

    function resumeGame() {
        pauseMenu.style.display = 'none';
        isPaused = false;
        interval = setInterval(moveSnake, intervalTime);
    }

    function restartGame() {
        gameOverScreen.style.display = 'none';
        resetGame();
        interval = setInterval(moveSnake, intervalTime);
    }

    function resetGame() {
        direction = 1;
        snake = [2, 1, 0];
        score = 0;
        scoreElement.textContent = score;
        cells.forEach(cell => cell.classList.remove('snake', 'food'));
        snake.forEach(index => cells[index].classList.add('snake'));
        generateFood();
    }

    function moveSnake() {
        if (isPaused) return;

        const tail = snake.pop();
        cells[tail].classList.remove('snake');
        const head = snake[0] + direction;

        // Check for collisions
        if (
            (direction === 1 && head % cols === 0) || // Snake hits right wall
            (direction === -1 && head % cols === cols - 1) || // Snake hits left wall
            (direction === cols && head >= totalCells) || // Snake hits bottom
            (direction === -cols && head < 0) || // Snake hits top
            cells[head].classList.contains('snake') // Snake hits itself
        ) {
            return endGame(); // Game over
        }

        snake.unshift(head);

        // Check if snake has found food
        if (cells[head].classList.contains('food')) {
            cells[head].classList.remove('food');
            snake.push(tail);
            cells[tail].classList.add('snake');
            cells[head].classList.add('snake');
            generateFood();
            score++;
            scoreElement.textContent = score;
        } else {
            cells[head].classList.add('snake');
        }

        canChangeDirection = true; // Allow direction change after move
    }

    function generateFood() {
        do {
            foodIndex = Math.floor(Math.random() * totalCells);
        } while (cells[foodIndex].classList.contains('snake'));
        cells[foodIndex].classList.add('food');
    }

    function endGame() {
        clearInterval(interval);
        gameOverScreen.style.display = 'flex';
    }

    // Control the snake with arrow keys
    document.addEventListener('keydown', e => {
        if (e.key === ' ') {
            if (!isPaused) {
                clearInterval(interval);
                isPaused = true;
                pauseMenu.style.display = 'flex';
            } else {
                resumeGame();
            }
        }
        if (canChangeDirection && !isPaused) {
            if (e.key === 'ArrowRight' && direction !== -1) {
                direction = 1;
            } else if (e.key === 'ArrowUp' && direction !== cols) {
                direction = -cols;
            } else if (e.key === 'ArrowLeft' && direction !== 1) {
                direction = -1;
            } else if (e.key === 'ArrowDown' && direction !== -cols) {
                direction = cols;
            }
            canChangeDirection = false; // Prevent direction change until the next move
        }
    });
});
