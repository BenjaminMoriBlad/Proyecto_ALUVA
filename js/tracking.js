/* ==========================================================================
   ALUVA - SIMULACIÓN E INTEGRACIÓN DE TRACKING DE ENVÍOS (CHILE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTrackingModule();
});

function initTrackingModule() {
  const form = document.getElementById('tracking-form');
  const input = document.getElementById('tracking-input');
  const resultCard = document.getElementById('tracking-result');

  if (!form || !input || !resultCard) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = input.value.trim().toUpperCase();

    if (!code) return;

    // Configuración inicial de variables logísticas
    let courierName = '';
    let statusText = '';
    let stepCompleted = 1; // 1: Preparación, 2: Tránsito, 3: Listo para retiro

    // Lógica inteligente de análisis del código (Formato / Courier)
    if (code.startsWith('STK')) {
      courierName = 'Starken';
      statusText = 'En tránsito - Rumbo al centro de distribución regional';
      stepCompleted = 2;
    } else if (code.startsWith('CHX')) {
      courierName = 'Chilexpress';
      statusText = 'Listo para retiro - Disponible en sucursal de destino';
      stepCompleted = 3;
    } else if (code.startsWith('COR')) {
      courierName = 'Correos de Chile';
      statusText = 'En preparación - Documentación generada y embalado';
      stepCompleted = 1;
    } else if (code.startsWith('UPS')) {
      courierName = 'UPS Courier';
      statusText = 'En tránsito - Pasando por control aduanero central';
      stepCompleted = 2;
    } else {
      // Regla de longitud para códigos generales introducidos
      if (code.length < 6) {
        courierName = 'Correos de Chile';
        statusText = 'En preparación - Recibido en nuestro taller central';
        stepCompleted = 1;
      } else if (code.length >= 6 && code.length <= 10) {
        courierName = 'Starken';
        statusText = 'En tránsito - Despachado por camión logístico';
        stepCompleted = 2;
      } else {
        courierName = 'Chilexpress';
        statusText = 'Listo para retiro - En espera de su retiro por el cliente';
        stepCompleted = 3;
      }
    }

    // Dibujar los resultados dinámicamente con clases CSS optimizadas
    resultCard.innerHTML = `
      <div class="tracking-result-header">
        <span class="tracking-carrier">${courierName}</span>
        <span class="tracking-code">Nº de Envío: ${code}</span>
      </div>
      <div class="tracking-status">Estado: ${statusText}</div>
      <div class="tracking-steps">
        <div class="tracking-step ${stepCompleted >= 1 ? 'completed' : ''}">
          <div class="step-node">1</div>
          <span class="step-label">Preparación</span>
        </div>
        <div class="tracking-step ${stepCompleted >= 2 ? 'completed' : ''}">
          <div class="step-node">2</div>
          <span class="step-label">En Tránsito</span>
        </div>
        <div class="tracking-step ${stepCompleted >= 3 ? 'completed' : ''}">
          <div class="step-node">3</div>
          <span class="step-label">Listo</span>
        </div>
      </div>
    `;

    // Hacer visible el resultado con animación
    resultCard.classList.add('active');
  });
}

