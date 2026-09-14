# ALUVA — Ropa de Trabajo, EPP y Vestuario Personalizado 🛠️🥾

Sitio web frontend para **ALUVA**, empresa orientada a la comercialización de ropa de trabajo, vestuario técnico, vestuario corporativo personalizado y elementos de protección personal (EPP).

El proyecto corresponde a la **migración y adaptación del sitio web de ALUVA al template Classic Shop**, incorporando una interfaz responsive y diferentes funcionalidades interactivas desarrolladas con HTML5, CSS3 y JavaScript.

---

## 📌 Estado del proyecto

**Estado actual:** Prototipo frontend funcional / Maquetación web interactiva.

La versión actual se concentra en la presentación corporativa de ALUVA, catálogo de productos, carrito de compras, formulario de contacto y módulo de simulación de seguimiento de envíos.

El proyecto **no cuenta actualmente con backend, base de datos, autenticación de usuarios ni integraciones reales con APIs externas de pago o logística**.

Las funcionalidades de backend, base de datos, autenticación, pasarelas de pago, integraciones logísticas y otros servicios pueden considerarse como líneas de evolución futuras.

---

# 🎯 Objetivo del proyecto

El objetivo principal es adaptar el sitio web de ALUVA a una estructura visual moderna basada en un template estándar de comercio electrónico.

La implementación busca:

* Mejorar la presentación visual de la empresa.
* Organizar el catálogo de productos.
* Facilitar la navegación del usuario.
* Incorporar una experiencia responsive.
* Implementar interacciones mediante JavaScript.
* Incorporar un carrito de compras funcional a nivel frontend.
* Incorporar un módulo de seguimiento de envíos simulado.
* Facilitar el contacto comercial mediante WhatsApp y formulario web.

---

# 🚀 Funcionalidades implementadas

## 🏠 Página principal

La página `index.html` funciona como página principal corporativa del proyecto.

Incluye:

* Barra superior corporativa.
* Información de contacto.
* Enlaces a redes sociales.
* Menú principal responsive.
* Banner principal tipo hero.
* Presentación de la propuesta de valor.
* Sección "Quiénes Somos".
* Sección de equipo.
* Productos destacados.
* Testimonios estáticos.
* Formulario de contacto corporativo.
* Información de contacto directo.
* Botón flotante de WhatsApp.
* Acceso al catálogo.
* Acceso al seguimiento de envíos.
* Acceso al carrito de compras.

---

# 🛍️ Catálogo de productos

El archivo `catalogo.html` contiene el catálogo oficial de productos ALUVA 2026.

Actualmente se encuentran definidos **10 productos** dentro del código frontend.

Las categorías implementadas son:

* Polerones & Chaquetas.
* Camisas & Blusas.
* Pantalones Cargo.
* Primera Capa.
* Accesorios & EPP.

El catálogo permite filtrar los productos dinámicamente según su categoría.

Cada producto incorpora información como:

* Código de referencia.
* Nombre.
* Descripción.
* Categoría.
* Talla o característica.
* Precio.
* Imagen.
* Botón para añadir al carrito.

---

# 🛒 Carrito de compras

El proyecto incorpora un carrito de compras desarrollado mediante JavaScript.

La lógica principal se encuentra en:

```text
js/cart.js
```

El carrito permite:

* Agregar productos.
* Incrementar cantidades.
* Disminuir cantidades.
* Eliminar productos.
* Visualizar la cantidad total de artículos.
* Calcular subtotal.
* Aplicar descuentos.
* Calcular total final.
* Abrir y cerrar el carrito lateral.
* Mantener los productos almacenados mediante `localStorage`.

## 🎟️ Cupones

El sistema frontend contempla los siguientes códigos promocionales:

| Cupón       | Descuento |
| ----------- | --------: |
| `ALUVA10`   |       10% |
| `ALUVA20`   |       20% |
| `PREMIUM15` |       15% |

Estos descuentos se gestionan localmente mediante JavaScript y `localStorage`.

---

## 💳 Checkout

El botón **"Finalizar Compra"** permite iniciar una simulación del proceso de checkout.

Actualmente no existe una pasarela de pago real conectada al proyecto.

El proceso actual muestra un mensaje informativo y posteriormente limpia el carrito y los datos almacenados localmente.

