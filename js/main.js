/* ==========================================
   ALUVA - NATIVE JS INTERACTIVITY & LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de módulos
  initCart();
  initTracking();
  initContactForm();
  initSmoothScroll();
});

/* ==========================================
   1. CARRITO DE COMPRAS LOCAL
   ========================================== */
function initCart() {
  // Estado local del carrito
  let cart = [];
  let activeDiscount = 0; // Porcentaje de descuento (0 a 100)
  let activeDiscountCode = '';

  // Elementos del DOM
  const cartDialog = document.getElementById('cart-dialog');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartCounter = document.getElementById('cart-counter');
  const cartItemsContainer = document.getElementById('cart-items');
  const addToCartButtons = document.querySelectorAll('.btn-add-cart');

  // Totales
  const subtotalVal = document.getElementById('cart-subtotal-val');
  const discountRow = document.getElementById('cart-discount-row');
  const discountVal = document.getElementById('cart-discount-val');
  const totalVal = document.getElementById('cart-total-val');

  // Cupón de descuento
  const promoInput = document.getElementById('promo-input');
  const promoBtn = document.getElementById('btn-apply-promo');
  const promoFeedback = document.getElementById('promo-feedback');

  // Checkout
  const checkoutBtn = document.getElementById('btn-checkout');

  // Códigos de descuento válidos
  const VALID_COUPONS = {
    'ALUVA10': 10,
    'ALUVA20': 20,
    'PREMIUM15': 15
  };

  // Abrir carrito
  if (cartToggleBtn && cartDialog) {
    cartToggleBtn.addEventListener('click', () => {
      cartDialog.showModal();
    });
  }

  // Cerrar carrito
  if (cartCloseBtn && cartDialog) {
    cartCloseBtn.addEventListener('click', () => {
      cartDialog.close();
    });
  }

  // Light dismiss: Cerrar haciendo clic fuera del modal
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

  // Añadir al carrito
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      const id = card.getAttribute('data-id');
      const title = card.getAttribute('data-title');
      const price = parseInt(card.getAttribute('data-price'), 10);
      const image = card.getAttribute('data-image');

      addToCart(id, title, price, image);
    });
  });

  function addToCart(id, title, price, image) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id,
        title,
        price,
        image,
        quantity: 1
      });
    }

    updateCart();
    // Abrir carrito automáticamente al añadir
    if (cartDialog && !cartDialog.open) {
      cartDialog.showModal();
    }
  }

  // Cambiar cantidad
  cartItemsContainer.addEventListener('click', (e) => {
    const itemRow = e.target.closest('.cart-item');
    if (!itemRow) return;

    const id = itemRow.getAttribute('data-id');
    const item = cart.find(item => item.id === id);
    if (!item) return;

    // Incrementar
    if (e.target.classList.contains('qty-inc')) {
      item.quantity += 1;
      updateCart();
    }
    // Decrementar
    else if (e.target.classList.contains('qty-dec')) {
      if (item.quantity > 1) {
        item.quantity -= 1;
        updateCart();
      } else {
        removeFromCart(id);
      }
    }
    // Eliminar completo
    else if (e.target.closest('.btn-remove-item')) {
      removeFromCart(id);
    }
  });

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
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
        showPromoFeedback(`¡Cupón ${code} aplicado (${activeDiscount}% de descuento)!`, 'success');
        updateCart();
      } else {
        showPromoFeedback('Código de descuento no válido.', 'error');
      }
    });
  }

  function showPromoFeedback(message, type) {
    if (!promoFeedback) return;
    promoFeedback.textContent = message;
    promoFeedback.className = 'promo-feedback ' + type;
  }

  // Formatear pesos chilenos
  function formatCLP(value) {
    return '$' + value.toLocaleString('es-CL');
  }

  // Actualizar e interconectar carrito
  function updateCart() {
    // 1. Contador del Header
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
    cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';

    // 2. Renderizar items
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="cart-empty-message">Tu carrito está vacío.</p>';
      subtotalVal.textContent = formatCLP(0);
      discountRow.style.display = 'none';
      totalVal.textContent = formatCLP(0);
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-details">
          <span class="cart-item-title">${item.title}</span>
          <span class="cart-item-price">${formatCLP(item.price)}</span>
          <div class="cart-item-qty">
            <button class="btn-qty qty-dec" aria-label="Disminuir cantidad">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="btn-qty qty-inc" aria-label="Aumentar cantidad">+</button>
          </div>
        </div>
        <button class="btn-remove-item" aria-label="Eliminar artículo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `).join('');

    // 3. Calcular Totales
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotalVal.textContent = formatCLP(subtotal);

    if (activeDiscount > 0) {
      const discountAmount = Math.round(subtotal * (activeDiscount / 100));
      discountVal.textContent = `-${formatCLP(discountAmount)}`;
      discountRow.style.display = 'flex';
      totalVal.textContent = formatCLP(subtotal - discountAmount);
    } else {
      discountRow.style.display = 'none';
      totalVal.textContent = formatCLP(subtotal);
    }
  }

  // Finalizar Compra (Preparación de integración de SDK Shopify)
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const finalPrice = totalVal.textContent;
      
      // Simulación de Checkout
      alert(`\n[Integración de Pago Premium]\n\nCompra iniciada por un total de ${finalPrice}.\nEsta sección se encuentra lista para enlazar con Shopify Checkout SDK.`);
      
      // Opcional: Limpiar el carrito después de finalizar la compra ficticia
      cart = [];
      activeDiscount = 0;
      activeDiscountCode = '';
      if (promoInput) promoInput.value = '';
      if (promoFeedback) promoFeedback.style.display = 'none';
      updateCart();
      cartDialog.close();
    });
  }

  // Inicializar carrito vacío
  updateCart();
}

