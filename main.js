"use strict";

const gameContainer = document.getElementById("gameContainer");
const pauseMenu = document.getElementById("pauseMenu");
const levelDisplay = document.getElementById("levelDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const livesDisplay = document.getElementById("livesDisplay");
const continueButton = document.getElementById("continueButton");
const restartButton = document.getElementById("restartButton");
const gameOverMessage = document.getElementById("gameOver");
const startMenu = document.querySelector(".start-menu");

// Game variables
let player;
let playerName = "";
let score = 0; // Track the player's score
let lives = 3; // Track the player's lives
let level = 1; // Track the current level
let enemies;
let currentPage = 1;
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
let shotCooldown = initialShotCooldown;

// Track key states
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  Space: false,
};

const enemyMap1 = {
  rows: 3,
  col: 8,
  tiles: [
    [3, 3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3, 3],
  ],
};
const enemyMap2 = {
  rows: 4,
  col: 10,
  tiles: [
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 0],
    [3, 0, 3, 3, 3, 3, 3, 3, 0, 3],
    [3, 0, 0, 3, 3, 3, 3, 0, 0, 3],
    [0, 0, 0, 0, 3, 3, 0, 0, 0, 0],
  ],
};
const enemyMap3 = {
  rows: 4,
  col: 10,
  tiles: [
    [3, 0, 3, 3, 3, 3, 3, 3, 0, 3],
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 0],
    [0, 0, 0, 0, 3, 3, 0, 0, 0, 0],
    [3, 0, 0, 3, 3, 3, 3, 0, 0, 3],
  ],
};

const tileMap1 = {
  rows: 15,
  col: 20,
  tiles: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};
