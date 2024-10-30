import { atom } from 'recoil';

import { PersistAtom } from './persist';

interface Permission {
    module: string;
    permissions: string[];
}

export const permissionsState = atom<Permission[]>({
    effects_UNSTABLE: [PersistAtom],
    key: 'permissionsState',
    default: [],
});
