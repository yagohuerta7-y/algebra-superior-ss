/*
  Datos de contenido del tema "Principio del palomar": los 4 problemas
  guiados de la actividad 3 y las 7 preguntas del cuestionario final.
  Separar los datos de la lógica (ver palomar-actividad3.js y
  palomar-quiz.js) facilita agregar o editar preguntas sin tocar código.
*/

window.PALOMAR_PROBLEMAS = [
  {
    id: "p1",
    titulo: "a) La función suma",
    enunciado:
      "Sea $A = \\{1,2,3,4,5\\}$ y consideremos la función $S : A \\times A \\to \\mathbb{Z}$ dada por $S(x,y) = x+y$. " +
      "El conjunto de valores posibles de $S$ es $\\{2,3,\\dots,10\\}$, que tiene 9 elementos. ¿Es $S$ inyectiva?",
    pista: "¿Cuántos pares ordenados tiene $A \\times A$? ¿Cuántos valores distintos puede tomar $x+y$? Compara ambas cantidades.",
    opciones: [
      "Sí, $S$ es inyectiva.",
      "No, $S$ no es inyectiva porque $|A\\times A| = 25 > 9 = |\\{2,\\dots,10\\}|$.",
      "No se puede determinar sin calcular todos los valores."
    ],
    respuestaCorrecta: 1,
    solucion:
      "Las «palomas» son los 25 pares ordenados de $A\\times A$ (porque $|A|=5$, hay $5\\times 5=25$ pares). " +
      "Los «palomares» son los 9 valores posibles de la suma, $\\{2,3,\\dots,10\\}$. La función $S$ asigna a cada " +
      "paloma (par) un palomar (su suma). Como $25 > 9$, por el principio del palomar $S$ no puede ser inyectiva: " +
      "debe haber al menos dos pares distintos con la misma suma. Por ejemplo, $S(1,4) = S(2,3) = 5$."
  },
  {
    id: "p2",
    titulo: "b) Paridad de tres enteros",
    enunciado:
      "Dados tres enteros cualesquiera $a_1, a_2, a_3$, demuestra que al menos dos de ellos tienen la misma paridad " +
      "(es decir, ambos son pares o ambos son impares).",
    pista: "Solo existen dos paridades posibles: par e impar. ¿Cuáles son las «palomas» y cuáles los «palomares»?",
    opciones: [
      "Las palomas son los 3 enteros y los palomares son las 2 paridades; como $3>2$, dos enteros comparten paridad.",
      "Las palomas son las 2 paridades y los palomares son los 3 enteros.",
      "El principio del palomar no puede aplicarse a este problema."
    ],
    respuestaCorrecta: 0,
    solucion:
      "Definimos $f: \\{a_1,a_2,a_3\\} \\to \\{\\text{par}, \\text{impar}\\}$ que envía cada entero a su paridad. " +
      "Aquí las palomas son los 3 enteros y los palomares son las 2 paridades posibles. Como $3 > 2$, por el " +
      "principio del palomar $f$ no puede ser inyectiva, así que al menos dos de los $a_i$ comparten paridad."
  },
  {
    id: "p3",
    titulo: "c) Meses del año",
    enunciado:
      "En un grupo de 13 personas, demuestra que al menos dos de ellas cumplen años en el mismo mes.",
    pista: "¿Cuántos meses tiene el año? Ese número es el de los «palomares».",
    opciones: [
      "Las palomas son los 12 meses y los palomares son las 13 personas.",
      "Las palomas son las 13 personas y los palomares son los 12 meses; como $13>12$, dos personas comparten mes.",
      "No hay suficiente información para concluir nada."
    ],
    respuestaCorrecta: 1,
    solucion:
      "Sea $f$ la función que a cada persona le asigna su mes de nacimiento: $f: A \\to B$ con $|A|=13$ (las " +
      "personas) y $|B|=12$ (los meses). Como $13 > 12$, el principio del palomar garantiza que $f$ no es " +
      "inyectiva, es decir, al menos dos personas cumplen años en el mismo mes."
  },
  {
    id: "p4",
    titulo: "d) Residuos módulo n",
    enunciado:
      "Sea $n$ un entero positivo. Demuestra que, de cualquier conjunto de $n+1$ enteros, siempre hay dos cuya " +
      "diferencia es divisible entre $n$.",
    pista: "Al dividir cualquier entero entre $n$, el residuo solo puede tomar $n$ valores distintos: $0,1,\\dots,n-1$.",
    opciones: [
      "Las palomas son los $n+1$ enteros y los palomares los $n$ residuos posibles; dos enteros comparten residuo.",
      "Las palomas son los $n$ residuos posibles y los palomares los $n+1$ enteros.",
      "El resultado solo es cierto cuando $n$ es primo."
    ],
    respuestaCorrecta: 0,
    solucion:
      "Sean $a_1,\\dots,a_{n+1}$ los $n+1$ enteros dados y $r_i = a_i \\bmod n$ su residuo al dividir entre $n$. " +
      "Como $r_i \\in \\{0,1,\\dots,n-1\\}$, hay $n+1$ palomas ($a_i$) y $n$ palomares (los residuos posibles). " +
      "Por el principio del palomar existen $i \\neq j$ con $r_i = r_j$, y entonces $a_i - a_j$ es múltiplo de $n$, " +
      "es decir, divisible entre $n$."
  }
];

