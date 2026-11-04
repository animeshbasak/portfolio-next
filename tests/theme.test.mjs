import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {resolveTheme, THEME_BOOTSTRAP, THEME_KEY} from '../lib/personal/theme.ts';

test('a saved valid theme wins, otherwise follow the system preference', () => {
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme('dark', false), 'dark');
  for (const invalid of [null, undefined, '', 'system', '<script>', 1]) {
    assert.equal(resolveTheme(invalid, true), 'dark');
    assert.equal(resolveTheme(invalid, false), 'light');
  }
});
test('prepaint bootstrap and React resolve the same theme, including blocked storage', () => {
  for (const saved of [null, 'light', 'dark', 'invalid', 'blocked']) {
    for (const systemDark of [false, true]) {
      let actual;
      vm.runInNewContext(THEME_BOOTSTRAP, {
        localStorage: {getItem(key) {assert.equal(key, THEME_KEY); if (saved==='blocked') throw new Error('SecurityError'); return saved;}},
        matchMedia: query => {assert.equal(query, '(prefers-color-scheme: dark)'); return {matches:systemDark};},
        document: {documentElement: {setAttribute(key, value) {assert.equal(key, 'data-portfolio-theme'); actual=value;}}},
      });
      assert.equal(actual, resolveTheme(saved==='blocked'?null:saved,systemDark));
    }
  }
});
