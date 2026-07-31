# NEXA Academy Design System

## Design direction

The visual direction combines premium industrial education with technical editorial clarity. It treats the product like a museum object while keeping wiring, settings, and safety information calm and legible.

Design controls used from the project brief:

- design variance: 7
- motion intensity: 6
- visual density: 6

Four image-first reference compositions are preserved in `docs/design-references/`: language gate, model selection, academy dashboard, and mobile home.

## Brand color tokens

| Token | Value | Use |
|---|---|---|
| Brand primary | `#122C4F` | NEXA navy, major surfaces, primary actions |
| Brand primary strong | `#0D223E` | Deep technical stage |
| Brand accent | `#891525` | NEXA red, one controlled attention accent |
| Canvas | `#F4F6F8` | App background |
| Raised | `#FBFCFD` | Panels and controls |
| Technical | `#E8EDF2` | Technical diagrams and secondary surfaces |
| Text primary | `#172338` | Main text |
| Text secondary | `#5C6878` | Supporting text |
| Border subtle | `#CCD5DE` | Dividers and structure |

Energy semantics use amber for solar, blue for grid, green for battery, and NEXA red for load. Safety colors are separate from brand accent.

## Typography

- Persian: Vazirmatn
- English: IBM Plex Sans on web, native system sans on mobile
- Numeric readouts: IBM Plex Sans or platform monospace-like presentation

The repository includes web font packages and Expo font loading. No network font fetch is required at runtime.

## Shape and spacing

- control radius: 10 px
- panel radius: 16 px
- pill radius: 999 px, reserved for status and segmented metadata
- spacing system: 4 to 96 px shared tokens

Cards are used only for meaningful conceptual units. Lists and dividers carry dense settings and specification data.

## Motion

- quick: 160 ms
- standard: 280 ms
- educational: 600 ms
- easing: `cubic-bezier(0.16, 1, 0.3, 1)`

Motion is limited to state transition, progress, product presence, and navigation feedback. `prefers-reduced-motion` disables non-essential web motion.

## Accessibility

- RTL and LTR switch at the document level on web
- explicit text alignment and row direction on mobile
- keyboard-visible focus
- semantic buttons and landmarks
- modal focus management through Radix Dialog
- accordion semantics through Radix Accordion
- status never communicated only by color
- safety-critical sections carry both icon and text
- body and action contrast targets WCAG AA

## Component approach

The web app uses open-code shadcn-style primitives composed from Radix and local CSS: Button, Badge, Progress, Accordion, Dialog, and Tabs. The mobile app consumes the same data and token contract through native React Native components.
