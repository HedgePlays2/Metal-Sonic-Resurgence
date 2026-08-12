/* =========================================================
   METAL SONIC: RESURGENCE
   game.js
   ========================================================= */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;


/* =========================================================
   GAME SETTINGS
   ========================================================= */

const GAME_WIDTH = 424;
const GAME_HEIGHT = 240;

const GRAVITY = 0.45;

const GROUND_Y = 205;

let gameStarted = false;

let cameraX = 0;

let score = 0;
let rings = 0;


/* =========================================================
   INPUT
   ========================================================= */

const keys = {};
const previousKeys = {};

document.addEventListener("keydown", (event) => {

    keys[event.code] = true;

    if (
        event.code === "ArrowLeft" ||
        event.code === "ArrowRight" ||
        event.code === "ArrowUp" ||
        event.code === "ArrowDown" ||
        event.code === "Space" ||
        event.code === "ShiftLeft" ||
        event.code === "ShiftRight"
    ) {
        event.preventDefault();
    }

});


document.addEventListener("keyup", (event) => {

    keys[event.code] = false;

});


function pressed(key) {
    return keys[key] && !previousKeys[key];
}


/* =========================================================
   PLAYER
   ========================================================= */

const player = {

    x: 80,
    y: 160,

    width: 24,
    height: 32,

    velocityX: 0,
    velocityY: 0,

    acceleration: 0.45,

    maxSpeed: 7,

    jumpPower: 9.5,

    grounded: false,

    rolling: false,

    dashing: false,

    dashTimer: 0,

    dashDirection: 1,

    overdrive: false,

    energy: 100,

    maxEnergy: 100,

    invincibleTimer: 0

};


/* =========================================================
   LEVEL
   ========================================================= */

const level = {

    width: 3200

};


/* =========================================================
   PLATFORMS
   ========================================================= */

const platforms = [

    {
        x: 0,
        y: 205,
        width: 700,
        height: 35
    },

    {
        x: 760,
        y: 205,
        width: 500,
        height: 35
    },

    {
        x: 1320,
        y: 205,
        width: 700,
        height: 35
    },

    {
        x: 2100,
        y: 205,
        width: 1100,
        height: 35
    },

    /*
     * Floating platforms
     */

    {
        x: 430,
        y: 160,
        width: 110,
        height: 15
    },

    {
        x: 900,
        y: 145,
        width: 120,
        height: 15
    },

    {
        x: 1500,
        y: 155,
        width: 120,
        height: 15
    },

    {
        x: 1800,
        y: 120,
        width: 140,
        height: 15
    }

];


/* =========================================================
   RINGS
   ========================================================= */

const ringObjects = [

    { x: 250, y: 170, collected: false },
    { x: 280, y: 170, collected: false },
    { x: 310, y: 170, collected: false },

    { x: 470, y: 125, collected: false },
    { x: 500, y: 125, collected: false },
    { x: 530, y: 125, collected: false },

    { x: 830, y: 170, collected: false },
    { x: 860, y: 170, collected: false },

    { x: 950, y: 110, collected: false },
    { x: 980, y: 110, collected: false },

    { x: 1420, y: 170, collected: false },
    { x: 1450, y: 170, collected: false },
    { x: 1480, y: 170, collected: false },

    { x: 1750, y: 170, collected: false },
    { x: 1780, y: 170, collected: false },

    { x: 1830, y: 85, collected: false },
    { x: 1860, y: 85, collected: false }

];


/* =========================================================
   ENEMIES
   ========================================================= */

const enemies = [

    {
        x: 600,
        y: 177,
        width: 24,
        height: 28,
        alive: true,
        velocityX: 1
    },

    {
        x: 1100,
        y: 177,
        width: 24,
        height: 28,
        alive: true,
        velocityX: -1
    },

    {
        x: 1600,
        y: 177,
        width: 24,
        height: 28,
        alive: true,
        velocityX: 1
    },

    {
        x: 2250,
        y: 177,
        width: 24,
        height: 28,
        alive: true,
        velocityX: -1
    }

];


