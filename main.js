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

    // Close menu on swipe right (optional, for responsive touch UX)
    let touchstartX = 0;
    let touchendX = 0;

    function checkDirection() {
        if (touchendX < touchstartX && (touchstartX - touchendX) > 50) { // Swipe left
            if (navLinks.classList.contains("open")) {
                navLinks.classList.remove("open");
                menuBtn.classList.remove("active");
            }
        }
    }

    navLinks.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    });

    navLinks.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        checkDirection();
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

    // If essential elements missing, bail out (avoids errors on pages without search)
    if (!searchContainer || !searchInput || !searchButton || !searchForm || !searchResults) return;

    const html = document.documentElement;
    const isMobile = window.innerWidth <= 1024;

    // Temporary search data
    const websiteContent = [
        { title: "Inicio", url: "index.html", content: "Bienvenido a nuestro sitio web principal", category: "Página Principal" },
        { title: "Productos", url: "catalogo.php", content: "Nuestra colección de productos destacados", category: "Catálogo" },
        { title: "Acerca de Nosotros", url: "acerca-de.php", content: "Conoce nuestra historia y valores", category: "Información" },
        { title: "Contacto", url: "contacto.php", content: "Envíanos un mensaje, estamos aquí para ayudarte", category: "Información" },
        { title: "Blog", url: "blog.php", content: "Lee nuestros últimos artículos, tips de viaje y noticias", category: "Blog" },
        { title: "Tour de la Ciudad", url: "tour-ciudad.php", content: "Un recorrido completo por los puntos más emblemáticos de la ciudad", category: "Tours" },
        { title: "Transporte al Aeropuerto", url: "transporte-aeropuerto.php", content: "Servicio de traslado seguro y cómodo desde y hacia el aeropuerto", category: "Servicios" },
        { title: "Paseo Isla De La Piedra", url: "paseo-isla-piedra.html", content: "Explora la naturaleza y desafía tus límites", category: "Tours" }
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
        } else {
            results.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                <img src="material/svg/search-line.svg" alt="ícono de búsqueda">
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
        }

        if (isMobile) {
            searchResults.classList.add('active');
        } else {
            searchContainer.classList.add('active');
        }
    };

    // Search content
    const searchContent = (query) => {
        if (!query || !query.trim()) return [];
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
            // For a real search, you'd redirect or make an AJAX call here
            alert('Búsqueda: ' + query); // Placeholder
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
    if (!carouselRoot) return;

    const isTours = carouselRoot.classList.contains('tours-carousel-wrapper');
    const isLandingDesktop = carouselRoot.classList.contains('carousel-wrapper-desktop'); // Use desktop-wrapper
    const isLandingMobile = carouselRoot.classList.contains('carousel-wrapper'); // Use mobile-wrapper

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
    } : {
        // Fallback for general case, should ideally be covered by specific classes
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

    // Ensure slides are laid out correctly for calculation if not already
    if (isTours) {
        track.style.display = 'flex';
        slides.forEach(slide => {
            slide.style.minWidth = '100%';
        });
    }

    let currentSlide = 0;
    const autoPlayDelay = 8000;
    let intervalId = null;
    let timeoutId = null;
    let isPaused = false;

    // Apply necessary transitions once, not on every update
    track.style.transition = 'transform 0.7s cubic-bezier(0.33, 0, 0.2, 1)';
    // Pre-set slides for opacity transition, helps with initial state
    slides.forEach(slide => {
        slide.style.transition = 'opacity 0.5s ease';
        slide.style.opacity = '0'; // All starts hidden
    });


    // Update carousel display
    const updateCarousel = () => {
        // Recalculate slideWidth on update for responsiveness
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
        stopAutoPlay(); // Clear any existing autoplay
        if (!isPaused) {
            timeoutId = setTimeout(() => {
                nextSlide();
                intervalId = setInterval(nextSlide, autoPlayDelay);
            }, autoPlayDelay);
        }
    };

    // Stop autoplay
    const stopAutoPlay = () => {
        if (intervalId) clearInterval(intervalId);
        if (timeoutId) clearTimeout(timeoutId);
        intervalId = null;
        timeoutId = null;
    };

    // Handle user interaction
    const handleInteraction = () => {
        stopAutoPlay(); // Stop current timer
        startAutoPlay(); // Restart timer
    };

    // Event listeners
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextSlide();
            handleInteraction();
        });
    }
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
            handleInteraction();
        });
    }
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

    // Initialize carousel on load and resize
    updateCarousel();
    startAutoPlay();
    window.addEventListener('resize', () => {
        updateCarousel(); // Re-calculate dimensions on resize
    });
}

