let video;
let handPose;
let hands = [];
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
    // 加载背景和其他图片
    bgImage = loadImage('images/1.jpg');
    alienImage = loadImage('images/alien.png');
    diamondImage = loadImage('images/diamond.png');

    // 加载 Handpose 模型
    handPose = ml5.handPose({ flipped: true });
}

function gotHands(results) {
    hands = results; // 存储检测到的手部关键点
}

function setup() {
    createCanvas(500, 800);

    // 初始化摄像头
    video = createCapture(VIDEO, { flipped: true });
    video.hide();

    // 开始检测手部数据
    handPose.detectStart(video, gotHands);

    // 创建玩家
    player = new Player();

    // 创建敌人
    for (let i = 0; i < 5; i++) {
        if (i % 2 === 0) {
            enemies.push(new EnemyAlien(random(width), random(height / 2)));
        } else {
            enemies.push(new EnemyDiamond(random(width), random(height / 2)));
        }
    }
}

function draw() {
    // 绘制背景
    image(bgImage, 0, 0, width, height);

    // 显示摄像头画面（仅调试用，可选择隐藏）
    // image(video, 0, 0, 160, 120);

    // 处理手势控制
    processHandGesture();

    // 绘制玩家
    player.show();

    // 显示和更新子弹
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].show();
        bullets[i].update();
        if (bullets[i].y < 0) {
            bullets.splice(i, 1); // 移除超出画布的子弹
        }
    }

    // 显示和更新敌人
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].show();
        enemies[i].update();

        // 碰撞
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

// 处理手势控制
function processHandGesture() {
    if (hands.length > 0) {
        let hand = hands[0];
        let index = hand.index_finger_tip; // 食指指尖
        let thumb = hand.thumb_tip;        // 拇指指尖

        // 玩家位置跟随食指指尖
        player.x = constrain(index.x, 0, width);

        // 检测捏合动作
        let d = dist(index.x, index.y, thumb.x, thumb.y);
        if (d < 20) {
            fireBullet(player.x, player.y);
        }
    }
}

// 显示得分
function drawScore() {
    fill(0, 0, 0, 150);
    textSize(28);
    text("Score: " + score, 12, 34);
    fill(255, 215, 0);
    text("Score: " + score, 10, 30);
}

// 发射子弹
function fireBullet(x, y) {
    if (frameCount % 10 === 0) { // 限制发射频率
        bullets.push(new Bullet(x, y));
    }
}

// 添加新的敌人
function addNewEnemies() {
    while (enemies.filter(e => e instanceof EnemyAlien).length < maxAliens) {
        enemies.push(new EnemyAlien(random(width), 0));
    }

    while (enemies.filter(e => e instanceof EnemyDiamond).length < maxDiamonds) {
        enemies.push(new EnemyDiamond(random(width), 0));
    }
}

// 玩家类
class Player {
    constructor() {
        this.x = width / 2;
        this.y = height - 50;
        this.size = 30;
    }

    show() {
        fill(0, 0, 0, 150);
        triangle(this.x - 15, this.y + 15, this.x + 15, this.y + 15, this.x, this.y - 15);
        fill(255, 215, 0);
        stroke(255, 255, 200);
        strokeWeight(2);
        triangle(this.x - 15, this.y + 15, this.x + 15, this.y + 15, this.x, this.y - 15);
        noStroke();
    }
}

// 子弹类
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

// 外星人类
class EnemyAlien {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 55;
    }

    show() {
        image(alienImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
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
        image(diamondImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    update() {
        this.y += 5;
    }

    isHit(bullet) {
        return (bullet.x > this.x && bullet.x < this.x + this.size && bullet.y > this.y && bullet.y < this.y + this.size);
    }
}
