/* ==========================================================================
   ALUVA - COMPONENTE CATALOGO (Fase 1)
   Orquesta la carga y renderizado de la grilla de productos desde JS.
   ========================================================================== */

const CatalogComponent = (() => {

  function init() {
    const container = document.getElementById('catalog-grid');
    if (!container) return; // Solo ejecutar en páginas con catálogo

    // Obtener datos (En Fase 3 será ApiClient.getProducts())
    let data = [];
    if (typeof PRODUCTS_DATA !== 'undefined') {
      data = PRODUCTS_DATA;
    } else {
      console.error('[ALUVA] Data source de productos no encontrado.');
      container.innerHTML = '<p>Error cargando catálogo.</p>';
      return;
    }

    // Limpiar contenedor (por si hubiera placeholders o skeletons)
    container.innerHTML = '';

    // Renderizar tarjetas
    if (typeof ProductCardComponent !== 'undefined') {
      data.forEach((prod, index) => {
        const card = ProductCardComponent.createCard(prod);
        
        // Optimización LCP: Primera imagen carga ansiosa (fetchpriority high)
        if (index === 0) {
          const img = card.querySelector('img');
          if (img) {
            img.loading = 'eager';
            img.setAttribute('fetchpriority', 'high');
          }
        }
        
        container.appendChild(card);
      });
    } else {
      console.error('[ALUVA] ProductCardComponent no definido.');
    }
  }

  return { init };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CatalogComponent;
} else {
  document.addEventListener('DOMContentLoaded', CatalogComponent.init);
}

