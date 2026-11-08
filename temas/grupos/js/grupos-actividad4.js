/*
  Actividad 4: checklist de axiomas con ejemplos y no-ejemplos.
  Los ejemplos finitos se verifican automáticamente (tabla calculada por código);
  los infinitos traen contraejemplos con números concretos calculados aquí.
*/

function itemAxioma(clave, ok, texto) {
  return { clave: clave, ok: ok, texto: texto };
}

function ejemplosGrupos() {
  return [
    {
      id: "z-suma",
      textoSelector: "(ℤ, +): enteros con la suma",
      titulo: "(\\mathbb{Z}, +)",
      evaluar: function () {
        return [
          itemAxioma("cerradura", true, "La suma de dos enteros es un entero."),
          itemAxioma("asociatividad", true, "Es la asociatividad de la suma de números."),
          itemAxioma("identidad", true, "El neutro es $0$: $0 + a = a + 0 = a$."),
          itemAxioma("inversos", true, "El inverso de $a$ es $-a$, que también es entero: $a + (-a) = 0$."),
          itemAxioma("conmutatividad", true, "$a + b = b + a$.")
        ];
      }
    },
    {
      id: "z-resta",
      textoSelector: "(ℤ, −): enteros con la resta",
      titulo: "(\\mathbb{Z}, -)",
      evaluar: function () {
        var izq = (3 - 2) - 1;
        var der = 3 - (2 - 1);
        return [
          itemAxioma("cerradura", true, "La resta de dos enteros es un entero."),
          itemAxioma("asociatividad", false, "$(3 - 2) - 1 = " + izq + "$ pero $3 - (2 - 1) = " + der + "$."),
          itemAxioma("identidad", false, "$a - 0 = a$, pero $0 - a = -a \\neq a$ (por ejemplo, $0 - 3 = -3$). El $0$ solo funciona de un lado."),
          itemAxioma("inversos", false, "Sin neutro la pregunta ni siquiera tiene sentido."),
          itemAxioma("conmutatividad", false, "$3 - 2 = 1$ pero $2 - 3 = -1$.")
        ];
      }
    },
    {
      id: "n-suma",
      textoSelector: "(ℕ, +): naturales con la suma",
      titulo: "(\\mathbb{N}, +), \\quad \\mathbb{N} = \\{0, 1, 2, \\dots\\}",
      evaluar: function () {
        return [
          itemAxioma("cerradura", true, "La suma de dos naturales es natural."),
          itemAxioma("asociatividad", true, "Es la asociatividad de la suma."),
          itemAxioma("identidad", true, "El neutro es $0$, que sí es natural."),
          itemAxioma("inversos", false, "$1$ no tiene inverso: haría falta $b$ con $1 + b = 0$, o sea $b = -1$, que no es natural."),
          itemAxioma("conmutatividad", true, "$a + b = b + a$.")
        ];
      }
    },
    {
      id: "r-producto",
      textoSelector: "(ℝ, ·): reales con el producto",
      titulo: "(\\mathbb{R}, \\cdot)",
      evaluar: function () {
        return [
          itemAxioma("cerradura", true, "El producto de dos reales es real."),
          itemAxioma("asociatividad", true, "Es la asociatividad del producto."),
          itemAxioma("identidad", true, "El neutro es $1$."),
          itemAxioma("inversos", false, "El $0$ no tiene inverso: $0 \\cdot b = 0 \\neq 1$ para todo $b$. Basta un elemento sin inverso para que falle. (Quitando el $0$ se arregla.)"),
          itemAxioma("conmutatividad", true, "$a \\cdot b = b \\cdot a$.")
        ];
      }
    },
    {
      id: "r-producto-sin0",
      textoSelector: "(ℝ∖{0}, ·): reales sin el cero",
      titulo: "(\\mathbb{R}\\setminus\\{0\\}, \\cdot)",
      evaluar: function () {
        return [
          itemAxioma("cerradura", true, "Si $a \\neq 0$ y $b \\neq 0$, entonces $ab \\neq 0$: no nos salimos del conjunto."),
          itemAxioma("asociatividad", true, "Es la asociatividad del producto."),
          itemAxioma("identidad", true, "El neutro es $1$."),
          itemAxioma("inversos", true, "El inverso de $a$ es $1/a$, que existe y no es $0$."),
          itemAxioma("conmutatividad", true, "$a \\cdot b = b \\cdot a$.")
        ];
      }
    },
    {
      id: "z-producto",
      textoSelector: "(ℤ, ·): enteros con el producto",
      titulo: "(\\mathbb{Z}, \\cdot)",
      evaluar: function () {
        return [
          itemAxioma("cerradura", true, "El producto de dos enteros es entero."),
          itemAxioma("asociatividad", true, "Es la asociatividad del producto."),
          itemAxioma("identidad", true, "El neutro es $1$."),
          itemAxioma("inversos", false, "$2$ no tiene inverso en $\\mathbb{Z}$: $2b = 1$ obliga $b = \\tfrac{1}{2}$, que no es entero. Solo $1$ y $-1$ tienen inverso."),
          itemAxioma("conmutatividad", true, "$a \\cdot b = b \\cdot a$.")
        ];
      }
    },
    {
      id: "r-division",
      textoSelector: "(ℝ∖{0}, ÷): reales sin el cero con la división",
      titulo: "(\\mathbb{R}\\setminus\\{0\\}, \\div)",
      evaluar: function () {
        var izq = (8 / 4) / 2;
        var der = 8 / (4 / 2);
        return [
          itemAxioma("cerradura", true, "Si $a, b \\neq 0$, entonces $a \\div b \\neq 0$."),
          itemAxioma("asociatividad", false, "$(8 \\div 4) \\div 2 = " + izq + "$ pero $8 \\div (4 \\div 2) = " + der + "$."),
          itemAxioma("identidad", false, "$a \\div 1 = a$, pero $1 \\div a = 1/a \\neq a$ (por ejemplo $1 \\div 2 = 0.5$). El $1$ solo funciona de un lado."),
          itemAxioma("inversos", false, "Sin neutro la pregunta ni siquiera tiene sentido."),
          itemAxioma("conmutatividad", false, "$8 \\div 4 = 2$ pero $4 \\div 8 = 0.5$.")
        ];
      }
    },
    { id: "z6-suma", textoSelector: "(ℤ₆, +): aritmética del reloj de 6", titulo: "(\\mathbb{Z}_6, +)", estructura: estructuraZn(6) },
    { id: "z6-mult", textoSelector: "(ℤ₆∖{0}, ·): producto módulo 6", titulo: "(\\mathbb{Z}_6\\setminus\\{0\\}, \\cdot)", estructura: estructuraZnMultiplicativo(6) },
    { id: "z5-mult", textoSelector: "(ℤ₅∖{0}, ·): producto módulo 5", titulo: "(\\mathbb{Z}_5\\setminus\\{0\\}, \\cdot)", estructura: estructuraZnMultiplicativo(5) },
    { id: "d3", textoSelector: "D₃: simetrías del triángulo", titulo: "D_3", estructura: estructuraDiedral(3) },
    { id: "v4", textoSelector: "V₄: grupo de Klein", titulo: "(V_4, \\ast)", estructura: estructuraKlein() }
  ];
}

function initActividad4() {
  crearChecklistAxiomas(document.getElementById("act4-checklist"), {
    idPrefijo: "act4",
    ejemplos: ejemplosGrupos()
  });
}
