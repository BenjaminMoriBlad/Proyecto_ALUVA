/* ==========================================================================
   ALUVA - SANITIZADOR XSS (Fase 2 - Seguridad Frontend Crítica)
   Utilidad de sanitización de entradas para prevenir XSS e inyecciones.
   NUNCA usar innerHTML con datos de usuario sin pasar por estas funciones.
   ========================================================================== */

/**
 * @module Sanitizer
 * Capa de protección client-side contra XSS.
 * En Fase 2 se integrará DOMPurify como librería de producción.
 * Por ahora provee sanitización manual robusta lista para uso en Fase 1.
 */
const Sanitizer = (() => {

  /**
   * Escapa caracteres HTML peligrosos en un string.
   * Usar SIEMPRE antes de insertar datos de usuario en el DOM.
   * @param {string} str - String potencialmente peligroso
   * @returns {string} String seguro para uso como textContent
   */
  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitiza una URL para uso en href o src.
   * Permite solo protocolos seguros (https, http, mailto, data:image).
   * @param {string} url - URL a validar
   * @returns {string} URL segura o '#' si es peligrosa
   */
  function sanitizeURL(url) {
    if (typeof url !== 'string') return '#';
    const trimmed = url.trim();
    // Bloquear javascript:, vbscript: y cualquier protocolo no listado
    const allowedProtocols = /^(https?:\/\/|mailto:|\/|\.\/|\.\.\/|data:image\/)/i;
    if (!allowedProtocols.test(trimmed)) {
      console.warn('[ALUVA Security] URL bloqueada por sanitizador:', trimmed);
      return '#';
    }
    return trimmed;
  }

  /**
   * Limpia un string para uso como atributo data-* o class.
   * Elimina caracteres que no sean alfanuméricos, guiones o guiones bajos.
   * @param {string} str
   * @returns {string}
   */
  function sanitizeAttr(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[^a-zA-Z0-9\-_\s]/g, '');
  }

  /**
   * Sanitiza una entrada numérica (precios, cantidades).
   * @param {*} val - Valor a convertir
   * @param {number} fallback - Valor de respaldo si no es número válido
   * @returns {number}
   */
  function sanitizeNumber(val, fallback = 0) {
    const n = parseFloat(val);
    return isNaN(n) || !isFinite(n) ? fallback : n;
  }

  /**
   * Sanitiza un objeto de datos de producto proveniente del DOM (data attributes).
   * @param {Object} raw - Objeto con campos crudos del DOM
   * @returns {Object} Objeto saneado
   */
  function sanitizeProductData(raw) {
    return {
      id:    sanitizeAttr(raw.id    || ''),
      title: escapeHTML(raw.title   || ''),
      price: sanitizeNumber(raw.price, 0),
      image: sanitizeURL(raw.image  || ''),
    };
  }

  /**
   * Sanitiza un objeto de formulario de contacto.
   * @param {Object} raw - { nombre, correo, telefono, mensaje }
   * @returns {Object} Objeto saneado
   */
  function sanitizeContactForm(raw) {
    return {
      nombre:   escapeHTML((raw.nombre   || '').trim().slice(0, 100)),
      correo:   escapeHTML((raw.correo   || '').trim().slice(0, 150)),
      telefono: escapeHTML((raw.telefono || '').trim().replace(/[^+\d\s\-()]/g, '').slice(0, 20)),
      mensaje:  escapeHTML((raw.mensaje  || '').trim().slice(0, 1000)),
    };
  }

  // API pública
  return {
    escapeHTML,
    sanitizeURL,
    sanitizeAttr,
    sanitizeNumber,
    sanitizeProductData,
    sanitizeContactForm,
  };

})();

// Exportar para módulos (compatibilidad futura con ES Modules / Next.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Sanitizer;
}