// ==============================================
// SCROLL ANIMATIONS
// ==============================================

/**
 * Sets up reveal animations for elements when they intersect the viewport.
 * @param {string} selector - CSS selector for the elements to observe.
 * @param {object} [options={}] - IntersectionObserver options (e.g., root, rootMargin, threshold).
 * @param {function} onVisible - Callback function to execute when an element becomes visible.
 */
function setupReveal(selector, options = {}, onVisible) {
    const elements = document.querySelectorAll(selector);
    if (!elements || elements.length === 0) {
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get data-delay attribute from the element, default to 0 if not present
                const delay = parseInt(entry.target.dataset.delay || 0, 10);

                setTimeout(() => {
                    try {
                        onVisible(entry.target);
                    } catch (err) {
                        console.error('setupReveal onVisible error for', entry.target, err);
                    }
                }, delay);

                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, options);

    elements.forEach(el => {
        // Only observe elements that haven't been made visible yet
        if (!el.classList.contains('visible') && !el.classList.contains('visible-blog')) {
            observer.observe(el);
        }
    });
}


// ==============================================
// DROPDOWNS
// ==============================================
// Generate day dropdown (specific to booking form select tag)
function generateDays(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = '';
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }
}

// ==============================================
// CARD EFFECTS (Used on Catalog)
// ==============================================
// Setup card hover effects
function setupCardEffects() {
    const catalogItems = document.querySelectorAll('.catalog-article-content');
    if (!catalogItems || catalogItems.length === 0) return;

    // Dynamic style insertion for common animations
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
                overflow: hidden; /* Ensure ripple stays within bounds */
            }
            @keyframes ripple {
                to { transform: scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Function to create ripple effect on desktop
    const createRippleEffect = (element, event) => {
        const ripple = element.querySelector('.ripple-effect');
        if (ripple) ripple.remove(); // Remove old ripple if exists

        const newRipple = document.createElement('span');
        newRipple.className = 'ripple-effect';
        element.appendChild(newRipple);

        // Position the ripple where the click/mouse entered
        if (event) {
            const rect = element.getBoundingClientRect();
            newRipple.style.left = `${event.clientX - rect.left}px`;
            newRipple.style.top = `${event.clientY - rect.top}px`;
        } else {
            // Default to center if no event (e.g., if triggered by non-mouse interaction)
            newRipple.style.left = '50%';
            newRipple.style.top = '50%';
            newRipple.style.transform = 'translate(-50%, -50%) scale(0)';
        }
    };

    // Observe elements for the 'visible' class, mainly for initial load animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add `visible` class for initial entry animation (if any)
                entry.target.classList.add('visible');

                // Add mouse event listeners only for desktop
                if (window.innerWidth > 1024) {
                    entry.target.addEventListener('mouseenter', (e) => {
                        entry.target.style.animation = 'pulse 1.5s infinite';
                        createRippleEffect(entry.target, e); // Create ripple on hover
                    });
                    entry.target.addEventListener('mouseleave', () => {
                        entry.target.style.animation = ''; // Remove pulse animation
                        const ripple = entry.target.querySelector('.ripple-effect');
                        if (ripple) ripple.remove(); // Remove ripple when mouse leaves
                    });
                }
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    catalogItems.forEach(item => {
        observer.observe(item);
    });
}


// ==============================================
// BLOG FUNCTIONALITY
// ==============================================
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
            // Smooth scroll to the top of the grid when collapsing
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Initial check (hide extra cards if not expanded)
    // This assumes the CSS `.grid-blog:not(.expanded) > .card-blog:nth-of-type(n+4)` already handles display: none
}


