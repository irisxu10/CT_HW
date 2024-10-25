let player;
let bullets = []; 
let enemies = [];
let bgImage;
let alienImage;
let diamondImage;
let score = 0;
let maxAliens = 5;
let maxDiamonds = 2;


// 背景
function preload() {
    bgImage = loadImage('images/1.jpg');
  alienImage = loadImage('images/alien.png');
  diamondImage = loadImage('images/diamond.png');
}


//SetUp
function setup() {

    let myCanvas = document.getElementById("myCanvas")
createCanvas(windowWidth,windowHeight,myCanvas)

    createCanvas(500, 800);
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

//Draw
function draw() {
    image(bgImage, 0, 0, width, height);
  
    player.show();
    player.move();

    // 显示和更新子弹
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].show();
        bullets[i].update();
        // 移除超出canvas的子弹
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }

  
    // 显示和更新敌人
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].show();
        enemies[i].update();

        // 碰撞
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (enemies[i] && enemies[i].isHit(bullets[j])) { // 确保敌人存在
                enemies.splice(i, 1); // 移除敌人
                bullets.splice(j, 1); // 移除子弹
                score++; // 增加得分
                break; // 结束内层循环，避免多次删除
            }
        }

        // 检查掉落逻辑
        if (enemies[i] && enemies[i].y > height) { // 确保敌人存在
            if (enemies[i] instanceof EnemyAlien) {
                // 圆形敌人未被击中，减分
                score = max(score - 1, -99); // 确保分数不低于0
            } else if (enemies[i] instanceof EnemyDiamond) {
                // 正方形敌人未被击中，增加分数
                score++;
            }
            // 删除掉落的敌人
            enemies.splice(i, 1);
        }
    }
    
    // 检查并添加新的敌人
    addNewEnemies();
    
    // 显示得分
    drawScore();
}

// 显示得分的函数
function drawScore() {
    // 添加阴影效果
    fill(0, 0, 0, 150); // 设置阴影颜色（黑色）
    textSize(28); // 调整文本大小
    text("Score: " + score, 12, 34); // 阴影偏移位置
    fill(255, 215, 0); // 设置得分颜色（金色）
    text("Score: " + score, 10, 30); // 实际得分位置
}

// 用空格键发射子弹
function keyPressed() {
    if (key === ' ') {
        bullets.push(new Bullet(player.x, player.y)); 
    }
}

// 添加敌人
function addNewEnemies() {
    while (enemies.filter(e => e instanceof EnemyAlien).length < maxAliens) {
        enemies.push(new EnemyAlien(random(width), 0)); 
    }

    while (enemies.filter(e => e instanceof EnemyDiamond).length < maxDiamonds) {
        enemies.push(new EnemyDiamond(random(width), 0)); 
    }
}


//玩家
class Player {
    constructor() {
        this.x = width / 2;
        this.y = height - 50;
        this.size = 30; 
    }

    show() {
        fill(0, 0, 0, 150);
        triangle(this.x - 15, this.y + 15, this.x + 15, this.y + 15, this.x, this.y - 15); // 
        // 玩家形象
        fill(255, 215, 0); 
        stroke(255, 255, 200); 
        strokeWeight(2);
        triangle(this.x - 15, this.y + 15, this.x + 15, this.y + 15, this.x, this.y - 15); // 
        noStroke(); 
    }

    move() {
        this.x = mouseX; // 跟随鼠标
        this.x = constrain(this.x, 0, width); // 飞机不离开画布边界
    }
}
  

// 子弹
class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = -7.5; // 设置子弹速度
    }


    show() {
        // 设置边框颜色和宽度
        stroke(255, 255, 200); // 淡白色光边
        strokeWeight(2); // 边框宽度
        fill(255, 215, 0); // 金色填充
        ellipse(this.x, this.y, 8, 12); // 调整子弹大小
        noStroke(); // 不再绘制边框
    }


    update() {
        this.y += this.speed;  // 更新子弹的位置
    }
}


// 外星人
class EnemyAlien {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 55; // 设置外星人大小
    }

    show() {
        image(alienImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    update() {
        this.y += 2.5; // 向下移动
    }

    // 碰撞检测
    isHit(bullet) {
        let d = dist(this.x, this.y, bullet.x, bullet.y);
        return d < this.size / 2 + 5; // 判断子弹是否与外星人碰撞
    }

    reset() {
        this.y = 0; // 将敌人移回顶部
        this.x = random(width); // 随机水平位置
    }
}


// 钻石
class EnemyDiamond {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 60; // 设置钻石大小
    }

    show() {
        // 绘制钻石图像
        image(diamondImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    update() {
        this.y += 5; // 向下移动
    }

    // 碰撞检测
    isHit(bullet) {
        return (bullet.x > this.x && bullet.x < this.x + this.size && bullet.y > this.y && bullet.y < this.y + this.size);
    }
}