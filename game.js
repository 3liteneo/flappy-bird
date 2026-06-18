const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let bird = {
    x: 80,
    y: 300,
    velocity: 0
};

const gravity = 0.5;
const jump = -8;

document.addEventListener("click", () => {
    bird.velocity = jump;
});

function update() {
    bird.velocity += gravity;
    bird.y += bird.velocity;
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(bird.x,bird.y,20,0,Math.PI*2);
    ctx.fill();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
