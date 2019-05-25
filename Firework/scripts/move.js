window.requestAnimFrame = (function() {
    return window.requestAnimFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    }
})();

// 动画更新回调函数
function loop() {
    requestAnimFrame(loop);

    // 设置画布图像显示方式
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.9)';
    ctx.fillRect(0, 0, cWidth, cHeight);
    ctx.globalCompositeOperation = 'lighter';

    // 更新每个烟火
    var i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i,fireworks);
        // fireworks[i].checkDurationTime(fireworks);
    }

    if (timerTick == timerTotal) {
        if (!mousedown) {
            if (fireworks.length == 0) {
                fireworks.push(new Firework([cWidth / 2, cHeight], 3 / 2 * Math.PI, 60))
            }
            timerTick = timerTotal + 1;
        }
    } else {
        timerTick++;
    }

    // 手动释放烟火部分
    if (limiteTick >= limiteTotal) {
        if (mousedown) {
            // logStatus('mAngle', mAngle / Math.PI * 180);
            fireworks.push(new Firework([cWidth / 2, cHeight], mAngle, randomAtoB(0, 360)));
            limiteTick = 0;
        }
    } else {
        limiteTick++;
    }
}

window.onload = loop;