const tileMap2 = {
  rows: 15,
  col: 20,
  tiles: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

const tileMap3 = {
  rows: 15,
  col: 20,
  tiles: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

// Define the three enemyMaps
const enemyMaps = [enemyMap1, enemyMap2, enemyMap3];

const tileMaps = [tileMap1, tileMap2, tileMap3];

const bg = {
  1: "url(/images/bg-1.jpg)",
  2: "url(/images/bg-2.jpeg)",
  3: "url(/images/bg-3.jpg)",
};

const gameObjects = {
  1: ["explosion", "greenAlien", "asteroid2", "rocket1"],
  2: ["explosion", "jet1", "asteroid1", "jet2"],
  3: ["explosion", "ufo", "asteroid3", "rocket2"],
};

// Initialize the current enemy map and index
let enemyMapIndex = 0;
let currentenemyMap = enemyMaps[enemyMapIndex];
let currentTileMap = tileMaps[enemyMapIndex];
let currentGameObjects = gameObjects[1];

continueButton.addEventListener("click", resumeGame);
restartButton.addEventListener("click", () => {
  pauseMenu.style.display = "none";
  startMenu.style.visibility = "visible";
  isPaused = false;
});

function startGame(mapNumber) {
  enemyMapIndex = 0;
  currentenemyMap = enemyMaps[enemyMapIndex];
  currentTileMap = tileMaps[enemyMapIndex];
  currentGameObjects = gameObjects[mapNumber];

  gameContainer.style.backgroundImage = bg[mapNumber];
  gameContainer.style.backgroundSize = "cover";

  const scoreboard = document.querySelector(".scoreboard");
  scoreboard.style.display = "none";
  // Start the game
  initializeGame();
  startMenu.style.visibility = "hidden";
  gameLoop();
}

// Initialize the game
function initializeGame() {
  // Clear the game container
  while (gameContainer.firstChild) {
    gameObjects;
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
  player.element.className = "sprite " + currentGameObjects[3];
  player.element.style.transform = `translate(${player.x}px, ${player.y}px)`;
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

function createTileGrid() {
  for (let y = 0; y < currentTileMap.rows; y++) {
    for (let x = 0; x < currentTileMap.col; x++) {
      if (currentTileMap.tiles[y][x] === 2) {
        const tile = document.createElement("div");
        tile.className = "sprite " + currentGameObjects[2];
        tile.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
        gameContainer.appendChild(tile);
      }
    }
  }
}

// Initialize enemies
function initializeEnemies() {
  for (let row = 0; row < currentenemyMap.rows; row++) {
    for (let col = 0; col < currentenemyMap.col; col++) {
      if (currentenemyMap.tiles[row][col] === 3) {
        const enemy = document.createElement("div");
        enemy.className = "sprite " + currentGameObjects[1];
        enemy.style.transform = `translate(${col * (enemyWidth + 10)}px, ${
          row * (enemyHeight + 10)
        }px)`;

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
  if (keys.ArrowRight && player.x + player.width < 800) {
    player.x = Math.min(800 - player.width, player.x + player.speed);
  }
  player.element.style.transform = `translate(${player.x}px, ${player.y}px)`;
}

// Shoot player bullet
function playerShoot(timestamp) {
  const currentTime = timestamp;
  if (keys.Space && currentTime - lastShotTime >= shotCooldown) {
    const bullet = document.createElement("div");
    bullet.className = "bullet";
    bullet.style.backgroundColor = "red"; // Player bullet color
    bullet.style.transform = `translate(${
      player.x + player.width / 2 - 2.5
    }px, ${player.y - 10}px)`;
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
    bullet.element.style.transform = `translate(${bullet.x}px, ${bullet.y}px)`;

    // Remove bullet if it goes off-screen
    if (bullet.y + bullet.height < 0) {
      bullet.element.style.visibility = "hidden";
      bullets.splice(index, 1);
    }
  });
}

// Shoot enemy bullets
function shootEnemyBullet(enemy) {
  const enemyBullet = document.createElement("div");
  enemyBullet.className = "bullet";
  enemyBullet.style.backgroundColor = "yellow"; // Player bullet color
  enemyBullet.style.transform = `translate(${
    enemy.x + enemy.width / 2 - 2.5
  }px, ${enemy.y + enemy.height}px)`;
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
    enemyBullet.y += enemyBullet.speed;
    enemyBullet.element.style.transform = `translate(${enemyBullet.x}px, ${enemyBullet.y}px)`;

    // Remove bullet if it goes off-screen
    if (enemyBullet.y > 600) {
      enemyBullet.element.style.visibility = "hidden";
      enemyBullets.splice(index, 1);
    }
  });
}

function triggerExplosion(x, y) {
  const existingExplosion = document.querySelector(".explosion");
  if (existingExplosion) {
    existingExplosion.remove();
  }
  const explosion = document.createElement("div");
  explosion.className = "sprite explosion";
  explosion.style.left = `${x}px`;
  explosion.style.top = `${y}px`;
  gameContainer.appendChild(explosion);
  setTimeout(() => explosion.remove(), 500);
  explosionSound.play();
}

// Update the sidebar
function updateSidebar() {
  levelDisplay.textContent = level;
  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
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
      if (hasCollided(playerBullet, enemyBullet)) {
        triggerExplosion(
          (playerBullet.x + enemyBullet.x) / 2,
          (playerBullet.y + enemyBullet.y) / 2
        );

        // playerBullet.element.remove();
        playerBullet.element.style.visibility = "hidden";
        // enemyBullet.element.remove();
        enemyBullet.element.style.visibility = "hidden";
        bullets.splice(playerBulletIndex, 1);
        enemyBullets.splice(enemyBulletIndex, 1);
      }
    });
  });
}

function checkPlayerBulletCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (enemy.alive && hasCollided(bullet, enemy)) {
        triggerExplosion(enemy.x, enemy.y);
        enemy.alive = false;
        enemy.element.style.visibility = "hidden";
        bullets.splice(bulletIndex, 1);
        bullet.element.style.visibility = "hidden";

        score += 50;
        updateSidebar();

        if (enemies.every((enemy) => !enemy.alive)) {
          levelUp();
        }
      }
    });
  });
}

