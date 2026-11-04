import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith('.') && !/\.[a-z]+$/.test(specifier) && !context.parentURL?.includes('/node_modules/')) return next(`${specifier}.ts`, context);
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.endsWith('.tsx')) {
      return { format: 'module', shortCircuit: true, source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
      }).outputText };
    }
    return next(url, context);
  },
});

const { default: WorldEvidence } = await import('../components/world/WorldEvidence.tsx');
const { career, practice, projects } = await import('../lib/portfolio/data.ts');
const { getPublicPosts } = await import('../lib/portfolio/public-blog.ts');
const html = renderToStaticMarkup(createElement(WorldEvidence));

function assertText(markup, value, context) {
  // React escapes public copy in HTML; compare its text representation without
  // requiring a browser, hydration, a canvas or an assistant response.
  const escaped = renderToStaticMarkup(createElement('span', null, value)).slice(6, -7);
  assert.ok(markup.includes(escaped), `${context}: missing ${JSON.stringify(value)}`);
}

function article(id) {
  const markup = html.match(new RegExp(`<article\\b[^>]*\\bid="${id}"[^>]*>[\\s\\S]*?<\\/article>`))?.[0];
  assert.ok(markup, `The initial document must include the ${id} record`);
  return markup;
}

test('the initial world document retains the complete career record without JavaScript or AI', () => {
  for (const company of ['Airtel Digital', 'MakeMyTrip', 'Paytm', 'Sparklin', 'Infosys']) {
    assert.ok(career.some(role => role.company === company), `Missing established career record: ${company}`);
  }
  for (const role of career) {
    const record = article(`world-career-${role.id}`);
    for (const value of [role.company, role.role, role.dates, role.theme, role.narrative, ...role.responsibilities, ...role.focus]) {
      assertText(record, value, role.company);
    }
  }
});

test('every independent project exposes its context and limitations in the initial document', () => {
  assert.deepEqual(projects.map((p) => p.slug), ['paarth', 'trinetra'], 'Owner rule (31 Oct 2026): only finished or live projects are public; the rest stay archived. Trinetra went public 3 Nov 2026');
  for (const project of projects) {
    const record = article(`world-project-${project.slug}`);
    for (const value of [project.name, project.status, project.line, project.description, project.problem, project.approach, project.tradeoff, project.limitations, ...project.tags]) {
      assertText(record, value, project.name);
    }
    assert.ok(record.includes(`href="/work/${project.slug}"`), `${project.name}: full case study must remain directly accessible`);
  }
});

test('practice, education, resume and recent writing remain available without opening the AI', () => {
  for (const group of practice) {
    assertText(html, group.name, 'Practice');
    for (const item of group.items) assertText(html, item, group.name);
  }
  for (const value of ['B.Tech', 'Computer Science and Engineering', 'Inderprastha Engineering College', 'Delhi NCR', '2014–2018']) {
    assertText(html, value, 'Education');
  }
  assert.match(html, /<a\b[^>]*href="\/resume-public\.pdf"/);

  const posts = getPublicPosts();
  assert.ok(posts.length >= 3, 'The curated writing archive must be available to the server render');
  for (const post of posts.slice(0, 3)) {
    assertText(html, post.title, 'Recent notes');
    assertText(html, post.excerpt, post.title);
    assert.ok(html.includes(`href="/blog/${post.slug}"`), `${post.title}: article link missing`);
  }
  assert.match(html, /<a\b[^>]*href="\/blog"/);
  assertText(html, `Read all ${posts.length} notes`, 'Full writing archive');
});
