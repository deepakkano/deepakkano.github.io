// script.js
const toggleBtn = document.querySelector('.toggle');
const menuNav = document.querySelector('.menu');

toggleBtn.addEventListener('click', function() {
  console.log('Toggle button clicked');
  menuNav.classList.toggle('active');
});
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader-container');
  loader.style.display = 'none';
});


document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('constellation');
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    init();
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.density = (Math.random() * 30) + 1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouse.radius) {
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let force = (mouse.radius - distance) / mouse.radius;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        
        this.x -= directionX;
        this.y -= directionY;
      }
    }

    draw() {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    let numberOfParticles = (width * height) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    connect();

    requestAnimationFrame(animate);
  }

  function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
          + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
        if (distance < (width/7) * (height/7)) {
          opacityValue = 1 - (distance/20000);
          ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function addEventListeners() {
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', function(event) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    });

    document.addEventListener('mouseout', function() {
      mouse.x = undefined;
      mouse.y = undefined;
    });

    document.addEventListener('touchmove', function(event) {
      if (event.touches.length > 0) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
      }
    }, { passive: true });

    document.addEventListener('touchend', function() {
      mouse.x = undefined;
      mouse.y = undefined;
    });
  }

  resize();
  addEventListeners();
  animate();
});



document.addEventListener('DOMContentLoaded', function() {
  const sliderContainer = document.querySelector('.slider-container');
  const slides = document.querySelectorAll('.slide');

  let currentIndex = 0;

  function updateSlider() {
      slides.forEach((slide, index) => {
          if (index === currentIndex) {
              slide.classList.add('active');
          } else {
              slide.classList.remove('active');
          }
      });
      sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  function showNextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
  }

  function startAutoSlide() {
      setInterval(showNextSlide, 5000); // Change slide every 5 seconds
  }

  // Touch support for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
  });

  sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
          showNextSlide();
      } else if (touchEndX - touchStartX > 50) {
          currentIndex = (currentIndex - 1 + slides.length) % slides.length;
          updateSlider();
      }
  });

  // Initialize the slider
  updateSlider();
  // Start automatic sliding
  startAutoSlide();
});
