# MASTER — CBT App Design System

Fuente generadora: skill `ui-ux-pro-max` (`search.py --design-system`, 2026-10-12). Este archivo es la **decisión curada**, no la salida cruda: cada token tiene motivo; lo rechazado está abajo con su motivo. Manda el orden de conflictos del proyecto (privacidad → a11y → specs UX → arquitectura → sugerencias externas).

## Dirección (decisión del dueño + prototipo `ctb-exercises`)

Cálida, sin eléctricos, tonos pastel, calma y consistencia durante los ejercicios. Lenguaje adoptado del prototipo: fondo crema, tinta teal profunda, primario teal, acento terracota, salvia como apoyo. Titulares en Fraunces (display, solo h1), cuerpo en Inter. Nada de neones, nada de violeta tech, nada de marketing.

## Rechazado del generador (con motivo)

- **Patrón Hero + Testimonios + CTA**: landing de conversión; la app no tiene landing ni testimonios. Sin uso.
- **Primario violeta `#8B5CF6` + fondo lavanda**: frío/tech, contradice D1. (La propia skill lista los púrpura-AI como anti-patrón en contextos serios.)
- **Lora + Raleway**: descartadas por D3; en su lugar **Fraunces solo para titulares display** (viene del prototipo, convive con Inter en el cuerpo).
- **Scroll Reveal + GSAP**: animación por scroll de 300–400ms en formularios = distracción + dependencia nueva sin necesidad. Movimiento: solo hovers 150/250ms + la regla global `reduced-motion` ya existente.
- **CTA vibrante / conversión**: no hay conversión que optimizar; hay personas escribiendo sobre sus emociones.

## Aceptado (adaptado)

- Estilo Minimalismo & Swiss: limpio, espacioso, alto contraste, riesgo bajo en movimiento.
- Dials: varianza 2 (consistencia), motion 2 (sutil), densidad 5 (formularios).
- Checklist pre-entrega de la skill (sin emojis como íconos → Lucide; contraste 4.5:1; foco visible; reduced-motion; responsive 375/768/1024/1440).

## Tokens

### Color — modo claro (medido por script, todo ≥ 4.5:1 salvo bordes ≥ 3:1)

| Rol | Valor | Motivo |
|---|---|---|
| `background` | `#FAF6F1` papel cálido | Calma; base de todo |
| `foreground` | `#1A2E2C` tinta teal profunda | Legibilidad sin negro puro |
| `card` / `popover` | `#FFFFFF` | Apenas sobre el fondo |
| `muted` / arena | `#F3EDE4` | Superficies secundarias cálidas |
| `secondary` | `#DCE9E1` velo salvia | Pistas frías dentro de lo cálido |
| `accent` | `#F3E0D8` velo terracota | Calidez en hovers/selección |
| `border` / `input` | `#96865F` arena media (3.32:1) | Límite visible sin gritar (WCAG 1.4.11) |
| `primary` (links, botones, foco) | `#1E4D4B` teal profundo (9.47 blanco / 8.80 papel) | Calma + autoridad |
| `success` | `#2E7D4F` verde contenido (5.05 blanco) | Sin neones |
| `warning` | texto `#78350F` sobre `#FEF3C7` (8.15) | Patrón badge tinta-sobre-tinte |
| `error` | `#DC2626` (4.52 papel) | Se mantiene |

### Color — modo oscuro (espejo diseñado, medido)

Fondo teal-nocturno `#0E1F1E`, superficies `#1A2E2C`, tinta crema `#F3EDE4`, primario salvia clara `#7BA89C` (6.42 en ambos roles), bordes `#52756E` (3.35), acento `#1E3835`. Semánticos: success `#2E7D4F` + blanco, warning `#451A03` + `#FCD34D`, error `#F87171`.

### Tipografía (D3: Inter en cuerpo + Fraunces display en h1)

Inter vía `next/font` (latin cubre ES). Fraunces vía `next/font` con variable `--font-display`, solo titulares `h1` (clase `font-display`). Escala sin excepciones: 12/14/16/18/20/24/30. **Inputs y textareas a 16px mínimo** (iOS hace zoom bajo 16px). Interlineado ≥ 1.5 en textos largos.

### Forma y movimiento

- Radios: `1.125rem` base (`--radius`, del prototipo), pill `full`. Sombras contenidas (`sm/md`, nunca decorativas).
- Espaciado base 4 (default Tailwind, se queda).
- Movimiento 150/250ms easing estándar + regla global `prefers-reduced-motion` (ya existe, verificar que cubra lo nuevo).

## Componentes (mapeo a slices)

Existentes a alinear a tokens: Button, Card, Slider, Select, Stepper, ProgressBar, EmptyState, Skeleton, Dialog, Input, Textarea, Label. Faltantes: Tabs, Badge, BottomNav (shell MVP 3), CrisisBanner (shell MVP 5). Toast: eliminado (D2 — sin caso de uso en la lógica actual; se reintroduce si el MVP 3+ lo pide). `duration-300` suelto → token 250.

## Responsive (mobile-first desde el token)

Sin anchos fijos; todo refluve (texto resiliente, chips con `+n` operable). Tabla `RowsField`: apilar o scroll contenido a 360px. Gate: capturas 360/768/1280 × claro/oscuro.

## Overrides por página

Si una pantalla necesita desviarse, va en `design-system/cbt-app/pages/<pantalla>.md` (solo desvíos; el MASTER manda en todo lo demás). Hoy: ninguna.
