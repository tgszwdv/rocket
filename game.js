// game.js

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const successMessage = document.getElementById("successMessage");
const blockCounter = document.getElementById("blockCounter");

const rocket = {
    x: canvas.width - 330,
    y: canvas.height - 130,
    width: 100,
    height: 60,
    speedX: 0,
    speedY: 5,
    thrust: 0.0,
    velocity: 0,
    angle: 0,
    sprite: new Image(),
};

const platform = {
    x: canvas.width - 335,
    y: canvas.height - 70,
    width: 100,
    height: 20,
    sprite: new Image(),
};

const background = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    sprite: new Image(),
};

const blocks = [];
let blocksCollected = 0; // Contador de blocos coletados

const GRAVITY = 0.05;

rocket.sprite.src = 'images/rocket_sprite.png';
platform.sprite.src = 'images/platform_sprite.png';
background.sprite.src = 'images/background_sprite.png';

// Carregue a imagem para a sprite do bloco
const blockSprite = new Image();
blockSprite.src = 'images/block_sprite.png';

function generateRandomBlock() {
    const block = {
        x: Math.random() * (canvas.width - 25),
        y: Math.random() * (canvas.height / 2 - 25),
        width: 25,
        height: 25,
        sprite: blockSprite,
    };
    blocks.push(block);
}

function updateBlockCounter() {
    blockCounter.textContent = `Blocos Coletados: ${blocksCollected}`;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(background.sprite, background.x, background.y, background.width, background.height);

    blocks.forEach((block) => {
        ctx.drawImage(block.sprite, block.x, block.y, block.width, block.height);
    });

    rocket.velocity += rocket.thrust;
    rocket.velocity -= GRAVITY;

    rocket.y -= rocket.velocity;

    rocket.x -= rocket.speedX * 0.5;

    rocket.x = Math.max(rocket.x, 0);
    rocket.x = Math.min(rocket.x, canvas.width - rocket.width);

    rocket.y = Math.max(rocket.y, 0);
    rocket.y = Math.min(rocket.y, canvas.height - rocket.height);

    ctx.drawImage(platform.sprite, platform.x, platform.y, platform.width, platform.height);

    ctx.translate(rocket.x + rocket.width / 2, rocket.y + rocket.height / 2);

    rocket.angle = Math.atan2(-rocket.speedX, rocket.speedY);

    ctx.rotate(rocket.angle);

    ctx.drawImage(rocket.sprite, -rocket.width / 2, -rocket.height / 2, rocket.width, rocket.height);

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (
        rocket.x + rocket.width > platform.x &&
        rocket.x < platform.x + platform.width &&
        rocket.y + rocket.height > platform.y &&
        rocket.y < platform.y + platform.height
    ) {
        displaySuccessMessage('Pousou com sucesso!');
        resetRocket();
    }
  else{
    displaySuccessMessage('Missão: Colete 8 Estrelas');
  }

    blocks.forEach((block, index) => {
        if (
            rocket.x + rocket.width > block.x &&
            rocket.x < block.x + block.width &&
            rocket.y + rocket.height > block.y &&
            rocket.y < block.y + block.height
        ) {
            blocks.splice(index, 1);
            generateRandomBlock();
            blocksCollected++; // Incrementa o contador quando um bloco é coletado
            updateBlockCounter(); // Atualiza o contador na tela
        }
    });

    requestAnimationFrame(update);
}

function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowUp':
            rocket.thrust = 0.15;
            break;
        case 'ArrowDown':
            rocket.thrust = -0.06;
            break;
        case 'ArrowLeft':
            rocket.thrust = 0.01;
            rocket.speedX = 5;
            break;
        case 'ArrowRight':
           rocket.thrust = 0.01;
            rocket.speedX = -5;
            break;
    }
}

function handleKeyRelease(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        rocket.thrust = 0;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        rocket.speedX = 0;
    }
}

function displaySuccessMessage(message) {
    successMessage.textContent = message;
}

function resetRocket() {
    rocket.x = canvas.width - 335;
    rocket.y = canvas.height - 130;
    rocket.velocity = 0;
}

for (let i = 0; i < 3; i++) {
    generateRandomBlock();
}

window.addEventListener('keydown', handleKeyPress);
window.addEventListener('keyup', handleKeyRelease);


const timerElement = document.getElementById("timer");
let secondsRemaining = 20; // Defina o tempo desejado em segundos

function updateTimer() {
timerElement.textContent = `Tempo Restante: ${secondsRemaining}s`;

if (secondsRemaining > 0) {
    secondsRemaining--;
} else {
    clearInterval(timerInterval);

    if (blocksCollected < 3) {
        timerElement.textContent = "Tempo Expirado! Game Over!";
        displayGameOverMessage();
        // Add any additional logic for game over here
    } else {
        timerElement.textContent = "Missao Completa!";
        // Add any additional logic for winning the game here
    }
}
}

// Chame a função a cada segundo
const timerInterval = setInterval(updateTimer, 1000);

update();
