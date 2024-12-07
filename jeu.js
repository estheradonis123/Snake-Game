// Variables de jeu
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let snake = [{x: 150, y: 150}]; // Le serpent
let direction = 'right';
let food = {x: 200, y: 200}; // Position de la pomme
let obstacles = []; // Liste des couleuvres
let score = 0;
let gameInterval = 100; // Temps de mise à jour (vitesse du jeu)
let gameOver = false;

// Fonction pour dessiner le serpent
function drawSnake() {
    ctx.fillStyle = 'pink'; // Couleur du serpent
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, 10, 10);
    });
}

// Fonction pour dessiner la pomme
function drawFood() {
    ctx.fillStyle = 'green'; // Couleur de la pomme
    ctx.fillRect(food.x, food.y, 10, 10);
}

// Fonction pour dessiner les couleuvres
function drawObstacles() {
    ctx.fillStyle = 'brown'; // Couleur des obstacles
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, 10, 10);
    });
}

// Fonction pour dessiner le score
function drawScore() {
    document.getElementById('score').textContent = score;
}

// Fonction pour déplacer le serpent
function moveSnake() {
    let head = Object.assign({}, snake[0]); // Copie de la tête du serpent
    
    // Déplacement du serpent
    if (direction === 'right') head.x += 10;
    if (direction === 'left') head.x -= 10;
    if (direction === 'up') head.y -= 10;
    if (direction === 'down') head.y += 10;
    
    snake.unshift(head); // Ajoute la nouvelle tête en tête du serpent
    
    // Si le serpent mange une pomme
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop(); // Enlève la queue du serpent si aucune pomme n'est mangée
    }

    // Vérification des collisions
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkCollision(head) || checkCollisionWithObstacles(head)) {
        gameOver = true;
    }
}

// Fonction pour vérifier les collisions avec le corps du serpent
function checkCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

// Fonction pour vérifier les collisions avec les obstacles (couleuvres)
function checkCollisionWithObstacles(head) {
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].x === head.x && obstacles[i].y === head.y) {
            return true;
        }
    }
    return false;
}

// Fonction pour générer une nouvelle pomme
function generateFood() {
    let x = Math.floor(Math.random() * (canvas.width / 10)) * 10;
    let y = Math.floor(Math.random() * (canvas.height / 10)) * 10;
    food = {x: x, y: y};
}

// Fonction pour générer des obstacles (couleuvres)
function generateObstacles() {
    let numObstacles = 3; // Nombre de couleuvres à générer
    obstacles = []; // Réinitialise la liste des obstacles
    for (let i = 0; i < numObstacles; i++) {
        let x = Math.floor(Math.random() * (canvas.width / 10)) * 10;
        let y = Math.floor(Math.random() * (canvas.height / 10)) * 10;
        // S'assurer que l'obstacle ne se place pas sur le serpent ou la pomme
        while (isOccupied(x, y)) {
            x = Math.floor(Math.random() * (canvas.width / 10)) * 10;
            y = Math.floor(Math.random() * (canvas.height / 10)) * 10;
        }
        obstacles.push({x: x, y: y});
    }
}

// Fonction pour vérifier si une position est déjà occupée (par le serpent ou la pomme)
function isOccupied(x, y) {
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === x && snake[i].y === y) return true;
    }
    if (food.x === x && food.y === y) return true;
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].x === x && obstacles[i].y === y) return true;
    }
    return false;
}

// Fonction pour gérer les touches du clavier
document.addEventListener('keydown', function(event) {
    if (gameOver) return;
    
    if (event.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (event.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (event.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (event.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

// Fonction pour mettre à jour le jeu
function updateGame() {
    if (gameOver) {
        alert('Game Over! Votre score est ' + score);
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas
    drawSnake(); // Dessine le serpent
    drawFood(); // Dessine la pomme
    drawObstacles(); // Dessine les obstacles
    drawScore(); // Affiche le score
    moveSnake(); // Déplace le serpent
}

// Fonction pour redémarrer le jeu
function restartGame() {
    snake = [{x: 150, y: 150}];
    direction = 'right';
    score = 0;
    gameOver = false;
    generateObstacles(); // Génère des obstacles au redémarrage
    clearInterval(gameIntervalID);
    gameInterval = document.getElementById('speed').value;
    gameIntervalID = setInterval(updateGame, gameInterval);
}

// Mise à jour de la vitesse du jeu
document.getElementById('speed').addEventListener('change', function() {
    gameInterval = parseInt(this.value);
    clearInterval(gameIntervalID);
    gameIntervalID = setInterval(updateGame, gameInterval);
});

// Initialisation du jeu
let gameIntervalID = setInterval(updateGame, gameInterval);
generateObstacles(); // Génère les obstacles au départ

// Bouton de redémarrage
document.getElementById('restartBtn').addEventListener('click', restartGame);