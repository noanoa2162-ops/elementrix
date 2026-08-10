import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('demo profiles never store or compare passwords', async () => {
  const [types, storage, auth, index] = await Promise.all([
    read('js/types.ts'),
    read('js/storage.ts'),
    read('js/auth.ts'),
    read('index.html')
  ]);

  assert.doesNotMatch(types, /\bpassword\s*:\s*string\b/i);
  assert.doesNotMatch(storage, /Admin123!|\bpassword\s*:/i);
  assert.doesNotMatch(auth, /\.password\b|formData\.get\(['"]password/i);
  assert.doesNotMatch(index, /<input[^>]+type=["']password["']/i);
});

test('legacy local data is invalidated after the credential model removal', async () => {
  const storage = await read('js/storage.ts');
  assert.match(storage, /STORAGE_VERSION:\s*string\s*=\s*'v3\.0'/);
  assert.match(storage, /localStorage\.removeItem\(STORAGE_KEY\)/);
});

test('user-controlled text is encoded before HTML template rendering', async () => {
  const files = [
    'js/admin.ts',
    'js/advanced-effects.ts',
    'js/component-details.ts',
    'js/components.ts',
    'js/load-components.ts',
    'js/profile.ts'
  ];
  const source = (await Promise.all(files.map(read))).join('\n');

  assert.match(source, /escapeUserText\(component\.name\)/);
  assert.match(source, /escapeUserText\(component\.description\)/);
  assert.match(source, /escapeUserText\(activity\.description\)/);
  assert.match(source, /escapeUserText\(user\.email\)/);
});

test('catalog JSON fixtures are valid arrays', async () => {
  const dataDirectory = new URL('../data/', import.meta.url);
  const files = (await readdir(dataDirectory)).filter((name) => name.endsWith('.json'));
  assert.ok(files.length > 0);

  for (const file of files) {
    const parsed = JSON.parse(await read(`data/${file}`));
    assert.ok(Array.isArray(parsed), `${file} must contain an array`);
    assert.ok(parsed.length > 0, `${file} must not be empty`);
  }
});

test('dependency lockfile uses the public npm registry', async () => {
  const lockfile = await read('package-lock.json');
  assert.match(lockfile, /https:\/\/registry\.npmjs\.org\/typescript/);
  assert.doesNotMatch(lockfile, /playticorp|artifactory/i);
});

test('public documentation describes a prototype without fabricated metrics', async () => {
  const [readme, index, privacy] = await Promise.all([
    read('README.md'),
    read('index.html'),
    read('pages/privacy.html')
  ]);

  assert.match(readme, /frontend prototype/i);
  assert.match(readme, /Originally developed in (?:\*\*)?November 2025(?:\*\*)?/i);
  assert.doesNotMatch(readme, /100\/100|production-ready/i);
  assert.doesNotMatch(index, /data-target="1200"|data-target="500"|4\.9\/5/);
  assert.match(privacy, /אינה אוספת כתובת IP/);
});
