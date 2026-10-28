import type { Locale } from './index.ts';

/**
 * Etichette visuali del catalogo di Fase 2.
 * Gli identificativi già salvati (es. "Fighter", "Dwarf") NON cambiano:
 * così il cambio di lingua non altera né duplica i personaggi esistenti.
 * Le etichette ufficiali delle pubblicazioni localizzate saranno verificate
 * durante l'importazione del catalogo con licenza nella Fase 3/4.
 */
const names: Record<'species' | 'subrace' | 'class' | 'alignment', Record<string, string>> = {
  species: {
    Dwarf: 'Nano', Elf: 'Elfo', Halfling: 'Halfling', Gnome: 'Gnomo',
    Human: 'Umano', Dragonborn: 'Dragonide', 'Half-elf': 'Mezzelfo',
    'Half-orc': 'Mezzorco', Tiefling: 'Tiefling', 'Other / Homebrew': 'Altro / Homebrew'
  },
  subrace: {
    'Hill dwarf': 'Nano delle colline', 'Mountain dwarf': 'Nano delle montagne',
    'High elf': 'Elfo alto', 'Wood elf': 'Elfo dei boschi',
    Lightfoot: 'Piedelesto', Stout: 'Tozzo',
    'Forest gnome': 'Gnomo delle foreste', 'Rock gnome': 'Gnomo delle rocce'
  },
  class: {
    Barbarian: 'Barbaro', Bard: 'Bardo', Cleric: 'Chierico', Druid: 'Druido',
    Fighter: 'Guerriero', Monk: 'Monaco', Paladin: 'Paladino', Ranger: 'Ranger',
    Rogue: 'Ladro', Sorcerer: 'Stregone', Warlock: 'Warlock', Wizard: 'Mago',
    'Other / Homebrew': 'Altro / Homebrew'
  },
  alignment: {
    LG: 'Legale Buono', NG: 'Neutrale Buono', CG: 'Caotico Buono',
    LN: 'Legale Neutrale', N: 'Neutrale Puro', CN: 'Caotico Neutrale',
    LE: 'Legale Malvagio', NE: 'Neutrale Malvagio', CE: 'Caotico Malvagio'
  }
};

export type CatalogLabelKind = keyof typeof names;
export function catalogLabel(kind: CatalogLabelKind, key: string, locale: Locale): string {
  return locale === 'it' ? (names[kind][key] || key) : key;
}
