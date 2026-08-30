/* ==========================================================================
   ALUVA - DATA SOURCE DE PRODUCTOS (Fase 1 → Fase 3 API-Ready)
   Fuente de verdad centralizada para el catálogo de productos.
   En Fase 3, este módulo será reemplazado por llamadas a la API REST.
   ========================================================================== */

/**
 * @typedef {Object} ProductVariant
 * @property {string} sku - Código único de variante (Producto_Variante en modelo E-R)
 * @property {string} talla - Talla disponible
 * @property {string} color - Color disponible
 * @property {number} stock - Unidades en stock (validación final en backend, Fase 3)
 */

/**
 * @typedef {Object} Product
 * @property {string} id - Identificador único del producto
 * @property {string} title - Nombre del producto
 * @property {string} description - Descripción técnica
 * @property {string} fabric - Especificación de tela/material
 * @property {number} price - Precio base en CLP (verificación final en backend)
 * @property {string} image - Ruta relativa a la imagen
 * @property {string} alt - Texto alternativo para accesibilidad
 * @property {string[]} categories - Categorías para filtrado futuro
 * @property {ProductVariant[]} variants - Variantes disponibles (Fase 3)
 */

/** @type {Product[]} */
const PRODUCTS_DATA = [
  {
    id:          'p1',
    title:       'Camisa Ripstop Jubae',
    description: 'Camisa técnica de manga larga, altamente transpirable, ligera y diseñada para resistir condiciones de fricción severa en terreno.',
    fabric:      'Ripstop Técnico Transpirable',
    price:       25990,
    image:       'src/assets/images/productos/BLUSA_JUBAE_HOMBRE.jpeg',
    alt:         'Camisa Ripstop Jubae Hombre de manga larga color gris técnico',
    categories:  ['camisas', 'epp', 'terreno'],
    variants: [
      { sku: 'JUBAE-S',    talla: 'S',    color: 'Gris', stock: 10 },
      { sku: 'JUBAE-M',    talla: 'M',    color: 'Gris', stock: 15 },
      { sku: 'JUBAE-L',    talla: 'L',    color: 'Gris', stock: 12 },
      { sku: 'JUBAE-XL',   talla: 'XL',   color: 'Gris', stock: 8  },
      { sku: 'JUBAE-XXL',  talla: 'XXL',  color: 'Gris', stock: 5  },
      { sku: 'JUBAE-XXXL', talla: 'XXXL', color: 'Gris', stock: 3  },
    ],
  },
  {
    id:          'p2',
    title:       'Chaqueta Softshell',
    description: 'Modelo cortavientos, impermeable y térmico. Posee cierres sellados y bolsillos ergonómicos para equipamiento técnico.',
    fabric:      'Softshell Tricapa Térmico',
    price:       39990,
    image:       'src/assets/images/productos/CHAQUETA_SOFSHEL_1.jpeg',
    alt:         'Chaqueta Softshell técnica color negro con cierre central',
    categories:  ['chaquetas', 'epp', 'frio', 'impermeable'],
    variants: [
      { sku: 'SOFT-S',   talla: 'S',   color: 'Negro', stock: 8  },
      { sku: 'SOFT-M',   talla: 'M',   color: 'Negro', stock: 12 },
      { sku: 'SOFT-L',   talla: 'L',   color: 'Negro', stock: 10 },
      { sku: 'SOFT-XL',  talla: 'XL',  color: 'Negro', stock: 6  },
      { sku: 'SOFT-XXL', talla: 'XXL', color: 'Negro', stock: 4  },
    ],
  },
  {
    id:          'p3',
    title:       'Chaleco Geólogo',
    description: 'Equipamiento de alta visibilidad reglamentario con bandas retrorreflectantes integradas de alta resistencia para faena minera.',
    fabric:      'Poliéster Alta Densidad con Reflectante',
    price:       14990,
    image:       'src/assets/images/productos/GEOLOGO_MINERO_NARANJO.jpeg',
    alt:         'Chaleco geólogo minero de alta visibilidad con bandas reflectantes',
    categories:  ['chalecos', 'epp', 'alta-visibilidad', 'mineria'],
    variants: [
      { sku: 'GEO-S',   talla: 'S',   color: 'Naranjo', stock: 20 },
      { sku: 'GEO-M',   talla: 'M',   color: 'Naranjo', stock: 25 },
      { sku: 'GEO-L',   talla: 'L',   color: 'Naranjo', stock: 18 },
      { sku: 'GEO-XL',  talla: 'XL',  color: 'Naranjo', stock: 12 },
      { sku: 'GEO-XXL', talla: 'XXL', color: 'Naranjo', stock: 8  },
    ],
  },
  {
    id:          'p4',
    title:       'Pantalón Ripstop Mollen',
    description: 'Diseño multibolsillos reforzado con tela antidesgarro, bolsillos cargo de gran volumen y ajuste ergonómico para largas jornadas.',
    fabric:      'Ripstop Antidesgarro 65/35',
    price:       29990,
    image:       'src/assets/images/productos/PANTALON_RIPSTON_1.jpeg',
    alt:         'Pantalón Ripstop Mollen color verde oliva con bolsillos cargo laterales',
    categories:  ['pantalones', 'epp', 'cargo', 'terreno'],
    variants: [
      { sku: 'MOLL-38', talla: '38', color: 'Verde Oliva', stock: 8  },
      { sku: 'MOLL-40', talla: '40', color: 'Verde Oliva', stock: 10 },
      { sku: 'MOLL-42', talla: '42', color: 'Verde Oliva', stock: 12 },
      { sku: 'MOLL-44', talla: '44', color: 'Verde Oliva', stock: 9  },
      { sku: 'MOLL-46', talla: '46', color: 'Verde Oliva', stock: 6  },
      { sku: 'MOLL-48', talla: '48', color: 'Verde Oliva', stock: 4  },
    ],
  },
];

// Exportar para módulos (compatible con ES Modules en Fase 2/Next.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS_DATA };
}
