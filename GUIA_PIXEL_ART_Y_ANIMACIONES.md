# Guía de pixel art, assets y animaciones

Documento de producción visual para **Pan de Marea: La Última Panadería**. Su objetivo es dejar claro qué material existe, qué falta, qué debe redibujarse y cómo entregar animaciones que coincidan con el gameplay de Phaser.

Esta guía no propone reducir automáticamente las ilustraciones actuales. Los PNG existentes tienen detalle pictórico, fondos degradados, márgenes irregulares y siluetas variables. Para conseguir pixel art legible deben **redibujarse**, usando las imágenes actuales como referencia conceptual.

## 1. Base visual del proyecto

| Concepto | Especificación objetivo |
|---|---:|
| Resolución lógica | 640×360 px |
| Relación | 16:9 |
| Cuadrícula de construcción | 16×16 px |
| Unidad de tiles | 16×16 o 32×32 px |
| Escala de sprites | 1× en Phaser |
| Escalado de pantalla | múltiplos enteros cuando sea posible |
| Filtrado | nearest / pixelated |
| Antialias | desactivado |
| Color | PNG RGBA, sRGB |

Una cuadrícula de 16 px no obliga a que un personaje mida 16×16. Bigotes, por ejemplo, puede ocupar 48×64 px: tres celdas de ancho por cuatro de alto.

## 2. Assets que ya existen

Hay 13 PNG artísticos, más el favicon SVG. Todos funcionan como referencia y actualmente se cargan en el juego, pero ninguno de los personajes, enemigos, fondos o tiles está preparado como pixel art uniforme.

| Archivo actual | Dimensiones | Uso | Estado para pixel art |
|---|---:|---|---|
| `bigotes-assets.png` | 1024×1536 | jugador | redibujar; frames y siluetas irregulares |
| `rastrero-de-salmuera.png` | 1536×1024 | enemigo compartido | redibujar; separar estados claramente |
| `golden-bubble-yeast.png` | 1536×1024 | coleccionable | redibujar en una cuadrícula uniforme |
| `rusty-undewater-portal.png` | 1536×1024 | compuerta del Nivel I | redibujar y alinear la base |
| `panaderia-undida-bg-1.png` | 1536×1024 | fondo lejano del Nivel I | rehacer como capa 16:9 repetible |
| `panaderia-undida-bg-2.png` | 1536×1024 | fondo medio del Nivel I | rehacer como capa 16:9 repetible |
| `panaderia-undida-bg-3.png` | 1536×1024 | fondo cercano del Nivel I | rehacer sin plataformas falsas |
| `tileset.png` | 1536×1024 | suelo, plataformas y decoración | reconstruir sobre grid de 16/32 px |
| `mercado-undido-1.png` | 1536×1024 | fondo lejano del Nivel II | rehacer como capa 16:9 repetible |
| `mercado-undido-2.png` | 1536×1024 | fondo medio del Nivel II | rehacer como capa 16:9 repetible |
| `mercado-undido-3.png` | 1536×1024 | fondo cercano del Nivel II | rehacer sin señales interactivas falsas |
| `escupemasas.png` | 1536×1024 | enemigo a distancia | redibujar; carga y disparo deben distinguirse |
| `sentinela-del-coral-negro.png` | 1024×1536 | guardián pesado | redibujar; anticipaciones poco legibles actualmente |
| `favicon.svg` | 64×64 lógico | favicon con emoji | terminado; no forma parte del arte del juego |

### Problemas comunes del material actual

- Los frames no comparten exactamente ancho, alto, padding ni línea de suelo.
- Parte del arte se extiende fuera de los recortes registrados.
- Los degradados y bordes semitransparentes se ven borrosos al reducirse.
- Hay demasiado detalle para leerse con claridad a 640×360.
- Algunas filas parecen variaciones ilustrativas, no fases de un movimiento continuo.
- El tamaño visual cambia entre frames y produce vibración.
- Los fondos son 3:2, mientras el juego es 16:9.
- El tileset mezcla piezas con tamaños y márgenes no modulares.

## 3. Assets que faltan

### Prioridad P0: lectura del combate

