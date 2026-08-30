# ALUVA - Ropa de Trabajo, EPP y Vestuario Personalizado 🛠️🥾

Sistemas y plataforma web e-commerce para **ALUVA**, empresa especializada en el diseño, confección y distribución de ropa de trabajo, vestuario corporativo y Equipos de Protección Personal (EPP)[cite: 2].

---

## 📌 Estado del Proyecto
* **Fase Actual:** Desarrollo de Maquetación Frontend (HTML5, CSS3, Layouts Responsivos)[cite: 1, 2].
* **Próxima Fase:** Integración de Backend, Base de Datos Relacional, APIs Logísticas, Agente IA y Módulo de Reseñas.

---

## 🚀 Funcionalidades del Sistema

### 🛒 Portal de Clientes
* **Experiencia de Usuario (UI/UX):** Landing page con efecto *Parallax* inicial e integración inmediata del catálogo interactivo (*scroll-down*).
* **Catálogo Multicriterio:** Filtros dinámicos por Categoría, Talla, Color y Disponibilidad de Stock en tiempo real.
* **Autenticación y Perfil:** Registro de usuarios con gestión de direcciones de despacho y autocompletado en el carrito (*Checkout*).
* **Cotización de Envíos:** Integración automática de pedidos con couriers chilenos (Chilexpress, Starken, UPS, Correos de Chile).
* **Agente IA Asistente:** Bot inteligente para recomendación de tallas, equipamiento por tipo de faena y consulta de existencias.
* **Módulo de Testimonios Dinámicos:** 
  * Sección exclusiva para clientes registrados donde ingresar reseñas.
  * Sistema de valoración numérica de 1 a 10 representado en estrellas.
  * Algoritmo en la portada que filtra las mejores calificaciones (estrellas máximas) y las muestra aleatoriamente.

### 🔐 Portal Administrador
* **Gestión de Inventario (CRUD):** Creación, edición y baja de productos, categorías, imágenes, matriz de tallas, colores y existencias.
* **Gestión de Pedidos:** Monitoreo del ciclo de vida del pedido (Pendiente, Pagado, En Despacho, Entregado) y emisión de etiquetas.
* **Moderación de Reseñas:** Panel para revisar, aprobar o gestionar los comentarios ingresados por los usuarios.

---

## ⚙️ Condiciones Técnicas y Arquitectura

**1. Frontend y Rendimiento (UI/UX)**
* **Arquitectura de Componentes:** Framework reactivo (React.js / Next.js) para renderizado rápido (*SSR/SSG*).
* **Diseño Responsivo (Mobile First):** Adaptación fluido a dispositivos móviles, tablets y escritorio cumpliendo estándares de CSS (Flexbox/Grid).
* **Manejo de Estado Global:** Uso de Context API o Redux Toolkit para persistir los artículos en el carrito entre sesiones.

**2. Base de Datos Relacional (Modelo E-R)**
* **Modelado de Variantes (SKU):** Separación estricta entre la entidad `Producto` y sus variantes de stock (`Producto_Variante` con atributos `Talla`, `Color` y `Stock_Disponible`).
* **Tabla de Reseñas:** Definición de campos `user_id` (FK), `rating` (Integer 1-10), `comment` (Text), `is_approved` (Boolean) y `created_at` (Timestamp).
* **Consultas Optimizadas:** Índice sobre `rating` e `is_approved` para ejecutar lecturas aleatorias eficientes (`ORDER BY RANDOM() LIMIT N`) en la sección de testimonios.

**3. Integraciones de Envíos y Pasarela de Pago**
* **Integración API REST Couriers:** Conexión mediante middleware o agregador logístico (ej. API Shipit / Envíame) para cotización por API basándose en peso, volumen y comuna de destino.
* **Seguridad en Transacciones:** Uso de pasarelas de pago chilenas con estándares PCI-DSS (Webpay Plus, MercadoPago o Flow).

**4. Agente IA (Asistente de Inventario)**
* **Conexión RAG (Retrieval-Augmented Generation):** Integración con LLM (OpenAI API / Gemini API) usando llamadas a funciones (*Function Calling*) para consultar las tablas de productos y stock sin vulnerar la base de datos.
* **Límite de Tasa (Rate Limiting):** Control de solicitudes por usuario para evitar abuso de la API del bot.

**5. Seguridad y Autenticación**
* **Manejo de Sesiones:** Autenticación vía JWT (JSON Web Tokens) o NextAuth.js con almacenamiento seguro en cookies `HttpOnly`.
* **Encriptación de Contraseñas:** Algoritmo hashing robusto (bcrypt/argon2) para el almacenamiento de credenciales de clientes.

---

## 🛠️ Tecnologías

* **Frontend:** HTML5, CSS3, JavaScript (Fase 1)[cite: 1] -> React / Next.js (Fase 2).
* **Backend:** Node.js (Express / NestJS).
* **Base de Datos:** PostgreSQL / Supabase.
* **Servicios e Integraciones:** APIs Rest (Chilexpress, Starken), API Gemini / OpenAI.

---

## 👥 Equipo de Desarrollo

* **Sebastián Donoso** - *Desarrollador y Maquetador Principal*[cite: 2]
* **Brunno Mori Campos** - *Analista de Requerimientos*[cite: 2]
* **Hugo González Alarcón** - *Encargado de Contenidos y Recursos Gráficos*[cite: 2]
* **Víctor Maureira Flores** - *Documentador y Control de Calidad (QA)*[cite: 2]

---

## 📄 Licencia
Proyecto desarrollado en el marco académico de la asignatura Diseño Web (IPLACEX)[cite: 1, 2].