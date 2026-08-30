# 🛡️ ALUVA - Security Guidelines

Este documento detalla las implementaciones de seguridad integradas en la plataforma, alineadas con el roadmap.

## 1. Prevención XSS (Cross-Site Scripting)

La plataforma no utiliza `innerHTML` crudo para procesar datos ni renderiza formularios de captura de datos sensibles (como el de contacto) directamente en HTML estático.

- **`src/utils/sanitizer.js`**: Todos los datos (ya sean atributos DOM, URLs, precios o entradas de usuario) deben pasar por este módulo.
- **Formularios Dinámicos**: Usan `src/components/forms/FormBuilder.js` para construir inputs y procesar textContent seguro.

## 2. Content Security Policy (CSP)

Actualmente implementado como Meta Tag en el HTML (Fase 1/2). En Fase 3, se migrará a los encabezados HTTP del servidor:
```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:;
```
*Previene la inyección y ejecución de scripts externos maliciosos y fuerza las cargas solo desde el origen.*

## 3. Directrices para Fase 3 (Backend)

Una vez que el proyecto se migre a **React/Next.js** y **Node.js**:
- **Tokens de Sesión**: Los JWT (JSON Web Tokens) DEBEN almacenarse **exclusivamente en Cookies `HttpOnly`**. Nunca en `localStorage` o `sessionStorage`.
- **Atributos de Cookie**: Las cookies deben llevar los atributos `Secure` y `SameSite=Strict`.
- **CORS Restrictivo**: Configurar cabeceras CORS en el backend para permitir solicitudes únicamente desde el dominio de producción (`https://aluva.cl`).

## 4. Transacciones Críticas (Fase 4)
- Todo el procesamiento de precios, validación de stock y creación del link de pago se debe hacer en el backend. El cliente solo recibe el enlace seguro a la pasarela (Webpay/MercadoPago).
- Utilizar HMAC para firmar y validar webhooks de confirmación de pago, evitando interceptación (Man in the Middle).

