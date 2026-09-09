import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModules, seededRandom } from './bundle.mjs';

const modules = loadModules();
const { subjects } = modules['src/data/quizzes.js'];
const { QuizSession, shuffled } = modules['src/quiz/session.js'];

test('cannot grade or advance without a valid selection', () => {
  const session = new QuizSession(subjects[0], seededRandom(1));
  assert.equal(session.submit(), null);
  assert.equal(session.advance(), false);
  assert.equal(session.select('not-an-answer'), false);
  assert.equal(session.score, 0);
  assert.equal(session.responses.length, 0);
});

test('a submitted answer is immutable and cannot be counted twice', () => {
  const session = new QuizSession(subjects[0], seededRandom(2));
  assert.equal(session.select(session.current.correctId), true);
  assert.equal(session.submit().correct, true);
  assert.equal(session.submit(), null);
  const wrong = session.current.options.find(o => o.id !== session.current.correctId);
  assert.equal(session.select(wrong.id), false);
  assert.equal(session.responses.length, 1);
  assert.equal(session.score, 1);
  assert.equal(session.advance(), true);
  assert.equal(session.selectedId, null);
  assert.equal(session.answered, false);
});

test('all six subjects grade correctly across 32 shuffled attempts each', () => {
  const original = JSON.stringify(subjects);
  for (const subject of subjects) {
    for (let seed = 0; seed < 32; seed++) {
      const session = new QuizSession(subject, seededRandom(seed));
      const visited = new Set();
      for (let index = 0; index < subject.questions.length; index++) {
        assert.equal(session.complete, false);
        visited.add(session.current.id);
        assert.equal(session.select(session.current.correctId), true);
        assert.equal(session.submit().correct, true);
        assert.equal(session.advance(), true);
      }
      assert.equal(visited.size, subject.questions.length);
      assert.equal(session.score, subject.questions.length);
      assert.equal(session.complete, true);
      assert.equal(session.advance(), false);
      assert.equal(session.submit(), null);
      assert.equal(session.select(session.current.correctId), false);
    }
  }
  assert.equal(JSON.stringify(subjects), original);
});

test('mixed results retain exactly the missed concepts for review', () => {
  const session = new QuizSession(subjects[1], seededRandom(10));
  const missedIds = [];
  for (let i = 0; i < session.total; i++) {
    const q = session.current;
    const id = i % 2 === 0 ? q.correctId : q.options.find(o => o.id !== q.correctId).id;
    if (id !== q.correctId) missedIds.push(q.id);
    session.select(id);
    session.submit();
    session.advance();
  }
  assert.equal(session.score, 2);
  assert.deepEqual(Array.from(session.missed, r => r.question.id), missedIds);
});

test('a retake and another subject have independent attempts', () => {
  const first = new QuizSession(subjects[0], seededRandom(4));
  first.select(first.current.correctId);
  first.submit();
  const retake = new QuizSession(subjects[0], seededRandom(5));
  const next = new QuizSession(subjects[1], seededRandom(6));
  for (const attempt of [retake, next]) {
    assert.equal(attempt.score, 0);
    assert.equal(attempt.index, 0);
    assert.equal(attempt.selectedId, null);
    assert.equal(attempt.responses.length, 0);
    assert.equal(attempt.complete, false);
  }
  assert.equal(first.score, 1);
});

test('shuffle preserves all values and leaves the original array untouched', () => {
  const input = Object.freeze([1, 2, 3, 4, 5]);
  const orders = new Set();
  for (let seed = 0; seed < 32; seed++) {
    const result = shuffled(input, seededRandom(seed));
    orders.add(result.join(','));
    assert.deepEqual(Array.from(result).sort(), [1, 2, 3, 4, 5]);
    assert.notEqual(result, input);
  }
  assert.ok(orders.size > 1);
  assert.deepEqual(input, [1, 2, 3, 4, 5]);
});

test('empty subjects fail clearly', () => {
  for (const subject of [null, {}, { questions: [] }]) {
    assert.throws(() => new QuizSession(subject), /needs questions/);
  }
});
