# Encargo para Claude: Escupemasas inactivo y orientación del Sentinela

> Actualización: el Escupemasas fue corregido en `51fda2d`. La causa era pasar un objeto simple a `Phaser.Geom.Rectangle.Overlaps()`, lo que mantenía falsa la guarda `nearCamera`.
>
> Actualización 2: la orientación del Sentinela quedó corregida en la rama `fix/sentinel-facing`. Se centralizó la mirada en `BlackCoralSentinel.updateFacing()` (`setFlipX(this.direction < 0)`, invirtiendo la condición previa) y se llama tras calcular `direction`, antes de cualquier retorno, por lo que ahora se actualiza en todos los estados (incluidos `walk`, `basicAttack` y `chargeAttack`). Verificado en juego con Chromium headless: con Bigotes a la izquierda del jefe `flipX=true` (mira a la izquierda) y a su derecha `flipX=false` (mira a la derecha), incluso durante la carga. **Ambos defectos quedan resueltos.**

## Contexto

Trabaja sobre la rama `feat/levels` de **Pan de Marea**. No modifiques ni elimines los archivos no rastreados relacionados con recetas especiales.

El juego usa React, Phaser 3 y JavaScript. Los niveles comparten `BaseLevelScene`; el Tutorial usa `level-one` y Nivel I usa `level-two` como IDs internos.

Hay dos defectos de gameplay pendientes:

1. El Escupemasas entra en escena, pero en juego parece no atacar ni disparar Masa Corrupta.
2. El Sentinela del Coral Negro se desplaza hacia la izquierda, pero visualmente permanece mirando a la derecha.

No des por resuelto el primer defecto sólo porque exista el método `fireProjectile`: el usuario confirmó que el problema persiste después de retirar los soportes verticales de las plataformas.

## Defecto 1: el Escupemasas no dispara

### Reproducción

Tutorial:

1. Ejecuta `npm run dev`.
2. Abre `/?review-level=level-one&review-x=2050`.
3. Inicia el Tutorial y acércate al Escupemasas de `ranged-perch`, ubicado en `x = 2350`.
4. Permanece a una distancia horizontal aproximada de 70 a 280 px, primero a su izquierda y luego a su derecha.

Nivel I:

1. Abre `/?unlock-all&review-level=level-two&review-x=1450`.
2. Inicia Nivel I y acércate al primer Escupemasas, ubicado en `x = 1600`.

Resultado actual informado: el enemigo parece inactivo; no se aprecia un ciclo confiable de carga, disparo, proyectil y daño.

Resultado esperado: al detectar a Bigotes debe orientarse hacia él, reproducir `spitter-charge`, pasar a `spitter-attack`, crear una Masa Corrupta visible, aplicar daño al contacto y repetir el ciclo respetando el cooldown. Una cobertura sólida debe bloquear el disparo; una banqueta de una sola dirección no debe bloquearlo.

### Archivos implicados

- `src/game/entities/AbyssalSpitter.js`
- `src/game/scenes/BaseLevelScene.js`
- `src/game/projectiles/CorruptedDoughProjectile.js`
- `src/game/constants.js`
- `src/game/data/levelOneData.js`
- `src/game/data/levelTwoData.js`
- `src/game/data/animationData.js`
- `src/game/assetManifest.js`

### Flujo actual que debe auditarse

`AbyssalSpitter.update()` exige simultáneamente:

- estar dentro de la cámara expandida;
- tener distancia horizontal menor o igual a `SPITTER.activationDistance` (520);
- estar entre `SPITTER.minimumAttackRange` (70) y `SPITTER.attackRange` (280);
- haber superado `nextAttackAt`;
- obtener `true` de `BaseLevelScene.hasLineOfSight()`.

Si todas las guardas pasan, cambia a `charge`. Al terminar 650 ms cambia a `rangedAttack` y llama al callback de `BaseLevelScene.fireProjectile()`.

El intento anterior (`88f61fd`) convirtió las banquetas en superficies de una sola dirección, eliminó sus bloques verticales de `solidObstacles` y evitó que los proyectiles chocaran con `walkableSurfaces`. El síntoma continúa, así que hay que verificar el flujo completo en runtime.

### Riesgos e hipótesis concretas

