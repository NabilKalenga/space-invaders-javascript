const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// =============================
// PLAYER
// =============================

const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 60,
  width: 40,
  height: 30,
  speed: 5
};

// =============================
// KEYBOARD CONTROLS
// =============================

const keys = {};

// =============================
// GAME ARRAYS
// =============================

const aliens = [];
const bullets = [];
const enemyBullets = [];

// =============================
// ALIENS
// =============================

const alienRows = 3;
const alienCols = 8;

let alienDirection = 1;
let alienSpeed = 0.5;

// =============================
// GAME STATE
// =============================

let score = 0;
let lives = 3;

let gameOver = false;
let gameWon = false;

// =============================
// MOBILE CONTROLS
// =============================

let movingLeft = false;
let movingRight = false;

// =============================
// CREATE ALIENS
// =============================

function createAliens() {

  aliens.length = 0;

  for (let row = 0; row < alienRows; row++) {

    for (let col = 0; col < alienCols; col++) {

      aliens.push({
        x: 80 + col * 60,
        y: 60 + row * 45,
        width: 30,
        height: 25
      });

    }

  }
}

createAliens();

// =============================
// KEYBOARD
// =============================

document.addEventListener("keydown", (event) => {

  keys[event.key] = true;

  // Prevent page scrolling
  if (
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight" ||
    event.code === "Space"
  ) {
    event.preventDefault();
  }

  // Shoot
  if (event.code === "Space" && !gameOver && !gameWon) {
    shoot();
  }

  // Restart
  if (
    event.key.toLowerCase() === "r" &&
    (gameOver || gameWon)
  ) {
    restartGame();
  }

});

document.addEventListener("keyup", (event) => {

  keys[event.key] = false;

});

// =============================
// SHOOT
// =============================

function shoot() {

  if (gameOver || gameWon) {
    return;
  }

  bullets.push({

    x: player.x + player.width / 2 - 2,

    y: player.y,

    width: 4,

    height: 12,

    speed: 7

  });

}

// =============================
// DRAW PLAYER BULLETS
// =============================

function drawBullets() {

  bullets.forEach((bullet) => {

    ctx.fillStyle = "#ffff00";

    ctx.fillRect(
      bullet.x,
      bullet.y,
      bullet.width,
      bullet.height
    );

  });

}

// =============================
// UPDATE PLAYER BULLETS
// =============================

function updateBullets() {

  bullets.forEach((bullet) => {

    bullet.y -= bullet.speed;

  });

  for (let i = bullets.length - 1; i >= 0; i--) {

    if (bullets[i].y < 0) {

      bullets.splice(i, 1);

    }

  }

}

// =============================
// MOVE ALIENS
// =============================

function updateAliens() {

  if (gameOver || gameWon) {
    return;
  }

  let hitEdge = false;

  aliens.forEach((alien) => {

    alien.x += alienSpeed * alienDirection;

    if (
      alien.x <= 0 ||
      alien.x + alien.width >= canvas.width
    ) {

      hitEdge = true;

    }

  });

  // Change direction and move down

  if (hitEdge) {

    alienDirection *= -1;

    aliens.forEach((alien) => {

      alien.y += 15;

    });

  }

  // Aliens reach player

  aliens.forEach((alien) => {

    if (alien.y + alien.height >= player.y) {

      lives = 0;

      gameOver = true;

    }

  });

}

// =============================
// BULLET COLLISIONS
// =============================

function checkCollisions() {

  for (let i = bullets.length - 1; i >= 0; i--) {

    for (let j = aliens.length - 1; j >= 0; j--) {

      const bullet = bullets[i];
      const alien = aliens[j];

      if (
        bullet.x < alien.x + alien.width &&
        bullet.x + bullet.width > alien.x &&
        bullet.y < alien.y + alien.height &&
        bullet.y + bullet.height > alien.y
      ) {

        // Remove alien
        aliens.splice(j, 1);

        // Remove bullet
        bullets.splice(i, 1);

        // Add score
        score += 10;

        // Check win
        if (aliens.length === 0) {

          gameWon = true;

        }

        break;

      }

    }

  }

}

