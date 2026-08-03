# Implementación para Claude: sistema de recetas y panes especiales

## 1. Objetivo cerrado

Implementar un menú de horno y un inventario de panes especiales sobre la arquitectura actual, sin reconstruir las escenas ni reemplazar los sistemas de misión que ya funcionan.

El alcance de esta versión es:

- conservar Pan Térmico y Pan de Presión como recetas de objetivo y requisitos de sus salidas actuales;
- añadir Baguette Torpedo como única receta especial desbloqueada y utilizable;
- mostrar dos recetas especiales futuras bloqueadas, sin nombre ni comportamiento definitivo;
- abrir una interfaz React al interactuar con cualquier horno;
- bloquear movimiento, ataque y simulación mientras el menú esté abierto;
- permitir equipar y disparar Baguette Torpedo fuera del horno;
- utilizar los assets y SFX entregados en esta rama;
- mantener LevelOneScene y LevelTwoScene como configuraciones ligeras de BaseLevelScene.

No implementar todavía recuperación de oxígeno mediante pan, escudo, música, gamepad ni recetas desbloqueables. La persistencia en `localStorage` (ajustes y progresión de desbloqueo) ya está implementada; las dos recetas futuras son sólo una promesa visual.

## 2. Estado actual que debe preservarse

- El refactor en curso `BaseLevelScene` centraliza inventario de Levadura, horno, enemigos, proyectiles enemigos, checkpoint, salida y snapshots. Si ese refactor todavía no está integrado al comenzar la implementación, aplicar los mismos hooks en LevelOneScene y LevelTwoScene y migrarlos al base cuando aterrice; no duplicar sistemas puros.
- `PressureRecipeSystem` representa hoy la receta de misión de ambos niveles mediante `hasPressureBread`.
- Pan Térmico cuesta 3 Levaduras; Pan de Presión cuesta 5 y exige 3 reguladores.
- `Player` ya expone `facing`, `setControlsEnabled()`, `finishAttack()` y sus teclas.
- Todos los enemigos reciben daño mediante `enemy.takeDamage(amount, sourceX)`; la Baguette debe usar exactamente esa API.
- `AudioManager` ya reproduce claves declaradas en `AUDIO_MANIFEST`.
- React recibe el estado mediante `game:snapshot` y envía comandos por `eventBus`.

## 3. Decisiones de producto y balance

Crear `src/game/data/recipeData.js` como única fuente de balance. No distribuir estos valores por escenas o componentes.

```js
export const SPECIAL_RECIPE_IDS = Object.freeze({
  baguetteTorpedo: 'baguette-torpedo',
  futureOxygen: 'future-oxygen',
  futureShield: 'future-shield',
});

export const SPECIAL_BREAD_RECIPES = Object.freeze({
  'baguette-torpedo': Object.freeze({
    id: 'baguette-torpedo',
    name: 'Baguette Torpedo',
    description: 'Proyectil de pan que causa 2 de daño.',
    unlocked: true,
    cost: 1,
    maxStack: 3,
    icon: '/pixel-art/v1/recipes/icon-baguette-torpedo.png',
    damage: 2,
    speed: 280,
    lifetimeMs: 1400,
    cooldownMs: 650,
    collider: Object.freeze({ width: 36, height: 14, offsetX: 6, offsetY: 5 }),
    spawnOffset: Object.freeze({ x: 30, y: -28 }),
  }),
  'future-oxygen': Object.freeze({
    id: 'future-oxygen', name: 'Receta futura', description: 'Se desbloquea en otro nivel.',
    unlocked: false, cost: null, maxStack: 0,
    icon: '/pixel-art/v1/recipes/icon-future-oxygen.png',
  }),
  'future-shield': Object.freeze({
    id: 'future-shield', name: 'Receta futura', description: 'Se desbloquea en otro nivel.',
    unlocked: false, cost: null, maxStack: 0,
    icon: '/pixel-art/v1/recipes/icon-future-shield.png',
  }),
});

export const SPECIAL_BREAD_INPUT = Object.freeze({ cycle: 'Q', use: 'K' });
export const BAGUETTE_POOL_SIZE = 6;
```

Para que exista Levadura opcional sin poner en riesgo la receta de misión:

- añadir dos Levaduras opcionales a `LEVEL_ONE_DATA`, en rutas secundarias alcanzables;
- conservar las siete Levaduras existentes del Mercado;
- reservar ingredientes para la misión hasta que su pan esté preparado:

```text
reserva = missionRecipe.completed ? 0 : missionRecipe.cost
levadura_gastable = max(0, inventory.availableYeast - reserva)
```

Baguette Torpedo sólo puede elaborarse cuando `levadura_gastable >= 1`. Esta regla impide gastar los ingredientes necesarios para abrir la salida. El total objetivo mostrado en el HUD continúa siendo 3 o 5; las Levaduras adicionales son opcionales.

## 4. Sistemas y contratos

### Inventario especial

Crear `SpecialBreadInventory` como clase pura independiente de Phaser:

- estado: `counts` por receta, `selectedId` y `lastUsedAt`;
- `getCount(id)`, `canAdd(id, amount)`, `add(id, amount)`, `canUse(id, now)`, `use(id, now)`;
- `use()` consume una unidad sólo si hay existencia y terminó el cooldown;
- `cycle(direction)` sólo recorre recetas desbloqueadas; con una sola receta mantiene Baguette seleccionada;
- `snapshot()` y `restore()` para checkpoint/reinicio;
- nunca aceptar cantidades negativas, recetas desconocidas ni superar `maxStack`.

Crear `SpecialRecipeSystem` como clase pura:

- recibe `SPECIAL_BREAD_RECIPES`;
- `getSpendableYeast(inventory, missionRecipe)` aplica la reserva;
- `canCraft(recipeId, inventory, missionRecipe, specialInventory)` devuelve `{ok, reason}`;
- razones estables: `locked`, `unknown`, `ingredients`, `full`;
- `beginCraft()` consume Levadura de forma atómica sólo si `canCraft` es válido;
- `completeCraft()` añade exactamente una unidad;
- si el horno no puede iniciar su animación después del consumo, reembolsar la Levadura.

### Menú del horno

Al presionar E cerca del horno:

1. `BaseLevelScene.openRecipeMenu()` fija `status = 'crafting'`.
2. Finaliza cualquier ataque, pone velocidad/aceleración en cero y deshabilita controles.
3. Reproduce `recipe-open`, emite snapshot y pausa la escena con `this.scene.pause()`.
4. React muestra `RecipeMenu`; no usar un canvas o PNG para textos y botones.

El menú contiene:

- encabezado “Horno submarino”;
- Levadura total, disponible y reservada para el objetivo;
- bloque “Pedido del nivel” para Pan Térmico o Pan de Presión, conservando requisitos actuales;
- bloque “Panes especiales” con tres tarjetas: Baguette Torpedo, futura de oxígeno y futura defensiva;
- cantidad preparada y límite en la tarjeta de Baguette;
- botón “Elaborar” desactivado cuando falten ingredientes o el inventario esté lleno;
- tarjetas futuras enfocables con `aria-disabled="true"`; al activarlas reproducen `recipe-locked` y muestran “Se desbloquea en otro nivel”, sin cambiar selección;
- botón “Cerrar” y cierre con Escape.

Comandos React → Phaser:

```text
command:recipe-craft  { recipeId }
command:recipe-close  undefined
command:bread-cycle   { direction: 1 | -1 }
command:bread-use     undefined
```

`PhaserGame` debe registrar y limpiar estos listeners igual que los comandos existentes. Los métodos llamados deben funcionar aunque la escena esté pausada.

Al confirmar una receta válida:

1. consumir ingredientes con `beginCraft`;
2. reproducir `recipe-craft`;
3. cerrar el overlay y reanudar la escena;
4. mantener controles bloqueados durante `oven.bake()`;
5. ejecutar `completeCraft`, mostrar el item 64×32 sobre el horno durante 700 ms y reproducir `warm-burst-effect`;
6. actualizar snapshot y devolver controles.

La receta de misión conserva el flujo actual `PressureRecipeSystem`; sólo se inicia desde el nuevo menú. No cambiar su consumo en compuerta/salida.

### Snapshot público

Extender `getSnapshot()` con estructuras serializables:

```js
recipeMenu: {
  open: boolean,
  ingredients: { available, reserved, spendable },
  mission: { id, name, cost, canCraft, completed, requirements },
  specials: [
    { id, name, description, icon, unlocked, cost, count, maxStack, canCraft, reason },
  ],
  feedback: null | 'locked' | 'ingredients' | 'full' | 'crafted',
},
specialBread: {
  selectedId: 'baguette-torpedo',
  slots: [{ id, icon, unlocked, count }],
  cooldownRemainingMs: number,
  unavailablePulse: boolean,
  shieldActive: false,
},
```

Incluir el inventario especial y selección en checkpoints. Reiniciar debe limpiar el inventario si no se restaura un checkpoint.

### Selección y uso

- Añadir Q (`cycleBread`) y K (`useBread`) a `Player.keys` y a `addCapture`.
- Procesar las teclas sólo con `status === 'playing'`, controles activos y jugador vivo.
- Q reproduce `bread-equip` y actualiza HUD; con una sola receta no cambia de id.
- K solicita `BaseLevelScene.useSelectedBread()`.
- Si no hay unidades, cooldown activo o pool lleno, no consumir; reproducir `bread-unavailable` y activar un pulso visual de 500 ms.
- Consumir la unidad únicamente después de obtener un proyectil libre del pool.

### Baguette Torpedo

Crear `BaguetteTorpedoProjectile` reutilizando el patrón de `CorruptedDoughProjectile`:

- `Phaser.Physics.Arcade.Sprite`, gravedad desactivada, profundidad 17;
- textura `baguette-torpedo-projectile`, frames 48×24, animación de 6 frames a 12 FPS en loop;
- pool de 6 con `runChildUpdate: true`;
- spawn relativo a `player.facing`; `flipX` al disparar hacia la izquierda;
- velocidad exclusivamente horizontal de 280 px/s;
- collider 36×14 px con offsets de configuración;
- desactivar al superar 1400 ms, salir del mundo, tocar `walkableSurfaces`/`solidObstacles` o impactar enemigo;
- en overlap con `this.enemies`, llamar `enemy.takeDamage(2, projectile.x)`;
- crear `baguette-impact` sólo cuando `takeDamage()` confirme el golpe;
- desactivar incluso si el enemigo rechaza daño por estar en hurt/stun, evitando impactos repetidos;
- reproducir `baguette-launch` al disparar y `baguette-impact` al impacto confirmado.

No crear otro sistema de salud, estados de enemigo ni estadísticas. Las derrotas continúan pasando por `onEnemyDefeated` porque el callback ya pertenece a cada enemigo.

## 5. Interfaz durante gameplay

Extender HUD con una barra de tres slots bajo el inventario actual:

- slot 1: icono Baguette, cantidad y borde seleccionado;
- slots 2 y 3: iconos futuros desaturados con `icon-lock.png` superpuesto;
- texto corto `Q Cambiar · K Usar`;
- overlay de cooldown sobre el slot seleccionado usando CSS, no un PNG adicional;
- pulso rojo/crema cuando no exista cantidad;
- `shieldActive` permanece `false`; no dibujar escudo todavía.

Usar HTML semántico, contraste AA, foco visible y `aria-live="polite"` sólo para feedback de elaboración/uso. No insertar texto en imágenes.

## 6. Assets entregados

### PNG finales

| Ruta | Contrato |
|---|---|
| `assets/pixel-art/v1/recipes/baguette-torpedo-item.png` | 64×32, preview/item |
| `assets/pixel-art/v1/recipes/baguette-torpedo-projectile.png` | 288×24, 6 frames de 48×24 |
| `assets/pixel-art/v1/recipes/baguette-impact.png` | 288×48, 6 frames de 48×48 |
| `assets/pixel-art/v1/recipes/recipe-icons.png` | 192×48, 4 celdas de 48×48 |
| `assets/pixel-art/v1/recipes/icon-baguette-torpedo.png` | icono React 48×48 |
| `assets/pixel-art/v1/recipes/icon-future-oxygen.png` | icono bloqueado 48×48 |
| `assets/pixel-art/v1/recipes/icon-future-shield.png` | icono bloqueado 48×48 |
| `assets/pixel-art/v1/recipes/icon-lock.png` | candado 48×48 |

Registrar en `assetRegistry`, `FRAME_MANIFEST` y `animationData`:

```text
baguette-torpedo-projectile: 6 frames 48x24, 12 FPS, repeat -1
baguette-impact: 6 frames 48x48, 18 FPS, repeat 0
```

