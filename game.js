const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let state = "start";

const bird = {
    x: 100,
    y: 300,
    radius: 18,
    velocity: 0,
    gravity: 0.45,
    jump: -8
};

let pipes = [];
let score = 0;
let highScore = localStorage.getItem("flappyHigh") || 0;

function flap(){
    if(state === "start"){
        state = "playing";
    }
    if(state === "gameover"){
        reset();
        return;
    }
    bird.velocity = bird.jump;
}

document.addEventListener("pointerdown", flap);

function createPipe(){
    const gap = 180;
    const topHeight = Math.random() * (canvas.height * 0.5) + 50;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + gap,
        scored:false
    });
}

function reset(){
    bird.y = canvas.height/2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    state = "start";
}

setInterval(()=>{
    if(state==="playing"){
        createPipe();
    }
},1800);

function update(){

    if(state!=="playing") return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    for(let i=pipes.length-1;i>=0;i--){

        let p = pipes[i];

        p.x -= 3.5;

        if(!p.scored && p.x < bird.x){
            score++;
            p.scored = true;

            if(score > highScore){
                highScore = score;
                localStorage.setItem("flappyHigh",highScore);
            }
        }

        if(
            bird.x + bird.radius > p.x &&
            bird.x - bird.radius < p.x + 70 &&
            (
                bird.y - bird.radius < p.top ||
                bird.y + bird.radius > p.bottom
            )
        ){
            state = "gameover";
        }

        if(p.x < -100){
            pipes.splice(i,1);
        }
    }

    if(
        bird.y + bird.radius > canvas.height ||
        bird.y - bird.radius < 0
    ){
        state = "gameover";
    }
}

function drawBackground(){
    ctx.fillStyle="#70c5ce";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawBird(){
    ctx.fillStyle="yellow";
    ctx.beginPath();
    ctx.arc(bird.x,bird.y,bird.radius,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="white";
    ctx.beginPath();
    ctx.arc(bird.x+6,bird.y-5,5,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="black";
    ctx.beginPath();
    ctx.arc(bird.x+8,bird.y-5,2,0,Math.PI*2);
    ctx.fill();
}

function drawPipes(){
    ctx.fillStyle="#3CB043";

    pipes.forEach(p=>{
        ctx.fillRect(p.x,0,70,p.top);
        ctx.fillRect(
            p.x,
            p.bottom,
            70,
            canvas.height-p.bottom
        );
    });
}

function drawUI(){

    ctx.fillStyle="white";
    ctx.font="bold 40px Arial";
    ctx.textAlign="center";

    ctx.fillText(score,canvas.width/2,70);

    if(state==="start"){
        ctx.fillText(
            "Tap To Start",
            canvas.width/2,
            canvas.height/2
        );
    }

    if(state==="gameover"){
        ctx.fillText(
            "Game Over",
            canvas.width/2,
            canvas.height/2-40
        );

        ctx.font="28px Arial";

        ctx.fillText(
            "Score: "+score,
            canvas.width/2,
            canvas.height/2+10
        );

        ctx.fillText(
            "High Score: "+highScore,
            canvas.width/2,
            canvas.height/2+50
        );

        ctx.fillText(
            "Tap To Restart",
            canvas.width/2,
            canvas.height/2+100
        );
    }
}

function loop(){
    update();

    drawBackground();
    drawPipes();
    drawBird();
    drawUI();

    requestAnimationFrame(loop);
}

loop();
