export default class Block {
  constructor(x, y, blockWidth, blockHeight) {
    this.bottomLeft = [x, y];
    this.bottomRight = [x + blockWidth, y];
    this.topLeft = [x, y + blockHeight];
    this.topRight = [x + blockWidth, y + blockHeight];
    this.fragged = false;
  }

  collisionCheck(ballPos, ballSpeedY, ballSpeedX) {
    let posX = ballPos[0];
    let posY = ballPos[1];
    // this checks is the ball is at the height of the block, and inside of it's width
    if (
      posY >= this.bottomLeft[1] - 20 &&
      posY - 10 <= this.topLeft[1] &&
      posX < this.bottomRight[0] &&
      posX > this.bottomLeft[0]
    ) {
      console.log("collision with bottom of block");
      ballSpeedY();
      this.fragged = true;
    }
  }
}
