# Portfolio web design practices

This guide records the design decisions used in William Anthony's portfolio so new sections can feel like part of the same site. It describes the current direction and the rules to preserve when extending it.

For exact color values and the proposed light palette, see [color-system.md](color-system.md). The light palette is a documented proposal; the site currently uses its dark theme.

## Design intent

The site presents engineering work as something people can explore. Its visual language combines a dark, space-inspired canvas with precise technical details, real project evidence, and interactive 3D models. The 3D hero is a defining feature and should remain 3D.

## Visual system

- The current dark theme uses deep navy and indigo surfaces, with lavender, mint, teal, and cyan accents. The proposed light theme switches to warm white with orange and red; see [color-system.md](color-system.md).
- Keep bright color concentrated in interactive states, key details, and 3D lighting. Use softer text colors for supporting copy and fine borders to separate panels without boxing in every element.
- Use translucent surfaces selectively for navigation and panels. Keep the information itself readable against the background.
- Build hierarchy with one strong section heading, short supporting text when it adds meaning, and a clear action. Avoid adding an eyebrow, number, subtitle, and caption to every heading by default.
- Keep copy concrete. Prefer role names, project outcomes, measured results, and evidence links over generic portfolio slogans.

The shared page colors begin in `src/styles/index.css`; several model materials and scene colors are local to their components. Use the color guide before introducing new colors.

## Layout and responsive behavior

- Give major sections a consistent centered content width and generous vertical spacing.
- The hero pairs a concise introduction with the 3D showcase on wide screens. At smaller widths, stack the content and keep controls reachable.
- Reflow capability and project cards into fewer columns as the viewport narrows. Keep text readable and images large enough to inspect.
- Prefer simple cards, thin borders, and clear spacing. Use decorative framing only where it supports the model or helps distinguish a section.
- Keep important actions available as normal buttons or links; don't make essential navigation depend on a hover state.

## 3D and visual storytelling

- Keep the interactive 3D skills keyboard as the default hero. The silicon board is a selectable companion view.
- Keep the silicon board purely illustrative: no numbered module list, technical callouts, or explanatory copy inside the model. Hovering or clicking components changes the visual highlight; the interaction should stay focused on the object.
- Use technical descriptions and metrics in the project case study, where they have context. A decorative model should not be mistaken for a physical floorplan or measured artifact.
- Use the circuit atlas, planar CMOS study, and particle visuals to show different kinds of engineering work. Label an illustration clearly when a reader could confuse it with measured hardware.
- Use a CSS fallback when WebGL is unavailable or a scene fails. Keep the fallback useful and visually consistent with the 3D presentation.

## Interaction and feedback

- Make selection visible through a focused color, glow, border, or changed state on the selected object. Use these effects to communicate interaction, not as decoration that follows the cursor across unrelated cards.
- Keep clickable areas as semantic buttons or links. Expose selected states with `aria-pressed` where relevant and give icon-only controls accessible names.
- Provide keyboard access alongside pointer and touch interaction. Use native selects, buttons, and links for actions wherever possible.
- Keep the action near its content: project cards open their matching details, skill keys update the skill explanation, and model controls stay beside the model they affect.
- Avoid redundant hover-only labels and instructions when the control itself makes the action clear.

## Motion, accessibility, and performance

- Use motion to reveal content or show a model changing state. Avoid adding motion to every card or attaching a spotlight to the user's cursor by default.
- Respect `prefers-reduced-motion`. Pause or remove decorative motion while preserving content and controls.
- Pause or suspend expensive visual work when it is offscreen. Load large WebGL scenes only when needed, and keep device pixel ratios and rendering settings bounded.
- Provide visible keyboard focus, descriptive image text, and labels for controls. Keep touch targets comfortably large.
- Preserve a meaningful non-WebGL path so a rendering failure doesn't hide portfolio content or block interaction.

## Copy rules to preserve

- Use one useful heading per section. Keep a small category label only when it adds context that the heading does not already give.
- Remove decorative serial numbers such as `01 / PRACTICE`. Keep numbers when they communicate real data, a required sequence, or the current position in a carousel.
- Don't repeat a title in a subtitle or repeat the same description on both sides of a visual.
- Keep useful project context, contribution, technology, and outcome details in the project disclosure. Trim introductory copy when it only says what the heading already says.
- Keep the silicon board visually text-free. Controls around it may explain how to switch or reset the scene; the model itself remains aesthetic.

## Existing implementation map

- `src/components/hero/Hero.tsx` — introduction, awards, navigation, and hero layout.
- `src/components/three/HeroStage.tsx` and `HeroScene.tsx` — keyboard/silicon scene switch, interaction, and fallback behavior.
- `src/components/profile/FocusCards.tsx` — concise capability links.
- `src/components/projects/ProjectList.tsx` and `CaseStudy.tsx` — project filtering, details, and the featured technical case study.
- `src/components/three/CircuitExplorer.tsx`, `PlanarInverter.tsx`, and `FluidShowcase.tsx` — engineering visual studies.
- `src/styles/index.css` — shared layout, surfaces, responsive rules, and visual states.
- `docs/color-system.md` — current dark palette and proposed light-mode colors.

## Before adding a section

1. Decide what the reader should learn or do in this section.
2. Give it one clear heading and keep only copy that adds new information.
3. Reuse existing colors, spacing, surfaces, and active-state styles.
4. Make the interaction work with keyboard and touch as well as a pointer.
5. Check the mobile layout, reduced-motion behavior, and the non-WebGL fallback if the section uses 3D.
