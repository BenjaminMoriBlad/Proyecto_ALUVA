/* ==========================================================================
   ALUVA - FORM BUILDER (Fase 2)
   Constructor de formularios seguros. Renderiza inputs dinámicos en el DOM.
   ========================================================================== */

const FormBuilder = (() => {

  /**
   * @typedef {Object} FieldConfig
   * @property {string} id
   * @property {string} label
   * @property {string} type - 'text', 'email', 'tel', 'textarea'
   * @property {boolean} required
   * @property {string} placeholder
   * @property {string} errorMsg
   * @property {Function} validator - Función (value) => boolean
   */

  /**
   * Crea un contenedor .form-group con label, input y mensaje de error.
   * @param {FieldConfig} config
   * @returns {HTMLElement}
   */
  function createField(config) {
    const group = document.createElement('div');
    group.className = 'form-group';

    // Label
    const lbl = document.createElement('label');
    lbl.className = 'form-label';
    lbl.htmlFor = config.id;
    lbl.textContent = config.label;
    group.appendChild(lbl);

    // Input o Textarea
    const isTextarea = config.type === 'textarea';
    const input = document.createElement(isTextarea ? 'textarea' : 'input');
    
    input.id = config.id;
    input.name = config.id;
    input.className = isTextarea ? 'form-textarea' : 'form-input';
    if (!isTextarea) input.type = config.type;
    if (config.required) input.required = true;
    if (config.placeholder) input.placeholder = config.placeholder;
    if (config.type === 'email') input.autocomplete = 'email';
    if (config.type === 'tel') input.autocomplete = 'tel';

    // Validación On-the-fly
    input.addEventListener('blur', () => {
      validateField(input, config);
    });
    input.addEventListener('input', () => {
      // Limpiar error al tipear
      input.classList.remove('is-invalid');
    });

    group.appendChild(input);

    // Error Message
    const errMsg = document.createElement('span');
    errMsg.className = 'form-error-msg';
    errMsg.id = `${config.id}-error`;
    errMsg.textContent = config.errorMsg || 'Campo inválido';
    group.appendChild(errMsg);

    return group;
  }

  function validateField(input, config) {
    const val = input.value.trim();
    let isValid = true;
    
    if (config.required && val === '') {
      isValid = false;
    } else if (config.validator && !config.validator(val)) {
      isValid = false;
    }

    if (isValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    }
    
    return isValid;
  }

  /**
   * Crea un botón de submit.
   * @param {string} text
   * @returns {HTMLElement}
   */
  function createSubmitBtn(text) {
    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'btn';
    btn.textContent = text;
    return btn;
  }

  return { createField, createSubmitBtn };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormBuilder;
}

