/*
  Actividad 5: checklist de axiomas de espacio vectorial, con ejemplos y no-ejemplos.
  Los contraejemplos usan números concretos calculados aquí.
*/

var AXIOMAS_EV = [
  { clave: "suma", nombre: "Suma de vectores (grupo abeliano)" },
  { clave: "escalar", nombre: "Producto por escalar cerrado" },
  { clave: "distvec", nombre: "a(u + v) = au + av" },
  { clave: "distesc", nombre: "(a + b)v = av + bv" },
  { clave: "asoc", nombre: "(ab)v = a(bv)" },
  { clave: "uno", nombre: "1·v = v" }
];

function itemEV(clave, ok, texto) {
  return { clave: clave, nombre: nombreEn(AXIOMAS_EV, clave), ok: ok, texto: texto, opcional: false };
}

function ejemplosEspaciosVectoriales() {
  var heredado = "Se hereda de las operaciones de $\\mathbb{R}$ o de $\\mathbb{R}^2$.";
  return [
    {
      id: "r2",
      textoSelector: "ℝ² con las operaciones usuales (sobre ℝ)",
      titulo: "\\mathbb{R}^2 \\text{ sobre } \\mathbb{R}",
      evaluar: function () {
        return [
          itemEV("suma", true, "$(x, y) + (x', y') = (x + x', y + y')$ es un grupo abeliano con neutro $(0,0)$."),
          itemEV("escalar", true, "$c(x, y) = (cx, cy)$ sigue en $\\mathbb{R}^2$."),
          itemEV("distvec", true, "$c(u + v) = cu + cv$: se reparte coordenada por coordenada."),
          itemEV("distesc", true, "$(a + b)(x, y) = a(x, y) + b(x, y)$."),
          itemEV("asoc", true, "$(ab)(x, y) = a\\,(b(x, y))$."),
          itemEV("uno", true, "$1\\cdot(x, y) = (x, y)$.")
        ];
      }
    },
    {
      id: "r2-raro1",
      textoSelector: "ℝ² con c·(x, y) = (cx, 0)",
      titulo: "\\mathbb{R}^2,\\ \\ c \\cdot (x, y) := (cx,\\, 0)",
      evaluar: function () {
        return [
          itemEV("suma", true, "La suma usual de vectores sigue siendo un grupo abeliano."),
          itemEV("escalar", true, "$(cx, 0)$ está en $\\mathbb{R}^2$."),
          itemEV("distvec", true, "$c(u + v) = (c(x + x'), 0) = cu + cv$."),
          itemEV("distesc", true, "$(a + b)\\cdot(x, y) = ((a + b)x, 0) = a\\cdot(x,y) + b\\cdot(x,y)$."),
          itemEV("asoc", true, "$(ab)\\cdot(x,y) = (abx, 0) = a\\cdot(bx, 0)$."),
          itemEV("uno", false, "$1 \\cdot (2, 3) = (2, 0)$, pero debería ser $(2, 3)$: este «producto» destruye la segunda coordenada.")
        ];
      }
    },
    {
      id: "r2-raro2",
      textoSelector: "ℝ² con c·(x, y) = (c²x, c²y)",
      titulo: "\\mathbb{R}^2,\\ \\ c \\cdot (x, y) := (c^2x,\\, c^2y)",
      evaluar: function () {
        return [
          itemEV("suma", true, "La suma usual de vectores sigue siendo un grupo abeliano."),
          itemEV("escalar", true, "$(c^2x, c^2y)$ está en $\\mathbb{R}^2$."),
          itemEV("distvec", true, "$c^2(x + x') = c^2x + c^2x'$."),
          itemEV("distesc", false, "$(1 + 1)\\cdot(1, 0) = 2^2(1, 0) = (4, 0)$, pero $1\\cdot(1,0) + 1\\cdot(1,0) = (2, 0)$."),
          itemEV("asoc", true, "$(ab)^2 = a^2 b^2$."),
          itemEV("uno", true, "$1^2 = 1$.")
        ];
      }
    },
    {
      id: "rpos",
      textoSelector: "ℝ⁺ con u ⊕ v = uv y c ⊙ u = uᶜ (sobre ℝ)",
      titulo: "(\\mathbb{R}^{+}, \\oplus, \\odot),\\ \\ u \\oplus v = uv,\\ \\ c \\odot u = u^{c}",
      evaluar: function () {
        return [
          itemEV("suma", true, "$2 \\oplus 3 = 6 \\in \\mathbb{R}^+$. El vector cero es el número $1$ (porque $u \\oplus 1 = u$) y el opuesto de $u$ es $1/u$ (porque $u \\oplus \\tfrac{1}{u} = 1$). Es abeliano."),
          itemEV("escalar", true, "$u^c > 0$ para $u > 0$ y cualquier real $c$."),
          itemEV("distvec", true, "$c \\odot (u \\oplus v) = (uv)^c = u^c v^c = (c \\odot u) \\oplus (c \\odot v)$."),
          itemEV("distesc", true, "$(a + b) \\odot u = u^{a+b} = u^a u^b = (a \\odot u) \\oplus (b \\odot u)$."),
          itemEV("asoc", true, "$(ab) \\odot u = u^{ab} = (u^b)^a = a \\odot (b \\odot u)$."),
          itemEV("uno", true, "$1 \\odot u = u^1 = u$.")
        ];
      }
    },
    {
      id: "p2",
      textoSelector: "P₂: polinomios de grado ≤ 2 (sobre ℝ)",
      titulo: "P_2 = \\{a_0 + a_1x + a_2x^2\\} \\text{ sobre } \\mathbb{R}",
      evaluar: function () {
        return [
          itemEV("suma", true, "La suma suma coeficientes: $(1 + x) + (x^2 - x) = 1 + x^2$. Neutro: el polinomio $0$."),
          itemEV("escalar", true, "$c(a_0 + a_1x + a_2x^2)$ multiplica cada coeficiente y sigue teniendo grado $\\leq 2$."),
          itemEV("distvec", true, heredado),
          itemEV("distesc", true, heredado),
          itemEV("asoc", true, heredado),
          itemEV("uno", true, "$1\\cdot p = p$.")
        ];
      }
    },
    {
      id: "grado-exacto",
      textoSelector: "Polinomios de grado exactamente 2",
      titulo: "\\{p : \\operatorname{grado}(p) = 2\\} \\text{ sobre } \\mathbb{R}",
      evaluar: function () {
        return [
          itemEV("suma", false, "$x^2 + (-x^2 + 1) = 1$, que tiene grado $0$: la suma se sale del conjunto. Además el polinomio $0$ (neutro) no tiene grado $2$."),
          itemEV("escalar", false, "$0 \\cdot x^2 = 0$ no tiene grado $2$."),
          itemEV("distvec", true, "Esta ley se heredaría de los polinomios, si las operaciones no se salieran del conjunto."),
          itemEV("distesc", true, "Ídem."),
          itemEV("asoc", true, "Ídem."),
          itemEV("uno", true, "$1 \\cdot p = p$.")
        ];
      }
    },
    {
      id: "recta-origen",
      textoSelector: "La recta y = 2x en ℝ²",
      titulo: "\\{(x, y) : y = 2x\\} \\subseteq \\mathbb{R}^2",
      evaluar: function () {
        return [
          itemEV("suma", true, "$(1, 2) + (3, 6) = (4, 8)$ y $8 = 2\\cdot 4$. En general $(x, 2x) + (x', 2x') = (x + x', 2(x + x'))$. Contiene al $(0,0)$."),
          itemEV("escalar", true, "$c(x, 2x) = (cx, 2cx)$ también cumple $y = 2x$."),
          itemEV("distvec", true, heredado),
          itemEV("distesc", true, heredado),
          itemEV("asoc", true, heredado),
          itemEV("uno", true, "$1\\cdot v = v$.")
        ];
      }
    },
    {
      id: "recta-desplazada",
      textoSelector: "La recta y = 2x + 1 en ℝ²",
      titulo: "\\{(x, y) : y = 2x + 1\\} \\subseteq \\mathbb{R}^2",
      evaluar: function () {
        return [
          itemEV("suma", false, "$(0, 1)$ y $(1, 3)$ están en la recta, pero $(0,1) + (1,3) = (1, 4)$ y $4 \\neq 2\\cdot 1 + 1 = 3$. Además $(0,0)$ no está."),
          itemEV("escalar", false, "$2\\cdot(0, 1) = (0, 2)$ y $2 \\neq 2\\cdot 0 + 1 = 1$."),
          itemEV("distvec", true, "Ídem: sería heredada si las operaciones no se salieran de la recta."),
          itemEV("distesc", true, "Ídem."),
          itemEV("asoc", true, "Ídem."),
          itemEV("uno", true, "$1\\cdot v = v$.")
        ];
      }
    },
    {
      id: "z2",
      textoSelector: "ℤ² sobre ℝ",
      titulo: "\\mathbb{Z}^2 \\text{ sobre } \\mathbb{R}",
      evaluar: function () {
        return [
          itemEV("suma", true, "La suma de vectores con coordenadas enteras tiene coordenadas enteras."),
          itemEV("escalar", false, "$\\tfrac{1}{2}\\cdot(1, 0) = (\\tfrac{1}{2}, 0) \\notin \\mathbb{Z}^2$: multiplicar por un escalar real nos saca del conjunto."),
          itemEV("distvec", true, heredado),
          itemEV("distesc", true, heredado),
          itemEV("asoc", true, heredado),
          itemEV("uno", true, "$1\\cdot v = v$.")
        ];
      }
    },
    {
      id: "q-sobre-r",
      textoSelector: "ℚ sobre ℝ",
      titulo: "\\mathbb{Q} \\text{ sobre } \\mathbb{R}",
      evaluar: function () {
        return [
          itemEV("suma", true, "$(\\mathbb{Q}, +)$ es un grupo abeliano."),
          itemEV("escalar", false, "$\\sqrt{2} \\cdot 1 = \\sqrt{2} \\notin \\mathbb{Q}$. (Sí es espacio vectorial sobre $\\mathbb{Q}$, pero no sobre $\\mathbb{R}$.)"),
          itemEV("distvec", true, heredado),
          itemEV("distesc", true, heredado),
          itemEV("asoc", true, heredado),
          itemEV("uno", true, "$1\\cdot v = v$.")
        ];
      }
    },
    {
      id: "c-sobre-r",
      textoSelector: "ℂ sobre ℝ (dimensión 2)",
      titulo: "\\mathbb{C} \\text{ sobre } \\mathbb{R}",
      evaluar: function () {
        return [
          itemEV("suma", true, "$(a + bi) + (c + di) = (a + c) + (b + d)i$: grupo abeliano."),
          itemEV("escalar", true, "$r(a + bi) = ra + rbi \\in \\mathbb{C}$ para $r$ real."),
          itemEV("distvec", true, heredado),
          itemEV("distesc", true, heredado),
          itemEV("asoc", true, heredado),
          itemEV("uno", true, "$1\\cdot z = z$. Todo complejo es $a\\cdot 1 + b\\cdot i$, así que bastan 2 «coordenadas»: dimensión $2$ sobre $\\mathbb{R}$. Sobre $\\mathbb{C}$ mismo, en cambio, basta el $1$: dimensión $1$.")
        ];
      }
    },
    {
      id: "f2-3",
      textoSelector: "𝔽₂³: ternas de bits (sobre 𝔽₂)",
      titulo: "\\mathbb{F}_2^3 \\text{ sobre } \\mathbb{F}_2",
      evaluar: function () {
        return [
          itemEV("suma", true, "$(1,0,1) + (1,1,0) = (0,1,1)$ (XOR bit a bit). Neutro: $(0,0,0)$; cada vector es su propio opuesto."),
          itemEV("escalar", true, "Los escalares son solo $0$ y $1$: $0\\cdot v = (0,0,0)$ y $1\\cdot v = v$."),
          itemEV("distvec", true, "$c(u + v) = cu + cv$ para $c \\in \\{0, 1\\}$."),
          itemEV("distesc", true, "$(1 + 1)v = 0 \\cdot v = \\vec 0 = v + v$."),
          itemEV("asoc", true, "$(ab)v = a(bv)$."),
          itemEV("uno", true, "$1\\cdot v = v$. El conjunto tiene $2^3 = 8$ vectores.")
        ];
      }
    }
  ];
}

function initActividad5() {
  crearChecklistAxiomas(document.getElementById("act5-checklist"), {
    idPrefijo: "act5",
    sustantivo: "espacio vectorial",
    ejemplos: ejemplosEspaciosVectoriales(),
    resumen: function (items, fallas) {
      return fallas.length === 0
        ? "Sí es un espacio vectorial (con el campo de escalares indicado)."
        : "No es un espacio vectorial: falla " + fallas.join("; ") + ".";
    }
  });
}
