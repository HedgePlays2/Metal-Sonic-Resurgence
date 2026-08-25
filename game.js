const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("start-button");
const titleScreen = document.getElementById("title-screen");
const hud = document.getElementById("hud");

let gameStarted = false;
let keys = {};


// ========================================
// SPRITES
// ========================================

const sprites = {
    idle: new Image(),
    run: new Image(),
    jump: new Image()
};

sprites.idle.src = "sprites/idle.png";
sprites.run.src = "sprites/run.png";
sprites.jump.src = "sprites/jump.png";


// ========================================
// WORLD
// ========================================

const world = {
    width: 3000,
    ground: 200
};


// ========================================
// METAL SONIC
// ========================================

const metal = {
    x: 80,
    y: 120,

    width: 32,
    height: 45,

    velocityX: 0,
    velocityY: 0,

    speed: 4,
    jumpPower: -9,

    grounded: false,

    // 1 = facing right
    // -1 = facing left
    direction: 1,

    // Plasma Dash
    dashing: false,
    dashTimer: 0,
    dashDuration: 12,
    dashSpeed: 10,

    dashCooldown: 0
};


// ========================================
// CAMERA
// ========================================

const camera = {
    x: 0
};


// ========================================
// RINGS
// ========================================

const rings = [
    { x: 300, y: 150 },
    { x: 350, y: 150 },
    { x: 400, y: 150 },
    { x: 500, y: 150 }
];


// ========================================
// INPUT
// ========================================

window.addEventListener("keydown", (e) => {

    const key = e.key.toLowerCase();

    keys[key] = true;

    // Prevent the browser from scrolling
    if (
        key === "arrowleft" ||
        key === "arrowright" ||
        key === "arrowup" ||
        key === "arrowdown" ||
        key === " "
    ) {
        e.preventDefault();
    }

});


window.addEventListener("keyup", (e) => {

    keys[e.key.toLowerCase()] = false;

});


// ========================================
// START GAME
// ========================================

startButton.onclick = () => {

    gameStarted = true;

    titleScreen.style.display = "none";

    hud.style.display = "block";

};


// ========================================
// PLASMA DASH
// ========================================

function startDash() {

    if (
        metal.dashing ||
        metal.dashCooldown > 0
    ) {
        return;
    }

    metal.dashing = true;

    metal.dashTimer = metal.dashDuration;

    metal.dashCooldown = 30;

}


// ========================================
// UPDATE
// ========================================

function update() {

    if (!gameStarted) {
        return;
    }


    // ====================================
    // DASH
    // ====================================

    if (
        keys["shift"] &&
        !metal.dashing
    ) {

        startDash();

        // Prevent repeatedly starting dash
        keys["shift"] = false;

    }


    if (metal.dashCooldown > 0) {
        metal.dashCooldown--;
    }


    // ====================================
    // NORMAL MOVEMENT
    // ====================================

    if (!metal.dashing) {

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


    // ====================================
    // PLASMA DASH MOVEMENT
    // ====================================

    if (metal.dashing) {

        metal.velocityX =
            metal.direction * metal.dashSpeed;

        metal.dashTimer--;

        if (metal.dashTimer <= 0) {

            metal.dashing = false;

        }

    }


    metal.x += metal.velocityX;


    // ====================================
    // WORLD BOUNDARIES
    // ====================================

    if (metal.x < 0) {

        metal.x = 0;

        metal.velocityX = 0;

    }


    if (metal.x > world.width - metal.width) {

        metal.x =
            world.width - metal.width;

        metal.velocityX = 0;

    }


    // ====================================
    // JUMP
    // ====================================

    if (
        keys[" "] &&
        metal.grounded &&
        !metal.dashing
    ) {

        metal.velocityY = metal.jumpPower;

        metal.grounded = false;

        // Prevent holding space from
        // repeatedly jumping
        keys[" "] = false;

    }


    // ====================================
    // GRAVITY
    // ====================================

    metal.velocityY += 0.45;

    metal.y += metal.velocityY;


    // ====================================
    // GROUND COLLISION
    // ====================================

    if (
        metal.y + metal.height >= world.ground
    ) {

        metal.y =
            world.ground - metal.height;

        metal.velocityY = 0;

        metal.grounded = true;

    }


    // ====================================
    // CAMERA
    // ====================================

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


// ========================================
// GET CURRENT SPRITE
// ========================================

function getSprite() {

    if (!metal.grounded) {

        return sprites.jump;

    }


    if (
        Math.abs(metal.velocityX) > 0.2
    ) {

        return sprites.run;

    }


    return sprites.idle;

}


// ========================================
// DRAW
// ========================================

function draw() {

    // ====================================
    // SKY
    // ====================================

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


    // ====================================
    // SIMPLE BACKGROUND
    // ====================================

    ctx.fillStyle = "#72c7ff";

    ctx.beginPath();

    ctx.moveTo(0, 160);
    ctx.lineTo(120, 90);
    ctx.lineTo(240, 160);
    ctx.lineTo(360, 80);
    ctx.lineTo(500, 160);

    ctx.lineTo(500, 200);
    ctx.lineTo(0, 200);

    ctx.closePath();

    ctx.fill();


    // ====================================
    // GROUND
    // ====================================

    ctx.fillStyle = "#32b34a";

    ctx.fillRect(
        0,
        world.ground,
        world.width,
        40
    );


    ctx.fillStyle = "#8b552b";

    ctx.fillRect(
        0,
        world.ground + 20,
        world.width,
        40
    );


    // ====================================
    // RINGS
    // ====================================

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


    // ====================================
    // METAL SONIC
    // ====================================

    const sprite = getSprite();


    if (sprite.complete) {

        ctx.save();


        // Flip sprite when facing left

        if (metal.direction === -1) {

            ctx.translate(
                metal.x + 16,
                metal.y - 4
            );

            ctx.scale(-1, 1);

            ctx.drawImage(
                sprite,
                -16,
                0,
                32,
                45
            );

        }

        else {

            ctx.drawImage(
                sprite,
                metal.x,
                metal.y - 4,
                32,
                45
            );

        }


        ctx.restore();

    }


    // ====================================
    // PLASMA DASH EFFECT
    // ====================================

    if (metal.dashing) {

        ctx.save();

        ctx.globalAlpha = 0.65;

        ctx.fillStyle = "#45d9ff";


        for (let i = 1; i <= 4; i++) {

            const trailX =
                metal.x -
                metal.direction * i * 9;

            ctx.beginPath();

            ctx.arc(
                trailX + 16,
                metal.y + 22,
                4 + i,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }


        ctx.restore();

    }


    ctx.restore();

}


// ========================================
// GAME LOOP
// ========================================

function loop() {

    update();

    draw();

    requestAnimationFrame(loop);

}


loop();
