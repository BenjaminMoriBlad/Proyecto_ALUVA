/* ==========================================================================
   ALUVA - API CLIENT (Fase 3/4 Stub)
   Capa de abstracción para llamadas HTTP al backend.
   Fase 1: Solo documentación y estructura. Sin llamadas reales aún.
   Fase 3: Implementar endpoints /api/products, /api/checkout, /api/tracking.
   Fase 4: Añadir manejo de tokens CSRF, refresh de JWT y webhooks.
   ========================================================================== */

const ApiClient = (() => {

  // Base URL del API backend (configurar por entorno en Fase 3)
  const BASE_URL = '/api'; // Cambiará a process.env.NEXT_PUBLIC_API_URL en Next.js

  /**
   * Realiza una petición HTTP autenticada con headers de seguridad.
   * @param {string} endpoint - Ruta relativa, ej: '/products'
   * @param {RequestInit} options - Opciones de fetch
   * @returns {Promise<any>}
   */
  async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const defaultHeaders = {
      'Content-Type':   'application/json',
      'Accept':         'application/json',
      // En Fase 3: agregar X-CSRF-Token obtenido de cookie 'csrf_token' (no HttpOnly)
      // 'X-CSRF-Token': getCsrfToken(),
    };

    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'same-origin', // Incluir cookies HttpOnly automáticamente
        headers: { ...defaultHeaders, ...(options.headers || {}) },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(err.message || 'Error de servidor');
      }

      return response.json();

    } catch (error) {
      console.error(`[ALUVA API] Error en ${endpoint}:`, error.message);
      throw error;
    }
  }

  return {
    /**
     * FASE 3: GET /api/products
     * Obtiene el catálogo de productos con stock actualizado.
     */
    getProducts: () => request('/products'),

    /**
     * FASE 3: POST /api/checkout
     * Inicia el proceso de checkout. El backend valida precios y stock.
     * NUNCA enviar datos de tarjeta aquí (se hace directo a la pasarela en Fase 4).
     * @param {{ items: Array, coupon: string }} payload
     */
    initiateCheckout: (payload) => request('/checkout', {
      method: 'POST',
      body:   JSON.stringify(payload),
    }),

    /**
     * FASE 3: GET /api/tracking/:code
     * Consulta el estado real del envío vía API del courier.
     * @param {string} code
     */
    getTrackingStatus: (code) => request(`/tracking/${encodeURIComponent(code)}`),

    /**
     * FASE 1: POST /api/contact (stub)
     * Envío de formulario de contacto al backend.
     * @param {Object} formData - Datos ya sanitizados por sanitizer.js
     */
    submitContact: (formData) => request('/contact', {
      method: 'POST',
      body:   JSON.stringify(formData),
    }),
  };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiClient;
}
