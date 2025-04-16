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

// ===== CARRUSEL MEJORADO (Fixed) =====
function setupCarousel() {
    // Selectores
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const nextButton = document.querySelector('.carousel-button-right');
    const prevButton = document.querySelector('.carousel-button-left');
    const dots = document.querySelectorAll('.carousel-indicator');
    const container = document.querySelector('.carousel-container');

    if (!track || slides.length === 0) return;

    // Configuración
    let currentSlide = 0;
    const autoPlayDelay = 8000; // 8 segundos
    let intervalId, timeoutId;
    let isPaused = false;

    // Función para calcular el ancho del slide (FIXED)
    const calculateSlideWidth = () => {
        const slide = slides[0];
        return slide ? slide.getBoundingClientRect().width : 0;
    };
    let slideWidth = calculateSlideWidth();

    // Transiciones (optimizadas)
    track.style.transition = 'transform 0.7s cubic-bezier(0.33, 0, 0.2, 1)';
    slides.forEach(slide => {
        slide.style.transition = 'opacity 0.5s ease';
    });

    // Actualizar carrusel (VERSIÓN CORREGIDA)
    const updateCarousel = () => {
        slideWidth = calculateSlideWidth(); // Recalcula en cada cambio
        track.style.transform = `translateX(-${slideWidth * currentSlide}px)`;
        
        // Resetear opacidad
        slides.forEach(slide => slide.style.opacity = '0');
        // Mostrar slide actual
        slides[currentSlide].style.opacity = '1';
        
        // Actualizar clases (indicadores)
        slides.forEach((slide, i) => {
            slide.classList.toggle('current-slide', i === currentSlide);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('current-slide', i === currentSlide);
        });
    };

    // Navegación
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    };

    // Autoplay (optimizado)
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

    // Eventos (sin cambios)
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

    // Pausar al interactuar
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

    // Inicialización (CON RECÁLCULO DE ANCHO)
    const init = () => {
        slideWidth = calculateSlideWidth();
        updateCarousel();
        if (!isPaused) startAutoPlay();
        
        // Recalcular en resize (FIXED)
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

// ===== INICIALIZACIÓN MANUAL (sin DOMContentLoaded) =====
setupMenu();
setupCarousel();