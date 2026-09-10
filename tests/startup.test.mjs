import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModules } from './bundle.mjs';

const { createRenderer } = loadModules()['src/scene/startup.js'];

function canvasFactory() {
  const canvases = [];
  return {
    canvases,
    create() {
      const listeners = new Map();
      const canvas = {
        addEventListener: (name, listener) => listeners.set(name, listener),
        removeEventListener: name => listeners.delete(name),
        emit: (name, event) => listeners.get(name)?.(event),
        listeners,
      };
      canvases.push(canvas);
      return canvas;
    },
  };
}

test('successful graphics startup uses the existing quality settings once', () => {
  const factory = canvasFactory();
  const calls = [];
  class WebGLRenderer {
    constructor(options) { calls.push(options); }
  }
  assert.ok(createRenderer({ WebGLRenderer }, factory.create) instanceof WebGLRenderer);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].antialias, true);
  assert.equal(calls[0].powerPreference, 'low-power');
  assert.equal(calls[0].alpha, true);
  assert.equal(factory.canvases[0].listeners.size, 0);
});

test('a failed context retries on a fresh canvas with simpler graphics settings', () => {
  const factory = canvasFactory();
  const calls = [];
  class WebGLRenderer {
    constructor(options) {
      calls.push(options);
      if (calls.length === 1) throw new Error('Preferred graphics configuration unavailable');
    }
  }
  assert.ok(createRenderer({ WebGLRenderer }, factory.create) instanceof WebGLRenderer);
  assert.equal(calls.length, 2);
  assert.notEqual(calls[0].canvas, calls[1].canvas);
  assert.equal(calls[1].antialias, false);
  assert.equal(calls[1].powerPreference, 'default');
  assert.equal(calls[1].alpha, true);
  for (const canvas of factory.canvases) assert.equal(canvas.listeners.size, 0);
});

test('failure preserves both the browser context reason and original exceptions', () => {
  const factory = canvasFactory();
  let count = 0;
  class WebGLRenderer {
    constructor({ canvas }) {
      count++;
      canvas.emit('webglcontextcreationerror', { statusMessage: 'WebGL disabled by browser policy' });
      throw new Error(`Context creation failed ${count}`);
    }
  }
  assert.throws(() => createRenderer({ WebGLRenderer }, factory.create), error => {
    assert.match(error.message, /Attempt 1: Context creation failed 1/);
    assert.match(error.message, /Attempt 2: Context creation failed 2/);
    assert.match(error.message, /WebGL disabled by browser policy/);
    return true;
  });
  assert.equal(count, 2);
  for (const canvas of factory.canvases) assert.equal(canvas.listeners.size, 0);
});
