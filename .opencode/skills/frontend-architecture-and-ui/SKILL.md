---
name: frontend-architecture-and-ui
description: Implementa o refactoriza el frontend de la app CBT (Next.js/React/TypeScript/Tailwind/Radix) a partir de las specs de UX: estructura de carpetas, motor de ejercicios renderizado desde datos, componentes (wizard, escalas, tarjetas repetibles, ayudas, resumen antes/después), estados de carga/error/guardado, sistema de diseño, modo claro/oscuro y accesibilidad WCAG 2.2 AA. Usala SIEMPRE que haya que escribir o modificar UI, componentes, páginas, estilos, navegación o el renderer de ejercicios, aunque el pedido sea chico como "agregá un campo" o "mejorá cómo se ve".
---

# Arquitectura y UI del frontend

## Entrada y salida
- **Entrada:** spec de UX (secciones 4, 5, 6, 8, 9) y el slice aprobado del
  backlog. Sin spec para ese ejercicio, frená y pedí generarla con
  `cbt-exercise-ux-interpreter`.
- **Salida:** un slice chico que deja la app funcionando.
- **Antes de escribir:** leé `package.json`, la estructura actual y los tipos
  del motor. No asumas versiones: si dudás de una API, consultá la doc oficial.

## Principios de arquitectura
1. **Ejercicios = datos; UI = renderer genérico.** Agregar o cambiar un
   ejercicio no debería requerir tocar componentes. Si una spec necesita
   algo nuevo, se extiende el motor (tipo de campo nuevo) y se documenta;
   no se escribe un componente especial para un solo ejercicio.
2. **Tipos con uniones discriminadas** y chequeo de exhaustividad (`never`)
   en el renderer: si se agrega un tipo y falta renderizarlo, no compila.
3. **Estructura por funcionalidad** (propuesta, migrar de a poco y solo con
   slice aprobado): `features/exercises` (motor y renderer),
   `features/history`, `components/ui` (primitivas), `lib`, `api`.
4. **Separar:** datos (definiciones), lógica (hooks/reducers) y presentación.
   Componentes de campo **controlados**; el estado de la instancia vive en
   un solo lugar y es inmutable.
5. **Límites cliente/servidor (Next App Router):** el contenedor y las
   páginas estáticas pueden ser Server Components; todo lo interactivo del
   formulario es `"use client"`, lo más abajo posible en el árbol.
6. **Textos fuera de los componentes:** el microcopy vive en las
   definiciones (es-AR), no en el JSX.
7. **Dependencias:** no agregues ninguna sin explicar qué problema resuelve
   y por qué no alcanza lo existente. Preferí primitivas accesibles ya
   instaladas (Radix) antes que construir a mano.

## Componentes que el motor necesita
`WizardShell` (progreso, atrás/siguiente, foco), `ScaleField` (escala
accesible), `ChoiceField` (única y múltiple con límite), `RepeatableCards`,
`ReadOnlyBlock` (guiones y consignas), `HintDisclosure` (ayudas plegables),
`BeforeAfter` (cambio de escala dentro de la instancia), `Recap` (resumen
de cierre), `SaveStatus` (guardando/guardado/error). Se implementan según
lo pidan las specs, no todos de golpe.

## UX en implementación
- Una tarea cognitiva por pantalla; arrastrar al siguiente paso lo que la
  persona ya escribió (nadie reescribe lo mismo).
- Estados completos: carga (esqueleto), vacío, error con reintento, guardado.
  Backend caído = mensaje claro, nunca pantalla rota.
- Mobile primero; sin grillas anchas; objetivos táctiles amplios.
- Visual sobrio y calmo: tokens de diseño (variables CSS + tema de
  Tailwind), modo claro/oscuro, `prefers-reduced-motion` respetado.

## Accesibilidad (WCAG 2.2 AA) — no negociable
- Cada campo con `label` asociado; errores vinculados con `aria-describedby`.
- **Cambio de paso:** mover el foco al título del paso nuevo y anunciarlo
  (`aria-live`). El progreso es texto ("Paso 3 de 6"), no solo barra.
- Todo operable con teclado; foco visible; sin atrapar foco fuera de diálogos.
- Escalas: operables con teclado y con alternativa numérica; no depender de
  arrastrar (2.5.7); valor siempre en texto.
- Objetivos interactivos de al menos 24×24 px (2.5.8).
- No pedir de nuevo información ya ingresada en la misma instancia (3.3.7).
- Contraste suficiente; el color nunca es la única señal.
- Usar `<button>`, `<fieldset>/<legend>`, encabezados en orden; ARIA solo
  cuando el HTML nativo no alcanza.

## Listo cuando (ejecutar con `quality-gates`)
- typecheck, lint y build pasan.
- Tests de componentes de los campos tocados y chequeo automático de
  accesibilidad sin violaciones nuevas.
- Recorrido manual con teclado del flujo tocado y capturas en móvil y
  escritorio, claro y oscuro.
- Explicá en pocas líneas qué decidiste y por qué, y hacé 1-2 preguntas de
  chequeo antes de proponer el commit.
