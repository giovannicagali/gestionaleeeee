import test from 'node:test';
import assert from 'node:assert/strict';
import { abilityModifier, proficiencyBonus, sumActiveModifiers } from './index.ts';
test('modificatori caratteristiche incluse soglie dispari', () => {
  assert.equal(abilityModifier(8), -1);
  assert.equal(abilityModifier(9), -1);
  assert.equal(abilityModifier(10), 0);
  assert.equal(abilityModifier(17), 3);
  assert.equal(abilityModifier(20), 5);
  assert.throws(() => abilityModifier(31));
});
test('bonus competenza 5e 2014', () => {
  assert.deepEqual([1, 4, 5, 8, 9, 12, 13, 16, 17, 20].map(proficiencyBonus), [2,2,3,3,4,4,5,5,6,6]);
  assert.throws(() => proficiencyBonus(0));
});
test('somma solo fonti abilitate, con ID unici', () => {
  assert.equal(sumActiveModifiers(10, [{id:'a',label:'A',amount:2,enabled:true},{id:'b',label:'B',amount:5,enabled:false}]), 12);
  assert.throws(() => sumActiveModifiers(10,[{id:'a',label:'A',amount:2,enabled:true},{id:'a',label:'A2',amount:1,enabled:true}]));
});
