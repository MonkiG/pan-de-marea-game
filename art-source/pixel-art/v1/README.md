# Fuente del piloto pixel art v1

Estas imágenes fueron producidas con ImageGen integrado a partir de `assets/bigotes-assets.png` como referencia conceptual. No sustituyen los PNG legacy: son fuentes de trabajo para el procesamiento reproducible de `scripts/process-pixel-art.mjs`.

## Dirección cerrada

- Cartoon submarino compacto y expresivo.
- Bigote, casco crema, visor turquesa, traje azul marino y guantes ámbar reconocibles.
- Outline azul marino equivalente a un píxel en el resultado final.
- Dos tonos por material, 12–16 colores opacos y sin textura pictórica.
- Fondo chroma magenta plano, sin sombras, texto ni elementos compartidos entre celdas.
- Fluidez mediante anticipación, arcos, overshoot y recuperación; no mediante ruido o detalle fino.

## Prompt maestro usado

> Rediseña al personaje de referencia como un protagonista panadero-buzo cartoon para videojuego 2D. Conserva sus rasgos identificables —gran bigote, casco crema con visor turquesa, traje azul marino y guantes ámbar— con proporciones chibi compactas, silueta fuerte, clusters de píxel deliberados, outline azul marino uniforme y sólo dos tonos por material. Usa 12–16 colores opacos, cero degradados, cero textura pictórica, cero antialiasing y fondo chroma magenta completamente plano. Vista lateral mirando a la derecha, punto de apoyo consistente en el centro inferior y margen amplio alrededor.

Cada tira añadió al prompt maestro una instrucción de storyboard horizontal, poses separadas y estos contratos:

| Fuente | Frames | Ritmo objetivo | Acción |
|---|---:|---:|---|
| `bigotes-idle-chroma.png` | 6 | 6 FPS | Respiración/flotación sutil en loop. |
| `bigotes-swim-chroma.png` | 8 | 9 FPS | Nado con arco corporal y retorno limpio. |
| `bigotes-jump-chroma.png` | 3 | 10 FPS | Compresión, impulso y extensión de subida. |
| `bigotes-fall-chroma.png` | 4 | 8–10 FPS | Caída, anticipación de contacto y aterrizaje. |
| `bigotes-attack-chroma.png` | 8 | 16 FPS | Frames 0–1 anticipación, 2–4 contacto, 5–7 recuperación; golpe con guante calefactor. |
| `bigotes-hurt-chroma.png` | 4 | 10 FPS | Impacto, retroceso, overshoot y recuperación. |
| `bigotes-defeat-chroma.png` | 6 | 7 FPS | Pérdida de fuerza y pose final legible. |
| `bigotes-interact-chroma.png` | 4 | 8 FPS | Operar horno/válvula, claramente distinto del ataque. |
| `effects/player-attack-chroma.png` | 6 | 16 FPS | Arco ámbar corto, sin personaje ni fondo. |
| `effects/hit-spark-chroma.png` | 6 | 18 FPS | Destello de contacto compacto, sin personaje ni fondo. |

Los archivos `bigotes-master*` conservan el frame maestro y pruebas de limpieza de chroma. Los resultados de juego se generan con `npm run art:process`; no deben editarse manualmente.
