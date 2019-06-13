minHeight = 20;
maxHeight = 80;
minWidth = 10;
maxWidth = 20;
minGap = 160;
maxGap = 320;
gap = randGap();
var myObstacles = [];
var colors = ["#339999", "#ff33ff"];

//---------------------------------------- MES SONS & IMAGE
var crashSound = new Audio("sounds/crash.mp3");
var button = new Audio("sounds/button.mp3");
var techno = new Audio("sounds/surrender.mp3");
var gameOver = new Image("image/gameover.jpg");
//---------------------------------------- SHOW/HIDE BUTTONS
function toggle_visibility() {
  var rules = document.getElementById("rules");
  if (rules.style.display == "block") rules.style.display = "none";
  else rules.style.display = "block";
}
//---------------------------------------- START GAME
function startGame() {
  gameArea.start();
  techno.play();
  let boutonStart = document.getElementById("btn1");
  boutonStart.style.visibility = "hidden";
  let boutonRules = document.getElementById("btn3");
  boutonRules.style.visibility = "hidden";
  let boutonMenu = document.getElementById("btn2");
  boutonMenu.classList.remove("hidden");
}
//---------------------------------------- RELOAD GAME
function restart() {
  location.reload();
}

//----------------------------------------
function everyInterval(n) {
  if (gameArea.frame % n == 0) return true;
  return false;
}
//---------------------------------------- JUMP
function jump() {
  player.speedY = -2;
}
//---------------------------------------- GAP BETWEEN OBSTACLES
function randGap() {
  return Math.floor(minGap + Math.random() * (maxGap - minGap + 1));
}
//---------------------------------------- GAME OVER MODAL
function openModal() {
  document.getElementById("modal").style.display = "block";
  document.getElementById("modal").style.position = "absolute";
  // document.getElementById("modal").style.marginTop = "-500px";
  document.getElementById("modal").style.marginLeft = "270px";
}
//---------------------------------------- SCORE
var scoreText = {
  x: 900,
  y: 50,
  update: function(text) {
    gameArea.context.fillStyle = "white";
    gameArea.context.font = "25px 'Press Start 2P'";
    gameArea.context.fillText(text, this.x, this.y);
  }
};
//---------------------------------------- MY PLAYER
var player = {
  x: 20,
  y: 470,
  speedY: 0,
  update: function() {
    gameArea.context.fillStyle = "white";
    gameArea.context.fillRect(this.x, this.y, 30, 30);
  },
  newPos: function() {
    if (this.y < 280) {
      this.speedY = 2;
    }
    this.y = this.y + this.speedY;
    if (this.speedY == 2 && this.y == 470) {
      this.speedY = 0;
    }
  },
  crashWith: function(obs) {
    if (
      this.x + 30 > obs.x &&
      this.x < obs.x + obs.width &&
      this.y + 30 > obs.y
    ) {
      return true;
    }
    return false;
  }
};
//---------------------------------------- OBSTACLES
class obstacle {
  constructor() {
    this.height = Math.floor(
      minHeight + Math.random() * (maxHeight - minHeight + 1)
    );
    this.width = Math.floor(
      minWidth + Math.random() * (maxWidth - minWidth + 1)
    );
    this.x = 1200;
    this.y = gameArea.canvas.height - this.height;
    this.index = Math.floor(Math.random() * colors.length);
    this.colors = colors[this.index];
    this.draw = function() {
      gameArea.context.fillStyle = this.colors;
      gameArea.context.fillRect(this.x, this.y, this.width, this.height);
    };
  }
}
//---------------------------------------- MY GAME AREA
var gameArea = {
  canvas: document.createElement("canvas"), // on créé le canvas
  //----------------------------------------POSITION INITIALE DU JEU
  start: function() {
    this.canvas.height = 500;
    this.canvas.width = 1200;
    document.body.insertBefore(this.canvas, document.body.childNodes[6]); //on ajoute le canvas au 6ème enfant du body
    this.context = this.canvas.getContext("2d");
    this.frame = 0;
    this.score = 0;
    scoreText.update("Score: 0");
    this.interval = setInterval(this.updateGameArea, 2);
    document.onkeydown = function(event) {
      if (event.keyCode == 32) {
        event.preventDefault();
        if (player.y === 470) {
          jump();
        }
      }
    };
  },

  //---------------------------------------- CHANGEMENT D'ETAT DU JEU
  updateGameArea: function() {
    for (i = 0; i < myObstacles.length; i++) {
      if (player.crashWith(myObstacles[i])) {
        techno.pause();
        gameArea.clear();
        gameArea.stop();
        return;
      }
    }
    gameArea.clear();
    if (everyInterval(gap)) {
      myObstacles.push(new obstacle());
      gap = randGap();
      gameArea.frame = 0;
    }
    for (i = 0; i < myObstacles.length; i++) {
      myObstacles[i].x -= 1;
      myObstacles[i].draw();
    }
    player.newPos();
    player.update();
    gameArea.frame += 1;
    gameArea.score += 0.01;
    scoreText.update("Score: " + Math.floor(gameArea.score));
  },

  clear: function() {
    gameArea.context.clearRect(0, 0, this.canvas.width, this.canvas.width);
  },

  stop: function() {
    clearInterval(this.interval);
    crashSound.play();
    openModal();
  }
};
