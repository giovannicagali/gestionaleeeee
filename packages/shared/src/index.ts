/** Schemi condivisi di Fase 1. Nessuna regola completa D&D viene presunta qui. */
export const SHEET_SCHEMA_VERSION = 1 as const;
export type Locale = 'it' | 'en';
export type CharacterStatus = 'active' | 'archived' | 'trashed';
export type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
export type AbilityScores = Record<Ability, number>;
export interface CharacterSummary {
  id: string;
  ownerId: string;
  name: string;
  status: CharacterStatus;
  level: number;
  species?: string;
  classes?: string[];
  updatedAt: string;
}
export interface CharacterSheetDraft {
  schemaVersion: typeof SHEET_SCHEMA_VERSION;
  name: string;
  abilities: AbilityScores;
}
/** Non è una validazione di tutte le regole D&D: solo invarianti di trasporto. */
export function isValidCharacterName(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 120;
}
export function isLocale(value: unknown): value is Locale {
  return value === 'it' || value === 'en';
}
export function isValidAbilityScore(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 30;
}

export { cleanSheet, validateCharacter, speciesOptions, classOptions, alignments } from './character-model.ts';
export type { CharacterSheet } from './character-model.ts';

export { catalogLabel } from './catalog-labels.ts';
export type { CatalogLabelKind } from './catalog-labels.ts';
