"use strict";

const gameContainer = document.getElementById("gameContainer");
const pauseMenu = document.getElementById("pauseMenu");

// Game variables
let player;
let enemies;
let enemyRows = 3;
let enemyColumns = 8;
let enemyWidth = 50;
let enemyHeight = 70;
let enemySpeed = 1;
let enemyDirection = 1;
let bullets;
let enemyBullets;
let lastShotTime = 0;
const shotCooldown = 500;

// Track key states
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
};

function initializeGame() {
    while (gameContainer.firstChild) {
        gameContainer.removeChild(gameContainer.firstChild);
    }

    // Reset game variables
    player = {
        element: document.createElement("div"),
        x: 375,
        y: 540,
        width: 40,
        height: 40,
        speed: 5,
        alive: true,
    };
    player.element.id = "player";
    player.element.style.position = "absolute";
    player.element.style.width = `${player.width}px`;
    player.element.style.height = `${player.height}px`;
    player.element.style.left = `${player.x}px`;
    player.element.style.top = `${player.y}px`;
    gameContainer.appendChild(player.element);

    enemies = [];

    initializeEnemies();
}

function initializeEnemies() {
    for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyColumns; col++) {
            const enemy = document.createElement("div");
            enemy.className = "enemy";
            enemy.style.left = `${col * (enemyWidth + 10)}px`;
            enemy.style.top = `${row * (enemyHeight + 10)}px`;
            gameContainer.appendChild(enemy);
            enemies.push({
                element: enemy,
                x: col * (enemyWidth + 10),
                y: row * (enemyHeight + 10),
                width: enemyWidth,
                height: enemyHeight,
                alive: true,
            });
        }
    }
}



// function moveShooter(e) {
//     console.log('moveShooter')
//     switch (e.key) {
//         case "ArrowLeft":
//             if (player.x > 0) {
//                 player.x = Math.max(0, player.x - player.speed);
//             }
//             break
//         case "ArrowRight":
//             if (player.x + player.width < gameContainer.clientWidth) {
//                 player.x = Math.min(gameContainer.clientWidth - player.width, player.x + player.speed);
//             }
//             break
//     }
//     player.element.style.left = `${player.x}px`;
// }

function gameLoop() {
    updateEnemies();
    // movePlayer();
    // playerShoot();
    // updateBullets();
    // updateBulletColors();
    // document.addEventListener("keydown", moveShooter);
    requestAnimationFrame(gameLoop);
}

// Update enemies
function updateEnemies() {
    let edgeReached = false;
    enemies.forEach((enemy) => {
        if (enemy.alive) {
            enemy.x += enemySpeed * enemyDirection;
            enemy.element.style.left = `${enemy.x}px`;

            // Check if enemies reach the edge
            if (enemy.x + enemy.width > 800 || enemy.x < 0) {
                edgeReached = true;
            }

            // Check if enemy reaches the player's level
            if (enemy.y + enemy.height >= player.y) {
                gameOver = true;
            }
        }
    });

    if (edgeReached) {
        enemyDirection += -1;
        enemies.forEach((enemy) => {
            enemy.y += enemyHeight;
            enemy.element.style.top = `${enemy.y}px`;
        });
    }
}

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
}

function resumeGame() {
    isPaused = false;
    pauseMenu.style.display = "none";
    // Restart the timer
    startTimer();
    gameLoop();
}


// Event listeners for keydown and keyup
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        keys.ArrowLeft = true;
    } else if (e.key === "ArrowRight") {
        keys.ArrowRight = true;
    } else if (e.key === " ") {
        keys.Space = true;
    }
    // } else if (e.key === "Enter" && gameOver) {
    //     // Restart the game when Enter is pressed after game over
    //     restartGame();
    // } else if (e.key === "p" || e.key === "P") {
    //     if (isPaused) {
    //         resumeGame();
    //     } else {
    //         pauseGame();
    //     }
    // }
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


initializeGame();
gameLoop();