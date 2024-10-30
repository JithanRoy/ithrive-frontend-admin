import $fetch from '@library/apis/fetch';
import type { THttpMethod, TRequestApiResponse } from '@library/types';

export type TApiModule =
    | 'auth'
    | 'faq'
    | 'social-post'
    | 'social-post-activity'
    | 'support-center'
    | 'file'
    | 'notification'
    | 'inquiries'
    | 'admin-user'
    | 'home-office'
    | 'home-office-activity'
    | 'housing-accommodation-management'
    | 'Job-management'
    | 'scholarship-management'
    | 'marketplace-management'
    | 'organisation-user'
    | 'event-management'
    | 'report-management';

type Props<Request> = {
    version?: 'v1';
    module: TApiModule;
    method: THttpMethod;
    url: string;
    payload?: Request;
};

export default function RequestApi<Request, Response>({ version = 'v1', module, method, url, payload }: Props<Request>) {
    const __req: RequestInit = {
        method: method,
        headers: {
            accept: '*/*',
        },
    };
    if (payload) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        __req.body = typeof payload === 'object' ? JSON.stringify(payload as Request) : payload;
    }
    return $fetch<TRequestApiResponse<Response>>(version, module, url, __req);
}