// ==============================================
// CUSTOM DATE PICKER CLASS (Booking Form)
// ==============================================

class CustomDatePicker {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) throw new Error(`Container "${containerId}" not found`);

        // Determine prefix used for the inputs inside the container (mobile/desktop)
        this.prefix = containerId.includes('mobile') ? 'mobile' : 'desktop';

        this.dayInput = document.getElementById(`${this.prefix}-day`);
        this.monthInput = document.getElementById(`${this.prefix}-month`);
        this.yearInput = document.getElementById(`${this.prefix}-year`);

        this.dayDropdown = document.getElementById(`${this.prefix}-day-dropdown`);
        this.monthDropdown = document.getElementById(`${this.prefix}-month-dropdown`);
        this.yearDropdown = document.getElementById(`${this.prefix}-year-dropdown`);

        this.overlay = document.getElementById('date-picker-overlay');

        if (!this.dayInput || !this.monthInput || !this.yearInput ||
            !this.dayDropdown || !this.monthDropdown || !this.yearDropdown) {
            throw new Error(`Required inputs/dropdowns not found for ${containerId}`);
        }

        this.selectedDay = '';
        this.selectedMonth = '';
        this.selectedYear = '';

        this.months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        this.init();
    }

    init() {
        this.populateYears();
        this.populateMonths();
        this.populateDays();
        this.bindEvents();
    }

    bindEvents() {
        // Click on inputs opens the correct dropdown
        this.dayInput.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown('day');
        });
        this.monthInput.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown('month');
        });
        this.yearInput.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown('year');
        });

        // Prevent clicks inside dropdown from bubbling (so overlay click doesn't trigger)
        [this.dayDropdown, this.monthDropdown, this.yearDropdown].forEach(drop => {
            drop.addEventListener('click', (e) => e.stopPropagation());
        });

        // Clicking overlay closes everything (global handler also set below)
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.closeAll();
            });
        }
        // This is a redundant global listener if all dropdowns already dispatch
        // closeFromOverlay on click. Keeping it here just in case, but closeAllDropdowns() uses it.
        document.addEventListener('click', (e) => {
            // Check if the click occurred inside any of the dropdowns or their inputs
            const isClickInsideDatePicker = this.container.contains(e.target) || Array.from(document.querySelectorAll('.date-dropdown')).some(dd => dd.contains(e.target));
            if (!isClickInsideDatePicker) {
                this.closeAll();
            }
        });
    }

    toggleDropdown(type) {
        // Close any other open dropdowns (global)
        closeAllDropdowns();

        const dropdown = this[`${type}Dropdown`];
        if (!dropdown) return;

        dropdown.classList.add('show');
        if (this.overlay) this.overlay.classList.add('show');
    }

    closeAll() {
        [this.dayDropdown, this.monthDropdown, this.yearDropdown].forEach(dd => {
            if (dd) dd.classList.remove('show');
        });
        if (this.overlay) this.overlay.classList.remove('show');
    }

    populateYears() {
        const currentYear = new Date().getFullYear();
        const years = [currentYear, currentYear + 1]; // Current year and next year
        this.yearDropdown.innerHTML = '';
        years.forEach(year => {
            const option = document.createElement('div');
            option.className = 'date-option';
            option.textContent = year;
            option.addEventListener('click', () => this.selectYear(year));
            this.yearDropdown.appendChild(option);
        });
    }

    populateMonths() {
        this.monthDropdown.innerHTML = '';
        this.months.forEach((month, idx) => {
            const option = document.createElement('div');
            option.className = 'date-option';
            option.textContent = month;
            option.addEventListener('click', () => this.selectMonth(month, idx + 1)); // Pass 1-based month value
            this.monthDropdown.appendChild(option);
        });
    }

    populateDays() {
        this.dayDropdown.innerHTML = '';
        let maxDays = 31;

        if (this.selectedMonth && this.selectedYear) {
            const monthNum = this.months.indexOf(this.selectedMonth) + 1; // Convert month name to 1-based number
            // Date(year, monthIndex, 0) gives last day of previous month.
            // Date(year, monthNum, 0) gives last day of current month.
            maxDays = new Date(parseInt(this.selectedYear, 10), monthNum, 0).getDate();
        }

        for (let i = 1; i <= maxDays; i++) {
            const option = document.createElement('div');
            option.className = 'date-option';
            option.textContent = i;
            option.addEventListener('click', () => this.selectDay(i));
            this.dayDropdown.appendChild(option);
        }

        // Adjust selected day if it exceeds the new maxDays (e.g., Feb 30th)
        if (this.selectedDay > maxDays) {
            this.selectDay(maxDays); // Set to last day of the new month
        } else if (this.selectedDay && this.dayInput.value != this.selectedDay) {
            // Re-select to update UI if already selected but dropdown was reset
            this.dayInput.value = this.selectedDay;
            this.dayInput.classList.add('selected');
            this.updateSelectedOption(this.dayDropdown, this.selectedDay);
        }
    }

    selectDay(day) {
        this.selectedDay = day;
        this.dayInput.value = day;
        this.dayInput.classList.add('selected');
        this.updateSelectedOption(this.dayDropdown, day);
        this.closeAll();
    }

    selectMonth(monthName, monthValue) { // monthValue is 1-based index
        this.selectedMonth = monthName;
        this.monthInput.value = monthName;
        this.monthInput.classList.add('selected');
        this.updateSelectedOption(this.monthDropdown, monthName);
        this.populateDays(); // Month changed, so days might change (e.g., Feb vs Jan)
        this.closeAll();
    }

    selectYear(year) {
        this.selectedYear = year;
        this.yearInput.value = year;
        this.yearInput.classList.add('selected');
        this.updateSelectedOption(this.yearDropdown, year);
        this.populateDays(); // Year changed, so days might change (e.g., leap year Feb)
        this.closeAll();
    }

    updateSelectedOption(dropdown, value) {
        const options = dropdown.querySelectorAll('.date-option');
        options.forEach(opt => {
            opt.classList.remove('selected');
            if (opt.textContent == value) { // Use loose equality for numbers/strings
                opt.classList.add('selected');
            }
        });
    }

    getSelectedDate() {
        if (this.selectedDay && this.selectedMonth && this.selectedYear) {
            const monthNum = this.months.indexOf(this.selectedMonth) + 1; // Convert month name to 1-based number
            return {
                day: this.selectedDay,
                month: monthNum,
                year: this.selectedYear,
                formatted: `${this.selectedDay}/${monthNum}/${this.selectedYear}`
            };
        }
        return null;
    }
    isComplete() {
        return !!(this.selectedDay && this.selectedMonth && this.selectedYear);
    }
}

