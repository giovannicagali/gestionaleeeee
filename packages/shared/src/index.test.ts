import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidCharacterName, isLocale, isValidAbilityScore } from './index.ts';
test('nome personaggio obbligatorio e con limite', () => {
  assert.equal(isValidCharacterName('  '), false);
  assert.equal(isValidCharacterName('Neris'), true);
  assert.equal(isValidCharacterName('x'.repeat(121)), false);
});
test('lingue e punteggi di caratteristica validati', () => {
  assert.equal(isLocale('it'), true); assert.equal(isLocale('de'), false);
  assert.equal(isValidAbilityScore(20), true); assert.equal(isValidAbilityScore(31), false);
  assert.equal(isValidAbilityScore(14.5), false);
});
