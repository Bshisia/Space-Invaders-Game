# Space Invaders History

This is a simple Space Invaders-style game implemented in JavaScript. Players control a spaceship to defend against waves of alien invaders.

## Features

* **Story Mode:** Progress through a compelling narrative as you play:

  * **Introduction:** Earth's last defense is under attack—begin your mission.
  * **Mid-Story Development:** Triggered at 6000 points—alien reinforcements arrive.
  * **Victory:** Triggered at 20000 points—repel the invasion and save Earth.
  * **Defeat:** Shown when lives run out or aliens reach Earth—humanity falls.
* **Different Maps:** Choose from multiple unique level designs.
* **Player-Controlled Spaceship:** Navigate and defend against the invaders.
* **Multiple Levels with Increasing Difficulty:** Face progressively harder challenges.
* **Score Tracking:** Earn points for destroying aliens.
* **Lives System:** Manage your lives carefully.
* **Pause and Resume Functionality:** Take breaks or strategize.
* **Game Over Screen:** The game ends when you lose all lives or the aliens reach your position.
* **Timer:** Track your gameplay duration.
* **Scoreboard:** Compete for the highest scores!

  * **Name Submission:** Enter your name to save your score.
  * **Persistent Scoreboard:** Scores are saved and displayed, even after restarting.
  * **Pagination:** Browse through multiple pages of high scores.
  * **Current Player Highlighting:** When the current player submits a score, their score is highlighted in the scoreboard.

## How to Play

1. **Select a Map:** Choose a level from the start menu.
2. **Move:** Use the left and right arrow keys to control your spaceship's movement.
3. **Shoot:** Press the spacebar to fire at the alien invaders.
4. **Survive:** Avoid enemy bullets and prevent the aliens from reaching the bottom of the screen.
5. **Destroy All Aliens:** Clear the level to advance to the next one.
6. **Experience the Story:** Story scenes will appear during specific milestones in the game.
7. **Submit Your Score:** After game over, enter your name to save your score to the leaderboard.

## Controls

* **Left Arrow:** Move left
* **Right Arrow:** Move right
* **Spacebar:** Shoot
* **P:** Pause/Resume game
* **R:** Restart game (when paused)
* **Enter:** Restart game (after game over)

## Game Mechanics

* **Map Selection:** Start the game by selecting one of the available maps.
* **Lives:** Player starts with 3 lives.
* **Scoring:** Each alien destroyed awards 50 points.
* **Difficulty:** Enemy speed and shooting frequency increase with each level.
* **Cooldown:** Player’s shooting cooldown decreases with each level.
* **Story Triggers:**

  * **Introduction:** Before starting
  * **Mid-Story:** When score reaches 6000
  * **Victory:** When score reaches 20000
  * **Defeat:** When lives hit 0 or aliens win
* **Scoreboard Ranking:** Leaderboard shows name, score, and time—sorted by highest score.
* **Score Saving:** Scores persist across sessions via browser storage.
* **Scoreboard Pagination:** Navigate through pages of submitted scores.
* **Current Player Highlighting:** Your score is highlighted after submission.

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/space-invaders.git
   ```
2. Open the `index.html` file in a web browser to start the game.

## Dependencies

This game uses **vanilla JavaScript** and doesn’t require any external libraries or frameworks.

## File Structure

* `index.html`: The main HTML file
* `main.mjs`: The JavaScript file containing the game logic
* `styles.css`: The CSS file for styling the game
* `images/`: Directory containing game images (player, enemies, etc.)

## Future Improvements

* Add power-ups and special weapons
* Improve graphics and animations
* Add sound effects and music
* Online scoreboard with server-side storage

## Contributing

Feel free to fork this project and submit pull requests with improvements or new features.

## Authors

* [Brian Shisia](https://github.com/Bshisia)
* [John Paul Nyunja](https://github.com/nyunja)
* [Kennedy Ada](https://github.com/adaken4)

## License

This project is open source and available under the [MIT License](LICENSE).