"use strict";

const gameContainer = document.getElementById("gameContainer");

// Game variables
let player;
let enemies;
let enemyRows = 3;
let enemyColumns = 8;
let enemyWidth = 50;
let enemyHeight = 70;

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
    for (let row = 0; row < enemyRows; rows++) {
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

initializeGame();