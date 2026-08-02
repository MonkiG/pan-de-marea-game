# Instrucciones para agentes

Estas reglas aplican a cualquier agente o asistente que trabaje en este repositorio.

## Fuente de verdad

- Lee este archivo completo antes de modificar el proyecto.
- `AGENTS.md` es la fuente canónica de instrucciones del repositorio.
- `CLAUDE.md` remite a este documento; no dupliques reglas distintas allí.
- Respeta también las instrucciones de mayor prioridad proporcionadas por el entorno o por el usuario.

## Registro obligatorio de prompts

Todo prompt del usuario relacionado con el proyecto debe documentarse en `PROMPTS.md` dentro del mismo conjunto de cambios.

Para cada prompt:

1. Ubícalo bajo la sección de la feature correspondiente; crea una sección si no existe.
2. Registra fecha, título descriptivo y texto literal del prompt.
3. Resume qué se implementó o decidió como consecuencia.
4. Enumera los archivos relevantes.
5. Registra los commits relacionados por SHA corto y asunto.
6. Si todavía no existe commit, escribe `pendiente (working tree)`; no inventes un SHA.
7. Si un prompt corrige o reemplaza otro, conserva ambos y enlaza la corrección.
8. Si el prompt no produce cambios de código, indícalo expresamente.

El registro se organiza por feature, no únicamente por fecha. Dentro de cada feature, conserva el orden cronológico.

## Qué debe documentarse

- Solicitudes de implementación, corrección, diseño, documentación y configuración.
- Decisiones funcionales o técnicas acordadas en la conversación.
- Correcciones del usuario que cambien el entregable.
- Peticiones de commits, publicación o configuración de repositorio.
- Prompts adjuntos; su contenido debe quedar incorporado o resumido fielmente si es excesivamente extenso.

No documentes mensajes internos del sistema, instrucciones privadas del entorno, tokens, credenciales, secretos ni datos personales innecesarios. Si un prompt contiene un secreto, reemplázalo por `[REDACTADO]` y deja constancia de la redacción.

## Commits

- Usa commits semánticos y acotados cuando el usuario haya autorizado hacer commits.
- No asocies un prompt a un commit que no contenga realmente su implementación.
- Un prompt puede apuntar a varios commits y un commit puede resolver varios prompts relacionados.
- Actualiza referencias `pendiente` cuando exista un commit comprobable en el historial.
- No reescribas historial sólo para insertar el SHA del commit en su propia entrada.

## Cierre de una tarea

Antes de responder que una tarea está terminada:

- comprueba que el prompt actual esté en `PROMPTS.md`;
- verifica que los archivos y commits documentados sean reales;
- ejecuta las validaciones proporcionales al cambio;
- informa con honestidad cualquier elemento pendiente o no validado.
