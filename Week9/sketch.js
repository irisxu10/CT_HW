let video;
let bodyPose;
let poses = [];

let player;
let bullets = [];
let enemies = [];
let bgImage;
let alienImage;
let diamondImage;
let score = 0;
let maxAliens = 5;
let maxDiamonds = 2;

function preload() {
  bgImage = loadImage("images/1.jpg");
  alienImage = loadImage("images/alien.png");
  diamondImage = loadImage("images/diamond.png");

  // Load the bodyPose model
  bodyPose = ml5.bodyPose();
}

function gotPoses(results) {
  poses = results;
}

function setup() {
  createCanvas(500, 800);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);

  // 玩家
  player = new Player();

  // 敌人
  for (let i = 0; i < 5; i++) {
    if (i % 2 === 0) {
      enemies.push(new EnemyAlien(random(width), random(height / 2)));
    } else {
      enemies.push(new EnemyDiamond(random(width), random(height / 2)));
    }
  }
}

function draw() {
  image(bgImage, 0, 0, width, height);

  processBodyPose();

  player.show();

  // 显示/更新子弹
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].show();
    bullets[i].update();
    if (bullets[i].y < 0) {
      bullets.splice(i, 1); // 移除超出画布的子弹
    }
  }

  // 显示/更新敌人
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].show();
    enemies[i].update();

    // 碰撞检测
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (enemies[i] && enemies[i].isHit(bullets[j])) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score++;
        break;
      }
    }

    // 检查掉落逻辑
    if (enemies[i] && enemies[i].y > height) {
      if (enemies[i] instanceof EnemyAlien) {
        score = max(score - 1, -99); // 外星人未被击中减分
      } else if (enemies[i] instanceof EnemyDiamond) {
        score++; // 钻石未被击中加分
      }
      enemies.splice(i, 1);
    }
  }

  // 添加新的敌人
  addNewEnemies();

  // 显示得分
  drawScore();
}

// 姿势
function processBodyPose() {
  if (poses.length > 0) {
    // console.log(poses)
    let pose = poses[0];
    let x = pose.nose.x;
    let y = pose.nose.y;
    let leftWrist = pose.left_wrist;
    let rightWrist = pose.right_wrist;

    //console.log(leftWrist)

    // 跟随鼻尖
    player.x = constrain(x, y, width);

    // 击掌
    let d = dist(leftWrist.x, leftWrist.y, rightWrist.x, rightWrist.y);
    console.log(d);
    if (d < 50) {
      // 左右手距离接近视为击掌
      fireBullet(player.x, player.y);
    }
  }
}

// 得分
function drawScore() {
  fill(0, 0, 0, 150);
  textSize(28);
  text("Score: " + score, 12, 34);
  fill(255, 215, 0);
  text("Score: " + score, 10, 30);
}

// 发射子弹
function fireBullet(x, y) {
  if (frameCount % 10 === 0) {
    // 限制发射频率
    bullets.push(new Bullet(x, y));
  }
}

// 新敌人
function addNewEnemies() {
  while (enemies.filter((e) => e instanceof EnemyAlien).length < maxAliens) {
    enemies.push(new EnemyAlien(random(width), 0));
  }

  while (
    enemies.filter((e) => e instanceof EnemyDiamond).length < maxDiamonds
  ) {
    enemies.push(new EnemyDiamond(random(width), 0));
  }
}

// 玩家
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.size = 30;
  }

  show() {
    fill(0, 0, 0, 150);
    triangle(
      this.x - 15,
      this.y + 15,
      this.x + 15,
      this.y + 15,
      this.x,
      this.y - 15
    );
    fill(255, 215, 0);
    stroke(255, 255, 200);
    strokeWeight(2);
    triangle(
      this.x - 15,
      this.y + 15,
      this.x + 15,
      this.y + 15,
      this.x,
      this.y - 15
    );
    noStroke();
  }
}

// 子弹
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = -7.5;
  }

  show() {
    stroke(255, 255, 200);
    strokeWeight(2);
    fill(255, 215, 0);
    ellipse(this.x, this.y, 8, 12);
    noStroke();
  }

  update() {
    this.y += this.speed;
  }
}

// Alien
class EnemyAlien {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 55;
  }

  show() {
    image(
      alienImage,
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }

  update() {
    this.y += 2.5;
  }

  isHit(bullet) {
    let d = dist(this.x, this.y, bullet.x, bullet.y);
    return d < this.size / 2 + 5;
  }
}

// 钻石类
class EnemyDiamond {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 60;
  }

  show() {
    image(
      diamondImage,
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }

  update() {
    this.y += 5;
  }

  isHit(bullet) {
    return (
      bullet.x > this.x &&
      bullet.x < this.x + this.size &&
      bullet.y > this.y &&
      bullet.y < this.y + this.size
    );
  }
}
