# MASTER — CBT App Design System

Fuente generadora: skill `ui-ux-pro-max` (`search.py --design-system`, 2026-10-12). Este archivo es la **decisión curada**, no la salida cruda: cada token tiene motivo; lo rechazado está abajo con su motivo. Manda el orden de conflictos del proyecto (privacidad → a11y → specs UX → arquitectura → sugerencias externas).

## Dirección (decisión del dueño, D1)

Cálida, sin eléctricos, tonos pastel, calma y consistencia durante los ejercicios. Superficies en tintes suaves; tinta profunda para legibilidad. Nada de neones, nada de violeta tech, nada de marketing.

## Rechazado del generador (con motivo)

- **Patrón Hero + Testimonios + CTA**: landing de conversión; la app no tiene landing ni testimonios. Sin uso.
- **Primario violeta `#8B5CF6` + fondo lavanda**: frío/tech, contradice D1. (La propia skill lista los púrpura-AI como anti-patrón en contextos serios.)
- **Lora + Raleway**: D3 decidió Inter (ya carga optimizada, legible, cubre ES; Raleway light lastima legibilidad emocional).
- **Scroll Reveal + GSAP**: animación por scroll de 300–400ms en formularios = distracción + dependencia nueva sin necesidad. Movimiento: solo hovers 150/250ms + la regla global `reduced-motion` ya existente.
- **CTA vibrante / conversión**: no hay conversión que optimizar; hay personas escribiendo sobre sus emociones.

## Aceptado (adaptado)

- Estilo Minimalismo & Swiss: limpio, espacioso, alto contraste, riesgo bajo en movimiento.
- Dials: varianza 2 (consistencia), motion 2 (sutil), densidad 5 (formularios).
- Checklist pre-entrega de la skill (sin emojis como íconos → Lucide; contraste 4.5:1; foco visible; reduced-motion; responsive 375/768/1024/1440).

## Tokens

### Color — modo claro (propuesta; DS-2 mide contraste por token)

| Rol | Valor | Motivo |
|---|---|---|
| `background` | `#FAF7F2` papel cálido | Calma; base de todo |
| `foreground` | `#292524` tinta cálida (stone-800) | Legibilidad sin negro puro (menos duro) |
| `card` | `#FFFDF9` | Apenas sobre el fondo |
| `muted` / arena | `#F1EAE0` | Superficies secundarias cálidas |
| `border` | `#E5DCCC` | Bordes que no gritan |
| `primary` (links, acentos, foco) | `#B45309` terracota profundo (amber-700) | Cálido + pasa 4.5:1 sobre papel (a medir en DS-2) |
| `success` | `#4D7C0F` salvia profunda | Calma; a medir |
| `warning` | texto `#78350F` sobre `amber-100` | Patrón badge tinta-sobre-tinte (nunca color solo) |
| `error` | `#DC2626` (se mantiene) | Ya medido: 5:1 sobre blanco |

### Color — modo oscuro (espejo, no inversión automática)

Fondo espresso `#1C1917`, superficies `#292524`, tinta `#F5F0E8`, primario ámbar claro `#FBBF24` (a medir sobre espresso). Muted/border en piedra oscura. Semánticos en tintes oscuros con texto claro.

### Tipografía (D3: Inter queda)

Inter vía `next/font` (latin cubre ES). Escala del roadmap sin excepciones: 12/14/16/18/20/24/30 — el `text-3xl` (36) de la home baja a 30. **Inputs y textareas a 16px mínimo** (iOS hace zoom bajo 16px). Interlineado ≥ 1.5 en textos largos.

### Forma y movimiento

- Radios: `0.5rem` base (`--radius`), pill `full`. Sombras contenidas (`sm/md`, nunca decorativas).
- Espaciado base 4 (default Tailwind, se queda).
- Movimiento 150/250ms easing estándar + regla global `prefers-reduced-motion` (ya existe, verificar que cubra lo nuevo).

## Componentes (mapeo a slices)

Existentes a alinear a tokens: Button, Card, Slider, Select, Stepper, ProgressBar, EmptyState, Skeleton, Dialog, Input, Textarea, Label. Faltantes: Tabs, Badge, BottomNav (shell MVP 3), CrisisBanner (shell MVP 5). Toast: eliminado (D2 — sin caso de uso en la lógica actual; se reintroduce si el MVP 3+ lo pide). `duration-300` suelto → token 250.

## Responsive (mobile-first desde el token)

Sin anchos fijos; todo refluve (texto resiliente, chips con `+n` operable). Tabla `RowsField`: apilar o scroll contenido a 360px. Gate: capturas 360/768/1280 × claro/oscuro.

## Overrides por página

Si una pantalla necesita desviarse, va en `design-system/cbt-app/pages/<pantalla>.md` (solo desvíos; el MASTER manda en todo lo demás). Hoy: ninguna.