/* =========================================================
   ENERGY CORES
   ========================================================= */

const energyCores = [

    { x: 380, y: 170, collected: false },
    { x: 1030, y: 170, collected: false },
    { x: 1350, y: 170, collected: false },
    { x: 1700, y: 170, collected: false },
    { x: 2050, y: 170, collected: false }

];


/* =========================================================
   COLLISION
   ========================================================= */

function rectangleCollision(a, b) {

    return (

        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y

    );

}


/* =========================================================
   START GAME
   ========================================================= */

function startGame() {

    if (gameStarted)
        return;

    gameStarted = true;

    const titleScreen =
        document.getElementById("title-screen");

    const loading =
        document.getElementById("loading");

    const hud =
        document.getElementById("hud");

    titleScreen.style.display = "none";

    loading.style.display = "flex";

    setTimeout(() => {

        loading.style.display = "none";

        hud.style.display = "block";

        requestAnimationFrame(gameLoop);

    }, 500);

}


/* =========================================================
   BUTTON
   ========================================================= */

const startButton =
    document.getElementById("start-button");

if (startButton) {

    startButton.addEventListener(
        "click",
        startGame
    );

}


/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

function updatePlayer() {

    /*
     * PLASMA DASH
     */

    if (
        (pressed("ShiftLeft") ||
        pressed("ShiftRight")) &&
        player.energy >= 20 &&
        !player.dashing
    ) {

        player.dashing = true;

        player.dashTimer = 18;

        player.energy -= 20;

        if (Math.abs(player.velocityX) > 0.5) {

            player.dashDirection =
                Math.sign(player.velocityX);

        }
        else {

            player.dashDirection = 1;

        }

    }


    /*
     * DASH
     */

    if (player.dashing) {

        player.velocityX =
            player.dashDirection * 13;

        player.dashTimer--;

        if (player.dashTimer <= 0) {

            player.dashing = false;

        }

    }


    /*
     * NORMAL MOVEMENT
     */

    if (!player.dashing) {

        if (keys["ArrowLeft"]) {

            player.velocityX -=
                player.acceleration;

        }

        if (keys["ArrowRight"]) {

            player.velocityX +=
                player.acceleration;

        }


        /*
         * FRICTION
         */

        if (
            !keys["ArrowLeft"] &&
            !keys["ArrowRight"]
        ) {

            player.velocityX *= 0.86;

        }


        /*
         * OVERDRIVE SPEED
         */

        let speedLimit =
            player.overdrive
                ? 11
                : player.maxSpeed;


        player.velocityX =
            Math.max(
                -speedLimit,
                Math.min(
                    speedLimit,
                    player.velocityX
                )
            );

    }


    /*
     * JUMP
     */

    if (
        pressed("Space") &&
        player.grounded
    ) {

        player.velocityY =
            -player.jumpPower;

        player.grounded = false;

    }


    /*
     * ROLL
     */

    player.rolling =
        keys["ArrowDown"] &&
        player.grounded &&
        Math.abs(player.velocityX) > 1;


    /*
     * GRAVITY
     */

    player.velocityY += GRAVITY;


    /*
     * MOVE
     */

    player.x += player.velocityX;

    player.y += player.velocityY;


    /*
     * PLATFORM COLLISION
     */

    player.grounded = false;

    for (const platform of platforms) {

        if (

            player.x + player.width >
                platform.x &&

            player.x <
                platform.x + platform.width &&

            player.y + player.height >=
                platform.y &&

            player.y + player.height <=
                platform.y + 15 &&

            player.velocityY >= 0

        ) {

            player.y =
                platform.y -
                player.height;

            player.velocityY = 0;

            player.grounded = true;

        }

    }


    /*
     * FALLING OFF THE WORLD
     */

    if (player.y > GAME_HEIGHT + 100) {

        respawnPlayer();

    }


    /*
     * LEFT LIMIT
     */

    if (player.x < 0) {

        player.x = 0;

        player.velocityX = 0;

    }


    /*
     * ENERGY REGEN
     */

    if (!player.dashing) {

        player.energy += 0.08;

    }


    /*
     * OVERDRIVE
     */

    if (
        pressed("KeyE") &&
        player.energy >= 100
    ) {

        player.overdrive =
            !player.overdrive;

    }


    if (player.overdrive) {

        player.energy -= 0.25;

        if (player.energy <= 0) {

            player.energy = 0;

            player.overdrive = false;

        }

    }


    player.energy =
        Math.max(
            0,
            Math.min(
                player.maxEnergy,
                player.energy
            )
        );


    /*
     * INVINCIBILITY
     */

    if (player.invincibleTimer > 0) {

        player.invincibleTimer--;

    }

}


