document.addEventListener("DOMContentLoaded", () => {
    const pauseMenu = document.getElementById("pauseMenu");

    let isPaused = false;

    let startTime;
    let elapsedTime = 0;
    let timerInterval;

    function startTimer() {
        startTime = Date.now() - elapsedTime * 1000;
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById("timerDisplay").textContent = elapsedTime;
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }
    
    function pauseGame() {
        isPaused = true;
        pauseMenu.style.display = "block";
        // Stop the timer
        stopTimer();
        // Additional code to pause the game logic, e.g., stop animations, timers, etc.
    }

    function resumeGame() {
        isPaused = false;
        pauseMenu.style.display = "none";
        // Restart the timer
        startTimer();
        // Additional code to resume the game logic, e.g., restart animations, timers, etc.
        // gameLoop(); // Ensure the game loop continues running
    }

    // Track key states
    const keys = {
        ArrowLeft: false,
        ArrowRight: false,
        Space: false,
    };

    // Event listeners for keydown and keyup
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            keys.ArrowLeft = true;
        } else if (e.key === "ArrowRight") {
            keys.ArrowRight = true;
        } else if (e.key === " ") {
            keys.Space = true;
        } else if (e.key === "Enter" && gameOver) {
            // Restart the game when Enter is pressed after game over
            restartGame();
        } else if (e.key === "p" || e.key === "P") {
            if (isPaused) {
                resumeGame();
            } else {
                pauseGame();
            }
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.key === "ArrowLeft") {
            keys.ArrowLeft = false;
        } else if (e.key === "ArrowRight") {
            keys.ArrowRight = false;
        } else if (e.key === " ") {
            keys.Space = false;
        }
    });
})