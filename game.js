const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("start-button");
const titleScreen = document.getElementById("title-screen");
const hud = document.getElementById("hud");

let gameStarted = false;


// ============================
// SPRITES
// ============================

const sprites = {

    idle: new Image(),
    run: new Image(),
    jump: new Image()

};


sprites.idle.src = "sprites/idle.png";
sprites.run.src = "sprites/run.png";
sprites.jump.src = "sprites/jump.png";


// ============================
// INPUT
// ============================

let keys = {};


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


// ============================
// WORLD
// ============================

const world = {

    width: 4000,
    ground: 190

};


// ============================
// METAL SONIC
// ============================

const metal = {

    x: 100,
    y: 100,

    width: 40,
    height: 70,

    velocityX: 0,
    velocityY: 0,

    speed: 6,

    jumpPower: -11,

    grounded: false

};


// ============================
// CAMERA
// ============================

const camera = {

    x: 0

};


// ============================
// START GAME
// ============================

startButton.onclick = () => {

    gameStarted = true;

    titleScreen.style.display = "none";

    hud.style.display = "block";

};


// ============================
// UPDATE
// ============================

function update(){


    if(!gameStarted)
        return;



    // Movement

    if(keys["arrowright"]){

        metal.velocityX = metal.speed;

    }

    else if(keys["arrowleft"]){

        metal.velocityX = -metal.speed;

    }

    else {

        metal.velocityX *= 0.8;

    }



    metal.x += metal.velocityX;



    // Jump

    if(
        keys[" "] &&
        metal.grounded
    ){

        metal.velocityY = metal.jumpPower;

        metal.grounded = false;

    }



    // Gravity

    metal.velocityY += 0.5;

    metal.y += metal.velocityY;



    // Ground

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


// ============================
// GET CURRENT SPRITE
// ============================

function getMetalSprite(){


    if(!metal.grounded){

        return sprites.jump;

    }


    if(Math.abs(metal.velocityX) > 0.5){

        return sprites.run;

    }


    return sprites.idle;


}



// ============================
// DRAW
// ============================

function draw(){


    // Sky

    ctx.fillStyle = "#1c315b";

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



    // Mountains

    ctx.fillStyle = "#294878";

    ctx.beginPath();

    ctx.moveTo(0,180);

    ctx.lineTo(300,60);

    ctx.lineTo(600,180);

    ctx.lineTo(900,60);

    ctx.lineTo(1200,180);

    ctx.lineTo(0,180);

    ctx.fill();



    // Ground

    ctx.fillStyle = "#29a844";

    ctx.fillRect(
        0,
        world.ground,
        world.width,
        100
    );


    ctx.fillStyle = "#8b552d";

    ctx.fillRect(
        0,
        world.ground + 25,
        world.width,
        100
    );



    // Rings

    for(let i = 0; i < 6; i++){

        ctx.strokeStyle = "#ffd83d";

        ctx.lineWidth = 5;

        ctx.beginPath();

        ctx.arc(
            500 + i * 55,
            140,
            15,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }



    // Metal Sonic

    let sprite = getMetalSprite();


    if(sprite.complete){

        ctx.drawImage(

            sprite,

            metal.x - 20,

            metal.y - 15,

            80,

            95

        );

    }



    ctx.restore();


}



// ============================
// GAME LOOP
// ============================

function gameLoop(){

    update();

    draw();

    requestAnimationFrame(gameLoop);

}


gameLoop();
