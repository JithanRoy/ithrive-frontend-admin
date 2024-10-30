import { PersistAtomKeyName } from '@store/persist';
import { UserInfoAtomKey } from '@store/UserInfoAtom';

import EducareMessageAlert from '@components/shared/educare-message-alert';
import { REFRESH_TOKEN_ENABLED } from '@library/const';
import { IsomorphicLocalStorage } from '@library/isomorphic-local-storage';
import type { TLoginResponse } from '@library/schemas/login';

const getPersistAtomLocalStorage = () => {
    const persistAtom = IsomorphicLocalStorage.getItem(PersistAtomKeyName) || '';
    if (persistAtom) {
        try {
            return JSON.parse(persistAtom);
        } catch {
            return {};
        }
    }
    return {};
};

const fetchResponseParser = async (res: Response) => {
    const string = await res.text();
    let json;
    try {
        json = string === '' ? string : JSON.parse(string);
    } catch (e) {
        json = string;
    }
    if (res.ok) return json;
    throw json;
};

const logout = async () => {
    if (window.location.href.includes('/login')) return;
    return new Promise(resolve => {
        EducareMessageAlert('Session Expired!', 'error');
        IsomorphicLocalStorage.clear();
        const searchParams = new URLSearchParams(window.location.search);
        const returnTo = searchParams.get('returnTo') || window.location.pathname;
        window.location.href = returnTo !== '/login' ? `/login?returnTo=${encodeURIComponent(returnTo)}` : '/login';
        resolve(false);
    });
};

export const getToken = async () => {
    const info = (getPersistAtomLocalStorage()?.[UserInfoAtomKey] || null) as TLoginResponse | null;
    return (info?.accessToken as string) || '';
};

export default async function $fetch<T>(version: string, module: string, input: string, init?: RequestInit): Promise<T> {
    const headers = {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
    } as Record<string, string>;

    let accessToken: string, refreshToken: string;
    const educareUserInfo = (getPersistAtomLocalStorage()?.[UserInfoAtomKey] || null) as TLoginResponse | null;
    accessToken = educareUserInfo?.accessToken as string;
    refreshToken = educareUserInfo?.refreshToken as string;

    const fetchRequest = async () => {
        if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/${version}/${module}/${input}`, {
            ...init,
            headers: headers,
        }).then(fetchResponseParser);
    };
    const refreshTokenRequest = async () => {
        const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh-token`, {
            method: 'POST',
            body: JSON.stringify({
                refreshToken,
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const response = await fetchResponseParser(r).catch(() => logout());
        accessToken = response?.payload?.accessToken;
        refreshToken = response?.payload?.refreshToken;
        IsomorphicLocalStorage.setItem(
            PersistAtomKeyName,
            JSON.stringify({
                ...getPersistAtomLocalStorage(),
                [UserInfoAtomKey]: response?.payload || {},
            }),
        );
    };
    return await fetchRequest().catch(async err => {
        const rememberMe = IsomorphicLocalStorage.getItem(REFRESH_TOKEN_ENABLED) === 'true';
        if (err?.status === 403 && err?.error?.systems === 'Token expired!' && rememberMe) {
            await refreshTokenRequest();
            return await fetchRequest();
        } else if (err?.status === 403) {
            // any other 403, do log out
            await logout();
        } else {
            throw err;
        }
    });
}
