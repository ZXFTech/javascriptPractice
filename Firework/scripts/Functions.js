function logStatus(name, status) {
    console.log(name + ':' + status + '\n');
}

// 指定范围随机数
function randomAtoB(A, B) {
    return Math.random() * Math.abs(A - B) + Math.min(A, B);
}

// 生成起始点
function getStartPoint(x, y, range) {
    if (range == undefined) {
        range = [0, 0];
    }
    if (x == undefined) {
        return [randomAtoB(range[0], range[1]), y];
    }
    if (y == undefined) {
        return [x, randomAtoB(range[0], range[1])];
    }
    return [x, y];
}

// 添加鼠标事件
canvas.addEventListener('mousemove', function(e) {
    mAngle = Math.atan2(e.pageY - cHeight, e.pageX - cWidth / 2);
})

canvas.addEventListener('mousedown', function(e) {
    e.preventDefault();
    mousedown = true;
})

canvas.addEventListener('mouseup', function(e) {
    e.preventDefault();
    mousedown = false;
})
