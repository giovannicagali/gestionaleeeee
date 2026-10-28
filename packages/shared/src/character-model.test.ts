import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { cleanSheet, validateCharacter, speciesOptions } from './character-model.ts';

test('nome obbligatorio; altri campi facoltativi', () => {
  assert.match(validateCharacter('', {}), /nome/i);
  assert.equal(validateCharacter('Astrid', {}), null);
});
test('sottospecie obbligatoria solo per specie che la prevede', () => {
  assert.equal(speciesOptions.Elf?.length, 2);
  assert.match(validateCharacter('Elara', { species: 'Elf' }), /sottospecie/i);
  assert.equal(validateCharacter('Elara', { species: 'Elf', subrace: 'High elf' }), null);
  assert.equal(validateCharacter('Elara', { species: 'Human' }), null);
});
test('livello valida 1–20, senza XP', () => {
  assert.match(validateCharacter('E', {level:21}), /livello/i);
  assert.equal(validateCharacter('E', {level:1}), null);
});
test('cleanSheet elimina campi vuoti e preserva la storia', () => {
  assert.deepEqual(cleanSheet({species:' Elf ', background:'   ', level:4, backstory:' Testo '}),
    {species:'Elf',level:4,backstory:'Testo'});
});