| Archivo sugerido | Tamaño | Contenido mínimo |
|---|---:|---|
| `effects/player-attack.png` | 32×32 por frame | anticipación, contacto y disipación |
| `effects/hit-spark.png` | 24×24 por frame | 4–6 frames de impacto confirmado |
| `effects/enemy-hit.png` | 24×24 por frame | destello o fragmentos al recibir daño |
| `ui/icon-attack.png` | 16×16 o 24×24 | icono opcional para controles/tutorial |
| `enemies/corrupted-dough-projectile.png` | 24×24 por frame | vuelo, impacto y disipación |

### Prioridad P0: objetos funcionales sin arte definitivo

| Archivo sugerido | Tamaño | Estados |
|---|---:|---|
| `environment/oven.png` | 96×80 | apagado, disponible, horneando, completo |
| `environment/oxygen-vent.png` | 48×32 | inactivo y expulsando burbujas |
| `items/thermal-bread.png` | 32×32 | idle/brillo |
| `environment/pressure-regulator.png` | 48×64 | inactivo, activando, activo |
| `environment/pressure-station.png` | 96×96 | bloqueada, disponible, horneando, completa |
| `items/pressure-bread.png` | 32×32 | idle/brillo |
| `environment/market-exit.png` | 128×160 | cerrada, activación, abierta |
| `environment/market-checkpoint.png` | 48×80 | inactivo, activación, activo |
| `environment/market-stall.png` | 128×96 | 3–5 variantes modulares de puesto/cobertura |
| `environment/black-coral-hazard.png` | 64×32 | 2–4 variantes peligrosas |

### Prioridad P1: interfaz y efectos

| Archivo sugerido | Tamaño | Uso |
|---|---:|---|
| `ui/icon-health.png` | 16×16 o 24×24 | salud |
| `ui/icon-oxygen.png` | 16×16 o 24×24 | oxígeno |
| `ui/icon-yeast.png` | 16×16 o 24×24 | inventario |
| `ui/icon-thermal-bread.png` | 24×24 | Pan Térmico |
| `ui/icon-pressure-bread.png` | 24×24 | Pan de Presión |
| `ui/icon-regulator.png` | 24×24 | reguladores del Mercado |
| `ui/icon-checkpoint.png` | 24×24 | checkpoint activo |
| `ui/icon-interact.png` | 16×16 | interacción contextual |
| `effects/yeast-collect.png` | 32×32 | recolección |
| `effects/oxygen-bubbles.png` | 8×8 o 16×16 | 3–5 variantes |
| `effects/warm-burst.png` | 48×48 | horno y compuerta térmica |
| `effects/pressure-burst.png` | 48×48 | reguladores y salida del Mercado |
| `ui/oxygen-vignette.png` | 640×360 | alerta opcional, sin texto incrustado |

Las fuentes, música y sonidos siguen faltando, pero están documentados por separado en `GUIA_ASSETS_Y_AUDIO.md`.

## 4. Formato obligatorio de spritesheets nuevos

- Todos los frames de una entidad deben tener exactamente el mismo tamaño.
- La hoja debe usar una cuadrícula regular sin separación ni padding exterior.
- Los frames no utilizados deben ser totalmente transparentes.
- Los pies o punto de apoyo deben caer en la misma coordenada de cada celda.
- El personaje base debe mirar a la derecha; Phaser utiliza `flipX` para la izquierda.
- Ningún arma, destello o extremidad puede salir de la celda.
- No usar blur, resampling, sombras suaves ni píxeles semitransparentes accidentales.
- Conservar el mismo volumen de la silueta entre frames; sólo debe cambiar por intención de movimiento.
- Exportar al 100 %, nunca ampliado a 2×, 4× u 8× dentro del archivo.
- Entregar también el archivo editable original fuera de `assets/`.

## 5. Bigotes: hoja y movimientos requeridos

### Hoja recomendada

| Propiedad | Valor |
|---|---:|
| Frame | 48×64 px |
| Columnas | 8 |
| Filas | 8 |
| Hoja completa | 384×512 px |
| Punto de apoyo | centro inferior, constante |
| Collider inicial | 26×46 px |

