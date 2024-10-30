import type { THttpMethod } from '@library/types';

type Props = {
    method: THttpMethod;
    url: string;
    payload: File;
};

export default function UploadRequestApi({ method, url, payload }: Props) {
    return fetch(url, {
        method: method,
        body: payload,
    }).then(async res => {
        const string = await res.text();
        let json;
        try {
            json = string === '' ? string : JSON.parse(string);
        } catch (e) {
            json = string;
        }
        if (res.ok) return json;
        throw json;
    });
}
