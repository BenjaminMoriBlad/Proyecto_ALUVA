/* ==========================================================================
   ALUVA - COMPONENTE CART (Fase 1)
   Controlador de UI para el carrito. Conecta el DOM con CartService.
   ========================================================================== */

const CartComponent = (() => {
  // Elementos DOM
  let dialog, toggleBtn, closeBtn, counter, itemsContainer;
  let subtotalVal, discountRow, discountVal, totalVal;
  let promoInput, promoBtn, promoFeedback, checkoutBtn;

  function init() {
    // Vincular DOM
    dialog         = document.getElementById('cart-dialog');
    toggleBtn      = document.getElementById('cart-toggle-btn');
    closeBtn       = document.getElementById('cart-close-btn');
    counter        = document.getElementById('cart-counter');
    itemsContainer = document.getElementById('cart-items');
    
    subtotalVal    = document.getElementById('cart-subtotal-val');
    discountRow    = document.getElementById('cart-discount-row');
    discountVal    = document.getElementById('cart-discount-val');
    totalVal       = document.getElementById('cart-total-val');
    
    promoInput     = document.getElementById('promo-input');
    promoBtn       = document.getElementById('btn-apply-promo');
    promoFeedback  = document.getElementById('promo-feedback');
    checkoutBtn    = document.getElementById('btn-checkout');

    _attachEvents();
    
    // Suscribirse a cambios del CartService
    if (typeof CartService !== 'undefined') {
      CartService.subscribe(render);
      render(CartService.getState()); // Render inicial
    } else {
      console.error('[ALUVA] CartService no encontrado.');
    }
  }

  function _attachEvents() {
    // Abrir / Cerrar Dialog
    if (toggleBtn && dialog) toggleBtn.addEventListener('click', () => dialog.showModal());
    if (closeBtn && dialog)  closeBtn.addEventListener('click', () => dialog.close());
    
    // Light dismiss
    if (dialog) {
      dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect();
        if (e.clientY < rect.top || e.clientY > rect.bottom || 
            e.clientX < rect.left || e.clientX > rect.right) {
          dialog.close();
        }
      });
    }

    // Delegación de eventos para agregar al carrito (botones en cualquier parte)
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-add-cart')) {
        const btn = e.target.closest('.btn-add-cart');
        const card = btn.closest('.product-card');
        if (!card) return;

        // Leer datos y sanitizar (Sanitizer inyectado globalmente en HTML)
        const rawData = {
          id:    card.getAttribute('data-id'),
          title: card.getAttribute('data-title'),
          price: card.getAttribute('data-price'),
          image: card.getAttribute('data-image')
        };
        
        const safeData = typeof Sanitizer !== 'undefined' 
          ? Sanitizer.sanitizeProductData(rawData) 
          : { ...rawData, price: parseFloat(rawData.price) || 0 };

        CartService.addItem(safeData);
        if (dialog && !dialog.open) dialog.showModal();
      }
    });

    // Interacciones dentro de los items del carrito
    if (itemsContainer) {
      itemsContainer.addEventListener('click', (e) => {
        const itemRow = e.target.closest('.cart-item');
        if (!itemRow) return;
        
        const id = itemRow.getAttribute('data-id');
        if (e.target.closest('.qty-inc')) CartService.adjustQuantity(id, 1);
        if (e.target.closest('.qty-dec')) CartService.adjustQuantity(id, -1);
        if (e.target.closest('.btn-remove-item')) CartService.removeItem(id);
      });
    }

    // Cupones
    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', () => {
        const res = CartService.applyCoupon(promoInput.value);
        if (promoFeedback) {
          promoFeedback.textContent = res.message;
          promoFeedback.className = 'promo-feedback ' + (res.ok ? 'success' : 'error');
        }
      });
    }

    // Checkout
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        CartService.checkout();
        if (dialog) dialog.close();
      });
    }
  }

  function render(state) {
    const formatter = typeof Formatter !== 'undefined' ? Formatter.formatCLP : (val) => '$' + val;

    // Header counter
    if (counter) {
      counter.textContent = state.totalItems;
      counter.style.display = state.totalItems > 0 ? 'flex' : 'none';
    }

    // Items list
    if (itemsContainer) {
      if (state.items.length === 0) {
        itemsContainer.innerHTML = '<p class="cart-empty-message">Tu carrito está vacío.</p>';
        if (checkoutBtn) checkoutBtn.disabled = true;
      } else {
        if (checkoutBtn) checkoutBtn.disabled = false;
        
        // Uso de string templates seguro porque los datos entran por Sanitizer al agregarse
        const html = state.items.map(item => `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="" class="cart-item-img" loading="lazy">
            <div class="cart-item-details">
              <span class="cart-item-title">${item.title}</span>
              <span class="cart-item-price">${formatter(item.price)}</span>
              <div class="cart-item-qty">
                <button class="btn-qty qty-dec" aria-label="Disminuir">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="btn-qty qty-inc" aria-label="Aumentar">+</button>
              </div>
            </div>
            <button class="btn-remove-item" aria-label="Eliminar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        `).join('');
        
        // Fase 2: DOMPurify.sanitize(html) antes de innerHTML
        itemsContainer.innerHTML = html;
      }
    }

    // Totales
    if (subtotalVal) subtotalVal.textContent = formatter(state.subtotal);
    if (totalVal)    totalVal.textContent    = formatter(state.total);
    
    if (discountRow && discountVal) {
      if (state.discountPct > 0) {
        discountVal.textContent = '-' + formatter(state.discountAmount);
        discountRow.style.display = 'flex';
      } else {
        discountRow.style.display = 'none';
      }
    }
  }

  return { init };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CartComponent;
} else {
  document.addEventListener('DOMContentLoaded', CartComponent.init);
}

