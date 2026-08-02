# Guía de assets y audio pendientes

Documento de producción para completar el apartado visual y sonoro de **Pan de Marea: La Última Panadería**.

Aquí se distingue entre:

- material que ya existe y funciona;
- material que falta para sustituir placeholders;
- material opcional para pulido;
- medidas y formatos recomendados para entregarlo listo para Phaser.

## 1. Especificación base

| Concepto | Valor |
|---|---:|
| Resolución lógica del juego | 640×360 px |
| Relación de aspecto | 16:9 |
| Tamaño del primer nivel | 4,800×360 px |
| Cuadrícula recomendada | 16×16 px |
| Filtrado | Nearest / pixelated |
| Antialias | Desactivado |
| Escalado recomendado | múltiplos enteros |

La cuadrícula 16×16 sirve para construir y alinear. No significa que un personaje deba medir 16×16. Por ejemplo, Bigotes puede ocupar 3×4 celdas: 48×64 px.

## 2. Entregables prioritarios

### Prioridad P0: faltan para terminar el primer nivel

- [ ] Horno apagado, disponible, horneando y completo.
- [ ] Respiradero de oxígeno.
- [ ] Pan Térmico como objeto de mundo.
- [ ] Icono de Pan Térmico para el HUD.
- [ ] Iconos de salud, oxígeno y levadura para el HUD.
- [ ] Efectos de ataque e impacto.
- [ ] Efecto de recolección de levadura.
- [ ] Efecto cálido de horneado.
- [ ] Efecto de activación de la compuerta.
- [ ] Siete sonidos que ya solicita el código.
- [ ] Música principal de La Panadería Hundida.
- [ ] Ambiente submarino en loop.

### Prioridad P1: pulido recomendado

- [ ] Burbujas pequeñas con 2–4 variantes.
- [ ] Indicador visual de interacción.
- [ ] Viñeta o textura de alerta de oxígeno.
- [ ] Sombra de suelo para personajes y enemigos.
- [ ] Fuente pixel en WOFF2 con licencia.
- [ ] Sonidos de menú, respiradero, alerta y ataque enemigo.
- [ ] Variantes visuales de plataformas para reducir repetición.
- [ ] Retratos o ilustraciones para resultados/tutoriales.

### Prioridad P2: contenido futuro

- [ ] Assets funcionales del Mercado Sumergido.
- [ ] Animaciones completas de Escupemasas.
- [ ] Animaciones completas del Sentinela del Coral Negro.
- [ ] Música y ambiente propios del segundo nivel.
- [ ] Iconografía de selección de nivel.

## 3. Assets que ya existen

| Archivo | Dimensiones | Peso aprox. | Uso actual |
|---|---:|---:|---|
| `bigotes-assets.png` | 1024×1536 | 3.21 MB | Bigotes |
| `rastrero-de-salmuera.png` | 1536×1024 | 2.64 MB | Rastrero |
| `golden-bubble-yeast.png` | 1536×1024 | 2.29 MB | Levadura |
| `rusty-undewater-portal.png` | 1536×1024 | 3.13 MB | Compuerta |
| `panaderia-undida-bg-1.png` | 1536×1024 | 2.39 MB | Parallax lejano |
| `panaderia-undida-bg-2.png` | 1536×1024 | 2.18 MB | Parallax medio |
| `panaderia-undida-bg-3.png` | 1536×1024 | 1.94 MB | Parallax cercano |
| `tileset.png` | 1536×1024 | 2.95 MB | Suelo, plataformas y decoración |
| `mercado-undido-1.png` | 1536×1024 | 1.98 MB | Reservado |
| `mercado-undido-2.png` | 1536×1024 | 2.72 MB | Reservado |
| `mercado-undido-3.png` | 1536×1024 | 3.70 MB | Reservado |
| `escupemasas.png` | 1536×1024 | 2.97 MB | Reservado |
| `sentinela-del-coral-negro.png` | 1024×1536 | 2.93 MB | Reservado |

Los PNG actuales tienen estilo pictórico, frames y márgenes irregulares. Son utilizables, pero no son pixel art nativo. Su autoría y licencia deben confirmarse antes de una publicación comercial.

## 4. Tamaños recomendados para nuevos assets

Estas medidas están pensadas para arte nuevo dibujado directamente en pixel art.

