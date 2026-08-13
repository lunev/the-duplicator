# Dark theme recipe (reusable across extensions)

Portable spec of dark-theme changes made to the `manage-x` extension, matching
its dark palette and input styling to `0hours`. Point Claude at this file to
replicate the same changes in another extension in this account
(`the-duplicator`, `parents-reminder`, `pdf-compressor`, etc.).

Applies to shadcn/ui + Tailwind v4 projects using `.dark` class toggling
(`@custom-variant dark (&:is(.dark *));`) and CSS custom properties for theme
tokens.

## 1. Match dark palette to 0hours' reference values

0hours' `.dark` block (`app/src/assets/index.css`) uses raw OKLCH:

```
--background: #202124        (→ HSL 225 6% 13%)
--card / --popover: #292a2d  (→ HSL 225 5% 17%)
--foreground: rgb(196,199,197) (→ HSL 140 3% 77%)
--secondary / --muted: oklch(0.2 0 0)        (→ HSL 180 0% 9%)
--secondary-fg: oklch(0.85 0 0)              (→ HSL 0 0% 81%)
--muted-foreground: oklch(0.6 0 0)           (→ HSL 240 0% 50%)
--destructive: oklch(0.396 0.141 25.723)     (→ HSL 359 69% 30%)
--destructive-foreground: oklch(0.637 0.237 25.331) (→ HSL 357 96% 58%)
--border / --input: oklch(0.25 0 0)          (→ HSL 0 0% 13%)
```

**Rule:** apply these to `background, card, card-foreground, popover,
popover-foreground, foreground, secondary(-foreground), muted(-foreground),
destructive(-foreground), border, input`. **Keep the target extension's own
`primary`, `ring`, and `accent`(-foreground)** — don't overwrite brand color
unless asked.

**Format check first:** if the target's `--color-x` mapping wraps values in
`hsl(var(--x))` (older shadcn style, like manage-x), convert the OKLCH/hex
above to HSL triplets (`H S% L%`, no `hsl()` wrapper) before pasting into
`.dark`. If it uses raw OKLCH directly (like 0hours), paste the OKLCH values
unchanged.

## 2. Flatten the body background

Remove any decorative body background (gradient class, inline style, etc.)
from the entry HTML — delete the class from `<body>` and, if unused
elsewhere, delete its CSS rule. Rely on the existing
`body { @apply bg-background text-foreground; }` in `@layer base` for a flat
single-color background, matching 0hours.

## 3. Darken input-like controls in dark mode

Add these Tailwind classes (all `dark:`-scoped, light mode untouched):

| Component | Add |
|---|---|
| `Input` | `dark:bg-input` (fully opaque, was `bg-transparent`) and `dark:shadow-none` |
| `Textarea` | same as `Input` |
| Select-like trigger (e.g. outline `Button` variant used as a combobox/select trigger) | `dark:bg-input dark:hover:text-foreground` + `dark:shadow-none`; drop any separate `dark:hover:bg-*` override that duplicates the base color (hover falls back to the existing `hover:bg-accent`) |
| `Switch` | `dark:shadow-none` on both the track and the thumb |
| `Checkbox` | `dark:shadow-none` |

Net effect: form fields sit visibly darker/flatter than their surrounding
card/background in dark mode, with no drop shadows.

## Open questions to confirm per-target

- Swap `primary`/`accent` to 0hours' yellow, or keep the target's own brand
  color? (Default: keep the target's brand color.)
- Does the target even have a `.dark` theme / theme toggle wired up yet? If
  not, that needs to exist before any of the above is meaningful.
