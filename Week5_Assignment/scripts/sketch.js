let angle = 0;         // 小球的初始角度
let squareRotation = 0; // 正方形的旋转角度
let radius = 100;      // 小球运动的半径
let numTurns = 0;      // 小球转动的圈数
let turnThreshold = 3; // 每转多少圈
let squareColor;
let timerID;           // 定时器ID
let shapes = [];       // 存储随机生成的小方块

function setup() {
//   let canvas=createCanvas(windowWidth, windowHeight); 
//   canvas.parent('p5-canvas')
let myCanvas = document.getElementById("myCanvas")
createCanvas(windowWidth,windowHeight,myCanvas)

  squareColor = color(random(255), random(255), random(255));  
    // 设置定时器，每2秒生成一个新的小方块
  timerID = setInterval(() => {
    let newShape = {
      x: random(width), 
      y: random(height), 
      size: random(10, 30), 
      color: color(random(255), random(255), random(255))
    };
    shapes.push(newShape); // 将新方块添加到数组中
  }, 2000); // 2000毫秒，即每2秒
}

function draw() {
  background(220); 

  // 小球坐标
  let ballX = width / 2 + radius * cos(angle);
  let ballY = height / 2 + radius * sin(angle);

  // 正方形
  push(); // 保存当前状态
  translate(width / 2, height / 2); // 将原点移动到画布中心
  rotate(radians(squareRotation)); // 旋转正方形
  fill(squareColor);
  rectMode(CENTER); // 将正方形绘制模式设置为中心
  rect(0, 0, 100, 100); // 绘制正方形
  pop(); // 恢复状态

  // 小球
  fill(255, 0, 0);
  ellipse(ballX, ballY, 20, 20); 
  
  // 摆杆
  stroke(200); 
  strokeWeight(1); 
  line(width / 2, height / 2, ballX, ballY); // 从中心到小球的摆杆

  // 更新小球的角度
  angle += 0.1; // 小球的速度

  // 计算转圈数
  if (angle >= TWO_PI) {
    angle = 0; // 每次小球完成一圈，重置角度
    numTurns++; // 增加转圈数
  }

  
   if (numTurns >= turnThreshold) {
    squareRotation += 15; // 顺时针旋转15度
    squareColor = color(random(255), random(255), random(255)); // 随机生成新的颜色
    numTurns = 0; // 重置转圈数
  }
  
  // 绘制随机生成的小方块
  for (let shape of shapes) {
    fill(shape.color);
    rect(shape.x, shape.y, shape.size, shape.size); // 绘制方块
  }

}