| Asset | Tamaño por frame | Celdas de 16 px | Estado |
|---|---:|---:|---|
| Bigotes | 48×64 px | 3×4 | Rehacer sólo si se migra a pixel art |
| Rastrero | 80×48 px | 5×3 | Rehacer sólo si se migra a pixel art |
| Levadura | 48×48 px | 3×3 | Rehacer sólo si se migra a pixel art |
| Compuerta | 128×160 px | 8×10 | Rehacer sólo si se migra a pixel art |
| Horno | 96×80 px | 6×5 | **Faltante** |
| Respiradero | 48×32 px | 3×2 | **Faltante** |
| Pan Térmico de mundo | 32×32 px | 2×2 | **Faltante** |
| Iconos del HUD | 16×16 o 24×24 px | 1×1 aprox. | **Faltantes** |
| Indicador de interacción | 16×16 px | 1×1 | Recomendado |
| Partícula pequeña | 4×4 u 8×8 px | — | Recomendada |
| Tile base | 16×16 px | 1×1 | Recomendado al rehacer tileset |
| Bloque modular | 32×32 px | 2×2 | Recomendado al rehacer tileset |

No se recomienda reducir automáticamente las ilustraciones actuales a estas dimensiones. Las siluetas deben redibujarse o simplificarse manualmente.

## 5. Spritesheets y animaciones

### Reglas para todas las hojas

- PNG RGBA con transparencia.
- Todos los frames de una entidad con el mismo tamaño.
- Sin separación entre celdas y sin padding exterior.
- Las celdas no utilizadas deben permanecer transparentes.
- Pies, base o punto de apoyo alineados en todos los frames.
- Personajes dibujados mirando a la derecha; Phaser usa `flipX` para la izquierda.
- Nombres en minúsculas, sin espacios ni acentos.
- No incluir sombras largas dentro del mismo sprite.

### Bigotes

| Propiedad | Valor |
|---|---:|
| Frame | 48×64 px |
| Hoja | 288×320 px |
| Distribución | 6 columnas × 5 filas |
| Collider inicial sugerido | 26×46 px |

| Fila | Animación | Frames | FPS | Loop |
|---:|---|---:|---:|---|
| 0 | idle | 6 | 6 | Sí |
| 1 | movimiento/nado | 6 | 9 | Sí |
| 2 | ataque | 6 | 14 | No |
| 3 | daño | 4 | 10 | No |
| 4 | derrota | 6 | 7 | No |

### Rastrero de Salmuera

| Propiedad | Valor |
|---|---:|
| Frame | 80×48 px |
| Hoja | 480×240 px |
| Distribución | 6 columnas × 5 filas |
| Collider inicial sugerido | 58×30 px |

| Fila | Animación | Frames | FPS | Loop |
|---:|---|---:|---:|---|
| 0 | idle/alerta | 6 | 5 | Sí |
| 1 | patrulla/persecución | 6 | 8 | Sí |
| 2 | ataque | 6 | 12 | No |
| 3 | daño/aturdimiento | 5 | 10 | No |
| 4 | derrota | 5 | 8 | No |

### Levadura de Burbuja

| Propiedad | Valor |
|---|---:|
| Frame | 48×48 px |
| Hoja | 288×144 px |
| Distribución | 6 columnas × 3 filas |

| Fila | Animación | Frames | FPS | Loop |
|---:|---|---:|---:|---|
| 0 | idle | 6 | 7 | Sí |
| 1 | atracción | 5 | 11 | Sí |
| 2 | recolección | 6 | 14 | No |

### Compuerta térmica

| Propiedad | Valor |
|---|---:|
| Frame | 128×160 px |
| Hoja | 768×480 px |
| Distribución | 6 columnas × 3 filas |

| Fila | Animación | Frames | FPS | Loop |
|---:|---|---:|---:|---|
| 0 | inactiva | 6 | 4 | Sí |
| 1 | activación | 6 | 8 | No |
| 2 | activa | 6 | 6 | Sí |

### Horno faltante

Opción mínima:

- archivo: `oven.png`;
- frame: 96×80 px;
- hoja: 384×80 px;
- cuatro frames: apagado, disponible, horneando y completo.

Opción animada:

- hoja: 576×240 px;
- 6 columnas × 3 filas;
- filas: idle, horneado y completo;
- 6–10 FPS.

### Respiradero faltante

- archivo: `oxygen-vent.png`;
- tamaño: 48×32 px;
- versión mínima: un frame;
- versión animada: cuatro frames en una hoja de 192×32 px;
- animación sugerida: brillo y expulsión de burbujas a 6 FPS.

