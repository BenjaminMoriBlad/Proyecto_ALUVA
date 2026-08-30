/* ==========================================================================
   ALUVA - COMPONENTE TRACKING (Fase 1)
   Interfaz de usuario para búsqueda y visualización de envíos.
   ========================================================================== */

const TrackingComponent = (() => {
  let form, input, resultCard;
  let lblCarrier, lblCode, lblStatus, stepsContainer;

  function init() {
    form = document.getElementById('tracking-form');
    input = document.getElementById('tracking-input');
    resultCard = document.getElementById('tracking-result-card');
    
    lblCarrier = document.getElementById('res-carrier');
    lblCode = document.getElementById('res-code');
    lblStatus = document.getElementById('res-status');
    stepsContainer = document.getElementById('res-steps');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        processSearch();
      });
    }
  }

  function processSearch() {
    if (typeof TrackingService === 'undefined') {
      console.error('[ALUVA] TrackingService no disponible.');
      return;
    }
    
    // Sanitización inicial
    const rawVal = input.value;
    const safeCode = typeof Sanitizer !== 'undefined' ? Sanitizer.sanitizeAttr(rawVal) : rawVal.trim();

    // Consultar servicio
    const result = TrackingService.resolve(safeCode);
    
    // Renderizar
    renderResult(result);
  }

  function renderResult(res) {
    if (!resultCard) return;

    // Resetear animación forzando reflow
    resultCard.classList.remove('is-active');
    void resultCard.offsetWidth;

    // Usar textContent seguro
    lblCarrier.textContent = res.carrier || 'Búsqueda Fallida';
    lblCode.textContent = res.code ? `Orden: ${res.code}` : '';
    lblStatus.textContent = res.statusText;
    
    // Color de error
    lblStatus.style.color = res.found ? 'var(--color-text-main)' : 'var(--color-text-secondary)';

    // Renderizar pasos si hay (creando elementos DOM para seguridad)
    if (stepsContainer) {
      stepsContainer.innerHTML = ''; // Limpiar previos
      if (res.found && res.steps) {
        res.steps.forEach((label, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum <= res.step;
          
          const div = document.createElement('div');
          div.className = `tracking-step ${isCompleted ? 'is-completed' : ''}`;
          
          const node = document.createElement('div');
          node.className = 'step-node';
          node.textContent = stepNum;
          
          const text = document.createElement('span');
          text.className = 'step-label';
          text.textContent = label;
          
          div.appendChild(node);
          div.appendChild(text);
          stepsContainer.appendChild(div);
        });
      }
    }

    resultCard.classList.add('is-active');
  }

  return { init };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TrackingComponent;
} else {
  document.addEventListener('DOMContentLoaded', TrackingComponent.init);
}

