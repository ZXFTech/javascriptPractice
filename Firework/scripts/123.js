// 全局变量
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cWidth = window.innerWidth;
var cHeight = window.innerHeight;

var height = canvas.height;

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
    return [x, y];
}

// 标准烟花烟花
function Firework(startpoint, angle, hue) {
    // 烟花编号
    this.index = 0;

    logStatus('startpoint',startpoint);

    // 起点
    this.startPoint = startpoint;
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
    this.speed = 140;

    // 空气阻力比例系数
    this.friction = 0;
    // 地心引力
    this.g = -10;
    // 浮力
    this.flotage = 10;
    // 推力
    this.propulsion = 20;

    this.aX = this.propulsion * Number(Math.cos(this.angle).toFixed(2));
    this.aY = this.propulsion * Number(Math.sin(this.angle).toFixed(2)) + this.flotage + this.g;

    // 烟火亮度
    this.brightness = 50;
    // 烟火颜色
    this.hue = hue;

    // 烟火是否迸发
    this.burst = false;
    // 烟火迸发数量
    this.burstAmount = 60;

    // 烟火持续时间
    this.durationTime = 10;
    // 烟火消失速度
    this.distinguishSpeed = 0.1;
}

// // 烟花方法 ———— 更新位置
// Firework.prototype.update = function(index) {
//     // 设置烟花编号
//     this.index = index;
//     // 移除最早的一个位置
//     this.track.pop();
//     // 添加当前位置
//     this.track.unshift(this.point);
//
//     // // 计算此刻速度
//     // var currentSpeed = this.speed - Math.pow(this.speed, 2) * this.friction;
//     // 计算此刻速度
//     this.speed = this.speed - Math.pow(this.speed, 2) * this.friction;
//     // 计算此刻x和y方向上的速度
//     // var dX = currentSpeed * Math.cos(this.angle) + this.aX * this.time * dt - this.speed * Math.cos(this.angle);
//     // var dY = currentSpeed * Math.sin(this.angle) + this.ay * this.time * dt - this.speed * Math.sin(this.angle);
//
//     // 更新烟花存在时间
//     this.time += dt;
//
//     // 计算此刻x和y方向上的速度
//     var speedX = this.speed * Math.cos(this.angle);
//     var speedY = this.speed * Math.sin(this.angle);
//     // 计算此刻所在位置
//     // this.currentPoint = [this.point[0] + speedX * dt, this.point[1] + speedY * dt];
//     this.currentPoint = [this.point[0] + speedX * dt, this.startPoint[1] + this.speed * Math.sin(this.angle) * this.time - 1/2 * this.gravitionalAcceleration * this.time * this.time];
//
//     // this.speed = currentSpeed;
//
//     // 更新烟花存在时间
//     this.time += dt;
//
//     // 更新持续时间
//     this.durationTime = Number((this.durationTime - this.distinguishSpeed).toFixed(2));
// }
Firework.prototype.update = function(index) {
    // 设置烟花编号
    this.index = index;
    // 移除最早的一个位置
    this.track.pop();
    // 添加当前位置
    this.track.unshift(this.point);

    // 计算此刻速度
    this.speed = this.speed - Math.pow(this.speed, 2) * this.friction;
    // 更新烟花存在时间
    this.time += dt;

    // 计算此刻x和y方向上的速度
    var speedX = this.speed * Math.cos(this.angle);
    var speedY = this.speed * Math.sin(this.angle);
    // 计算此刻所在位置
    // this.currentPoint = [this.point[0] + speedX * dt, this.point[1] + speedY * dt];
    this.currentPoint = [this.point[0] + speedX * dt, this.startPoint[1] + this.speed * Math.sin(this.angle) * this.time - 1/2 * this.gravitionalAcceleration * this.time * this.time];

    // 更新持续时间
    this.durationTime = Number((this.durationTime - this.distinguishSpeed).toFixed(2));
}
firstTime = true;

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
            logStatus('currentPoint', this.currentPoint);
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

// 标准火花
function Spark(startPoint, hue) {

    this.startPoint = startPoint;

    // 当前位置点
    this.point = this.startPoint;

    this.currentPoint = this.startPoint;

    // 烟火轨迹
    this.track = [];
    // 烟火轨迹长度
    this.trackLength = 30;
    // this.trackLength = Math.floor(randomAtoB(5, 5));
    // 创建轨迹
    for (var i = 0; i < this.trackLength; i++) {
        this.track.push(this.point);
    }

    // 烟火出射角
    this.angle = randomAtoB(0, Math.PI * 2);

    this.time = 0;

    // 烟火初速度
    this.speed = 20;

    // 空气阻力
    this.friction = 0.0001;

    this.g = -5;

    // 烟火亮度
    this.brightness = randomAtoB(20, 70);
    // 烟火颜色
    this.hue = hue;

    // 烟火是否迸发
    this.burst = false;
    // 烟火迸发数量
    this.burstAmount = 0;

    // 烟火持续时间
    this.durationTime = randomAtoB(4, 6);
    this.distinguishSpeed = 0.1;

}

// 设置继承
Spark.prototype = Object.create(Firework.prototype);
Spark.prototype.constructor = Spark;


function logStatus(name, status) {
    console.log(name + ':' + status + '\n');
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