// ==============================================
// TRIP TYPE DROPDOWN (scoped per .custom-date-picker that contains trip-type input)
// ==============================================

class TripTypeDropdown {
    constructor(container) {
        // container can be an element or element id
        this.container = (typeof container === 'string') ? document.getElementById(container) : container;
        if (!this.container) throw new Error('TripTypeDropdown container not found');

        // find the specific input and dropdown inside this container
        // (this allows both "trip-type-picker" and "desktop-trip-type-picker" naming)
        this.input = this.container.querySelector('input[name="trip-type"], .date-input');
        this.dropdown = this.container.querySelector('.date-dropdown');
        this.overlay = document.getElementById('date-picker-overlay');

        this.selectedValue = '';
        this.selectedText = '';
        this.tripTypes = [
            { value: 'airport-hotel', text: 'Aeropuerto → Hotel' },
            { value: 'hotel-airport', text: 'Hotel → Aeropuerto' }
        ];

        if (!this.input || !this.dropdown) {
            throw new Error('TripTypeDropdown input or dropdown not found in container');
        }

        this.init();
    }

    init() {
        this.populateOptions();
        this.bindEvents();
    }

    bindEvents() {
        this.input.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent this click from closing other dropdowns
            this.toggleDropdown();
        });

        // Prevent clicks inside dropdown from bubbling and closing it
        this.dropdown.addEventListener('click', (e) => e.stopPropagation());

        // clicking overlay should close dropdowns
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeDropdown());
        }

        // close when clicking outside anywhere (this is also handled by a global listener on document)
        document.addEventListener('click', (e) => {
            const isClickInsideTripType = this.container.contains(e.target) || this.dropdown.contains(e.target);
            if (!isClickInsideTripType) {
                this.closeDropdown();
            }
        });
    }

    toggleDropdown() {
        // close other date-dropdowns globally
        closeAllDropdowns();

        this.dropdown.classList.toggle('show');
        if (this.dropdown.classList.contains('show') && this.overlay) {
            this.overlay.classList.add('show');
        } else if (this.overlay) {
            this.overlay.classList.remove('show');
        }
    }

    closeDropdown() {
        this.dropdown.classList.remove('show');
        // Check if other dropdowns are still open before removing overlay
        const anyOtherDropdownOpen = Array.from(document.querySelectorAll('.date-dropdown.show')).some(dd => dd !== this.dropdown);
        if (this.overlay && !anyOtherDropdownOpen) {
            this.overlay.classList.remove('show');
        }
    }

    populateOptions() {
        this.dropdown.innerHTML = '';
        this.tripTypes.forEach(tt => {
            const option = document.createElement('div');
            option.className = 'date-option';
            option.textContent = tt.text;
            option.dataset.value = tt.value; // Store value in data attribute
            option.addEventListener('click', () => this.selectOption(tt.value, tt.text));
            this.dropdown.appendChild(option);
        });
    }

    selectOption(value, text) {
        this.selectedValue = value;
        this.selectedText = text;
        this.input.value = text;
        this.input.classList.add('selected'); // Mark as selected for styling
        this.updateSelectedOption(text);
        this.closeDropdown();

        // dispatch a change event in case some code listens
        const changeEvent = new Event('change', { bubbles: true });
        this.input.dispatchEvent(changeEvent);
    }

    updateSelectedOption(text) {
        this.dropdown.querySelectorAll('.date-option').forEach(opt => {
            opt.classList.toggle('selected', opt.textContent === text);
        });
    }

    getSelectedValue() { return this.selectedValue; }
    getSelectedText() { return this.selectedText; }
    isComplete() { return this.selectedValue !== ''; }
}

