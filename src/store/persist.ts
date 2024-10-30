import { recoilPersist } from 'recoil-persist';

export const PersistAtomKeyName = '__educare_state_persist';
export const { persistAtom: PersistAtom } = recoilPersist({
    key: PersistAtomKeyName,
});
