# Arquitectura Frontend ALUVA

El proyecto se ha refactorizado bajo un patrón modular similar al de frameworks modernos (como React), pero implementado con JavaScript vainilla (Vanilla JS) para asegurar rendimiento, control absoluto y preparar el terreno para la **Fase 2 y 3 (Next.js)**.

## Jerarquía del Directorio `/src`

### `/styles/`
Contiene CSS segmentado por responsabilidad.
- `variables.css`: La fuente de la verdad para el diseño (colores, espaciado, breakpoints).
- `reset.css` & `main.css`: Normalización y utilidades de layout global (`.container`, `.grid-X`).
- `/components/`: Un archivo CSS por cada componente modular (ej. `header.css`, `catalog.css`).

### `/utils/`
Módulos sin dependencias (Puros).
- `sanitizer.js`: Abstracción de seguridad fundamental. Evita inyecciones de código.
- `formatter.js`: Utilidades de string/number para la UI.
- `products.data.js`: Simula una base de datos local JSON (Data Source).

### `/services/`
Patrón controlador. Mantienen el estado y se conectan a APIs.
- `cartService.js`: Sincroniza el carrito y usa patrón Publisher/Subscriber para notificar a la UI.
- `apiClient.js`: Capa de transporte Fetch unificada.

### `/components/`
Manipulan el DOM en base al estado de los servicios.
- Todo lo que dependa del usuario (Formularios) o de la data (Catálogo) se construye aquí mediante `document.createElement()` (o análogos) en vez de escribir el HTML a mano.
- Contiene un subdirectorio `/forms` exclusivo para la construcción segura de inputs y validación on-the-fly.

## Beneficios
- **Seguridad**: Se elimina el código vulnerable y el estado sucio global.
- **Escalabilidad**: Listo para copiar y pegar cada archivo en componentes funcionales de React (`.jsx` / `.tsx`).
- **Mantenibilidad**: Si hay un problema en un botón, solo se revisa el componente responsable, no un archivo de 2000 líneas.

