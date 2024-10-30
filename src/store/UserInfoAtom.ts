import { atom } from 'recoil';
import { PersistAtom } from '@store/persist';

import type { TLoginResponse } from '@library/schemas/login';

export const UserInfoAtomKey = '__educare_user_info';
export const UserInfoAtom = atom<TLoginResponse>({
    key: UserInfoAtomKey,
    effects_UNSTABLE: [PersistAtom],
    default: {
        accessToken: '',
        refreshToken: '',
        expiration: 0,
        feedViewPermissionOrganisation: [],
        userInfo: {} as any,
        permissions: {} as any,
    },
});
