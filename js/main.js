/* ==========================================================================
   ALUVA - INTERACTIVIDAD PRINCIPAL, FORMULARIOS Y FILTROS DE CATÁLOGO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initSmoothScroll();
  initCatalogFilters();
});

/* Formulario de Contacto Corporativo */
function initContactForm() {
  const contactForm = document.getElementById('aluva-contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value || 'Usuario';
    const email = document.getElementById('contact-email')?.value || '';

    alert(`¡Gracias por contactarnos, ${name}!\nHemos recibido tu consulta y un ejecutivo de ventas corporativas te responderá a ${email} a la brevedad.`);
    contactForm.reset();
  });
}

/* Scroll suave para navegación interna */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

/* Filtro por Categorías en catalogo.html */
function initCatalogFilters() {
  const filterBtns = document.querySelectorAll('.catalog-filter-btn');
  const productCols = document.querySelectorAll('.product-col');

  if (!filterBtns.length || !productCols.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-warning'));
      filterBtns.forEach(b => b.classList.add('btn-outline-dark'));
      
      btn.classList.remove('btn-outline-dark');
      btn.classList.add('active', 'btn-warning');

      const filterValue = btn.getAttribute('data-filter');

      productCols.forEach(col => {
        const category = col.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          col.style.display = 'block';
        } else {
          col.style.display = 'none';
        }
      });
    });
  });
}
