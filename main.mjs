"use strict";

const gameContainer = document.getElementById("gameContainer");
const pauseMenu = document.getElementById("pauseMenu");
const levelDisplay = document.getElementById("levelDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const livesDisplay = document.getElementById("livesDisplay");
const continueButton = document.getElementById("continueButton");
const restartButton = document.getElementById("restartButton");
const gameOverMessage = document.getElementById("gameOver");

continueButton.addEventListener("click", resumeGame);
restartButton.addEventListener("click", restartGame);

// Game variables
let player;
let score = 0; // Track the player's score
let lives = 3; // Track the player's lives
let level = 1; // Track the current level
let enemies;
let enemyWidth = 40;
let enemyHeight = 40;
let enemySpeed = 1; // Initial enemy speed
let enemyDirection = 1;
let bullets;
let enemyBullets;
let gameOver = false;
let lastShotTime = 0;
let lastEnemyShootTime = 0;
let enemyShootInterval = 1000; // Initial firing interval
const initialShotCooldown = 500;
let shotCooldown = initialShotCooldown

// Track key states
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
};


// Tileset definition
const tileset = {
    1: { name: "player", source: "/images/player.png" },
    3: { name: "enemy", source: "/images/enemy.png" },
}
const enemyMap1 = {
    rows: 3,
    col: 8,
    tiles: [
        [3, 3, 3, 3, 3, 3, 3, 3, 3,],
        [3, 3, 3, 3, 3, 3, 3, 3, 3,],
        [3, 3, 3, 3, 3, 3, 3, 3, 3,],
    ],
};
const enemyMap2 = {
    rows: 4,
    col: 10,
    tiles: [
        [0, 3, 3, 3, 3, 3, 3, 3, 3, 0,],
        [3, 0, 3, 3, 3, 3, 3, 3, 0, 3,],
        [3, 0, 0, 3, 3, 3, 3, 0, 0, 3,],
        [0, 0, 0, 0, 3, 3, 0, 0, 0, 0,],
    ],
};
const enemyMap3 = {
    rows: 4,
    col: 10,
    tiles: [
        [3, 0, 3, 3, 3, 3, 3, 3, 0, 3,],
        [0, 3, 3, 3, 3, 3, 3, 3, 3, 0,],
        [0, 0, 0, 0, 3, 3, 0, 0, 0, 0,],
        [3, 0, 0, 3, 3, 3, 3, 0, 0, 3,],
    ],
};

const tileMap1 = {
    rows: 15,
    col: 20,
    tiles: [
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
]};

function createTileGrid() {
    // tileGrid.innerHTML = '';
    for (let y = 0; y < tileMap1.rows; y++) {
        for (let x = 0; x < tileMap1.col; x++) {
            const tile = document.createElement("div");
            const tileType = tileMap1.tiles[y][x]
            tile.style.width = '40px';
            tile.style.height = '40px';
            tile.style.position = 'absolute';
            tile.style.left = `${x*40}px`;
            tile.style.top = `${y *40}px`;
            if (tileType === 2) {
                tile.classList.add('asteroid');
            };
            gameContainer.appendChild(tile);
        }
    }
}



// Define the three enemyMaps
const enemyMaps = [
    enemyMap1,
    enemyMap2,
    enemyMap3,
];
let enemyMapIndex = 0
let currentenemyMap = enemyMaps[enemyMapIndex]


