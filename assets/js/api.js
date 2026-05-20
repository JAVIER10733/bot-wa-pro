// assets/js/api.js
// Cliente JavaScript para consumir la API de BotWA Pro

const API = (() => {
    'use strict';

    const BASE_URL = '/BotWA-Pro/api/v1';

    // ============================================
    // TOKEN
    // ============================================
    const getToken = () => localStorage.getItem('botwa_token');
    const setToken = (token) => localStorage.setItem('botwa_token', token);
    const clearToken = () => localStorage.removeItem('botwa_token');
    const getUser = () => JSON.parse(localStorage.getItem('botwa_user') || 'null');
    const setUser = (user) => localStorage.setItem('botwa_user', JSON.stringify(user));
    const clearUser = () => localStorage.removeItem('botwa_user');
    const isLoggedIn = () => !!getToken();

    // ============================================
    // FETCH BASE
    // ============================================
    async function request(endpoint, options = {}) {
        const token = getToken();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            ...options
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const res = await fetch(`${BASE_URL}${endpoint}`, config);
            const data = await res.json();

            // Token expirado: limpiar sesión y redirigir
            if (res.status === 401) {
                clearToken();
                clearUser();
                window.location.href = '/BotWA-Pro/auth/login.html';
                return;
            }

            return { ok: res.ok, status: res.status, data };
        } catch (err) {
            console.error('[API] Error de red:', err);
            return { ok: false, status: 0, data: { message: 'Error de conexión' } };
        }
    }

    // ============================================
    // AUTH
    // ============================================
    const auth = {
        async login(email, password) {
            const res = await request('/auth.php?action=login', {
                method: 'POST',
                body: { email, password }
            });
            if (res?.ok && res.data.token) {
                setToken(res.data.token);
                setUser(res.data.user);
            }
            return res;
        },

        async register(name, email, password) {
            const res = await request('/auth.php?action=register', {
                method: 'POST',
                body: { name, email, password }
            });
            if (res?.ok && res.data.token) {
                setToken(res.data.token);
                setUser(res.data.user);
            }
            return res;
        },

        async me() {
            return await request('/auth.php?action=me');
        },

        logout() {
            clearToken();
            clearUser();
            window.location.href = '/BotWA-Pro/auth/login.html';
        }
    };

    // ============================================
    // PLANES
    // ============================================
    const plans = {
        async getAll() {
            return await request('/plans.php');
        },
        async getOne(id) {
            return await request(`/plans.php?action=single&id=${id}`);
        }
    };

    // ============================================
    // PAGOS
    // ============================================
    const payments = {
        async getMine() {
            return await request('/payments.php?action=mine');
        },
        async create(planId, method) {
            return await request('/payments.php?action=create', {
                method: 'POST',
                body: { plan_id: planId, method }
            });
        }
    };

    // ============================================
    // BOTS
    // ============================================
    const bots = {
        async getAll() {
            return await request('/bots.php');
        },
        async getOne(id) {
            return await request(`/bots.php?action=single&id=${id}`);
        },
        async create(name, phoneNumber) {
            return await request('/bots.php?action=create', {
                method: 'POST',
                body: { name, phone_number: phoneNumber }
            });
        },
        async update(id, data) {
            return await request(`/bots.php?action=update&id=${id}`, {
                method: 'PUT',
                body: data
            });
        },
        async delete(id) {
            return await request(`/bots.php?id=${id}`, {
                method: 'DELETE'
            });
        },
        async setStatus(id, status) {
            return await request(`/bots.php?action=status&id=${id}`, {
                method: 'POST',
                body: { status }
            });
        }
    };

    // ============================================
    // GUARDS: proteger páginas
    // ============================================
    function requireAuth() {
        if (!isLoggedIn()) {
            window.location.href = '/BotWA-Pro/auth/login.html';
        }
    }

    function requireAdmin() {
        const user = getUser();
        if (!user || user.role !== 'admin') {
            window.location.href = '/BotWA-Pro/index.html';
        }
    }

    function redirectIfLoggedIn(redirectTo = '/BotWA-Pro/cliente/dashboard.html') {
        if (isLoggedIn()) {
            window.location.href = redirectTo;
        }
    }

    // ============================================
    // PUBLIC API
    // ============================================
    return {
        auth,
        plans,
        payments,
        bots,
        isLoggedIn,
        getUser,
        getToken,
        requireAuth,
        requireAdmin,
        redirectIfLoggedIn
    };

})();

// Exponer globalmente
window.API = API;