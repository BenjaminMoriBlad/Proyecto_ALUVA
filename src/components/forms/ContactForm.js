/* ==========================================================================
   ALUVA - CONTACT FORM DINÁMICO (Fase 2)
   Renderiza y gestiona el formulario de contacto para evitar HTML estático.
   ========================================================================== */

const ContactForm = (() => {

  // Configuraciones de validación Regex
  const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const REGEX_PHONE = /^\+?[0-9\s\-()]{8,15}$/;

  const fieldsConfig = [
    {
      id: 'nombre',
      label: 'Nombre Completo',
      type: 'text',
      required: true,
      placeholder: 'Ej: Juan Pérez',
      errorMsg: 'Por favor, ingresa tu nombre completo.',
      validator: (val) => val.length >= 3
    },
    {
      id: 'correo',
      label: 'Correo Electrónico',
      type: 'email',
      required: true,
      placeholder: 'Ej: jperez@empresa.cl',
      errorMsg: 'Ingresa un correo electrónico válido.',
      validator: (val) => REGEX_EMAIL.test(val)
    },
    {
      id: 'telefono',
      label: 'Teléfono / WhatsApp',
      type: 'tel',
      required: false,
      placeholder: 'Ej: +56 9 1234 5678',
      errorMsg: 'El teléfono debe ser válido.',
      validator: (val) => val === '' || REGEX_PHONE.test(val)
    },
    {
      id: 'mensaje',
      label: 'Mensaje o Consulta Especial',
      type: 'textarea',
      required: true,
      placeholder: 'Indica detalles de cotización, cantidad de prendas...',
      errorMsg: 'El mensaje es obligatorio (mínimo 10 caracteres).',
      validator: (val) => val.length >= 10
    }
  ];

  function init() {
    const container = document.getElementById('contact-form-container');
    if (!container) return;
    
    if (typeof FormBuilder === 'undefined') {
      console.error('[ALUVA] FormBuilder no disponible.');
      return;
    }

    // Limpiar contenedor y crear form
    container.innerHTML = '';
    const form = document.createElement('form');
    form.noValidate = true; // Desactiva validación nativa para usar la custom
    form.className = 'form-wrapper';
    
    // Generar campos
    const inputs = [];
    fieldsConfig.forEach(conf => {
      form.appendChild(FormBuilder.createField(conf));
      inputs.push(conf.id);
    });

    // Agregar botón y feedback global
    const btn = FormBuilder.createSubmitBtn('Enviar Mensaje');
    const feedback = document.createElement('div');
    feedback.className = 'form-feedback';
    feedback.style.display = 'none';
    feedback.style.fontSize = '0.9rem';
    feedback.style.fontWeight = '600';
    feedback.style.marginTop = 'var(--space-md)';
    
    form.appendChild(btn);
    form.appendChild(feedback);

    // Evento Submit
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Forzar blur para validar todos los campos visibles
      let isFormValid = true;
      inputs.forEach(id => {
        const el = document.getElementById(id);
        el.focus(); el.blur();
        if (el.classList.contains('is-invalid')) isFormValid = false;
      });

      if (!isFormValid) {
        showFeedback(feedback, 'Corrige los errores en rojo antes de enviar.', 'error');
        return;
      }

      // Recolectar data cruda
      const rawData = {
        nombre: document.getElementById('nombre').value,
        correo: document.getElementById('correo').value,
        telefono: document.getElementById('telefono').value,
        mensaje: document.getElementById('mensaje').value,
      };

      // ⚠️ Fase 2: Sanitización obligatoria antes de procesar/enviar
      const safeData = typeof Sanitizer !== 'undefined' 
        ? Sanitizer.sanitizeContactForm(rawData)
        : rawData;

      btn.disabled = true;
      btn.textContent = 'Enviando...';

      try {
        // Fase 3 Stub: Enviar a API
        if (typeof ApiClient !== 'undefined') {
          await ApiClient.submitContact(safeData);
        } else {
          // Simular latencia de red si ApiClient no está (entorno dev Fase 1)
          await new Promise(r => setTimeout(r, 800));
        }
        
        form.reset();
        inputs.forEach(id => document.getElementById(id).classList.remove('is-valid'));
        showFeedback(feedback, 'Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
      } catch (err) {
        showFeedback(feedback, 'Ocurrió un error de red. Intenta nuevamente.', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Enviar Mensaje';
      }
    });

    container.appendChild(form);
  }

  function showFeedback(el, msg, type) {
    el.textContent = msg;
    el.style.color = type === 'success' ? 'var(--color-text-main)' : '#e53e3e';
    el.style.display = 'block';
  }

  return { init };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContactForm;
} else {
  document.addEventListener('DOMContentLoaded', ContactForm.init);
}

