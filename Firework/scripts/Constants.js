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
var limiteTotal = 10;

// 鼠标状态
var mousedown = false;

// 烟花队列
var fireworks = [];
// 火花队列
var sparks = [];
