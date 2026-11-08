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
    id: "permutaciones",
    titulo: "Grupo de permutaciones",
    descripcionCorta:
      "Reetiquetar los dígitos de un Sudoku resuelto revela la estructura de grupo de las permutaciones: composición, inversos y subgrupos cíclicos, con tres actividades interactivas.",
    ruta: "temas/permutaciones/index.html",
    estado: "disponible",
    orden: 4
  },
  {
    id: "cifrado-cesar",
    titulo: "Cifrado César",
    descripcionCorta:
      "El cifrado César es solo una suma módulo n: (Zn, +) es un grupo abeliano, y cada desplazamiento es una permutación del alfabeto. Dos actividades interactivas y un reloj modular.",
    ruta: "temas/cifrado-cesar/index.html",
    estado: "disponible",
    orden: 5
  },
  {
    id: "numeros-complejos",
    titulo: "Números complejos",
    descripcionCorta:
      "Multiplicar números complejos es girar y escalar el plano: módulos que se multiplican, ángulos que se suman, potencias y raíces de la unidad. Cuatro actividades interactivas.",
    ruta: "temas/numeros-complejos/index.html",
    estado: "disponible",
    orden: 6
  },
  {
    id: "grupos",
    titulo: "Grupos",
    descripcionCorta:
      "Tablas de Cayley, simetrías del triángulo y del cuadrado, el grupo de Klein, ejemplos peculiares, no-ejemplos y demostraciones sencillas. Cuatro actividades interactivas.",
    ruta: "temas/grupos/index.html",
    estado: "disponible",
    orden: 7
  },
  {
    id: "anillos",
    titulo: "Anillos",
    descripcionCorta:
      "Dos operaciones que conviven: ejemplos clásicos y peculiares (matrices, enteros de Gauss, funciones continuas), divisores de cero y dominios enteros. Tres actividades interactivas.",
    ruta: "temas/anillos/index.html",
    estado: "disponible",
    orden: 8
  },
  {
    id: "campos",
    titulo: "Campos",
    descripcionCorta:
      "Dónde se puede dividir: ℚ, ℝ, ℂ, ℤ/pℤ, el campo de dos elementos, un campo de cuatro elementos y ℚ(√2). Cuatro actividades interactivas.",
    ruta: "temas/campos/index.html",
    estado: "disponible",
    orden: 9
  },
  {
    id: "espacios-vectoriales",
    titulo: "Espacios vectoriales",
    descripcionCorta:
      "Flechas, polinomios, bits y funciones como vectores: combinaciones lineales, subespacios, ejemplos peculiares y no-ejemplos, para llegar a Álgebra Lineal con buenas bases. Cinco actividades interactivas.",
    ruta: "temas/espacios-vectoriales/index.html",
    estado: "disponible",
    orden: 10
  }
];