/* =========================================================
   RESPAWN
   ========================================================= */

function respawnPlayer() {

    player.x = 80;

    player.y = 100;

    player.velocityX = 0;

    player.velocityY = 0;

    player.energy = 100;

    player.overdrive = false;

    rings = 0;

}


/* =========================================================
   RINGS
   ========================================================= */

function updateRings() {

    for (const ring of ringObjects) {

        if (ring.collected)
            continue;


        const distanceX =
            player.x + player.width / 2 -
            ring.x;

        const distanceY =
            player.y + player.height / 2 -
            ring.y;


        const distance =
            Math.sqrt(
                distanceX * distanceX +
                distanceY * distanceY
            );


        if (distance < 18) {

            ring.collected = true;

            rings++;

            score += 100;

        }

    }

}


/* =========================================================
   ENERGY CORES
   ========================================================= */

function updateEnergyCores() {

    for (const core of energyCores) {

        if (core.collected)
            continue;


        const distanceX =
            player.x -
            core.x;

        const distanceY =
            player.y -
            core.y;


        const distance =
            Math.sqrt(
                distanceX * distanceX +
                distanceY * distanceY
            );


        if (distance < 25) {

            core.collected = true;

            player.energy += 25;

            score += 250;

        }

    }

}


/* =========================================================
   ENEMIES
   ========================================================= */

function updateEnemies() {

    for (const enemy of enemies) {

        if (!enemy.alive)
            continue;


        enemy.x += enemy.velocityX;


        /*
         * Simple patrol
         */

        if (
            enemy.x < 500 ||
            enemy.x > 1900
        ) {

            enemy.velocityX *= -1;

        }


        /*
         * Player collision
         */

        if (
            rectangleCollision(
                player,
                enemy
            )
        ) {

            /*
             * Jumping on enemy
             */

            if (
                player.velocityY > 0 &&
                player.y <
                    enemy.y
            ) {

                enemy.alive = false;

                player.velocityY =
                    -6;

                score += 500;

            }

            /*
             * Dash destroys enemy
             */

            else if (
                player.dashing ||
                player.overdrive
            ) {

                enemy.alive = false;

                score += 500;

            }

            /*
             * Normal collision
             */

            else {

                damagePlayer();

            }

        }

    }

}


/* =========================================================
   DAMAGE
   ========================================================= */

function damagePlayer() {

    if (
        player.invincibleTimer > 0
    )
        return;


    if (rings > 0) {

        rings = 0;

        player.invincibleTimer = 120;

        player.velocityY = -6;

        player.velocityX =
            -Math.sign(
                player.velocityX || 1
            ) * 4;

    }

    else {

        respawnPlayer();

    }

}


/* =========================================================
   CAMERA
   ========================================================= */

function updateCamera() {

    const targetCameraX =
        player.x -
        GAME_WIDTH * 0.35;


    cameraX +=
        (
            targetCameraX -
            cameraX
        ) * 0.1;


    cameraX =
        Math.max(
            0,
            Math.min(
                level.width -
                GAME_WIDTH,
                cameraX
            )
        );

}