window.PALOMAR_QUIZ = [
  {
    id: "q1",
    tipo: "vf",
    pregunta:
      "El principio del palomar garantiza que, si $|A| > |B|$, ninguna función $f : A \\to B$ puede ser inyectiva.",
    respuestaCorrecta: 0,
    retroCorrecta: "Correcto: esa es exactamente la afirmación del principio del palomar.",
    retroIncorrecta:
      "Incorrecto. Esa es precisamente la afirmación del principio del palomar: con más palomas que palomares, " +
      "ninguna asignación puede evitar que dos palomas compartan palomar."
  },
  {
    id: "q2",
    tipo: "opcion",
    pregunta:
      "Si $f : A \\to B$ es inyectiva y $A, B$ son finitos, ¿qué relación se cumple entre $|A|$ y $|B|$?",
    opciones: ["$|A| < |B|$", "$|A| = |B|$", "$|A| \\le |B|$", "$|A| > |B|$"],
    respuestaCorrecta: 2,
    retroCorrecta: "Correcto: es la contrapositiva del principio del palomar, usada en la demostración.",
    retroIncorrecta:
      "Incorrecto. La contrapositiva del principio del palomar dice: si $f$ es inyectiva (y $A,B$ finitos), " +
      "entonces $|A| \\le |B|$ (no necesariamente son iguales)."
  },
  {
    id: "q3",
    tipo: "vf",
    pregunta: "El principio del palomar sigue siendo válido tal cual si $A$ y $B$ son conjuntos infinitos.",
    respuestaCorrecta: 1,
    retroCorrecta:
      "Correcto: es falso en general para infinitos. Por ejemplo, $f:\\mathbb{N}\\to\\mathbb{N}\\setminus\\{0\\}$, " +
      "$f(n)=n+1$, es inyectiva aunque el codominio sea un subconjunto propio del dominio.",
    retroIncorrecta:
      "Incorrecto. La hipótesis de finitud es esencial: existe $f:\\mathbb{N}\\to\\mathbb{N}\\setminus\\{0\\}$, " +
      "$f(n)=n+1$, que es inyectiva pese a ir hacia un subconjunto propio de su dominio, algo imposible entre " +
      "conjuntos finitos."
  },
  {
    id: "q4",
    tipo: "opcion",
    pregunta:
      "Si se reparten 17 palomas en 5 palomares, ¿cuál es el menor número de palomas que el principio del palomar " +
      "garantiza que algún palomar tendrá?",
    opciones: ["3", "4", "5", "17"],
    respuestaCorrecta: 1,
    retroCorrecta: "Correcto: $\\lceil 17/5 \\rceil = \\lceil 3.4 \\rceil = 4$.",
    retroIncorrecta:
      "Incorrecto. La forma general dice que algún palomar tiene al menos $\\lceil n/m \\rceil$ palomas; aquí " +
      "$\\lceil 17/5 \\rceil = \\lceil 3.4 \\rceil = 4$."
  },
  {
    id: "q5",
    tipo: "vf",
    pregunta:
      "En un grupo de 32 personas, el principio del palomar garantiza que al menos dos nacieron el mismo día de " +
      "la semana.",
    respuestaCorrecta: 0,
    retroCorrecta: "Correcto: hay 7 días de la semana y $32 > 7$, así que dos personas comparten día.",
    retroIncorrecta:
      "Incorrecto. Hay solo 7 días de la semana (los «palomares») y 32 personas (las «palomas»); como $32 > 7$, " +
      "el principio del palomar garantiza que al menos dos comparten día."
  },
  {
    id: "q6",
    tipo: "opcion",
    pregunta: "¿Cuál de las siguientes NO es una aplicación válida del principio del palomar?",
    opciones: [
      "13 enteros cualesquiera: dos de ellos tienen el mismo residuo al dividir entre 12.",
      "3 personas elegidas al azar: dos de ellas tienen exactamente la misma edad medida en segundos.",
      "5 cartas de una baraja de 4 palos: al menos dos comparten el mismo palo.",
      "100 personas y 12 signos zodiacales: al menos dos comparten signo."
    ],
    respuestaCorrecta: 1,
    retroCorrecta:
      "Correcto: la edad en segundos toma muchísimos más valores posibles que 3 personas, así que no hay " +
      "garantía de coincidencia; aquí no hay «más palomas que palomares».",
    retroIncorrecta:
      "Incorrecto. La opción de la edad en segundos NO es una aplicación válida: el número de valores posibles " +
      "para la edad en segundos es enorme comparado con solo 3 personas, así que no se puede garantizar ninguna " +
      "coincidencia."
  },
  {
    id: "q7",
    tipo: "vf",
    pregunta:
      "Si $f : A \\to B$ es inyectiva y $A, B$ son finitos con $|A| = |B|$, entonces $f$ también es sobreyectiva.",
    respuestaCorrecta: 0,
    retroCorrecta:
      "Correcto: como $f$ es inyectiva, las $|A|$ imágenes $f(a_1),\\dots,f(a_{|A|})$ son distintas; al ser " +
      "$|A|=|B|$, esas imágenes agotan todo $B$, así que $f$ es también sobreyectiva (de hecho, biyectiva).",
    retroIncorrecta:
      "Incorrecto. Al ser $f$ inyectiva, produce $|A|$ imágenes distintas dentro de $B$; si $|A|=|B|$, esas " +
      "imágenes deben ocupar todo $B$, así que $f$ también es sobreyectiva."
  }
];
