"use strict";

const gameContainer = document.getElementById("gameContainer");

// Game variables
let player;
let enemies;
let enemyRows = 3;
let enemyColumns = 8;
let enemyWidth = 50;
let enemyHeight = 70;
let enemySpeed = 1;
let enemyDirection = 1;

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

function gameLoop() {
    updateEnemies();
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


initializeGame();
gameLoop();