/* =========================================================
   HUD
   ========================================================= */

function updateHUD() {

    const ringsText =
        document.getElementById("rings");

    const scoreText =
        document.getElementById("score");


    if (ringsText) {

        ringsText.textContent =
            rings;

    }


    if (scoreText) {

        scoreText.textContent =
            score;

    }

}


/* =========================================================
   DRAW BACKGROUND
   ========================================================= */

function drawBackground() {

    /*
     * SKY
     */

    ctx.fillStyle =
        "#172b50";

    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    /*
     * CLOUDS
     */

    ctx.fillStyle =
        "rgba(255,255,255,0.08)";


    for (
        let x = -cameraX * 0.15;
        x < GAME_WIDTH + 100;
        x += 130
    ) {

        ctx.fillRect(
            x,
            35,
            65,
            10
        );

        ctx.fillRect(
            x + 15,
            28,
            35,
            10
        );

    }


    /*
     * DISTANT HILLS
     */

    ctx.fillStyle =
        "#244477";


    for (
        let x = -cameraX * 0.25;
        x < GAME_WIDTH + 150;
        x += 180
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            170
        );

        ctx.lineTo(
            x + 90,
            110
        );

        ctx.lineTo(
            x + 180,
            170
        );

        ctx.fill();

    }

}


/* =========================================================
   DRAW LEVEL
   ========================================================= */

function drawLevel() {

    for (const platform of platforms) {

        /*
         * Grass
         */

        ctx.fillStyle =
            "#24a64a";

        ctx.fillRect(
            platform.x - cameraX,
            platform.y,
            platform.width,
            8
        );


        /*
         * Dirt
         */

        ctx.fillStyle =
            "#8b552d";

        ctx.fillRect(
            platform.x - cameraX,
            platform.y + 8,
            platform.width,
            platform.height - 8
        );


        /*
         * Checkered pattern
         */

        const tileSize = 16;

        for (
            let x = 0;
            x < platform.width;
            x += tileSize
        ) {

            for (
                let y = 8;
                y < platform.height;
                y += tileSize
            ) {

                if (
                    (
                        x / tileSize +
                        y / tileSize
                    ) % 2 === 0
                ) {

                    ctx.fillStyle =
                        "rgba(0,0,0,0.12)";

                    ctx.fillRect(
                        platform.x -
                            cameraX +
                            x,
                        platform.y + y,
                        tileSize,
                        tileSize
                    );

                }

            }

        }

    }

}


/* =========================================================
   DRAW RINGS
   ========================================================= */

