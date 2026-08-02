# Prompts base para producir el pixel art

Banco de prompts derivado de [`GUIA_PIXEL_ART_Y_ANIMACIONES.md`](GUIA_PIXEL_ART_Y_ANIMACIONES.md) para **Pan de Marea: La Última Panadería**. Incluye los 13 assets actuales que deben redibujarse y las 28 piezas nuevas P0/P1: **41 entregables visuales** en total.

## Cómo usar este archivo

- Genera **un asset por vez**. No mezcles varios prompts en una sola imagen.
- Cuando el prompt diga «referencia adjunta», adjunta el PNG actual sólo como referencia de identidad, paleta y silueta; no debe reducirse ni calcarse automáticamente.
- Para animaciones complejas, conviene aprobar primero un frame neutral y después generar cada fila usando ese frame como referencia de consistencia.
- Los spritesheets generados por IA requieren revisión y, normalmente, limpieza manual en Aseprite u otra herramienta: medidas exactas, cuadrícula, transparencia, pivote, número de colores y continuidad entre frames.
- Exporta el resultado final como PNG RGBA sRGB, a escala 100 %, con `nearest`, sin antialias y con nombre en minúsculas, sin espacios ni acentos.

## Base técnica común

Añade este bloque al comienzo de cualquiera de los prompts si la herramienta pierde contexto:

```text
Pixel art nativo para un videojuego 2D submarino de plataformas llamado “Pan de Marea: La Última Panadería”. Resolución lógica del juego: 640×360 px. Construcción sobre cuadrícula de 16×16 px, formas legibles al 100 % de zoom y paleta limitada y coherente. Estética: fantasía submarina, panadería artesanal hundida, bronce y hierro envejecidos, piedra húmeda, coral, turquesas profundos y luz cálida ámbar para objetivos amistosos; verde masa corrupta y coral negro para peligros. Píxeles duros y deliberados, clusters limpios, silueta clara, contraste funcional. Sin blur, antialias, degradados suaves, ruido pictórico, iluminación fotográfica, contornos semitransparentes, texto, marcas de agua ni escalado interno. PNG RGBA, fondo totalmente transparente salvo que se solicite una capa de escenario.
```

## A. Personajes, enemigos y coleccionables que deben redibujarse

### 1. Bigotes — `bigotes.png`

Referencia conceptual: `assets/bigotes-assets.png`.

```text
Usa la base técnica común. Redibuja a Bigotes, protagonista panadero-buzo, conservando de la referencia adjunta sus rasgos identificables, bigote, equipo submarino y colores principales, pero simplificados como pixel art nativo. Crea un spritesheet exacto de 384×512 px, cuadrícula regular de 8 columnas × 8 filas, cada frame de 48×64 px, sin separación ni padding. Personaje mirando a la derecha; punto de apoyo fijo en el centro inferior; nada puede salir de su celda. Fila 0: idle, 6 frames, respiración/flotación sutil. Fila 1: nado/movimiento, 8 frames. Fila 2: salto/subida, 3 frames. Fila 3: caída/aterrizaje, 4 frames. Fila 4: ataque, 8 frames: dos de anticipación, frames 2–4 de golpe/contacto y tres de recuperación; máxima extensión y destello principal en el frame 3, alcance visible aproximado de 36×30 px delante del cuerpo. Fila 5: daño, 4 frames. Fila 6: derrota, 6 frames. Fila 7: interacción con horno, 4 frames, claramente distinta del ataque. Deja transparentes las celdas no usadas. Mantén volumen, línea de suelo y proporciones constantes.
```

### 2. Rastrero de Salmuera — `brine-crawler.png`

Referencia conceptual: `assets/rastrero-de-salmuera.png`.

```text
Usa la base técnica común. Redibuja al Rastrero de Salmuera como criatura submarina baja, ancha y agresiva; conserva de la referencia adjunta su identidad, ojos o pinzas y paleta, simplificándolos para lectura inmediata. Spritesheet exacto de 640×336 px, 8 columnas × 7 filas, frames de 80×48 px, sin separación ni padding, base fija, mirando a la derecha. Fila 0 idle, 6 frames; fila 1 patrulla, 8; fila 2 alerta, 4, con ojos o pinzas anticipando el peligro; fila 3 ataque, 8, con dos frames de anticipación, 2–3 de contacto y recuperación visible; fila 4 daño, 4; fila 5 aturdimiento, 4; fila 6 derrota, 6. Celdas sobrantes transparentes. Mantén una hurtbox visual compacta compatible con un collider aproximado de 58×30 px.
```

