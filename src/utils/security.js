/* ==========================================================================
   ALUVA - DIRECTRICES DE SEGURIDAD (Fase 1 → Fase 4)
   Documentación y stubs de configuración de seguridad.
   Las directrices marcadas como [SERVIDOR] deben implementarse en el backend
   (Node.js/Next.js) en las Fases 3 y 4. No se ejecutan client-side.
   ========================================================================== */

/**
 * @module Security
 *
 * RESUMEN DE CAPAS DE SEGURIDAD POR FASE:
 *
 * FASE 1 (Actual):
 *   - Sanitización XSS en todas las entradas de formularios (sanitizer.js)
 *   - No exponer datos sensibles en variables globales (window.*)
 *   - No formularios críticos en HTML estático
 *
 * FASE 2:
 *   - DOMPurify para sanitización completa de HTML
 *   - Validación client-side con Zod o Yup en React
 *   - Content Security Policy meta tag (ver abajo)
 *
 * FASE 3 [SERVIDOR]:
 *   - Tokens JWT en cookies HttpOnly + SameSite=Strict
 *   - CORS restringido a dominios propios
 *   - Rate Limiting en endpoints críticos
 *   - Encriptación de datos sensibles en reposo (PostgreSQL)
 *
 * FASE 4 [SERVIDOR]:
 *   - HTTPS obligatorio con HSTS
 *   - Webhooks firmados criptográficamente (HMAC-SHA256) para Webpay/MercadoPago
 *   - PCI-DSS: nunca almacenar datos de tarjeta, delegar a pasarela
 *   - Ocultamiento de endpoints administrativos (/api/admin/* → acceso por IP o mTLS)
 */

/* ──────────────────────────────────────────────────────────────────────────
   CONTENT SECURITY POLICY (CSP) — Referencia para meta tag en HTML
   ────────────────────────────────────────────────────────────────────────── */

/**
 * CSP recomendada para Fase 1 (HTML estático).
 * Agregar como <meta http-equiv="Content-Security-Policy"> en cada página.
 * En Fase 3, mover al servidor como encabezado HTTP (más seguro que meta tag).
 *
 * Política actual:
 *   - default-src 'self'           → Solo recursos del mismo origen
 *   - script-src 'self'            → Sin inline scripts ni eval (preparar para Fase 2)
 *   - style-src 'self'             → Sin estilos inline externos
 *   - img-src 'self' data: https:  → Imágenes del mismo origen + HTTPS externos
 *   - connect-src 'self'           → Fetch/XHR solo al propio origen
 *   - frame-ancestors 'none'       → Previene clickjacking (no se embebe en iframes)
 *   - base-uri 'self'              → Previene inyección de base tag
 *   - form-action 'self'           → Formularios solo envían al mismo origen
 */
const CSP_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

/* ──────────────────────────────────────────────────────────────────────────
   CONFIGURACIÓN DE COOKIES [SERVIDOR - Fase 3]
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Ejemplo de configuración de cookie de sesión para el backend (Node.js/Express):
 *
 * res.cookie('aluva_session', token, {
 *   httpOnly: true,       // Inaccesible desde document.cookie (protege de XSS)
 *   secure: true,         // Solo en HTTPS
 *   sameSite: 'Strict',   // Protege de CSRF
 *   maxAge: 30 * 60 * 1000, // 30 minutos
 *   path: '/',
 * });
 */

/* ──────────────────────────────────────────────────────────────────────────
   CORS [SERVIDOR - Fase 3]
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Configuración CORS restrictiva para el backend:
 *
 * const ALLOWED_ORIGINS = [
 *   'https://aluva.cl',
 *   'https://www.aluva.cl',
 * ];
 *
 * app.use(cors({
 *   origin: (origin, callback) => {
 *     if (!origin || ALLOWED_ORIGINS.includes(origin)) {
 *       callback(null, true);
 *     } else {
 *       callback(new Error('Origen no permitido por CORS'));
 *     }
 *   },
 *   credentials: true,
 *   methods: ['GET', 'POST'],
 *   allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
 * }));
 */

/* ──────────────────────────────────────────────────────────────────────────
   PROTECCIÓN CLIENT-SIDE (Fase 1 - Activa)
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Previene exposición de datos sensibles en variables globales del navegador.
 * Llamar al inicio de cada módulo que maneje datos de usuario.
 */
function preventGlobalExposure() {
  // No almacenar datos de pago, tokens o PII en window.*
  // Usar closures y módulos IIFE en su lugar (patrón usado en cart.js, etc.)
  if (typeof window !== 'undefined') {
    // Borrar cualquier dato sensible residual en el global
    delete window.userData;
    delete window.cartData;
    delete window.paymentData;
  }
}

/**
 * Valida que el origen de un postMessage sea confiable.
 * Usar al integrar iframes de pasarelas de pago (Fase 4).
 * @param {MessageEvent} event
 * @param {string[]} allowedOrigins
 * @returns {boolean}
 */
function isMessageFromTrustedOrigin(event, allowedOrigins = []) {
  return allowedOrigins.includes(event.origin);
}

// Ejecutar en carga de página
preventGlobalExposure();

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CSP_POLICY,
    preventGlobalExposure,
    isMessageFromTrustedOrigin,
  };
}
