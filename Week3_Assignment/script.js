// 获取所有的按钮
const buttons = document.querySelectorAll('.button img');
const largeImage = document.getElementById('large-image');

// 为每个按钮添加点击事件
buttons.forEach(button => {
    button.addEventListener('click', function() {
        // 获取图片的路径并设置到大图展示区域
        const imageSrc = this.src;
        largeImage.src = imageSrc; // 更新大图片的路径
        largeImage.style.display = 'block'; // 显示大图片
    });
});