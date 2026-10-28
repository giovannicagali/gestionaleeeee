import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldFlagConflict, pendingFirst, type Change } from './index.ts';
const make = (id: string, char: string, when: string): Change => ({id,characterId:char,fieldPath:'abilities.dex',baseRevision:4,localValue:14,createdAt:when,state:'pending'});
test('conflitto solo sullo stesso campo con revisione remota successiva',()=>{
  const local=make('a','char1','2026-01-01');
  assert.equal(shouldFlagConflict(local,{fieldPath:'abilities.dex',revision:5,value:16}),true);
  assert.equal(shouldFlagConflict(local,{fieldPath:'abilities.str',revision:5,value:16}),false);
  assert.equal(shouldFlagConflict(local,{fieldPath:'abilities.dex',revision:4,value:16}),false);
  assert.equal(shouldFlagConflict(local,{fieldPath:'abilities.dex',revision:5,value:14}),false);
});
test('priorità personaggio attivo e ordine cronologico senza mutare input',()=>{
 const input=[make('b','other','2026-02-01'),make('a','active','2026-03-01'),make('c','active','2026-01-01')];
 assert.deepEqual(pendingFirst(input,'active').map(x=>x.id),['c','a','b']);
 assert.equal(input[0]?.id,'b');
});
