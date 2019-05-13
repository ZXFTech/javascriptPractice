window.requestAnimFrame = (function() {
    return window.requestAnimFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    }
})();

// 全局变量
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cWidth = window.innerWidth;
var cHeight = window.innerHeight;

canvas.width = cWidth;
canvas.height = cHeight;

// 时间间隔
var dt = 0.1;

// 鼠标角度
var mAngle;

// 烟花自动释放间隔
var timerTick = 0;
var timerTotal = 80;

// 烟花手动释放间隔
var limiteTick = 0;
var limiteTotal = 5;

// 鼠标状态
var mousedown = false;

// 烟花队列
var fireworks = [];
// 火花队列
var sparks = [];

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
    return [x,y];
}

// 烟花
function Firework(angle, hue) {
    // 烟花编号
    this.index = 0;

    // 起点
    this.startPoint = getStartPoint(undefined, cHeight, [cWidth / 2 - 200, cWidth / 2 + 200]);
    // 当前位置点
    this.point = this.startPoint;
    // 缓存点
    this.currentPoint = this.startPoint;

    // 烟火轨迹
    this.track = [];
    // 烟火轨迹长度
    this.trackLength = 3;
    // 创建轨迹
    for (var i = 0; i < this.trackLength; i++) {
        this.track.push(this.startPoint);
    }

    // 烟火出射角
    this.angle = angle;

    // 烟火已存在时间
    this.time = 0;
    // 烟火初速度
    this.speed = 25;

    // 空气阻力
    this.friction = 0.95;
    // 地心引力
    this.gravitionalAcceleration = -0.1;

    // 烟火亮度
    this.brightness = 50;
    // 烟火颜色
    this.hue = hue;

    // 烟火是否迸发
    this.burst = true;
    // 烟火迸发数量
    this.burstAmount = 60;

    // 烟火持续时间
    this.durationTime = randomAtoB(6, 9);
    // 烟火消失速度
    this.distinguishSpeed = 0.1;
}

// 烟花方法 ———— 更新位置
Firework.prototype.update = function(index) {
    // 设置烟花编号
    this.index = index;
    // 移除最早的一个位置
    this.track.pop();
    // 添加当前位置
    this.track.unshift(this.point);

    // 计算此刻速度
    this.speed *= this.friction;
    // 更新烟花存在时间
    this.time += dt;

    // 计算此刻x和y方向上的速度
    var speedX = this.speed * Math.cos(this.angle);
    var speedY = this.speed * Math.sin(this.angle) - this.gravitionalAcceleration * this.time;

    // 计算此刻所在位置
    this.currentPoint = [this.point[0] + speedX * this.time, this.point[1] + speedY * this.time];
    // 更新持续时间
    this.durationTime -= this.distinguishSpeed;
}

// 烟火方法 —— 检测烟花是否还存在
// 如果持续时间等于0
// 则表示烟花已经消失
// 从当前队列中删除该烟花
// 如果烟花可以迸发
// 则创建指定数量的火花
// 如果持续时间不为零
// 则更新烟花位置
Firework.prototype.checkDurationTime = function(locaArray) {
    if (this.durationTime <= 0) {
        if (this.burst) {
            this.createSparks(this.currentPoint, this.hue);
        }
        locaArray.splice(this.index, 1);
    } else {
        this.point = this.currentPoint;
    }
}

// 烟火方法 —— 创建火花
// 根据火花迸发数量创建火花
Firework.prototype.createSparks = function(point, hue) {
    while (this.burstAmount--) {
        sparks.push(new Spark(point, randomAtoB(hue - 10, hue + 20)));
    }
}

// 烟火方法 ———— 绘制
Firework.prototype.draw = function() {
    ctx.beginPath();

    ctx.moveTo(this.track[this.trackLength - 1][0], this.track[this.trackLength - 1][1]);
    ctx.lineTo(this.point[0], this.point[1]);

    ctx.strokeStyle = 'hsl(' + this.hue + ', 100%,' + this.brightness + '%)';
    ctx.stroke();
}

// 火花
function Spark(startPoint, hue) {

    this.startPoint = startPoint;

    // 当前位置点
    this.point = this.startPoint;

    this.currentPoint = this.startPoint;

    // 烟火轨迹
    this.track = [];
    // 烟火轨迹长度
    this.trackLength = Math.floor(randomAtoB(5, 10));
    // 创建轨迹
    for (var i = 0; i < this.trackLength; i++) {
        this.track.push(this.point);
    }

    // 烟火出射角
    this.angle = randomAtoB(0, Math.PI * 2);

    this.time = 0;

    // 烟火初速度
    this.speed = randomAtoB(1, 20);

    // 空气阻力
    this.friction = 0.92;

    this.gravitionalAcceleration = -0.1;

    // 烟火亮度
    this.brightness = randomAtoB(20, 70);
    // 烟火颜色
    this.hue = hue;

    // 烟火是否迸发
    this.burst = false;
    // 烟火迸发数量
    this.burstAmount = 0;

    // 烟火持续时间
    this.durationTime = randomAtoB(6, 9);
    this.distinguishSpeed = 0.1;

}

// 设置继承
Spark.prototype = Object.create(Firework.prototype);
Spark.prototype.constructor = Spark;

// 动画更新回调函数
function loop() {
    requestAnimFrame(loop);

    // 设置画布图像显示方式
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, cWidth, cHeight);
    ctx.globalCompositeOperation = 'lighter';

    // 更新每个烟火
    var i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
        fireworks[i].checkDurationTime(fireworks);
    }

    // 更新每个火花
    var i = sparks.length;
    while (i--) {
        sparks[i].draw();
        sparks[i].update(i);
        sparks[i].checkDurationTime(sparks);
    }

    // 自动释放烟火部分
    if (timerTick >= timerTotal) {
        if (!mousedown) {
            if (fireworks.length == 0) {
                fireworks.push(new Firework(randomAtoB(255, 285) * Math.PI / 180, randomAtoB(0, 360)));
            }
            timerTick = 0;
        }
    } else {
        timerTick++;
    }

    // 手动释放烟火部分
    if (limiteTick >= limiteTotal) {
        if (mousedown) {
            fireworks.push(new Firework(mAngle, randomAtoB(0, 360)));
            limiteTick = 0;
        }
    } else {
        limiteTick++;
    }
}

// 添加鼠标事件
canvas.addEventListener('mousemove', function(e) {
    mAngle = -1 * Math.atan2(cHeight - e.pageY, e.pageX - cWidth / 2);
})

canvas.addEventListener('mousedown', function(e) {
    e.preventDefault();
    mousedown = true;
})

canvas.addEventListener('mouseup', function(e) {
    e.preventDefault();
    mousedown = false;
})

window.onload = loop;
