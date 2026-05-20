/**
 * BotWA Pro - Testimonials Module
 * Dynamic carousel implementation for testimonials
 * 
 * @version 1.0.0
 * @author BotWA Pro Team
 */

(function() {
    'use strict';

    // ========================================
    // DATA - Testimonios
    // ========================================
    const TESTIMONIALS_DATA = [
        {
            id: 1,
            name: 'Juan C.',
            role: 'E-commerce',
            location: 'Guayaquil, EC',
            avatar: 'JC',
            rating: 5,
            content: 'Antes perdía ventas por caídas de sesión. Con BotWA Pro mi bot funciona 24/7 sin interrupciones. ¡Recomendado 100%!'
        },
        {
            id: 2,
            name: 'Laura M.',
            role: 'Agencia de Marketing',
            location: 'Quito, EC',
            avatar: 'LM',
            rating: 5,
            content: 'El soporte es increíble. Tuve un problema con la API a las 2 AM y me ayudaron en menos de 10 minutos por WhatsApp. Eso es compromiso.'
        },
        {
            id: 3,
            name: 'Ricardo D.',
            role: 'Desarrollador',
            location: 'Ventanas, EC',
            avatar: 'RD',
            rating: 5,
            content: 'Configuré mi servidor en 20 minutos. Ya tenía Node.js, PM2 y Baileys listos. Ahorré horas de configuración técnica.'
        },
        {
            id: 4,
            name: 'Ana P.',
            role: 'Tienda Online',
            location: 'Medellín, CO',
            avatar: 'AP',
            rating: 5,
            content: 'Manejo 3 números de WhatsApp desde un solo servidor. El plan Pro vale cada centavo. Mis ventas aumentaron un 40% en el primer mes.'
        },
        {
            id: 5,
            name: 'Miguel R.',
            role: 'Inmobiliaria',
            location: 'Lima, PE',
            avatar: 'MR',
            rating: 5,
            content: 'Probé otros proveedores y siempre tenía bloqueos. Con BotWA Pro llevo 6 meses sin un solo bloqueo. Las IPs limpias marcan la diferencia.'
        },
        {
            id: 6,
            name: 'Carlos S.',
            role: 'Consultor',
            location: 'Buenos Aires, AR',
            avatar: 'CS',
            rating: 5,
            content: 'El soporte en español es un diferencial enorme. Me explican todo con claridad y paciencia. No necesito ser experto técnico para manejar el servidor.'
        }
    ];

    // ========================================
    // CONFIGURACIÓN
    // ========================================
    const CONFIG = {
        containerId: 'testimonials-container',
        autoplayInterval: 5000,
        transitionSpeed: 400,
        selectors: {
            track: '.testimonials-track',
            slides: '.testimonial-slide',
            prevBtn: '.prev-testimonial',
            nextBtn: '.next-testimonial',
            indicators: '.indicator',
            autoplayInput: '#autoplayTestimonials'
        },
        classes: {
            active: 'active',
            prev: 'prev',
            next: 'next',
            loading: 'is-loading',
            paused: 'is-paused'
        }
    };

    // ========================================
    // MÓDULO: TESTIMONIOS
    // ========================================
    const Testimonials = {
        currentIndex: 0,
        intervalId: null,
        isPaused: false,
        container: null,

        init() {
            this.container = document.getElementById(CONFIG.containerId);
            if (!this.container) return;

            this.render();
            this.setupEvents();
            this.updateCarousel();
            this.startAutoplay();

            console.log('[BotWA] Testimonios inicializados');
        },

        render() {
            const html = `
                <section class="testimonials-section" aria-labelledby="testi-title">
                    <div class="container">
                        <div class="testimonials-header">
                            <h2 id="testi-title">Lo que dicen <span class="gradient-text">nuestros clientes</span></h2>
                            <p class="testimonials-subtitle">Historias reales de éxito de empresas que confían en BotWA Pro.</p>
                            
                            <div class="testimonials-controls">
                                <button class="testimonial-nav-btn prev-testimonial" aria-label="Testimonio anterior">
                                    <i class="fas fa-chevron-left" aria-hidden="true"></i>
                                </button>
                                <button class="testimonial-nav-btn next-testimonial" aria-label="Siguiente testimonio">
                                    <i class="fas fa-chevron-right" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>

                        <div class="testimonials-carousel ${CONFIG.classes.loading}">
                            <div class="testimonials-track">
                                ${TESTIMONIALS_DATA.map(t => this.createTestimonialHTML(t)).join('')}
                            </div>
                        </div>

                        <div class="testimonials-indicators">
                            ${TESTIMONIALS_DATA.map((_, i) => `
                                <button class="indicator ${i === 0 ? 'active' : ''}" 
                                        data-index="${i}" 
                                        aria-label="Ir al testimonio ${i + 1}">
                                </button>
                            `).join('')}
                        </div>

                        <div class="testimonials-autoplay">
                            <label class="autoplay-toggle">
                                <input type="checkbox" id="autoplayTestimonials" checked>
                                <span class="toggle-slider"></span>
                                <span class="toggle-label">Autoplay</span>
                            </label>
                        </div>

                        <div class="testimonials-cta">
                            <a href="testimonios.html" class="btn-secondary">Ver todos los testimonios</a>
                        </div>
                    </div>
                </section>
            `;
            this.container.innerHTML = html;
            
            // Remover estado de carga
            setTimeout(() => {
                const carousel = this.container.querySelector('.testimonials-carousel');
                if (carousel) carousel.classList.remove(CONFIG.classes.loading);
            }, 100);
        },

        createTestimonialHTML(t) {
            const stars = Array(t.rating).fill('<i class="fas fa-star" aria-hidden="true"></i>').join('');
            
            return `
                <div class="testimonial-slide">
                    <article class="testimonial-card">
                        <div class="testimonial-rating" role="img" aria-label="${t.rating} de 5 estrellas">
                            ${stars}
                        </div>
                        <div class="testimonial-content">
                            <p>${t.content}</p>
                        </div>
                        <div class="testimonial-author">
                            <div class="author-avatar">${t.avatar}</div>
                            <div class="author-info">
                                <h4 class="author-name">${t.name}</h4>
                                <p class="author-role">${t.role} • ${t.location}</p>
                            </div>
                            <div class="author-badge">
                                <i class="fas fa-check-circle"></i> Verificado
                            </div>
                        </div>
                    </article>
                </div>
            `;
        },

        setupEvents() {
            const prevBtn = this.container.querySelector(CONFIG.selectors.prevBtn);
            const nextBtn = this.container.querySelector(CONFIG.selectors.nextBtn);
            const indicators = this.container.querySelectorAll(CONFIG.selectors.indicators);
            const autoplayToggle = this.container.querySelector(CONFIG.selectors.autoplayInput);
            const carousel = this.container.querySelector('.testimonials-carousel');

            prevBtn.addEventListener('click', () => this.prev());
            nextBtn.addEventListener('click', () => this.next());

            indicators.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    this.goTo(index);
                });
            });

            autoplayToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.startAutoplay();
                } else {
                    this.stopAutoplay();
                }
            });

            // Pause on hover
            carousel.addEventListener('mouseenter', () => {
                this.isPaused = true;
                carousel.classList.add(CONFIG.classes.paused);
            });

            carousel.addEventListener('mouseleave', () => {
                this.isPaused = false;
                carousel.classList.remove(CONFIG.classes.paused);
            });

            // Teclado
            this.container.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            });

            // Soporte Touch (Básico)
            let touchStartX = 0;
            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            carousel.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) this.next();
                if (touchEndX - touchStartX > 50) this.prev();
            }, { passive: true });
        },

        updateCarousel() {
            const track = this.container.querySelector(CONFIG.selectors.track);
            const slides = this.container.querySelectorAll(CONFIG.selectors.slides);
            const indicators = this.container.querySelectorAll(CONFIG.selectors.indicators);

            // Calcular desplazamiento
            // El track tiene gap, hay que tenerlo en cuenta si es manual
            // Pero el CSS usa flex: 0 0 100% o 33% etc.
            // Para simplicidad en este diseño de BotWA, usamos transform percent
            const slideWidth = slides[0].offsetWidth;
            const gap = 20; // var(--space-5) es usualmente 1.25rem = 20px
            
            // Enfoque moderno: transform según el índice
            // Pero como el CSS tiene anchos variables (responsive), mejor calcular el offset real
            const offset = slides[this.currentIndex].offsetLeft - track.offsetLeft;
            track.style.transform = `translateX(-${offset}px)`;

            // Actualizar clases
            slides.forEach((slide, i) => {
                slide.classList.remove(CONFIG.classes.active, CONFIG.classes.prev, CONFIG.classes.next);
                
                if (i === this.currentIndex) {
                    slide.classList.add(CONFIG.classes.active);
                } else if (i === this.currentIndex - 1 || (this.currentIndex === 0 && i === slides.length - 1)) {
                    slide.classList.add(CONFIG.classes.prev);
                } else if (i === this.currentIndex + 1 || (this.currentIndex === slides.length - 1 && i === 0)) {
                    slide.classList.add(CONFIG.classes.next);
                }
            });

            // Actualizar indicadores
            indicators.forEach((ind, i) => {
                ind.classList.toggle(CONFIG.classes.active, i === this.currentIndex);
            });
        },

        next() {
            this.currentIndex = (this.currentIndex + 1) % TESTIMONIALS_DATA.length;
            this.updateCarousel();
        },

        prev() {
            this.currentIndex = (this.currentIndex - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length;
            this.updateCarousel();
        },

        goTo(index) {
            this.currentIndex = index;
            this.updateCarousel();
        },

        startAutoplay() {
            this.stopAutoplay();
            this.intervalId = setInterval(() => {
                if (!this.isPaused) {
                    this.next();
                }
            }, CONFIG.autoplayInterval);
        },

        stopAutoplay() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }
    };

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Testimonials.init());
    } else {
        Testimonials.init();
    }

})();
