# Bitacora de desarrollo

## Uso de asistentes de IA

### 1. Configuración inicial del proyecto
- **Prompt utilizado:** Bueno tengo un reto a construir para la selccion de un aprendiz en el area de desarrollo este es construir una mini app, tengo plazo hasta el domingo a las 5 de la tarde, entonces te lo voy a mandar, quiero que lo veas, me hables, me cuentes que tal lo vez, esta muy dificil, un paso a paso como iniciar, que hacer de primero y cosas asi, creo que de vez en cuando pueda que te pida ayuda en algunas cosas porque son con tecnologías que aun no he utilizado, si las conozco pero no las he usado, ahi te lo paso y dime que tal, quiero empezar ya, entonces mas que todo me gustaria que me guiaras, si llego a pedir tu ayuda, me gustaria que me explicaras ademas de ayudarme, espero tu respuesta.
- **Qué se aceptó y por qué:** Los scripts de `package.json` y la lista de dependencias, revisando para qué sirve cada una. Los comandos para crear la estructura de capas (que viene definida en el PDF) y las carpetas adicionales `config` y `utils`.
- **Qué se rechazó o modificó y por qué:** El `tsconfig.json` generado por `tsc --init` traía opciones que no encajaban con el proyecto: `types: []` (impedía reconocer `process` y `console`), `verbatimModuleSyntax` y `jsx` (...escribe aquí el motivo con tus palabras). Se ajustaron siguiendo la recomendación de la IA. Mi `.gitignore` inicial usaba `*.env`; (indica si adoptaste la mejora `.env.*` + `!.env.example` y por qué).
- **Verificación realizada:** `npx tsc --noEmit` sin errores una vez existió `src/index.ts`, `/health` respondiendo correctamente y `git status` sin `node_modules`.

### Decisiones sin asistencia de IA
(Se completará durante el desarrollo, con decisiones reales de diseño y codificación.)

## Retos y Soluciones
- **Reto:** PostgreSQL quedó instalado pero `psql` no se reconocía. **Solución:** Se resolvio agregando la carpeta bin de PostgreSQL al PATH de las varibles de entorno del sistema.
- **Reto:** Error TS18003 ("No inputs were found"). **Solución:** Era esperable porque `src` no tenía archivos `.ts`; desapareció al crear `src/index.ts`.