// Initialize the game
function initializeGame() {
    // Clear the game container
    while (gameContainer.firstChild) {
        gameContainer.removeChild(gameContainer.firstChild);
    }

    // Reset game variables
    player = {
        element: document.createElement("div"),
        x: 375, // Initial X position (centered)
        y: 540, // Initial Y position (near the bottom)
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

    bullets = [];
    enemyBullets = [];
    enemies = [];
    gameOver = false;
    level = 1;
    score = 0;
    lives = 3;
    shotCooldown = initialShotCooldown;
    enemySpeed = 1; // Reset enemy speed to initial value   

    createTileGrid();

    // Initialize enemies
    initializeEnemies();

    // Update the sidebar
    updateSidebar();

    // Start the timer
    resetTimer();
    startTimer();
}

// Initialize enemies
function initializeEnemies() {
    for (let row = 0; row < currentenemyMap.rows; row++) {
        for (let col = 0; col < currentenemyMap.col; col++) {
            if (currentenemyMap.tiles[row][col] === 3) {
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
}

// Move player
function movePlayer() {
    if (keys.ArrowLeft && player.x > 0) {
        player.x = Math.max(0, player.x - player.speed);
    }
    if (keys.ArrowRight && player.x + player.width < gameContainer.clientWidth) {
        player.x = Math.min(gameContainer.clientWidth - player.width, player.x + player.speed);
    }
    player.element.style.left = `${player.x}px`;
}

// Shoot player bullet
function playerShoot() {
    const currentTime = Date.now();
    if (keys.Space && currentTime - lastShotTime >= shotCooldown) {
        const bullet = document.createElement("div");
        bullet.className = "bullet";
        bullet.style.left = `${player.x + player.width / 2 - 2.5}px`;
        bullet.style.top = `${player.y - 10}px`;
        gameContainer.appendChild(bullet);

        bullets.push({
            element: bullet,
            x: player.x + player.width / 2 - 2.5,
            y: player.y - 10,
            width: 5,
            height: 10,
            speed: 10,
        });
        lastShotTime = currentTime;
        shootSound.play();
    }
}

// Update player bullets
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        bullet.element.style.top = `${bullet.y}px`;

        // Remove bullet if it goes off-screen
        if (bullet.y + bullet.height < 0) {
            bullet.element.remove();
            bullets.splice(index, 1);
        }
    });
}

// Update bullet colors
function updateBulletColors() {
    bullets.forEach((bullet) => {
        bullet.element.style.backgroundColor = "red"; // Player bullet color
    });

    enemyBullets.forEach((bullet) => {
        bullet.element.style.backgroundColor = "yellow"; // Enemy bullet color
    });
}

// Shoot enemy bullets
function shootEnemyBullet(enemy) {
    const enemyBullet = document.createElement("div");
    enemyBullet.className = "bullet";
    enemyBullet.style.left = `${enemy.x + enemy.width / 2 - 2.5}px`;
    enemyBullet.style.top = `${enemy.y + enemy.height}px`;
    gameContainer.appendChild(enemyBullet);
    enemyBullets.push({
        element: enemyBullet,
        x: enemy.x + enemy.width / 2 - 2.5,
        y: enemy.y + enemy.height,
        width: 5,
        height: 10,
        speed: 5,
    });
}


// Enemy bullets
function updateEnemyBullets() {
    enemyBullets.forEach((enemyBullet, index) => {
        enemyBullet.y += enemyBullet.speed
        enemyBullet.element.style.top = `${enemyBullet.y}px`;

        // Remove bullet if it goes off-screen
        if (enemyBullet.y > 600) {
            enemyBullet.element.remove();
            enemyBullets.splice(index, 1);
        }
    })
}

function triggerExplosion(x, y) {
    const existingExplosion = document.querySelector(".explosion");
    if (existingExplosion) {
        existingExplosion.remove();
    }
    const explosion = document.createElement("div");
    explosion.className = "explosion";
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    gameContainer.appendChild(explosion);
    setTimeout(() => explosion.remove(), 500);
    explosionSound.play()
}

// Update the sidebar
function updateSidebar() {
    levelDisplay.textContent = level;
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
}

// Restart the game
function restartGame() {
    isPaused = false;
    pauseMenu.style.display = "none";
    gameOverMessage.style.display = "none";

    while (gameContainer.firstChild) {
        gameContainer.removeChild(gameContainer.firstChild);
    }

    player = null;
    bullets = [];
    enemyBullets = [];
    gameOver = false;
    level = 1;
    score = 0;
    lives = 3;

    levelDisplay.textContent = level;
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;

    initializeGame();
    gameLoop();
}

// checks whether two objects are colliding
function hasCollided(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

// Check collisions between plyaer bullets and enemy bullets
function checkBulletCollisions() {
    bullets.forEach((playerBullet, playerBulletIndex) => {
        enemyBullets.forEach((enemyBullet, enemyBulletIndex) => {
            if (
                hasCollided(playerBullet, enemyBullet)
            ) {
                triggerExplosion(
                    (playerBullet.x + enemyBullet.x) / 2,
                    (playerBullet.y + enemyBullet.y) / 2
                );

                playerBullet.element.remove();
                enemyBullet.element.remove();
                bullets.splice(playerBulletIndex, 1);
                enemyBullets.splice(enemyBulletIndex, 1);
            }
        });
    });
}

function checkPlayerBulletCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                enemy.alive && hasCollided(bullet, enemy)
            ) {
                triggerExplosion(enemy.x, enemy.y);
                enemy.alive = false;
                enemy.element.remove();
                bullets.splice(bulletIndex, 1);
                bullet.element.remove();

                score += 50;
                updateSidebar();

                if (enemies.every((enemy) => !enemy.alive)) {
                    levelUp();
                }
            }
        });
    })
}

