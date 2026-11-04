import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith('@lib/')) {
      return next(new URL(`../lib/${specifier.slice('@lib/'.length)}.ts`, import.meta.url).href, context);
    }
    if (specifier.startsWith('.') && !/\.[a-z]+$/.test(specifier)) return next(`${specifier}.ts`, context);
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.endsWith('.tsx')) {
      return {
        format: 'module',
        shortCircuit: true,
        source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
          compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
        }).outputText,
      };
    }
    return next(url, context);
  },
});

const { ContextStage } = await import('../components/personal/ContextStage.tsx');
const { career, practice, projects } = await import('../lib/portfolio/data.ts');
const render = (topic, busy = false) => renderToStaticMarkup(createElement(ContextStage, {
  topic, busy, onAsk: () => { throw new Error('Rendering must not initiate a question'); },
}));
const text = value => renderToStaticMarkup(createElement('span', null, value)).slice(6, -7);
const includesText = (html, value) => assert.ok(html.includes(text(value)), `Missing public record text: ${value}`);

test('unknown topics use the neutral public-profile fallback rather than selecting an unrelated record', () => {
  const overview = render('overview');
  for (const topic of ['', 'unsupported', 'project:missing', 'career:missing', 'private:<script>alert(1)</script>']) {
    assert.equal(render(topic), overview, topic);
  }
  includesText(overview, career[0].role);
  includesText(overview, career[0].company);
  for (const area of practice) includesText(overview, area.name);
  assert.match(overview, /href="\/profile"/);
  assert.doesNotMatch(overview, /conceptual workflow|Career timeline/);
});

test('project context renders the selected public record, including status, limitations and safe evidence link', () => {
  for (const project of projects) {
    const html = render(`project:${project.slug}`);
    for (const value of [project.name, project.number, project.status, project.line, project.description, project.limitations, ...project.stages, ...project.tags]) {
      includesText(html, value);
    }
    const link = html.match(/<a\b[^>]*>/)?.[0];
    assert.ok(link, project.slug);
    assert.ok(link.includes(`href="/work/${project.slug}"`), project.slug);
    assert.match(link, /target="_blank"/);
    assert.match(link, /rel="noopener noreferrer"/);
    assert.match(link, /aria-label="[^"]*opens in a new tab/);
  }
});

test('career and hiring-fit context show the public career evidence in its recorded order', () => {
  for (const topic of ['career', 'fit']) {
    const html = render(topic);
    let priorCompanyPosition = -1;
    for (const role of career) {
      for (const value of [role.company, role.role, role.dates]) includesText(html, value);
      const position = html.indexOf(text(role.company));
      assert.ok(position > priorCompanyPosition, `${topic}: career order for ${role.company}`);
      priorCompanyPosition = position;
    }
    assert.match(html, /href="\/profile"/);
  }
});

test('a focused employer topic includes that role’s public theme while retaining the full career record', () => {
  for (const focusedRole of career) {
    const html = render(`career:${focusedRole.id}`);
    includesText(html, focusedRole.theme);
    for (const role of career) includesText(html, role.company);
    assert.match(html, /href="\/profile"/);
  }
});

test('project selector controls are disabled while an answer is in flight and enabled again when idle', () => {
  const busyHtml = render('projects', true);
  const idleHtml = render('projects', false);
  const busyButtons = busyHtml.match(/<button\b[^>]*>/g) ?? [];
  const idleButtons = idleHtml.match(/<button\b[^>]*>/g) ?? [];
  assert.equal(busyButtons.length, Math.min(3, projects.length));
  assert.equal(idleButtons.length, Math.min(3, projects.length));
  for (const button of busyButtons) assert.match(button, /\bdisabled=""/);
  for (const button of idleButtons) assert.doesNotMatch(button, /\bdisabled(?:=|\s|>)/);
  for (const project of projects.slice(0, 3)) {
    for (const html of [busyHtml, idleHtml]) {
      includesText(html, project.name);
      includesText(html, project.status);
    }
  }
  assert.match(busyHtml, /href="\/work"/);
});
