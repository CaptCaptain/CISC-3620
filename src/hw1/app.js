const canvas = document.getElementById("myCanvas");

canvas.style.border = "3px solid black";

canvas.width = "800";
canvas.height = "500";

const ctx = canvas.getContext("2d");

// First Rectangle
ctx.rect(100, 100, 100, 200);
ctx.lineWidth = 5;
ctx.strokeStyle = "rgb(255, 0, 0)";
ctx.stroke();

// Second Rectangle
ctx.strokeRect(300, 200, 200, 100);
ctx.fillStyle = "rgb(0, 0, 0)";
ctx.fillRect(300, 200, 200, 100);

// Gradiants
const grd = ctx.createLinearGradient(0, 0, 200, 0);
grd.addColorStop(0, "#22aed1");
grd.addColorStop(1, "#ec4e20");

ctx.fillStyle = grd
ctx.fillRect(100, 100, 100, 200);
