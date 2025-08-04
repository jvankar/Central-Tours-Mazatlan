// ==============================================
// MOBILE MENU
// ==============================================
// Setup mobile menu toggle
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

// ==============================================
// SEARCH FUNCTIONALITY
// ==============================================
// Setup site search
function setupSearch() {
  const searchContainer = document.getElementById('search-container');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const searchForm = document.getElementById('search-form');
  const searchResults = document.getElementById('search-results');
  const html = document.documentElement;
  const isMobile = window.innerWidth <= 1024;

  // Temporary search data
  const websiteContent = [
    { title: "Inicio", url: "index.php", content: "Bienvenido a nuestro sitio web principal", category: "Página Principal" },
    { title: "Productos", url: "catalogo.php", content: "Nuestra colección de productos destacados", category: "Catálogo" },
  ];

  // Toggle mobile search
  const toggleMobileSearch = () => {
    searchInput.classList.toggle('active');
    html.style.overflowY = searchInput.classList.contains('active') ? 'hidden' : '';
    
    if (searchInput.classList.contains('active')) {
      searchInput.focus();
    } else {
      searchResults.classList.remove('active');
    }
  };

  // Close mobile search
  const closeMobileSearch = () => {
    if (isMobile && searchInput.classList.contains('active')) {
      searchInput.classList.remove('active');
      html.style.overflowY = '';
      searchResults.classList.remove('active');
    }
  };

  // Show search results
  const showResults = (results) => {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = 'No se encontraron resultados';
      searchResults.appendChild(noResults);
      return;
    }
    
    results.forEach(item => {
      const resultItem = document.createElement('div');
      resultItem.className = 'search-result-item';
      resultItem.innerHTML = `
        <img src="material/svg/search-line.svg" alt="" width="16" height="16">
        <div>
          <div>${item.title}</div>
          <small style="color:#777;font-size:0.8em">${item.category}</small>
        </div>
      `;
      
      resultItem.addEventListener('click', () => {
        window.location.href = item.url;
      });
      
      searchResults.appendChild(resultItem);
    });
    
    if (isMobile) {
      searchResults.classList.add('active');
    } else {
      searchContainer.classList.add('active');
    }
  };

  // Search content
  const searchContent = (query) => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return websiteContent.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      (item.content && item.content.toLowerCase().includes(lowerQuery)) ||
      (item.category && item.category.toLowerCase().includes(lowerQuery))
    );
  };
  
  // Mobile event listeners
  if (isMobile) {
    searchButton.addEventListener('click', toggleMobileSearch);
    
    document.addEventListener('click', (e) => {
      if (!searchContainer.contains(e.target) && !searchInput.contains(e.target)) {
        closeMobileSearch();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchInput.classList.contains('active')) {
        closeMobileSearch();
      }
    });
  } else {
    // Desktop behavior
    searchButton.addEventListener('click', () => {
      if (searchInput.value.trim()) {
        searchForm.submit();
      }
    });
    
    document.addEventListener('click', (e) => {
      if (!searchContainer.contains(e.target)) {
        searchContainer.classList.remove('active');
      }
    });
  }

  // Input handling
  searchInput.addEventListener('input', function() {
    const query = this.value;
    const results = searchContent(query);
    showResults(results);
    
    if (!query.trim()) {
      if (isMobile) {
        searchResults.classList.remove('active');
      } else {
        searchContainer.classList.remove('active');
      }
    }
  });

  // Form submission
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      this.submit();
    }
  });

  // Focus handling
  searchInput.addEventListener('focus', function() {
    if (this.value.trim()) {
      const results = searchContent(this.value);
      showResults(results);
    }
  });
}

