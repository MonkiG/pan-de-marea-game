# Auditoría de assets de Pan de Marea

Auditoría realizada el 2 de agosto de 2026. El registro ejecutable vive en `src/game/assets/assetRegistry.js`; este documento describe el resultado para producción artística. No se descargó, generó ni modificó ningún PNG.

## Resultado

| Métrica | Cantidad |
|---|---:|
| Recursos registrados | 20 |
| PNG aportados y válidos | 13 |
| Recursos compartidos | 4 |
| Recursos usados por el Nivel I | 8 |
| Recursos usados por el Nivel II | 16 |
| Recursos faltantes con fallback | 7 |
| Archivos inválidos | 0 |

Los tres fondos del Mercado, Escupemasas y Sentinela se integraron con los archivos reales. Las láminas irregulares se cargan como imágenes y reciben recortes explícitos mediante `texture.add`; no se tratan como spritesheets uniformes.

## Inventario central

| ID lógico | Archivo / dimensiones | Nivel | Función | Estado o fallback |
|---|---|---|---|---|
| `bigotes` | `bigotes-assets.png`, 1024×1536 | I y II | jugador | real, compartido |
| `brineCrawler` | `rastrero-de-salmuera.png`, 1536×1024 | I y II | enemigo cuerpo a cuerpo | real, compartido |
| `bubbleYeast` | `golden-bubble-yeast.png`, 1536×1024 | I y II | ingrediente y oxígeno | real, compartido |
| `thermalGate` | `rusty-undewater-portal.png`, 1536×1024 | I | salida térmica | real |
| `bakeryBackgroundFar` | `panaderia-undida-bg-1.png`, 1536×1024 | I | parallax lejano | real |
| `bakeryBackgroundMid` | `panaderia-undida-bg-2.png`, 1536×1024 | I | parallax medio | real |
| `bakeryBackgroundNear` | `panaderia-undida-bg-3.png`, 1536×1024 | I | parallax cercano | real |
| `sharedTileset` | `tileset.png`, 1536×1024 | I y II | suelo y plataformas | real, compartido |
| `marketBackgroundFar` | `mercado-undido-1.png`, 1536×1024 | II | parallax lejano | real |
| `marketBackgroundMid` | `mercado-undido-2.png`, 1536×1024 | II | parallax medio | real |
| `marketBackgroundNear` | `mercado-undido-3.png`, 1536×1024 | II | parallax cercano | real |
| `abyssalSpitter` | `escupemasas.png`, 1536×1024 | II | enemigo a distancia | real |
| `blackCoralSentinel` | `sentinela-del-coral-negro.png`, 1024×1536 | II | guardián pesado | real |
| `corruptedDoughProjectile` | faltante | II | proyectil pooled | `fallback-projectile` |
| `pressureRegulator` | faltante | II | objetivo interactivo | `fallback-regulator` |
| `pressureOven` | faltante | II | estación de receta | `fallback-pressure-oven` |
| `marketExit` | faltante | II | salida final | `fallback-market-exit` |
| `marketCheckpoint` | faltante | II | punto de restauración | `fallback-checkpoint` |
| `marketStall` | faltante | II | cobertura y decoración | `fallback-market-stall` |
| `blackCoralHazard` | faltante | II | peligro ambiental | `fallback-hazard` |

## Política de resolución

`AssetResolver` valida la textura y los frames requeridos al crear cada elemento. Si algo falta, devuelve la clave de fallback, registra el uso y emite una única advertencia por recurso. `FallbackFactory` genera todas las texturas geométricas durante `BootScene`, por lo que una ausencia artística no impide completar la partida.

En desarrollo, `PreloadScene` imprime el resumen de auditoría. Los resultados del resolver sólo se incluyen en snapshots de depuración; la interfaz de producción no expone diagnósticos internos.

## Sustituir un fallback

1. Añadir el PNG a `assets/` sin reemplazar archivos ajenos.
2. Asignar `key`, `path`, dimensiones y tipo en `assetRegistry.js`.
3. Si la lámina es irregular, declarar sus recortes en `assetManifest.js`.
4. Declarar sus secuencias en `animationData.js` cuando corresponda.
5. Ajustar escala, origen y collider en la entidad, no dentro de los datos del nivel.
6. Ejecutar `npm test`, `npm run build` y una partida visual de ambos niveles.

## Audio y licencia

No hay audio ni fuentes en el repositorio. `AudioManager` funciona en silencio y avisa una sola vez por clave ausente. La lista y las especificaciones de entrega están en `GUIA_ASSETS_Y_AUDIO.md`.

Los trece PNG figuran como “aportados con el proyecto”. La autoría y licencia no estaban documentadas y deben verificarse antes de una distribución comercial.