// Level up
function levelUp() {
    level++;
    enemyMapIndex++;
    if (enemyMapIndex === enemyMaps.length) {
        enemyMapIndex = 0;
    }
    currentenemyMap = enemyMaps[enemyMapIndex];
    enemyShootInterval = Math.max(200, enemyShootInterval - 100);
    enemySpeed += 0.5; // Increase enemy speed
    shotCooldown = Math.max(100, shotCooldown - 50); // Reduce player shooting cooldown

    initializeEnemies();
    updateSidebar();
}

function checkEnemyBulletCollisions() {
    enemyBullets.forEach((bullet, bulletIndex) => {
        if (
            hasCollided(bullet, player)
        ) {
            // Player hit!
            player.alive = false;

            // Remove the player's image
            player.element.remove();

            // Remove the enemy bullet
            enemyBullets.splice(bulletIndex, 1);
            bullet.element.remove();
            hitSound.play();

            // Decrease lives
            lives--;
            updateSidebar();

            // End game if no lives left
            if (lives === 0) {
                gameOver = true;
                triggerExplosion(player.x, player.y)
            } else {
                // Reset player position if lives remain
                player.alive = true;
                player.element = document.createElement("div");
                player.element.id = "player"
                player.element.className = "player";
                player.element.style.left = `${player.x}px`;
                player.element.style.top = `${player.y}px`;
                player.element.style.backgroundImage = "url('images/player.png')";
                gameContainer.appendChild(player.element);
                hitSound.play();
            }
        }
    });
}

function gameLoop() {
    if (gameOver) {
        gameOverMessage.style.display = "block";
        stopTimer();
        gameOverSound.play();
        return;
    }

    if (isPaused) {
        return;
    }

    movePlayer();
    playerShoot();
    updateBullets();
    updateEnemyBullets();
    updateEnemies();
    updateBulletColors();

    checkPlayerBulletCollisions();
    checkEnemyBulletCollisions();
    checkBulletCollisions();

    const now = Date.now();
    if (now - lastEnemyShootTime > enemyShootInterval) {
        const aliveEnemies = enemies.filter((enemy) => enemy.alive);
        if (aliveEnemies.length > 0) {
            const randomEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
            shootEnemyBullet(randomEnemy);
            lastEnemyShootTime = now;
        }

    }
    requestAnimationFrame(gameLoop);
}

// Update enemies
function updateEnemies() {
    let edgeReached = false;
    enemies.forEach((enemy) => {
        if (enemy.alive) {
            enemy.x += enemySpeed * enemyDirection;
            enemy.element.style.left = `${enemy.x}px`;

            if (enemy.x + enemy.width > 800 || enemy.x < 0) {
                edgeReached = true;
            }

            if (enemy.y + enemy.height >= player.y) {
                gameOver = true;
            }
        }
    });

    if (edgeReached) {
        enemyDirection *= -1;
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

function resetTimer() {
    elapsedTime = 0;
    document.getElementById("timerDisplay").textContent = 0;
}

function pauseGame() {
    isPaused = true;
    pauseMenu.style.display = "block";
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
    } else if (e.key === "Enter" && gameOver) {
        // Restart the game when Enter is pressed after game over
        restartGame();
    } else if (e.key === "p" || e.key === "P") {
        if (isPaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    } else if ((e.key === "r" || e.key === "R") && isPaused) {
        restartGame();
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

// Start the game
initializeGame();
gameLoop();