const canvas = document.getElementById("myCanvas");

canvas.style.border = "3px solid black";

canvas.width = "800";
canvas.height = "500";

const ctx = canvas.getContext("2d");

// Arcs
ctx.arc(300, 300, 100, 0, 2 * Math.PI);
ctx.lineWidth = 5;
ctx.strokeStyle = "blue";
ctx.stroke();

ctx.fill();
