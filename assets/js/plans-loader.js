/**
 * ServerX Plans Loader - Carga planes por categoría desde API
 * Compatible con estructura HTML: .product-grid, .product-card
 */

const PlansLoader = (() => {
    'use strict';

    const CONFIG = {
        apiBase: '/api/v1/plans.php',
        categories: {
            'subscription': { selector: '.product-grid:nth-of-type(1)', title: 'Planes de Suscripción' },
            'vps': { selector: '.product-grid:nth-of-type(2)', title: 'VPS (Servidores Virtuales Privados)' },
            'dedicated': { selector: '.product-grid:nth-of-type(3)', title: 'Servidores Dedicados' },
            'whatsapp_bot': { selector: '.product-grid:nth-of-type(4)', title: 'Bots de WhatsApp' },
            'hosting': { selector: '.product-grid:nth-of-type(5)', title: 'Hosting Compartido' },
            'license': { selector: '.product-grid:nth-of-type(6)', title: 'Licencias' },
            'addon': { selector: '.product-grid:nth-of-type(7)', title: 'Addons y Servicios Adicionales' }
        },
        fallbackData: null // Se llena con datos estáticos si la API falla
    };

    let cache = null;

    // ============================================
    // FORMATEO DE DATOS
    // ============================================
    function formatPrice(price, cycle, currency = 'USD') {
        const symbol = currency === 'USD' ? '$' : currency;
        const cycleText = {
            'monthly': '/mes',
            'yearly': '/año',
            'one-time': ''
        };
        return `${symbol}${parseFloat(price).toFixed(2)} <span class="billing-cycle">${cycleText[cycle] || cycle}</span>`;
    }

    function renderSpecs(specs) {
        if (!specs || typeof specs !== 'object') return '';
        return Object.entries(specs)
            .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
            .join('<br>\n');
    }

    function renderFeatures(features) {
        if (!Array.isArray(features)) return '';
        return `<ul>${features.map(f => `<li>${Security.escapeHtml(f)}</li>`).join('')}</ul>`;
    }

    function getDiscountBadge(discount) {
        if (!discount || discount <= 0) return '';
        const labels = { 5: '5% OFF', 10: '10% OFF', 15: 'Popular', 20: 'Mejor Opción' };
        const label = labels[discount] || `-${discount}%`;
        return `<span class="discount-tag">${label}</span>`;
    }

    // ============================================
    // RENDERIZADO DE TARJETA
    // ============================================
    function renderCard(plan) {
        return `
            <div class="product-card" data-plan-id="${plan.id}" data-slug="${plan.slug}">
                <h3>${Security.escapeHtml(plan.name)} ${getDiscountBadge(plan.discount_percent)}</h3>
                <p style="color:var(--muted)">${Security.escapeHtml(plan.description || '')}</p>
                <div class="price">${formatPrice(plan.price, plan.billing_cycle, plan.currency)}</div>
                ${plan.specs && Object.keys(plan.specs).length > 0 ? 
                    `<div class="specs">${renderSpecs(plan.specs)}</div>` : ''}
                ${plan.features?.length > 0 ? 
                    `<div class="features-list">${renderFeatures(plan.features)}</div>` : ''}
                <div class="cta">
                    <a href="${Security.escapeHtml(plan.cta_link || 'register.html?plan=' + plan.slug)}" 
                       class="cta" 
                       data-plan="${plan.slug}">
                        ${Security.escapeHtml(plan.cta_text || 'Comenzar')}
                    </a>
                </div>
            </div>
        `;
    }

    // ============================================
    // RENDERIZADO POR CATEGORÍA
    // ============================================
    function renderCategory(categoryKey, plans) {
        const config = CONFIG.categories[categoryKey];
        const grid = document.querySelector(config?.selector);
        if (!grid) {
            console.warn(`[PlansLoader] Grid no encontrado para: ${categoryKey}`);
            return;
        }

        // Ordenar: featured primero, luego por sort_order, luego por precio
        const sorted = [...plans].sort((a, b) => {
            if (a.is_featured && !b.is_featured) return -1;
            if (!a.is_featured && b.is_featured) return 1;
            if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
            return a.price - b.price;
        });

        grid.innerHTML = sorted.map(plan => renderCard(plan)).join('');
        
        // Animación de entrada
        grid.querySelectorAll('.product-card').forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 50);
        });
    }

    // ============================================
    // CARGA PRINCIPAL
    // ============================================
    async function loadAll() {
        try {
            const response = await fetch(`${CONFIG.apiBase}?t=${Date.now()}`, {
                headers: { 'Accept': 'application/json' },
                cache: 'no-store'
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const result = await response.json();
            
            if (result.success && result.categories) {
                cache = result.categories;
                Object.entries(result.categories).forEach(([cat, plans]) => {
                    renderCategory(cat, plans);
                });
                trackLoad('success', Object.values(result.categories).flat().length);
                return true;
            }
            throw new Error(result.message || 'Respuesta inválida');
            
        } catch (error) {
            console.warn('[PlansLoader] API falló, usando fallback:', error);
            loadFallback();
            trackLoad('fallback');
            return false;
        }
    }

    async function loadByCategory(categoryKey) {
        const config = CONFIG.categories[categoryKey];
        if (!config) return;

        try {
            const response = await fetch(`${CONFIG.apiBase}?category=${categoryKey}&t=${Date.now()}`);
            const result = await response.json();
            
            if (result.success && result.plans) {
                renderCategory(categoryKey, result.plans);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    // ============================================
    // FALLBACK CON DATOS ESTÁTICOS
    // ============================================
    function loadFallback() {
        if (!CONFIG.fallbackData) {
            CONFIG.fallbackData = {
                subscription: [
                    { id: 1, name: 'Starter', slug: 'starter', description: 'Para proyectos pequeños.', price: 3, billing_cycle: 'monthly', features: ['1 Servidor', 'Métricas básicas'], specs: { servers: 1 }, cta_text: 'Comenzar', cta_link: 'register.html?plan=starter' },
                    { id: 2, name: 'Básico', slug: 'basic', description: 'Ideal para equipos pequeños.', price: 10, billing_cycle: 'monthly', features: ['5 Servidores', 'Acceso API'], specs: { servers: 5 }, cta_text: 'Comenzar', cta_link: 'register.html?plan=basic' },
                    { id: 3, name: 'Pro', slug: 'pro', description: 'Soporte 24/7 incluido.', price: 80, billing_cycle: 'monthly', features: ['Soporte 24/7', 'Facturación avanzada'], specs: { support: '24/7' }, cta_text: 'Comenzar', cta_link: 'register.html?plan=pro' },
                    { id: 4, name: 'Business', slug: 'business', description: 'Todo incluido para empresas.', price: 199, billing_cycle: 'monthly', is_featured: true, features: ['50 Servidores', 'SLA 99.9%'], specs: { servers: 50, sla: '99.9%' }, cta_text: 'Comenzar', cta_link: 'register.html?plan=business' }
                ],
                vps: [
                    { id: 10, name: 'VPS Micro', slug: 'vps-micro', description: 'Plan económico para pruebas.', price: 7.99, billing_cycle: 'monthly', features: ['Tráfico 1 TB', 'IP Dedicada'], specs: { cpu: '1 Core', ram: '2 GB', storage: '40 GB SSD' }, cta_text: 'Comprar', cta_link: 'register.html?sku=VPS-MIC-001' },
                    { id: 11, name: 'VPS Básico', slug: 'vps-basic', description: 'Ideal para proyectos pequeños.', price: 15.99, billing_cycle: 'monthly', features: ['SSD Storage', '99.9% Uptime'], specs: { cpu: '2 Cores', ram: '4 GB', storage: '80 GB SSD' }, cta_text: 'Comprar', cta_link: 'register.html?sku=VPS-BAS-001' },
                    { id: 12, name: 'VPS Avanzado', slug: 'vps-advanced', description: 'Para aplicaciones exigentes.', price: 35.99, billing_cycle: 'monthly', discount_percent: 10, features: ['NVMe Storage', 'Priority Support'], specs: { cpu: '4 Cores', ram: '8 GB', storage: '160 GB NVMe' }, cta_text: 'Comprar', cta_link: 'register.html?sku=VPS-ADV-001' }
                ],
                whatsapp_bot: [
                    { id: 30, name: 'Mini Chatbot', slug: 'bot-mini', description: 'Respuesta automática básica.', price: 29, billing_cycle: 'monthly', features: ['3 reglas de respuesta', 'Google Sheets'], specs: { contacts: 500 }, cta_text: 'Comenzar', cta_link: 'register.html?sku=BOT-MINI-001' },
                    { id: 31, name: 'Business Flow', slug: 'bot-business', description: 'Flujos conversacionales avanzados.', price: 79, billing_cycle: 'monthly', is_featured: true, features: ['Flujos ilimitados', 'Integración CRM', 'Multi-agente'], specs: { contacts: 5000, agents: 5 }, cta_text: 'Comenzar', cta_link: 'register.html?sku=BOT-BUS-001' }
                ]
                // ... agregar más categorías según necesites
            };
        }

        Object.entries(CONFIG.fallbackData).forEach(([cat, plans]) => {
            renderCategory(cat, plans);
        });
    }

    // ============================================
    // ANALYTICS (opcional)
    // ============================================
    function trackLoad(status, count = 0) {
        if (typeof gtag === 'function') {
            gtag('event', 'plans_loaded', {
                event_category: 'pricing',
                event_label: status,
                value: count
            });
        }
    }

    function trackPlanClick(slug, category) {
        if (typeof gtag === 'function') {
            gtag('event', 'plan_cta_click', {
                event_category: 'conversion',
                event_label: `${category}:${slug}`
            });
        }
    }

    // ============================================
    // EVENT DELEGATION
    // ============================================
    function setupEventListeners() {
        document.addEventListener('click', (e) => {
            const cta = e.target.closest('.cta[data-plan]');
            if (cta) {
                const slug = cta.dataset.plan;
                const card = cta.closest('.product-card');
                const category = Object.keys(CONFIG.categories).find(k => 
                    document.querySelector(CONFIG.categories[k].selector)?.contains(card)
                );
                trackPlanClick(slug, category);
            }
        });
    }

    // ============================================
    // SEGURIDAD: Escape HTML básico
    // ============================================
    const Security = {
        escapeHtml: (str) => {
            if (typeof str !== 'string') return str;
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
            return str.replace(/[&<>"']/g, m => map[m]);
        }
    };

    // ============================================
    // INICIALIZACIÓN
    // ============================================
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bootstrap);
        } else {
            bootstrap();
        }
    }

    async function bootstrap() {
        setupEventListeners();
        
        // Intentar cargar desde API, con timeout de 5s
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        
        try {
            await Promise.race([
                loadAll(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
            ]);
        } catch {
            loadFallback();
        } finally {
            clearTimeout(timeout);
        }
    }

    // ============================================
    // API PÚBLICA
    // ============================================
    return {
        init,
        loadAll,
        loadByCategory,
        refresh: loadAll,
        getCache: () => cache,
        renderCard // Útil para renderizar dinámicamente
    };
})();

// Auto-inicializar
if (typeof document !== 'undefined') {
    PlansLoader.init();
}

// Exportar para módulos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlansLoader;
}