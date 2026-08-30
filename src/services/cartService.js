/* ==========================================================================
   ALUVA - SERVICIO DE ESTADO DEL CARRITO (Fase 1 → Fase 3)
   Patrón pub/sub para sincronización entre componentes.
   En Fase 3, el método checkout() se conectará al endpoint /api/checkout.
   ========================================================================== */

const CartService = (() => {
  // ── Estado privado (no expuesto en window.*) ──
  const STORAGE_KEYS = {
    cart:     'aluva_cart_v2',
    discount: 'aluva_discount',
    coupon:   'aluva_coupon',
  };

  let _cart     = [];
  let _discount = 0;
  let _coupon   = '';
  let _listeners = [];

  // Cupones válidos (en Fase 3, validar en backend)
  const VALID_COUPONS = Object.freeze({
    'ALUVA10':    10,
    'ALUVA20':    20,
    'PREMIUM15':  15,
    'FAENA2026':  12,
  });

  /** Carga estado desde localStorage de forma segura */
  function _loadFromStorage() {
    try {
      _cart     = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)) || [];
      _discount = parseFloat(localStorage.getItem(STORAGE_KEYS.discount)) || 0;
      _coupon   = localStorage.getItem(STORAGE_KEYS.coupon) || '';
    } catch {
      _cart = []; _discount = 0; _coupon = '';
    }
  }

  /** Persiste estado en localStorage */
  function _persist() {
    try {
      localStorage.setItem(STORAGE_KEYS.cart,     JSON.stringify(_cart));
      localStorage.setItem(STORAGE_KEYS.discount,  String(_discount));
      localStorage.setItem(STORAGE_KEYS.coupon,    _coupon);
    } catch { /* Storage lleno o privado */ }
  }

  /** Notifica a todos los suscriptores del cambio de estado */
  function _notify() {
    const state = getState();
    _listeners.forEach(fn => fn(state));
  }

  /** Suscribe una función a cambios del carrito */
  function subscribe(fn) {
    if (typeof fn === 'function') _listeners.push(fn);
    return () => { _listeners = _listeners.filter(f => f !== fn); }; // Unsubscribe
  }

  /** Retorna el estado actual del carrito (inmutable) */
  function getState() {
    const subtotal = _cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const discountAmount = _discount > 0 ? Math.round(subtotal * (_discount / 100)) : 0;
    return Object.freeze({
      items:          [..._cart],
      totalItems:     _cart.reduce((s, i) => s + i.quantity, 0),
      subtotal,
      discountAmount,
      discountPct:    _discount,
      activeCoupon:   _coupon,
      total:          subtotal - discountAmount,
    });
  }

  /**
   * Añade un producto al carrito.
   * @param {{ id, title, price, image }} product - Datos del producto sanitizados
   */
  function addItem(product) {
    const existing = _cart.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      _cart.push({ ...product, quantity: 1 });
    }
    _persist();
    _notify();
  }

  /**
   * Ajusta la cantidad de un ítem. Si llega a 0, lo elimina.
   * @param {string} id
   * @param {number} delta - +1 o -1
   */
  function adjustQuantity(id, delta) {
    const item = _cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      _cart = _cart.filter(i => i.id !== id);
    }
    _persist();
    _notify();
  }

  /**
   * Elimina un ítem por ID.
   * @param {string} id
   */
  function removeItem(id) {
    _cart = _cart.filter(i => i.id !== id);
    _persist();
    _notify();
  }

  /**
   * Aplica un cupón de descuento. Retorna { ok, message }.
   * En Fase 3, validar en backend (NUNCA solo en cliente).
   * @param {string} code
   * @returns {{ ok: boolean, message: string }}
   */
  function applyCoupon(code) {
    const normalized = (code || '').trim().toUpperCase();
    if (!normalized) return { ok: false, message: 'Ingresa un código de descuento.' };

    if (Object.prototype.hasOwnProperty.call(VALID_COUPONS, normalized)) {
      _discount = VALID_COUPONS[normalized];
      _coupon   = normalized;
      _persist();
      _notify();
      return { ok: true, message: `Cupón ${normalized} aplicado (${_discount}% de descuento)` };
    }
    return { ok: false, message: 'Código de descuento no válido.' };
  }

  /** Vacía el carrito y elimina la sesión de compra. */
  function clear() {
    _cart = []; _discount = 0; _coupon = '';
    try {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    } catch { /* noop */ }
    _notify();
  }

  /**
   * Inicia el proceso de checkout.
   * FASE 1: Muestra mensaje informativo.
   * FASE 3: Llamar a /api/checkout con el carrito y token CSRF.
   * FASE 4: Redirigir a Webpay Plus / MercadoPago con token efímero.
   */
  async function checkout() {
    const state = getState();
    if (state.totalItems === 0) return;

    // ── STUB FASE 3 / 4 ──
    // En producción, reemplazar por:
    // const response = await apiClient.post('/api/checkout', {
    //   items: state.items.map(i => ({ id: i.id, qty: i.quantity })),
    //   coupon: state.activeCoupon,
    // });
    // window.location.href = response.paymentUrl;

    console.info('[ALUVA] Checkout iniciado. Total:', state.total);
    alert(
      `[Integración de Pago]\n\nTotal: $${state.total.toLocaleString('es-CL')}\n\n` +
      `Este flujo se conectará con Webpay Plus / MercadoPago en la Fase 4.\n` +
      `Los cálculos finales de precio y stock se verificarán en el backend.`
    );

    clear();
  }

  // Inicialización
  _loadFromStorage();

  return { subscribe, getState, addItem, adjustQuantity, removeItem, applyCoupon, clear, checkout };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CartService;
}
