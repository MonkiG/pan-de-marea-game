# Pan de Marea: La Última Panadería

Demo jugable de dos niveles. En **La Panadería Hundida**, Bigotes recupera el horno familiar y prepara un Pan Térmico. Al completar esa ruta se desbloquea **El Mercado Sumergido**, un recorrido más amplio con reguladores de presión, proyectiles, checkpoint, un guardián pesado y la receta del Pan de Presión.

## Tecnologías y requisitos

- React 19 para menú, HUD y pantallas superpuestas.
- Phaser 3.90 con Arcade Physics para el juego.
- Vite 8 para desarrollo y build.
- JavaScript moderno con módulos ES.
- Vitest para las reglas de juego independientes.
- Node.js 20.19 o posterior.

No hay backend, base de datos ni servicios externos obligatorios.

## Instalación y ejecución

```bash
npm install
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

Build y pruebas:

```bash
npm test
npm run build
npm run preview
```

También se puede utilizar `pnpm install`, `pnpm test` y `pnpm run build`.

## Controles

| Acción | Teclas |
|---|---|
| Moverse | A/D o flechas izquierda/derecha |
| Saltar | W, flecha arriba o Espacio |
| Atacar | J o X |
| Interactuar | E o Enter |
| Pausa | Esc |

Los controles sólo se capturan mientras el juego está activo. Los botones del menú funcionan con Tab, Enter y Espacio.

## Movimiento y alcance del salto

Los valores de movimiento se ajustan desde el objeto `PLAYER` de `src/game/constants.js`, equivalente al Inspector para este proyecto Phaser. No hay cifras de movimiento dispersas por las escenas.

| Parámetro | Valor |
|---|---:|
| Velocidad horizontal máxima | 175 px/s |
| Aceleración en suelo | 1050 px/s² |
| Aceleración en aire | 680 px/s² |
| Desaceleración en suelo | 950 px/s² |
| Resistencia horizontal en aire | 45 px/s² |
| Velocidad inicial de salto | −315 px/s |
| Gravedad de subida | 560 px/s² |
| Multiplicador de gravedad al caer | 1.45 |
| Velocidad máxima de caída | 390 px/s |
| Coyote time | 120 ms |
| Jump buffer | 140 ms |
| Altura teórica del salto largo | 88.6 px |
| Alcance horizontal teórico | 176.7 px |

Soltar pronto el botón multiplica la velocidad ascendente por `0.48`, produciendo un salto corto. Mantenerlo permite completar el arco. Los enlaces obligatorios de plataformas se validan al 72 % o menos de su alcance calculado para conservar margen de aterrizaje.

Para ajustar el salto posteriormente:

1. Modifica sólo `jumpVelocity`, `gravity`, `fallGravityMultiplier` o `maxRunSpeed` en `constants.js`.
2. Ejecuta `npm test`; la prueba de navegabilidad fallará si un enlace declarado queda fuera del margen seguro.
3. Ajusta posiciones en `levelOneData.js`, no dentro de la escena.
4. Recorre el nivel de nuevo en navegador antes de aceptar el balance.

No se añadieron doble salto, dash, wall jump ni nuevas habilidades.

## Colisiones y depuración de recorrido

- El suelo visual repetido utiliza un único collider continuo; esto elimina bordes entre tiles.
- Las plataformas elevadas tienen una superficie unidireccional de 8 px: no bloquean al caminar por debajo y sólo reciben al jugador al aterrizar desde arriba.
- Decoración, levaduras, respiradero, horno y compuerta no forman paredes sólidas. Los triggers usan overlaps.
- El collider de Bigotes mide 68×112 píxeles de la lámina antes de aplicar la escala, aproximadamente 28.6×47 px en el mundo.
- `DEBUG_PHYSICS` muestra los cuerpos de Arcade.
- `DEBUG_MOVEMENT` muestra collider, ground check, velocidad y estado de suelo.
- `DEBUG_LEVEL_GEOMETRY` muestra superficies transitables y enlaces de salto.

Las tres opciones están desactivadas en producción y se encuentran al inicio de `src/game/constants.js`.

Plataformas reposicionadas en La Panadería Hundida:

- la escalera inicial se suavizó en `intro-step` e `intro-rise`;
- las plataformas de las levaduras A y B se acercaron, reduciendo el antiguo hueco inaccesible de 170 px a 80 px;
- la entrada de combate se desplazó para dejar una recepción ancha y descendente;
- los escalones `final-step`/`final-rise` y `rest-step`/`gate-rise` quedaron dentro del margen seguro;
- la tercera levadura se centró sobre una plataforma alcanzable directamente desde el suelo.

## Flujo de los niveles

El botón **Jugar** abre una pantalla exclusiva de selección con tarjetas ilustradas. Los destinos bloqueados aparecen opacos y desaturados, no aceptan interacción y explican su requisito. El Mercado Sumergido permanece bloqueado durante la sesión hasta completar La Panadería Hundida; la transición de resultados puede iniciarlo sin crear una segunda instancia de Phaser.

### Nivel I — La Panadería Hundida

1. Aprende movimiento y salto en la zona segura.
2. Recoge tres Levaduras de Burbuja; cada una recupera oxígeno.
3. Ataca o esquiva al Rastrero de Salmuera.
4. Usa el respiradero tras el primer combate para recuperar oxígeno.
5. Interactúa con el horno y espera 1.5 segundos para preparar el Pan Térmico.
6. Supera el camino final y lleva el pan a la compuerta.
7. Activa la Marea Térmica para completar el nivel.

La derrota ocurre al perder los tres puntos de salud. Si el oxígeno llega a cero, Bigotes recibe daño periódico hasta encontrar recuperación o caer derrotado.

### Nivel II — El Mercado Sumergido

1. Explora un mundo de 7,200×720 px dividido en ocho zonas y rutas verticales opcionales.
2. Reúne al menos cinco de las siete Levaduras de Burbuja y activa tres reguladores de presión.
3. Usa puestos y desniveles como cobertura contra los Escupemasas y sus proyectiles de Masa Corrupta.
4. Enfrenta o supera al Sentinela del Coral Negro, que combina ataques básicos y una carga pesada.
5. Activa el checkpoint del mercado para conservar ingredientes, reguladores, salud, oxígeno y estadísticas al reiniciar tras una derrota.
6. Interactúa con la estación de presión para preparar el Pan de Presión.
7. Lleva el pan a la salida del mercado y completa el nivel.

El nivel contiene corrientes submarinas, coral dañino, dos estaciones grandes de oxígeno, tres Rastreros compartidos, tres Escupemasas y un Sentinela. El camino crítico mantiene suelo continuo; las plataformas elevadas dan acceso a recursos y rutas opcionales.

## Estructura

```text
src/
  components/       Menú, HUD, ajustes, pausa y resultados
  game/
    assets/          Registro central, auditoría, resolución y fallbacks
    data/            Animaciones y colocación completa de ambos niveles
    entities/        Jugador, enemigos, ingredientes y objetos interactivos
    projectiles/     Pool de Masa Corrupta
    scenes/          Arranque, precarga y escenas de los dos niveles
    systems/         Reglas puras, progreso, combate, oxígeno, recetas y checkpoint
    EventBus.js      Contrato desacoplado entre React y Phaser
    PhaserGame.js    Ciclo de vida de la instancia de Phaser
  styles/            Interfaz responsive y presentación pixelada