// ==============================================
// CAROUSELS
// ==============================================
// Setup carousel functionality
function setupUnifiedCarousel(carouselRoot) {
  const isTours = carouselRoot.classList.contains('tours-carousel-wrapper');
  const isLandingDesktop = carouselRoot.classList.contains('desktop-carousel');
  const isLandingMobile = carouselRoot.classList.contains('mobile-carousel');
  const isBlog = carouselRoot.classList.contains('blog-carousel-wrapper');
  
  const selectors = isTours ? {
    track: '.tours-carousel-track',
    slides: '.tours-carousel-slide',
    nextButton: '.tours-carousel-button-right',
    prevButton: '.tours-carousel-button-left',
    dots: '.tours-carousel-indicator',
    container: '.tours-carousel-container',
    currentClass: 'tours-current-slide'
  } : isLandingDesktop ? {
    track: '.carousel-track-desktop',
    slides: '.carousel-slide-desktop',
    nextButton: '.carousel-button-right-desktop',
    prevButton: '.carousel-button-left-desktop',
    dots: '.carousel-indicator-desktop',
    container: '.carousel-container-desktop',
    currentClass: 'current-slide-desktop'
  } : isLandingMobile ? {
    track: '.carousel-track',
    slides: '.carousel-slide',
    nextButton: '.carousel-button-right',
    prevButton: '.carousel-button-left',
    dots: '.carousel-indicator',
    container: '.carousel-container',
    currentClass: 'current-slide'
  } : isBlog ? {
    track: '.blog-carousel-track',
    slides: '.blog-carousel-slide',
    nextButton: '.blog-carousel-button-right',
    prevButton: '.blog-carousel-button-left',
    dots: '.blog-carousel-indicator',
    container: '.blog-carousel-container',
    currentClass: 'blog-current-slide'
  } : {
    track: '.carousel-track',
    slides: '.carousel-slide',
    nextButton: '.carousel-button-right',
    prevButton: '.carousel-button-left',
    dots: '.carousel-indicator',
    container: '.carousel-container',
    currentClass: 'current-slide'
  };

  const track = carouselRoot.querySelector(selectors.track);
  const slides = Array.from(carouselRoot.querySelectorAll(selectors.slides));
  const nextButton = carouselRoot.querySelector(selectors.nextButton);
  const prevButton = carouselRoot.querySelector(selectors.prevButton);
  const dots = Array.from(carouselRoot.querySelectorAll(selectors.dots));
  const container = carouselRoot.querySelector(selectors.container);
  
  if (!track || slides.length === 0) return;

  if (isTours || isBlog) {
    track.style.display = 'flex';
    slides.forEach(slide => {
      slide.style.minWidth = '100%';
    });
  }

  let currentSlide = 0;
  const autoPlayDelay = 8000;
  let intervalId, timeoutId;
  let isPaused = false;
  
  track.style.transition = 'transform 0.7s cubic-bezier(0.33, 0, 0.2, 1)';
  slides.forEach(slide => {
    slide.style.transition = 'opacity 0.5s ease';
    slide.style.opacity = '0';
  });

  // Update carousel display
  const updateCarousel = () => {
    const slideWidth = slides[0].getBoundingClientRect().width;
    const offset = -currentSlide * slideWidth;
    track.style.transform = `translateX(${offset}px)`;

    slides.forEach((slide, i) => {
      slide.style.opacity = i === currentSlide ? '1' : '0';
      slide.classList.toggle(selectors.currentClass, i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle(selectors.currentClass, i === currentSlide);
      dot.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
    });
  };

  // Next slide
  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
  };

  // Previous slide
  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
  };

  // Start autoplay
  const startAutoPlay = () => {
    stopAutoPlay();
    if (!isPaused) {
      timeoutId = setTimeout(() => {
        nextSlide();
        intervalId = setInterval(nextSlide, autoPlayDelay);
      }, autoPlayDelay);
    }
  };

  // Stop autoplay
  const stopAutoPlay = () => {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
  };

  // Handle user interaction
  const handleInteraction = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  // Event listeners
  nextButton?.addEventListener('click', () => {
    nextSlide();
    handleInteraction();
  });

  prevButton?.addEventListener('click', () => {
    prevSlide();
    handleInteraction();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      currentSlide = i;
      updateCarousel();
      handleInteraction();
    });
  });

  // Pause on hover
  if (container) {
    ['mouseenter', 'touchstart'].forEach(evt => {
      container.addEventListener(evt, () => {
        isPaused = true;
        stopAutoPlay();
      }, { passive: true });
    });
    
    ['mouseleave', 'touchend'].forEach(evt => {
      container.addEventListener(evt, () => {
        isPaused = false;
        startAutoPlay();
      }, { passive: true });
    });
  }

  // Initialize
  updateCarousel();
  startAutoPlay();

  window.addEventListener('resize', () => {
    updateCarousel();
  });
}

// ==============================================
// SCROLL ANIMATIONS
// ==============================================
// Setup reveal animations
function setupReveal(selector, options, onVisible) {
  const elements = document.querySelectorAll(selector);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        onVisible(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, options);
  elements.forEach(el => observer.observe(el));
}