1. No existe trazabilidad para saber cuál de las guardas impide atacar. Instrumenta temporalmente `nearCamera`, distancia, rango, cooldown, línea de visión, estado y resultado del callback.
2. `SPITTER.detectionRange` está definido, pero no se usa. Confirma si el diseño pretendía usarlo y evita mantener rangos contradictorios.
3. El resultado booleano de `fireProjectile()` se ignora. Si el pool no entrega un proyectil, el enemigo avanza igualmente a recuperación y aparenta atacar sin disparar. Haz explícito el fallo y permite un reintento controlado.
4. `createEnemies()` se ejecuta antes de `createProjectiles()`. El callback debería dispararse más tarde, pero conviene eliminar esta ambigüedad inicializando el pool antes de crear enemigos.
5. Confirma que `this.projectiles.get(...)` devuelve una instancia activa de `CorruptedDoughProjectile`, que `fire()` llama `enableBody`, que la velocidad no es cero y que el sprite queda visible.
6. Comprueba por separado transición de estado, animación y proyectil. Una animación ausente no debe impedir el disparo, y un proyectil creado no debe quedar oculto detrás del enemigo.
7. La hoja pixel art del Escupemasas está dibujada mirando a la derecha. La expresión actual `setFlipX(this.direction > 0)` invierte esa convención: corrígela y alinea también el offset de salida con la boca visible.
8. `hasLineOfSight()` debe considerar sólo cobertura sólida real. Registra qué obstáculo bloquea el segmento para evitar falsos positivos.

No soluciones el problema eliminando alcance, cooldown, cobertura o daño. Conserva el comportamiento telegráfico de carga y recuperación.

## Defecto 2: el Sentinela no mira a la izquierda

### Reproducción

1. Abre `/?unlock-all&review-level=level-two&review-x=7750`.
2. Inicia Nivel I y activa al Sentinela cerca de `x = 8100`.
3. Cruza de un lado al otro para obligarlo a caminar y cargar en ambas direcciones.

Resultado actual: cuando se mueve hacia la izquierda, su sprite sigue mirando a la derecha.

Resultado esperado: debe mirar a la izquierda al caminar, cargar o atacar hacia la izquierda, y mirar a la derecha al hacerlo hacia la derecha.

### Diagnóstico visual y de código

La hoja `assets/pixel-art/v1/characters/black-coral-sentinel.png` está dibujada mirando a la derecha. En `BlackCoralSentinel.update()` se usa:

```js
this.setFlipX(this.direction > 0);
```

Para un asset base que mira a la derecha, la condición esperada es invertir cuando `direction < 0`. Además, la llamada actual ocurre después de varios retornos tempranos, por lo que no se actualiza durante `dormant`, `alert`, `basicAttack`, `chargeAttack`, `hurt` o `stunned`.

Centraliza la orientación en un método, por ejemplo `updateFacing()`, y ejecútalo inmediatamente después de calcular `direction`, antes de cualquier retorno. Verifica especialmente `walk`, `basicAttack` y `chargeAttack`. No cambies la velocidad o dirección física sólo para corregir el sprite.

### Archivos implicados

- `src/game/entities/BlackCoralSentinel.js`
- `src/game/data/animationData.js`
- `src/game/assetManifest.js`
- `assets/pixel-art/v1/characters/black-coral-sentinel.png`

## Criterios de aceptación

- El Escupemasas dispara repetidamente desde ambos lados dentro del rango configurado.
- La carga y el ataque son visibles antes de cada Masa Corrupta.
- El proyectil se mueve, permanece visible, daña a Bigotes y se desactiva al impactar o expirar.
- Las coberturas sólidas detienen el proyectil; las banquetas flotantes no.
- Los cinco Escupemasas de Nivel I y el del Tutorial comparten el arreglo.
- El Sentinela mira en la dirección de su movimiento y ataque durante todos sus estados relevantes.
- No se alteran progresión, checkpoints, recetas, geometría de niveles ni assets originales.
- Retira cualquier log o visualización temporal antes de entregar.

Al finalizar, documenta la causa raíz comprobada, los archivos modificados y cómo se validó cada escenario. No afirmes que funciona basándote únicamente en lectura estática: verifica el comportamiento dentro del juego.