| Fila | Estado | Frames útiles | FPS | Loop | Lectura necesaria |
|---:|---|---:|---:|---|---|
| 0 | idle | 6 | 6 | sí | respiración y flotación sutil |
| 1 | movimiento/nado | 8 | 9 | sí | impulso horizontal reconocible |
| 2 | salto/subida | 3 | 10 | no | anticipación y despegue |
| 3 | caída/aterrizaje | 4 | 8 | parcial | caída legible y recepción clara |
| 4 | ataque | 8 | 14 | no | anticipación, contacto y recuperación |
| 5 | daño | 4 | 10 | no | retroceso claro, sin parecer ataque |
| 6 | derrota | 6 | 7 | no | pérdida de control y reposo final |
| 7 | interacción/horno | 4 | 8 | no | acción distinta del ataque |

### Contrato visual del ataque

La fila de ataque debe seguir esta secuencia exacta:

| Frame | Fase | Hitbox | Qué debe verse |
|---:|---|---|---|
| 0 | anticipación | apagada | Bigotes prepara brazo/arma |
| 1 | anticipación | apagada | peso hacia atrás; dirección evidente |
| 2 | inicio | encendida | comienza el golpe o disparo corto |
| 3 | contacto | encendida | máxima extensión y destello principal |
| 4 | contacto | encendida | seguimiento; último frame dañino |
| 5 | recuperación | apagada | arma vuelve al cuerpo |
| 6 | recuperación | apagada | postura casi neutral |
| 7 | salida | apagada | transición limpia a idle/movimiento |

El destello principal debe coincidir con el primer frame de contacto. El alcance visible del arma y el alcance físico deben terminar en el mismo punto.

### Por qué el ataque actual se siente inconsistente

El código actual tiene estos valores:

- animación: 6 frames a 14 FPS, duración aproximada de **429 ms**;
- anticipación física: **90 ms**;
- ventana activa: **110 ms**;
- fin del estado de ataque: aproximadamente **200 ms**;
- cooldown: **400 ms**;
- hitbox: **58×48 px**, desplazada 50 px al frente y 34 px hacia arriba;
- máximo de un impacto por enemigo y ataque.

Esto provoca varios desacoples:

1. El estado `isAttacking` termina unos 229 ms antes que la animación.
2. Idle o movimiento pueden reemplazar visualmente el ataque a mitad de la secuencia.
3. La hitbox sólo está activa durante una parte muy breve de los seis frames.
4. El cañón, brazo y fuego de la lámina actual cambian de longitud; algunos se acercan o salen del recorte de 160 px.
5. No existe un efecto separado de impacto que confirme al jugador que el golpe conectó.
6. El tamaño y posición de la hitbox están escritos directamente en `Player.js`, no asociados a frames concretos.

### Cambios técnicos necesarios para el ataque

Cuando se entregue el sprite nuevo, el código debería modificarse así:

1. Mover ancho, alto y offsets de la hitbox a `PLAYER.attack` dentro de `constants.js`.
2. Sincronizar la activación con los frames 2–4, no sólo con temporizadores independientes.
3. Mantener `isAttacking` hasta terminar el frame 7 o recibir `ANIMATION_COMPLETE`.
4. Conservar el límite de un impacto por enemigo mediante `hitThisAttack`.
5. Crear un hit spark únicamente cuando `enemy.takeDamage()` devuelva un impacto válido.
6. Dibujar temporalmente la hitbox con una bandera `DEBUG_ATTACK` para comparar arte y colisión.
7. Probar mirando a derecha e izquierda; el offset debe invertir su signo con `facing`.
8. Verificar enemigos pequeños, grandes, elevados y parcialmente solapados.

Valor inicial sugerido para el sprite nuevo de 48×64:

| Parámetro | Valor de partida |
|---|---:|
| Hitbox | 36×30 px |
| Centro horizontal | 30 px delante del origen |
| Centro vertical | 8 px sobre el centro corporal |
| Anticipación | 140 ms |
| Ventana activa | 150–180 ms |
| Recuperación | 180–220 ms |
| Cooldown total | 450–520 ms |

Estos números son punto de partida. La posición final debe decidirse viendo el frame de máxima extensión, no copiando los valores actuales.

## 6. Rastrero de Salmuera

| Propiedad | Valor recomendado |
|---|---:|
| Frame | 80×48 px |
| Hoja | 640×336 px |
| Distribución | 8 columnas × 7 filas |
| Collider inicial | 58×30 px |

