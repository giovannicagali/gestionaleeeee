import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { catalogLabel } from './catalog-labels.ts';

test('traduzione IT dei campi esistenti', () => {
  assert.equal(catalogLabel('class','Fighter','it'),'Guerriero');
  assert.equal(catalogLabel('class','Wizard','it'),'Mago');
  assert.equal(catalogLabel('species','Dwarf','it'),'Nano');
  assert.equal(catalogLabel('subrace','Hill dwarf','it'),'Nano delle colline');
  assert.equal(catalogLabel('alignment','LG','it'),'Legale Buono');
});
test('la lingua EN mantiene gli ID persistenti', () => {
  assert.equal(catalogLabel('class','Fighter','en'),'Fighter');
  assert.equal(catalogLabel('species','Half-elf','en'),'Half-elf');
});
test('homebrew e valori non riconosciuti non vengono tradotti o persi', () => {
  assert.equal(catalogLabel('species','My Custom Species','it'),'My Custom Species');
  assert.equal(catalogLabel('class','Other / Homebrew','it'),'Altro / Homebrew');
});
