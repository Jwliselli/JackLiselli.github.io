document.addEventListener('DOMContentLoaded', () => {
    let selectedCharacter = null;
    const scoreDisplay = document.getElementById("score");
    const highScoreDisplay = document.getElementById("highScore");
    const levelDisplay = document.getElementById("level");
    const startGameBtn = document.getElementById("startGameBtn");
    const gameArea = document.getElementById("gameArea");
    const gameMessage = document.getElementById("gameMessage");
    const playAgainBtn = document.getElementById("playAgainBtn");
    const canvas = document.getElementById("gameCanvas");
    const gameOverContainer = document.getElementById("gameOverContainer");
    const backToHomeBtn = document.getElementById("backToHomeBtn");
    const ctx = canvas.getContext('2d');

    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let gameRunning = false;
    let gamePaused = false;
    let level = 1;
    let asteroids = [];
    let powerUps = [];
    let player;
    let gameInterval;

    highScoreDisplay.innerText = highScore;

    // Define the function globally so it can be accessed by HTML onclick handlers
    window.selectCharacter = function(characterClass) {
        selectedCharacter = characterClass;
        document.querySelectorAll('.character').forEach(el => el.classList.remove('selected'));
        document.querySelector(`.${characterClass}`).classList.add('selected');
        if (startGameBtn) startGameBtn.style.display = "block";
    };

    function createShootingStars() {
        const shootingStarsContainer = document.querySelector('.shooting-stars');
        shootingStarsContainer.innerHTML = '';
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

        const characterElement = document.querySelector(`.${this.characterClass}`);
        const computedStyle = window.getComputedStyle(characterElement);
        const backgroundColor = computedStyle.backgroundColor;

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
                const angle = 2 * Math.PI / 6 * i;
                const xOffset = this.size * Math.cos(angle);
                const yOffset = this.size * Math.sin(angle);
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
        level = 1;
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
        for (let i = 0; i < 5 + level; i++) {
            const size = 20 + Math.random() * 20;
            const speed = 2 + Math.random() * level;
            asteroids.push(new Asteroid(Math.random() * canvas.width, Math.random() * -canvas.height, size, speed));
        }
    }

    function updateGame() {
        if (gameRunning && !gamePaused) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            player.update();
            player.draw();
            asteroids.forEach((asteroid, index) => {
                asteroid.update();
                asteroid.draw();
                if (checkCollision(player, asteroid)) {
                    endGame(false);
                }
                if (asteroid.y > canvas.height) {
                    asteroids.splice(index, 1);
                    score += 10; // Points for dodging an asteroid
                }
            });
            if (Math.random() < 0.01) {
                const powerUp = new PowerUp(Math.random() * canvas.width, Math.random() * -canvas.height, 'speed');
                powerUps.push(powerUp);
            }
            powerUps.forEach((powerUp, index) => {
                powerUp.update();
                powerUp.draw();
                if (checkCollision(player, powerUp)) {
                    powerUp.applyEffect(player);
                    powerUps.splice(index, 1);
                }
            });
            score++;
            scoreDisplay.innerText = score;

            // Level up logic
            if (score % 1000 === 0) {
                level++;
                levelDisplay.innerText = level;
                spawnAsteroids();
            }
        }
    }

    function checkCollision(player, obj) {
        const distX = Math.abs(obj.x - player.x - player.width / 2);
        const distY = Math.abs(obj.y - player.y - player.height / 2);
        if (distX > (player.width / 2 + obj.size)) return false;
        if (distY > (player.height / 2 + obj.size)) return false;
        if (distX <= (player.width / 2)) return true;
        if (distY <= (player.height / 2)) return true;
        const dx = distX - player.width / 2;
        const dy = distY - player.height / 2;
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
        startGameBtn.onclick = () => {
            console.log("Start Game button clicked");
            startGame();
        }
    }

    if (playAgainBtn) {
        playAgainBtn.onclick = () => {
            score = 0;
            level = 1;
            scoreDisplay.innerText = score;
            levelDisplay.innerText = level;
            if (playAgainBtn) playAgainBtn.style.display = "none";
            if (startGameBtn) startGameBtn.style.display = "block";
            if (gameArea) gameArea.style.display = "none";
            if (gameOverContainer) gameOverContainer.style.display = "none";
            startGame();
        }
    }

    if (backToHomeBtn) {
        backToHomeBtn.onclick = () => {
            console.log("Back to Home button clicked");
            window.location.href = 'galactic-defender.index'; // Ensure this is the correct path to your home page
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') player.direction = -1;
        if (e.key === 'ArrowRight') player.direction = 1;
        if (e.key === 'Escape') togglePause();
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.direction = 0;
    });

    createShootingStars();
});
