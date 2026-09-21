# Álgebra Superior — Material de apoyo (UNAM)

Sitio web estático con material interactivo de apoyo para el curso de Álgebra Superior
(Licenciatura en Matemáticas Aplicadas y Computación, UNAM). Se mantiene como proyecto de
servicio social para el profesor del curso y crecerá durante el semestre con nuevos temas.

- **Sin backend, sin base de datos, sin build step.** Solo HTML, CSS y JavaScript puro.
- **No se recolecta ningún dato de los estudiantes.** No hay analítica, cookies de rastreo,
  ni envíos de formularios a ningún servidor.
- Funciona abriendo los archivos directamente (`file://`) y publicado en GitHub Pages.

## Cómo probarlo localmente

La forma más simple: doble clic en `index.html` y se abre en el navegador, sin necesidad de
ningún servidor.

Alternativa recomendada antes de publicar (para detectar problemas de mayúsculas/minúsculas
en rutas que no aparecen en tu sistema de archivos local pero sí romperían GitHub Pages,
que es *case-sensitive*):

```bash
python3 -m http.server 8000
# y abrir http://localhost:8000/ en el navegador
```

## Cómo agregar un tema nuevo

1. Crea una carpeta `temas/<id-del-tema>/` siguiendo el patrón de `temas/palomar/`:
   - `index.html` — el contenido del tema (una sola página con secciones ancladas es el
     patrón recomendado; ver `temas/palomar/index.html` como ejemplo).
   - `css/<tema>.css` — estilos específicos del tema (los estilos compartidos ya están en
     `css/`, no hay que repetirlos).
   - `js/` — la lógica y los datos del tema (recomendado: un archivo `*-datos.js` separado
     con el contenido, y archivos con la lógica de cada actividad).
2. Agrega una entrada a `js/temas.js`:

   ```js
   {
     id: "mi-tema",
     titulo: "Título del tema",
     descripcionCorta: "Descripción breve para la tarjeta del menú principal.",
     ruta: "temas/mi-tema/index.html",
     estado: "disponible", // usa "proximamente" mientras no esté listo
     orden: 4
   }
   ```

No hace falta tocar ningún otro archivo: `index.html` genera las tarjetas del menú
principal dinámicamente a partir de `js/temas.js`.

## Convenciones del proyecto

- **Sin módulos ES** (nada de `type="module"`, `import`/`export`): se usan etiquetas
  `<script>` normales y datos en variables globales (`window.TEMAS`, `window.PALOMAR_*`,
  etc.), porque los módulos ES fallan al abrir la página con `file://`.
- **Sin `fetch()` de archivos locales**, por la misma razón.
- **Rutas siempre relativas** (nunca empiezan con `/`), porque el sitio se sirve desde una
  subruta en GitHub Pages (`https://<usuario>.github.io/algebra-superior-ss/`), no desde la
  raíz del dominio.
- **Matemáticas con KaTeX**, vendorizado (copiado al repositorio) en `vendor/katex/` en la
  versión `0.16.9`, en vez de cargarlo desde un CDN — así el sitio funciona sin conexión y
  no depende de servicios de terceros.
- **Modo claro/oscuro** con variables CSS en `css/variables.css`, reutilizadas por todos los
  temas.
- Todo el contenido en español, mobile-first, y con atención a accesibilidad (contraste,
  navegación por teclado, `aria-live` en los controles interactivos).

## Cómo publicar en GitHub Pages

1. El repositorio (`algebra-superior-ss`) debe ser público.
2. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   rama `main`, carpeta `/ (root)`.
3. El sitio queda disponible en `https://<usuario>.github.io/algebra-superior-ss/`.
4. Cada `git push` a `main` actualiza el sitio publicado automáticamente (puede tardar uno
   o dos minutos).

## Checklist antes de cada entrega

- [ ] Probar abriendo `index.html` directamente con `file://` (sin servidor).
- [ ] Probar en un ancho de celular (320–414px) con las herramientas de desarrollador.
- [ ] Navegar completo con el teclado (Tab, Enter, flechas) sin quedar atrapado.
- [ ] Revisar contraste de colores (modo claro y oscuro).
- [ ] Verificar que `prefers-reduced-motion` se respeta.
- [ ] Revisar la consola del navegador en busca de errores o rutas rotas.

## Autoría y contacto

Material elaborado como servicio social para el curso de Álgebra Superior.
Contacto: yagoraulhuertaorozco@gmail.com

## Licencia

El código de este sitio se distribuye bajo la licencia MIT (ver `LICENSE`). El contenido
educativo (textos, ejercicios) puede reutilizarse citando la fuente; consúltese con el
profesor responsable del curso para otros usos.
