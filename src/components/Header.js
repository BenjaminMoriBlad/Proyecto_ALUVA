/* ==========================================================================
   ALUVA - HEADER COMPONENT (Fase 1)
   Maneja la lógica del menú hamburguesa, overlay mobile y enlaces activos.
   ========================================================================== */

const HeaderComponent = (() => {
  function init() {
    const hamburger = document.getElementById('nav-hamburger');
    const overlay = document.getElementById('nav-mobile-overlay');
    const headerLinks = document.querySelectorAll('nav a, .nav-mobile-overlay a');
    
    // Marcar enlace activo según la URL actual
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    headerLinks.forEach(link => {
      const href = link.getAttribute('href');
      // Limpiar query params o hashes para la comparación
      const cleanHref = href ? href.split('#')[0] : '';
      if (cleanHref === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Lógica del menú Hamburguesa
    if (hamburger && overlay) {
      hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;
        
        hamburger.setAttribute('aria-expanded', String(newState));
        
        if (newState) {
          overlay.classList.add('is-open');
          document.body.style.overflow = 'hidden'; // Evita scroll de fondo
        } else {
          overlay.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      });

      // Cerrar al hacer clic en un enlace del overlay
      overlay.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.setAttribute('aria-expanded', 'false');
          overlay.classList.remove('is-open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  return { init };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeaderComponent;
} else {
  document.addEventListener('DOMContentLoaded', HeaderComponent.init);
}

