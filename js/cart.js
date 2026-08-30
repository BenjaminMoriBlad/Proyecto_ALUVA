/* ==========================================================================
   ALUVA - LÓGICA DEL CARRITO DE COMPRAS LOCAL / SHOPIFY SDK HOOKS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCartModule();
});

function initCartModule() {
  // Estado local (sincronizado con localStorage para persistir entre páginas)
  let cart = JSON.parse(localStorage.getItem('aluva_cart')) || [];
  let activeDiscount = parseFloat(localStorage.getItem('aluva_cart_discount')) || 0;
  let activeDiscountCode = localStorage.getItem('aluva_cart_coupon') || '';

  // Códigos de descuento válidos
  const VALID_COUPONS = {
    'ALUVA10': 10,
    'ALUVA20': 20,
    'PREMIUM15': 15
  };

  // Elementos del DOM
  const cartDialog = document.getElementById('cart-dialog');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartCounter = document.getElementById('cart-counter');
  const cartItemsContainer = document.getElementById('cart-items');
  
  // Totales
  const subtotalVal = document.getElementById('cart-subtotal-val');
  const discountRow = document.getElementById('cart-discount-row');
  const discountVal = document.getElementById('cart-discount-val');
  const totalVal = document.getElementById('cart-total-val');

  // Controles de Cupón
  const promoInput = document.getElementById('promo-input');
  const promoBtn = document.getElementById('btn-apply-promo');
  const promoFeedback = document.getElementById('promo-feedback');
  
  // Finalizar Compra
  const checkoutBtn = document.getElementById('btn-checkout');

  // --- EVENT LISTENERS ---

  // Abrir carrito
  if (cartToggleBtn && cartDialog) {
    cartToggleBtn.addEventListener('click', () => cartDialog.showModal());
  }

  // Cerrar carrito
  if (cartCloseBtn && cartDialog) {
    cartCloseBtn.addEventListener('click', () => cartDialog.close());
  }

  // Light dismiss: Cerrar haciendo clic fuera
  if (cartDialog) {
    cartDialog.addEventListener('click', (event) => {
      const rect = cartDialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX && event.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        cartDialog.close();
      }
    });
  }

  // Escuchar botones "Añadir al Carrito" en toda la página
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-cart')) {
      const card = e.target.closest('.product-card');
      if (!card) return;

      const id = card.getAttribute('data-id');
      const title = card.getAttribute('data-title');
      const price = parseInt(card.getAttribute('data-price'), 10);
      const image = card.getAttribute('data-image');

      addToCart(id, title, price, image);
    }
  });

  // Escuchar mutaciones dentro del carrito (cambios de cantidad o eliminar)
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
      const itemRow = e.target.closest('.cart-item');
      if (!itemRow) return;

      const id = itemRow.getAttribute('data-id');
      const item = cart.find(item => item.id === id);
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
      } else if (e.target.closest('.btn-remove-item')) {
        cart = cart.filter(i => i.id !== id);
        updateCartState();
      }
    });
  }

  // Aplicar cupón de descuento
  if (promoBtn && promoInput) {
    promoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) {
        showPromoFeedback('Por favor ingresa un código.', 'error');
        return;
      }

      if (VALID_COUPONS.hasOwnProperty(code)) {
        activeDiscount = VALID_COUPONS[code];
        activeDiscountCode = code;
        localStorage.setItem('aluva_cart_discount', activeDiscount);
        localStorage.setItem('aluva_cart_coupon', activeDiscountCode);
        showPromoFeedback(`¡Cupón ${code} aplicado (${activeDiscount}% de descuento)!`, 'success');
        updateCartState();
      } else {
        showPromoFeedback('Código de descuento no válido.', 'error');
      }
    });
  }

  // Finalizar Compra (Listo para Shopify SDK Hook)
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const formattedTotal = totalVal ? totalVal.textContent : '';
      
      // Simulación de pasarela / Conexión a Shopify Checkout
      alert(`[Integración de Pago Premium]\n\nRedireccionando al Checkout de Shopify para procesar un total de: ${formattedTotal}.\n\n(Esta acción está lista para vincularse con el SDK o API Storefront de Shopify)`);
      
      // Limpiar carrito local
      cart = [];
      activeDiscount = 0;
      activeDiscountCode = '';
      localStorage.removeItem('aluva_cart');
      localStorage.removeItem('aluva_cart_discount');
      localStorage.removeItem('aluva_cart_coupon');
      
      if (promoInput) promoInput.value = '';
      if (promoFeedback) promoFeedback.style.display = 'none';
      
      updateCartState();
      if (cartDialog) cartDialog.close();
    });
  }

  // --- MÉTODOS AUXILIARES ---

  function addToCart(id, title, price, image) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, title, price, image, quantity: 1 });
    }
    updateCartState();
    
    // Auto-abrir modal
    if (cartDialog && !cartDialog.open) {
      cartDialog.showModal();
    }
  }

  function updateCartState() {
    // Guardar en almacenamiento local
    localStorage.setItem('aluva_cart', JSON.stringify(cart));

    // Formateador CLP
    const formatCLP = val => '$' + val.toLocaleString('es-CL');

    // Actualizar Contador Global en el Header
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCounter) {
      cartCounter.textContent = totalItems;
      cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // Renderizar
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="cart-empty-message">Tu carrito está vacío.</p>';
      if (subtotalVal) subtotalVal.textContent = formatCLP(0);
      if (discountRow) discountRow.style.display = 'none';
      if (totalVal) totalVal.textContent = formatCLP(0);
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    // Dibujar artículos
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img" loading="lazy" width="80" height="80">
        <div class="cart-item-details">
          <span class="cart-item-title">${item.title}</span>
          <span class="cart-item-price">${formatCLP(item.price)}</span>
          <div class="cart-item-qty">
            <button class="btn-qty qty-dec" aria-label="Disminuir">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="btn-qty qty-inc" aria-label="Aumentar">+</button>
          </div>
        </div>
        <button class="btn-remove-item" aria-label="Eliminar artículo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `).join('');

    // Calcular Totales
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

  function showPromoFeedback(message, type) {
    if (!promoFeedback) return;
    promoFeedback.textContent = message;
    promoFeedback.className = 'promo-feedback ' + type;
  }

  // Carga inicial
  updateCartState();
}

