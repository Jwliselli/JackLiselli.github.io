const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
let glowFactor = 0;
let glowDirection = 1;
let ledFlicker = 0;
let ledFlickerDirection = 1;

const microcontroller = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 100,
    height: 100,
};

const wires = [];
const components = [];
const leds = [];
const balls = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    microcontroller.x = canvas.width / 2;
    microcontroller.y = canvas.height / 2;
    generateCircuit();
}

function generateCircuit() {
    wires.length = 0;
    components.length = 0;
    leds.length = 0;

    // Generate wires
    const numWires = 50; // Increased number of wires
    const wireLength = 500;
    for (let i = 0; i < numWires; i++) {
        const angle = (i / numWires) * 2 * Math.PI;
        const startX = microcontroller.x + microcontroller.width / 2 * Math.cos(angle);
        const startY = microcontroller.y + microcontroller.height / 2 * Math.sin(angle);
        const endX = startX + wireLength * Math.cos(angle);
        const endY = startY + wireLength * Math.sin(angle);

        wires.push({ startX, startY, endX, endY, angle });

        // Add components to wires
        const numComponents = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numComponents; j++) {
            const compX = startX + (endX - startX) * (j + 1) / (numComponents + 1);
            const compY = startY + (endY - startY) * (j + 1) / (numComponents + 1);
            const type = Math.random() < 0.33 ? 'resistor' : (Math.random() < 0.5 ? 'capacitor' : 'inductor');
            components.push({ x: compX, y: compY, type });
        }

        // Add LEDs to some wires
        if (Math.random() < 0.3) {
            const ledX = startX + (endX - startX) / 2;
            const ledY = startY + (endY - startY) / 2;
            leds.push({ x: ledX, y: ledY });
        }
    }

    // Generate balls for animation
    balls.length = 0;
    for (let i = 0; i < numWires; i++) {
        const wire = wires[i];
        const ball = {
            x: wire.startX,
            y: wire.startY,
            progress: 0,
            speed: Math.random() * 0.02 + 0.01,
        };
        balls.push(ball);
    }
}

function drawCircuitBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background color
    ctx.fillStyle = '#001f3f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const lineColor = 'rgba(0, 255, 255, 0.8)';
    const resistorColor = '#DAA520';
    const capacitorColor = '#0000FF';
    const inductorColor = '#32CD32';
    const ledColor = `rgba(255, 165, 0, ${0.5 + ledFlicker * 0.5})`; // Flickering LED color
    const lineWidth = 2;

    function drawPath(startX, startY, endX, endY, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    function drawComponent(x, y, type) {
        ctx.beginPath();
        switch (type) {
            case 'resistor':
                ctx.fillStyle = resistorColor;
                ctx.fillRect(x - 10, y - 5, 20, 10);
                break;
            case 'capacitor':
                ctx.strokeStyle = capacitorColor;
                ctx.lineWidth = 4;
                ctx.moveTo(x - 10, y);
                ctx.lineTo(x + 10, y);
                break;
            case 'inductor':
                ctx.strokeStyle = inductorColor;
                ctx.lineWidth = 2;
                ctx.arc(x, y, 10, 0, Math.PI);
                break;
        }
        ctx.stroke();
    }

    function drawMicrocontroller(x, y, width, height) {
        ctx.fillStyle = '#333';
        ctx.fillRect(x, y, width, height);
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);
    }

    function drawGlow(x, y, color) {
        ctx.beginPath();
        ctx.arc(x, y, 3 + glowFactor, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.shadowBlur = 10 + glowFactor;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // Draw microcontroller
    drawMicrocontroller(microcontroller.x - microcontroller.width / 2, microcontroller.y - microcontroller.height / 2, microcontroller.width, microcontroller.height);

    // Draw wires
    wires.forEach(wire => {
        drawPath(wire.startX, wire.startY, wire.endX, wire.endY, lineColor);
    });

    // Draw components
    components.forEach(comp => drawComponent(comp.x, comp.y, comp.type));

    // Draw LEDs
    leds.forEach(led => drawGlow(led.x, led.y, ledColor));

    // Animate balls
    balls.forEach(ball => {
        ball.progress += ball.speed;
        if (ball.progress > 1) {
            ball.progress = 0;
        }
        const wire = wires[balls.indexOf(ball)];
        ball.x = wire.startX + (wire.endX - wire.startX) * ball.progress;
        ball.y = wire.startY + (wire.endY - wire.startY) * ball.progress;
        drawGlow(ball.x, ball.y, 'rgba(0, 255, 255, 1)');
    });
}

function animate() {
    glowFactor += glowDirection;
    if (glowFactor > 10 || glowFactor < 0) {
        glowDirection *= -1;
    }

    ledFlicker += ledFlickerDirection * 0.05;
    if (ledFlicker > 1 || ledFlicker < 0) {
        ledFlickerDirection *= -1;
    }

    drawCircuitBoard();
    requestAnimationFrame(animate);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
generateCircuit();
animate();
