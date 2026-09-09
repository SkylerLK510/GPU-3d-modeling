# Quiz data, grading, and progression

The quiz separates three responsibilities: content in `src/data/quizzes.js`, attempt state in `src/quiz/session.js`, and interaction in `src/quiz/view.js`. These are named sections inside `index.html`.

## Stable answer IDs survive shuffling

The `question` helper accepts an ID, prompt, component ID, original correct-choice index, hint, and label/feedback pairs. It generates option IDs from the question ID plus original index. `correctId` stores the answer's identity.

For example, if original option 1 is correct, its ID remains `<question-id>-1` even when it appears as choice A or D on screen. Grading must compare IDs, never letters or shuffled array positions. Feedback belongs to each option so wrong choices explain the misconception.

Fisher–Yates shuffling works on copied arrays. Each `QuizSession` shuffles the question order and then each question's options; it does not reorder the source bank. Tests inject a seeded random generator to make failures reproducible.

## An attempt is a small state machine

1. The learner selects a valid option. Selecting an unknown ID has no effect.
2. `submit()` records one response for the current question. An empty or repeated submission has no effect.
3. The committed answer is locked while the learner reads feedback.
4. `advance()` moves to the next question and clears selection, or marks the attempt complete at the end.

`score` counts correct responses. `missed` returns incorrect responses with their original question objects, allowing results to show explanations and component-review links. Completed attempts reject further selections, submissions, and advances.

## Progress belongs to the page visit

`mountQuiz` keeps one session per subject ID. Selecting another subject or viewing a component leaves the current session intact. A retest creates a fresh session only for the selected subject. A separate best-score map retains the highest completed score for each subject during that visit.

Completing a subject offers both a retake and the next subject. The final subject offers a return to the first. All subjects are selectable from the sidebar, regardless of score; progression is not a locked curriculum. Completing every subject displays a completion message.

Reloading the document starts over. There is no persistent learner profile or server-side grading.

## Accessible interaction

The choices use a form, fieldset, legend, labels, and native radio inputs. Check-answer remains disabled until a selection exists. Submitted choices become disabled and show textual verdicts and feedback. Status regions announce results; headings receive focus after navigation. Component review hands focus back to the explorer's component menu.

These mechanisms are present in the implementation. Verify them with keyboard and assistive-technology testing when changing the view; the Node tests do not establish full accessibility conformance.

## Add a question carefully

Choose a unique question ID, a real component ID, an unambiguous correct choice, useful feedback for every option, and an appropriate subject source. The correct index is zero-based in the original choice list. If the bank's size intentionally changes, update the documented counts and the content-test expectations together.

Keep empirical performance claims conditional. A question can teach which measurement tests a bottleneck without claiming that a given GPU guarantees a particular throughput or memory fit.
