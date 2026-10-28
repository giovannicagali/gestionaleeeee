/** Solo modello di coda e rilevamento conflitti. Nessuna sync di rete in Fase 1. */
export type SyncState = 'pending' | 'syncing' | 'synced' | 'conflict' | 'error';
export type Change = {
 id: string; characterId: string; fieldPath: string; baseRevision: number;
 localValue: unknown; createdAt: string; state: SyncState;
};
export type RemoteField = { fieldPath: string; revision: number; value: unknown };
export function shouldFlagConflict(change: Change, remote: RemoteField): boolean {
  if (change.fieldPath !== remote.fieldPath) return false;
  return remote.revision > change.baseRevision && !deepEqualJson(change.localValue, remote.value);
}
function deepEqualJson(a: unknown, b: unknown): boolean {
  // La futura serializzazione canonica sarà sostituita dallo schema con versioning.
  return JSON.stringify(a) === JSON.stringify(b);
}
export function pendingFirst(changes: readonly Change[], activeCharacterId: string): Change[] {
  return [...changes].sort((a,b) => {
    const aActive = a.characterId === activeCharacterId ? 0 : 1;
    const bActive = b.characterId === activeCharacterId ? 0 : 1;
    return aActive - bActive || a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id);
  });
}