### Pan Térmico faltante

- mundo: `thermal-bread.png`, 32×32 px;
- HUD: `icon-thermal-bread.png`, 24×24 px;
- opcional: cuatro frames de brillo en una hoja de 128×32 px.

## 6. Tileset y fondos

### Tileset

El tileset nuevo debería utilizar celdas uniformes de 16×16 o 32×32 alineadas a una cuadrícula de 16 px.

Contenido mínimo:

- nueve tiles de terreno: cuatro esquinas, cuatro bordes y centro;
- plataforma fina con extremo izquierdo, centro y extremo derecho;
- tres o más variantes de suelo;
- columnas y paredes decorativas;
- rocas y coral separados de los tiles con colisión;
- versiones húmedas, rotas o iluminadas como variantes visuales.

Los objetos decorativos no deben definir la colisión. El juego usa superficies simples independientes de la imagen.

### Fondos de La Panadería Hundida

| Archivo | Contenido | Tamaño recomendado |
|---|---|---:|
| `panaderia-undida-bg-1.png` | agua, iluminación y siluetas lejanas | 640×360 px |
| `panaderia-undida-bg-2.png` | arquitectura intermedia | 640×360 px |
| `panaderia-undida-bg-3.png` | interior y detalles cercanos | 640×360 px |

Los tres fondos deben repetirse horizontalmente sin costura. No deben contener plataformas, coleccionables ni señales interactivas falsas.

Si se conserva el estilo ilustrado en alta resolución, se recomienda que las tres capas compartan 1280×720 o 1920×1080.

## 7. UI faltante

| Archivo sugerido | Tamaño | Uso |
|---|---:|---|
| `icon-health.png` | 16×16 o 24×24 | salud |
| `icon-oxygen.png` | 16×16 o 24×24 | oxígeno |
| `icon-yeast.png` | 16×16 o 24×24 | contador de levaduras |
| `icon-thermal-bread.png` | 24×24 | inventario |
| `icon-interact.png` | 16×16 | interacción |
| `oxygen-vignette.png` | 640×360 | alerta opcional en los bordes |

No incluir texto dentro de los PNG. Los textos deben seguir siendo HTML/React para accesibilidad y traducción.

## 8. Audio requerido

Actualmente no existe ningún archivo de audio. Estas siete claves ya son llamadas por el código:

| Clave | Archivo sugerido | Duración |
|---|---|---:|
| `jump` | `audio/sfx/jump.ogg` | 0.15–0.35 s |
| `attack` | `audio/sfx/attack.ogg` | 0.20–0.45 s |
| `hurt` | `audio/sfx/hurt.ogg` | 0.25–0.60 s |
| `collect` | `audio/sfx/yeast-collect.ogg` | 0.35–0.80 s |
| `oven` | `audio/sfx/oven.ogg` | 1.0–1.5 s |
| `gate` | `audio/sfx/gate.ogg` | 1.5–3.0 s |
| `enemy-defeat` | `audio/sfx/enemy-defeat.ogg` | 0.4–1.0 s |

### Audio adicional recomendado

| Archivo sugerido | Uso | Loop |
|---|---|---|
| `audio/music/bakery-loop.ogg` | música del primer nivel | Sí |
| `audio/ambience/underwater-loop.ogg` | agua, burbujas y estructura | Sí |
| `audio/sfx/low-oxygen.ogg` | alerta de oxígeno bajo | No |
| `audio/sfx/vent.ogg` | recuperación de oxígeno | No |
| `audio/sfx/enemy-alert.ogg` | alerta del Rastrero | No |
| `audio/sfx/enemy-attack.ogg` | ataque enemigo | No |
| `audio/sfx/thermal-bread.ogg` | aparición del pan | No |
| `audio/ui/confirm.ogg` | confirmar menú | No |
| `audio/ui/back.ogg` | volver/cancelar | No |
| `audio/ui/pause.ogg` | abrir/cerrar pausa | No |

### Especificación técnica

- Máster: WAV PCM, 48 kHz, 24 bits.
- Web: OGG Vorbis; MP3 como fallback opcional.
- SFX: mono salvo que requieran espacialidad.
- Música y ambiente: estéreo.
- Pico máximo recomendado: −1 dBFS.
- Eliminar silencios innecesarios al inicio de SFX inmediatos.
- Crear loops en cruces por cero y probarlos durante varios minutos.
- Nombres en minúsculas, sin espacios ni acentos.
- Documentar autoría, licencia y fuente de cada archivo.

