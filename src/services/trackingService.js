/* ==========================================================================
   ALUVA - SERVICIO DE TRACKING DE ENVÍOS (Fase 1 → Fase 3 API-Ready)
   Lógica de resolución de couriers chilenos.
   En Fase 3 se reemplaza por llamada a API REST de couriers.
   ========================================================================== */

const TrackingService = (() => {

  /**
   * @typedef {Object} TrackingResult
   * @property {boolean} found - Si se encontró información del envío
   * @property {string}  carrier - Nombre del courier
   * @property {string}  code - Código normalizado
   * @property {string}  statusText - Descripción del estado
   * @property {number}  step - 1 (Preparación), 2 (Tránsito), 3 (Listo para retiro)
   * @property {string[]} steps - Etiquetas de los pasos
   */

  /** Configuración de couriers (prefijos y reglas de longitud) */
  const CARRIER_RULES = [
    {
      carrier:    'Starken',
      prefix:     'STK',
      statusText: 'En tránsito · Rumbo al centro de distribución regional',
      step:       2,
    },
    {
      carrier:    'Chilexpress',
      prefix:     'CHX',
      statusText: 'Listo para retiro · Disponible en sucursal de destino',
      step:       3,
    },
    {
      carrier:    'Correos de Chile',
      prefix:     'COR',
      statusText: 'En preparación · Documentación generada y embalado',
      step:       1,
    },
    {
      carrier:    'UPS Courier',
      prefix:     'UPS',
      statusText: 'En tránsito · Pasando por control aduanero central',
      step:       2,
    },
    {
      carrier:    'Blue Express',
      prefix:     'BLX',
      statusText: 'En tránsito · En camino al domicilio del cliente',
      step:       2,
    },
  ];

  const STEP_LABELS = ['Preparación', 'En Tránsito', 'Listo para Retiro'];

  /**
   * Resuelve el carrier y estado a partir de un código de seguimiento.
   * FASE 3: Reemplazar por llamada a API REST del courier.
   * @param {string} rawCode - Código ingresado por el usuario (sin sanitizar)
   * @returns {TrackingResult}
   */
  function resolve(rawCode) {
    // Validar y normalizar (el sanitizado del string ya viene de Sanitizer)
    const code = (rawCode || '').trim().toUpperCase();

    if (!code || code.length < 3) {
      return {
        found:      false,
        carrier:    '',
        code,
        statusText: 'Código de seguimiento inválido o muy corto.',
        step:       0,
        steps:      STEP_LABELS,
      };
    }

    // Buscar por prefijo (regla exacta)
    const matchedRule = CARRIER_RULES.find(r => code.startsWith(r.prefix));
    if (matchedRule) {
      return {
        found:      true,
        carrier:    matchedRule.carrier,
        code,
        statusText: matchedRule.statusText,
        step:       matchedRule.step,
        steps:      STEP_LABELS,
      };
    }

    // Reglas de longitud para códigos genéricos
    if (code.length < 6) {
      return { found: true, carrier: 'Correos de Chile', code, statusText: 'En preparación · Orden recibida en bodega', step: 1, steps: STEP_LABELS };
    }
    if (code.length <= 10) {
      return { found: true, carrier: 'Starken', code, statusText: 'En tránsito · Asignado a transporte terrestre', step: 2, steps: STEP_LABELS };
    }
    return { found: true, carrier: 'Chilexpress', code, statusText: 'Listo para retiro · Pendiente de entrega al cliente', step: 3, steps: STEP_LABELS };
  }

  return { resolve, STEP_LABELS };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TrackingService;
}
