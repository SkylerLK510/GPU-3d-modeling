import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { html, script, loadModules } from './bundle.mjs';

const modules = loadModules();
const { subjects } = modules['src/data/quizzes.js'];
const { sources } = modules['src/data/sources.js'];
const { components, componentGroups, kernelJourney } = modules['src/data/components.js'];

test('the complete shipped JavaScript parses', () => {
  assert.doesNotThrow(() => new vm.Script(script));
});

test('24 questions provide unique IDs, valid answers, hints, and feedback', () => {
  assert.equal(subjects.length, 6);
  assert.equal(new Set(subjects.map(s => s.id)).size, 6);
  const ids = new Set();
  for (const subject of subjects) {
    assert.equal(subject.questions.length, 4);
    assert.ok(subject.title && subject.summary);
    for (const q of subject.questions) {
      assert.ok(!ids.has(q.id), `Duplicate question: ${q.id}`);
      ids.add(q.id);
      assert.ok(q.prompt && q.hint);
      assert.ok(components[q.component], `Missing component: ${q.component}`);
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options.map(o => o.id)).size, 4);
      assert.equal(q.options.filter(o => o.id === q.correctId).length, 1);
      for (const option of q.options) assert.ok(option.label && option.feedback);
    }
    for (const key of subject.sources) {
      assert.ok(sources[key]?.title, `Missing source: ${key}`);
      assert.equal(new URL(sources[key].url).protocol, 'https:');
    }
  }
  assert.equal(ids.size, 24);
});

test('every component link and level transition resolves', () => {
  for (const [id, component] of Object.entries(components)) {
    assert.equal(component.id, id);
    assert.ok(component.name && component.role && component.ml && component.deeper);
    assert.ok(componentGroups[component.level]);
    for (const link of component.links || []) assert.ok(components[link], `${id} -> ${link}`);
    if (component.dive) {
      const [level, target] = component.dive;
      assert.ok(componentGroups[level]);
      assert.ok(componentGroups[level].includes(target));
    }
  }
  for (const ids of Object.values(componentGroups)) {
    assert.equal(new Set(ids).size, ids.length);
    for (const id of ids) assert.ok(components[id], id);
  }
  assert.equal(kernelJourney.length, 9);
  for (const [id, title, explanation] of kernelJourney) {
    assert.ok(components[id] && title && explanation);
  }
});

test('startup hooks and accessible control targets exist exactly once', () => {
  const markup = html.slice(0, html.indexOf('<script>'));
  const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const match of script.matchAll(/(?:getElementById\(|\$\()'([^']+)'/g)) {
    assert.ok(ids.includes(match[1]), `Missing startup element: ${match[1]}`);
  }
  for (const match of markup.matchAll(/(?:aria-controls|for)="([^"]+)"/g)) {
    assert.ok(ids.includes(match[1]), `Unresolved control: ${match[1]}`);
  }
});
