import { useEffect, useState } from 'react';
import { useDeepCompareEffect } from 'ahooks';

import { io } from 'socket.io-client';
import type { ManagerOptions } from 'socket.io-client/build/esm/manager';
import type { Socket, SocketOptions } from 'socket.io-client/build/esm/socket';

import { getToken } from '../apis/fetch';

export function useSocket(url: string, namespace?: string) {
    const [socket, setSocket] = useState<any>(null);

    useDeepCompareEffect(() => {
        const getDomainAndPathFromUrl = (url: string): { domain: string; path: string } => {
            const urlSplit = url.split(/[/?#]/);
            const domain = urlSplit[0] + '//' + url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
            return {
                domain: domain,
                path: url.replace(domain, ''),
            };
        };
        const { domain, path } = getDomainAndPathFromUrl(url);
        let socketIo: Socket;

        getToken().then(token => {
            const opts: Partial<ManagerOptions & SocketOptions> = {
                extraHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            };
            if (path) {
                opts.path = path;
            }
            const socketIo = io(domain + (namespace ? namespace : ''), opts);

            setSocket(socketIo);
        });

        function cleanup() {
            if (socketIo) {
                socketIo.disconnect();
            }
        }
        return cleanup;

        // should only run once and not on every re-render,
        // so pass an empty array
    }, []);

    return socket;
}