### 3. Levadura de Burbuja — `bubble-yeast.png`

Referencia conceptual: `assets/golden-bubble-yeast.png`.

```text
Usa la base técnica común. Redibuja la Levadura de Burbuja como coleccionable submarino dorado, cálido, apetecible y claramente benéfico; conserva la identidad de la referencia adjunta. Spritesheet exacto de 384×144 px, 8 columnas × 3 filas, frames de 48×48 px. Fila 0 idle, 6 frames, flotación y burbujas suaves; fila 1 atracción, 6 frames, partículas inclinándose en una dirección como si Bigotes la atrajera; fila 2 recolección, 8 frames, contracción, destello y desaparición hasta terminar totalmente vacío. La silueta central no cambia de tamaño durante idle/atracción. Sin padding; celdas no utilizadas transparentes.
```

### 4. Compuerta de la Marea Térmica — `thermal-gate.png`

Referencia conceptual: `assets/rusty-undewater-portal.png`.

```text
Usa la base técnica común. Redibuja una gran compuerta submarina térmica de metal oxidado, piedra, tuberías y núcleo de luz ámbar, preservando la identidad general de la referencia adjunta. Spritesheet exacto de 1024×480 px, 8 columnas × 3 filas, frames de 128×160 px, base y arco exterior absolutamente inmóviles y alineados. Fila 0 inactiva, 6 frames, fría y con actividad mínima; fila 1 activación, 8 frames, mecanismos encendiendo, aro abriendo y calor creciendo; fila 2 activa, 6 frames, portal abierto con bucle sutil de luz y burbujas. Sin texto, fondo transparente, celdas sobrantes transparentes; sólo se mueven aro, luces, partículas o mecanismos internos.
```

### 5. Escupemasas Abisal — `abyssal-spitter.png`

Referencia conceptual: `assets/escupemasas.png`.

```text
Usa la base técnica común. Redibuja al Escupemasas Abisal, enemigo submarino a distancia con cuerpo oscuro y boca cargada de masa corrupta verde, conservando los rasgos principales de la referencia adjunta. Spritesheet exacto de 640×384 px, 8 columnas × 6 filas, frames de 80×64 px, base fija, criatura mirando a la derecha. Fila 0 idle, 6 frames; fila 1 movimiento/retroceso corto, 6; fila 2 carga, 6, brillo de la boca creciendo hasta un último frame inequívocamente máximo; fila 3 disparo, 8, el proyectil aparece en el primer frame desde el mismo socket de la boca; fila 4 daño/aturdimiento, 4, perdiendo el brillo; fila 5 derrota, 8, desinflado o disolución. Celdas sobrantes transparentes; silueta compatible con collider aproximado de 60×38 px.
```

### 6. Sentinela del Coral Negro — `black-coral-sentinel.png`

Referencia conceptual: `assets/sentinela-del-coral-negro.png`.

```text
Usa la base técnica común. Redibuja al Sentinela del Coral Negro como guardián submarino pesado, alto y acorazado, formado por roca, metal y coral negro con luces corruptas turquesa-verdosas; conserva la identidad de la referencia adjunta. Spritesheet exacto de 768×784 px, 8 columnas × 7 filas, frames de 96×112 px, base constante, mirando a la derecha. Fila 0 dormido/idle, 6 frames; fila 1 alerta, 4; fila 2 caminar, 8; fila 3 ataque básico, 8, con anticipación y contacto claros; fila 4 carga/embestida, 8, con postura inicial muy distinta de caminar; fila 5 daño/aturdimiento, 4, postura abierta y visualmente vulnerable; fila 6 derrota, 8. Celdas sobrantes transparentes; volumen estable y collider visual aproximado de 64×92 px.
```

## B. Tileset y fondos que deben redibujarse

### 7. Tileset modular compartido — `tileset.png`

