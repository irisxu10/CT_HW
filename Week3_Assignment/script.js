// 获取所有的缩略图
let thumbnails = document.querySelectorAll('.thumbnail');

// 获取大图片展示区域
let largeImage = document.getElementById('largeImage');

// 图片路径数组，用于自动播放
let imagePaths = [
    "images/01.jpg",
    "images/02.jpg",
    "images/03.jpg",
    "images/04.jpg"
];

// 当前显示的图片索引
let currentIndex = 0;

// 更新大图片的路径
function updateLargeImage() {
    largeImage.src = imagePaths[currentIndex];
    largeImage.style.display = 'block'; // 显示大图片
    currentIndex = (currentIndex + 1) % imagePaths.length; // 循环播放
}

// 设置定时器每两秒切换一次大图片
let autoPlayInterval = setInterval(updateLargeImage, 2000);

// 为每个缩略图添加点击事件
thumbnails.forEach(function(thumbnail) {
    thumbnail.addEventListener('click', function() {
        // 停止自动播放
        clearInterval(autoPlayInterval);

        // 获取点击的图片路径并显示
        const imageSrc = this.src;
        largeImage.src = imageSrc;
        largeImage.style.display = 'block'; // 显示大图片
    });
});

// 页面加载时自动播放
updateLargeImage();
