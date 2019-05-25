// 标准火花
function Spark(startpoint, angle, hue) {
    // 烟花编号
    this.index = 0;

    // 起点
    this.startPoint = startpoint;
    // 缓冲点
    this.point = this.startPoint;
    // 当前位置 点
    this.currentPoint = this.startPoint;

    // 烟花轨迹
    this.track = [];
    // 烟花轨迹长度
    this.trackLength = 2;
    // 创建轨迹
    for (var i = 0; i < this.trackLength; i++) {
        this.track.push(this.startPoint);
    }

    // 烟花出射角
    this.angle = angle;

    // 烟花已存在时间
    this.time = 0;
    // 烟花初速度
    this.speed = randomAtoB(5, 1);
    // 烟花x方向分速度
    this.speedX = this.speed * Number(Math.cos(this.angle).toFixed(5));
    // 烟花y方向分速度
    this.speedY = this.speed * Number(Math.sin(this.angle).toFixed(5));

    // 空气阻力比例系数
    this.friction = 0;
    // 重力
    this.g = .1;
    // 浮力
    this.flotage = -0.09;
    // 推力
    this.propulsion = -0.001;

    // 烟花亮度
    this.brightness = 50;
    // 烟花颜色
    this.hue = hue;

    // 是否含有轨迹线烟花
    this.trackFirework = false;
    // 轨迹线烟花迸发数量
    this.trackFireworkAmount = 10;

    // 是否含有下一级烟花
    this.leveldownburst = false;
    // 烟花迸发数量
    this.leveldownburstAmount = 30;

    // 烟花持续时间
    this.durationTime = randomAtoB(3, 5);
    // 烟花消失速度
    this.distinguishSpeed = 0.1;
}

// 设置继承
Spark.prototype = Object.create(Firework.prototype);
Spark.prototype.constructor = Spark;
