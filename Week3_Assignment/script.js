// 获取所有的缩略图
let thumbnails = document.querySelectorAll('.thumbnail');

// 获取大图片展示区域
let largeImage = document.getElementById('largeImage');

// 为每个缩略图添加点击事件
thumbnails.forEach(function(thumbnail) {
    thumbnail.addEventListener('click', function() {
        // 将大图片的src更新为点击的缩略图的src
        largeImage.src = thumbnail.src;
        largeImage.style.display = 'block'; // 显示大图片
    });
});
