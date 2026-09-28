/*
  Lista de temas del sitio. Para agregar un tema nuevo:
  1. Crea la carpeta temas/<id>/ siguiendo el patrón de temas/palomar/.
  2. Agrega aquí una entrada con estado: "disponible" y su ruta.
  3. No hay que tocar ningún otro archivo: index.html renderiza las tarjetas
     a partir de este arreglo.
*/
window.TEMAS = [
  {
    id: "palomar",
    titulo: "Principio del palomar",
    descripcionCorta:
      "Si hay más palomas que palomares, algún palomar recibe al menos dos. Intuición, demostración formal y tres actividades interactivas.",
    ruta: "temas/palomar/index.html",
    estado: "disponible",
    orden: 1
  },
  {
    id: "induccion",
    titulo: "Inducción matemática",
    descripcionCorta: "Próximamente: el principio de inducción y sus variantes.",
    ruta: null,
    estado: "proximamente",
    orden: 2
  },
  {
    id: "conjuntos-relaciones",
    titulo: "Conjuntos y relaciones",
    descripcionCorta: "Próximamente: relaciones de equivalencia y de orden.",
    ruta: null,
    estado: "proximamente",
    orden: 3
  },
  {
    id: "permutaciones",
    titulo: "Grupo de permutaciones",
    descripcionCorta:
      "Reetiquetar los dígitos de un Sudoku resuelto revela la estructura de grupo de las permutaciones: composición, inversos y subgrupos cíclicos, con tres actividades interactivas.",
    ruta: "temas/permutaciones/index.html",
    estado: "disponible",
    orden: 4
  }
];
