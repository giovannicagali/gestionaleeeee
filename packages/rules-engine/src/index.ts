/** Nucleo matematico minimo di Fase 1; NON un rules engine D&D completo. */
export type ModifierSource = { id: string; label: string; amount: number; enabled: boolean };
export function abilityModifier(score: number): number {
  if (!Number.isInteger(score) || score < 1 || score > 30) throw new RangeError('Punteggio non valido (1–30)');
  return Math.floor((score - 10) / 2);
}
export function proficiencyBonus(totalLevel: number): number {
  if (!Number.isInteger(totalLevel) || totalLevel < 1 || totalLevel > 20) throw new RangeError('Livello non valido (1–20)');
  return 2 + Math.floor((totalLevel - 1) / 4);
}
export function sumActiveModifiers(base: number, sources: readonly ModifierSource[]): number {
  if (!Number.isFinite(base)) throw new TypeError('Valore base non valido');
  const ids = new Set<string>();
  return sources.reduce((current, source) => {
    if (ids.has(source.id)) throw new Error(`Fonte duplicata: ${source.id}`);
    ids.add(source.id);
    if (!Number.isFinite(source.amount)) throw new TypeError('Modificatore non valido');
    return current + (source.enabled ? source.amount : 0);
  }, base);
}
