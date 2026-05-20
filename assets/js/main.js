/**
 * BotWA Pro - JavaScript Principal
 * Servidores para WhatsApp Business
 * 
 * @version 2.0.0
 * @author BotWA Pro Team
 * @license MIT
 */

(function() {
    'use strict';

    // ========================================
    // CONFIGURACIÓN GLOBAL
    // ========================================
    const CONFIG = {
        // Timings
        loaderDelay: 1000,
        toastDuration: 3000,
        scrollThreshold: 50,
        counterDuration: 2000,
        
        // Selectores
        selectors: {
            loader: '#loader',
            scrollProgress: '#scrollProgress',
            navbar: '#navbar',
            toast: '#toast',
            toastMessage: '#toastMessage',
            statNumber: '.stat-number',
            statsSection: '.stats',
            navLinks: '.nav-links',
            mobileToggle: '.mobile-menu-toggle',
            smoothLinks: 'a[href^="#"]',
            cards: '.feature-card, .testimonial-card',
            heroContent: '.hero-content',
            footerYear: '.footer-bottom p, #currentYear'
        },
        
        // Clases de estado
        classes: {
            hidden: 'hidden',
            scrolled: 'scrolled',
            active: 'active',
            show: 'show'
        },
        
        // WhatsApp
        whatsapp: {
            phone: '593991459589',
            defaultText: 'Hola, quiero información sobre los servidores para WhatsApp'
        },
        
        // Accesibilidad
        a11y: {
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            highContrast: window.matchMedia('(prefers-contrast: high)').matches
        }
    };

    // ========================================
    // UTILITIES - Funciones Helper
    // ========================================
    const Utils = {
        /**
         * Debounce: limita la frecuencia de ejecución de una función
         */
        debounce: (func, wait = 150) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Throttle: ejecuta una función como máximo cada X ms
         */
        throttle: (func, limit = 100) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        /**
         * Obtiene elemento del DOM con validación
         */
        getElement: (selector) => {
            const element = document.querySelector(selector);
            if (!element) {
                console.warn(`[BotWA] Elemento no encontrado: ${selector}`);
            }
            return element;
        },

        /**
         * Obtiene múltiples elementos del DOM
         */
        getElements: (selector) => {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                console.warn(`[BotWA] Elementos no encontrados: ${selector}`);
            }
            return elements;
        },

        /**
         * Verifica si un elemento está en el viewport
         */
        isInViewport: (element, threshold = 0.5) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight * threshold) &&
                rect.bottom >= (window.innerHeight * (1 - threshold))
            );
        },

        /**
         * Formatea números con separadores de miles
         */
        formatNumber: (num, decimals = 0) => {
            return new Intl.NumberFormat('es-EC', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }).format(num);
        },

        /**
         * Easing function para animaciones suaves
         */
        easeOutQuart: (x) => 1 - Math.pow(1 - x, 4)
    };

    // ========================================
    // MÓDULO: LOADER
    // ========================================
    const Loader = {
        init() {
            const loader = Utils.getElement(CONFIG.selectors.loader);
            if (!loader) return;

            // Ocultar loader después del delay configurado
            setTimeout(() => {
                loader.classList.add(CONFIG.classes.hidden);
                
                // Remover del DOM después de la transición para liberar memoria
                loader.addEventListener('transitionend', () => {
                    if (loader.classList.contains(CONFIG.classes.hidden)) {
                        loader.style.display = 'none';
                    }
                }, { once: true });
            }, CONFIG.loaderDelay);
        }
    };

    // ========================================
    // MÓDULO: SCROLL PROGRESS
    // ========================================
    const ScrollProgress = {
        init() {
            const progressBar = Utils.getElement(CONFIG.selectors.scrollProgress);
            if (!progressBar) return;

            // Usar throttle para optimizar rendimiento
            const updateProgress = Utils.throttle(() => {
                const scrollPercent = this.calculateScrollPercent();
                progressBar.style.width = `${scrollPercent}%`;
            }, 50);

            window.addEventListener('scroll', updateProgress, { passive: true });
            
            // Actualizar inicial
            updateProgress();
        },

        calculateScrollPercent() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            return docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        }
    };

    // ========================================
    // MÓDULO: NAVBAR
    // ========================================
    const Navbar = {
        init() {
            const navbar = Utils.getElement(CONFIG.selectors.navbar);
            if (!navbar) return;

            const handleScroll = Utils.throttle(() => {
                if (window.scrollY > CONFIG.scrollThreshold) {
                    navbar.classList.add(CONFIG.classes.scrolled);
                } else {
                    navbar.classList.remove(CONFIG.classes.scrolled);
                }
            }, 100);

            window.addEventListener('scroll', handleScroll, { passive: true });
            
            // Estado inicial
            handleScroll();
        }
    };

    // ========================================
    // MÓDULO: SMOOTH SCROLLING
    // ========================================
    const SmoothScroll = {
        init() {
            const links = Utils.getElements(CONFIG.selectors.smoothLinks);
            
            links.forEach(link => {
                link.addEventListener('click', (e) => this.handleClick(e, link));
            });
        },

        handleClick(e, link) {
            const href = link.getAttribute('href');
            
            // Ignorar enlaces externos o con target blank
            if (link.target === '_blank' || href.startsWith('#!')) return;
            
            // Ignorar si no es ancla interna
            if (!href.startsWith('#')) return;
            
            e.preventDefault();
            
            const targetId = href === '#' ? 'top' : href.substring(1);
            const targetElement = targetId === 'top' 
                ? document.body 
                : document.getElementById(targetId);

            if (targetElement) {
                // Offset para navbar fijo
                const navbar = Utils.getElement(CONFIG.selectors.navbar);
                const offset = navbar ? navbar.offsetHeight + 20 : 80;
                
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                // Respetar preferencia de movimiento reducido
                if (CONFIG.a11y.reducedMotion) {
                    window.scrollTo(0, offsetPosition);
                } else {
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }

                // Actualizar URL sin recargar
                history.pushState(null, null, href);
                
                // Enfocar el elemento para accesibilidad
                if (targetElement.tabIndex === -1) {
                    targetElement.setAttribute('tabindex', '-1');
                }
                targetElement.focus({ preventScroll: true });
            }
        }
    };

    // ========================================
    // MÓDULO: COUNTER ANIMATION
    // ========================================
    const CounterAnimation = {
        init() {
            const statsSection = Utils.getElement(CONFIG.selectors.statsSection);
            if (!statsSection) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateAll(entry.target);
                        observer.unobserve(entry.target); // Dejar de observar después de animar
                    }
                });
            }, { 
                threshold: 0.5,
                rootMargin: '0px 0px -10% 0px'
            });

            observer.observe(statsSection);
        },

        animateAll(container) {
            const counters = container.querySelectorAll(CONFIG.selectors.statNumber);
            
            counters.forEach((counter, index) => {
                // Stagger animation para efecto escalonado
                setTimeout(() => {
                    this.animateCounter(counter);
                }, index * 200);
            });
        },

        animateCounter(element) {
            // Evitar animar si ya se animó
            if (element.dataset.animated === 'true') return;
            
            const target = parseFloat(element.getAttribute('data-target'));
            const isDecimal = target % 1 !== 0;
            const duration = CONFIG.counterDuration;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Aplicar easing para animación más natural
                const easedProgress = Utils.easeOutQuart(progress);
                const currentValue = target * easedProgress;

                element.textContent = isDecimal 
                    ? currentValue.toFixed(1) 
                    : Utils.formatNumber(Math.floor(currentValue));

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Valor final exacto
                    element.textContent = isDecimal 
                        ? target.toFixed(1) 
                        : Utils.formatNumber(target);
                    element.dataset.animated = 'true';
                }
            };

            requestAnimationFrame(animate);
        }
    };

    // ========================================
    // MÓDULO: TOAST NOTIFICATIONS
    // ========================================
    const Toast = {
        queue: [],
        isVisible: false,

        init() {
            // Exponer función global para compatibilidad
            window.showToast = (message, type = 'success') => {
                this.show(message, type);
            };
        },

        show(message, type = 'success') {
            const toast = Utils.getElement(CONFIG.selectors.toast);
            const toastMessage = Utils.getElement(CONFIG.selectors.toastMessage);
            
            if (!toast || !toastMessage) return;

            // Agregar a cola si ya hay uno visible
            if (this.isVisible) {
                this.queue.push({ message, type });
                return;
            }

            // Configurar toast
            toastMessage.textContent = message;
            toast.setAttribute('aria-live', 'assertive');
            
            // Icono según tipo
            const icon = toast.querySelector('.toast-icon i');
            if (icon) {
                const icons = {
                    success: 'fa-check',
                    error: 'fa-times',
                    warning: 'fa-exclamation',
                    info: 'fa-info'
                };
                icon.className = `fas ${icons[type] || icons.success}`;
            }

            // Mostrar
            this.isVisible = true;
            toast.classList.add(CONFIG.classes.show);

            // Ocultar después del timeout
            setTimeout(() => {
                toast.classList.remove(CONFIG.classes.show);
                this.isVisible = false;
                
                // Procesar siguiente en cola
                if (this.queue.length > 0) {
                    const next = this.queue.shift();
                    this.show(next.message, next.type);
                }
            }, CONFIG.toastDuration);
        }
    };

    // ========================================
    // MÓDULO: MOBILE MENU
    // ========================================
    const MobileMenu = {
        isOpen: false,

        init() {
            const toggle = Utils.getElement(CONFIG.selectors.mobileToggle);
            const navLinks = Utils.getElement(CONFIG.selectors.navLinks);
            
            if (!toggle || !navLinks) return;

            // Click en toggle
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle(navLinks, toggle);
            });

            // Cerrar al hacer click en un enlace
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (this.isOpen) this.close(navLinks, toggle);
                });
            });

            // Cerrar al hacer click fuera
            document.addEventListener('click', (e) => {
                if (this.isOpen && !e.target.closest('.nav-container')) {
                    this.close(navLinks, toggle);
                }
            });

            // Cerrar con tecla Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close(navLinks, toggle);
                    toggle.focus();
                }
            });

            // Prevenir scroll cuando el menú está abierto
            const preventScroll = (e) => {
                if (this.isOpen) e.preventDefault();
            };
            document.addEventListener('touchmove', preventScroll, { passive: false });
        },

        toggle(navLinks, toggle) {
            this.isOpen ? this.close(navLinks, toggle) : this.open(navLinks, toggle);
        },

        open(navLinks, toggle) {
            this.isOpen = true;
            navLinks.classList.add(CONFIG.classes.active);
            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', 'Cerrar menú');
            
            // Bloquear scroll del body
            document.body.style.overflow = 'hidden';
            
            // Enfocar primer enlace para accesibilidad
            const firstLink = navLinks.querySelector('a');
            if (firstLink) firstLink.focus();
        },

        close(navLinks, toggle) {
            this.isOpen = false;
            navLinks.classList.remove(CONFIG.classes.active);
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Abrir menú');
            
            // Restaurar scroll
            document.body.style.overflow = '';
        }
    };

    // ========================================
    // MÓDULO: PARALLAX EFFECT
    // ========================================
    const Parallax = {
        init() {
            if (CONFIG.a11y.reducedMotion) return; // Respetar preferencia de usuario

            const heroContent = Utils.getElement(CONFIG.selectors.heroContent);
            if (!heroContent) return;

            const handleScroll = Utils.throttle(() => {
                const scrolled = window.pageYOffset;
                const maxScroll = 1200;
                
                // Transformación suave con límite
                const translateY = Math.min(scrolled * 0.15, 180);
                const opacity = Math.max(0, 1 - scrolled / maxScroll);

                heroContent.style.transform = `translateY(${translateY}px)`;
                heroContent.style.opacity = opacity;
            }, 50);

            window.addEventListener('scroll', handleScroll, { passive: true });
        }
    };

    // ========================================
    // MÓDULO: CARD HOVER EFFECTS
    // ========================================
    const CardEffects = {
        init() {
            if (CONFIG.a11y.reducedMotion) return;

            const cards = Utils.getElements(CONFIG.selectors.cards);
            
            cards.forEach(card => {
                // Usar CSS para hover cuando sea posible (mejor rendimiento)
                // Este JS es fallback para navegadores antiguos
                card.addEventListener('mouseenter', function() {
                    this.style.willChange = 'transform';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.willChange = 'auto';
                });
            });
        }
    };

    // ========================================
    // MÓDULO: FOOTER & UTILITIES
    // ========================================
    const Footer = {
        init() {
            this.updateYear();
            this.setupExternalLinks();
        },

        updateYear() {
            const elements = Utils.getElements(CONFIG.selectors.footerYear);
            const currentYear = new Date().getFullYear();
            
            elements.forEach(el => {
                if (el.id === 'currentYear') {
                    el.textContent = currentYear;
                } else if (el.textContent.includes('2025')) {
                    el.innerHTML = el.innerHTML.replace('2025', currentYear);
                }
            });
        },

        setupExternalLinks() {
            // Asegurar que todos los enlaces externos tengan rel="noopener"
            document.querySelectorAll('a[target="_blank"]').forEach(link => {
                const rel = link.getAttribute('rel') || '';
                if (!rel.includes('noopener')) {
                    link.setAttribute('rel', `${rel} noopener noreferrer`.trim());
                }
            });
        }
    };

    // ========================================
    // MÓDULO: WHATSAPP INTEGRATION
    // ========================================
    const WhatsApp = {
        init() {
            // Configurar enlaces de WhatsApp con parámetros UTM opcionales
            document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
                // Asegurar atributos de seguridad
                if (link.target === '_blank') {
                    link.setAttribute('rel', 'noopener noreferrer');
                }
                
                // Tracking opcional: agregar UTM si no existe
                if (link.href.includes('?text=') && !link.href.includes('utm_source')) {
                    const separator = link.href.includes('?') ? '&' : '?';
                    link.href += `${separator}utm_source=website&utm_medium=cta`;
                }
            });
        },

        /**
         * Abre WhatsApp con mensaje personalizado
         * @param {string} message - Mensaje a enviar
         * @param {string} source - Fuente del clic para tracking
         */
        open(message = CONFIG.whatsapp.defaultText, source = 'website') {
            const phone = CONFIG.whatsapp.phone;
            const text = encodeURIComponent(message);
            const url = `https://wa.me/${phone}?text=${text}&utm_source=${source}`;
            
            window.open(url, '_blank', 'noopener,noreferrer');
            Toast.show('¡Conectando con WhatsApp!', 'info');
        }
    };

    // ========================================
    // MÓDULO: ANALYTICS (Opcional)
    // ========================================
    const Analytics = {
        init() {
            // Placeholder para integración con Google Analytics, Meta Pixel, etc.
            // Ejemplo: trackear clicks en CTAs
            document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const label = btn.textContent.trim() || btn.getAttribute('aria-label');
                    this.trackEvent('click', 'button', label);
                });
            });
        },

        trackEvent(category, action, label, value = null) {
            // Google Analytics 4 example:
            if (typeof gtag === 'function') {
                gtag('event', action, {
                    event_category: category,
                    event_label: label,
                    value: value
                });
            }
            
            // Consola para debugging en desarrollo
            if (window.location.hostname === 'localhost') {
                console.log(`[Analytics] ${category} > ${action} > ${label}`);
            }
        }
    };

    // ========================================
    // MÓDULO: REVEAL ON SCROLL
    // ========================================
    const Reveal = {
        init() {
            const reveals = Utils.getElements('.reveal');
            if (reveals.length === 0) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(CONFIG.classes.active);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            reveals.forEach(reveal => observer.observe(reveal));
        }
    };

    // ========================================
    // MÓDULO: PERFORMANCE MONITORING
    // ========================================
    const Performance = {
        init() {
            // Solo en desarrollo o si se habilita explícitamente
            if (!window.DEBUG_PERF) return;

            // Core Web Vitals básicos
            if ('PerformanceObserver' in window) {
                // LCP (Largest Contentful Paint)
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log(`[Perf] LCP: ${Math.round(lastEntry.startTime)}ms`);
                }).observe({ entryTypes: ['largest-contentful-paint'] });

                // CLS (Cumulative Layout Shift)
                let clsValue = 0;
                new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) clsValue += entry.value;
                    }
                    console.log(`[Perf] CLS acumulado: ${clsValue.toFixed(3)}`);
                }).observe({ entryTypes: ['layout-shift'] });
            }
        }
    };

    // ========================================
    // INICIALIZACIÓN PRINCIPAL
    // ========================================
    const App = {
        modules: [
            Loader,
            ScrollProgress,
            Navbar,
            SmoothScroll,
            CounterAnimation,
            Toast,
            MobileMenu,
            Parallax,
            Reveal,
            Footer,
            WhatsApp,
            Analytics,
            Performance
        ],

        init() {
            console.log('[BotWA Pro] Inicializando aplicación v2.0.0');
            
            // Inicializar módulos en orden
            this.modules.forEach(module => {
                try {
                    if (typeof module.init === 'function') {
                        module.init();
                        console.log(`[BotWA] ✓ ${module.constructor?.name || 'Module'} cargado`);
                    }
                } catch (error) {
                    console.error(`[BotWA] ✗ Error en ${module.constructor?.name || 'Module'}:`, error);
                }
            });

            // Evento personalizado cuando la app está lista
            document.dispatchEvent(new CustomEvent('botwa:ready'));
            
            console.log('[BotWA Pro] ✓ Aplicación lista');
        }
    };

    // ========================================
    // INICIAR CUANDO EL DOM ESTÉ LISTO
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        // DOM ya está listo (cache o carga rápida)
        App.init();
    }

    // Exponer API global para debugging/integraciones
    window.BotWA = {
        config: CONFIG,
        utils: Utils,
        showToast: Toast.show.bind(Toast),
        openWhatsApp: WhatsApp.open.bind(WhatsApp)
    };

})();