// Helper global to close all date-related dropdowns (date pickers + trip type dropdowns)
function closeAllDropdowns() {
    document.querySelectorAll('.date-dropdown').forEach(dd => dd.classList.remove('show'));
    const overlay = document.getElementById('date-picker-overlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}


// ==============================================
// PAGE INITIALIZATION
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    setupMenu();
    setupSearch();

    // Initialize carousels (if any)
    document.querySelectorAll(
        '.carousel-wrapper, .carousel-wrapper-desktop, .tours-carousel-wrapper, .blog-carousel-wrapper'
    ).forEach(setupUnifiedCarousel);

    // ==============================================
    // UNIFIED SCROLL ANIMATIONS
    // ==============================================

    // blog animations (uses 'visible-blog' class)
    setupReveal(
        '.title-blog, .entry-blog, .card-blog, .section-title-blog', // Apply to title, main entries, and related cards/title
        { threshold: 0.1 },
        el => {
            el.classList.add('visible-blog');
            // The data-delay now handles the specific delays, so no need for indexed delay here
        }
    );

    // About Us, Contact, and other generic content sections (uses 'visible' class)
    // Common section titles
    setupReveal('.section-title, .section-subtitle, .social-title, .cta-section', { threshold: 0.2 }, el => {
        el.classList.add('visible');
    });

    // **MODIFICACIÓN AQUÍ:** Ajuste de threshold para las secciones de contenido principal
    // Esto incluye grid-item, about-card, feature-card-about, stat-item-about
    // Ajustado a 0.01 (1% visible) y un rootMargin para capturar antes.
    setupReveal('.grid-item, .about-card, .feature-card-about, .stat-item-about', { threshold: 0.01, rootMargin: '0px 0px -50px 0px' }, el => {
        el.classList.add('visible');
    });

    // Contact Us cards (contact-card, social-card) with staggered delay using data-delay
    setupReveal('.contact-card, .social-card', { threshold: 0.15 }, el => {
        // The delay is now handled by data-delay on the element in HTML and setupReveal logic
        el.classList.add('visible');
    });

    // Catalog items
    setupReveal('.catalog-article-content', { threshold: 0.2 }, el => {
        el.classList.add('visible');
    });

    // Tour page specific sections (tour-content, price-card)
    setupReveal('.tour-content', { threshold: 0.2 }, el => {
        el.classList.add('visible');
    });

    setupReveal('.price-card', { threshold: 0.1 }, el => {
        // These styles are applied directly, could also be done via a `.visible` class
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
    });

    // ==============================================
    // END UNIFIED SCROLL ANIMATIONS
    // ==============================================

    // Blog grid expansion
    setupBlogGrid();

    // Dropdowns helper (specific to some forms (e.g. mobile modal select tags))
    generateDays('day-select');

    // Number inputs (adults/children) - initialize only if present
    document.querySelectorAll('.add-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;
            const currentValue = parseInt(input.value) || 0;
            const maxValue = parseInt(input.max);
            if (Number.isFinite(maxValue) && currentValue < maxValue) {
                input.value = currentValue + 1;
            } else if (!Number.isFinite(maxValue)) { // If no max defined, just increment
                input.value = currentValue + 1;
            }
        });
    });

    document.querySelectorAll('.subtract-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;
            const currentValue = parseInt(input.value) || 0;
            const minValue = parseInt(input.min);
            if (Number.isFinite(minValue) && currentValue > minValue) {
                input.value = currentValue - 1;
            } else if (!Number.isFinite(minValue) && currentValue > 0) { // If no min defined, just decrement if > 0
                input.value = currentValue - 1;
            }
        });
    });

    document.querySelectorAll('.number-input').forEach(input => {
        input.addEventListener('input', function() {
            // Remove non-numeric characters
            this.value = this.value.replace(/[^0-9]/g, '');
            const value = parseInt(this.value) || 0;
            const maxValue = parseInt(this.max);
            const minValue = parseInt(this.min);

            if (Number.isFinite(maxValue) && value > maxValue) {
                this.value = maxValue;
            } else if (Number.isFinite(minValue) && value < minValue && this.value !== '') {
                this.value = minValue;
            }
        });

        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.value = this.min || 0; // Default to min or 0 if empty
            }
        });
    });

    // Mobile booking modal (if present)
    const bookingButton = document.getElementById('booking-button');
    const mobileModal = document.getElementById('booking-mobile-modal');
    if (bookingButton && mobileModal) {
        bookingButton.addEventListener('click', function() {
            mobileModal.style.display = 'flex';
            populateMobileDropdowns(); // Ensure dropdowns are populated when modal opens
        });

        mobileModal.addEventListener('click', function(e) {
            // Close modal if clicking on the overlay (not the content)
            if (e.target === mobileModal) {
                mobileModal.style.display = 'none';
            }
        });

        const mobileForm = mobileModal.querySelector('.booking-form');
        if (mobileForm) {
            mobileForm.addEventListener('submit', function(e) {
                // If you submit via WA, you might want to close the modal after submitting
                // For now, let the WA integration handle the next step
                // e.preventDefault(); // Prevent default form submission if WA takes over
                // mobileModal.style.display = 'none';
            });
        }
    }

    // Helper function used by mobile modal
    function populateMobileDropdowns() {
        if (!mobileModal) return;
        const daySelect = mobileModal.querySelector('select[name="day"]');
        if (daySelect) {
            daySelect.innerHTML = '';
            for (let i = 1; i <= 31; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                daySelect.appendChild(option);
            }
        }
    }

    // Card effects (for catalog items)
    setupCardEffects();

    // Initialize date pickers (if present)
    let mobileDatePicker = null;
    let desktopDatePicker = null;
    try {
        if (document.getElementById('mobile-date-picker')) {
            mobileDatePicker = new CustomDatePicker('mobile-date-picker');
        }
        if (document.getElementById('desktop-date-picker')) {
            desktopDatePicker = new CustomDatePicker('desktop-date-picker');
        }
    } catch (err) {
        console.error('Error initializing CustomDatePicker:', err);
    }

    // Initialize TripTypeDropdown(s) (scoped per .custom-date-picker)
    const tripTypeInstances = {};
    document.querySelectorAll('.custom-date-picker').forEach(container => {
        // check if this container contains an input specifically for trip-type
        const tripInput = container.querySelector('input[name="trip-type"]');
        if (tripInput) {
            try {
                // Generate a unique ID if container doesn't have one, crucial for referencing
                const id = container.id || `triptype-${Object.keys(tripTypeInstances).length + 1}`;
                if (!container.id) container.id = id;

                tripTypeInstances[container.id] = new TripTypeDropdown(container);
            } catch (err) {
                console.warn('TripTypeDropdown init skipped for a container:', err);
            }
        }
    });

    // Global overlay click: ensure all dropdowns close if overlay is clicked
    const overlayEl = document.getElementById('date-picker-overlay');
    if (overlayEl) {
        overlayEl.addEventListener('click', closeAllDropdowns);
    }

    // ==============================================
    // FORMS -> WHATSAPP INTEGRATION
    // ==============================================
    const bookingForms = document.querySelectorAll('.booking-form');
    const phoneNumber = '526691525822'; // without '+' for wa.me

    bookingForms.forEach(bookingForm => {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            // native HTML5 validation
            if (!this.checkValidity()) {
                this.reportValidity(); // Show native browser validation messages
                return;
            }

            // try to find tour-name inside the form first, fallback to global
            const tourNameElement = this.querySelector('.tour-name') || document.querySelector('.tour-name');
            const tourName = tourNameElement ? tourNameElement.textContent.trim() : 'Servicio de Transporte'; // Default if not found

            // determine presence of transportation variant (based on passengers input or trip type)
            const passengersInput = this.querySelector('input[name="passengers"]');
            const tripTypeInput = this.querySelector('input[name="trip-type"]');

            // helper function to get date parts correctly from input or select elements
            function getDateParts(form) {
                // Prioritize CustomDatePicker if initialized for this form/section
                const formId = form.closest('.check-availability-form')?.id || form.closest('.booking-mobile-modal-content')?.id; // Get parent container ID
                let datePickerInstance = null;

                if (formId && formId.includes('mobile') && mobileDatePicker) {
                    datePickerInstance = mobileDatePicker;
                } else if (formId && formId.includes('desktop') && desktopDatePicker) {
                    datePickerInstance = desktopDatePicker;
                }

                if (datePickerInstance && datePickerInstance.isComplete()) {
                    const selectedDate = datePickerInstance.getSelectedDate();
                    return {
                        day: selectedDate.day,
                        month: datePickerInstance.months[selectedDate.month - 1], // Get month name
                        year: selectedDate.year
                    };
                }

                // Fallback for select tags (e.g., mobile modal's direct select)
                const dayEl = form.querySelector('input[name="day"], select[name="day"]');
                const monthEl = form.querySelector('input[name="month"], select[name="month"]');
                const yearEl = form.querySelector('input[name="year"], select[name="year"]');

                if (!dayEl || !monthEl || !yearEl) return null;

                const getText = el => {
                    if (!el) return '';
                    const tag = el.tagName.toLowerCase();
                    if (tag === 'select') {
                        const opt = el.options[el.selectedIndex];
                        return opt ? opt.text.trim() : '';
                    }
                    return el.value ? el.value.trim() : '';
                };

                const day = getText(dayEl);
                const month = getText(monthEl); // This will be the name for select, number for custom input
                const year = getText(yearEl);
                // Ensure month is name if it started as a number for consistency
                const monthNames = [
                    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
                ];
                let monthNameFormatted = month;
                if (!isNaN(month) && parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12) {
                    monthNameFormatted = monthNames[parseInt(month, 10) - 1];
                }

                if (!day || !month || !year) return null;
                return { day, month: monthNameFormatted, year };
            }

            const date = getDateParts(this);
            if (!date) {
                alert('Por favor selecciona una fecha completa.');
                return;
            }

            // Helper to create wa.me URL safely (strip non-digits for phone)
            const buildWaUrl = (message) => {
                const cleanPhone = phoneNumber.replace(/\D/g, '');
                return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
            };

            let message = '';
            // Transportation form branch (has passengers input or specific trip type input)
            if (passengersInput || (tripTypeInput && tripTypeInput.closest('.custom-date-picker'))) {
                const passengers = passengersInput ? passengersInput.value : 'N/A';
                const tripTypeText = tripTypeInput ? tripTypeInput.value.trim() : '';

                if (!tripTypeText) {
                    alert('Por favor selecciona el tipo de servicio (si aplica).');
                    return;
                }

                message = `Hola, me gustaría consultar disponibilidad para: ${tourName}\n` +
                          `Tipo de servicio: ${tripTypeText}\n` +
                          `Número de pasajeros: ${passengers}\n` +
                          `Fecha: ${date.day} de ${date.month} del ${date.year}`;
                if (tourName === 'Servicio de Transporte') {
                    message = `Hola, me gustaría consultar disponibilidad para un ${tourName.toLowerCase()} \n` +
                              `Tipo de servicio: ${tripTypeText}\n` +
                              `Número de pasajeros: ${passengers}\n` +
                              `Fecha: ${date.day} de ${date.month} del ${date.year}`;
                }
            } else {
                // Old "tours" form branch (adults/children)
                const adultsInput = this.querySelector('input[name="adults"]');
                const childrenInput = this.querySelector('input[name="children"]');
                const adults = adultsInput ? adultsInput.value : '1';
                const children = childrenInput ? childrenInput.value : '0';

                message = `Hola, me gustaría consultar disponibilidad para: ${tourName}\n` +
                          `Cantidad de adultos: ${adults}`;
                if (parseInt(children, 10) > 0) {
                    message += `\nCantidad de niños: ${children}`;
                }
                message += `\nFecha: ${date.day} de ${date.month} del ${date.year}`;
            }

            const url = buildWaUrl(message);
            window.open(url, '_blank', 'noopener,noreferrer');

            // If it's the mobile modal, close it after sending WhatsApp
            if(this.closest('.booking-mobile-modal')) {
                this.closest('.booking-mobile-modal').style.display = 'none';
            }
        });
    });
});