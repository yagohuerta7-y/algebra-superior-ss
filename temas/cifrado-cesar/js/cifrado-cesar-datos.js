/*
  Datos del tema "Cifrado César": el alfabeto de 27 símbolos (A-Z más Ñ, sin
  espacios ni acentos) que define Zn con n=27, y las preguntas del
  cuestionario final.
*/

window.ALFABETO = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ",
  "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

window.CIFRADO_CESAR_QUIZ = [
  {
    id: "q1",
    tipo: "opcion",
    pregunta: "¿Qué significa exactamente \"a ≡ b (mod n)\"?",
    opciones: [
      "a y b dejan el mismo residuo al dividirlos entre n (es decir, n divide a a−b)",
      "a y b son el mismo número",
      "a es un múltiplo de b",
      "n divide a la suma a+b"
    ],
    respuestaCorrecta: 0,
    retroCorrecta: "Correcto: a≡b (mod n) significa precisamente que n divide a a−b, o de forma equivalente, que a y b dejan el mismo residuo al dividirlos entre n.",
    retroIncorrecta: "No es correcto. Revisa la definición de congruencia módulo n en la sección 2: n debe dividir exactamente a la diferencia a−b."
  },
  {
    id: "q2",
    tipo: "vf",
    pregunta: "La fórmula de cifrado César con desplazamiento k es Eₖ(x) = (x+k) mod n.",
    respuestaCorrecta: 0,
    retroCorrecta: "Correcto: cifrar es sumar k al índice de cada letra, módulo n.",
    retroIncorrecta: "Falso. Revisa la sección 3: cifrar consiste en sumar el desplazamiento k al índice módulo n."
  },
  {
    id: "q3",
    tipo: "opcion",
    pregunta: "¿Por qué Dₖ(x) = (x−k) mod n descifra correctamente un mensaje cifrado con Eₖ?",
    opciones: [
      "Porque n−k es el inverso aditivo de k módulo n, así que sumar n−k deshace exactamente el desplazamiento de k",
      "Porque k y n−k son siempre el mismo número",
      "Porque restar siempre deshace cualquier operación, sin importar el módulo",
      "Porque n tiene que ser un número primo"
    ],
    respuestaCorrecta: 0,
    retroCorrecta: "Correcto: restar k (o, equivalentemente, sumar n−k) es aplicar el inverso aditivo de k en Zn, que por el axioma de inversos regresa cada letra a su posición original.",
    retroIncorrecta: "No es correcto. La clave está en el axioma de inversos de (Zn,+): revisa la sección 4."
  },
  {
    id: "q4",
    tipo: "vf",
    pregunta: "k=0 actúa como el elemento identidad de (Zn,+), ya que E₀(x)=x para toda x.",
    respuestaCorrecta: 0,
    retroCorrecta: "Correcto: desplazar 0 posiciones no cambia nada, exactamente lo que pide el axioma de identidad.",
    retroIncorrecta: "Falso. Revisa la sección 4: E₀(x) = (x+0) mod n = x para toda x, así que k=0 es la identidad."
  },
  {
    id: "q5",
    tipo: "opcion",
    pregunta: "Si sumas dos desplazamientos k₁ y k₂ módulo n, ¿el resultado sigue siendo un elemento válido de Zn?",
    opciones: [
      "Sí, siempre: Zn es cerrado bajo la suma módulo n",
      "No, el resultado puede salirse del rango 0,…,n−1",
      "Solo si k₁ y k₂ son primos relativos entre sí",
      "Solo si n es un número par"
    ],
    respuestaCorrecta: 0,
    retroCorrecta: "Correcto: por definición, (k₁+k₂) mod n siempre cae en {0,…,n−1}. Ese es el axioma de cerradura.",
    retroIncorrecta: "No es correcto. Revisa el axioma de cerradura en la sección 4: la operación mod n siempre produce un resultado dentro de Zn."
  },
  {
    id: "q6",
    tipo: "vf",
    pregunta: "A diferencia del grupo de permutaciones S9 visto en el tema anterior, (Zn,+) sí es conmutativo (abeliano).",
    respuestaCorrecta: 0,
    retroCorrecta: "Correcto: x+k siempre es igual a k+x, por eso en la Actividad 2 \"comparar x+k vs k+x\" siempre da el mismo resultado — a diferencia de σ∘τ y τ∘σ en el tema de permutaciones.",
    retroIncorrecta: "Falso. (Zn,+) es abeliano: la suma de enteros siempre conmuta, incluso al tomar el residuo módulo n."
  },
  {
    id: "q7",
    tipo: "opcion",
    pregunta: "Según el historiador romano Suetonio, ¿quién usaba este cifrado para comunicarse con sus generales, y con qué desplazamiento?",
    opciones: [
      "Julio César, con un desplazamiento de 3 posiciones",
      "Alejandro Magno, con un desplazamiento de 7 posiciones",
      "Los espartanos, enrollando un listón sobre un bastón (la escítala)",
      "Los egipcios, mediante jeroglíficos cifrados"
    ],
    respuestaCorrecta: 0,
    retroCorrecta: "Correcto: según Suetonio, en Vidas de los doce césares, Julio César sustituía cada letra por la que está tres lugares adelante en el alfabeto.",
    retroIncorrecta: "No es correcto. Revisa la sección 5: fue Julio César quien, según Suetonio, usó un desplazamiento de 3 para comunicarse con sus generales."
  },
  {
    id: "q8",
    tipo: "opcion",
    pregunta: "¿Por qué el cifrado César es criptográficamente débil, aunque el mensaje esté cifrado?",
    opciones: [
      "Porque el espacio de claves es muy pequeño: solo hay n−1 desplazamientos no triviales posibles, fáciles de probar todos uno por uno",
      "Porque Eₖ no es una función biyectiva",
      "Porque un mensaje cifrado con César nunca se puede descifrar",
      "Porque depende de que el alfabeto tenga la letra Ñ"
    ],
    respuestaCorrecta: 0,
    retroCorrecta: "Correcto: con solo n−1 claves posibles (26 si n=27), es trivial probarlas todas hasta encontrar la que produce texto legible.",
    retroIncorrecta: "No es correcto. Eₖ sí es biyectiva (de hecho es una permutación) y sí se puede descifrar; la debilidad está en lo pequeño del espacio de claves."
  }
];
