document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const bird = document.getElementById('bird');
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score-display');
    const gameOverScreen = document.getElementById('game-over');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-btn');
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');

    // Game variables
    let birdLeft = 50;
    let birdTop = 250;
    let gravity = 0.9;
    let isGameOver = false;
    let score = 0;
    let gameSpeed = 2;
    let jumpForce = -15;
    let velocity = 0;
    let gameInterval;
    let obstacleInterval;

    // Start game
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    // Jump controls
    function jump() {
        if (isGameOver) return;
        velocity = jumpForce;
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            jump();
        }
    });

    gameBoard.addEventListener('click', jump);

    // Start game function
    function startGame() {
        // Reset game state
        isGameOver = false;
        score = 0;
        scoreDisplay.textContent = score;
        birdTop = 250;
        birdLeft = 50;
        velocity = 0;
        
        // Clear obstacles
        document.querySelectorAll('.obstacle').forEach(obs => obs.remove());
        
        // Hide screens
        gameOverScreen.style.display = 'none';
        startScreen.style.display = 'none';
        
        // Reset bird position
        bird.style.top = birdTop + 'px';
        bird.style.left = birdLeft + 'px';
        
        // Start game loop
        clearInterval(gameInterval);
        clearInterval(obstacleInterval);
        gameInterval = setInterval(updateGame, 20);
        obstacleInterval = setInterval(createObstacle, 2000);
    }

    // Update game state
    function updateGame() {
        if (isGameOver) return;
        
        // Apply gravity
        velocity += gravity;
        birdTop += velocity;
        bird.style.top = birdTop + 'px';
        
        // Check for collisions with top and bottom
        if (birdTop <= 0 || birdTop >= gameBoard.offsetHeight - bird.offsetHeight) {
            gameOver();
        }
        
        // Check for collisions with obstacles
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach(obstacle => {
            const obstacleLeft = parseInt(obstacle.style.left);
            const obstacleTop = parseInt(obstacle.style.top);
            const obstacleHeight = parseInt(obstacle.style.height);
            const obstacleWidth = parseInt(obstacle.style.width);
            
            // Check if bird is in the same horizontal range as obstacle
            if (
                birdLeft + bird.offsetWidth > obstacleLeft && 
                birdLeft < obstacleLeft + obstacleWidth
            ) {
                // Check if bird is in the gap
                if (
                    birdTop < obstacleTop + obstacleHeight || 
                    birdTop + bird.offsetHeight > obstacleTop + obstacleHeight + 150
                ) {
                    gameOver();
                }
            }
            
            // Score increment when passing an obstacle
            if (obstacleLeft + obstacleWidth === birdLeft) {
                score++;
                scoreDisplay.textContent = score;
                
                // Increase game speed every 5 points
                if (score % 5 === 0) {
                    gameSpeed += 0.5;
                }
            }
        });
    }

    // Create obstacles
    function createObstacle() {
        if (isGameOver) return;
        
        const obstacleTop = Math.random() * (gameBoard.offsetHeight - 250);
        const obstacleHeight = obstacleTop;
        const gapHeight = 150;
        
        // Top obstacle
        const topObstacle = document.createElement('div');
        topObstacle.className = 'obstacle';
        topObstacle.style.left = gameBoard.offsetWidth + 'px';
        topObstacle.style.top = '0px';
        topObstacle.style.height = obstacleHeight + 'px';
        topObstacle.style.width = '60px';
        gameBoard.appendChild(topObstacle);
        
        // Bottom obstacle
        const bottomObstacle = document.createElement('div');
        bottomObstacle.className = 'obstacle';
        bottomObstacle.style.left = gameBoard.offsetWidth + 'px';
        bottomObstacle.style.top = (obstacleHeight + gapHeight) + 'px';
        bottomObstacle.style.height = (gameBoard.offsetHeight - obstacleHeight - gapHeight) + 'px';
        bottomObstacle.style.width = '60px';
        gameBoard.appendChild(bottomObstacle);
        
        // Move obstacles
        let obstacleLeft = gameBoard.offsetWidth;
        const moveObstacle = setInterval(() => {
            if (isGameOver) {
                clearInterval(moveObstacle);
                return;
            }
            
            obstacleLeft -= gameSpeed;
            topObstacle.style.left = obstacleLeft + 'px';
            bottomObstacle.style.left = obstacleLeft + 'px';
            
            // Remove obstacles when they go off screen
            if (obstacleLeft < -60) {
                clearInterval(moveObstacle);
                topObstacle.remove();
                bottomObstacle.remove();
            }
        }, 20);
    }

    // Game over function
    function gameOver() {
        isGameOver = true;
        clearInterval(gameInterval);
        clearInterval(obstacleInterval);
        finalScoreDisplay.textContent = score;
        gameOverScreen.style.display = 'flex';
    }
});
