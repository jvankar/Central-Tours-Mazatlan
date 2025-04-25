// ===== MENÚ MÓVIL =====
const menuBtn = document.getElementById("menu-button");
const navLinks = document.getElementById("nav-links");

function setupMenu() {
    if (!menuBtn || !navLinks) return;
    
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        menuBtn.classList.toggle("active");
    });

    navLinks.addEventListener("click", (e) => {
        if (e.target.tagName === 'A') {
            navLinks.classList.remove("open");
            menuBtn.classList.remove("active");
        }
    });
}

const searchButtonMobile = document.getElementById('search-button-mobile');
const searchInputMobile = document.getElementById('search-input-mobile');
const searchFormMobile = document.getElementById('search-form-mobile');

// Toggle search input
searchButtonMobile.addEventListener('click', (e) => {
  e.stopPropagation();
  const isActive = searchInputMobile.classList.toggle('active');
  
  if (isActive) {
    searchInputMobile.focus();
    document.documentElement.style.overflowY = 'hidden'; // Prevent background scroll
  } else {
    document.documentElement.style.overflowY = ''; // Restore scroll
  }
});

// Close search when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('#search-mobile')) {
    searchInputMobile.classList.remove('active');
    document.documentElement.style.overflowY = '';
  }
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && searchInputMobile.classList.contains('active')) {
    searchInputMobile.classList.remove('active');
    document.documentElement.style.overflowY = '';
  }
});

// Handle form submission
searchFormMobile.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = searchInputMobile.value.trim();
  if (searchTerm) {
    // Add your search logic here
    console.log('Searching for:', searchTerm);
    searchInputMobile.value = '';
    searchInputMobile.classList.remove('active');
    document.documentElement.style.overflowY = '';
  }
});

// ===== CARRUSEL MEJORADO (Multiple Instances Supported) =====
function setupCarousel(carouselRoot) {
    const track = carouselRoot.querySelector('.carousel-track');
    const slides = carouselRoot.querySelectorAll('.carousel-slide');
    const nextButton = carouselRoot.querySelector('.carousel-button-right');
    const prevButton = carouselRoot.querySelector('.carousel-button-left');
    const dots = carouselRoot.querySelectorAll('.carousel-indicator');
    const container = carouselRoot.querySelector('.carousel-container');

    if (!track || slides.length === 0) return;

    let currentSlide = 0;
    const autoPlayDelay = 8000;
    let intervalId, timeoutId;
    let isPaused = false;

    const calculateSlideWidth = () => {
        const slide = slides[0];
        return slide ? slide.getBoundingClientRect().width : 0;
    };
    let slideWidth = calculateSlideWidth();

    track.style.transition = 'transform 0.7s cubic-bezier(0.33, 0, 0.2, 1)';
    slides.forEach(slide => {
        slide.style.transition = 'opacity 0.5s ease';
    });

    const updateCarousel = () => {
        slideWidth = calculateSlideWidth();
        track.style.transform = `translateX(-${slideWidth * currentSlide}px)`;

        slides.forEach(slide => slide.style.opacity = '0');
        slides[currentSlide].style.opacity = '1';

        slides.forEach((slide, i) => {
            slide.classList.toggle('current-slide', i === currentSlide);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('current-slide', i === currentSlide);
        });
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    };

    const startAutoPlay = () => {
        stopAutoPlay();
        timeoutId = setTimeout(() => {
            nextSlide();
            intervalId = setInterval(nextSlide, autoPlayDelay);
        }, autoPlayDelay);
    };

    const stopAutoPlay = () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
    };

    const handleInteraction = () => {
        stopAutoPlay();
        startAutoPlay();
    };

    if (nextButton) nextButton.addEventListener('click', () => {
        nextSlide();
        handleInteraction();
    });

    if (prevButton) prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
        handleInteraction();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentSlide = i;
            updateCarousel();
            handleInteraction();
        });
    });

    if (container) {
        container.addEventListener('mouseenter', () => {
            isPaused = true;
            stopAutoPlay();
        });

        container.addEventListener('mouseleave', () => {
            isPaused = false;
            startAutoPlay();
        });

        container.addEventListener('touchstart', () => {
            isPaused = true;
            stopAutoPlay();
        }, { passive: true });

        container.addEventListener('touchend', () => {
            isPaused = false;
            startAutoPlay();
        }, { passive: true });
    }

    const init = () => {
        slideWidth = calculateSlideWidth();
        updateCarousel();
        if (!isPaused) startAutoPlay();

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                slideWidth = calculateSlideWidth();
                updateCarousel();
            }, 250);
        });
    };

    init();
}

// ===== INICIALIZACIÓN GLOBAL (para todos los carouseles) =====
setupMenu(); // ← conserva esto si ya lo tienes

document.querySelectorAll('.carousel-wrapper').forEach(setupCarousel);


// FUNCIÓN DE COPIAR EMAIL Y TELÉFONO //
document.addEventListener('DOMContentLoaded', function() {
    // Email button functionality
    const emailButton = document.querySelector('.email-address');
    emailButton.addEventListener('click', function(e) {
      e.preventDefault();
      const email = 'contacto@centraltoursmzt.com';
      copyToClipboard(email, this);
    });
  
    // Phone button functionality
    const phoneButton = document.querySelector('.phone-number');
    phoneButton.addEventListener('click', function(e) {
      e.preventDefault();
      const phone = '6691525822'; // Without spaces for better phone compatibility
      copyToClipboard(phone, this);
    });
  
    // Universal copy function
    function copyToClipboard(text, button) {
      navigator.clipboard.writeText(text).then(() => {
        // Temporary visual feedback
        const originalText = button.innerHTML;
        const originalBg = button.style.backgroundColor;
        
        button.innerHTML = '✓ Copiado!';
        button.style.backgroundColor = '#4CAF50'; // Green success color
        
        // Revert after 1.5 seconds
        setTimeout(() => {
          button.innerHTML = originalText;
          button.style.backgroundColor = originalBg;
        }, 1500);
      }).catch(err => {
        console.error('No se pudo copiar:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Show fallback feedback
        button.innerHTML = 'Press Ctrl+C';
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 1500);
      });
    }
  });