/* ==========================================
   2. SIMULACIÓN LOGÍSTICA DE ENVÍOS
   ========================================== */
function initTracking() {
  const form = document.getElementById('tracking-form');
  const input = document.getElementById('tracking-input');
  const resultCard = document.getElementById('tracking-result');

  if (!form || !input || !resultCard) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = input.value.trim().toUpperCase();

    if (!code) return;

    // Mapeo e identificación de Courier
    let courierName = '';
    let statusText = '';
    let stepCompleted = 1; // 1: Preparación, 2: Tránsito, 3: Listo

    // Lógica dinámica basada en prefijos o longitudes de código
    if (code.startsWith('STK')) {
      courierName = 'Starken';
      statusText = 'En tránsito - Rumbo al centro de distribución regional';
      stepCompleted = 2;
    } else if (code.startsWith('CHX')) {
      courierName = 'Chilexpress';
      statusText = 'Listo para retiro - En sucursal destino';
      stepCompleted = 3;
    } else if (code.startsWith('COR')) {
      courierName = 'Correos de Chile';
      statusText = 'En preparación - Documentación y embalaje listos';
      stepCompleted = 1;
    } else if (code.startsWith('UPS')) {
      courierName = 'UPS Courier';
      statusText = 'En tránsito - Internación aduanera completada';
      stepCompleted = 2;
    } else {
      // Regla basada en la longitud para códigos genéricos de prueba
      if (code.length < 6) {
        courierName = 'Correos de Chile';
        statusText = 'En preparación - Orden recibida';
        stepCompleted = 1;
      } else if (code.length >= 6 && code.length <= 10) {
        courierName = 'Starken';
        statusText = 'En tránsito - Asignado a transporte terrestre';
        stepCompleted = 2;
      } else {
        courierName = 'Chilexpress';
        statusText = 'Listo para retiro - Pendiente de entrega al cliente';
        stepCompleted = 3;
      }
    }

    // Renderizar resultados en el DOM
    resultCard.innerHTML = `
      <div class="tracking-result-header">
        <span class="tracking-carrier">${courierName}</span>
        <span class="tracking-code">Código: ${code}</span>
      </div>
      <div class="tracking-status">Estado: ${statusText}</div>
      <div class="tracking-steps">
        <div class="tracking-step ${stepCompleted >= 1 ? 'completed' : ''}">
          <div class="step-node">1</div>
          <span class="step-label">En preparación</span>
        </div>
        <div class="tracking-step ${stepCompleted >= 2 ? 'completed' : ''}">
          <div class="step-node">2</div>
          <span class="step-label">En tránsito</span>
        </div>
        <div class="tracking-step ${stepCompleted >= 3 ? 'completed' : ''}">
          <div class="step-node">3</div>
          <span class="step-label">Listo para retiro</span>
        </div>
      </div>
    `;

    resultCard.classList.add('active');
  });
}

/* ==========================================
   3. FORMULARIO DE CONTACTO
   ========================================== */
function initContactForm() {
  const form = document.querySelector('#contacto form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('nombre').value;
    const email = document.getElementById('correo').value;

    alert(`¡Gracias por contactarnos, ${name}!\nHemos recibido tu mensaje y te escribiremos a ${email} lo antes posible.`);
    form.reset();
  });
}

/* ==========================================
   4. SCROLL SUAVE PARA NAVEGACIÓN
   ========================================== */
function initSmoothScroll() {
  const links = document.querySelectorAll('nav a, .hero-content .btn-primary');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}
