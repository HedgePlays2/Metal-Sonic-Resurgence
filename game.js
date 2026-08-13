const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("start-button");
const titleScreen = document.getElementById("title-screen");
const hud = document.getElementById("hud");


// ==========================
// SPRITES
// ==========================

const metalSprite = new Image();

metalSprite.src = "sprites/idle.png";


// ==========================
// GAME STATE
// ==========================

let gameStarted = false;

let keys = {};


// ==========================
// WORLD
// ==========================

const world = {
    width: 3000,
    ground: 190
};


// ==========================
// METAL SONIC
// ==========================

const metal = {

    x: 100,
    y: 100,

    width: 40,
    height: 60,

    velocityX: 0,
    velocityY: 0,

    speed: 6,
    jumpPower: -11,

    grounded: false

};


// ==========================
// CAMERA
// ==========================

const camera = {
    x: 0
};


// ==========================
// INPUT
// ==========================

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


// ==========================
// START BUTTON
// ==========================

startButton.onclick = () => {

    gameStarted = true;

    titleScreen.style.display = "none";

    hud.style.display = "block";

};


// ==========================
// UPDATE
// ==========================

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


// ==========================
// DRAW
// ==========================

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

    ctx.moveTo(0,170);

    ctx.lineTo(300,50);

    ctx.lineTo(600,170);

    ctx.lineTo(900,50);

    ctx.lineTo(1200,170);

    ctx.lineTo(0,170);

    ctx.fill();



    // Ground

    ctx.fillStyle = "#26a83d";

    ctx.fillRect(
        0,
        world.ground,
        world.width,
        100
    );


    ctx.fillStyle = "#8b542c";

    ctx.fillRect(
        0,
        world.ground + 25,
        world.width,
        100
    );



    // Metal Sonic sprite

    if(metalSprite.complete){

        ctx.drawImage(

            metalSprite,

            metal.x - 15,

            metal.y - 15,

            70,

            85

        );

    }



    // Test rings

    for(let i = 0; i < 5; i++){

        ctx.strokeStyle = "#ffd83d";

        ctx.lineWidth = 5;

        ctx.beginPath();

        ctx.arc(

            500 + i * 50,

            140,

            15,

            0,

            Math.PI * 2

        );

        ctx.stroke();

    }



    ctx.restore();

}


// ==========================
// LOOP
// ==========================

function loop(){

    update();

    draw();

    requestAnimationFrame(loop);

}


loop();