Una futura versión podría incorporar una pasarela como Webpay, Flow o Mercado Pago mediante un backend seguro.

---

# 🚚 Seguimiento de envíos

El archivo:

```text
seguimiento.html
```

incorpora una interfaz para consultar el estado de un envío mediante un código de seguimiento.

La lógica se encuentra en:

```text
js/tracking.js
```

Actualmente el módulo funciona como una **simulación frontend**.

El sistema reconoce códigos asociados a distintos transportistas:

| Prefijo | Transportista    |
| ------- | ---------------- |
| `STK`   | Starken          |
| `CHX`   | Chilexpress      |
| `COR`   | Correos de Chile |
| `UPS`   | UPS              |

Dependiendo del código ingresado, se muestra un transportista y un estado simulado del pedido.

> **Importante:** actualmente no existe conexión mediante API con estos operadores logísticos.

---

# 💬 Formulario de contacto

La página principal incorpora un formulario de contacto corporativo.

Los campos disponibles son:

* Nombre completo.
* Correo electrónico.
* Teléfono / WhatsApp.
* Mensaje o consulta.

El formulario es gestionado mediante JavaScript y actualmente funciona como una simulación de recepción de la solicitud. Al enviarlo se muestra un mensaje de confirmación y se reinicia el formulario.

No existe actualmente una conexión con un servidor, base de datos o servicio de correo.

---

# 📱 Contacto mediante WhatsApp

El sitio incorpora botones de contacto directo mediante WhatsApp.

Estos permiten facilitar consultas relacionadas con:

* Cotizaciones.
* Personalización de prendas.
* Productos del catálogo.
* Consultas comerciales.

El botón se encuentra disponible tanto en la página principal como en el catálogo.

---

# ⭐ Testimonios

La página principal incorpora una sección visual de testimonios de clientes.

Actualmente los testimonios se encuentran definidos directamente dentro del HTML y funcionan como contenido estático.

No existe en esta versión:

* Registro de usuarios.
* Sistema de reseñas.
* Calificación de productos.
* Base de datos de comentarios.
* Moderación administrativa.
* Algoritmo dinámico de selección de testimonios.

Estas funcionalidades pueden ser incorporadas en una futura etapa de desarrollo.

---

# 🎨 Diseño y experiencia de usuario

El proyecto utiliza como base el template **Classic Shop**, adaptándolo visualmente a la identidad de ALUVA.

La personalización se realiza principalmente mediante:

```text
css/custom-aluva.css
```

Además, se utilizan recursos del template y hojas de estilo relacionadas con la tienda:

```text
css/plugins/plugins.css
css/shop-style.css
```

El diseño utiliza una estructura responsive para permitir la visualización en:

* Computadores.
* Notebooks.
* Tablets.
* Smartphones.

---

# 🧩 Tecnologías utilizadas

| Tecnología    | Uso                                  |
| ------------- | ------------------------------------ |
| HTML5         | Estructura de las páginas            |
| CSS3          | Diseño y personalización             |
| JavaScript    | Interactividad y lógica frontend     |
| Bootstrap 4   | Grid y componentes responsive        |
| jQuery        | Funciones utilizadas por el template |
| Font Awesome  | Iconografía                          |
| Et-line Icons | Iconos del template                  |
| localStorage  | Persistencia local del carrito       |

El proyecto utiliza los recursos frontend proporcionados por el template Classic Shop y sus plugins asociados.

---

# 📁 Estructura principal

```text
Proyecto_ALUVA_ClassicShop/
│
├── assets/
│   └── images/
│       ├── banners/
│       └── productos/
│
├── bower_components/
│
├── css/
│   ├── plugins/
│   ├── custom-aluva.css
│   └── shop-style.css
│
├── et-line-font/
│
├── js/
│   ├── plugins/
│   ├── assan.custom.js
│   ├── cart.js
│   ├── main.js
│   └── tracking.js
│
├── revolution/
│
├── catalogo.html
├── index.html
├── seguimiento.html
│
├── Informe_Migracion_ALUVA.md
└── README.md
```

---

# 📄 Páginas principales

| Página      | Archivo            | Descripción                         |
| ----------- | ------------------ | ----------------------------------- |
| Inicio      | `index.html`       | Página corporativa principal        |
| Catálogo    | `catalogo.html`    | Catálogo de productos ALUVA 2026    |
| Seguimiento | `seguimiento.html` | Simulación de seguimiento de envíos |