### Mezcla inicial

| Bus | Volumen recomendado |
|---|---:|
| Master | 100 % |
| Música | 35–45 % |
| Ambiente | 25–35 % |
| Efectos | 70–85 % |
| UI | 55–70 % |

La alerta de oxígeno, el daño y los ataques deben destacar sobre la música.

## 9. Estructura de carpetas sugerida

```text
assets/
  characters/
  enemies/
  environment/
  backgrounds/
  items/
  effects/
  ui/
  fonts/
  audio/
    music/
    ambience/
    sfx/
    ui/
```

Actualmente Vite publica directamente `assets/`. Por ejemplo, `assets/audio/sfx/jump.ogg` se carga mediante `/audio/sfx/jump.ogg`.

## 10. Reglas de exportación

- PNG RGBA de 8 bits y perfil sRGB.
- Transparencia real, sin fondo sólido.
- Sin suavizado, blur ni resampling para pixel art.
- Escala 100 % y dimensiones enteras.
- Mantener una paleta y densidad de píxel consistentes.
- Evitar píxeles semitransparentes accidentales.
- Conservar originales editables fuera de la carpeta pública.
- Comprimir los PNG sin pérdida antes de publicar.
- No reemplazar un archivo existente sin revisar manifiesto, escala y collider.

## 11. Integración en Phaser

### Imágenes

1. Copiar el PNG terminado a `assets/` o su subcarpeta.
2. Registrar ruta y clave en `src/game/assetManifest.js`.
3. Declarar los frames en `FRAME_MANIFEST`.
4. Declarar animaciones en `src/game/data/animationData.js`.
5. Usar escala `1` si el sprite ya está dibujado al tamaño lógico final.
6. Ajustar origen y collider en la entidad.
7. Comprobar que no aparezcan advertencias de recortes en consola.

Las hojas actuales se cargan como imágenes y usan `texture.add` porque sus frames son irregulares. Si todas las hojas nuevas son uniformes, se puede migrar cada una a `load.spritesheet`, pero debe hacerse de forma controlada.

### Audio

Añadir archivos por sí solo no habilita el sonido. También hace falta:

1. crear un manifiesto de audio;
2. precargar cada clave con `this.load.audio` en `PreloadScene`;
3. conectar `AudioManager` con `scene.sound`;
4. separar música, ambiente, SFX y UI;
5. aplicar mute y volumen desde los ajustes React;
6. detener y destruir sonidos durante `shutdown`;
7. desbloquear Web Audio después de la primera interacción.

## 12. Checklist por asset

- [ ] Tiene dimensiones exactas.
- [ ] Usa transparencia y sRGB.
- [ ] Todos los frames tienen igual tamaño.
- [ ] La línea de base no cambia entre frames.
- [ ] Se entiende al 100 % de zoom en 640×360.
- [ ] No tiene suavizado accidental.
- [ ] El nombre coincide con el manifiesto.
- [ ] La escala en Phaser es correcta.
- [ ] El collider coincide con el cuerpo visible.
- [ ] Si es decorativo, no bloquea al jugador.
- [ ] Funciona mirando a ambos lados con `flipX`.
- [ ] Autoría y licencia están documentadas.

## 13. Checklist de audio

- [ ] No hay clipping ni silencio inicial innecesario.
- [ ] Los loops no tienen clics ni cortes audibles.
- [ ] El sonido no fatiga al repetirse.
- [ ] El aviso de oxígeno se escucha sobre música y ambiente.
- [ ] Mute detiene todos los buses.
- [ ] Pausa y salida al menú detienen lo que corresponda.
- [ ] No se crean instancias ilimitadas del mismo SFX.
- [ ] OGG funciona en el build de producción.
- [ ] Licencia y fuente están documentadas.

## 14. Orden de producción recomendado

1. Horno y respiradero.
2. Pan Térmico e iconos del HUD.
3. Siete SFX ya conectados al gameplay.
4. Música y ambiente submarino.
5. Efectos visuales de ataque, impacto, recolección y compuerta.
6. Variantes del tileset.
7. Fuente e iconografía secundaria.
8. Decidir si el arte actual se conserva o se redibuja completamente como pixel art.

No conviene mezclar personajes pixel art de baja resolución con fondos pictóricos reescalados sin definir primero una dirección artística común.