Referencia conceptual: `assets/tileset.png`.

```text
Usa la base técnica común. Reconstruye el tileset de Pan de Marea como atlas pixel art exacto de 512×512 px sobre cuadrícula visible de producción de 16×16 px, sin dibujar la cuadrícula en el resultado. Incluye terreno autotile de nueve segmentos (centro, cuatro bordes y cuatro esquinas), plataformas finas con extremo izquierdo, centro y extremo derecho, tres variantes de cada superficie, bloques de 32×32 alineados, columnas y paredes, piedra húmeda, madera de panadería hundida y metal oxidado. Coloca por separado rocas, cajas, coral y vegetación decorativa, sin colisión visual implícita. Bordes transitables inequívocos, sin sombras que parezcan plataformas falsas. Cada tile debe cerrar perfectamente con sus vecinos; fondo transparente; sin margen exterior.
```

### 8. Panadería Hundida, fondo lejano — `panaderia-undida-bg-1.png`

```text
Usa la base técnica común, pero crea una capa de fondo opaca exacta de 640×360 px. Parallax lejano de La Panadería Hundida: agua azul petróleo profunda, haces de luz pixelados, partículas escasas y grandes siluetas remotas de ruinas submarinas. Poco contraste y detalle para no competir con el gameplay. Debe repetirse horizontalmente sin costura: los bordes izquierdo y derecho continúan exactamente. Sin plataformas aparentes, objetos interactivos, personajes, texto, blur ni degradados suaves.
```

### 9. Panadería Hundida, fondo medio — `panaderia-undida-bg-2.png`

```text
Usa la base técnica común, pero crea una capa de fondo opaca exacta de 640×360 px. Parallax medio de La Panadería Hundida: arquitectura de panadería sumergida, hornos lejanos, arcos, tuberías, estantes rotos y luz ámbar muy contenida; profundidad media y contraste menor que el primer plano. Composición horizontal repetible sin costura, bordes perfectamente coincidentes. No dibujes suelo jugable, plataformas falsas, coleccionables, puertas activables, personajes ni texto.
```

### 10. Panadería Hundida, fondo cercano — `panaderia-undida-bg-3.png`

```text
Usa la base técnica común, pero crea una capa de fondo con transparencia exacta de 640×360 px. Parallax cercano de La Panadería Hundida: marcos laterales parciales, algas, cuerdas, migas, coral y pequeños elementos de panadería erosionados, con contraste controlado y grandes zonas despejadas para leer personajes y plataformas. Repetición horizontal sin costura. Ninguna forma horizontal debe confundirse con una plataforma sólida; sin objetos interactivos falsos, texto ni cobertura del centro de acción.
```

### 11. Mercado Sumergido, fondo lejano — `mercado-undido-1.png`

```text
Usa la base técnica común, pero crea una capa de fondo opaca exacta de 640×360 px. Parallax lejano del Mercado Sumergido: agua turquesa oscura, cúpulas y torres mercantiles hundidas como siluetas, grandes rayos de luz y sensación de una ciudad submarina vertical. Poco detalle y bajo contraste. Debe repetirse horizontalmente sin costura. Sin plataformas, puestos legibles como interactivos, enemigos, señales, texto ni degradados suaves.
```

### 12. Mercado Sumergido, fondo medio — `mercado-undido-2.png`

```text
Usa la base técnica común, pero crea una capa de fondo opaca exacta de 640×360 px. Parallax medio del Mercado Sumergido: pasarelas lejanas, toldos rotos, arcos comerciales, tuberías de presión y faroles turquesa apagados; arquitectura rica pero subordinada al gameplay. Bordes izquierdo y derecho perfectamente tileables. Evita puertas, reguladores, checkpoints, salidas o puestos que parezcan utilizables; sin personajes ni texto.
```

### 13. Mercado Sumergido, fondo cercano — `mercado-undido-3.png`

```text
Usa la base técnica común, pero crea una capa de fondo con transparencia exacta de 640×360 px. Parallax cercano del Mercado Sumergido: cuerdas, telas desgastadas, algas, marcos parciales, pequeñas burbujas y coral en los bordes, dejando limpia la zona central. Repetición horizontal sin costura y contraste que no oculte enemigos. No incluir plataformas falsas, flechas, letreros, salidas, checkpoints ni señales que sugieran interacción.
```