// Level up
function levelUp() {
  level++;
  enemyMapIndex++;
  if (enemyMapIndex === enemyMaps.length) {
    enemyMapIndex = 0;
  }
  currentenemyMap = enemyMaps[enemyMapIndex];
  currentTileMap = tileMaps[enemyMapIndex];
  enemyShootInterval = Math.max(200, enemyShootInterval - 100);
  enemySpeed += 0.5; // Increase enemy speed
  shotCooldown = Math.max(100, shotCooldown - 50); // Reduce player shooting cooldown
  createTileGrid();
  initializeEnemies();
  updateSidebar();
}

function checkEnemyBulletCollisions() {
  enemyBullets.forEach((bullet, bulletIndex) => {
    if (hasCollided(bullet, player)) {
      // Player hit!
      player.alive = false;

      // Remove the enemy bullet
      enemyBullets.splice(bulletIndex, 1);
      bullet.element.style.visibility = "hidden";
      hitSound.play();

      // Decrease lives
      lives--;
      updateSidebar();

      // End game if no lives left
      if (lives === 0) {
        gameOver = true;
        player.element.style.visibility = "hidden";
        triggerExplosion(player.x, player.y);
      } else {
        // Reset player position if lives remain
        player.alive = true;
        hitSound.play();
      }
    }
  });
}

