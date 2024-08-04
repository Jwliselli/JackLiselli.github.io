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
document.querySelectorAll('header a, .dropdown-content a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
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

// Hide/Show Header on Scroll
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        header.classList.add('hide');
    } else {
        header.classList.remove('hide');
    }
    if (scrollTop > 0) {
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }
    lastScrollTop = scrollTop;
});

// Toggle theme between normal mode and party mode
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('party-mode');
    localStorage.setItem('theme', body.classList.contains('party-mode') ? 'party' : 'normal');
}

// Load saved theme preference
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'party') {
        document.body.classList.add('party-mode');
    }
});

// Enhanced Form Validation
const form = document.getElementById('request-form');
if (form) {
    form.addEventListener('submit', (event) => {
        const emailField = form.querySelector('input[type="email"]');
        if (!emailField.value.includes('@')) {
            alert('Please enter a valid email address');
            event.preventDefault();
        }
    });
}

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img.lazy');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));
});

// Responsive Dropdown Menu
const dropbtn = document.querySelector('.dropbtn');
const dropdownContent = document.querySelector('.dropdown-content');

dropbtn.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click from propagating
    dropdownContent.classList.toggle('show');
});

// Double click to close dropdown
dropbtn.addEventListener('dblclick', (event) => {
    dropdownContent.classList.remove('show');
});

// Close dropdown if clicked outside
window.addEventListener('click', function(event) {
    if (!event.target.matches('.dropbtn')) {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    }
});