#### Contrato de producción aplicado a los seis fondos pixel-v1

- Generar cada capa por separado en formato 16:9; usar Bigotes y, para Mercado, Sentinela como anclas de tamaño de píxel y densidad, mientras el PNG legacy funciona sólo como referencia conceptual.
- Procesar a una resolución interna de 320×180 px, paleta cerrada de hasta 24 colores por nivel y ampliación 2× mediante nearest-neighbor hasta 640×360 px.
- Hacer opacas las capas lejana y media. Generar la cercana sobre chroma `#ff00ff`, convertirla a alpha binario y mantener como mínimo el 60 % central libre de elementos.
- Igualar la primera y última columna mediante una banda de costura determinista para repetición horizontal sin salto visible.
- Integrar el resultado a escala 1×, sin `tilePositionY` y con `scrollFactorY = 0`; el fondo debe quedar anclado al viewport de 640×360 aunque el mundo del Nivel II tenga 720 px de alto.
- Evitar superficies horizontales continuas, toldos o arcos alineados que puedan confundirse con suelo, plataformas, puertas u objetos activables.

## C. Combate y efectos P0

### 14. Arco de ataque de Bigotes — `effects/player-attack.png`

```text
Usa la base técnica común. Spritesheet exacto de 192×32 px, 6 columnas × 1 fila, frames de 32×32 px. Efecto corto del ataque de Bigotes mirando a la derecha: frame 0 anticipación casi vacía, frame 1 inicio de energía cálida, frames 2–3 arco/contacto ámbar de máxima lectura, frame 4 fragmentación, frame 5 disipación. El primer destello fuerte coincide con el contacto; silueta compacta y alcance consistente. Fondo totalmente transparente, sin padding, celdas exactas, sin mover el origen entre frames.
```

### 15. Impacto confirmado — `effects/hit-spark.png`

```text
Usa la base técnica común. Spritesheet exacto de 144×24 px, 6 frames horizontales de 24×24 px. Hit spark de ataque confirmado: punto brillante ámbar/blanco que se abre en estrella pixelada, alcanza el máximo en el segundo o tercer frame, expulsa 3–5 fragmentos y desaparece por completo al sexto. Gran contraste y lectura instantánea sobre fondos azules. Fondo transparente, centro fijo, sin humo suave ni píxeles semitransparentes.
```

### 16. Enemigo recibiendo daño — `effects/enemy-hit.png`

```text
Usa la base técnica común. Spritesheet exacto de 144×24 px, 6 frames horizontales de 24×24 px. Efecto genérico de daño enemigo: flash turquesa pálido y pequeños fragmentos oscuros/coralinos que estallan desde un centro fijo y se extinguen. Debe distinguirse del hit spark ámbar del jugador y funcionar encima de Rastrero, Escupemasas y Sentinela. Fondo transparente, sin padding, sin blur, último frame completamente vacío.
```

### 17. Icono de ataque — `ui/icon-attack.png`

```text
Usa la base técnica común. Icono pixel art exacto de 24×24 px para HUD/tutorial: golpe corto de Bigotes representado por un guante, utensilio o arco de energía ámbar apuntando a la derecha. Silueta reconocible a tamaño real, máximo 5–7 colores, contorno oscuro consistente, fondo transparente. Sin letras, teclas, texto, marco ornamental ni sombras suaves.
```

### 18. Proyectil de Masa Corrupta — `enemies/corrupted-dough-projectile.png`

```text
Usa la base técnica común. Spritesheet exacto de 144×72 px, cuadrícula de 6 columnas × 3 filas, frames de 24×24 px. Proyectil orgánico de masa corrupta verde emitido por el Escupemasas. Fila 0 vuelo en loop, 6 frames, núcleo estable y rotación/pulsación; fila 1 impacto, 6 frames, aplastamiento y salpicadura; fila 2 disipación, 6 frames, fragmentos que desaparecen, último frame vacío. Dirección visual hacia la derecha, centro constante, fondo transparente, sin que ningún fragmento salga de la celda.
```