function drawRings() {

    for (const ring of ringObjects) {

        if (ring.collected)
            continue;


        const x =
            ring.x -
            cameraX;


        if (
            x < -20 ||
            x > GAME_WIDTH + 20
        )
            continue;


        ctx.strokeStyle =
            "#ffd84a";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.arc(
            x,
            ring.y,
            7,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }

}


/* =========================================================
   DRAW ENERGY CORES
   ========================================================= */

function drawEnergyCores() {

    for (const core of energyCores) {

        if (core.collected)
            continue;


        const x =
            core.x -
            cameraX;


        ctx.fillStyle =
            "#36c8ff";


        ctx.beginPath();

        ctx.moveTo(
            x,
            core.y - 9
        );

        ctx.lineTo(
            x + 7,
            core.y
        );

        ctx.lineTo(
            x,
            core.y + 9
        );

        ctx.lineTo(
            x - 7,
            core.y
        );

        ctx.closePath();

        ctx.fill();

    }

}


/* =========================================================
   DRAW ENEMIES
   ========================================================= */

function drawEnemies() {

    for (const enemy of enemies) {

        if (!enemy.alive)
            continue;


        const x =
            enemy.x -
            cameraX;


        ctx.fillStyle =
            "#b83232";


        ctx.fillRect(
            x,
            enemy.y,
            enemy.width,
            enemy.height
        );


        ctx.fillStyle =
            "#ffffff";


        ctx.fillRect(
            x + 5,
            enemy.y + 7,
            5,
            5
        );


        ctx.fillRect(
            x + 14,
            enemy.y + 7,
            5,
            5
        );

    }

}


/* =========================================================
   DRAW METAL SONIC
   ========================================================= */

function drawPlayer() {

    const x =
        player.x -
        cameraX;

    const y =
        player.y;


    /*
     * Blink while damaged
     */

    if (
        player.invincibleTimer > 0 &&
        Math.floor(
            player.invincibleTimer / 6
        ) % 2 === 0
    ) {

        return;

    }


    /*
     * OVERDRIVE AURA
     */

    if (player.overdrive) {

        ctx.fillStyle =
            "rgba(0,180,255,0.25)";

        ctx.beginPath();

        ctx.arc(
            x + player.width / 2,
            y + player.height / 2,
            23,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    /*
     * DASH EFFECT
     */

    if (player.dashing) {

        ctx.fillStyle =
            "rgba(40,170,255,0.35)";

        ctx.fillRect(
            x - 20,
            y + 5,
            20,
            20
        );

    }


    /*
     * BODY
     */

    ctx.fillStyle =
        "#aeb8c4";

    ctx.fillRect(
        x,
        y,
        player.width,
        player.height
    );


    /*
     * HEAD
     */

    ctx.fillStyle =
        "#c5ced8";

    ctx.fillRect(
        x + 2,
        y,
        20,
        15
    );


    /*
     * VISOR
     */

    ctx.fillStyle =
        "#168cff";

    ctx.fillRect(
        x + 4,
        y + 6,
        16,
        5
    );


    /*
     * EYES
     */

    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        x + 7,
        y + 7,
        4,
        2
    );

    ctx.fillRect(
        x + 14,
        y + 7,
        4,
        2
    );


    /*
     * CHEST
     */

    ctx.fillStyle =
        "#394553";

    ctx.fillRect(
        x + 4,
        y + 17,
        16,
        11
    );


    /*
     * CHEST CORE
     */

    ctx.fillStyle =
        player.overdrive
            ? "#00e5ff"
            : "#168cff";

    ctx.fillRect(
        x + 9,
        y + 20,
        6,
        6
    );


    /*
     * LEGS
     */

    ctx.fillStyle =
        "#697684";

    ctx.fillRect(
        x + 3,
        y + 28,
        7,
        4
    );

    ctx.fillRect(
        x + 14,
        y + 28,
        7,
        4
    );

}


/* =========================================================
   ENERGY BAR
   ========================================================= */

function drawEnergyBar() {

    const x = 15;
    const y = 80;

    const width = 100;
    const height = 8;


    ctx.fillStyle =
        "#111";

    ctx.fillRect(
        x - 2,
        y - 2,
        width + 4,
        height + 4
    );


    ctx.fillStyle =
        "#168cff";

    ctx.fillRect(
        x,
        y,
        width *
        (
            player.energy /
            player.maxEnergy
        ),
        height
    );


    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "8px Arial";

    ctx.fillText(
        "ENERGY",
        x,
        y - 5
    );

}


/* =========================================================
   DRAW EVERYTHING
   ========================================================= */

function draw() {

    ctx.clearRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    drawBackground();


    ctx.save();

    drawLevel();

    drawRings();

    drawEnergyCores();

    drawEnemies();

    drawPlayer();

    ctx.restore();


    if (gameStarted) {

        drawEnergyBar();

    }

}


/* =========================================================
   GAME LOOP
   ========================================================= */

function gameLoop() {

    updatePlayer();

    updateRings();

    updateEnergyCores();

    updateEnemies();

    updateCamera();

    updateHUD();

    draw();


    /*
     * Remember keyboard state
     */

    for (const key in keys) {

        previousKeys[key] =
            keys[key];

    }


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   INITIALIZE
   ========================================================= */

draw();
