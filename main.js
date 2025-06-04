// ===== MENÚ MÓVIL =====
function setupMenu() {
  const menuBtn = document.getElementById("menu-button");
  const navLinks = document.getElementById("nav-links");

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

// ===== BÚSQUEDA MÓVIL =====
(function setupMobileSearch() {
  const searchButton = document.getElementById('search-button-mobile');
  const searchInput = document.getElementById('search-input-mobile');
  const searchForm = document.getElementById('search-form-mobile');
  const html = document.documentElement;

  if (!searchButton || !searchInput || !searchForm) return;

  const closeSearch = () => {
    searchInput.classList.remove('active');
    html.style.overflowY = '';
  };

  searchButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = searchInput.classList.toggle('active');
    html.style.overflowY = isActive ? 'hidden' : '';
    if (isActive) searchInput.focus();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#search-mobile')) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchInput.classList.contains('active')) closeSearch();
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      console.log('Searching for:', searchTerm);
      searchInput.value = '';
      closeSearch();
    }
  });
})();

// ===== CARRUSEL MEJORADO =====
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

  const calculateSlideWidth = () => slides[0]?.getBoundingClientRect().width || 0;
  let slideWidth = calculateSlideWidth();

  track.style.transition = 'transform 0.7s cubic-bezier(0.33, 0, 0.2, 1)';
  slides.forEach(slide => slide.style.transition = 'opacity 0.5s ease');

  const updateCarousel = () => {
    slideWidth = calculateSlideWidth();
    track.style.transform = `translateX(-${slideWidth * currentSlide}px)`;

    slides.forEach((slide, i) => {
      slide.style.opacity = i === currentSlide ? '1' : '0';
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

  nextButton?.addEventListener('click', () => {
    nextSlide();
    handleInteraction();
  });

  prevButton?.addEventListener('click', () => {
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
    ['mouseenter', 'touchstart'].forEach(event => {
      container.addEventListener(event, () => {
        isPaused = true;
        stopAutoPlay();
      }, { passive: true });
    });

    ['mouseleave', 'touchend'].forEach(event => {
      container.addEventListener(event, () => {
        isPaused = false;
        startAutoPlay();
      }, { passive: true });
    });
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

// ===== INICIALIZACIÓN GLOBAL =====
setupMenu();
document.querySelectorAll('.carousel-wrapper').forEach(setupCarousel);

// ===== FUNCIÓN DE COPIAR EMAIL Y TELÉFONO =====
document.addEventListener('DOMContentLoaded', () => {
  const emailButton = document.querySelector('.email-address');
  const phoneButton = document.querySelector('.phone-number');

  const copyToClipboard = (text, button) => {
    const originalText = button.innerHTML;
    const originalBg = button.style.backgroundColor;

    navigator.clipboard.writeText(text).then(() => {
      button.innerHTML = '✓ Copiado!';
      button.style.backgroundColor = '#4CAF50';
      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = originalBg;
      }, 1500);
    }).catch(err => {
      console.error('No se pudo copiar:', err);
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      button.innerHTML = 'Press Ctrl+C';
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 1500);
    });
  };

  if (emailButton) {
    emailButton.addEventListener('click', (e) => {
      e.preventDefault();
      copyToClipboard('contacto@centraltoursmzt.com', emailButton);
    });
  }

  if (phoneButton) {
    phoneButton.addEventListener('click', (e) => {
      e.preventDefault();
      copyToClipboard('6691525822', phoneButton);
    });
  }
});