## D. Objetos funcionales P0

### 19. Horno térmico — `environment/oven.png`

```text
Usa la base técnica común. Spritesheet exacto de 384×80 px, 4 frames horizontales de 96×80 px. Horno artesanal submarino construido con hierro oxidado, cobre, piedra y tuberías, base fija. Estado 1 apagado y frío; estado 2 disponible con luz ámbar invitante; estado 3 horneando con cámara encendida y burbujas/calor contenidos; estado 4 completo con señal visual clara de pan listo. Fondo transparente, sin texto, sin piezas fuera de la celda; la silueta exterior no cambia entre estados.
```

### 20. Respiradero de oxígeno — `environment/oxygen-vent.png`

```text
Usa la base técnica común. Spritesheet exacto de 192×32 px, 4 frames horizontales de 48×32 px. Respiradero bajo de metal envejecido anclado al suelo: primer frame inactivo, tres frames de expulsión cíclica de burbujas de oxígeno turquesa claro. Base mecánica totalmente inmóvil, burbujas contenidas en la celda, salida visible y no confundible con peligro. Fondo transparente, sin texto ni blur.
```

### 21. Pan Térmico de mundo — `items/thermal-bread.png`

```text
Usa la base técnica común. Spritesheet exacto de 128×32 px, 4 frames horizontales de 32×32 px. Pequeño Pan Térmico mágico, hogaza artesanal dorada con núcleo o greña ámbar cálida; loop de brillo sutil sin cambiar el tamaño de la hogaza. Debe leerse como recompensa benéfica y objeto importante. Fondo transparente, punto de apoyo constante, máximo 8 colores, sin fuego realista ni halo suave.
```

### 22. Regulador de presión — `environment/pressure-regulator.png`

```text
Usa la base técnica común. Spritesheet exacto de 144×64 px, 3 frames horizontales de 48×64 px. Regulador vertical submarino de bronce verdoso y metal oscuro, con válvula circular y núcleo turquesa. Estado 1 inactivo/frío; estado 2 activándose con aguja o válvula girada y luz creciente; estado 3 activo con lectura luminosa estable. Base, cuerpo y pivote alineados; sin texto ni números; fondo transparente.
```

### 23. Estación de Pan de Presión — `environment/pressure-station.png`

```text
Usa la base técnica común. Spritesheet exacto de 384×96 px, 4 frames horizontales de 96×96 px. Estación/horno de presión del Mercado Sumergido, robusta, cuadrada, con cámara circular, tuberías, manómetro abstracto y luz turquesa. Estados: bloqueada, disponible, horneando bajo presión y completa. La silueta exterior y la base permanecen fijas; los cambios se concentran en luces, cámara y mecanismos. Fondo transparente, sin texto, números ni indicadores ambiguos.
```

### 24. Pan de Presión de mundo — `items/pressure-bread.png`

```text
Usa la base técnica común. Spritesheet exacto de 128×32 px, 4 frames horizontales de 32×32 px. Pan de Presión mágico: hogaza compacta con bandas o greña turquesa, detalles de burbujas comprimidas y brillo frío, claramente diferente del Pan Térmico ámbar. Loop de brillo sin alterar volumen ni apoyo. Fondo transparente, máximo 8 colores, sin halo suave, sin texto.
```

### 25. Salida del Mercado — `environment/market-exit.png`

```text
Usa la base técnica común. Spritesheet exacto de 384×160 px, 3 frames horizontales de 128×160 px. Gran salida submarina del Mercado: arco industrial-comercial de piedra, metal oxidado y tuberías de presión. Estado 1 cerrada y oscura; estado 2 activándose con cierres liberándose y energía turquesa ascendente; estado 3 abierta con paso negro legible y borde iluminado. Base y arco exterior fijos, sin texto, flechas ni señalética; fondo transparente.
```

### 26. Checkpoint del Mercado — `environment/market-checkpoint.png`

```text
Usa la base técnica común. Spritesheet exacto de 144×80 px, 3 frames horizontales de 48×80 px. Baliza/checkpoint submarino del Mercado, poste de metal envejecido con cristal o bandera luminosa. Estados: inactivo, activación y activo. Silueta vertical compacta, base fija; en activo debe verse seguro y restaurador mediante turquesa claro, no como peligro. Fondo transparente, sin texto, celdas uniformes.
```

