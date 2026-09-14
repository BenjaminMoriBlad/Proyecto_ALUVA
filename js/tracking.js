/* ==========================================================================
   ALUVA - LÓGICA DE RASTREO Y SEGUIMIENTO DE ENVÍOS (LOGÍSTICA)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTrackingModule();
});

function initTrackingModule() {
  const form = document.getElementById('tracking-form');
  const input = document.getElementById('tracking-input');
  const resultBox = document.getElementById('tracking-result-box');

  if (!form || !input || !resultBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = input.value.trim().toUpperCase();

    if (!code) return;

    let courierName = '';
    let statusText = '';
    let stepCompleted = 1; // 1: Preparación, 2: Tránsito, 3: Entregado

    if (code.startsWith('STK')) {
      courierName = 'Starken';
      statusText = 'En tránsito - Rumbo al centro de distribución regional (Los Andes)';
      stepCompleted = 2;
    } else if (code.startsWith('CHX')) {
      courierName = 'Chilexpress';
      statusText = 'Listo para retiro en sucursal destino';
      stepCompleted = 3;
    } else if (code.startsWith('COR')) {
      courierName = 'Correos de Chile';
      statusText = 'En preparación - Documentación y embalaje listo en taller';
      stepCompleted = 1;
    } else if (code.startsWith('UPS')) {
      courierName = 'UPS Courier';
      statusText = 'En tránsito internacional / Acondicionamiento de carga';
      stepCompleted = 2;
    } else {
      if (code.length < 6) {
        courierName = 'Correos de Chile';
        statusText = 'En preparación - Pedido recepcionado';
        stepCompleted = 1;
      } else if (code.length >= 6 && code.length <= 10) {
        courierName = 'Starken';
        statusText = 'En tránsito - Despachado en camión de ruta';
        stepCompleted = 2;
      } else {
        courierName = 'Chilexpress';
        statusText = 'Listo para retiro / En reparto final';
        stepCompleted = 3;
      }
    }

    resultBox.innerHTML = `
      <div class="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
        <h5 class="mb-0 text-dark font-weight-bold"><i class="fa fa-truck text-warning mr-2"></i> ${courierName}</h5>
        <span class="badge badge-dark p-2">Código: ${code}</span>
      </div>
      <p class="mb-3 text-secondary"><strong>Estado Actual:</strong> <span class="text-dark font-weight-bold">${statusText}</span></p>
      
      <div class="tracking-steps-nav">
        <div class="tracking-step-item ${stepCompleted >= 1 ? 'completed' : ''}">
          <div class="circle-node">1</div>
          <div class="step-text">En preparación</div>
        </div>
        <div class="tracking-step-item ${stepCompleted >= 2 ? (stepCompleted === 2 ? 'active' : 'completed') : ''}">
          <div class="circle-node">2</div>
          <div class="step-text">En tránsito</div>
        </div>
        <div class="tracking-step-item ${stepCompleted >= 3 ? 'completed' : ''}">
          <div class="circle-node">3</div>
          <div class="step-text">Listo / Entregado</div>
        </div>
      </div>
    `;

    resultBox.classList.add('active');
  });
}
