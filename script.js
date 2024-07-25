let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; dots && i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    if (dots) {
        dots[slideIndex - 1].className += " active";
    }
}

// Automatic slideshow rotation every 4 seconds
setInterval(function() {
    plusSlides(1);
}, 4000);

// Show/Hide Scroll-to-top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.scrollY > 200) {
        scrollButton.style.display = 'block';
    } else {
        scrollButton.style.display = 'none';
    }
});

// Scroll to the top function
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Smooth scrolling for navigation links
document.querySelectorAll('header a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            const headerOffset = document.querySelector('header').offsetHeight;
            const extraOffset = 20; // Additional offset to ensure visibility
            const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset - extraOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Create stars, asteroids, and shooting stars
function createSpaceElements() {
    const starCount = 500;
    const shootingStarCount = 10;
    const asteroidCount = 30;
    const particleCount = 100;

    // Create stationary stars
    for (let i = 0; i < starCount; i++) {
        createStar();
    }

    // Create shooting stars
    for (let i = 0; i < shootingStarCount; i++) {
        createShootingStar();
    }

    // Create asteroids
    for (let i = 0; i < asteroidCount; i++) {
        createAsteroid();
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    // Create galaxy layers
    createGalaxyLayers();
}

function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.animationDuration = `${Math.random() * 5 + 5}s`;
    document.body.appendChild(star);
}

function createShootingStar() {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    shootingStar.style.left = `${Math.random() * 100}vw`;
    shootingStar.style.top = `${Math.random() * 100}vh`;
    shootingStar.style.animationDelay = `${Math.random() * 20}s`;
    document.body.appendChild(shootingStar);
}

function createAsteroid() {
    const asteroid = document.createElement('div');
    asteroid.className = 'asteroid';
    asteroid.style.left = `${Math.random() * 100}vw`;
    asteroid.style.top = `${Math.random() * 100}vh`;
    asteroid.style.animationDuration = `${Math.random() * 50 + 50}s`;
    document.body.appendChild(asteroid);
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;
    particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
    particle.style.animationName = 'particleAnimation';
    document.body.appendChild(particle);
}

function createGalaxyLayers() {
    const galaxyContainer = document.querySelector('.galaxy-container');
    for (let i = 0; i < 3; i++) {
        const galaxyLayer = document.createElement('div');
        galaxyLayer.className = 'galaxy-layer';
        const galaxy = document.createElement('div');
        galaxy.className = 'galaxy';
        galaxyLayer.appendChild(galaxy);
        galaxyContainer.appendChild(galaxyLayer);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    createSpaceElements();

    const form = document.getElementById('request-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            alert('Your project request has been submitted!');
            form.reset();
        });
    }
});

// Modal functionality
document.addEventListener('DOMContentLoaded', () => {
    var modal = document.getElementById("myModal");
    var btn = document.getElementById("modalBtn");
    var span = document.getElementsByClassName("close")[0];

    if (btn) {
        btn.onclick = function() {
            modal.style.display = "block";
        }

        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
});
