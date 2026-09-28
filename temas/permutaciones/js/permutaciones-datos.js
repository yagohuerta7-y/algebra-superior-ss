/*
  Datos de contenido del tema "Grupo de permutaciones": el Sudoku resuelto
  usado como ejemplo en las tres actividades, y las 8 preguntas del
  cuestionario final. Separar los datos de la lógica (ver
  permutaciones-actividadN.js y permutaciones-quiz.js) facilita agregar o
  editar preguntas sin tocar código.
*/

window.SUDOKU_RESUELTO = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

window.PERMUTACIONES_QUIZ = [
  {
    id: "q1",
    tipo: "opcion",
    pregunta:
      "Sea $\\sigma \\in S_9$ dada por la notación de dos líneas " +
      "$\\begin{pmatrix}1&2&3&4&5&6&7&8&9\\\\3&4&5&2&1&6&7&8&9\\end{pmatrix}$. " +
      "¿Cuál es su notación de ciclos (omitiendo puntos fijos)?",
    opciones: ["(1 3 5)(2 4)", "(1 2 3)(4 5)", "(1 3 5 2 4)", "(1 2)(3 4)(5)"],
    respuestaCorrecta: 0,
    retroCorrecta:
      "Correcto: siguiendo las imágenes, 1→3→5→1 forma el ciclo (1 3 5), y 2→4→2 forma el ciclo " +
      "(2 4); los demás dígitos son fijos.",
    retroIncorrecta:
      "Incorrecto. Sigue las imágenes desde 1: σ(1)=3, σ(3)=5, σ(5)=1, lo que da el ciclo (1 3 5); " +
      "y σ(2)=4, σ(4)=2 da el ciclo (2 4). Los dígitos 6,7,8,9 quedan fijos."
  },
  {
    id: "q2",
    tipo: "vf",
    pregunta:
      "Para casi cualquier par de permutaciones $\\sigma, \\tau \\in S_9$, se cumple que " +
      "$\\sigma \\circ \\tau = \\tau \\circ \\sigma$.",
    respuestaCorrecta: 1,
    retroCorrecta:
      "Correcto: es falso en general. $S_9$ no es un grupo abeliano: existen σ, τ tales que " +
      "$\\sigma\\circ\\tau \\neq \\tau\\circ\\sigma$ (compruébalo en la Actividad 2).",
    retroIncorrecta:
      "Incorrecto. En general $\\sigma\\circ\\tau \\neq \\tau\\circ\\sigma$: la composición de " +
      "permutaciones no es conmutativa (verifícalo con el botón «Comparar» de la Actividad 2)."
  },
  {
    id: "q3",
    tipo: "opcion",
    pregunta:
      "¿Qué papel juega la permutación identidad $\\text{id}$ (la que deja cada dígito fijo) " +
      "dentro de $S_9$?",
    opciones: [
      "Es el elemento neutro: $\\text{id}\\circ\\sigma = \\sigma\\circ\\text{id} = \\sigma$ para toda σ.",
      "Es la única permutación que no tiene inverso.",
      "Es la permutación de mayor orden posible en $S_9$.",
      "No pertenece a $S_9$ porque no reordena nada."
    ],
    respuestaCorrecta: 0,
    retroCorrecta:
      "Correcto: la identidad es el elemento neutro del grupo $(S_9,\\circ)$: componerla con " +
      "cualquier σ (por cualquier lado) deja σ sin cambios.",
    retroIncorrecta:
      "Incorrecto. La identidad sí pertenece a $S_9$ (es una biyección válida) y es precisamente " +
      "el elemento neutro: $\\text{id}\\circ\\sigma=\\sigma\\circ\\text{id}=\\sigma$."
  },
  {
    id: "q4",
    tipo: "opcion",
    pregunta: "Si $\\sigma(1)=3$, ¿cuánto vale $\\sigma^{-1}(3)$?",
    opciones: ["1", "3", "No se puede saber sin conocer toda σ.", "0"],
    respuestaCorrecta: 0,
    retroCorrecta:
      "Correcto: por definición, $\\sigma^{-1}$ deshace lo que hace σ, así que si $\\sigma(1)=3$ " +
      "entonces $\\sigma^{-1}(3)=1$.",
    retroIncorrecta:
      "Incorrecto. La inversa satisface $\\sigma^{-1}(\\sigma(x))=x$; como $\\sigma(1)=3$, se " +
      "sigue que $\\sigma^{-1}(3)=1$."
  },
  {
    id: "q5",
    tipo: "opcion",
    pregunta:
      "Si $\\sigma \\in S_9$ se descompone en ciclos disjuntos de longitudes 3 y 4 (el resto de " +
      "los dígitos son fijos), ¿cuál es el orden de σ?",
    opciones: ["7", "12", "3", "4"],
    respuestaCorrecta: 1,
    retroCorrecta:
      "Correcto: el orden de σ es el mínimo común múltiplo de las longitudes de sus ciclos: " +
      "$\\text{mcm}(3,4)=12$.",
    retroIncorrecta:
      "Incorrecto. El orden de una permutación es el mínimo común múltiplo (no la suma) de las " +
      "longitudes de sus ciclos disjuntos: $\\text{mcm}(3,4)=12$."
  },
  {
    id: "q6",
    tipo: "vf",
    pregunta:
      "El conjunto $\\langle\\sigma\\rangle = \\{\\text{id}, \\sigma, \\sigma^2, \\dots, " +
      "\\sigma^{k-1}\\}$, donde $k$ es el orden de σ, es siempre un subgrupo de $S_9$.",
    respuestaCorrecta: 0,
    retroCorrecta:
      "Correcto: $\\langle\\sigma\\rangle$ es el subgrupo cíclico generado por σ. Contiene a la " +
      "identidad, es cerrado bajo composición (componer dos potencias de σ da otra potencia de " +
      "σ) y bajo inversos (el inverso de $\\sigma^i$ es $\\sigma^{k-i}$, que también está en el " +
      "conjunto).",
    retroIncorrecta:
      "Incorrecto. $\\langle\\sigma\\rangle$ sí es siempre un subgrupo: es cerrado bajo " +
      "composición e inversos, y contiene a la identidad ($\\sigma^0$)."
  },
  {
    id: "q7",
    tipo: "opcion",
    pregunta:
      "Construyes una asignación de cada dígito $1,\\dots,9$ a otro dígito del mismo conjunto " +
      "$\\{1,\\dots,9\\}$ y verificas que ningún dígito se repite como imagen (es decir, es " +
      "inyectiva). ¿Por qué eso ya garantiza que también es una permutación (biyectiva)?",
    opciones: [
      "Porque el dominio y el codominio son el mismo conjunto finito con 9 elementos: por el " +
        "principio del palomar, una función inyectiva entre conjuntos finitos del mismo tamaño " +
        "es automáticamente sobreyectiva.",
      "Porque toda función entre conjuntos de dígitos es automáticamente biyectiva.",
      "No es cierto: hace falta verificar la sobreyectividad por separado, sin relación con la " +
        "inyectividad.",
      "Porque 9 es un número impar."
    ],
    respuestaCorrecta: 0,
    retroCorrecta:
      "Correcto: es la misma idea del principio del palomar. Si $f:A\\to B$ es inyectiva y " +
      "$|A|=|B|$ (ambos finitos), entonces $f$ también es sobreyectiva, y por tanto biyectiva.",
    retroIncorrecta:
      "Incorrecto. La clave es que el dominio y el codominio tienen el mismo tamaño finito (9 " +
      "elementos): en ese caso, inyectiva implica sobreyectiva, así que basta verificar que no " +
      "haya repeticiones."
  },
  {
    id: "q8",
    tipo: "opcion",
    pregunta:
      "¿Cuántas permutaciones distintas hay en $S_9$, el conjunto de todas las biyecciones de " +
      "$\\{1,\\dots,9\\}$ en sí mismo?",
    opciones: ["$9^9$", "$9 \\times 8$", "$9! = 362\\,880$", "$2^9$"],
    respuestaCorrecta: 2,
    retroCorrecta:
      "Correcto: hay $9!$ formas de asignar biyectivamente las imágenes: 9 opciones para " +
      "$\\sigma(1)$, 8 restantes para $\\sigma(2)$, etc.",
    retroIncorrecta:
      "Incorrecto. Se cuenta como $9\\times 8\\times 7\\times\\cdots\\times 1 = 9! = 362\\,880$: " +
      "9 opciones para la imagen de 1, 8 opciones restantes para la imagen de 2, y así " +
      "sucesivamente."
  }
];