Los iconos y el item pueden consumirse desde React mediante ruta pública; no necesitan frames Phaser salvo que se reutilicen dentro del canvas.

Fuentes ImageGen con chroma se conservan en `art-source/pixel-art/v1/recipes/`. Reconstrucción:

```sh
npm run recipes:assets:process
npm run recipes:assets:validate
```

### SFX listos

| Clave | Archivo | Uso |
|---|---|---|
| `recipe-open` | `audio/sfx/recipe-open.wav` | abrir horno |
| `recipe-close` | `audio/sfx/recipe-close.wav` | cerrar horno |
| `recipe-select` | `audio/sfx/recipe-select.wav` | foco/cambio válido |
| `recipe-locked` | `audio/sfx/recipe-locked.wav` | receta futura |
| `recipe-craft` | `audio/sfx/recipe-craft.wav` | elaboración especial |
| `bread-equip` | `audio/sfx/bread-equip.wav` | seleccionar pan |
| `bread-unavailable` | `audio/sfx/bread-unavailable.wav` | cero unidades/cooldown |
| `baguette-launch` | `audio/sfx/baguette-launch.wav` | disparo |
| `baguette-impact` | `audio/sfx/baguette-impact.wav` | impacto confirmado |

Estas claves ya están declaradas en `AUDIO_MANIFEST` y se generan con `npm run audio:generate`. No crear archivos alternos ni renombrarlas.

## 7. Pruebas obligatorias

### Unitarias

- inventario inicia en cero, respeta maxStack, consume una unidad y restaura snapshot;
- recetas bloqueadas nunca consumen Levadura;
- ingredientes insuficientes e inventario lleno no mutan estado;
- reserva de 3/5 Levaduras impide bloquear la receta de misión;
- elaborar Baguette consume exactamente 1 y añade exactamente 1;
- cooldown impide usos simultáneos;
- pool lleno y cantidad cero no consumen;
- checkpoint conserva cantidades y selección;
- Pan Térmico y Pan de Presión siguen desbloqueando sus salidas.

### Integración y navegador

- E abre el menú cerca del horno y no lo abre lejos;
- Bigotes, enemigos, oxígeno y ataques quedan congelados mientras el menú está visible;
- Escape/cerrar reanudan exactamente una vez, sin duplicar listeners;
- tarjetas futuras se ven bloqueadas y dan feedback sin seleccionarse;
- elaboración actualiza Levadura, inventario, HUD, horno, visual y SFX;
- Q/K funcionan a izquierda y derecha;
- impacto coincide con collider y causa 2 de daño mediante `takeDamage`;
- proyectil desaparece contra enemigo, suelo, plataforma, obstáculo y por lifetime;
- no existe vibración de pivote en los 6 frames;
- mute y pausa detienen SFX;
- ambos niveles siguen siendo completables y no pierden sus recetas de misión.

Ejecutar al cierre:

```sh
npm run recipes:assets:validate
npm run audio:validate
npm run art:validate
npm test
npm run build
git diff --check
```

## 8. Orden de implementación y commits

1. Datos centrales, inventario especial y pruebas puras.
2. Menú React, contratos EventBus y bloqueo/reanudación de escena.
3. Registro de assets, animaciones, pool y colisiones de Baguette.
4. HUD, checkpoint, feedback, QA de ambos niveles y documentación.

Separar commits semánticos por sistema/UI/gameplay. Registrar el prompt y los SHAs reales en `PROMPTS.md`. No hacer push sin autorización expresa.

## 9. Prompts de producción visual utilizados

- Maestro: una baguette dorada en vista lateral, forma de torpedo submarino cartoon, tres cortes, aletas azul marino y cápsula cian de Levadura, outline de un píxel, 12–16 colores y chroma `#ff00ff`.
- Vuelo: seis poses del mismo maestro en una fila, escala y pivote constantes, inclinación mínima, compresión, burbujas y recuperación.
- Iconos: Baguette disponible, silueta futura de oxígeno, silueta futura defensiva y candado; cuatro celdas sin texto.
- Impacto: seis fases desde contacto hasta disipación, migas doradas, estrella compacta y dos burbujas cian, máximo ocho colores.

Todos los prompts exigieron pixel art nativo, alpha derivado de chroma plano, ausencia de blur/texto/sombras y consistencia con Bigotes, Levadura y efectos oficiales.
