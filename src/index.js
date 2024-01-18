import "./style.css";
import Block from "./Block";

const grid = document.getElementById("grid");
const blockGrid = document.getElementById("blockGrid");
// gameboard dimensions
const gameboardWidth = 800;
const gameboardHeight = 600;
// element dimensions
const blockWidth = 100;
const blockHeight = 20;
const playerWidth = 100;
const playerHeight = 10;
const ballSize = 10;
// element starting coords
const blockX = 20;
const blockY = 560;
const playerY = 30;
const playerX = gameboardWidth / 2 - playerWidth / 2;
const ballY = 40;
const ballX = gameboardWidth / 2 - ballSize / 2;
// variables used for gameboard drawing
const ballCurrentPos = [ballX, ballY];
const playerCurrentPos = [playerX, playerY];
const ballSpeed = 5;
const playerMoveSpeed = 15;
const blockGap = 10;
const rowGap = 10;
const adjustedWidth = gameboardWidth - blockWidth;
let rowCheck = blockX * 2;
let currentX = blockX;
let currentY = blockY;
let gapCheck = 0;
let ballSpeedX = ballSpeed;
let ballSpeedY = ballSpeed;
let isGamePaused = false;
let gameOver = false;

// all blocks
const blocks = [
  [0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
];
// const blocks = [
//   [1, 1, 1, 1, 1, 1, 1],
//   [0, 1, 1, 1, 1, 1, 0],
//   [0, 0, 1, 1, 1, 0, 0],
//   [0, 0, 0, 1, 0, 0, 0],
// ];
const currentBlocks = [];
const populateBlocks = () => {
  blocks.forEach((row) => {
    row.forEach((item) => {
      if (item === 1) {
        const blocky = new Block(
          currentX,
          currentY,
          blockWidth,
          blockHeight,
          ballCurrentPos
        );
        currentBlocks.push(blocky);
      }
      currentX += blockWidth + blockGap;
      if (rowCheck > adjustedWidth - blockGap) {
        currentY -= blockHeight + rowGap;
        rowCheck = blockX;
        currentX = blockX;
        gapCheck = 0;
      }
      rowCheck += blockWidth + blockGap;
    });
  });
};
populateBlocks();
const drawBlock = (blocky) => {
  const block = document.createElement("div");
  block.classList.add("block");
  block.style.left = blocky.bottomLeft[0] + "px";
  block.style.bottom = blocky.bottomLeft[1] + "px";
  block.style.width = `${blockWidth}px`;
  block.style.height = `${blockHeight}px`;
  if (blocky.fragged === false) {
    blockGrid.appendChild(block);
  }
};
const changeYSpeed = () => {
  ballSpeedY = -ballSpeedY;
};
const changeXSpeed = () => {
  ballSpeedX = -ballSpeedX;
};
const drawLevel = () => {
  const newBlocks = currentBlocks.filter((block) => {
    if (block.fragged !== true) return block;
  });
  blockGrid.replaceChildren();
  newBlocks.forEach((block) => {
    block.collisionCheck(ballCurrentPos, changeYSpeed, changeXSpeed);
    drawBlock(block);
  });
  moveBall();
};
const readInput = (e) => {
  const paddle = document.querySelector(".player");
  // console.log(e.code);
  switch (e.code) {
    case "KeyA":
    case "ArrowLeft":
      if (playerCurrentPos[0] > 5) {
        playerCurrentPos[0] -= playerMoveSpeed;
        paddle.style.left = `${playerCurrentPos[0]}px`;
      }

      break;

    case "KeyD":
    case "ArrowRight":
      if (playerCurrentPos[0] < gameboardWidth - (playerWidth + 5)) {
        playerCurrentPos[0] += playerMoveSpeed;
        paddle.style.left = `${playerCurrentPos[0]}px`;
      }

      break;

    case "Escape":
      isGamePaused = !isGamePaused;
      console.log(isGamePaused);
      break;
  }
};
const handleInput = () => {
  if (isGamePaused || gameOver) return;

  document.addEventListener("keydown", readInput);
};

// add player
const addPlayer = () => {
  const player = document.createElement("div");
  player.classList.add("player");
  player.style.left = playerCurrentPos[0] + "px";
  player.style.bottom = playerCurrentPos[1] + "px";
  player.style.width = `${playerWidth}px`;
  player.style.height = `${playerHeight}px`;
  grid.appendChild(player);
};

// add Ball
const addBall = () => {
  const ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.left = ballCurrentPos[0] + "px";
  ball.style.bottom = ballCurrentPos[1] + "px";
  ball.style.width = `${ballSize}px`;
  ball.style.height = `${ballSize}px`;
  grid.appendChild(ball);
};

// move ball
const moveBall = () => {
  if (isGamePaused || gameOver) return;
  const ball = document.querySelector(".ball");
  ballCurrentPos[0] += ballSpeedX;
  ballCurrentPos[1] += ballSpeedY;
  ball.style.left = ballCurrentPos[0] + "px";
  ball.style.bottom = ballCurrentPos[1] + "px";
  handleCollisions(ballCurrentPos[0], ballCurrentPos[1]);
};

// game end screen
const gameEnd = () => {
  gameOver = true;
  document.removeEventListener("keydown", readInput);
  const gameEndScreen = document.createElement("div");
  const gameEndText = document.createElement("h1");
  gameEndScreen.classList.add("gameEnd");
  gameEndText.innerHTML = "Game Over";
  gameEndScreen.appendChild(gameEndText);
  grid.appendChild(gameEndScreen);
};

const handleCollisions = (posX, posY) => {
  // check for wall collisions
  if (posX > gameboardWidth - ballSize) {
    ballSpeedX = -ballSpeedX;
  }
  if (posX < 0) {
    ballSpeedX = -ballSpeedX;
  }
  if (posY > gameboardHeight - ballSize) {
    ballSpeedY = -ballSpeedY;
  }
  if (posY <= ballSize / 2) {
    gameEnd();
  }
  if (
    posY < playerCurrentPos[1] + playerHeight &&
    posX < playerCurrentPos[0] + playerWidth &&
    posX > playerCurrentPos[0]
  ) {
    ballSpeedY = -ballSpeedY;
  }
};
addPlayer();
addBall();
handleInput();
setInterval(drawLevel, 30);
