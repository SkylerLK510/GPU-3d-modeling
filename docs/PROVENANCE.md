# Import provenance

This repository publication starts from the user-supplied `RTX-5070-GPU-Anatomy.html`. The initial import copied it byte-for-byte to `index.html`; the explorer, explanations, question bank, and runtime behavior were already present in that artifact.

SHA-256 of the original imported HTML (before subsequent fixes):

```text
fd7fe3d9478576a4d4d89d8253878a3d25ba71ae0f5c91d9ba60062dd736e77b
```

The supplied HTML did not include a `.git` directory, original module files, contributor guides, or the earlier test suite. Its embedded module names remain intact. The initial publication added documentation and tests around that exact artifact. Subsequent commits may change the page; the initial checksum is retained as provenance, not as the checksum of the latest version. The new commits describe this import and the added material; they do not reconstruct or claim to preserve the original development history.

The repository's existing MIT license and initial commit are retained.

## Validation of the import

- Verified that the published entry file matches the supplied HTML by SHA-256.
- Parsed the complete inline JavaScript with Node.js.
- Ran 11 tests against the actual bundled code: question integrity, component links and level transitions, markup control targets, grading, shuffle behavior, duplicate submissions, independent attempts, and invalid subjects.
- The grading sweep runs all six subjects across 32 seeded attempts each.

These checks do not render WebGL, test browser layouts, exercise real pointer or keyboard events, audit every factual statement against its linked sources, or establish pixel-level fidelity to a physical card. Browser visual verification was not performed during this import. See the manual checklist in [CONTRIBUTING.md](../CONTRIBUTING.md).

## Rendering-startup follow-up

The page now retries a failed renderer constructor with a fresh canvas, no antialiasing, and the default GPU preference. Failure messages include the stage, underlying exception, and any browser-provided context-creation reason. Failed initialization clears partial graphics state so descriptions and quizzes remain usable.

Fourteen Node tests cover the content, grading, and renderer fallback. A separate diagnostic run constructed all four scene levels using the actual Three.js 0.160.0 library with canvas text operations simulated. These checks do not prove WebGL is permitted or working on a particular user's browser.

A simulated DOM integration check also exercised successful startup, fallback startup, blocked context creation, a scene-construction exception, and a library-download failure. In each case, component navigation and quiz answer progression remained functional. The renderer and canvas text drawing were simulated; this was not a browser or visual test.