// =============================
// ALIEN SHOOTING
// =============================

function alienShoot() {

  if (
    gameOver ||
    gameWon ||
    aliens.length === 0
  ) {
    return;
  }

  const alien =
    aliens[Math.floor(Math.random() * aliens.length)];

  enemyBullets.push({

    x: alien.x + alien.width / 2 - 2,

    y: alien.y + alien.height,

    width: 4,

    height: 12,

    speed: 4

  });

}

// Aliens shoot every second

setInterval(() => {

  if (!gameOver && !gameWon) {

    alienShoot();

  }

}, 1000);

// =============================
// DRAW ALIEN BULLETS
// =============================

function drawEnemyBullets() {

  enemyBullets.forEach((bullet) => {

    ctx.fillStyle = "#ff3333";

    ctx.fillRect(
      bullet.x,
      bullet.y,
      bullet.width,
      bullet.height
    );

  });

}

// =============================
// UPDATE ALIEN BULLETS
// =============================

function updateEnemyBullets() {

  enemyBullets.forEach((bullet) => {

    bullet.y += bullet.speed;

  });

  for (
    let i = enemyBullets.length - 1;
    i >= 0;
    i--
  ) {

    if (enemyBullets[i].y > canvas.height) {

      enemyBullets.splice(i, 1);

    }

  }

}

// =============================
// PLAYER HIT
// =============================

function checkPlayerHit() {

  if (gameOver || gameWon) {
    return;
  }

  for (
    let i = enemyBullets.length - 1;
    i >= 0;
    i--
  ) {

    const bullet = enemyBullets[i];

    if (
      bullet.x < player.x + player.width &&
      bullet.x + bullet.width > player.x &&
      bullet.y < player.y + player.height &&
      bullet.y + bullet.height > player.y
    ) {

      // Remove enemy bullet
      enemyBullets.splice(i, 1);

      // Lose life
      lives--;

      // Game over
      if (lives <= 0) {

        lives = 0;

        gameOver = true;

      }

    }

  }

}

// =============================
// DRAW ALIENS
// =============================

function drawAliens() {

  aliens.forEach((alien) => {

    ctx.fillStyle = "#ff3366";

    ctx.fillRect(
      alien.x,
      alien.y,
      alien.width,
      alien.height
    );

    // Eyes

    ctx.fillStyle = "white";

    ctx.fillRect(
      alien.x + 6,
      alien.y + 6,
      5,
      5
    );

    ctx.fillRect(
      alien.x + 19,
      alien.y + 6,
      5,
      5
    );

  });

}

// =============================
// DRAW PLAYER
// =============================

function drawPlayer() {

  ctx.fillStyle = "#00ff88";

  ctx.beginPath();

  ctx.moveTo(
    player.x + player.width / 2,
    player.y
  );

  ctx.lineTo(
    player.x,
    player.y + player.height
  );

  ctx.lineTo(
    player.x + player.width,
    player.y + player.height
  );

  ctx.closePath();

  ctx.fill();

}

// =============================
// UPDATE PLAYER
// =============================

function updatePlayer() {

  if (gameOver || gameWon) {
    return;
  }

  // PC controls

  if (
    keys["ArrowLeft"] ||
    movingLeft
  ) {

    player.x -= player.speed;

  }

  if (
    keys["ArrowRight"] ||
    movingRight
  ) {

    player.x += player.speed;

  }

  // Keep player inside canvas

  if (player.x < 0) {

    player.x = 0;

  }

  if (player.x > canvas.width - player.width) {

    player.x = canvas.width - player.width;

  }

}

// =============================
// SCORE
// =============================

