/* ==========================================================================
   ALUVA - COMPONENTE PRODUCT CARD (Fase 1 / Fase 2)
   Generador seguro de elementos DOM para tarjetas de producto.
   Evita inyecciones XSS usando textContent y atributos seguros.
   ========================================================================== */

const ProductCardComponent = (() => {

  /**
   * Crea un elemento DOM de tarjeta de producto.
   * @param {Object} product - Objeto de datos del producto
   * @returns {HTMLElement} Elemento article configurado
   */
  function createCard(product) {
    const formatter = typeof Formatter !== 'undefined' ? Formatter.formatCLP : (v) => '$'+v;
    const s = typeof Sanitizer !== 'undefined' ? Sanitizer : null;

    // Sanitización de defensa en profundidad
    const id = s ? s.sanitizeAttr(product.id) : product.id;
    const title = s ? s.escapeHTML(product.title) : product.title;
    const price = s ? s.sanitizeNumber(product.price) : product.price;
    const image = s ? s.sanitizeURL(product.image) : product.image;
    const alt = s ? s.escapeHTML(product.alt || title) : (product.alt || title);
    const fabric = s ? s.escapeHTML(product.fabric) : product.fabric;
    const desc = s ? s.escapeHTML(product.description) : product.description;

    // Contenedor principal
    const article = document.createElement('article');
    article.className = 'product-card anim-fade-in-up';
    article.setAttribute('data-id', id);
    article.setAttribute('data-title', title);
    article.setAttribute('data-price', price.toString());
    article.setAttribute('data-image', image);

    // Wrapper de imagen
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'product-img-wrapper';
    const img = document.createElement('img');
    img.src = image;
    img.alt = alt;
    img.loading = 'lazy'; // Se puede ajustar a 'eager' vía props si es LCP
    imgWrapper.appendChild(img);

    // Contenedor de Info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'product-info';

    const h2 = document.createElement('h2');
    h2.className = 'product-title';
    h2.textContent = title;

    const p = document.createElement('p');
    p.className = 'product-tech-desc';
    p.textContent = desc;

    const spanFabric = document.createElement('span');
    spanFabric.className = 'product-fabric';
    spanFabric.textContent = `Tela: ${fabric}`;

    const divPrice = document.createElement('div');
    divPrice.className = 'product-price';
    divPrice.textContent = formatter(price);

    const btn = document.createElement('button');
    btn.className = 'btn btn-add-cart';
    btn.textContent = 'Añadir al Carrito';

    // Ensamblar info
    infoDiv.appendChild(h2);
    infoDiv.appendChild(p);
    infoDiv.appendChild(spanFabric);
    infoDiv.appendChild(divPrice);
    infoDiv.appendChild(btn);

    // Ensamblar tarjeta
    article.appendChild(imgWrapper);
    article.appendChild(infoDiv);

    return article;
  }

  return { createCard };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductCardComponent;
}

