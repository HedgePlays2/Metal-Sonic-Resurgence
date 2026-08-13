const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("start-button");
const titleScreen = document.getElementById("title-screen");
const hud = document.getElementById("hud");

let gameStarted = false;


/* =========================
   GAME SETTINGS
========================= */

const gravity = 0.5;

const world = {
    width: 3000,
    ground: 190
};


/* =========================
   METAL SONIC
========================= */

const metal = {
    x: 80,
    y: 100,

    width: 28,
    height: 42,

    speed: 0,
    maxSpeed: 6,

    acceleration: 0.35,
    friction: 0.2,

    jumpPower: -10,

    velocityY: 0,

    grounded: false
};


let keys = {};

let camera = {
    x: 0
};


/* =========================
   INPUT
========================= */

window.addEventListener(
    "keydown",
    e => {
        keys[e.key.toLowerCase()] = true;
    }
);


window.addEventListener(
    "keyup",
    e => {
        keys[e.key.toLowerCase()] = false;
    }
);


/* =========================
   START GAME
========================= */

startButton.onclick = () => {

    gameStarted = true;

    titleScreen.style.display = "none";

    hud.style.display = "block";

};


/* =========================
   UPDATE
========================= */

function update(){

    if(!gameStarted)
        return;


    // Movement

    if(keys["arrowright"]){

        metal.speed += metal.acceleration;

    }

    else if(keys["arrowleft"]){

        metal.speed -= metal.acceleration;

    }

    else {

        if(metal.speed > 0)
            metal.speed -= metal.friction;

        if(metal.speed < 0)
            metal.speed += metal.friction;

    }


    // Limit speed

    if(metal.speed > metal.maxSpeed)
        metal.speed = metal.maxSpeed;

    if(metal.speed < -metal.maxSpeed)
        metal.speed = -metal.maxSpeed;



    metal.x += metal.speed;



    // Jump

    if(
        keys[" "] &&
        metal.grounded
    ){

        metal.velocityY = metal.jumpPower;

        metal.grounded = false;

    }



    // Gravity

    metal.velocityY += gravity;

    metal.y += metal.velocityY;



    // Ground collision

    if(
        metal.y + metal.height >= world.ground
    ){

        metal.y =
            world.ground - metal.height;

        metal.velocityY = 0;

        metal.grounded = true;

    }



    // Camera

    camera.x =
        metal.x - canvas.width / 2;


    if(camera.x < 0)
        camera.x = 0;


    if(camera.x > world.width - canvas.width)
        camera.x =
            world.width - canvas.width;

}



/* =========================
   DRAW
========================= */

function draw(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Sky

    ctx.fillStyle = "#59b7ff";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    ctx.save();

    ctx.translate(
        -camera.x,
        0
    );


    // Ground

    ctx.fillStyle = "#35a832";

    ctx.fillRect(
        0,
        world.ground,
        world.width,
        100
    );


    // Metal Sonic placeholder

    ctx.fillStyle = "#168cff";

    ctx.fillRect(
        metal.x,
        metal.y,
        metal.width,
        metal.height
    );


    // Eye

    ctx.fillStyle = "red";

    ctx.fillRect(
        metal.x + 18,
        metal.y + 10,
        5,
        5
    );


    ctx.restore();


    requestAnimationFrame(draw);

}


/* =========================
   LOOP
========================= */

function gameLoop(){

    update();

    requestAnimationFrame(gameLoop);

}


gameLoop();

draw();