| Fila | Estado | Frames | FPS | Loop |
|---:|---|---:|---:|---|
| 0 | idle | 6 | 5 | sí |
| 1 | patrulla | 8 | 8 | sí |
| 2 | alerta | 4 | 10 | no |
| 3 | ataque | 8 | 12 | no |
| 4 | daño | 4 | 10 | no |
| 5 | aturdimiento | 4 | 4 | sí |
| 6 | derrota | 6 | 8 | no |

El ataque necesita dos frames de anticipación, dos o tres de contacto y recuperación visible. Los ojos o pinzas deben comunicar la alerta antes de causar daño.

## 7. Levadura de Burbuja

| Propiedad | Valor recomendado |
|---|---:|
| Frame | 48×48 px |
| Hoja | 384×144 px |
| Distribución | 8 columnas × 3 filas |

| Fila | Estado | Frames | FPS | Loop |
|---:|---|---:|---:|---|
| 0 | idle | 6 | 7 | sí |
| 1 | atracción | 6 | 11 | sí |
| 2 | recolección | 8 | 14 | no |

La silueta central no debe cambiar de tamaño. La atracción debe inclinar partículas hacia Bigotes y la recolección debe terminar en un frame vacío.

## 8. Compuerta térmica

| Propiedad | Valor recomendado |
|---|---:|
| Frame | 128×160 px |
| Hoja | 1024×480 px |
| Distribución | 8 columnas × 3 filas |

| Fila | Estado | Frames | FPS | Loop |
|---:|---|---:|---:|---|
| 0 | inactiva | 6 | 4 | sí |
| 1 | activación | 8 | 8 | no |
| 2 | activa | 6 | 6 | sí |

La base debe permanecer totalmente fija. Sólo deben moverse el aro, la luz, partículas o mecanismos internos.

## 9. Escupemasas Abisal

| Propiedad | Valor recomendado |
|---|---:|
| Frame | 80×64 px |
| Hoja | 640×384 px |
| Distribución | 8 columnas × 6 filas |
| Collider inicial | 60×38 px |

| Fila | Estado | Frames | FPS | Loop | Lectura necesaria |
|---:|---|---:|---:|---|---|
| 0 | idle | 6 | 5 | sí | respiración/burbujas |
| 1 | movimiento | 6 | 7 | sí | retroceso corto |
| 2 | carga | 6 | 8 | no | brillo creciente en la boca |
| 3 | disparo | 8 | 10 | no | salida inequívoca del proyectil |
| 4 | daño/aturdimiento | 4 | 9 | no | pérdida del brillo |
| 5 | derrota | 8 | 8 | no | desinflado/disolución |

La carga dura actualmente 650 ms. El último frame de carga debe ser el más brillante y el proyectil debe aparecer en el primer frame de disparo, siempre desde el mismo socket.

## 10. Sentinela del Coral Negro

| Propiedad | Valor recomendado |
|---|---:|
| Frame | 96×112 px |
| Hoja | 768×784 px |
| Distribución | 8 columnas × 7 filas |
| Collider inicial | 64×92 px |

| Fila | Estado | Frames | FPS | Loop |
|---:|---|---:|---:|---|
| 0 | idle/dormido | 6 | 4 | sí |
| 1 | alerta | 4 | 8 | no |
| 2 | caminar | 8 | 6 | sí |
| 3 | ataque básico | 8 | 8 | no |
| 4 | carga | 8 | 9 | no |
| 5 | daño/aturdimiento | 4 | 8 | no |
| 6 | derrota | 8 | 7 | no |

La carga necesita una postura de preparación muy distinta de caminar. Durante el aturdimiento debe quedar visualmente vulnerable para enseñar cuándo atacar.

## 11. Tileset y escenarios

### Tileset recomendado

- Atlas de 512×512 px como punto de partida.
- Tiles base de 16×16 px y piezas grandes alineadas a múltiplos de 16.
- Terreno con nueve segmentos: centro, cuatro bordes y cuatro esquinas.
- Plataformas finas con extremo izquierdo, centro y extremo derecho.
- Tres variantes visuales por superficie para evitar repetición.
- Rocas, coral, carteles, cajas y vegetación separados de las piezas con colisión.
- Las decoraciones no deben contener colisión implícita.
- Evitar sombras pintadas que hagan parecer sólido un espacio atravesable.

### Fondos

Cada nivel necesita tres capas 16:9:

