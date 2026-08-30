/* ==========================================================================
   ALUVA - FORMATEADORES DE DATOS (Fase 1)
   Utilidades puras sin efectos secundarios para formateo de datos.
   ========================================================================== */

const Formatter = (() => {

  /**
   * Formatea un número como precio en pesos chilenos (CLP).
   * @param {number} amount - Valor numérico
   * @returns {string} Precio formateado, ej: "$25.990"
   */
  function formatCLP(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0';
    return '$' + Math.round(amount).toLocaleString('es-CL');
  }

  /**
   * Trunca un texto a una longitud máxima añadiendo "..." al final.
   * @param {string} text
   * @param {number} maxLength
   * @returns {string}
   */
  function truncateText(text, maxLength = 120) {
    if (typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + '…';
  }

  /**
   * Capitaliza la primera letra de cada palabra.
   * @param {string} str
   * @returns {string}
   */
  function toTitleCase(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/\w\S*/g, txt =>
      txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    );
  }

  /**
   * Formatea un número de tracking para visualización.
   * @param {string} code
   * @returns {string} Código en mayúsculas y sin espacios extra
   */
  function formatTrackingCode(code) {
    if (typeof code !== 'string') return '';
    return code.trim().toUpperCase();
  }

  return { formatCLP, truncateText, toTitleCase, formatTrackingCode };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Formatter;
}
