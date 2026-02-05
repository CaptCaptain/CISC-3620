const canvas = document.getElementById("myCanvas");

canvas.style.border = "3px solid black";

canvas.width = "800";
canvas.height = "500";

const ctx = canvas.getContext("2d");

// Lines
ctx.moveTo(250, 50);
ctx.lineTo(500, 100);
ctx.stroke();

// Triangle
ctx.beginPath();
ctx.moveTo(240, 114);
ctx.lineTo(140, 349);
ctx.lineTo(340, 349);

ctx.closePath();
ctx.stroke();
ctx.fillStyle();

