# Pan de Marea: La Última Panadería

Demo jugable del primer nivel, **La Panadería Hundida**. Bigotes debe explorar su antigua panadería familiar, reunir tres Levaduras de Burbuja, preparar un Pan Térmico y abrir la Compuerta de la Marea Térmica.

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

## Flujo del nivel

1. Aprende movimiento y salto en la zona segura.
2. Recoge tres Levaduras de Burbuja; cada una recupera oxígeno.
3. Ataca o esquiva al Rastrero de Salmuera.
4. Usa el respiradero tras el primer combate para recuperar oxígeno.
5. Interactúa con el horno y espera 1.5 segundos para preparar el Pan Térmico.
6. Supera el camino final y lleva el pan a la compuerta.
7. Activa la Marea Térmica para completar el nivel.

La derrota ocurre al perder los tres puntos de salud. Si el oxígeno llega a cero, Bigotes recibe daño periódico hasta encontrar recuperación o caer derrotado.

## Estructura

```text
src/
  components/       Menú, HUD, ajustes, pausa y resultados
  game/
    data/            Animaciones y colocación completa del nivel
    entities/        Bigotes, Rastrero, Levadura, horno y compuerta
    scenes/          Arranque, precarga y primer nivel
    systems/         Audio, animaciones, combate, inventario, oxígeno y receta
    EventBus.js      Contrato desacoplado entre React y Phaser
    PhaserGame.js    Ciclo de vida de la instancia de Phaser
  styles/            Interfaz responsive y presentación pixelada
assets/              PNG originales, conservados sin modificaciones
```

Las posiciones jugables, límites de patrulla, zonas y objetos están centralizados en `src/game/data/levelOneData.js`. Las cifras de balance están en `src/game/constants.js`.

## Spritesheets y recortes

Las láminas no utilizan una cuadrícula uniforme: hay márgenes, padding y tamaños variables. Por ello se cargan como imágenes normales y `src/game/assetManifest.js` registra frames con `texture.add(nombre, sourceIndex, x, y, ancho, alto)`.

Para ajustar un frame:

1. Mide su rectángulo dentro del PNG original.
2. Corrige el registro correspondiente en `FRAME_MANIFEST`.
3. Conserva el prefijo que usa `animationData.js`.
4. Ajusta escala, origen o cuerpo físico en la entidad, nunca en el PNG.

Si una textura o animación no se puede cargar, el juego avisa en consola y utiliza una figura de fallback.

## Placeholders pendientes

- **Horno:** no existe un PNG independiente; se dibuja con Phaser Graphics y está preparado para sustituirse por una textura.
- **Respiradero:** representación geométrica con brillo y burbujas.
- **Partículas:** puntos reutilizables generados por Phaser.
- **Audio:** no se encontraron archivos de sonido. `AudioManager` conserva las llamadas de salto, ataque, daño, recolección, horno, enemigo y compuerta, pero utiliza silencio sin romper la partida.
- Algunos estados comparten el frame estático más cercano cuando la lámina original no contiene una secuencia inequívoca.

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
| `mercado-undido-1.png` | 1536×1024 | Reservado para el siguiente nivel |
| `mercado-undido-2.png` | 1536×1024 | Reservado para el siguiente nivel |
| `mercado-undido-3.png` | 1536×1024 | Reservado para el siguiente nivel |
| `escupemasas.png` | 1536×1024 | Reservado para enemigo futuro |
| `sentinela-del-coral-negro.png` | 1024×1536 | Reservado para enemigo futuro |

Los assets fueron aportados con el proyecto. Su autoría y licencia no estaban documentadas; deben confirmarse antes de una publicación comercial.

## Añadir un enemigo

1. Registra su lámina y recortes en `assetManifest.js`.
2. Declara sus animaciones en `animationData.js`.
3. Crea una entidad con una máquina de estados legible.
4. Añade sus puntos de aparición y límites a los datos del nivel.
5. Conecta colisiones, daño, derrota y estadísticas desde la escena.

No registres listeners ni crees objetos nuevos dentro del bucle `update`.

## Añadir el siguiente nivel

1. Crea un nuevo archivo de datos y una escena separada.
2. Reutiliza los sistemas de inventario, oxígeno, combate y audio.
3. Añade la escena a la configuración de Phaser.
4. Emite el mismo `game:snapshot` para mantener compatible el HUD React.
5. Inicia la nueva escena desde una futura selección de nivel o desde la pantalla de resultados.

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
- No hay audio real ni controles táctiles.
- El nivel siguiente, Mercado Sumergido, aún no está implementado.
- Phaser constituye la mayor parte del tamaño del bundle; se carga de forma diferida para que el menú inicial siga siendo ligero.

## Pruebas

`npm test` cubre:

- inventario y consumo de ingredientes;
- drenaje, pausa, recuperación y daño por oxígeno;
- preparación única del Pan Térmico;
- bloqueo y consumo en la compuerta;
- daño, invulnerabilidad y salud mínima;
- reinicio de los sistemas principales.

## Créditos y asistencia por IA

Concepto, nombres y assets: proporcionados con el proyecto **Pan de Marea**. La arquitectura, implementación, documentación y parte del ajuste visual y de gameplay fueron desarrollados con asistencia de IA mediante Codex. Se recomienda una revisión humana de balance, dirección artística, accesibilidad y licencias antes de distribuir el juego.