function yieldToMain() {
  if (globalThis.scheduler?.yield) {
    return scheduler.yield();
  }

  // Fall back to yielding with setTimeout.
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

function gameLoop(timestamp) {
  if (gameOver) {
    stopTimer();
    gameOverSound.play();
    displayScoreboard(); // Request player name before submitting score
    return;
  }

  if (isPaused) {
    return;
  }

  movePlayer();
  playerShoot(timestamp);
  yieldToMain();
  updateBullets();
  updateEnemyBullets();
  updateEnemies();

  checkPlayerBulletCollisions();
  checkEnemyBulletCollisions();
  checkBulletCollisions();

  const now = timestamp;
  if (now - lastEnemyShootTime > enemyShootInterval) {
    const aliveEnemies = enemies.filter((enemy) => enemy.alive);
    if (aliveEnemies.length > 0) {
      const randomEnemy =
        aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
      shootEnemyBullet(randomEnemy);
      lastEnemyShootTime = now;
    }
  }

  requestAnimationFrame(gameLoop);
}

// Move enemies left, right and downwards towards player
function updateEnemies() {
  let edgeReached = false;
  enemies.forEach((enemy) => {
    if (enemy.alive) {
      enemy.x += enemySpeed * enemyDirection;

      if (enemy.x + enemy.width > 800 || enemy.x < 0) {
        edgeReached = true;
      }

      if (enemy.y + enemy.height >= player.y) {
        gameOver = true;
      }
    }
  });

  // If an edge is reached, move all enemies down and change direction
  if (edgeReached) {
    enemyDirection *= -1;
    enemies.forEach((enemy) => {
      enemy.y += enemyHeight;
    });
  }

  // Update positions for all enemies
  enemies.forEach((enemy) => {
    if (enemy.alive) {
      enemy.element.style.transform = `translate(${enemy.x}px,${enemy.y}px)`;
    }
    console.log(enemy.element);
  });
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

  if (!gameOver) {
    startTimer();
  }
  gameLoop();
}

// Event listeners for keydown and keyup
document.addEventListener("keydown", (e) => {
  const playerNameInput = document.getElementById("playerName");

  if (document.activeElement === playerNameInput) {
    return;
  }

  if (e.key === "ArrowLeft") {
    keys.ArrowLeft = true;
  } else if (e.key === "ArrowRight") {
    keys.ArrowRight = true;
  } else if (e.key === " ") {
    keys.Space = true;
  } else if (e.key === "Enter" && gameOver) {
    // Restart the game when Enter is pressed after game over
    gameOverMessage.style.display = "none";
    startMenu.style.visibility = "visible";
  } else if (
    (e.key === "p" || e.key === "P") &&
    !gameOver &&
    startTime !== null
  ) {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  } else if ((e.key === "r" || e.key === "R") && isPaused) {
    pauseMenu.style.display = "none";
    startMenu.style.visibility = "visible";
    isPaused = false;
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

// Attach event listeners to map buttons
document
  .getElementById("map1Button")
  .addEventListener("click", () => startGame(1));
document
  .getElementById("map2Button")
  .addEventListener("click", () => startGame(2));
document
  .getElementById("map3Button")
  .addEventListener("click", () => startGame(3));

function displayScoreboard() {
  const scoreboard = document.querySelector(".scoreboard");
  const nameInput = document.getElementById("scoreNameInput");
  const submitButton = document.getElementById("submitScoreButton");

  if (!scoreboard || !nameInput || !submitButton) {
    console.error("Scoreboard elements not found!");
    return;
  }

  // Show the scoreboard and ask for player's name
  scoreboard.style.display = "block";

  // Ensure previous event listener is removed before adding a new one
  submitButton.onclick = () => submitScore(nameInput.value);
}

// Function to submit score and update scoreboard
function submitScore(playerName) {
  if (!playerName.trim()) {
    alert("Please enter a valid name!");
    return;
  }

  const currentPlayerScore = {
    name: playerName.trim(),
    score: score,
    time: elapsedTime,
  };

  fetch("/api/scores/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(currentPlayerScore),
  })
    .then((response) =>
      response.ok
        ? fetch("/api/scores")
        : Promise.reject("Failed to save score")
    )
    .then((response) => response.json())
    .then((scores) => {
      console.log("Fetched scores:", scores);
      updateScoreboard(scores);
    })
    .catch((error) => console.error("Error:", error));
}

// Function to update scoreboard using the existing table in index.html
const entriesPerPage = 5;

function updateScoreboard(scores) {
  const tableBody = document.getElementById("scoreTableBody");
  const paginationContainer = document.querySelector(".pagination");

  if (!tableBody || !paginationContainer) {
    console.error("Score table body or pagination container not found!");
    return;
  }

  // Sort scores in descending order
  scores.sort((a, b) => b.score - a.score);

  // Calculate pagination details
  const totalPages = Math.ceil(scores.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedScores = scores.slice(startIndex, endIndex);

  // Clear existing rows
  tableBody.innerHTML = "";

  paginatedScores.forEach((entry, index) => {
    const row = document.createElement("tr");

    const rankCell = document.createElement("td");
    rankCell.textContent = startIndex + index + 1;

    const nameCell = document.createElement("td");
    nameCell.textContent = entry.name;

    const scoreCell = document.createElement("td");
    scoreCell.textContent = entry.score;

    const timeCell = document.createElement("td");
    timeCell.textContent = entry.time;

    if (entry.name === document.getElementById("scoreNameInput").value.trim()) {
        row.classList.add("current-player");
    }

    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(scoreCell);
    row.appendChild(timeCell);
    tableBody.appendChild(row);
  });

  // Update pagination buttons
  paginationContainer.innerHTML = `
        <button id="prevPage" ${
          currentPage === 1 ? "disabled" : ""
        }>Previous</button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button id="nextPage" ${
          currentPage === totalPages ? "disabled" : ""
        }>Next</button>
    `;

  // Add event listeners for pagination buttons
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updateScoreboard(scores);
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateScoreboard(scores);
    }
  });

  // Make sure the scoreboard is visible
  const scoreboard = document.querySelector(".scoreboard");
  if (scoreboard) {
    scoreboard.style.display = "block";
  }

  // Disable the submit button to prevent multiple submissions
  const submitButton = document.getElementById("submitScoreButton");
  if (submitButton) {
    submitButton.disabled = true;
  }
}
