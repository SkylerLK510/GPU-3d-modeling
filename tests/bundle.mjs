import { readFileSync } from 'node:fs';
import vm from 'node:vm';

export const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
export const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error('The standalone page must contain its application script.');

// Exercise the shipped code itself, including its real dependency order.
// Skip only main.js, whose immediate startup requires a browser and WebGL.
export function loadModules() {
  const entry = script.indexOf('// src/main.js\n');
  if (entry < 0) throw new Error('Cannot locate the application entry point.');
  return vm.runInNewContext(
    script.slice(0, entry) + '\nreturn __modules;\n})();',
    {},
    { timeout: 3000 },
  );
}

export function seededRandom(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
}
