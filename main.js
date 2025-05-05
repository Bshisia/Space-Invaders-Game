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
const entriesPerPage = 5;

// Game variables
let player;
let playerName = "";
let score = 0;
let lives = 3;
let level = 1;
let enemies;
let currentPage = 1;
let enemyWidth = 40;
let enemyHeight = 40;
let enemySpeed = 1;
let enemyDirection = 1;
let bullets;
let enemyBullets;
let gameOver = false;
let lastShotTime = 0;
let lastEnemyShootTime = 0;
let enemyShootInterval = 1000;
const INITIAL_ENEMY_SPEED = 1;
const INITIAL_SHOOT_INTERVAL = 1000;
const INITIAL_PLAYER_SHOT_COOLDOWN = 500;

let shotCooldown = INITIAL_PLAYER_SHOT_COOLDOWN;
let restartListenerAttached = true;

// Story variable states
let storyPhase = 0;
const STORY_TRIGGERS = {
  INTRODUCTION: 0,
  MID_STORY: 6000,
  VICTORY: 2000,
  DEFEAT: -1,
}

document.getElementById("startGame").addEventListener("click", () => {
  document.getElementById("introScreen").style.display = "none";
  isPaused = false;
  
  resetTimer();
  startTimer();
  gameLoop();
});

document.querySelectorAll(".continueGame").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("midStoryScreen").style.display = "none";
    isPaused = false;

    startTimer();
    gameLoop();
  });
});

document.getElementById("victoryOkButton").addEventListener("click", () => {
  document.getElementById("victoryScreen").style.display = "none";
  displayScoreEntry();
});

document.getElementById("defeatOkButton").addEventListener("click", () => {
  document.getElementById("defeatScreen").style.display = "none";
  displayScoreEntry();
});

function displayScoreEntry() {
  const scoreboard = document.querySelector(".scoreboard");
  const submitSection = document.getElementById("submitSection");
  const scoreTableBody = document.getElementById("scoreTableBody");

  hideAllOverlays();

  // Reset UI
  scoreboard.style.display = "block";
  scoreTableBody.innerHTML = "";
  submitSection.style.display = "block";

  const nameInput = document.getElementById("scoreNameInput");
  const submitButton = document.getElementById("submitScoreButton");

  nameInput.value = "";
  nameInput.focus();

  submitButton.onclick = () => {
    submitScore(nameInput.value);
    submitSection.style.display = "none";
  };

  // Allow ENTER to submit too
  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      submitScore(nameInput.value);
      submitSection.style.display = "none";
    }
  });
}

// document.querySelectorAll(".restartStory").forEach(button => {
//   button.addEventListener("click", restartGame);
// });

function hideAllOverlays() {
  const overlays = [
    ".scoreboard",
    "#introScreen",
    "#midStoryScreen",
    "#victoryScreen",
    "#defeatScreen",
    "#gameOver",
    "#pauseMenu"
  ];

  overlays.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) el.style.display = "none";
  });
}

function showIntroduction() {
  isPaused = true;
  document.getElementById("introScreen").style.display = "block";
  stopTimer();
}

function showMidStory() {
  isPaused = true;
  pauseMenu.style.display = "none";
  document.getElementById("midStoryScreen").style.display = "block";
  stopTimer();
}

function showConclusion() {
  stopTimer();
  gameOverSound.play();
  hideAllOverlays();

  if (lives <= 0) {
      document.getElementById("defeatScreen").style.display = "block";
      // gameOverMessage.style.display = "none";
  } else if (level > 10) { // Victory after completing 10 levels
      document.getElementById("victoryScreen").style.display = "block";
      // gameOverMessage.style.display = "none";
  // } else {
  //     gameOverMessage.style.display = "block";
  }
  // gameOverSound.play();
}

function restartGame() {
  document.getElementById("introScreen").style.display = "none";
  document.getElementById("victoryScreen").style.display = "none";
  document.getElementById("defeatScreen").style.display = "none";
  document.getElementById("midStoryScreen").style.display = "none";
  
  storyPhase = 0;
  isPaused = true;
  resetTimer();
  startMenu.style.visibility = "visible";
  initializeGame();
  gameLoop();
}

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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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

  // Show Intro Screen
  showIntroduction()
}

