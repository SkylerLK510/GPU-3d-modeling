# Geometry, selection, and rendering

Read the named scene sections inside `index.html` with `src/explorer.js` alongside them. The model combines reusable geometry with a shared component-ID vocabulary.

## From a primitive to a selectable component

`createPrimitives` receives the current scene's `parts`, `objects`, `motions`, and `labels` registries. Its helpers create Three.js geometry and attach it to parent groups:

- `group(id, ...)` records groups under a component ID.
- `box`, `cylinder`, and `tube` can attach `userData.id` and register a mesh for picking.
- `line` draws paths and decorative traces.
- `label` renders text to a canvas-backed texture plane.
- `layer` records base positions and displacements for the exploded view.

The renderer's raycast targets are in `objects`. `hit` determines which mesh is under the pointer; its ID lets the controller select the matching educational entry. A part may have multiple meshes but one description. The component menu provides another route to the same information.

## Why the card has its own helpers

`buildCard` uses `plate` for outlined surfaces and openings, `instances` for repeated geometry, `print` for markings, and `screw` for fasteners. This supports the detailed cooler and backplate without treating every fin or blade as a separate educational concept.

The scene expresses an exterior reference and illustrative internals. Decorative board traces are not an electrical netlist; repeated blocks are not a measured silicon layout. When adjusting detail, keep those distinctions in the accompanying text.

## Camera views and layer separation

`applyCardView` defines poses for backplate, fan side, power connector, display outputs, exposed board, and exploded assembly. Each pose sets the camera's spherical coordinates, target, explosion amount, and an initial component. These are teaching views rather than measurements.

The separation slider updates `explode`. `applyExplode` transforms the registered layer groups from their recorded base positions, allowing the slider to move back and forth without accumulating positional drift.

## Scene lifecycle

`build` selects the builder for the current level. Rebuilding discards old geometry through `dispose` and repopulates the registries. This ownership matters: stale meshes should not remain selectable after changing levels, and discarded geometry and textures should be released.

`requestRender` and `render` coordinate drawing. Camera interactions, selection, resizing, and animation can request frames. `ResizeObserver` keeps the renderer aligned with the stage. Theme changes trigger palette updates and rebuilding. Journey playback responds to reduced-motion preferences, and playback stops when the document is hidden.

## A focused extension exercise

To add a selectable explanation, start in `components` and choose a stable ID. Add it to the correct `componentGroups` entry, then associate appropriate geometry with that ID. Verify both menu selection and clicking the mesh, then add related links or a quiz question only where they help explain the concept. Run `npm test` and the manual checks before submitting the change.
