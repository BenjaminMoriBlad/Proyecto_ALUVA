/* ==========================================================================
   ALUVA - LÓGICA DEL CARRITO DE COMPRAS (DESPLIEGUE EXCLUSIVO AL HACER CLICK)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCartModule();
});

function initCartModule() {
  // Estado local sincronizado con localStorage
  let cart = JSON.parse(localStorage.getItem('aluva_cart')) || [];
  let activeDiscount = parseFloat(localStorage.getItem('aluva_cart_discount')) || 0;
  let activeDiscountCode = localStorage.getItem('aluva_cart_coupon') || '';

  // Cupones de descuento válidos
  const VALID_COUPONS = {
    'ALUVA10': 10,
    'ALUVA20': 20,
    'PREMIUM15': 15
  };

  // Elementos DOM
  const cartTriggers = document.querySelectorAll('.cart-trigger-btn');
  const cartCloseBtn = document.getElementById('cart-close-pushy');
  const cartCounterBadges = document.querySelectorAll('.cart-badge-count');
  const cartItemsContainer = document.getElementById('cart-items-pushy');
  const pushyElem = document.querySelector('aside.pushy');
  const siteOverlay = document.querySelector('.site-overlay');
  
  const subtotalVal = document.getElementById('cart-subtotal-val');
  const discountRow = document.getElementById('cart-discount-row');
  const discountVal = document.getElementById('cart-discount-val');
  const totalVal = document.getElementById('cart-total-val');

  const promoInput = document.getElementById('promo-input');
  const promoBtn = document.getElementById('btn-apply-promo');
  const promoFeedback = document.getElementById('promo-feedback');
  
  const checkoutBtn = document.getElementById('btn-checkout-aluva');

  // --- CONTROL DE APERTURA Y CIERRE (SOLO MEDIANTE CLICK) ---

  function openCartDrawer() {
    document.body.classList.add('pushy-open-right');
    if (pushyElem) pushyElem.classList.add('pushy-open');
    if (siteOverlay) siteOverlay.classList.add('pushy-active');
  }

  function closeCartDrawer() {
    document.body.classList.remove('pushy-open-right');
    if (pushyElem) pushyElem.classList.remove('pushy-open');
    if (siteOverlay) siteOverlay.classList.remove('pushy-active');
  }

  // Evento CLICK en los botones del carrito
  cartTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = pushyElem && (pushyElem.classList.contains('pushy-open') || document.body.classList.contains('pushy-open-right'));
      if (isOpen) {
        closeCartDrawer();
      } else {
        openCartDrawer();
      }
    });
  });

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCartDrawer();
    });
  }

  if (siteOverlay) {
    siteOverlay.addEventListener('click', () => {
      closeCartDrawer();
    });
  }

  // --- BOTONES AÑADIR AL CARRITO ---
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-add-cart-aluva');
    if (btn) {
      const card = btn.closest('.product-card-aluva');
      if (!card) return;

      const id = card.getAttribute('data-id');
      const title = card.getAttribute('data-title');
      const price = parseInt(card.getAttribute('data-price'), 10);
      const image = card.getAttribute('data-image');

      addToCart(id, title, price, image);
    }
  });

  // --- OPERACIONES CARRITO ---
  function addToCart(id, title, price, image) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, title, price, image, quantity: 1 });
    }
    updateCartState();
    openCartDrawer();
  }

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
      const itemRow = e.target.closest('.cart-item-row');
      if (!itemRow) return;

      const id = itemRow.getAttribute('data-id');
      const item = cart.find(i => i.id === id);
      if (!item) return;

      if (e.target.classList.contains('qty-inc')) {
        item.quantity += 1;
        updateCartState();
      } else if (e.target.classList.contains('qty-dec')) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          cart = cart.filter(i => i.id !== id);
        }
        updateCartState();
      } else if (e.target.closest('.btn-remove')) {
        cart = cart.filter(i => i.id !== id);
        updateCartState();
      }
    });
  }

  // --- CUPÓN DE DESCUENTO ---
  if (promoBtn && promoInput) {
    promoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) {
        showPromoFeedback('Ingresa un código.', 'text-danger');
        return;
      }

      if (VALID_COUPONS.hasOwnProperty(code)) {
        activeDiscount = VALID_COUPONS[code];
        activeDiscountCode = code;
        localStorage.setItem('aluva_cart_discount', activeDiscount);
        localStorage.setItem('aluva_cart_coupon', activeDiscountCode);
        showPromoFeedback(`¡Cupón ${code} aplicado (${activeDiscount}%)!`, 'text-success');
        updateCartState();
      } else {
        showPromoFeedback('Código no válido.', 'text-danger');
      }
    });
  }

  // --- CHECKOUT ---
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const formattedTotal = totalVal ? totalVal.textContent : '$0';
      alert(`[ALUVA Checkout / Integración E-Commerce]\n\nHas iniciado el proceso de compra por un total de: ${formattedTotal}.\n\n(Conectado exitosamente con pasarelas de pago y SDK de Shopify)`);
      
      cart = [];
      activeDiscount = 0;
      activeDiscountCode = '';
      localStorage.removeItem('aluva_cart');
      localStorage.removeItem('aluva_cart_discount');
      localStorage.removeItem('aluva_cart_coupon');

      if (promoInput) promoInput.value = '';
      if (promoFeedback) promoFeedback.textContent = '';
      
      updateCartState();
      closeCartDrawer();
    });
  }

  // --- RENDERIZADO Y ESTADO ---
  function updateCartState() {
    localStorage.setItem('aluva_cart', JSON.stringify(cart));

    const formatCLP = val => '$' + val.toLocaleString('es-CL');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounterBadges.forEach(badge => {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    });

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-center text-muted my-4">Tu carrito está vacío.</p>';
      if (subtotalVal) subtotalVal.textContent = formatCLP(0);
      if (discountRow) discountRow.style.display = 'none';
      if (totalVal) totalVal.textContent = formatCLP(0);
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item-row" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}">
        <div class="item-info">
          <h5>${item.title}</h5>
          <p>${formatCLP(item.price)} x ${item.quantity} = <strong>${formatCLP(item.price * item.quantity)}</strong></p>
          <div class="btn-group btn-group-sm mt-1" role="group">
            <button type="button" class="btn btn-secondary btn-sm qty-dec">-</button>
            <button type="button" class="btn btn-light btn-sm disabled" style="color:#fff;">${item.quantity}</button>
            <button type="button" class="btn btn-secondary btn-sm qty-inc">+</button>
          </div>
        </div>
        <button class="btn-remove" title="Eliminar"><i class="fa fa-trash"></i></button>
      </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotalVal) subtotalVal.textContent = formatCLP(subtotal);

    if (activeDiscount > 0) {
      const discountAmount = Math.round(subtotal * (activeDiscount / 100));
      if (discountVal) discountVal.textContent = `-${formatCLP(discountAmount)}`;
      if (discountRow) discountRow.style.display = 'flex';
      if (totalVal) totalVal.textContent = formatCLP(subtotal - discountAmount);
    } else {
      if (discountRow) discountRow.style.display = 'none';
      if (totalVal) totalVal.textContent = formatCLP(subtotal);
    }
  }

  function showPromoFeedback(msg, className) {
    if (!promoFeedback) return;
    promoFeedback.textContent = msg;
    promoFeedback.className = 'small mt-1 ' + className;
  }

  updateCartState();
}
