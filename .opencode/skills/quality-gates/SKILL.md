---
name: quality-gates
description: Define y ejecuta las verificaciones que un cambio debe pasar antes de darse por terminado y de proponer un commit en la app CBT: typecheck, lint, tests de frontend y backend, build, chequeo automático de accesibilidad, contrato de ejercicios, capturas de pantalla y recorrido por teclado. Usala SIEMPRE al cerrar cualquier slice o tarea de código, antes de decir "listo", "terminé" o proponer un commit, y cuando el usuario pregunte si algo está bien o si funciona; también para agregar herramientas de test que falten.
---

# Quality gates (definición de listo ejecutable)

## Regla central
**Nada está terminado hasta que los gates corrieron y pasaron.** No
declares "listo" por haber escrito el código. Mostrá la evidencia: comando
ejecutado y resultado resumido. Si no pudiste correr algo, decilo, no lo
omitas en silencio.

## Paso 1 — Detectar qué hay
Leé los `scripts` de `package.json` (raíz y `server/`). Armá la lista real
de gates disponibles. No asumas nombres de scripts.

## Paso 2 — Orden de ejecución (cortar al primer fallo)
1. **Typecheck** (`tsc --noEmit` o el script del proyecto).
2. **Lint.**
3. **Tests unitarios y de integración** (frontend y backend).
4. **Build de producción.**
5. **Accesibilidad automatizada** sobre las pantallas tocadas.
6. **E2E del flujo tocado** (si el proyecto tiene runner).
7. **Revisión visual y de teclado** (checklist de abajo).

## Paso 3 — Si falta herramienta
No la agregues sin explicar. Proponé de a una, con el problema que
resuelve, y un slice propio. Camino mínimo razonable: Vitest + Testing
Library para frontend y servidor, Playwright para flujos y capturas, y
`@axe-core/playwright` para accesibilidad. Verificá versiones y
compatibilidad con el stack en la doc oficial.

## Verificaciones específicas del proyecto
- **Contrato de ejercicios:** test que recorre todas las definiciones y
  comprueba ids únicos por ejercicio, tipos de campo soportados por el
  renderer y que los ids no cambiaron respecto de una instantánea guardada
  (cambiarlos exige subir `exercise_version`).
- **Datos:** base temporal para tests de API; test de que una instancia nueva
  no hereda estado del momento; test de migración.
- **Autoguardado:** simulá fallo de red y comprobá que no se pierde lo escrito.
- **Privacidad:** buscá que ningún log ni mensaje de error incluya respuestas.

## Checklist visual y de teclado (manual o con Playwright)
- Capturas en 375, 768 y 1280 px, en claro y oscuro, del flujo tocado.
- Recorrer el flujo solo con teclado: orden de tabulación lógico, foco
  visible, el foco se mueve al cambiar de paso, se puede completar y guardar.
- Sin scroll horizontal en móvil.

## Reglas
- **Nunca** debilites un test, desactives una regla de lint ni uses
  `any`/`@ts-ignore` para hacer pasar un gate. Si un gate falla, arreglá la
  causa o reportá el bloqueo.
- Un fallo preexistente se reporta como tal y no se mezcla con el slice.
- Commit solo con gates en verde. El mensaje (Conventional Commits) se
  propone y se espera confirmación.

## Reporte de cierre
```
## Gates
| Gate | Comando | Resultado | Notas |
## Evidencia (salida relevante, capturas)
## No verificado (y por qué)
## Mensaje de commit propuesto
## Preguntas de chequeo (1-2)
```
