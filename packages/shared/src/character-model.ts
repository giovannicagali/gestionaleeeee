export interface CharacterSheet {
  species?: string;
  subrace?: string;
  className?: string;
  level?: number;
  background?: string;
  alignment?: string;
  backstory?: string;
}
export const speciesOptions: Record<string, string[]> = {
  'Dwarf': ['Hill dwarf', 'Mountain dwarf'],
  'Elf': ['High elf', 'Wood elf'],
  'Halfling': ['Lightfoot', 'Stout'],
  'Gnome': ['Forest gnome', 'Rock gnome'],
  'Human': [], 'Dragonborn': [], 'Half-elf': [], 'Half-orc': [], 'Tiefling': [], 'Other / Homebrew': []
};
export const classOptions = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin',
  'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard', 'Other / Homebrew'
];
export const alignments = ['LG','NG','CG','LN','N','CN','LE','NE','CE'];

export function cleanSheet(sheet: CharacterSheet): CharacterSheet {
  const result: CharacterSheet = {};
  for (const field of ['species','subrace','className','background','alignment','backstory'] as const) {
    const raw = sheet[field];
    if (typeof raw === 'string' && raw.trim()) result[field] = raw.trim();
  }
  const level = sheet.level;
  if (typeof level === 'number' && Number.isInteger(level) && level >= 1 && level <= 20) {
    result.level = level;
  }
  return result;
}
export function validateCharacter(name: string, sheet: CharacterSheet): string | null {
  if (!name.trim() || name.trim().length > 120) return 'Il nome deve contenere da 1 a 120 caratteri.';
  if (sheet.level !== undefined && (!Number.isInteger(sheet.level) || sheet.level < 1 || sheet.level > 20)) {
    return 'Il livello deve essere tra 1 e 20.';
  }
  if (sheet.species && (speciesOptions[sheet.species]?.length ?? 0) > 0 && !sheet.subrace) {
    return 'Per questa specie devi scegliere una sottospecie.';
  }
  if (sheet.backstory && sheet.backstory.length > 15000) return 'La storia supera i 15.000 caratteri.';
  return null;
}
