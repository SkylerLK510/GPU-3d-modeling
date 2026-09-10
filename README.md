# RTX 5070 GPU Anatomy

An interactive field guide to GPU infrastructure, using a PNY triple-fan RTX 5070 exterior reference. Rotate and separate the card, inspect its components, explore the chip and an SM, and follow a conceptual kernel journey. Then test your understanding with six machine-learning quiz subjects.

## Open the explorer

1. Choose **Code → Download ZIP** on this repository and extract it.
2. Open **index.html** in a current browser.
3. Use **Explore the GPU** or **Quiz yourself**.

No build, account, Python environment, or NVIDIA GPU is required to use the page. The 3D view needs WebGL and an internet connection to load the pinned Three.js 0.160.0 script from jsDelivr. If the engine cannot load, component explanations and quizzes remain available. The GitHub file viewer displays source code; download the file to run it.

For local HTTP serving, from this directory run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open <http://localhost:8000>. Stop the server with Ctrl+C.

## If 3D does not start

The page retries graphics initialization with antialiasing disabled and the browser's default GPU preference. If both attempts fail, open **Show error details** in the model area. The reported stage distinguishes a library download problem, WebGL initialization failure, and a scene-code failure.

For a `graphics-context` failure, try another current browser or check the browser's graphics/hardware-acceleration settings. For an `engine` failure, check internet access and whether the Three.js CDN request is blocked. A `scene` failure should be reported with the displayed error text. Component explanations and quizzes remain usable when startup fails.

The page cannot override a browser or device policy that disables WebGL. If reporting a problem, include the browser/version and error details; no screen recording is needed.

## What you can explore

- Four levels: the card, inside the chip, one streaming multiprocessor, and a kernel's journey.
- Six card views: backplate, fans, power connector, display outputs, exposed board, and exploded assembly.
- Component descriptions covering each part's role, connection to ML, related components, and qualifications.
- A nine-step conceptual walkthrough from host submission through matrix computation and output.
- Drag to orbit; scroll or pinch to zoom; click a part or use the component menu. The layer slider and isolation control help inspect assemblies.

## Quiz yourself

| Subject | Questions |
| --- | ---: |
| The card behind your model | 4 |
| Getting data to the math | 4 |
| Warps, blocks, and SMs | 4 |
| Tensor Cores and precision | 4 |
| Moving data and measuring time | 4 |
| Diagnosing ML bottlenecks | 4 |

Choose an answer, check it, read the explanations, and advance. After each subject, retest or move to the next subject. Missed concepts link back to the explorer. Retakes shuffle the same question bank and answer choices. Subjects are freely selectable; there is no passing-score gate.

Progress and best scores last for the current page visit. Reloading resets them. There is no account, backend, or quiz-result upload.

## Learn from the implementation

The complete app lives in **index.html**, including CSS, content, geometry, and JavaScript. Its script retains named module sections such as `// src/quiz/session.js`; these are labels inside the HTML, not separate files in this repository.

- [Architecture and reading order](docs/ARCHITECTURE.md)
- [Geometry, selection, and rendering](docs/SCENE_GUIDE.md)
- [Quiz data, grading, and progression](docs/QUIZ_DESIGN.md)
- [Contributing and validation](CONTRIBUTING.md)
- [Import provenance and verification limits](docs/PROVENANCE.md)

Run the dependency-free checks with Node.js 22 or newer:

```sh
npm test
```

The tests parse the full application and execute its bundled data and grading code. They check all 24 questions, navigation references, shuffle behavior, duplicate-submission prevention, and retake state. They do not verify rendered geometry or browser interaction.

## Accuracy and scope

This is an educational model, not a CAD drawing, circuit schematic, measured physical die floorplan, or performance simulator. The exterior uses the PNY reference described in the page; hidden board geometry and chip layouts are illustrative. The kernel journey depicts one conceptual route, not a trace or timing prediction. Source links and scope notes are included in the explorer and each quiz subject.

MIT licensed; see [LICENSE](LICENSE). Three.js is loaded separately from its CDN and retains its own license. This project is not an official NVIDIA or PNY product.
