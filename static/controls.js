document.addEventListener("DOMContentLoaded", () => {
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