class Player {
  constructor(name, x, color) {
    this.name = name;
    this.count = 0;
    this.button = createButton(`${name} Button`);
    this.button.position(x, height * 0.5);
    this.button.size(width * 0.2, height * 0.1);
    this.button.style("font-size", `${width * 0.02}px`);
    this.button.style("border-radius", `${width * 0.02}px`);
    this.button.style("outline", "none");
    this.button.mousePressed(this.press.bind(this));
    this.button.touchStarted(this.press.bind(this));
    this.button.mouseReleased(this.release.bind(this));
    this.button.touchEnded(this.release.bind(this));

    this.barHeight = 0;
    this.color = color;
  }

  updateBar() {
    this.barHeight = map(this.count, 0, winningFactor, 0, height * 0.8);
    fill(this.color);
    rect(this.button.x - width * 0.05, height * 0.9, width * 0.1, -this.barHeight);
  }

  press() {
    if (!activeTouches.includes(this.name)) {
      this.count++;
      activeTouches.push(this.name);
    }
  }

  release() {
    if (activeTouches.includes(this.name)) {
      const index = activeTouches.indexOf(this.name);
      activeTouches.splice(index, 1);
    }
  }
}

const winningFactor = 25;
let activeTouches = [];
let players = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  players.push(new Player("Player 1", width * 0.1, color(255, 0, 0)));
  players.push(new Player("Player 2", width * 0.9 - width * 0.2, color(0, 0, 255)));

  // Create restart button
  let restartButton = createButton("Restart");
  restartButton.position(width * 0.5 - width * 0.05, height * 0.85);
  restartButton.size(width * 0.1, height * 0.05);
  restartButton.style("font-size", `${width * 0.015}px`);
  restartButton.style("border-radius", `${width * 0.01}px`);
  restartButton.style("outline", "none");
  restartButton.mousePressed(restartGame);
}

function draw() {
  background(220);

  for (let player of players) {
    player.updateBar();
    textSize(width * 0.03);
    textAlign(CENTER, CENTER);
    fill(0);
    text(`${player.name}: ${player.count}`, player.button.x, height * 0.8);
  }

  checkWinCondition();
}

function checkWinCondition() {
  for (let player of players) {
    if (player.count >= winningFactor) {
      let winners = players.filter((p) => p.count >= winningFactor);
      let winnerText;
      if (winners.length === players.length) {
        winnerText = "It's a tie!";
      } else {
        winnerText = `${winners.map((w) => w.name).join(" and ")} win${winners.length > 1 ? "" : "s"}!`;
      }
      textSize(width * 0.04);
      textAlign(CENTER, CENTER);
      fill(0);
      text(winnerText, width * 0.5, height * 0.1);
      noLoop();
    }
  }
}

function restartGame() {
  for (let player of players) {
    player.count = 0;
    player.updateBar();
  }
  activeTouches = [];
  loop();
}