### 27. Puestos modulares del Mercado — `environment/market-stall.png`

```text
Usa la base técnica común. Spritesheet exacto de 640×96 px, 5 variantes horizontales de 128×96 px. Cinco puestos/coberturas modulares del Mercado Sumergido con la misma huella y puntos de unión: toldo roto, madera, metal, cuerdas, estantes, cajas y algas; variaciones de silueta controladas y paleta compartida. Deben funcionar como decoración o cobertura, sin puertas, luces o símbolos que sugieran interacción. Fondo transparente, bases alineadas, ningún elemento sale de su celda.
```

### 28. Coral negro peligroso — `environment/black-coral-hazard.png`

```text
Usa la base técnica común. Spritesheet exacto de 256×32 px, 4 variantes horizontales de 64×32 px. Cuatro formaciones de coral negro afilado, bajo y claramente dañino, con pequeños núcleos corruptos verde-turquesa. Todas comparten una base de 64 px y zona de peligro visual coherente; contorno puntiagudo, lectura inmediata, sin parecer plataforma. Fondo transparente, bases alineadas, sin partículas fuera de la celda.
```

## E. UI y efectos P1

### 29. Icono de salud — `ui/icon-health.png`

```text
Usa la base técnica común. Icono pixel art exacto de 24×24 px para salud: corazón o pequeña hogaza-corazón cálida vinculada a Bigotes, roja/coral con brillo crema, silueta inequívoca a tamaño real. Máximo 6 colores, contorno oscuro, fondo transparente; sin texto, marco, números ni degradados.
```

### 30. Icono de oxígeno — `ui/icon-oxygen.png`

```text
Usa la base técnica común. Icono pixel art exacto de 24×24 px para oxígeno: burbuja grande o tanque/burbuja turquesa clara, distinguible del icono de Levadura. Silueta simple, máximo 6 colores, brillo en clusters duros, contorno oscuro y fondo transparente. Sin texto, porcentajes, marco ni transparencia suave.
```

### 31. Icono de levadura — `ui/icon-yeast.png`

```text
Usa la base técnica común. Icono pixel art exacto de 24×24 px para inventario de Levadura de Burbuja: orbe/hongo de levadura dorada dentro de una burbuja turquesa, basado en el coleccionable pero simplificado. Máximo 7 colores, alto contraste, contorno oscuro, fondo transparente; sin texto ni números.
```

### 32. Icono de Pan Térmico — `ui/icon-thermal-bread.png`

```text
Usa la base técnica común. Icono pixel art exacto de 24×24 px: Pan Térmico, hogaza dorada con greña ámbar/naranja luminosa, versión simplificada y fiel al objeto de mundo. Debe diferenciarse del Pan de Presión incluso en visión periférica. Fondo transparente, contorno oscuro, máximo 7 colores, sin texto ni marco.
```

### 33. Icono de Pan de Presión — `ui/icon-pressure-bread.png`

```text
Usa la base técnica común. Icono pixel art exacto de 24×24 px: Pan de Presión compacto, hogaza crema con bandas o greña turquesa y pequeña burbuja comprimida, versión simplificada del objeto de mundo. Diferente del Pan Térmico ámbar. Fondo transparente, máximo 7 colores, contorno oscuro, sin texto ni marco.
```

### 34. Icono de regulador — `ui/icon-regulator.png`

```text
Usa la base técnica común. Icono pixel art exacto de 24×24 px para progreso del Mercado: válvula circular/manómetro abstracto de bronce verdoso con centro turquesa activo. Reconocible a tamaño real y fiel al regulador de mundo. Fondo transparente, máximo 7 colores, sin agujas diminutas ilegibles, texto, números ni marco.
```

### 35. Icono de checkpoint — `ui/icon-checkpoint.png`

```text
Usa la base técnica común. Icono pixel art exacto de 24×24 px: baliza o cristal de checkpoint activo, turquesa claro con base metálica oscura y sensación segura. Silueta distinta de oxígeno y regulador. Fondo transparente, máximo 7 colores, sin texto, letras, marco ni halo suave.
```