// ==============================================
// DROPDOWNS
// ==============================================
// Populate number dropdown
function populateDropdown(selectId, min, max, singular, plural) {
  const select = document.getElementById(selectId);
  if (!select) return;
  
  for (let i = min; i <= max; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i} ${i === 1 ? singular : plural}`;
    select.appendChild(option);
  }
}

// Generate day dropdown
function generateDays(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;
  
  for (let i = 1; i <= 31; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
  }
}

// ==============================================
// CARD EFFECTS
// ==============================================
// Setup card hover effects
function setupCardEffects() {
  const catalogItems = document.querySelectorAll('.catalog-article-content');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (window.innerWidth <= 1024) {
          entry.target.classList.add('visible');
        }
        
        if (window.innerWidth > 1024) {
          createRippleEffect(entry.target);
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  catalogItems.forEach(item => {
    observer.observe(item);
    
    if (window.innerWidth > 1024) {
      item.addEventListener('mouseenter', () => {
        item.style.animation = 'pulse 1.5s infinite';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.animation = '';
      });
    }
  });

  const styleId = 'card-effects-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes pulse {
        0% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-5px) scale(1.03); }
        100% { transform: translateY(0) scale(1); }
      }
      .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        pointer-events: none;
        animation: ripple 0.6s linear;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
      @keyframes ripple {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ==============================================
// BLOG FUNCTIONALITY
// ==============================================
// Setup blog reveal animations
function setupBlogReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible-blog');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.entry-blog, .card-blog, .section-title-blog')
          .forEach(el => io.observe(el));
}

// Setup blog grid expansion
function setupBlogGrid() {
  const grid = document.querySelector('.grid-blog');
  const button = document.getElementById('show-more-blog');

  if (!grid || !button) return;

  let expanded = false;

  button.addEventListener('click', () => {
    expanded = !expanded;
    if (expanded) {
      grid.classList.add('expanded');
      button.textContent = 'Mostrar menos';
    } else {
      grid.classList.remove('expanded');
      button.textContent = 'Mostrar más';
      grid.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ==============================================
// PAGE INITIALIZATION
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
  // Core functionality
  setupMenu();
  setupSearch();
  
  // Initialize carousels
  document.querySelectorAll(
    '.mobile-carousel, .desktop-carousel, .tours-carousel-wrapper, .blog-carousel-wrapper'
  ).forEach(setupUnifiedCarousel);

  // Scroll animations
  setupReveal('.section-title', { threshold: 0.2 }, el => {
    el.classList.add('visible');
  });
  
  setupReveal('.about-card', { threshold: 0.2 }, el => el.classList.add('visible'));
  setupReveal('.catalog-article-content', { threshold: 0.2 }, el => el.classList.add('visible'));
  setupReveal('.tour-content', { threshold: 0.2 }, el => el.classList.add('visible'));
  
  setupReveal('.price-card', { threshold: 0.1 }, el => {
    el.style.opacity = '1';
    el.style.transform = 'scale(1)';
  });
  
  setupReveal('.grid-item', { threshold: 0.1 }, el => {
    const delay = el.classList.contains('grid-pos-1') || el.classList.contains('grid-pos-3') ? 0 : 200;
    setTimeout(() => {
      el.classList.add('visible');
    }, delay);
  });

  // Blog animations
  setupBlogReveal();
  setupBlogGrid();

  // Dropdowns
  populateDropdown('adults-select', 1, 50, 'adulto', 'adultos');
  populateDropdown('children-select', 0, 50, 'niño', 'niños');
  generateDays('day-select');
  
  // Mobile booking
  const bookingButton = document.getElementById('booking-button');
  const mobileModal = document.getElementById('booking-mobile-modal');
  
  if (bookingButton && mobileModal) {
    bookingButton.addEventListener('click', function() {
      mobileModal.style.display = 'flex';
      populateMobileDropdowns();
    });
    
    mobileModal.addEventListener('click', function(e) {
      if (e.target === mobileModal) {
        mobileModal.style.display = 'none';
      }
    });
    
    const mobileForm = mobileModal.querySelector('.booking-form');
    if (mobileForm) {
      mobileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        mobileModal.style.display = 'none';
      });
    }
  }
  
  // Populate mobile dropdowns
  function populateMobileDropdowns() {
    const adultsSelect = mobileModal.querySelector('select[name="adults"]');
    if (adultsSelect) {
      populateSelect(adultsSelect, 1, 50, 'adulto', 'adultos');
    }
    
    const childrenSelect = mobileModal.querySelector('select[name="children"]');
    if (childrenSelect) {
      populateSelect(childrenSelect, 0, 50, 'niño', 'niños');
    }
    
    const daySelect = mobileModal.querySelector('select[name="day"]');
    if (daySelect) {
      for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
      }
    }
  }
  
  // Helper for dropdowns
  function populateSelect(selectElement, min, max, singular, plural) {
    while (selectElement.options.length > 1) {
      selectElement.remove(1);
    }
    
    for (let i = min; i <= max; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${i} ${i === 1 ? singular : plural}`;
      selectElement.appendChild(option);
    }
  }

  // Card effects
  setupCardEffects();

  // Populate passenger dropdown
  function populatePassengerDropdown(selectElement) {
    if (!selectElement) return;
    
    while (selectElement.options.length > 1) {
      selectElement.remove(1);
    }
    
    for (let i = 1; i <= 10; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${i} ${i === 1 ? 'pasajero' : 'pasajeros'}`;
      selectElement.appendChild(option);
    }
    
    const moreOption = document.createElement('option');
    moreOption.value = '10+';
    moreOption.textContent = 'Más de 10';
    selectElement.appendChild(moreOption);
  }

  // Initialize passenger dropdowns
  const passengerDropdowns = [
    'passengers-select',
    'passengers-select-desktop'
  ];
  
  passengerDropdowns.forEach(id => {
    const dropdown = document.getElementById(id);
    if (dropdown) populatePassengerDropdown(dropdown);
  });

  // Mobile modal passengers
  if (bookingButton) {
    bookingButton.addEventListener('click', function() {
      const mobileModal = document.getElementById('booking-mobile-modal');
      if (!mobileModal) return;
      
      const mobilePassengers = mobileModal.querySelector('select[name="passengers"]');
      if (mobilePassengers) populatePassengerDropdown(mobilePassengers);
    });
  }

  // WhatsApp integration
  const bookingForms = document.querySelectorAll('.booking-form, #booking-mobile-modal form');
  const phoneNumber = '+526691525822';

  bookingForms.forEach(bookingForm => {
    bookingForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }

      const adultsSelect = this.querySelector('select[name="adults"]');
      const childrenSelect = this.querySelector('select[name="children"]');
      
      if (adultsSelect && childrenSelect) {
        const adults = adultsSelect.options[adultsSelect.selectedIndex].text;
        const children = childrenSelect.options[childrenSelect.selectedIndex].text;
        const daySelect = this.querySelector('select[name="day"]');
        const monthSelect = this.querySelector('select[name="month"]');
        const yearSelect = this.querySelector('select[name="year"]');
        const tourNameElement = document.querySelector('.tour-name');

        if (!daySelect || !monthSelect || !yearSelect) return;

        const day = daySelect.options[daySelect.selectedIndex].text;
        const month = monthSelect.options[monthSelect.selectedIndex].text;
        const year = yearSelect.options[yearSelect.selectedIndex].text;
        const tourName = tourNameElement ? tourNameElement.textContent.trim() : 'Turibus en Mazatlán';

        const message = `Hola, me gustaría consultar disponibilidad para: ${tourName}
Cantidad de adultos: ${adults}
Cantidad de niños: ${children}
Fecha: ${day} de ${month.toLowerCase()} del ${year}`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
      } else {
        const serviceTypeSelect = this.querySelector('#trip-type-select, select[name="trip_type"]');
        const passengersSelect = this.querySelector('#passengers-select-desktop, #passengers-select, select[name="passengers"]');
        const dayInput = this.querySelector('[name="day"], input[name="day"]');
        const monthSelect = this.querySelector('[name="month"], select[name="month"]');
        const yearInput = this.querySelector('[name="year"], input[name="year"]');
        const tourNameElement = document.querySelector('.tour-name');

        if (!serviceTypeSelect || !passengersSelect || !dayInput || !monthSelect || !yearInput) return;

        const serviceType = serviceTypeSelect.querySelector('option:checked').text;
        const passengers = passengersSelect.querySelector('option:checked').text;
        const day = dayInput.value;
        const month = monthSelect.querySelector('option:checked').text;
        const year = yearInput.value;
        const tourName = tourNameElement ? tourNameElement.textContent.trim() : serviceType;

        let passengerText = passengers;
        if (passengers === 'Más de 10') {
          passengerText = 'más de 10 personas';
        } else if (passengers === '1 pasajero') {
          passengerText = '1 persona';
        } else {
          passengerText = passengers.replace('pasajeros', 'personas');
        }

        const formattedMonth = month.toLowerCase();

        const message = `Hola, me gustaría consultar disponibilidad para: ${tourName}
Tipo de servicio: ${serviceType}
Cantidad de personas: ${passengerText}
Fecha: ${day} de ${formattedMonth} del ${year}`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
      }
    });
  });
});