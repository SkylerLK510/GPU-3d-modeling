# Architecture and reading order

The shipped application is one HTML document. The `<style>` block defines the theme and responsive layouts; the markup supplies the explorer's controls and an initially empty quiz section. A final script starts an immediately invoked function with a private `__modules` registry.

Each named section assigns an object of exports to that registry. Dependencies are resolved from earlier entries, so their order matters. This is an already-bundled program: no module loader, npm install, or compilation step is needed to view it.

## Start with the data

Search `index.html` for these exact section labels:

| Section label | Responsibility |
| --- | --- |
| `src/data/components.js` | Component IDs, descriptions, related links, level groups, and journey steps |
| `src/data/sources.js` | Reading references used by the quiz |
| `src/data/quizzes.js` | Six subjects and the 24-question concept bank |
| `src/quiz/session.js` | DOM-independent attempt state and grading |
| `src/quiz/view.js` | Subject selection, answer controls, feedback, results, and retakes |
| `src/main.js` | Connect the explorer and quiz activities |

An ID such as `vram` joins the description, a selectable scene component, and a quiz question's review target. Keeping those IDs stable makes content changes much safer than matching components by display names.

In `components`, `role` explains function, `ml` connects the component to workloads, and `deeper` adds qualifications. `links` point to related component IDs. An optional `dive` gives a target level and component. `componentGroups` controls the menu for each level; `kernelJourney` supplies the guided steps.

## Then trace the graphics

| Section label | Responsibility |
| --- | --- |
| `src/scene/primitives.js` | Shared geometry, material, label, grouping, and layer helpers |
| `src/scene/card.js` | Physical assembly, fans, cooler, PCB, connectors, and backplate |
| `src/scene/chip.js` | Schematic chip-level functional blocks |
| `src/scene/sm.js` | Schematic SM resources |
| `src/scene/flow.js` | Conceptual tiled-computation data path |
| `src/explorer.js` | Renderer lifecycle, camera, selection, text, views, and playback |

`createExplorer(root)` returns only `inspect`, `pause`, and `refresh`. The quiz does not need access to cameras or meshes. When a learner follows a review link, `src/main.js` shows the explorer, calls `inspect(component)`, and focuses the component menu. Switching to the quiz pauses journey playback.

## Startup and failure behavior

The explorer attaches controls and fills descriptions before the external graphics script is available. It then reuses `window.THREE` if present or loads Three.js from its pinned CDN URL. Loading and initialization failures produce a message in the stage. `mountQuiz` runs independently of that asynchronous load.

There is no server state. The quiz view owns a `Map` of attempts and a second `Map` of best scores. Both disappear on reload. No local-storage persistence is implemented.

## How the checks use the bundle

`tests/bundle.mjs` reads the real `<script>` and evaluates its module definitions in a Node VM, stopping before `src/main.js` starts the browser UI. It does not copy the question bank or grading engine into test fixtures. A separate check compiles the full script, including startup code, without executing it.

This catches syntax errors and broken educational links while keeping the tests independent of Three.js and network availability. It cannot replace a browser check of rendering, focus, or event handling.