assets/              PNG originales, conservados sin modificaciones
```

Las posiciones jugables, límites de patrulla, zonas y objetos están centralizados en `src/game/data/levelOneData.js` y `src/game/data/levelTwoData.js`. Las cifras de balance están en `src/game/constants.js`. El informe técnico del inventario visual está en [`docs/asset-audit.md`](docs/asset-audit.md).

## Producción de assets y audio

La lista completa de material existente, faltante y recomendado está en [`GUIA_ASSETS_Y_AUDIO.md`](GUIA_ASSETS_Y_AUDIO.md).

La especificación para redibujar el proyecto como pixel art, incluyendo hojas uniformes, movimientos por enemigo y el contrato visual/técnico del ataque de Bigotes, está en [`GUIA_PIXEL_ART_Y_ANIMACIONES.md`](GUIA_PIXEL_ART_Y_ANIMACIONES.md).

Los 41 prompts de producción están en [`pixel_art_prompt.md`](pixel_art_prompt.md). El piloto y el primer lote de personajes viven en paralelo a los PNG originales:

- fuentes de ImageGen: `art-source/pixel-art/v1/`;
- sprites normalizados: `assets/pixel-art/v1/`;
- perfil oficial y predeterminado: `pixel-v1`;
- perfil anterior disponible para comparación: `VITE_ART_PROFILE=legacy`.

El juego carga los nuevos assets directamente con `npm run dev`, sin parámetros ni variables adicionales. En PowerShell, el perfil anterior puede ejecutarse de forma explícita con:

```powershell
$env:VITE_ART_PROFILE='legacy'
npm run dev
```

Durante desarrollo, la escena de comparación acepta `?art-review=bigotes`, `?art-review=rastrero`, `?art-review=escupemasas` y `?art-review=sentinela`. También se puede activar temporalmente el perfil anterior mediante `?art-profile=legacy`; añade `&unlock-all` para revisar el Mercado sin completar antes la Panadería. La escena permite cambiar de animación y velocidad, pausar, avanzar por frames, alternar 1×/4×, usar `flipX` y ver el collider; Bigotes muestra además su hitbox. Para reconstruir y comprobar los PNG:

```sh
npm run art:process
npm run art:validate
```

`art:process` aplica recorte, aislamiento por componentes, chroma, escala nearest-neighbor, paleta cerrada, alpha binario y ensamblado reproducible. En los fondos también normaliza a 320×180 internos, corrige la costura horizontal y amplía 2× hasta 640×360. `art:validate` comprueba dimensiones, cuadrícula, paleta, transparencia, bloques de píxel, costuras y celdas requeridas/no usadas. El perfil oficial `pixel-v1` incluye Bigotes, enemigos, Levadura, objetos interactivos, efectos, tileset modular y las seis capas parallax de ambos niveles.

Los fondos pixel-v1 se muestran a escala 1×, sin offset vertical y anclados al viewport. El parallax sólo desplaza las capas horizontalmente, de modo que el Mercado no estira ni repite el fondo al recorrer su mundo vertical de 720 px.

El MVP de audio incluye trece efectos cartoon submarinos para todas las acciones ya conectadas en ambos niveles. Los WAV mono de 48 kHz se generan sin samples externos y se validan de forma reproducible:

```sh
npm run audio:generate
npm run audio:validate
```

`AudioManager` aplica el volumen y cooldown declarados en `src/game/audio/audioManifest.js`, respeta el ajuste de silencio y detiene los efectos activos al pausar o abandonar una escena. Si un archivo no puede cargarse, el juego continúa usando silencio seguro.

## Spritesheets y recortes

Las láminas no utilizan una cuadrícula uniforme: hay márgenes, padding y tamaños variables. Por ello se cargan como imágenes normales y `src/game/assetManifest.js` registra frames con `texture.add(nombre, sourceIndex, x, y, ancho, alto)`.

Para ajustar un frame:

1. Mide su rectángulo dentro del PNG original.
2. Corrige el registro correspondiente en `FRAME_MANIFEST`.
3. Conserva el prefijo que usa `animationData.js`.
4. Ajusta escala, origen o cuerpo físico en la entidad, nunca en el PNG.

Si una textura o animación no se puede cargar, el juego avisa en consola y utiliza una figura de fallback.

## Recursos pendientes

- **Audio:** música, ambientes continuos, sonidos de UI y alertas adicionales permanecen fuera del MVP; las trece acciones fundamentales de gameplay ya tienen SFX.
- Los fallbacks geométricos se conservan como protección técnica si una textura no puede cargarse, pero ya no forman parte de la presentación normal.

## Assets inventariados

| Archivo | Tamaño | Estado |
|---|---:|---|
| `bigotes-assets.png` | 1024×1536 | Usado: jugador |
| `rastrero-de-salmuera.png` | 1536×1024 | Usado: enemigo |
| `golden-bubble-yeast.png` | 1536×1024 | Usado: coleccionable |
| `rusty-undewater-portal.png` | 1536×1024 | Usado: compuerta |
| `panaderia-undida-bg-1.png` | 1536×1024 | Usado: fondo lejano |
| `panaderia-undida-bg-2.png` | 1536×1024 | Usado: arquitectura media |
| `panaderia-undida-bg-3.png` | 1536×1024 | Usado: interior cercano |
| `tileset.png` | 1536×1024 | Usado: suelo, plataformas y decoración |
| `mercado-undido-1.png` | 1536×1024 | Usado: parallax lejano del Mercado |
| `mercado-undido-2.png` | 1536×1024 | Usado: parallax medio del Mercado |
| `mercado-undido-3.png` | 1536×1024 | Usado: parallax cercano del Mercado |
| `escupemasas.png` | 1536×1024 | Usado: Escupemasas Abisal |
| `sentinela-del-coral-negro.png` | 1024×1536 | Usado: guardián del Mercado |

Los assets fueron aportados con el proyecto. Su autoría y licencia no estaban documentadas; deben confirmarse antes de una publicación comercial.

## Añadir un enemigo

1. Registra su lámina y recortes en `assetManifest.js`.
2. Declara sus animaciones en `animationData.js`.
3. Crea una entidad con una máquina de estados legible.
4. Añade sus puntos de aparición y límites a los datos del nivel.
5. Conecta colisiones, daño, derrota y estadísticas desde la escena.

No registres listeners ni crees objetos nuevos dentro del bucle `update`.

## Añadir un nivel futuro

1. Crea un nuevo archivo de datos y una escena separada.
2. Reutiliza los sistemas de inventario, oxígeno, combate y audio.
3. Añade la escena a la configuración de Phaser.
4. Emite el mismo `game:snapshot` para mantener compatible el HUD React.
5. Registra el nivel en `SessionProgress`, el selector React y la pantalla de resultados.

## Accesibilidad y rendimiento

- Foco visible y botones navegables por teclado.
- Contraste alto y texto del HUD en español.
- Ajustes para silenciar sonido, desactivar sacudidas y reducir partículas.
- Respeto a `prefers-reduced-motion` en la interfaz web.
- Canvas 16:9 centrado, responsive y con `image-rendering: pixelated`.
- La carga de Phaser se divide del menú y sólo se solicita al pulsar **Jugar**.

## Problemas conocidos

- Las ilustraciones originales son de alta resolución y estilo pictórico; el render nearest-neighbor mantiene bordes nítidos, pero no convierte el material en pixel art nativo.
- El tileset y las hojas de animación tienen separaciones irregulares; ciertos recortes pueden necesitar ajuste artístico fino.
- No hay música, ambientes continuos ni controles táctiles.
- El perfil `legacy` conserva recortes irregulares y algunos estados aproximados; se mantiene sólo para comparación y contingencia.
- El progreso de desbloqueo y checkpoint vive en memoria de la sesión; no se persiste todavía en `localStorage`.
- Phaser constituye la mayor parte del tamaño del bundle; se carga de forma diferida para que el menú inicial siga siendo ligero.

## Pruebas

`npm test` cubre:

- inventario y consumo de ingredientes;
- drenaje, pausa, recuperación y daño por oxígeno;
- preparación única del Pan Térmico;
- bloqueo y consumo en la compuerta;
- daño, invulnerabilidad y salud mínima;
- reinicio de los sistemas principales;
- alcance y margen de los saltos declarados.
- auditoría y resolución de assets con fallback;
- activación de reguladores en cualquier orden y bloqueo de salida;
- receta del Pan de Presión con y sin requisitos;
- copia y restauración del checkpoint;
- desbloqueo del Mercado tras completar el Nivel I;
- límite del pool de proyectiles.

## Créditos y asistencia por IA

Concepto, nombres y assets: proporcionados con el proyecto **Pan de Marea**. La arquitectura, implementación, documentación y parte del ajuste visual y de gameplay fueron desarrollados con asistencia de IA mediante Codex. Se recomienda una revisión humana de balance, dirección artística, accesibilidad y licencias antes de distribuir el juego.
