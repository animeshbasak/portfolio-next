import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith('.') && !/\.[a-z]+$/.test(specifier)) return next(`${specifier}.ts`, context);
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.endsWith('.module.css')) return {format: 'module', source: 'export default {}', shortCircuit: true};
    if (url.endsWith('.tsx')) return {format: 'module', shortCircuit: true, source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), {compilerOptions: {jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020}}).outputText};
    return next(url, context);
  },
});
const {default: OnboardingDemo} = await import('../components/portfolio/OnboardingDemo.tsx');

test('before JavaScript runs every intake field and submit control is disabled to prevent native form transmission', () => {
  const html = renderToStaticMarkup(createElement(OnboardingDemo));
  const fields = html.match(/<(?:input|textarea)\b[^>]*>/g);
  assert.equal(fields.length, 9);
  for (const field of fields) assert.match(field, /\bdisabled=""/);
  const submit = html.match(/<button\b[^>]*type="submit"[^>]*>/)?.[0];
  assert.ok(submit);
  assert.match(submit, /\bdisabled=""/);
  assert.match(html, /The demo needs JavaScript/);
  assert.doesNotMatch(html, /mailto:/);
});