### 36. Indicador de interacción — `ui/icon-interact.png`

```text
Usa la base técnica común. Icono pixel art exacto de 16×16 px para interacción contextual: mano/guante simple tocando un pequeño destello o botón, legible sin incluir la letra E para permitir remapeo y traducción. Blanco crema y ámbar sobre contorno oscuro, fondo transparente, máximo 5 colores, sin marco ni texto.
```

### 37. Recolección de levadura — `effects/yeast-collect.png`

```text
Usa la base técnica común. Spritesheet exacto de 192×32 px, 6 frames horizontales de 32×32 px. Efecto de recolección benéfico: burbuja dorada se contrae, estalla en un aro cálido y libera 4–6 motas hacia arriba; último frame totalmente vacío. Centro constante, fondo transparente, fuerte lectura sobre azul, sin blur ni partículas fuera de la celda.
```

### 38. Variantes de burbujas de oxígeno — `effects/oxygen-bubbles.png`

```text
Usa la base técnica común. Tira exacta de 80×16 px con 5 celdas de 16×16 px. Cinco variantes independientes de burbujas de oxígeno: tamaños, pares y pequeños grupos, todas turquesa pálido/blanco, clusters duros y siluetas limpias. Cada variante centrada y contenida en su celda; fondo transparente; sin degradados, blur ni texto.
```

### 39. Explosión cálida — `effects/warm-burst.png`

```text
Usa la base técnica común. Spritesheet exacto de 288×48 px, 6 frames horizontales de 48×48 px. Explosión cálida no dañina para horno y compuerta térmica: núcleo ámbar, aro naranja pixelado, vapor y burbujas luminosas; expansión rápida, máximo en frames 2–3 y disipación completa al final. Centro fijo, fondo transparente, sin fuego realista, blur ni partículas fuera de la celda.
```

### 40. Explosión de presión — `effects/pressure-burst.png`

```text
Usa la base técnica común. Spritesheet exacto de 288×48 px, 6 frames horizontales de 48×48 px. Pulso de presión para reguladores y salida del Mercado: anillo turquesa comprimido que se expande, líneas radiales cortas y burbujas desplazadas; energético pero no dañino. Máximo en frames 2–3, último frame vacío, centro fijo, fondo transparente, sin blur ni fragmentos fuera de la celda.
```

### 41. Viñeta de alerta de oxígeno — `ui/oxygen-vignette.png`

```text
Crea un overlay pixel art exacto de 640×360 px con fondo central transparente. Alerta de oxígeno bajo formada únicamente en los bordes: marco irregular azul petróleo/cian oscuro, pequeñas burbujas escasas, condensación pixelada y esquinas ligeramente más densas. Deja al menos el 70 % central completamente transparente para no ocultar el gameplay. Sin texto, iconos, degradados suaves, blur, ruido fino ni semitransparencias accidentales; usa pocos niveles de alpha deliberados y bordes en clusters grandes.
```

## Checklist posterior a cada generación

- [ ] Dimensiones exactas del archivo y de cada celda.
- [ ] Número, orden y orientación de frames correctos.
- [ ] Fondo transparente real donde corresponde.
- [ ] Sin padding exterior ni separación entre frames.
- [ ] Pivote/base constante y sin vibración de silueta.
- [ ] Celdas no usadas totalmente transparentes.
- [ ] Sin blur, antialias ni píxeles semitransparentes accidentales.
- [ ] Lectura clara al 100 % dentro de una captura de 640×360 px.
- [ ] Paleta coherente entre objetos del mismo nivel.
- [ ] Archivo editable, autoría y licencia conservados fuera de `assets/`.

## Nota sobre generación con IA

Sí, estos pixel arts se pueden generar con una herramienta de imagen. Para obtener assets listos para el juego, el flujo recomendado es: generar una propuesta visual, elegir y corregir un frame maestro, producir las animaciones por filas, limpiar la cuadrícula manualmente y validar la hoja dentro de Phaser. La generación puede acelerar concepto, paleta y poses, pero no debe asumirse que garantiza por sí sola una cuadrícula o continuidad frame a frame perfectas.