---

# ⚙️ Ejecución del proyecto

El proyecto es una aplicación frontend estática, por lo que no requiere actualmente un servidor backend ni una base de datos.

## Opción 1 — Navegador

Clonar el repositorio:

```bash
git clone https://github.com/hugogonzaleza7/Proyecto_ALUVA_ClassicShop.git
```

Ingresar a la carpeta:

```bash
cd Proyecto_ALUVA_ClassicShop
```

Abrir:

```text
index.html
```

en un navegador web.

## Opción 2 — Visual Studio Code

Se recomienda utilizar **Visual Studio Code** junto con una extensión como **Live Server** para ejecutar el proyecto mediante un servidor local.

---

# 🧪 Funcionalidades a probar

### Página principal

* [ ] Navegación entre secciones.
* [ ] Menú responsive.
* [ ] Botón de WhatsApp.
* [ ] Redes sociales.
* [ ] Formulario de contacto.
* [ ] Productos destacados.
* [ ] Testimonios.
* [ ] Acceso al catálogo.
* [ ] Acceso al seguimiento.

### Catálogo

* [ ] Visualización de productos.
* [ ] Filtro por categoría.
* [ ] Agregar productos al carrito.
* [ ] Visualización del carrito.
* [ ] Modificación de cantidades.
* [ ] Eliminación de productos.
* [ ] Aplicación de cupones.
* [ ] Cálculo de subtotal y total.

### Seguimiento

* [ ] Ingreso de código.
* [ ] Identificación del transportista.
* [ ] Visualización del estado simulado.
* [ ] Visualización del progreso del envío.

---

# 🔮 Evolución futura

Una futura etapa del proyecto podría incorporar una arquitectura full-stack que permita transformar el prototipo frontend en una plataforma e-commerce completa.

Entre las posibles funcionalidades futuras se encuentran:

### Backend

* Node.js.
* Express o NestJS.
* API REST.
* Gestión de usuarios.
* Gestión de productos.
* Gestión de pedidos.

### Base de datos

* PostgreSQL.
* Supabase u otra solución relacional.

### Autenticación

* Registro e inicio de sesión.
* Gestión de perfiles.
* Direcciones de despacho.
* Control de sesiones.

### Gestión administrativa

* CRUD de productos.
* Gestión de categorías.
* Gestión de stock.
* Gestión de pedidos.
* Gestión de usuarios.
* Moderación de reseñas.

### Logística

* Integración real con APIs de operadores logísticos.
* Consulta de estados reales.
* Cotización de despachos.

### Pagos

* Webpay.
* Flow.
* Mercado Pago.

### Reseñas

* Registro de opiniones.
* Sistema de valoración.
* Moderación.
* Almacenamiento en base de datos.

### Inteligencia artificial

Como línea futura de investigación y desarrollo podría incorporarse un asistente basado en IA para:

* Recomendar productos.
* Orientar sobre tallas.
* Consultar disponibilidad.
* Recomendar equipamiento según el tipo de trabajo.

Estas funcionalidades corresponden a **proyecciones futuras y no forman parte de la implementación frontend actual**.

---

# 👥 Equipo de desarrollo

| Integrante             | Rol                                         |
| ---------------------- | ------------------------------------------- |
| Sebastián Donoso       | Desarrollador y Maquetador Principal        |
| Brunno Mori Campos     | Analista de Requerimientos                  |
| Hugo González Alarcón  | Encargado de Contenidos y Recursos Gráficos |
| Víctor Maureira Flores | Documentador y Control de Calidad (QA)      |

---

# 📚 Documentación complementaria

El repositorio también contiene:

```text
Informe_Migracion_ALUVA.md
```

Este documento contiene información relacionada con el proceso de migración y adaptación del sitio hacia el template Classic Shop.

---

# 📄 Licencia

Proyecto desarrollado con fines académicos en el marco de la asignatura **Diseño Web — IPLACEX**.

Los recursos pertenecientes al template y otros componentes de terceros mantienen sus respectivas condiciones de uso y licenciamiento.

---

## 🔗 Repositorio

**Proyecto ALUVA — Classic Shop**

https://github.com/hugogonzaleza7/Proyecto_ALUVA_ClassicShop
