# Import provenance

This repository publication starts from the user-supplied `RTX-5070-GPU-Anatomy.html`. It is copied byte-for-byte to `index.html`; the explorer, explanations, question bank, and runtime behavior were already present in that artifact.

SHA-256 of the imported HTML:

```text
fd7fe3d9478576a4d4d89d8253878a3d25ba71ae0f5c91d9ba60062dd736e77b
```

The supplied HTML did not include a `.git` directory, original module files, contributor guides, or the earlier test suite. Its embedded module names remain intact. This publication adds documentation and tests around that exact artifact. The new commits describe this import and the added material; they do not reconstruct or claim to preserve the original development history.

The repository's existing MIT license and initial commit are retained.

## Validation of the import

- Verified that the published entry file matches the supplied HTML by SHA-256.
- Parsed the complete inline JavaScript with Node.js.
- Ran 11 tests against the actual bundled code: question integrity, component links and level transitions, markup control targets, grading, shuffle behavior, duplicate submissions, independent attempts, and invalid subjects.
- The grading sweep runs all six subjects across 32 seeded attempts each.

These checks do not render WebGL, test browser layouts, exercise real pointer or keyboard events, audit every factual statement against its linked sources, or establish pixel-level fidelity to a physical card. Browser visual verification was not performed during this import. See the manual checklist in [CONTRIBUTING.md](../CONTRIBUTING.md).
