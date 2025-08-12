const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 300;

let player = {
  x: 50,
  y: 250,
  width: 50,
  height: 50,
  dy: 0,
  gravity: 0.8,
  jumpPower: -12,
  grounded: true
};

let obstacles = [];
let score = 0;
let gameSpeed = 5;
let gameOver = false;

// Images
let playerImg = new Image();
playerImg.src = "https://i.ibb.co/2Kc8cYF/jungwon-chibi.png"; // Replace with Jungwon PNG

let cakeImg = new Image();
cakeImg.src = "https://i.ibb.co/ZJ7Wbfg/cake.png"; // Replace with cute cake PNG

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

canvas.addEventListener("click", jump);

document.getElementById("restartBtn").addEventListener("click", () => {
  resetGame();
});

function jump() {
  if (player.grounded && !gameOver) {
    player.dy = player.jumpPower;
    player.grounded = false;
  } else if (gameOver) {
    resetGame();
  }
}

function spawnObstacle() {
  let size = 40; // size of cake
  obstacles.push({
    x: canvas.width,
    y: canvas.height - size - 10,
    width: size,
    height: size
  });
}

function update() {
  if (gameOver) {
    ctx.fillStyle = "#ff4d88";
    ctx.font = "30px Comic Sans MS";
    ctx.fillText("🎉 Game Over! Press Restart 🎉", 180, 150);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player physics
  player.dy += player.gravity;
  player.y += player.dy;
  if (player.y + player.height >= canvas.height - 10) {
    player.y = canvas.height - player.height - 10;
    player.dy = 0;
    player.grounded = true;
  }

  // Draw player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= gameSpeed;
    ctx.drawImage(cakeImg, obs.x, obs.y, obs.width, obs.height);

    // Collision detection
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      gameOver = true;
    }
  }

  // Remove old obstacles
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  // Score
  score++;
  ctx.fillStyle = "#ff4d88";
  ctx.font = "20px Comic Sans MS";
  ctx.fillText("Score: " + score, 650, 30);

  requestAnimationFrame(update);
}

// Spawn obstacles at intervals
setInterval(() => {
  if (!gameOver) spawnObstacle();
}, 1500);

// Start game
update();

function resetGame() {
  player.y = 250;
  player.dy = 0;
  obstacles = [];
  score = 0;
  gameSpeed = 5;
  gameOver = false;
  update();
}
