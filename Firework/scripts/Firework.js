// 标准烟花烟花
function Firework(startpoint, angle, hue) {
    // 烟花编号
    this.index = 0;

    // 起点
    this.startPoint = startpoint;
    // 缓冲点
    this.point = this.startPoint;
    // 当前位置点
    this.currentPoint = this.startPoint;

    // 烟花轨迹
    this.track = [];
    // 烟花轨迹长度
    this.trackLength = 10;
    // 创建轨迹
    for (var i = 0; i < this.trackLength; i++) {
        this.track.push(this.startPoint);
    }

    // 烟花出射角
    this.angle = angle;

    // 烟花已存在时间
    this.time = 0;
    // 烟花初速度
    this.speed = 8;
    // 烟花x方向分速度
    this.speedX = this.speed * Number(Math.cos(this.angle).toFixed(5));
    // 烟花y方向分速度
    this.speedY = this.speed * Number(Math.sin(this.angle).toFixed(5));


    // 空气阻力比例系数
    this.friction = 0;
    // 重力
    this.g = .1;
    // 浮力
    this.flotage = 0;
    // 推力
    this.propulsion = 0.05;

    // 烟花亮度
    this.brightness = 50;
    // 烟花颜色
    this.hue = hue;

    // 是否含有轨迹线烟花
    this.trackFirework = true;
    // 轨迹线烟花迸发数量
    this.trackFireworkAmount = 5;

    // 是否含有下一级烟花
    this.leveldownFirework = true;
    // 烟花迸发数量
    this.leveldownFireworkAmount = 30;

    // 烟花持续时间
    this.durationTime = 10;
    // 烟花消失速度
    this.distinguishSpeed = 0.1;
}

// 烟花方法 ———— 更新位置
Firework.prototype.update = function(index) {
    // 设置烟花编号
    this.index = index;
    // 移除最早的一个位置
    this.track.pop();

    if (this.durationTime <= 0) {
        if (this.track.length == 0) {
            if (this.leveldownFirework) {
                this.createSparks(this.currentPoint, this.hue, this.leveldownFireworkAmount);
            }
            fireworks.splice(this.index, 1);
        }
    } else {
        // 添加当前位置
        this.track.unshift(this.currentPoint);

        // 计算此刻速度
        this.speed = this.speed - Math.pow(this.speed, 2) * this.friction;

        // // 计算此刻x和y方向上的速度
        // var speedX = this.speed * Number(Math.cos(this.angle).toFixed(5));
        // var speedY = this.speed * Number(Math.sin(this.angle).toFixed(5));

        // 计算此刻X和Y方向上的加速度
        this.aX = this.propulsion * Number(Math.cos(this.angle).toFixed(2));
        this.aY = this.propulsion * Number(Math.sin(this.angle).toFixed(2)) + this.flotage + this.g;
        //
        // logStatus('aX', this.aX);
        // logStatus('aY', this.aY);

        // 计算此刻所在位置
        // this.currentPoint = [this.point[0] + speedX * dt, this.point[1] + speedY * dt];
        this.currentPoint = [this.currentPoint[0] + this.speedX + 1 / 2 * this.aX, this.currentPoint[1] + this.speedY + 1 / 2 * this.aY];

        // logStatus('currentpoint', this.currentPoint);

        // 更新烟花存在时间
        this.time += dt;

        // 计算x和y方向上加速后的速度
        this.speedX = this.speedX + this.aX;
        this.speedY = this.speedY + this.aY;

        // // 根据x和y方向上的分速度更新烟花速度
        // this.speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);

        // 更新此刻速度的方向
        this.angle = Math.atan2(this.speedY, this.speedX);
        // logStatus('angle', this.angle / Math.PI * 180);

        // 更新持续时间
        this.durationTime = Number((this.durationTime - this.distinguishSpeed).toFixed(5));

        // this.point = this.currentPoint;

        if (this.trackFirework) {
            this.createSparks(this.currentPoint, this.hue, this.trackFireworkAmount);
        }
    }

}
firstTime = true;

// 烟花方法 —— 创建火花
// 根据火花迸发数量创建火花
Firework.prototype.createSparks = function(point, hue, amount) {
    while (amount--) {
        fireworks.push(new Spark(point, randomAtoB(0, 360), randomAtoB(hue - 10, hue + 20)));
    }
}

// 烟花方法 ———— 绘制
Firework.prototype.draw = function() {
    ctx.beginPath();

    for (var i = 0; i < this.track.length; i++) {
        if (i == 0) {
            ctx.moveTo(this.track[i][0], this.track[i][1]);
        } else {
            ctx.lineTo(this.track[i][0], this.track[i][1]);
        }
    }

    ctx.strokeStyle = 'hsl(' + this.hue + ',100%,' + this.brightness + '%)';
    ctx.stroke();

    // ctx.moveTo(this.track[this.track.length - 1][0], this.track[this.track.length - 1][1]);
    // ctx.lineTo(this.currentPoint[0], this.currentPoint[1]);
    //
    // ctx.strokeStyle = 'hsl(' + this.hue + ', 100%,' + this.brightness + '%)';
    // ctx.stroke();
}