function drawScore() {

  ctx.fillStyle = "white";

  ctx.font = "20px Arial";

  ctx.fillText(
    "Score: " + score,
    20,
    30
  );

}

// =============================
// LIVES
// =============================

function drawLives() {

  ctx.fillStyle = "white";

  ctx.font = "20px Arial";

  ctx.fillText(
    "Lives: " + lives,
    canvas.width - 100,
    30
  );

}

// =============================
// GAME OVER
// =============================

function drawGameOver() {

  if (!gameOver) {
    return;
  }

  ctx.fillStyle = "red";

  ctx.font = "50px Arial";

  ctx.textAlign = "center";

  ctx.fillText(
    "GAME OVER",
    canvas.width / 2,
    canvas.height / 2
  );

  ctx.fillStyle = "white";

  ctx.font = "20px Arial";

  ctx.fillText(
    "Final Score: " + score,
    canvas.width / 2,
    canvas.height / 2 + 40
  );

  ctx.fillText(
    "Press R or tap RESTART",
    canvas.width / 2,
    canvas.height / 2 + 75
  );

  ctx.textAlign = "left";

}

// =============================
// WIN SCREEN
// =============================

function drawWinScreen() {

  if (!gameWon) {
    return;
  }

  ctx.fillStyle = "#00ff88";

  ctx.font = "50px Arial";

  ctx.textAlign = "center";

  ctx.fillText(
    "YOU WIN!",
    canvas.width / 2,
    canvas.height / 2
  );

  ctx.fillStyle = "white";

  ctx.font = "20px Arial";

  ctx.fillText(
    "Final Score: " + score,
    canvas.width / 2,
    canvas.height / 2 + 40
  );

  ctx.fillText(
    "Press R or tap RESTART",
    canvas.width / 2,
    canvas.height / 2 + 75
  );

  ctx.textAlign = "left";

}

// =============================
// RESTART
// =============================

function restartGame() {

  score = 0;

  lives = 3;

  gameOver = false;

  gameWon = false;

  player.x = canvas.width / 2 - 20;

  bullets.length = 0;

  enemyBullets.length = 0;

  alienDirection = 1;

  createAliens();

}

// =============================
// MOBILE BUTTONS
// =============================

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const shootBtn = document.getElementById("shootBtn");
const restartBtn = document.getElementById("restartBtn");

// =============================
// LEFT BUTTON
// =============================

leftBtn.addEventListener("pointerdown", (event) => {

  event.preventDefault();

  movingLeft = true;

});

leftBtn.addEventListener("pointerup", () => {

  movingLeft = false;

});

leftBtn.addEventListener("pointerleave", () => {

  movingLeft = false;

});

leftBtn.addEventListener("pointercancel", () => {

  movingLeft = false;

});

// =============================
// RIGHT BUTTON
// =============================

rightBtn.addEventListener("pointerdown", (event) => {

  event.preventDefault();

  movingRight = true;

});

rightBtn.addEventListener("pointerup", () => {

  movingRight = false;

});

rightBtn.addEventListener("pointerleave", () => {

  movingRight = false;

});

rightBtn.addEventListener("pointercancel", () => {

  movingRight = false;

});

// =============================
// SHOOT BUTTON
// =============================

shootBtn.addEventListener("pointerdown", (event) => {

  event.preventDefault();

  shoot();

});

// =============================
// RESTART BUTTON
// =============================

restartBtn.addEventListener("click", () => {

  restartGame();

});

// =============================
// GAME LOOP
// =============================

function gameLoop() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  updatePlayer();

  updateBullets();

  updateAliens();

  updateEnemyBullets();

  checkCollisions();

  checkPlayerHit();

  drawScore();

  drawLives();

  drawAliens();

  drawPlayer();

  drawBullets();

  drawEnemyBullets();

  drawGameOver();

  drawWinScreen();

  requestAnimationFrame(gameLoop);

}

gameLoop();
