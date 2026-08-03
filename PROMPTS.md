# Registro de prompts del proyecto

Este archivo conserva las solicitudes del usuario relacionadas con **Pan de Marea**, agrupadas por feature. Es acumulativo: una corrección posterior no elimina el prompt anterior.

## Convenciones

- Cada entrada incluye fecha, título, prompt, resultado, archivos y commits.
- Los prompts extensos pueden conservarse en un anexo literal y resumirse en su entrada.
- `pendiente (working tree)` significa que el cambio existe localmente pero todavía no tiene commit.
- No se inventan SHAs ni se registran secretos o instrucciones internas del entorno.

## Feature: demo jugable de La Panadería Hundida

### PDM-001 — Crear el primer nivel completo

**Fecha:** 2026-08-02
**Prompt:** solicitud extensa para construir el primer nivel de Pan de Marea con React, Phaser, Vite, menú, HUD, sistemas de juego, entidades, nivel, audio tolerante a ausencias, pruebas y documentación. El texto literal está en el [Anexo A](#anexo-a--prompt-original-de-la-demo).
**Resultado:** aplicación React + Phaser, menú, HUD, nivel, entidades, sistemas, pruebas y documentación inicial.
**Archivos:** `package.json`, `vite.config.js`, `src/`, `README.md`, `assets/`.
**Commits:**

- `96d3625 chore(project): initialize Vite workspace and game assets`
- `df9b5be feat(ui): add React menu HUD and game overlays`
- `9cd18a9 feat(game): implement La Panaderia Hundida gameplay`
- `c13be44 docs: add setup asset and extension guide`

### PDM-002 — Ejecutar el plan técnico de la demo

**Fecha:** 2026-08-02
**Prompt:** “PLEASE IMPLEMENT THIS PLAN: Demo jugable: La Panadería Hundida”. El plan concretó versiones, Node >=20.19, arquitectura modular, mundo de 4,800×360, contratos React–Phaser, posiciones, movimiento, combate, oxígeno, receta, compuerta, recortes de assets, pruebas y README.
**Resultado:** el plan se implementó y se separó en commits de inicialización, UI, gameplay y documentación.
**Archivos:** todo el proyecto inicial.
**Commits:** `96d3625`, `df9b5be`, `9cd18a9`, `c13be44`.

## Feature: flujo de Git y commits

### PDM-003 — Crear commits semánticos

**Fecha:** 2026-08-02
**Prompt:** “Haz commits de tus cambios (semanticos) porfa”
**Resultado:** la implementación inicial se dividió en cuatro commits semánticos.
**Archivos:** todo el proyecto inicial.
**Commits:** `96d3625`, `df9b5be`, `9cd18a9`, `c13be44`.

### PDM-005 — Diagnosticar por qué gh no permite push

**Fecha:** 2026-08-02
**Prompt:** “porque no puedo pushear con gh? dice que no existe repositorio de git”
**Resultado:** se comprobó que el repositorio local existía, pero Git lo rechazaba por `dubious ownership`; además, el token de `gh` era inválido y no había remoto configurado. No produjo cambios de código.
**Archivos:** ninguno.
**Commits:** no aplica.

## Feature: movimiento, colisiones y navegabilidad

### PDM-004 — Mejorar la estructura funcional del nivel

**Fecha:** 2026-08-02
**Prompt:** revisión completa del movimiento, alcance, plataformas, colliders, capas físicas y ruta principal. El texto literal está en el [Anexo B](#anexo-b--prompt-de-navegabilidad).
**Resultado:** salto variable, control aéreo, coyote time, jump buffer, caída ajustada, ground check, superficies unidireccionales, suelo continuo, plataformas reposicionadas, cálculo de alcance y overlay de diagnóstico.
**Archivos:**

- `src/game/constants.js`
- `src/game/entities/Player.js`
- `src/game/data/levelOneData.js`
- `src/game/scenes/LevelOneScene.js`
- `src/game/systems/JumpReachSystem.js`
- `src/game/systems/MovementDebugOverlay.js`
- `src/game/systems/systems.test.js`
- `README.md`

**Commits:** `f27ac2d feat(level): improve traversal and collision layout`.

## Feature: dirección artística, assets y audio

### PDM-006 — Evaluar assets de 16×16

**Fecha:** 2026-08-02
**Prompt:** “okey, si hago los assets 16x16 se ver[a mejor?”
**Resultado:** se recomendó usar 16×16 como cuadrícula base, no como tamaño universal. Personajes y objetos deben ocupar múltiplos de la cuadrícula y redibujarse para pixel art en vez de reducir automáticamente el arte pictórico.
**Archivos:** ninguno.
**Commits:** no aplica.

### PDM-007 — Documentar assets, sonidos y dimensiones

**Fecha:** 2026-08-02
**Prompt:** “dame un readme con todo lo que haga falta, sonidos, assets, dimenciones, etc”
**Resultado:** se amplió inicialmente `README.md`; PDM-008 corrigió el formato del entregable y trasladó la guía a un archivo independiente.
**Archivos:** `README.md`.
**Commits:** `c69ca41 docs(assets): add production guide for art and audio`.

### PDM-008 — Separar la guía de producción

**Fecha:** 2026-08-02
**Prompt:** “perdo dame un .md nuevo, en el que vengan los assets que hacen faltas, audios, sonidos, etc”
**Resultado:** se restauró el README general y se creó una guía dedicada con prioridades, inventario, dimensiones, hojas, UI, sonidos, mezcla, integración y checklists.
**Archivos:** `GUIA_ASSETS_Y_AUDIO.md`, `README.md`.
**Commits:** `c69ca41 docs(assets): add production guide for art and audio`.

### PDM-017 — Especificar la migración a pixel art y las animaciones

**Fecha:** 2026-08-02
**Prompt:** “Okey, dame un .md con los assets que tengo, los que me faltan y que tengo que modificar para que sea pixel art, con movimientos/animaciones claras, porque ahorita ciertas cosas no funcionan, tambien toma en cuenta el ataque del jugador que creo que no esta funcionando del todo”
**Resultado:** se creó una guía independiente que inventaría los trece PNG actuales, los fallbacks y piezas faltantes, define tamaños y hojas uniformes para cada entidad, estados y fases de animación, reglas de fondos/tiles/UI, orden de producción y cambios de integración. La revisión del ataque documenta el desacople actual entre su animación aproximada de 429 ms y el estado físico que termina a los 200 ms, además de recortes, hitbox, frames activos y una propuesta concreta de corrección.
**Archivos:** `GUIA_PIXEL_ART_Y_ANIMACIONES.md`, `README.md` y `PROMPTS.md`.
**Commits:** `b035ebb docs(art): add pixel-art production workflow`.

### PDM-018 — Crear prompts base para cada pixel art

**Fecha:** 2026-08-02
**Prompt:** “De acuerdo a la guia de pixel art, dame un prompt base para cada pixel art a generar. ascribelo en un .md si quieres (tu puedes gerar el pixelart?)”
**Corrección del usuario:** “No los metas en prompts.md, metelos en pixel_art_prompt.md”.
**Resultado:** se creó un banco independiente con 41 prompts base, uno por cada redibujo o asset P0/P1 de la guía, además de reglas comunes, flujo de uso y checklist de validación. Los prompts artísticos están únicamente en `pixel_art_prompt.md`; este registro conserva sólo la trazabilidad administrativa obligatoria del encargo.
**Archivos:** `pixel_art_prompt.md`, `PROMPTS.md`.
**Commits:** `b035ebb docs(art): add pixel-art production workflow`.

### PDM-019 — Implementar la migración iterativa a pixel art cartoon

**Fecha:** 2026-08-02
**Prompt:** “PLEASE IMPLEMENT THIS PLAN: Migración iterativa a pixel art cartoon”. El plan solicita publicar primero los cambios estables de `main`, crear `codex/pixel-art-v1`, producir un piloto no destructivo de Bigotes y combate mediante ImageGen, incorporar perfiles `legacy`/`pixel-v1`, sincronizar ataque e hitbox con frames, añadir herramientas de revisión/validación y escalar los demás assets sólo después de aprobar el piloto.
**Resultado:** se publicó primero el trabajo estable de `main` y se creó `codex/pixel-art-v1`. Con ImageGen integrado se produjo el frame maestro, ocho tiras de animación de Bigotes y dos efectos de combate; un pipeline local los normaliza a paleta cerrada, alpha binario, celdas exactas y hoja de 384×512 px. Se añadieron los perfiles `legacy`/`pixel-v1`, colliders por perfil, ataque de 36×30 px activo en frames 2–4, arco sincronizado, hit spark sólo tras daño confirmado y finalización del estado al completar la animación. La escena de desarrollo `?art-review=bigotes` permite comparar ambos estilos, cambiar animación/FPS, pausar, avanzar por frames, ampliar 1×/4×, invertir con `flipX` y ver collider/hitbox. El piloto fue validado en Panadería y Mercado; el resto de los 40 entregables queda deliberadamente pendiente de aprobación visual del usuario.
**Archivos:** `PROMPTS.md`, `README.md`, `package.json`, `art-source/pixel-art/v1/`, `assets/pixel-art/v1/`, `scripts/pixel-art-png.mjs`, `scripts/process-pixel-art.mjs`, `scripts/validate-pixel-art.mjs`, `src/App.jsx`, `src/game/art/artProfile.js`, `src/game/assetManifest.js`, `src/game/assets/assetRegistry.js`, `src/game/data/animationData.js`, `src/game/entities/Player.js`, `src/game/scenes/ArtReviewScene.js`, `src/game/scenes/PreloadScene.js`, `src/game/scenes/LevelOneScene.js`, `src/game/scenes/LevelTwoScene.js` y `src/game/config.js`.
**Commits:**

- `320faab fix(game): stabilize Mercado activation and progression`
- `b035ebb docs(art): add pixel-art production workflow`
- `e414734 docs(prompts): record pixel-art commit references`
- `b15738c feat(art): add Bigotes pixel-art pilot`
- `e7b4547 feat(game): integrate frame-synced pixel-art combat`

### PDM-020 — Generar los personajes restantes desde la base de Bigotes

**Fecha:** 2026-08-02
**Prompt:** “toma como base la configuracion de bigotes y genera los assets correspondientes del resto de personajes, esto para ahorrar tokens en ajustes que ya no deberian suceder porque ya esta la base del primer personaje y el contexto del juego”
**Resultado:** se cerró el alcance a los tres enemigos con personaje jugable —Rastrero, Escupemasas y Sentinela— y se reutilizó sin reabrir decisiones la dirección de Bigotes: cartoon submarino, outline azul marino, 12–16 colores, baja densidad de detalle y fluidez mediante poses. ImageGen integrado produjo tres maestros y veinte filas de animación; el pipeline aísla poses por componentes, elimina chroma, normaliza paleta/alpha y ensambla hojas exactas de 640×336, 640×384 y 768×784 px. El perfil `pixel-v1` carga las nuevas hojas con frames, FPS, escala 1× y colliders propios; la escena de revisión acepta los tres personajes y se validaron ambos niveles. Proyectil, coleccionables, objetos, UI, tileset y fondos permanecen fuera de esta tanda.
**Archivos:** `PROMPTS.md`, `README.md`, `art-source/pixel-art/v1/README.md`, `art-source/pixel-art/v1/rastrero/`, `art-source/pixel-art/v1/escupemasas/`, `art-source/pixel-art/v1/sentinela/`, `assets/pixel-art/v1/characters/brine-crawler.png`, `assets/pixel-art/v1/characters/abyssal-spitter.png`, `assets/pixel-art/v1/characters/black-coral-sentinel.png`, `scripts/process-pixel-art.mjs`, `scripts/validate-pixel-art.mjs`, `src/App.jsx`, `src/game/assetManifest.js`, `src/game/assets/assetRegistry.js`, `src/game/data/animationData.js`, `src/game/entities/BrineCrawler.js`, `src/game/entities/AbyssalSpitter.js`, `src/game/entities/BlackCoralSentinel.js`, `src/game/scenes/ArtReviewScene.js` y `src/game/scenes/PreloadScene.js`.
**Commits:**

- `878b70e feat(art): add pixel-art enemy character batch`
- `52a7a17 feat(game): integrate pixel-art enemy profiles`

### PDM-021 — Conservar local la rama artística

**Fecha:** 2026-08-02
**Prompt:** “No pushees la rama”
**Resultado:** se canceló la publicación de `codex/pixel-art-v1`; los commits de esta tanda se conservaron únicamente en el repositorio local.
**Archivos:** `PROMPTS.md`.
**Commits:** `abaf56a docs(art): document enemy pixel-art batch`.

### PDM-022 — Ejecutar el juego con los nuevos assets

**Fecha:** 2026-08-02
**Prompt:** “Okey, ahora corre el server y dime en que puerto puedo ver el juego con los nuevos assets implementados”
**Resultado:** se inició el servidor local de desarrollo con el perfil artístico `pixel-v1` para revisar dentro del juego los nuevos sprites de Bigotes, Rastrero, Escupemasas y Sentinela.
**Archivos:** `PROMPTS.md`.
**Commits:** `d38fce3 docs(art): document parallax background workflow`.

### PDM-023 — Generar todos los fondos de los dos niveles

**Fecha:** 2026-08-02
**Prompt:** “Ok, me gusta, ahora puedes darme el background *todos* de los dos niveles de acuerdo al estilo de los nuevos assets?”
**Resultado:** se generaron con ImageGen integrado las seis capas parallax de Panadería Hundida y Mercado Sumergido. Las fuentes 16:9 se conservaron en `art-source`; el pipeline las normaliza a 320×180 internos, paleta de hasta 24 colores por bioma, costura horizontal, alpha binario para capas cercanas y ampliación nearest-neighbor 2×. Los seis PNG finales son exactos de 640×360 y conviven con los legacy bajo el perfil `pixel-v1`.
**Archivos:** `art-source/pixel-art/v1/backgrounds/`, `assets/pixel-art/v1/backgrounds/`, `art-source/pixel-art/v1/README.md`, `scripts/process-pixel-art.mjs`, `scripts/validate-pixel-art.mjs`, `src/game/art/backgroundLayout.js`, `src/game/assets/assetRegistry.js`, `src/game/scenes/LevelOneScene.js`, `src/game/scenes/LevelTwoScene.js`, `pixel_art_prompt.md`, `README.md` y `PROMPTS.md`.
**Commits:**

- `54d1cd5 feat(art): add pixel-art parallax backgrounds`
- `b75cf21 fix(game): align pixel-art parallax to viewport`
- `d38fce3 docs(art): document parallax background workflow`

### PDM-024 — Corregir escala y colocación de los fondos

**Fecha:** 2026-08-02
**Prompt:** “ten en cuenta que actualmente los fondos no estan del todo bien, porque no cuadran bien con el juego en cuanto a tama;os y donde se encuentran ubicados”
**Resultado:** corrección de PDM-023 aplicada: se eliminaron las escalas distintas por capa y los offsets `tilePositionY` arbitrarios. Pixel-v1 usa escala 1×, viewport exacto de 640×360, parallax exclusivamente horizontal y anclaje vertical a cámara; el Mercado conserva el fondo estable al desplazarse por su mundo de 720 px. También se corrigió el encuadre legacy mediante una escala uniforme. La inspección real de ambos niveles en el navegador confirmó lectura, cobertura y ausencia de errores.
**Archivos:** `src/game/art/backgroundLayout.js`, `src/game/assets/assetRegistry.js`, `src/game/scenes/LevelOneScene.js`, `src/game/scenes/LevelTwoScene.js`, `README.md`, `pixel_art_prompt.md` y `PROMPTS.md`.
**Commits:**

- `b75cf21 fix(game): align pixel-art parallax to viewport`
- `d38fce3 docs(art): document parallax background workflow`

### PDM-025 — Completar fallbacks, tileset y assets restantes

**Fecha:** 2026-08-02
**Prompt:** “Ok, ahora, puedes generar los assets faltantes en los niveles donde usaste fallbacks, despues cambiar los tilesets para que no haya discrepancia en las coliciones y al final redise;ar el resto de assets usados en los niveles? todo esto usando el nuevo estilo para los assets que definimos”
**Resultado:** se completó el perfil `pixel-v1` en las tres fases solicitadas. ImageGen integrado produjo fuentes chroma independientes para los siete recursos que antes dependían de fallbacks, el tileset modular, Levadura, compuerta térmica, horno, respiradero y cuatro efectos. El pipeline normaliza todos los resultados a hojas exactas, alpha binario y paletas de 8–16 colores. Las plataformas ahora se ensamblan con tapas y centro repetible desde la misma coordenada superior del collider, sin estirar sprites; puestos con colisión usan su tamaño visual real y el coral peligroso repite un módulo sobre una zona coincidente. Los props cambian de frame según estado, proyectiles y respiraderos están animados y los bursts pixel-v1 reemplazan las partículas fallback. Se corrigió además el frame inicial del Centinela, detectado durante QA en navegador. `legacy` permanece intacto y no se hizo push.
**Archivos:** `art-source/pixel-art/v1/README.md`, `art-source/pixel-art/v1/props/`, `art-source/pixel-art/v1/tiles/`, `art-source/pixel-art/v1/effects/`, `assets/pixel-art/v1/props/`, `assets/pixel-art/v1/tiles/`, `assets/pixel-art/v1/effects/`, `scripts/process-pixel-art.mjs`, `scripts/validate-pixel-art.mjs`, `src/game/art/levelArt.js`, `src/game/assetManifest.js`, `src/game/assets/assetRegistry.js`, `src/game/data/animationData.js`, `src/game/entities/`, `src/game/projectiles/CorruptedDoughProjectile.js`, `src/game/scenes/LevelOneScene.js`, `src/game/scenes/LevelTwoScene.js`, `PROMPTS.md`.
**Commits:**

- `604da7c feat(art): add remaining pixel-art level assets`
- `99980f7 feat(game): integrate modular pixel-art level set`

### PDM-026 — Convertir pixel-v1 en la versión oficial

**Fecha:** 2026-08-02
**Prompt:** “haz que se muestren los nuevos assets sin pner los parametros porfa, que ya sesa la version oficial”
**Resultado:** `pixel-v1` pasa a ser el perfil artístico oficial y predeterminado cuando no se proporciona configuración. El juego muestra los nuevos assets con `npm run dev` y en builds normales, sin query string ni variable de entorno. `legacy` permanece disponible sólo si se solicita explícitamente mediante `VITE_ART_PROFILE=legacy` o, en desarrollo, `?art-profile=legacy`. Se añadió una prueba unitaria para fijar este contrato y se actualizó la documentación de producción.
**Archivos:** `src/game/art/artProfile.js`, `src/game/art/artProfile.test.js`, `src/game/systems/levelTwoSystems.test.js`, `README.md` y `PROMPTS.md`.
**Commits:** `fd609a4 feat(art): make pixel art the official profile`.

## Feature: audio MVP

### PDM-027 — Actualizar main antes de producir audio

**Fecha:** 2026-08-02
**Prompt:** “haz pull desde main para obtener los cambios recientes”
**Resultado:** se cambió a `main` con el working tree limpio y se ejecutó `git pull --ff-only origin main`. La rama avanzó por fast-forward de `e414734` a `b814e98`, incorporando el arte pixel oficial antes de crear `codex/audio-mvp`. Esta operación no produjo un commit propio.
**Archivos:** sin cambios propios; actualización fast-forward desde `origin/main`.
**Commits:** no aplica (pull fast-forward).

### PDM-028 — Generar e integrar los SFX fundamentales

**Fecha:** 2026-08-02
**Prompt:** “PLEASE IMPLEMENT THIS PLAN: Audio MVP desde el `main` actualizado”. El plan solicita crear `codex/audio-mvp` desde `main`, generar trece SFX cartoon submarinos reproducibles en WAV, integrarlos mediante manifiesto y `AudioManager`, validar formato y gameplay, documentar el flujo, crear commits semánticos locales y no hacer push.
**Resultado:** se generaron trece WAV mono PCM de 48 kHz/16-bit mediante síntesis procedural determinista, sin samples externos. Un manifiesto central define rutas, volúmenes, duraciones y cooldowns; Phaser precarga los efectos y `AudioManager` reproduce las claves existentes, limita repeticiones, respeta mute y detiene audio al pausar o salir. Los scripts `audio:generate` y `audio:validate` permiten reconstruir y comprobar el lote; se añadieron pruebas unitarias y documentación de producción.
**Archivos:** `assets/audio/sfx/`, `scripts/generate-audio.mjs`, `scripts/validate-audio.mjs`, `src/game/audio/audioManifest.js`, `src/game/systems/AudioManager.js`, `src/game/systems/AudioManager.test.js`, `src/game/scenes/PreloadScene.js`, escenas de ambos niveles, `package.json`, `README.md`, `GUIA_ASSETS_Y_AUDIO.md` y `PROMPTS.md`.
**Commits:**

- `a905b80 feat(audio): add procedural mvp sound library`
- `cd3d69b feat(game): integrate mvp sound effects`
- `3be3ef5 docs(audio): document mvp sound workflow`

## Feature: gobernanza y documentación del proyecto

### PDM-009 — Registrar prompts e instruir a otros agentes

**Fecha:** 2026-08-02
**Prompt:** “Okey, ahora quiero un .md nuevo en el que vayas registrando todos los prompts que te doy pero seccionalos por features que implementas (titulo y commits). despues crea el CLAUDE.md que dirija a Agents.md para que sepan que se tiene que documentar todo lo que hablamos”
**Resultado:** se creó este registro, `AGENTS.md` como fuente canónica y `CLAUDE.md` como enlace obligatorio a esas instrucciones.
**Archivos:** `PROMPTS.md`, `AGENTS.md`, `CLAUDE.md`.
**Commits:** `cd4417a docs(process): add prompt history and agent instructions`.

### PDM-010 — Crear commits semánticos y publicar main

**Fecha:** 2026-08-02
**Prompt:** “haz commits semanticos y pushea en main”
**Resultado:** se solicitó separar los cambios pendientes por responsabilidad, crear commits semánticos comprobables y publicar la rama `main` en `origin`.
**Archivos:** todos los cambios pendientes asociados con PDM-004, PDM-008 y PDM-009.
**Commits:**

- `f27ac2d feat(level): improve traversal and collision layout`
- `c69ca41 docs(assets): add production guide for art and audio`
- `cd4417a docs(process): add prompt history and agent instructions`

### PDM-015 — Publicar los cambios actuales

**Fecha:** 2026-08-02
**Prompt:** “commits semanticos y push”
**Resultado:** la implementación pendiente se dividió por responsabilidad en gameplay, interfaz y documentación; los tres commits se publicaron correctamente en `origin/main`.
**Archivos:** todos los cambios pendientes relacionados con PDM-011 a PDM-014 y este registro.
**Commits:**

- `1a900e0 feat(game): implement Mercado Sumergido level`
- `414e36c feat(ui): add dedicated level selection`
- `590d374 docs(level): document Mercado assets and flow`

## Feature: segundo nivel — El Mercado Sumergido

### PDM-011 — Implementar el segundo nivel completo

**Fecha:** 2026-08-02
**Prompt:** solicitud extensa para ampliar el proyecto con El Mercado Sumergido: auditoría y priorización de assets restantes, registro y resolución central de fallbacks, transición y selector de niveles, estado de sesión, mundo más amplio y vertical, siete Levaduras, tres reguladores, checkpoint, Pan de Presión, Escupemasas con proyectiles pooled, Centinela, oxígeno, HUD ampliado, salida, resultados, documentación y pruebas. El prompt exige conservar el primer nivel y completar ambos sin descargar recursos externos.
**Resultado:** se implementó el segundo nivel completo conservando el primero: registro y auditoría central de assets, fallbacks visibles, selector con desbloqueo de sesión, transición sin segunda instancia de Phaser, mundo de 7,200×720, siete Levaduras, tres reguladores, checkpoint, receta y Pan de Presión, Escupemasas con proyectiles pooled, Sentinela del Coral Negro, oxígeno, corrientes, peligros, HUD/resultados dinámicos y pruebas. Los trece PNG aportados se conservaron intactos; siete recursos inexistentes usan fallbacks documentados. La QA comprobó ambos arranques, capas del Mercado, bloqueo del selector, pausa/reanudación y consola sin errores críticos.
**Archivos:** `src/App.jsx`, `src/components/{GameContainer,HUD,LevelSelect,MainMenu,ResultScreen}.jsx`, `src/game/{PhaserGame,assetManifest,config,constants}.js`, `src/game/assets/*.js`, `src/game/data/{animationData,levelTwoData}.js`, `src/game/entities/{AbyssalSpitter,BlackCoralSentinel,MarketExit,PressureOven,PressureRegulator}.js`, `src/game/projectiles/CorruptedDoughProjectile.js`, `src/game/scenes/{BootScene,LevelOneScene,LevelTwoScene,PreloadScene}.js`, `src/game/systems/{CheckpointSystem,FallbackFactory,MarketProgressionSystem,PressureRecipeSystem,ProjectilePoolPolicy,SessionProgress,levelTwoSystems.test}.js`, `src/styles/global.css`, `README.md`, `GUIA_ASSETS_Y_AUDIO.md`, `docs/asset-audit.md` y `PROMPTS.md`.
**Commits:** `1a900e0`, `414e36c`, `590d374`.

## Feature: interfaz de selección de niveles

### PDM-012 — Crear una pantalla exclusiva para niveles

**Fecha:** 2026-08-02
**Prompt:** “crea una interfaz exclusiva para los niveles porfa, pon opaco los que esten bloqueados”
**Resultado:** se separó la selección del menú principal en una pantalla completa con galería visual, fondos propios por nivel, destino seleccionado, acciones de volver/iniciar, estados disponible/completado/bloqueado y tarjetas bloqueadas deshabilitadas con opacidad y desaturación. La navegación sigue siendo accesible mediante teclado.
**Archivos:** `src/App.jsx`, `src/components/MainMenu.jsx`, `src/components/LevelSelectScreen.jsx`, `src/styles/global.css`, `README.md` y `PROMPTS.md`.
**Commits:** `414e36c`, `590d374`.

### PDM-013 — Añadir favicon y enlaces del proyecto

**Fecha:** 2026-08-02
**Prompt:** “pon un pan emoji en el favicon, en el footer d elas vistas que no son el juego haz un link en el centro que lleve a mi portfolio monkig.dev y arriba a alderecha por el icono de github para que lleve al repo del juego github.com/monkig/pan-de-marea-game”
**Resultado:** se añadió un favicon SVG con el emoji de pan y un marco compartido para las vistas no jugables: icono accesible de GitHub arriba a la derecha y enlace centrado al portfolio en el footer. Ambos enlaces externos se abren de forma segura en una pestaña nueva y desaparecen durante el juego.
**Archivos:** `assets/favicon.svg`, `index.html`, `src/App.jsx`, `src/components/MainMenu.jsx`, `src/components/NonGameLinks.jsx`, `src/styles/global.css` y `PROMPTS.md`.
**Commits:** `414e36c`, `590d374`.

### PDM-014 — Cambiar el texto del footer

**Fecha:** 2026-08-02
**Prompt:** “cambia el footer por \"Made with love by\"”
**Resultado:** el enlace centrado al portfolio ahora muestra “Made with love by MonkiG”, conservando su destino y comportamiento externo seguro.
**Archivos:** `src/components/NonGameLinks.jsx` y `PROMPTS.md`.
**Commits:** `414e36c`, `590d374`.

## Feature: estabilidad y progreso entre niveles

### PDM-016 — Corregir congelamiento y desbloqueo del Mercado

**Fecha:** 2026-08-02
**Prompt:** “hay un bug en el segundo nivel donde se congela todo y no se puede hacer nada, tambien, cuando se completa el primer nivel y se regresa al home, el segundo nivel no sale como desbloqueado, me ayudas a solulcionarlo?”
**Resultado:** se identificó que el Escupemasas mutaba y expandía el rectángulo interno de la cámara en cada frame, provocando crecimiento ilimitado y degradación hasta el congelamiento. La zona de activación ahora se calcula mediante una copia inmutable. El progreso se incorpora a los snapshots Phaser–React, se fusiona sin perder desbloqueos y el inicio de nivel consulta también el estado sincronizado de React.
**Archivos:** `src/App.jsx`, `src/game/entities/AbyssalSpitter.js`, `src/game/scenes/LevelOneScene.js`, `src/game/scenes/LevelTwoScene.js`, `src/game/systems/ActivationBounds.js`, `src/game/systems/SessionProgress.js`, `src/game/systems/levelTwoSystems.test.js` y `PROMPTS.md`.
**Commits:** `320faab fix(game): stabilize Mercado activation and progression`.

## Feature: rediseño grounded (Tutorial + Nivel I)

### PDM-017 — Reacomodar los niveles con apoyos coherentes

**Fecha:** 2026-08-02
**Prompt literal:** “Desde main, puedes hacer una rama que se llame feat/levels en el que reacomodes los niveles para que el tutorial (nivel 1 actual) muestre los fundamentos del juego y el nivel 1 (nivel 2 actual), sea el gameplay con mas complejidad, no quiero nada volando si algo ba a estar en el aire debe haber una plataforma para que el jugador pueda estar parado, que haya coherencia con los assets y la jugabilidad”

**Decisiones acordadas:**

- La rama `feat/levels` anterior se preservó como `codex/archive-feat-levels-20260802` y se recreó desde `main`.
- Las etiquetas públicas son **Tutorial** y **Nivel I**, conservando los IDs internos `level-one` y `level-two`.
- El Tutorial enseña todos los sistemas base excepto el jefe; Nivel I los combina con mayor dificultad.
- El trabajo se aisló en un worktree y se guardó en commits semánticos sin tocar `feat/receipes`.

**Resultado:** se extrajo una escena compartida dirigida por datos; se añadieron superficies declarativas mediante `surfaceId`, posiciones verticales derivadas y validación de soportes/patrullas. Todas las plataformas elevadas son terrazas de piedra o puestos conectados al suelo. El Tutorial se divide en diez zonas progresivas y Nivel I escala a 9,000 px, cuatro reguladores, ocho Levaduras, cinco Escupemasas y el Sentinela. Se centralizaron las etiquetas públicas y se actualizaron selector, resultados, assets compartidos, pruebas y README.

**Validación:** `npm test` (29 pruebas), `npm run build`, `npm run art:validate` y revisión visual en navegador de controles, perchas, cobertura, reguladores elevados, jefe, horno, compuerta, estación y salida. La activación de un regulador se comprobó en runtime sin errores ni advertencias de consola.

**Archivos:** `src/game/scenes/BaseLevelScene.js`, `src/game/data/levelOneData.js`, `src/game/data/levelTwoData.js`, `src/game/data/levelCatalog.js`, `src/game/systems/LevelSupportSystem.js`, componentes React, pruebas, `README.md` y `PROMPTS.md`.

**Commits:**

- `388f06d refactor(scenes): extract data-driven BaseLevelScene shared by both levels`
- `e08ac21 feat(levels): ground tutorial and first level`

### PDM-018 — Implementar el plan aprobado

**Fecha:** 2026-08-02
**Prompt literal:**

<details>
<summary>Mostrar plan solicitado</summary>

~~~~text
PLEASE IMPLEMENT THIS PLAN:
# Rediseño grounded: Tutorial + Nivel I

## Resumen

- Preservar la rama existente como `codex/archive-feat-levels-20260802` y recrear `feat/levels` directamente desde `main`.
- Trabajar en un worktree aislado y crear commits semánticos, sin tocar los cambios pendientes de `feat/receipes`.
- Presentar públicamente La Panadería Hundida como **Tutorial** y El Mercado Sumergido como **Nivel I**.
- Mantener los IDs internos `level-one` y `level-two` para conservar compatibilidad con escenas, progreso y checkpoints.

## Implementación

- Extraer la lógica compartida de ambas escenas a una escena base dirigida por datos, permitiendo que Tutorial y Nivel I usen las mismas mecánicas sin duplicación.
- Rediseñar el Tutorial como diez zonas seguras y progresivas: movimiento, salto, oxígeno/levadura/respiradero, combate cuerpo a cuerpo, Escupemasas con cobertura, corriente, coral peligroso, regulador, checkpoint, horno y compuerta. No incluir al jefe.
- Rediseñar Nivel I como escalada de esas mecánicas: recorrido más largo, enemigos combinados, menos recuperación, varias corrientes y peligros, cuatro reguladores, recursos en rutas secundarias, checkpoint y Sentinela como clímax.
- Incorporar `surfaceId` a enemigos, coleccionables, props e interactivos. Su posición vertical se calculará desde el suelo o plataforma declarada, eliminando coordenadas que dejan horno, compuerta, levaduras o reguladores flotando.
- Toda superficie elevada será una estructura conectada al suelo: bloque/terraza de piedra en la Panadería o techo de puesto/estructura de mercado en Nivel I. Los colliders coincidirán con su silueta y la parte superior será transitable.
- Usar rocas y coral del tileset como cobertura de la Panadería; reservar puestos del mercado para El Mercado Sumergido. No generar ni sustituir assets.
- Centralizar las etiquetas públicas y actualizar selector, resultados, objetivos y README para mostrar “Tutorial” y “Nivel I”. Completar el Tutorial desbloqueará Nivel I.
- Registrar el prompt literal, las decisiones acordadas, archivos y commits reales en `PROMPTS.md`.

## Interfaces y validaciones

- Añadir al esquema interno de nivel superficies identificables y soportes estructurales; todos los objetos persistentes deberán declarar una superficie válida.
- Añadir validación estática para comprobar que:
  - cada objeto está dentro del ancho seguro de su superficie;
  - cada plataforma elevada tiene soporte visual hasta el suelo;
  - las patrullas no salen de su plataforma;
  - los saltos enlazados conservan margen respecto al alcance real del jugador.
- Burbujas ambientales, corrientes, efectos y proyectiles quedan exentos por ser elementos transitorios; cualquier enemigo, ingrediente o interactivo elevado tendrá una plataforma donde Bigotes pueda pararse.

## Pruebas y entrega Git

- Añadir pruebas de estructura, soportes, patrullas, requisitos, progresión y alcance de saltos para ambos niveles.
- Ejecutar `npm test`, `npm run build` y `npm run art:validate`.
- Recorrer visualmente ambos niveles desde spawn hasta salida, verificando plataformas, coberturas, colliders, checkpoint, horno, desbloqueo y ausencia de objetos persistentes flotantes.
- Crear tres commits: refactor compartido de escenas, rediseño grounded de niveles/UI y registro final en `PROMPTS.md`.
- Retirar el worktree temporal al terminar; `feat/levels` conservará los commits y el árbol actual de `feat/receipes` quedará exactamente como estaba.
~~~~

</details>

**Resultado:** implementado íntegramente según PDM-017, con tres commits separados para refactor, gameplay y registro documental.

**Archivos:** los mismos de PDM-017, más `PROMPTS.md` para el cierre obligatorio.

**Commits:**

- `388f06d refactor(scenes): extract data-driven BaseLevelScene shared by both levels`
- `e08ac21 feat(levels): ground tutorial and first level`

### PDM-019 — Corregir la carga infinita al iniciar niveles

**Fecha:** 2026-08-02
**Prompt literal:** “No puedo inicializar niveles, se queda en la pantalla de cargando, por alguna razon”

**Resultado:** se corrigió la carrera de arranque que escribía el nivel seleccionado y los ajustes después de construir Phaser. El registro ahora se inicializa en `preBoot`, antes de ejecutar `BootScene` y `PreloadScene`. También se añadió un límite de diez segundos, presentación explícita de errores y una acción de reintento que reconstruye limpiamente la instancia del juego, evitando que la interfaz permanezca indefinidamente en “Cargando”.

**Validación:** `npm test` (31 pruebas), `npm run build`, `npm run art:validate` y arranque en navegador del Tutorial y Nivel I en desarrollo, más el Tutorial en la build de producción; sin errores ni advertencias de consola.

**Archivos:** `src/App.jsx`, `src/components/GameContainer.jsx`, `src/game/PhaserGame.js`, `src/game/config.js`, `src/game/startup.js`, `src/game/startup.test.js` y `PROMPTS.md`.

**Commits:** `55ae570 fix(levels): stabilize scene startup`.

### PDM-020 — Liberar el espacio bajo las banquetas y activar al Escupemasas

**Fecha:** 2026-08-02
**Prompt literal:** “Me encanta, solo como ultima tarea, que las banquetas flotantes no tengan nada debajo para que se pueda pasar por debajo, y haz que el enemigo escupemasas si dispare, porque ahorita como que no hace nada”

**Corrección de alcance:** este prompt reemplaza para las banquetas elevadas la decisión de PDM-017 y PDM-018 que exigía soportes visuales hasta el suelo. Los objetos persistentes conservan `surfaceId`, pero las banquetas ahora permanecen libres por debajo.

**Resultado:** las plataformas elevadas se renderizan como superficies delgadas de una sola dirección, sin relleno visual ni collider vertical, por lo que Bigotes puede cruzar por debajo y aterrizar encima. Al retirar esos bloques también se despejó la línea de visión del Escupemasas. Sus proyectiles de Masa Corrupta ya no colisionan con las banquetas de una sola dirección —incluida su propia percha—, aunque la cobertura sólida continúa bloqueándolos.

**Archivos:** `src/game/scenes/BaseLevelScene.js`, `src/game/data/levelTwoData.js`, `src/game/systems/LevelSupportSystem.js`, `README.md` y `PROMPTS.md`.

**Commits:** `88f61fd fix(levels): open space below floating platforms`.

### PDM-021 — Omitir pruebas por solicitud del usuario

**Fecha:** 2026-08-02
**Prompt literal:** “Okey para ahorrar tokens no hagas pruebas, esas las hago yo, solo arregla lo que te pedi”

**Resultado:** no produjo cambios funcionales adicionales. Por indicación expresa del usuario no se ejecutaron ni añadieron pruebas automáticas, build, validación de arte o recorrido en navegador para PDM-020; la validación manual queda a cargo del usuario.

**Archivos:** `PROMPTS.md`.

**Commits:** `88f61fd fix(levels): open space below floating platforms`.

### PDM-022 — Preparar diagnóstico de enemigos para Claude

**Fecha:** 2026-08-02
**Prompt literal:** “sigue sin funcionar el escupemasas, haz un readme en el que detalles el problema para que claude lo resuelva, tambien que el enemigo final no cambia de posicion cuando se mueve a la izquierda, se queda viendo a la derecha siempre”

**Resultado:** no se modificó la jugabilidad. Se creó un encargo técnico autocontenido para Claude con reproducción de ambos defectos, flujo actual del Escupemasas, antecedentes del intento `88f61fd`, hipótesis auditables, archivos implicados y criterios de aceptación. La inspección de la hoja del Sentinela confirmó que el asset base mira a la derecha, mientras el código aplica `flipX` con la condición opuesta y después de varios retornos tempranos.

**Archivos:** `README_CLAUDE_ENEMY_BUGS.md` y `PROMPTS.md`.

**Commits:** `8717c22 docs(enemies): brief Claude on unresolved gameplay bugs`.

### PDM-023 — Restaurar los disparos del Escupemasas

**Fecha:** 2026-08-02
**Prompt literal:** “arregla lo del escupemasas antes de que se acaben los creditos”

**Resultado:** se identificó la causa raíz: `createExpandedBounds()` retorna una copia simple, pero `AbyssalSpitter` la entregaba a `Phaser.Geom.Rectangle.Overlaps()`, que requiere las propiedades geométricas de una instancia `Phaser.Geom.Rectangle`. La guarda `nearCamera` permanecía falsa y el enemigo abandonaba `update()` antes de cargar o disparar. Ahora se construye el rectángulo Phaser correcto; también se alineó `flipX` con la orientación real del asset y se añadió recuperación rápida cuando el pool no entrega un proyectil.

**Archivos:** `src/game/entities/AbyssalSpitter.js`, `README_CLAUDE_ENEMY_BUGS.md` y `PROMPTS.md`.

**Commits:** `51fda2d fix(enemies): restore abyssal spitter attacks`.

### PDM-024 — Confirmar commits semánticos y cerrar la tarea

**Fecha:** 2026-08-02
**Prompt literal:** “okey commits semanticos y nos vvemos en 1 seman”

**Resultado:** no produjo cambios funcionales adicionales. Se confirmó que el arreglo del Escupemasas y su documentación ya están separados en commits semánticos.

**Archivos:** `PROMPTS.md`.

**Commits relacionados:** `51fda2d fix(enemies): restore abyssal spitter attacks` y `68d81f4 docs(prompts): record spitter root cause`.

## Feature: recetas y panes especiales

### PDM-025 — Reanudar e integrar el sistema de recetas tras cortarse los créditos

**Fecha:** 2026-08-03
**Prompt literal:** “continua con la tarea que dejaste pendiente porque se acabaron los creditos”

**Contexto encontrado:** el trabajo de `feat/receipes` había quedado a medias. Los assets, SFX, scripts y la especificación `CLAUDE_RECIPES_IMPLEMENTATION.md` estaban commiteados en esa rama —creada antes de fusionar `feat/levels`, por lo que precedía a `BaseLevelScene`—, mientras que los módulos puros del sistema (datos de recetas, inventario especial, reglas de elaboración, snapshots, proyectil y pruebas) sólo existían como archivos sin seguimiento en el árbol de trabajo de `main`. La integración con escenas, HUD y React estaba pendiente.

**Decisión acordada (pregunta al usuario):** aterrizar el trabajo restante en una rama nueva `feat/recipes-v2` creada desde `main`, trayendo los assets/audio/spec de `feat/receipes` e integrando sobre la arquitectura actual de `BaseLevelScene`. La rama vieja queda como archivo.

**Resultado:** se completó el alcance de la especificación sobre la arquitectura vigente. El horno abre un menú React que pausa y reanuda la escena con bloqueo de controles; la receta de misión (Pan Térmico / de Presión) y la Baguette Torpedo comparten la reserva de Levadura del objetivo (`reserva = completada ? 0 : coste`), de modo que la Baguette nunca gasta los ingredientes de la salida. Se añadieron las teclas Q (cambiar) y K (usar), un pool de seis Baguettes que dañan con `enemy.takeDamage(2, x)` y sólo generan impacto cuando el golpe se confirma, la barra de panes especiales en el HUD con selección, candados, cooldown y pulso de no disponible, y dos Levaduras opcionales en el Tutorial para poder elaborar la Baguette sin arriesgar el pedido. El inventario especial se conserva en checkpoints y en el snapshot público. Las recetas futuras (oxígeno y defensa) aparecen bloqueadas y sólo dan feedback sonoro.

**Validación:** `npm run recipes:assets:validate` (7 assets), `npm run audio:validate` (22 SFX), `npm run art:validate`, `npm test` (41 pruebas), `npm run build` y `git diff --check` limpios. Además el servidor de desarrollo sirvió y transformó todos los módulos nuevos sin errores. El recorrido jugable en navegador queda a cargo del usuario (ver PDM-021).

**Archivos:** `CLAUDE_RECIPES_IMPLEMENTATION.md`, `art-source/pixel-art/v1/recipes/`, `assets/pixel-art/v1/recipes/`, `assets/audio/sfx/` (recetas y Baguette), `scripts/process-recipe-assets.mjs`, `scripts/validate-recipe-assets.mjs`, `scripts/generate-audio.mjs`, `scripts/validate-audio.mjs`, `package.json`, `src/game/data/recipeData.js`, `src/game/systems/{SpecialBreadInventory,SpecialRecipeSystem,recipeSnapshot,recipeSystems.test,AudioManager.test}.js`, `src/game/projectiles/BaguetteTorpedoProjectile.js`, `src/game/scenes/BaseLevelScene.js`, `src/game/entities/{Player,Oven,PressureOven}.js`, `src/game/PhaserGame.js`, `src/game/assetManifest.js`, `src/game/assets/assetRegistry.js`, `src/game/data/{animationData,levelOneData}.js`, `src/game/audio/audioManifest.js`, `src/App.jsx`, `src/components/{HUD,RecipeMenu,SpecialBreadBar}.jsx`, `src/styles/global.css`, `README.md` y `PROMPTS.md`.

**Commits:**

- `741c0ec feat(recipes): add pixel-art, audio and implementation spec`
- `10a8f0a feat(recipes): add special bread systems and baguette projectile`
- `2af969e feat(game): integrate oven recipe menu and baguette combat`
- `2032764 feat(ui): add recipe menu overlay and special bread hud`

### PDM-026 — Munición infinita de la Baguette con umbral de 3 Levaduras

**Fecha:** 2026-08-03
**Prompt literal:** “haz que la municion sea infinita solamente se necesiten 3 levaduras para poder hacerlo”

**Interpretación aplicada:** la Baguette Torpedo pasa a tener munición infinita y su “coste” de 3 Levaduras se reinterpreta como un **umbral de preparación, no un gasto**. Se necesita tener 3 Levaduras disponibles para prepararla; al prepararla no se consume Levadura (evita cualquier bloqueo del pan de misión) y a partir de entonces se dispara sin límite, conservando sólo el cooldown. Se eligió el umbral sin consumo —en vez de gastar 3— porque gastarlas podría dejar un nivel sin la Levadura necesaria para su salida.

**Resultado:** `recipeData` marca la Baguette con `infinite: true`, `cost: 3` y `maxStack: 1`. `SpecialRecipeSystem` valida las recetas infinitas contra la Levadura disponible (ignorando la reserva) y no las cobra; `SpecialBreadInventory.use()` no descuenta munición infinita; los snapshots exponen `infinite`. El HUD muestra `∞` cuando está preparada y el menú del horno indica “Preparada · munición ∞” o “Requiere 3 Levaduras”. Se actualizaron las pruebas puras al nuevo modelo.

**Validación:** `npm test` (41 pruebas) y `npm run build`.

**Archivos:** `src/game/data/recipeData.js`, `src/game/systems/{SpecialRecipeSystem,SpecialBreadInventory,recipeSnapshot,recipeSystems.test}.js`, `src/components/{RecipeMenu,SpecialBreadBar}.jsx`, `README.md` y `PROMPTS.md`.

**Commits:**

- `85c8a20 feat(recipes): make baguette torpedo infinite ammo`
- `docs(recipes): record infinite baguette tweak` (este commit)

### PDM-027 — Corregir el congelamiento aleatorio de Nivel I

**Fecha:** 2026-08-03
**Prompt literal:** “haz pull de main, despues en otra rama, valida porque en los niveles hay situaciones en los que se queda congelada la pantalla y no se puede hacer nada en el juego”

**Contexto:** con las recetas ya fusionadas en `main`, se hizo pull y se creó la rama `fix/level-two-freeze`. El usuario reportó que Nivel I (El Mercado Sumergido) se congela por completo en momentos aleatorios.

**Causa raíz (reproducida con Playwright headless):** en las colisiones grupo-vs-grupo, Phaser recorre el grupo más pequeño e invoca el callback con los argumentos potencialmente **invertidos**. El collider `this.projectiles` vs `this.solidObstacles` asumía que el primer argumento era el proyectil (`(projectile) => splashProjectile(projectile)`); cuando Phaser lo invertía, `splashProjectile` recibía una `Zone` de obstáculo y ejecutaba `zone.deactivate()`, que no existe. La excepción se lanzaba **dentro del paso de físicas** (fuera de `update()`), mataba el render loop de Phaser y congelaba el nivel sin posibilidad de actuar. Es intermitente porque el orden depende del tamaño relativo de los grupos en cada frame, y golpea sobre todo al Mercado por su alta densidad de Escupemasas y obstáculos. Los colliders/overlaps de la Baguette compartían el mismo patrón latente.

**Resultado:** se selecciona el objeto correcto por pertenencia al grupo (`pickMember`) en los colliders de proyectiles y de la Baguette, y se endurece `splashProjectile`. Como defensa en profundidad se envolvió `update()` en una guarda que encamina cualquier excepción de un frame al overlay de “Reintentar” existente, y se añadió una trampa global de errores (`errorTrap.js`) que reenvía las excepciones no atrapadas —incluidas las que escapan del render loop— al mismo overlay recuperable en vez de congelar el juego.

**Validación:** reproducción y verificación con Chromium headless (Playwright): 75 s de fuego cruzado en el Mercado sin excepciones, más estrés de pausa/reanudación, reinicio y cambio de nivel sin anomalías. `npm test` (41 pruebas) y `npm run build` en verde.

**Archivos:** `src/game/scenes/BaseLevelScene.js`, `src/errorTrap.js`, `src/main.jsx` y `PROMPTS.md`.

**Commits:**

- `a7c4e72 fix(levels): stop group-collision arg-order crash that froze levels`
- `1e2efc3 feat(app): forward uncaught errors to the retry overlay`

### PDM-028 — Corregir la orientación del Sentinela (defecto pendiente del encargo)

**Fecha:** 2026-08-03
**Prompt literal:** “desde main crea otra rama para solucionar el error faltante del CLAUDE_ENEMY_BUGS.md”

**Contexto:** de los dos defectos de `README_CLAUDE_ENEMY_BUGS.md`, el del Escupemasas ya se había corregido (`51fda2d`); quedaba pendiente el Defecto 2: el Sentinela del Coral Negro caminaba/cargaba/atacaba hacia la izquierda pero seguía mirando a la derecha. Desde `main` actualizado se creó la rama `fix/sentinel-facing`.

**Causa raíz:** la hoja base del Sentinela mira a la derecha, pero `BlackCoralSentinel.update()` usaba `this.setFlipX(this.direction > 0)` (condición invertida) y sólo la ejecutaba tras varios retornos tempranos, por lo que la mirada no se actualizaba durante `dormant`, `alert`, `basicAttack`, `chargeAttack`, `hurt` ni `stunned`.

**Resultado:** se centralizó la orientación en `BlackCoralSentinel.updateFacing()` con `this.setFlipX(this.direction < 0)` y se invoca inmediatamente después de calcular `direction`, antes de cualquier retorno, de modo que la mirada es correcta en todos los estados. No se alteró velocidad, dirección física, geometría ni assets.

**Validación:** verificación en juego con Chromium headless (Playwright) en Nivel I: con Bigotes a la izquierda del jefe `direction=-1, flipX=true` (mira a la izquierda) y a su derecha `direction=1, flipX=false` (mira a la derecha), confirmado incluso durante `chargeAttack`. `npm test` (41 pruebas) y `npm run build` en verde. Se retiró la instrumentación temporal antes de entregar.

**Archivos:** `src/game/entities/BlackCoralSentinel.js`, `README_CLAUDE_ENEMY_BUGS.md` y `PROMPTS.md`.

**Commits:**

- `e77f229 fix(enemies): face the sentinel toward its movement direction`

## Feature: música por vista

### PDM-029 — Reproducir la música de la carpeta music en cada vista

**Fecha:** 2026-08-03
**Prompt literal:** “Puedes hacer que la musica de la carpeta music se reprodusca en su respectiva vista? tanto en el home (es la misma que el final) y la cancion de cada nivel”

**Decisión de asignación acordada (confirmada con el usuario):** `riviera-swing-main.wav` para el home, la pantalla de selección de niveles y las pantallas de resultado (victoria y derrota); `tidal-siege-tutorial.wav` para el Tutorial (La Panadería Hundida, `level-one`); `heroic-depths-level-1.wav` para el Nivel I (El Mercado Sumergido, `level-two`). El tema principal también suena en el selector de niveles.

**Resultado:** se integró la música de `assets/audio/music/` por vista. Se creó un manifiesto independiente del SFX (`musicManifest.js`) porque la música es estéreo y no debe entrar en el lote mono que validan `audio:generate`/`audio:validate`. `AudioManager` ganó `playMusic`/`stopMusic` con loop, volumen propio, corte de la pista anterior y reanudación al desmutear. Cada escena de nivel carga en su propio `preload()` únicamente su pista (carga perezosa, evitando descargar ~90 MB de música al arrancar), la reproduce al crear la escena, la reanuda al volver de pausa y la detiene al completar o fallar. En React, un componente `MenuMusic` reproduce el tema principal con `<audio loop>` en home, selector y resultados, respetando el mute global y desbloqueando el autoplay tras la primera interacción del navegador.

**Validación:** `npm test` (46 pruebas, +5 de música), `npm run build`, `npm run audio:validate` (22 SFX) y `git diff --check` en verde. La revisión auditiva en navegador queda a cargo del usuario (práctica PDM-021).

**Archivos:** `assets/audio/music/` (3 WAV), `src/game/audio/musicManifest.js`, `src/game/systems/AudioManager.js`, `src/game/systems/AudioManager.test.js`, `src/game/scenes/BaseLevelScene.js`, `src/game/scenes/LevelOneScene.js`, `src/game/scenes/LevelTwoScene.js`, `src/components/MenuMusic.jsx`, `src/App.jsx` y `PROMPTS.md`.

**Commits:**

- `a96b515 feat(audio): add per-level looping music support`
- `a244a2b feat(ui): add main theme music for menus and results`
- `62e7f64 feat(assets): add per-view music tracks`

**Corrección PDM-029 (2026-08-03):** “hay errores al pausar la musica \"this.musicSound.stop is not a function\"”. Causa raíz: `Phaser.Sound.BaseSoundManager.play()` devuelve `true` (booleano), no la instancia de sonido, por lo que `playMusic()` guardaba `true` como `musicSound` y `stop()`/`stopAll()` fallaban al llamar a `.stop()`/`.destroy()` sobre él. Se cambió `playMusic()` a `this.sound.add(key, { volume, loop })` (que sí devuelve la instancia `Phaser.Sound`) y `stopMusic()`/`stopAll()` ahora destruyen la instancia. `npm test` (46) y `npm run build` en verde. La corrección quedó incluida en el commit `a96b515` (la implementación aún no estaba commiteada).

### PDM-030 — El tema principal no se reproduce en la pestaña principal (autoplay)

**Fecha:** 2026-08-03
**Prompt literal:** “cuando entro a la pestaña principal no se reproduce, se reproduce cuando entro a los niveles”

**Diagnóstico:** no era un bug de código: la política de autoplay del navegador bloquea cualquier audio antes de la primera interacción del usuario. Al abrir la app, la pestaña principal está silenciada por el navegador; el primer gesto (normalmente el clic en «Jugar», que navega al selector de niveles) desbloquea el contexto de audio, por lo que el tema principal solo se percibe a partir del selector. Se confirmó que el cableado era correcto (`App.jsx:93` activa el tema en `menu`/`levels`/resultados y el listener de desbloqueo respondía al primer `pointerdown`/`keydown`).

**Decisión acordada (opción A):** añadir un aviso visible en el menú principal («Haz clic en cualquier lugar para activar el sonido») que desaparezca tras el primer gesto, y ampliar el desbloqueo del autoplay a `click`/`touchstart` además de `pointerdown`/`keydown` para compatibilidad con móvil. Queda incluido también el plan A pendiente (opción elegida previamente para el retardo del tema principal): `MenuMusic` usa `preload={active ? 'auto' : 'none'}` y llama `audio.load()` antes de `play()`, sin convertir los WAV.

**Resultado:** `MenuMusic` recibe `onUnlocked`, notifica una única vez tras el primer gesto (ref de guarda) y registra listeners de desbloqueo en `pointerdown`, `click`, `touchstart` (pasivo) y `keydown`. `App` mantiene el estado `audioUnlocked` y lo pasa a `MainMenu`, que muestra el aviso pulsante (`.menu-audio-hint`, nueva animación `menu-hint-pulse` en `global.css`) solo mientras no haya interacción previa y no esté muteado. Una vez desbloqueado (o muteado), el aviso desaparece y no vuelve a mostrarse en la sesión.

**Validación:** `npm test` (46 pruebas), `npm run build` y `git diff --check` en verde. La verificación auditiva en navegador (primer clic en la pestaña principal reproduce el tema) queda a cargo del usuario (práctica PDM-021).

**Archivos:** `src/components/MenuMusic.jsx`, `src/App.jsx`, `src/components/MainMenu.jsx`, `src/styles/global.css` y `PROMPTS.md`.

**Commits:** pendiente (working tree).

**Reversión PDM-030 (2026-08-03):** “Mira, revierte esta ultima feature, no me sirv emucho la verdad”. El usuario solicitó revertir esta feature completa. Se restauraron los cuatro archivos de código al estado commiteado de PDM-029 (`git restore`): se eliminaron el aviso «Haz clic en cualquier lugar para activar el sonido», el estado `audioUnlocked` de `App`, el callback `onUnlocked` y los listeners ampliados de `MenuMusic` (que vuelven a `pointerdown`/`keydown` con `preload='metadata'`), y el estilo `.menu-audio-hint` de `global.css`. El tema principal por vista (PDM-029, ya commiteado) se conserva. No se creó ningún commit; la reversión vive en el working tree.

### PDM-031 — Separar el silencio de música y efectos en ajustes independientes

**Fecha:** 2026-08-03
**Prompt literal:** “mejor implementa en los ajustes que sea diferente el quitar la musica, a quitar los efectos del juego separa en dos opciones diferentes”

**Resultado:** se sustituyó el único `muted` por dos ajustes independientes `musicMuted` y `sfxMuted`. `AudioManager` perdió `muted`/`setMuted` y ganó `setMusicMuted` (detiene la pista activa y la reanuda al desmutear), `setSfxMuted` y `stopSfx` (detiene los SFX activos con `sound.getAll()` sin tocar la instancia de música); `play()` queda bloqueado por `sfxMuted` y `playMusic()` por `musicMuted`. `BaseLevelScene` actualiza sus ajustes por defecto y aplica ambos mutes en `init` y en `setSettings`; se eliminó `setMuted` y el handler muerto `command:audio` de `PhaserGame`. En React, `App` usa la nueva forma de `settings`, `SettingsPanel` muestra dos checkboxes («Silenciar música» / «Silenciar efectos») y el atajo «Sonido activo/apagado» del menú principal pasa a ser un master toggle que silencia/restaura ambos. `MenuMusic` recibe `settings.musicMuted`.

**Validación:** `npm test` (48 pruebas, +2 netas con cobertura de separación), `npm run build` y `git diff --check` en verde. La revisión auditiva en navegador (silenciar solo música, solo efectos, y el atajo del menú) queda a cargo del usuario (práctica PDM-021).

**Archivos:** `src/game/systems/AudioManager.js`, `src/game/systems/AudioManager.test.js`, `src/game/scenes/BaseLevelScene.js`, `src/game/PhaserGame.js`, `src/App.jsx`, `src/components/SettingsPanel.jsx`, `src/components/MainMenu.jsx` y `PROMPTS.md`.

**Commits:**

- `2caea9a feat(audio): split music and sfx mute controls`
- `f0573aa feat(ui): add separate music and effects mute toggles`

## Anexo A — Prompt original de la demo

<details>
<summary>Mostrar prompt literal</summary>

~~~~text
# Prompt para Codex — Primer nivel de Pan de Marea

Actúa como desarrollador sénior de videojuegos web 2D, especializado en Phaser 3, React, Vite, JavaScript, arquitectura modular, pixel art y diseño de niveles.

Debes crear una demo jugable funcional del primer nivel de mi videojuego:

**Pan de Marea: La Última Panadería**

Trabaja directamente sobre el proyecto disponible. Inspecciona primero todos los archivos, carpetas y assets existentes antes de escribir código. No reemplaces ni elimines assets originales.

## 1. Objetivo general

Construye el primer nivel jugable, llamado:

**La Panadería Hundida**

El resultado debe ejecutarse localmente mediante:

```bash
npm install
npm run dev
```

Y debe generar correctamente una versión de producción mediante:

```bash
npm run build
```

La aplicación debe utilizar:

* Phaser 3 para el videojuego.
* React para la interfaz web inicial y el HUD.
* Vite como entorno de desarrollo y empaquetado.
* JavaScript moderno con módulos ES.
* CSS normal o CSS Modules.
* Arcade Physics de Phaser.
* Sin backend.
* Sin base de datos.
* Sin servicios externos obligatorios.

No uses TypeScript salvo que el proyecto existente ya esté configurado completamente en TypeScript. Si empiezas desde cero, utiliza JavaScript.

## 2. Instrucción de autonomía

Realiza la implementación completa sin detenerte a pedir confirmaciones por decisiones menores.

Antes de programar:

1. Inspecciona la estructura actual.
2. Identifica todos los PNG, spritesheets, fondos, tilesets, objetos, audios y fuentes disponibles.
3. Genera un inventario breve de los assets encontrados.
4. Determina automáticamente sus dimensiones.
5. Identifica cuáles son spritesheets y cuáles son imágenes estáticas.
6. Conserva sus nombres originales.
7. Crea una capa de configuración para poder corregir fácilmente dimensiones, frame sizes, offsets y escalas.

Cuando un asset todavía no exista, utiliza un placeholder simple creado con gráficos de Phaser. Mantén claramente indicado en el código dónde debe sustituirse. No descargues imágenes de internet y no generes nuevos assets visuales.

## 3. Contexto del videojuego

Pan de Marea ocurre en un mundo postapocalíptico completamente inundado.

Una civilización submarina invasora llamada **Los Abisales** conquistó la superficie. Los humanos supervivientes se adaptaron a vivir bajo el agua.

El protagonista es **Bigotes**, un panadero submarino que utiliza:

* panes especiales;
* herramientas de panadería adaptadas;
* ingredientes submarinos;
* un antiguo horno familiar;
* energía térmica para sobrevivir.

El tono debe combinar:

* ruina submarina;
* nostalgia;
* supervivencia;
* esperanza;
* humor visual ligero;
* artesanía;
* exploración.

## 4. Primer nivel: La Panadería Hundida

El nivel ocurre dentro de la antigua panadería familiar de Bigotes, ahora totalmente sumergida y parcialmente destruida.

Debe sentirse:

* íntimo;
* artesanal;
* nostálgico;
* ruinoso;
* invadido por coral, algas y agua;
* legible como nivel de plataformas lateral.

La dirección principal del nivel será de izquierda a derecha.

### Flujo del nivel

El jugador debe:

1. Aparecer dentro de la panadería.
2. Aprender a moverse.
3. Aprender a saltar.
4. Encontrar y recoger Levaduras de Burbuja.
5. Encontrar al primer Rastrero de Salmuera.
6. Aprender el ataque básico.
7. Llegar al horno submarino.
8. Usar los ingredientes recogidos para preparar un Pan Térmico.
9. Alcanzar la Compuerta de la Marea Térmica.
10. Activar la compuerta con el Pan Térmico.
11. Completar el nivel.

La duración estimada del nivel debe ser de entre 3 y 6 minutos para una primera partida.

## 5. Estructura de la aplicación

Crea una arquitectura clara y mantenible similar a esta:

```text
src/
  main.jsx
  App.jsx
  styles/
    global.css
  components/
    MainMenu.jsx
    GameContainer.jsx
    HUD.jsx
    PauseMenu.jsx
    ControlsPanel.jsx
    ResultScreen.jsx
  game/
    PhaserGame.js
    config.js
    EventBus.js
    constants.js
    assetManifest.js
    scenes/
      BootScene.js
      PreloadScene.js
      LevelOneScene.js
    entities/
      Player.js
      BrineCrawler.js
      BubbleYeast.js
      ThermalGate.js
      Oven.js
    systems/
      AnimationManager.js
      AudioManager.js
      CombatSystem.js
      OxygenSystem.js
      RecipeSystem.js
    data/
      levelOneData.js
      animationData.js
```

Puedes ajustar esta estructura cuando exista una arquitectura previa mejor, pero conserva separación entre:

* interfaz React;
* inicialización de Phaser;
* escenas;
* entidades;
* configuración;
* datos del nivel;
* sistemas de juego.

No concentres toda la lógica en un único archivo.

## 6. Interfaz inicial con React

Antes de iniciar Phaser, muestra una pantalla inicial creada con React.

Debe incluir:

* título: “Pan de Marea”;
* subtítulo: “La Última Panadería”;
* botón “Jugar”;
* botón o panel “Controles”;
* botón para activar o desactivar sonido;
* texto breve del objetivo;
* fondo visual inspirado en el mundo submarino usando CSS y assets existentes;
* diseño responsive;
* estética pixel art;
* navegación por teclado.

El botón “Jugar” debe montar o activar el juego de Phaser.

Evita crear múltiples instancias de Phaser cuando React se vuelva a renderizar.

Al salir, reiniciar o desmontar el componente, destruye correctamente la instancia de Phaser.

## 7. Comunicación entre React y Phaser

Implementa un EventBus sencillo para comunicar Phaser con React.

React debe recibir actualizaciones de:

* salud;
* oxígeno;
* Levaduras de Burbuja recogidas;
* cantidad requerida;
* disponibilidad del Pan Térmico;
* objetivo actual;
* pausa;
* derrota;
* nivel completado.

React debe poder enviar a Phaser:

* iniciar partida;
* pausar;
* reanudar;
* reiniciar nivel;
* activar o desactivar audio;
* volver al menú.

No manipules directamente el estado interno de una escena desde componentes React.

## 8. HUD

Durante el nivel, muestra un HUD React superpuesto al canvas.

Debe contener:

* barra de salud;
* barra de oxígeno;
* contador de Levaduras de Burbuja;
* estado del Pan Térmico;
* objetivo actual;
* indicador de pausa.

Debe ser compacto, legible y no cubrir el centro del escenario.

Usa texto en español.

Objetivos sugeridos:

* “Explora la panadería”.
* “Recolecta 3 Levaduras de Burbuja”.
* “Llega al horno”.
* “Prepara el Pan Térmico”.
* “Activa la compuerta”.
* “Nivel completado”.

## 9. Configuración visual de Phaser

Configura el juego para pixel art:

```js
pixelArt: true
```

También debes:

* desactivar antialiasing cuando corresponda;
* usar escalado entero siempre que sea posible;
* evitar filtros borrosos;
* mantener sprites nítidos;
* añadir CSS con `image-rendering: pixelated`;
* usar una resolución lógica apropiada, por ejemplo 480 × 270 o 640 × 360;
* adaptar el canvas al contenedor manteniendo la relación de aspecto;
* evitar deformación al cambiar el tamaño de la ventana.

Usa una cámara lateral con seguimiento suave del jugador y límites definidos por el tamaño del nivel.

## 10. Fondos y parallax

Utiliza los fondos existentes de La Panadería Hundida.

Si hay varias capas, identifica su orden visual y crea parallax:

* fondo lejano: factor aproximado 0.1;
* arquitectura lejana: factor aproximado 0.25;
* estructuras medias: factor aproximado 0.45;
* decoración cercana: factor aproximado 0.7;
* nivel jugable: factor 1.

Ajusta los factores según los assets reales.

Las capas decorativas:

* no deben tener colisiones;
* no deben confundirse con plataformas;
* deben cubrir correctamente el recorrido;
* pueden repetirse horizontalmente cuando sea necesario;
* no deben dejar huecos visibles.

Añade efectos ambientales moderados:

* burbujas;
* partículas suspendidas;
* oscilación ligera de algas;
* viñeta submarina sutil;
* pequeños haces de luz;
* movimiento lento de elementos decorativos.

No abuses de partículas ni shaders.

## 11. Construcción del nivel

Implementa un nivel horizontal con varias habitaciones conectadas.

Distribución sugerida:

### Zona A: Inicio y movimiento

* Punto inicial seguro.
* Cartel contextual o mensaje de controles.
* Suelo amplio.
* Una plataforma baja.
* Espacio para probar movimiento y salto.
* Sin enemigos.

### Zona B: Primera recolección

* Primera Levadura de Burbuja visible.
* Una pequeña ruta vertical.
* Elementos de cocina hundidos.
* Obstáculos sencillos.
* Segundo coleccionable en una plataforma.

### Zona C: Primer combate

* Introducción del Rastrero de Salmuera.
* Área cerrada pero suficientemente amplia.
* El enemigo patrulla.
* El jugador puede atacarlo o esquivarlo.
* Punto de recuperación después del encuentro.

### Zona D: Horno submarino

* Horno familiar como objeto interactivo.
* El jugador necesita al menos 3 Levaduras de Burbuja.
* Al acercarse, aparece una indicación para interactuar.
* Si faltan ingredientes, mostrar cuántos faltan.
* Si tiene suficientes ingredientes, permitir preparar el Pan Térmico.
* Reproducir una animación, partículas o destello cálido.
* Descontar los ingredientes o marcarlos como utilizados.
* Entregar un Pan Térmico.

### Zona E: Camino final

* Uno o dos retos simples.
* Puede incluir otro Rastrero.
* Evitar aumentar demasiado la dificultad.
* Guiar visualmente hacia la compuerta.

### Zona F: Compuerta de la Marea Térmica

* Mostrarla inicialmente cerrada.
* Si el jugador no tiene el Pan Térmico, informar que necesita prepararlo.
* Si lo tiene, permitir activarla.
* Ejecutar la animación de activación.
* Bloquear temporalmente el control durante la secuencia.
* Mostrar una transición de nivel completado.
* Notificar a React.

## 12. Jugador: Bigotes

Crea una clase Player.

Capacidades mínimas:

* movimiento horizontal;
* salto;
* caída;
* ataque básico;
* recibir daño;
* invulnerabilidad temporal;
* interacción;
* muerte;
* reinicio.

Controles:

* A / D o flechas izquierda y derecha: moverse.
* W, flecha arriba o espacio: saltar.
* J: ataque básico.
* E: interactuar.
* Esc: pausa.

Añade soporte alternativo para:

* salto con espacio;
* ataque con X;
* interacción con Enter.

No implementes controles móviles todavía, pero organiza el código para poder añadirlos después.

### Movimiento

El movimiento debe sentirse ligeramente submarino, pero continuar siendo preciso.

Utiliza:

* aceleración moderada;
* desaceleración suave;
* gravedad reducida comparada con un plataformas terrestre;
* velocidad máxima controlada;
* salto con arco legible;
* pequeño control aéreo;
* “coyote time” breve;
* “jump buffer” breve.

Evita una física demasiado flotante o difícil de controlar.

### Salud

Configura inicialmente:

* salud máxima: 3;
* daño del enemigo: 1;
* invulnerabilidad después de recibir daño: aproximadamente 1 segundo;
* retroceso pequeño;
* parpadeo visual durante la invulnerabilidad.

## 13. Sistema de oxígeno

Implementa una barra de oxígeno que disminuya lentamente.

Valores iniciales sugeridos:

* oxígeno máximo: 100;
* consumo normal: entre 1 y 2 puntos por segundo;
* aviso visual por debajo de 30;
* daño gradual cuando llega a 0.

Para que el primer nivel no sea frustrante:

* coloca al menos un punto de recuperación;
* permite recuperar una pequeña cantidad al recoger una Levadura de Burbuja;
* pausa el consumo durante pantallas de pausa, victoria o derrota;
* reinicia el oxígeno al reiniciar el nivel.

Todas las cifras deben estar centralizadas en un archivo de constantes.

## 14. Levadura de Burbuja

La Levadura de Burbuja es el coleccionable principal.

Implementa:

* animación idle;
* flotación vertical suave;
* brillo de atracción al acercarse Bigotes;
* detección de recolección;
* animación de desaparición;
* sonido o placeholder de sonido;
* incremento del contador;
* ligera recuperación de oxígeno;
* partículas cálidas;
* actualización del HUD.

El objetivo inicial será recoger:

```text
3 Levaduras de Burbuja
```

Este valor debe ser configurable.

Si el spritesheet real tiene frames separados por padding, no uses automáticamente `load.spritesheet` suponiendo que están pegados. Inspecciona la imagen y elige una de estas opciones:

1. crear un atlas JSON;
2. cargar frames individuales;
3. utilizar `addSpriteSheetFromAtlas`;
4. generar una configuración de recorte basada en los márgenes reales.

Documenta la opción utilizada.

## 15. Enemigo: Rastrero de Salmuera

Crea una clase BrineCrawler o RastreroDeSalmuera.

Estados mínimos:

* idle;
* patrulla;
* alerta;
* persecución corta;
* ataque;
* recibir daño;
* aturdimiento breve;
* derrota.

Comportamiento:

1. Patrulla horizontalmente entre dos puntos.
2. Cambia de dirección al llegar a un borde o pared.
3. Detecta al jugador dentro de una distancia limitada.
4. Muestra brevemente el estado de alerta.
5. Persigue al jugador a corta distancia.
6. Ejecuta una embestida o zarpazo.
7. Causa daño por contacto o durante su hitbox de ataque.
8. Recibe daño del ataque de Bigotes.
9. Es derrotado después de pocos golpes.

Valores sugeridos:

* salud: 2;
* daño: 1;
* distancia de detección: 150 píxeles lógicos;
* distancia de ataque: 40 píxeles lógicos;
* tiempo entre ataques: 1.2 segundos.

No hagas que el enemigo detecte al jugador a través de todo el nivel.

Usa una máquina de estados simple y legible. No uses una librería externa para inteligencia artificial.

## 16. Combate

El ataque de Bigotes debe:

* tener anticipación breve;
* activar una hitbox temporal;
* respetar la orientación del personaje;
* evitar múltiples impactos durante un solo ataque;
* aplicar retroceso ligero;
* reproducir animación;
* tener cooldown;
* poder derrotar al Rastrero.

La hitbox no debe permanecer activa durante toda la animación.

Separa:

* hitbox física del jugador;
* hitbox de ataque;
* hurtbox del enemigo.

Añade un modo de depuración opcional para mostrar cuerpos físicos mediante una constante:

```js
DEBUG_PHYSICS = false;
```

## 17. Horno y receta

Crea un sistema sencillo de recetas.

Primera receta:

```text
Pan Térmico
Costo: 3 Levaduras de Burbuja
Función: activar la Compuerta de la Marea Térmica
```

El horno debe tener estados:

* inactivo;
* disponible;
* horneando;
* completado.

Interacción:

1. Bigotes entra en el área del horno.
2. Aparece el mensaje “Presiona E para usar el horno”.
3. Si faltan ingredientes, mostrar el progreso.
4. Si hay suficientes, iniciar horneado.
5. Bloquear la interacción durante aproximadamente 1.5 segundos.
6. Reproducir animación o efecto térmico.
7. Entregar el Pan Térmico.
8. Actualizar el objetivo.

No crees una interfaz compleja de crafting para este primer nivel.

## 18. Compuerta de la Marea Térmica

La compuerta es la meta del nivel.

Estados:

* inactiva;
* activándose;
* activa.

Reglas:

* inicialmente permanece cerrada;
* no puede abrirse sin el Pan Térmico;
* debe mostrar un mensaje al acercarse;
* la interacción se realiza con E;
* consume o utiliza el Pan Térmico;
* reproduce la animación completa de activación;
* evita que el jugador se mueva durante la secuencia final;
* emite burbujas, vapor y luz cálida;
* al terminar, marca el nivel como completado.

Después de la activación:

* oscurece suavemente la pantalla;
* muestra el mensaje “La ruta al Mercado Sumergido está abierta”;
* muestra una pantalla React con:

  * “Nivel completado”;
  * tiempo de partida;
  * ingredientes recogidos;
  * enemigos derrotados;
  * botón “Jugar de nuevo”;
  * botón “Volver al menú”.

No es necesario implementar todavía El Mercado Sumergido.

## 19. Animaciones

Crea todas las animaciones disponibles en los assets.

No supongas dimensiones sin revisar los archivos.

Centraliza la información en `animationData.js`, incluyendo:

* nombre de textura;
* nombre de animación;
* frames;
* frame rate;
* repetición;
* frame inicial;
* frame final;
* márgenes o padding;
* origen;
* escala.

Utiliza nombres consistentes, por ejemplo:

```text
bigotes-idle
bigotes-swim
bigotes-jump
bigotes-attack
bigotes-hurt
bigotes-defeat

crawler-idle
crawler-patrol
crawler-alert
crawler-attack
crawler-hurt
crawler-stunned
crawler-defeat

yeast-idle
yeast-attract
yeast-collect

gate-inactive
gate-activate
gate-active
```

Cuando una animación no exista, usa temporalmente el frame estático más apropiado sin romper el juego.

## 20. Colisiones y mapa

Usa Arcade Physics.

Debe haber colisiones para:

* jugador contra suelo;
* jugador contra plataformas;
* enemigos contra suelo;
* enemigos contra paredes;
* ataques contra enemigos;
* jugador contra zonas de daño;
* jugador contra coleccionables;
* jugador contra áreas de interacción;
* jugador contra límites del mapa.

Puedes construir el prototipo mediante:

* tilemap;
* plataformas estáticas;
* objetos definidos mediante datos;
* combinación de ambos.

Prioriza estabilidad y facilidad de edición.

Centraliza la colocación de elementos en `levelOneData.js`:

```js
export const LEVEL_ONE_DATA = {
  worldWidth: 4800,
  spawn: { x: 120, y: 200 },
  platforms: [],
  collectibles: [],
  enemies: [],
  oven: {},
  gate: {},
  checkpoints: []
};
```

No disperses posiciones mágicas por toda la escena.

## 21. Cámara

La cámara debe:

* seguir a Bigotes;
* tener suavizado;
* mantenerse dentro del mundo;
* mostrar suficiente espacio hacia la dirección en la que mira el personaje;
* evitar movimientos bruscos;
* aplicar un pequeño shake al recibir daño;
* aplicar un shake mayor al activarse la compuerta.

No uses zoom dinámico excesivo.

## 22. Tutorial contextual

Muestra instrucciones breves solo la primera vez que sean necesarias.

Ejemplos:

* “A / D para moverte”.
* “Espacio para saltar”.
* “J para atacar”.
* “E para interactuar”.
* “Recolecta Levadura de Burbuja”.
* “El oxígeno se agota con el tiempo”.

Los mensajes deben desaparecer automáticamente y no detener la partida.

No uses cuadros de diálogo largos.

## 23. Audio

Si existen archivos de audio, clasifícalos e intégralos.

Categorías:

* música ambiental;
* salto;
* ataque;
* daño;
* recolección;
* enemigo;
* horno;
* compuerta;
* victoria.

Si faltan sonidos:

* no descargues otros;
* crea funciones preparadas para añadirlos;
* evita errores por archivos inexistentes;
* permite jugar sin audio;
* deja comentarios claros.

El botón de sonido de React debe controlar música y efectos.

## 24. Pausa, derrota y reinicio

Al presionar Esc:

* pausa la escena;
* pausa el consumo de oxígeno;
* muestra un menú React;
* permite reanudar;
* permite reiniciar;
* permite volver al menú.

Derrota:

* ocurre cuando la salud llega a 0;
* también puede ocurrir por falta prolongada de oxígeno;
* detiene controles y sistemas;
* reproduce animación disponible;
* muestra pantalla React;
* permite reiniciar.

Al reiniciar:

* restablece enemigos;
* restablece ingredientes;
* restablece salud;
* restablece oxígeno;
* restablece receta;
* restablece compuerta;
* evita duplicar listeners del EventBus.

## 25. Responsive y experiencia web

La aplicación debe funcionar en escritorio y laptops.

Debe:

* mantener el canvas centrado;
* conservar relación de aspecto;
* mostrar barras laterales decorativas cuando sea necesario;
* evitar scroll accidental durante la partida;
* capturar teclas únicamente cuando el juego está activo;
* liberar listeners al desmontar;
* soportar redimensionamiento de ventana;
* mostrar un mensaje cuando la ventana sea demasiado pequeña.

No implementes controles táctiles en esta etapa.

## 26. Rendimiento

Mantén la demo ligera.

Debes:

* reutilizar partículas;
* destruir objetos que ya no se necesitan;
* evitar crear listeners dentro de `update`;
* evitar nuevos objetos en cada frame cuando sea posible;
* limitar partículas ambientales;
* utilizar grupos;
* evitar cálculos complejos de IA;
* evitar dependencias innecesarias;
* evitar fugas de memoria al volver al menú o reiniciar.

## 27. Manejo de errores

Añade validaciones para:

* assets ausentes;
* animaciones sin frames;
* audio ausente;
* referencias DOM inexistentes;
* destrucción duplicada de Phaser;
* eventos registrados múltiples veces;
* valores de configuración inválidos.

El juego debe continuar con placeholders cuando falte un asset no esencial.

Los errores deben aparecer claramente en consola, indicando:

* archivo faltante;
* sistema afectado;
* fallback utilizado.

## 28. Accesibilidad básica

Incluye:

* botones navegables con teclado;
* foco visible;
* contraste suficiente;
* atributo `aria-label` en botones de iconos;
* opción de desactivar screen shake;
* opción de reducir partículas;
* opción de silenciar sonido.

Estas opciones pueden estar en un panel simple de ajustes.

## 29. README

Crea o actualiza `README.md`.

Debe explicar:

1. Nombre del proyecto.
2. Tecnologías utilizadas.
3. Requisitos.
4. Instalación.
5. Ejecución.
6. Build de producción.
7. Estructura de carpetas.
8. Controles.
9. Flujo del primer nivel.
10. Cómo reemplazar placeholders.
11. Cómo configurar spritesheets.
12. Cómo agregar un nuevo enemigo.
13. Cómo añadir el siguiente nivel.
14. Lista de assets utilizados.
15. Problemas conocidos.
16. Créditos y procedencia de assets.
17. Qué partes fueron asistidas por IA.

## 30. Criterios de aceptación

La tarea no está terminada hasta cumplir lo siguiente:

* `npm install` funciona.
* `npm run dev` inicia la aplicación.
* `npm run build` termina sin errores.
* Aparece el menú inicial de React.
* El botón Jugar inicia Phaser.
* Bigotes puede moverse y saltar.
* El jugador puede atacar.
* Existe al menos un enemigo funcional.
* El enemigo patrulla, detecta, ataca, recibe daño y es derrotado.
* Existen al menos 3 Levaduras de Burbuja.
* Los coleccionables actualizan el HUD.
* El oxígeno disminuye.
* El horno valida los ingredientes.
* El jugador puede preparar el Pan Térmico.
* La compuerta no se abre antes de preparar la receta.
* La compuerta puede activarse.
* Existe una condición clara de victoria.
* Existe una condición clara de derrota.
* La pausa funciona.
* Reiniciar no duplica eventos.
* Las imágenes pixel art se ven nítidas.
* El canvas es responsive.
* No hay errores críticos en consola.
* El README está actualizado.

## 31. Pruebas finales

Después de implementar:

1. Ejecuta el proyecto.
2. Revisa errores de consola.
3. Comprueba el flujo completo desde menú hasta victoria.
4. Comprueba la derrota por salud.
5. Comprueba la derrota por oxígeno.
6. Comprueba la pausa.
7. Comprueba el reinicio varias veces.
8. Comprueba volver al menú y comenzar otra partida.
9. Comprueba el redimensionamiento.
10. Ejecuta el build de producción.
11. Corrige cualquier error encontrado.

Si el entorno permite pruebas automatizadas, añade pruebas mínimas para:

* RecipeSystem;
* OxygenSystem;
* cálculo de daño;
* actualización de inventario;
* condición de desbloqueo de la compuerta.

No añadas una infraestructura de testing excesiva.

## 32. Forma de trabajo y respuesta final

Trabaja en iteraciones:

### Iteración 1

* Inspección del repositorio.
* Inventario de assets.
* Configuración React, Vite y Phaser.
* Menú inicial.
* Escena cargable.

### Iteración 2

* Nivel y colisiones.
* Bigotes.
* Cámara.
* Parallax.

### Iteración 3

* Coleccionables.
* Oxígeno.
* HUD.
* Tutorial.

### Iteración 4

* Rastrero de Salmuera.
* Combate.
* Daño y derrota.

### Iteración 5

* Horno.
* Pan Térmico.
* Compuerta.
* Victoria.

### Iteración 6

* Audio.
* Pulido.
* Responsive.
* Pruebas.
* README.
* Build final.

Al terminar, responde con:

1. Resumen de lo implementado.
2. Árbol de archivos creados o modificados.
3. Assets encontrados y utilizados.
4. Placeholders pendientes.
5. Comandos para ejecutar.
6. Controles.
7. Decisiones técnicas importantes.
8. Resultado de `npm run build`.
9. Problemas conocidos.
10. Próximos pasos recomendados.

No entregues únicamente fragmentos de código o explicaciones. Modifica y completa realmente el proyecto para dejar una demo jugable.
~~~~

</details>

## Anexo B — Prompt de navegabilidad

<details>
<summary>Mostrar prompt literal</summary>

~~~~text
Quiero que revises y mejores la estructura funcional de los niveles del proyecto actual.

La implementación visual y la base del juego ya funcionan, pero actualmente existen problemas importantes de navegación:

* El salto del personaje tiene muy poco alcance horizontal y vertical.
* Algunas plataformas y estructuras no pueden alcanzarse.
* Hay colisiones que bloquean caminos que visualmente deberían ser transitables.
* Ciertas zonas requieren movimientos que el jugador todavía no puede realizar.
* Algunas plataformas están separadas sin considerar las capacidades reales del personaje.

Antes de modificar código, inspecciona:

1. El controlador actual del jugador.
2. Los valores de velocidad, aceleración, salto, gravedad y control aéreo.
3. Los colliders del personaje, plataformas, terreno y elementos decorativos.
4. La distancia y altura entre plataformas.
5. La estructura completa de cada nivel existente.
6. Las capas de colisión y la configuración de la matriz de físicas de Unity.

## Objetivo principal

Haz que todos los niveles puedan recorrerse completamente utilizando las habilidades disponibles del personaje.

No quiero que simplemente aumentes exageradamente la fuerza del salto. El movimiento y el diseño de niveles deben ajustarse de manera conjunta para mantener una sensación controlada, consistente y divertida.

## Movimiento del jugador

Ajusta el controlador para que tenga:

* Una velocidad horizontal adecuada para plataformas 2D.
* Aceleración y desaceleración progresivas.
* Buen control horizontal mientras está en el aire.
* Un salto ligeramente más alto y con mayor alcance horizontal.
* Altura de salto variable dependiendo de cuánto tiempo se mantenga presionado el botón.
* Coyote time para permitir saltar unos instantes después de abandonar una plataforma.
* Jump buffer para registrar el salto unos instantes antes de tocar el suelo.
* Caída ligeramente más rápida que la subida para mejorar la sensación del salto.
* Límite de velocidad de caída.
* Detección de suelo confiable.

Configura todos los valores relevantes mediante campos serializados para que puedan ajustarse desde el Inspector sin modificar código.

No agregues doble salto, dash, wall jump ni nuevas habilidades, salvo que ya formen parte del diseño actual del personaje.

## Diseño funcional de niveles

Revisa y modifica la posición de plataformas y estructuras tomando como referencia las capacidades finales del movimiento.

Cada salto obligatorio debe:

* Estar dentro del alcance real del personaje.
* Tener suficiente margen para no exigir precisión perfecta.
* Contar con una zona segura de aterrizaje.
* Ser legible visualmente.
* Evitar que la cabeza del personaje choque con plataformas superiores.
* Evitar esquinas o bordes que detengan al jugador de forma inesperada.

Los primeros saltos deben ser fáciles y permitir que el jugador comprenda el movimiento. La dificultad puede aumentar gradualmente, pero ninguna sección debe depender de errores de colisión o saltos extremadamente precisos.

Mantén una ruta principal claramente transitable. Las rutas secundarias, coleccionables o secretos pueden requerir mayor precisión, pero deben seguir siendo alcanzables.

## Colisiones

Corrige todos los colliders problemáticos.

* Los elementos puramente decorativos no deben bloquear al jugador.
* Los colliders deben coincidir razonablemente con la superficie visible.
* Evita usar colliders rectangulares demasiado grandes sobre formas irregulares.
* Simplifica los colliders cuando sea posible para evitar que el personaje se atore.
* Revisa uniones entre tiles para que no existan pequeños bordes que frenen el movimiento.
* Separa correctamente las capas de terreno, plataformas, decoración, enemigos y triggers.
* Verifica que los triggers no funcionen como obstáculos sólidos.
* Revisa el tamaño del collider del jugador para que no sea más ancho o alto que su cuerpo visible.

En superficies formadas por tiles, utiliza la configuración apropiada de Tilemap Collider 2D y Composite Collider 2D cuando resulte conveniente, evitando una gran cantidad de pequeñas colisiones independientes.

## Validación obligatoria

Después de realizar los cambios, prueba cada nivel desde el punto inicial hasta la salida o portal.

Comprueba que:

* El jugador puede completar el nivel sin usar herramientas de depuración.
* No existen plataformas obligatorias inaccesibles.
* El jugador no atraviesa el suelo.
* El jugador no se queda atrapado entre colliders.
* No existen paredes invisibles.
* Los objetos decorativos no bloquean el recorrido.
* El salto se siente consistente en todas las zonas.
* Las distancias entre plataformas corresponden con el movimiento real.
* El jugador puede regresar de zonas secundarias cuando sea necesario.
* El portal o final del nivel siempre es alcanzable.

Para validar las distancias, calcula o prueba el alcance aproximado máximo del salto del personaje y úsalo como referencia al colocar plataformas. Los saltos obligatorios normales no deberían utilizar el 100 % de ese alcance; deja un margen razonable para el jugador.

## Herramientas de depuración

Agrega temporalmente visualizaciones de depuración para:

* Ground check.
* Collider del jugador.
* Dirección y velocidad actual.
* Puntos de inicio y aterrizaje de saltos importantes.
* Superficies transitables.
* Zonas bloqueadas por colliders.

Estas herramientas deben poder desactivarse fácilmente y no deben quedar visibles en la versión final.

## Restricciones

* No reconstruyas el proyecto desde cero.
* No reemplaces sistemas que ya funcionan sin una razón técnica.
* No cambies el estilo visual del juego.
* No elimines plataformas o elementos importantes sin intentar primero reposicionarlos o corregir sus colisiones.
* Respeta la arquitectura y organización actual del proyecto.
* Evita valores mágicos dispersos en el código.
* No dejes secciones incompletas, TODOs ni pseudocódigo.
* No simules que probaste una sección si no puede validarse dentro del proyecto.

## Entrega esperada

Al finalizar:

1. Implementa directamente los cambios necesarios.
2. Indica qué archivos y escenas modificaste.
3. Documenta los valores finales del movimiento.
4. Explica brevemente los problemas de colisión encontrados.
5. Enumera las plataformas o secciones que fueron reposicionadas.
6. Señala cualquier zona que todavía requiera revisión manual.
7. Incluye instrucciones breves para ajustar posteriormente el salto y las distancias desde el Inspector.

La prioridad es que el nivel sea completamente recorrible, que el movimiento se sienta bien y que las colisiones coincidan con lo que el jugador observa en pantalla.
~~~~

</details>
