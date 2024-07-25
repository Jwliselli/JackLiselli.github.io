document.addEventListener('DOMContentLoaded', function() {
    // Define the selectCharacter function here
    function selectCharacter(characterClass) {
        selectedCharacter = characterClass;
        document.querySelectorAll('.character').forEach(el => el.classList.remove('selected'));
        document.querySelector('.' + characterClass).classList.add('selected');
        if (startGameBtn) startGameBtn.style.display = "block";
    }

    // Game variables
    var score = 0;
    var highScore = localStorage.getItem('highScore') || 0;
    var gameRunning = false;
    var gamePaused = false;
    var asteroids = [];
    var powerUps = [];
    var player;
    var gameInterval;
    var selectedCharacter = null;

    // DOM elements
    var startGameBtn = document.getElementById("startGameBtn");
    var gameArea = document.getElementById("gameArea");
    var gameMessage = document.getElementById("gameMessage");
    var playAgainBtn = document.getElementById("playAgainBtn");
    var scoreDisplay = document.getElementById("score");
    var highScoreDisplay = document.getElementById("highScore");
    var canvas = document.getElementById("gameCanvas");
    var gameOverContainer = document.getElementById("gameOverContainer");
    var backToHomeBtn = document.getElementById("backToHomeBtn");
    var ctx = canvas.getContext('2d');

    // Create shooting stars dynamically
    function createShootingStars() {
        const shootingStarsContainer = document.querySelector('.shooting-stars');
        shootingStarsContainer.innerHTML = ''; // Clear existing stars
        for (let i = 0; i < 10; i++) {
            const shootingStar = document.createElement('div');
            shootingStar.className = 'shooting-star';
            shootingStar.style.top = `${Math.random() * 100}%`;
            shootingStar.style.left = `${Math.random() * 100}%`;
            shootingStar.style.animationDuration = `${2 + Math.random() * 3}s`;
            shootingStar.style.animationDelay = `${Math.random() * 5}s`;
            shootingStarsContainer.appendChild(shootingStar);
        }
    }

    // Player object
    function Player(characterClass) {
        this.width = 50;
        this.height = 50;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 10;
        this.speed = 0;
        this.maxSpeed = 7;
        this.acceleration = 0.2;
        this.friction = 0.1;
        this.direction = 0;
        this.characterClass = characterClass;

        // Get the exact background color of the selected character
        var characterElement = document.querySelector('.' + this.characterClass);
        var computedStyle = window.getComputedStyle(characterElement);
        var backgroundColor = computedStyle.backgroundColor;

        this.draw = function() {
            ctx.fillStyle = backgroundColor;
            ctx.shadowBlur = 20;
            ctx.shadowColor = backgroundColor;

            switch (this.characterClass) {
                case 'char1':
                    ctx.beginPath();
                    ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'char2':
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                    break;
                case 'char3':
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.width / 2, this.y);
                    ctx.lineTo(this.x + this.width, this.y + this.height);
                    ctx.lineTo(this.x, this.y + this.height);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'char4':
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.width / 4, this.y);
                    ctx.lineTo(this.x + 3 * this.width / 4, this.y);
                    ctx.lineTo(this.x + this.width, this.y + this.height / 2);
                    ctx.lineTo(this.x + 3 * this.width / 4, this.y + this.height);
                    ctx.lineTo(this.x + this.width / 4, this.y + this.height);
                    ctx.lineTo(this.x, this.y + this.height / 2);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'char5':
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.width / 2, this.y);
                    ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.height, this.width / 4);
                    ctx.arcTo(this.x + this.width, this.y + this.height, this.x, this.y + this.height, this.width / 4);
                    ctx.arcTo(this.x, this.y + this.height, this.x, this.y, this.width / 4);
                    ctx.arcTo(this.x, this.y, this.x + this.width, this.y, this.width / 4);
                    ctx.closePath();
                    ctx.fill();
                    break;
            }

            ctx.shadowBlur = 0;
        }

        this.update = function() {
            if (this.direction !== 0) {
                this.speed += this.direction * this.acceleration;
                if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
                if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;
            } else {
                if (this.speed > 0) {
                    this.speed -= this.friction;
                    if (this.speed < 0) this.speed = 0;
                }
                if (this.speed < 0) {
                    this.speed += this.friction;
                    if (this.speed > 0) this.speed = 0;
                }
            }
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
        }
    }

    // Asteroid object
    function Asteroid(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;

        this.draw = function() {
            ctx.fillStyle = "#8B4513";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#8B4513";
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                let angle = 2 * Math.PI / 6 * i;
                let xOffset = this.size * Math.cos(angle);
                let yOffset = this.size * Math.sin(angle);
                if (i === 0) {
                    ctx.moveTo(this.x + xOffset, this.y + yOffset);
                } else {
                    ctx.lineTo(this.x + xOffset, this.y + yOffset);
                }
            }
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "#654321";
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        this.update = function() {
            this.y += this.speed;
            if (this.y > canvas.height) {
                this.y = -this.size;
                this.x = Math.random() * canvas.width;
            }
        }
    }

    // Power-up object
    function PowerUp(x, y, type) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.type = type;
        this.speed = 2;

        this.draw = function() {
            ctx.fillStyle = "rgba(255, 215, 0, 0.8)";
            ctx.shadowBlur = 20;
            ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.size);
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(this.x + this.size * Math.cos((18 + i * 72) * Math.PI / 180), 
                           this.y - this.size * Math.sin((18 + i * 72) * Math.PI / 180));
                ctx.lineTo(this.x + this.size / 2 * Math.cos((54 + i * 72) * Math.PI / 180), 
                           this.y - this.size / 2 * Math.sin((54 + i * 72) * Math.PI / 180));
            }
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "#FFEC8B";
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        this.update = function() {
            this.y += this.speed;
            if (this.y > canvas.height) {
                this.y = -this.size;
                this.x = Math.random() * canvas.width;
            }
        }

        this.applyEffect = function(player) {
            if (this.type === 'speed') {
                player.maxSpeed += 2;
            }
        }
    }

    function startGame() {
        if (!selectedCharacter) {
            alert("Please select a character to start the game.");
            return;
        }
        score = 0;
        if (startGameBtn) startGameBtn.style.display = "none";
        if (gameArea) gameArea.style.display = "block";
        if (gameOverContainer) gameOverContainer.style.display = "none";
        gameRunning = true;
        gamePaused = false;
        player = new Player(selectedCharacter);
        asteroids = [];
        powerUps = [];
        spawnAsteroids();
        gameInterval = setInterval(updateGame, 1000 / 60);
    }

    function spawnAsteroids() {
        for (var i = 0; i < 5 + Math.floor(score / 100); i++) {
            asteroids.push(new Asteroid(Math.random() * canvas.width, Math.random() * -canvas.height, 20, 2 + Math.random() * 3));
        }
    }

    function updateGame() {
        if (gameRunning && !gamePaused) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            player.update();
            player.draw();
            asteroids.forEach(function(asteroid) {
                asteroid.update();
                asteroid.draw();
                if (checkCollision(player, asteroid)) {
                    endGame(false);
                }
            });
            // Draw and update power-ups
            if (Math.random() < 0.01) {
                var powerUp = new PowerUp(Math.random() * canvas.width, Math.random() * -canvas.height, 'speed');
                powerUps.push(powerUp);
            }
            powerUps.forEach(function(powerUp, index) {
                powerUp.update();
                powerUp.draw();
                if (checkCollision(player, powerUp)) {
                    powerUp.applyEffect(player);
                    powerUps.splice(index, 1); // Remove power-up after collection
                }
            });
            score++;
            scoreDisplay.innerText = score;

            // Increase difficulty by adding more asteroids
            if (score % 1000 === 0) {
                spawnAsteroids();
            }
        }
    }

    function checkCollision(player, obj) {
        var distX = Math.abs(obj.x - player.x - player.width / 2);
        var distY = Math.abs(obj.y - player.y - player.height / 2);
        if (distX > (player.width / 2 + obj.size)) return false;
        if (distY > (player.height / 2 + obj.size)) return false;
        if (distX <= (player.width / 2)) return true;
        if (distY <= (player.height / 2)) return true;
        var dx = distX - player.width / 2;
        var dy = distY - player.height / 2;
        return (dx * dx + dy * dy <= (obj.size * obj.size));
    }

    function endGame(success) {
        gameRunning = false;
        clearInterval(gameInterval);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        gameMessage.innerHTML = `Game Over! You scored ${score} points.<br>High Score: ${highScore}`;
        if (playAgainBtn) playAgainBtn.style.display = "block";
        if (gameOverContainer) gameOverContainer.style.display = "block";
    }

    function togglePause() {
        if (gameRunning) {
            gamePaused = !gamePaused;
            gameMessage.innerText = gamePaused ? "Game Paused" : "";
        }
    }

    if (startGameBtn) {
        startGameBtn.onclick = function() {
            console.log("Start Game button clicked");
            startGame();
        }
    }

    if (playAgainBtn) {
        playAgainBtn.onclick = function() {
            score = 0;
            scoreDisplay.innerText = score;
            if (playAgainBtn) playAgainBtn.style.display = "none";
            if (startGameBtn) startGameBtn.style.display = "block";
            if (gameArea) gameArea.style.display = "none";
            if (gameOverContainer) gameOverContainer.style.display = "none";
            startGame();
        }
    }

    if (backToHomeBtn) {
        backToHomeBtn.onclick = function() {
            console.log("Back to Home button clicked");
            window.location.href = 'index.html';
        }
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') player.direction = -1;
        if (e.key === 'ArrowRight') player.direction = 1;
        if (e.key === 'Escape') togglePause();
    });

    document.addEventListener('keyup', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.direction = 0;
    });

    // Initialize the shooting stars
    createShootingStars();
});