// Initialize the game
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
  shotCooldown = INITIAL_PLAYER_SHOT_COOLDOWN;
  enemyShootInterval = INITIAL_SHOOT_INTERVAL;
  enemySpeed = INITIAL_ENEMY_SPEED;

  createTileGrid();
  initializeEnemies();
  updateSidebar();
  resetTimer();
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
    bullet.style.transform = `translate(${player.x + player.width / 2 - 2.5
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
  enemyBullet.style.backgroundColor = "yellow";
  enemyBullet.style.transform = `translate(${enemy.x + enemy.width / 2 - 2.5
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

        playerBullet.element.style.visibility = "hidden";
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
  if (level > 10) { // Victory after 10 levels
    gameOver = true;
    document.getElementById("victoryScreen").style.display = "block";
    return;
  }

  enemyMapIndex++;
  if (enemyMapIndex === enemyMaps.length) {
    enemyMapIndex = 0;
  }
  currentenemyMap = enemyMaps[enemyMapIndex];
  currentTileMap = tileMaps[enemyMapIndex];

  enemyShootInterval = Math.max(200, enemyShootInterval - 100);
  enemySpeed += 0.5;
  shotCooldown = Math.max(100, shotCooldown - 50);

  createTileGrid();
  initializeEnemies();
  updateSidebar();
}

function checkEnemyBulletCollisions() {
  enemyBullets.forEach((bullet, bulletIndex) => {
    if (hasCollided(bullet, player)) {
      player.alive = false;

      enemyBullets.splice(bulletIndex, 1);
      bullet.element.style.visibility = "hidden";
      hitSound.play();

      lives--;
      updateSidebar();

      if (lives === 0) {
        gameOver = true;
        player.element.style.visibility = "hidden";
        triggerExplosion(player.x, player.y);
      } else {
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

  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

function gameLoop(timestamp) {
  if (gameOver) {
    stopTimer();
    gameOverSound.play();
    showConclusion();
    return;
  }

  if (isPaused) {
    return;
  }

  // Story progression check
  if (score >= STORY_TRIGGERS.MID_STORY && storyPhase === 0) {
    showMidStory();
    storyPhase = 1;
    return; // Pause game loop until user continues
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
  const submitSection = document.getElementById('submitSection');

  if (!scoreboard || !nameInput || !submitButton || !submitSection) {
    console.error("Scoreboard elements not found!");
    return;
  }

  scoreboard.style.display = "block";
  submitSection.style.display = "block";

  submitButton.onclick = () => {
    submitScore(nameInput.value)
    submitSection.style.display = "none";
  };
}

function submitScore(playerName) {
  if (!playerName.trim()) {
    alert("Please enter a valid name!");
    return;
  }

  const currentPlayerScore = {
    name: playerName.trim(),
    score: score,
    time: elapsedTime
  };

  const submitSection = document.getElementById('submitSection');
  if (submitSection) {
    submitSection.style.display = 'none';
  }


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
      updateScoreboard(scores);
    })
    .catch((error) => console.error("Error:", error));
}

function updateScoreboard(scores) {
  const tableBody = document.getElementById("scoreTableBody");
  const paginationContainer = document.querySelector(".pagination");

  if (!tableBody || !paginationContainer) {
    console.error("Score table body or pagination container not found!");
    return;
  }

  scores.sort((a, b) => b.score - a.score);

  const totalPages = Math.ceil(scores.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedScores = scores.slice(startIndex, endIndex);

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

    if (entry.index === scores.length) {
      row.classList.add("current-player");
    }

    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(scoreCell);
    row.appendChild(timeCell);
    tableBody.appendChild(row);
  });

  paginationContainer.innerHTML = `
        <button id="prevPage" ${currentPage === 1 ? "disabled" : ""
    }>Previous</button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button id="nextPage" ${currentPage === totalPages ? "disabled" : ""
    }>Next</button>
    `;

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

  const scoreboard = document.querySelector(".scoreboard");
  if (scoreboard) {
    scoreboard.style.display = "block";
  }
  
  // Remove old listener to prevent duplication
  if (restartListenerAttached) {
    document.removeEventListener("keydown", handleRestartAfterScoreboard);
    restartListenerAttached = false;
  }

  document.addEventListener("keydown", handleRestartAfterScoreboard);
}

// Helper function to avoid duplicate listeners

function handleRestartAfterScoreboard(e) {
  if (e.key === "Enter") {
    // Hide all overlays before restarting
    hideAllOverlays()

    // Restart game
    restartGame();

    // Remove the listener to prevent multiple calls
    document.removeEventListener("keydown", handleRestartAfterScoreboard);
    restartListenerAttached = false;
  }
}
