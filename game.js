const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("start-button");
const titleScreen = document.getElementById("title-screen");
const hud = document.getElementById("hud");

let gameStarted = false;


// ==========================================
// SPRITES
// ==========================================

const sprites = {
    idle: new Image(),
    run: new Image(),
    jump: new Image()
};

sprites.idle.src = "sprites/idle.png";
sprites.run.src = "sprites/run.png";
sprites.jump.src = "sprites/jump.png";


// ==========================================
// INPUT
// ==========================================

const keys = {};

window.addEventListener("keydown", function (event) {

    const key = event.key.toLowerCase();

    keys[key] = true;

    if (
        key === "arrowleft" ||
        key === "arrowright" ||
        key === " "
    ) {
        event.preventDefault();
    }

});


window.addEventListener("keyup", function (event) {

    keys[event.key.toLowerCase()] = false;

});


// ==========================================
// WORLD
// ==========================================

const world = {

    width: 3000,

    ground: 200

};


// ==========================================
// METAL SONIC
// ==========================================

const metal = {

    x: 80,

    y: 155,

    width: 32,

    height: 45,

    velocityX: 0,

    velocityY: 0,

    speed: 4,

    jumpPower: -9,

    gravity: 0.45,

    grounded: false,

    direction: 1,

    dashing: false,

    dashTimer: 0,

    dashLength: 15,

    dashSpeed: 11

};


// ==========================================
// CAMERA
// ==========================================

const camera = {

    x: 0

};


// ==========================================
// RINGS
// ==========================================

const rings = [

    { x: 300, y: 150 },

    { x: 350, y: 150 },

    { x: 400, y: 150 },

    { x: 500, y: 150 },

    { x: 550, y: 150 }

];


// ==========================================
// START BUTTON
// ==========================================

startButton.addEventListener("click", function () {

    gameStarted = true;

    titleScreen.style.display = "none";

    if (hud) {
        hud.style.display = "block";
    }

});


// ==========================================
// UPDATE
// ==========================================

function update() {

    if (!gameStarted) {
        return;
    }


    // --------------------------------------
    // PLASMA DASH
    // --------------------------------------

    if (keys["shift"] && !metal.dashing) {

        metal.dashing = true;

        metal.dashTimer = metal.dashLength;

        keys["shift"] = false;

    }


    // --------------------------------------
    // DASH
    // --------------------------------------

    if (metal.dashing) {

        metal.velocityX =
            metal.direction * metal.dashSpeed;

        metal.dashTimer--;

        if (metal.dashTimer <= 0) {

            metal.dashing = false;

        }

    }


    // --------------------------------------
    // NORMAL MOVEMENT
    // --------------------------------------

    else {

        if (keys["arrowright"]) {

            metal.velocityX = metal.speed;

            metal.direction = 1;

        }

        else if (keys["arrowleft"]) {

            metal.velocityX = -metal.speed;

            metal.direction = -1;

        }

        else {

            metal.velocityX *= 0.8;

        }

    }


    // Move

    metal.x += metal.velocityX;


    // --------------------------------------
    // JUMP
    // --------------------------------------

    if (
        keys[" "] &&
        metal.grounded &&
        !metal.dashing
    ) {

        metal.velocityY = metal.jumpPower;

        metal.grounded = false;

        keys[" "] = false;

    }


    // --------------------------------------
    // GRAVITY
    // --------------------------------------

    metal.velocityY += metal.gravity;

    metal.y += metal.velocityY;


    // --------------------------------------
    // GROUND
    // --------------------------------------

    if (
        metal.y + metal.height >= world.ground
    ) {

        metal.y =
            world.ground - metal.height;

        metal.velocityY = 0;

        metal.grounded = true;

    }


    // --------------------------------------
    // WORLD BOUNDS
    // --------------------------------------

    if (metal.x < 0) {

        metal.x = 0;

    }


    if (
        metal.x >
        world.width - metal.width
    ) {

        metal.x =
            world.width - metal.width;

    }


    // --------------------------------------
    // CAMERA
    // --------------------------------------

    camera.x =
        metal.x - canvas.width / 2;


    if (camera.x < 0) {

        camera.x = 0;

    }


    if (
        camera.x >
        world.width - canvas.width
    ) {

        camera.x =
            world.width - canvas.width;

    }

}


// ==========================================
// SELECT SPRITE
// ==========================================

function getCurrentSprite() {

    if (!metal.grounded) {

        return sprites.jump;

    }


    if (
        Math.abs(metal.velocityX) > 0.3
    ) {

        return sprites.run;

    }


    return sprites.idle;

}


// ==========================================
// DRAW
// ==========================================

function draw() {

    // --------------------------------------
    // SKY
    // --------------------------------------

    ctx.fillStyle = "#5db8ff";

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


    // --------------------------------------
    // BACKGROUND HILLS
    // --------------------------------------

    ctx.fillStyle = "#72c7ff";

    ctx.beginPath();

    ctx.moveTo(0, 180);

    ctx.lineTo(100, 110);

    ctx.lineTo(200, 180);

    ctx.lineTo(320, 100);

    ctx.lineTo(470, 180);

    ctx.lineTo(600, 100);

    ctx.lineTo(750, 180);

    ctx.lineTo(750, 200);

    ctx.lineTo(0, 200);

    ctx.closePath();

    ctx.fill();


    // --------------------------------------
    // GRASS
    // --------------------------------------

    ctx.fillStyle = "#32b34a";

    ctx.fillRect(
        0,
        world.ground,
        world.width,
        20
    );


    // --------------------------------------
    // DIRT
    // --------------------------------------

    ctx.fillStyle = "#8b552b";

    ctx.fillRect(
        0,
        world.ground + 20,
        world.width,
        60
    );


    // --------------------------------------
    // RINGS
    // --------------------------------------

    for (const ring of rings) {

        ctx.strokeStyle = "#ffd83d";

        ctx.lineWidth = 1.5;

        ctx.beginPath();

        ctx.arc(
            ring.x,
            ring.y,
            4,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }


    // --------------------------------------
    // PLASMA TRAIL
    // --------------------------------------

    if (metal.dashing) {

        for (let i = 1; i <= 5; i++) {

            ctx.globalAlpha =
                0.45 - i * 0.06;

            ctx.fillStyle = "#42d9ff";

            ctx.beginPath();

            ctx.arc(

                metal.x
                - metal.direction * i * 7
                + 16,

                metal.y + 22,

                3 + i,

                0,

                Math.PI * 2

            );

            ctx.fill();

        }

        ctx.globalAlpha = 1;

    }


    // --------------------------------------
    // METAL SONIC
    // --------------------------------------

    const sprite =
        getCurrentSprite();


    if (sprite.complete && sprite.naturalWidth > 0) {

        ctx.save();


        if (metal.direction === -1) {

            // Face LEFT

            ctx.translate(
                metal.x + metal.width,
                metal.y - 4
            );

            ctx.scale(-1, 1);

            ctx.drawImage(

                sprite,

                0,
                0,

                metal.width,
                metal.height

            );

        }

        else {

            // Face RIGHT

            ctx.drawImage(

                sprite,

                metal.x,
                metal.y - 4,

                metal.width,
                metal.height

            );

        }


        ctx.restore();

    }


    ctx.restore();

}


// ==========================================
// GAME LOOP
// ==========================================

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(gameLoop);

}


gameLoop();