| Capa | Tamaño recomendado | Contenido |
|---|---:|---|
| lejana | 640×360 o 1280×720 | agua, luz y siluetas grandes |
| media | 640×360 o 1280×720 | arquitectura y puestos sin interacción falsa |
| cercana | 640×360 o 1280×720 | marcos, algas y detalle ambiental |

Las capas deben repetirse horizontalmente sin costura. Si se entregan a 1280×720, todos los píxeles visuales deben ocupar bloques exactos de 2×2; Phaser las mostrará a 0.5 sin filtrado.

## 12. Archivos de código que cambian al sustituir arte

| Archivo | Qué se modifica |
|---|---|
| `src/game/assets/assetRegistry.js` | ruta, clave, tipo y dimensiones reales |
| `src/game/assetManifest.js` | recortes manuales o eliminación de recortes si la hoja es uniforme |
| `src/game/data/animationData.js` | cantidad de frames, FPS, loops y nuevas animaciones |
| `src/game/entities/Player.js` | escala 1, collider, hitbox y sincronización del ataque |
| `src/game/entities/BrineCrawler.js` | escala 1, collider y ventanas de ataque |
| `src/game/entities/AbyssalSpitter.js` | escala 1, collider y socket del proyectil |
| `src/game/entities/BlackCoralSentinel.js` | escala 1, collider y fases de ataque/carga |
| `src/game/scenes/LevelOneScene.js` | reemplazo de horno, respiradero y efectos geométricos |
| `src/game/scenes/LevelTwoScene.js` | reemplazo de reguladores, estación, checkpoint, puestos y peligros |
| `src/game/systems/FallbackFactory.js` | retirar cada fallback sólo después de validar su asset real |

Si las hojas nuevas son totalmente uniformes se recomienda cargarlas con `load.spritesheet`. Mientras convivan con las hojas viejas se pueden mantener como imágenes con `texture.add`.

## 13. Orden de producción recomendado

1. Redibujar Bigotes y resolver primero su ataque, hitbox e impacto.
2. Redibujar Rastrero y verificar lectura de alerta/ataque/daño.
3. Crear el proyectil de Masa Corrupta y redibujar Escupemasas.
4. Redibujar Sentinela con carga y aturdimiento inequívocos.
5. Crear horno, respiradero, panes, reguladores, estación, checkpoint y salidas.
6. Crear iconos de HUD y efectos de confirmación.
7. Reconstruir el tileset modular.
8. Redibujar los seis fondos como capas 16:9 coherentes.
9. Sustituir fallbacks de uno en uno, probando ambos niveles después de cada cambio.

## 14. Checklist de aceptación por animación

- [ ] Todos los frames tienen igual tamaño y origen.
- [ ] La base del personaje no vibra al reproducirse.
- [ ] Se entiende el estado usando sólo la silueta, sin texto.
- [ ] La anticipación sucede antes del frame dañino.
- [ ] El contacto visual coincide con la hitbox activa.
- [ ] La recuperación termina antes de volver a idle.
- [ ] El último frame conecta limpiamente con el siguiente estado.
- [ ] La animación funciona mirando a izquierda mediante `flipX`.
- [ ] Armas, fuego y partículas no salen de la celda.
- [ ] No hay blur ni píxeles semitransparentes accidentales.
- [ ] Se entiende al 100 % de zoom dentro de 640×360.
- [ ] Collider y hitbox se revisaron con depuración visible.

## 15. Checklist de entrega final

- [ ] PNG RGBA sRGB al 100 % de escala.
- [ ] Nombre en minúsculas, sin espacios ni acentos.
- [ ] Dimensiones exactas y múltiplos de la cuadrícula acordada.
- [ ] Archivo editable conservado fuera de la carpeta pública.
- [ ] Paleta y tamaño aparente coherentes con el resto del juego.
- [ ] Autoría y licencia documentadas.
- [ ] Registro, manifiesto, animaciones y colliders actualizados.
- [ ] `npm test` y `npm run build` completados.
- [ ] Ataques probados contra todos los tamaños de enemigo.
- [ ] Partida visual completa de ambos niveles sin fallbacks inesperados.

La prioridad artística no es añadir más detalle, sino hacer que movimiento, peligro, impacto e interacción se lean inmediatamente a la resolución real del juego.
