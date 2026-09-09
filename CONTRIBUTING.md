# Contributing

Start with [the architecture guide](docs/ARCHITECTURE.md). Edit the named sections in `index.html`; the `src/...` labels are bundled module boundaries, not separate source files. The page has no build step and the tests have no third-party dependencies.

## Keep changes easy to learn from

Use a focused commit for each meaningful change. Explain the observed problem or teaching objective, the implementation, and the validation. A useful message might be:

```text
Explain why activation storage can dominate a training allocation

Expand the VRAM entry with the role of saved activations and link the
related quiz question. Keep estimates workload-dependent and cite the
source in the reading list.

Validation: npm test; checked the VRAM entry and its quiz review link.
```

Preserve component and question IDs unless a rename is intentional. Update all references when renaming. Keep question wording, option feedback, hints, and sources consistent. Distinguish exterior reference details from illustrative internals; do not present the drawing as a physical floorplan or a timing simulation.

## Automated checks

Use Node.js 22 or newer:

```sh
npm test
```

The suite checks syntax, content references, required control targets, grading invariants, shuffling, missed-answer tracking, and independent attempts. It does not install packages or require a GPU. Run it locally before submitting a change; this publication does not configure GitHub Actions.

## Manual browser checklist

Use this when changing the application. Record which checks you actually performed in the pull request.

- Open the page with networking available. Verify that the 3D card appears; inspect the six camera views, rotation, zoom, separation slider, and isolation.
- Visit all four levels. Select components through both the model and the menu, follow related links, and step through all nine journey positions.
- Select a wrong answer and a correct answer. Verify explanations, scoring, and protection against answering the same question twice.
- Finish a subject; retest it; move to the next subject. Confirm the current attempt survives a switch to the explorer and back, and that best scores remain during retakes.
- Complete the last subject and return to the first. Reload and confirm visit progress resets.
- Navigate with the keyboard. Check labels, visible focus, radio selection, submitted feedback, and focus after component review.
- Check a narrow phone-sized viewport and both color themes. Check reduced-motion behavior.
- Block the Three.js request or use a browser without WebGL. Confirm that failure messaging appears and descriptions and quizzes still work.

No browser or visual checklist result is implied by a passing Node test run.

## Dependency and hosting notes

The HTML loads Three.js 0.160.0 from jsDelivr. If updating it, check the upstream API changes and all scene paths; the global build URL and `window.THREE` startup must remain compatible. The project itself is static and can be served by any static host. Repository publication alone does not enable a hosted GitHub Pages site.

Preserve the MIT license and applicable third-party notices. Do not commit credentials, machine-specific paths, or personal data in example files.
