# Fuentes pixel art v1

Estas imágenes fueron producidas con ImageGen integrado. Bigotes partió de `assets/bigotes-assets.png`; los enemigos usan sus PNG legacy sólo como identidad conceptual y la hoja final de Bigotes como ancla obligatoria de estilo. No sustituyen los PNG legacy: son fuentes de trabajo para el procesamiento reproducible de `scripts/process-pixel-art.mjs`.

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

## Prompt compartido del lote de enemigos

> Crea pixel art nativo para Pan de Marea usando el PNG legacy adjunto sólo como referencia de identidad y `assets/pixel-art/v1/characters/bigotes.png` como ancla obligatoria de estilo, densidad de detalle, outline y acabado. Conserva la silueta y rasgos reconocibles del enemigo, pero simplifícalos con proporciones cartoon expresivas, outline azul marino equivalente a un píxel, clusters duros, dos tonos por material y 12–16 colores opacos. Personaje mirando a la derecha, punto de apoyo inferior constante y fondo chroma `#ff00ff` perfectamente plano. Sin textura pictórica, sombras, suelo, rejilla, texto, blur, antialias, semitransparencia ni elementos compartidos entre poses. La fluidez proviene de arcos, anticipación, overshoot, peso y recuperación; no de añadir detalle.

Cada llamada generó una sola fila horizontal y añadió el contrato de acción correspondiente:

| Personaje | Fila | Frames | Contrato de acción |
|---|---|---:|---|
| Rastrero | idle | 6 | Respiración y flotación leve en loop. |
| Rastrero | patrol | 8 | Ciclo de arrastre con pinzas y patas alternadas. |
| Rastrero | alert | 4 | Ojos y pinzas anticipan el peligro. |
| Rastrero | attack | 8 | Dos anticipaciones, tres contactos y tres recuperaciones. |
| Rastrero | hurt / stun / defeat | 4 / 4 / 6 | Retroceso, vulnerabilidad legible y colapso progresivo. |
| Escupemasas | idle / move | 6 / 6 | Pulso orgánico y desplazamiento corto con socket fijo. |
| Escupemasas | charge | 6 | Brillo de boca creciente hasta máximo inequívoco. |
| Escupemasas | shoot | 8 | Ignición en el mismo socket, disparo, recoil y recuperación. |
| Escupemasas | hurt / defeat | 4 / 8 | Pérdida de brillo y disolución/desinflado. |
| Sentinela | sleep / alert | 6 / 4 | Peso contenido y despertar hacia postura amenazante. |
| Sentinela | walk | 8 | Marcha pesada con transferencia de peso. |
| Sentinela | attack | 8 | Levantar brazo, golpe, contacto y recuperación. |
| Sentinela | charge | 8 | Embestida agachada claramente distinta de caminar. |
| Sentinela | hurt / defeat | 4 / 8 | Armadura abierta vulnerable y colapso en roca/coral. |

Los frames maestros y tiras chroma viven en `rastrero/`, `escupemasas/` y `sentinela/`. El procesador aísla poses por componentes conectados, asigna partículas al cuerpo más cercano, normaliza cada personaje a su propia paleta cerrada y ensambla las hojas exactas declaradas en `pixel_art_prompt.md`.
