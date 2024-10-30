import dayjs from 'dayjs';
import tailwindConfig from '../../tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';

import { regexObjectResolver } from '@library/regexes';
import type { TImageEntity } from '@library/types';

export const funcTailwindConfig = () => resolveConfig(tailwindConfig as any) as any;

export const funcGetRandomDate = () =>
    dayjs()
        .subtract(Math.floor(Math.random() * 365), 'day')
        .toDate();

export const funcFormatDate = (date: Date | string, format = 'MMM DD, YYYY') => dayjs(date).format(format);

export const funcFormatDateAgo = (_date: Date | string, agoHour = 12, format = 'MMM DD, YYYY hh:mm:s A') => {
    const hoursAgo = dayjs().diff(dayjs(_date), 'hour');
    if (hoursAgo <= agoHour) {
        return dayjs(_date).fromNow();
    } else {
        return funcFormatDate(_date, format);
    }
};

export const funcEnumToOptions = (enumObject: { [key: string]: string | number }): { label: string; value: string | number }[] =>
    Object.keys(enumObject).map(key => ({
        label: key
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, c => c.toUpperCase()),
        value: enumObject[key],
    }));

export const funcCamelToWords = (str: string) => str.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

export const funcEnumToArray = (enumData: any): Array<{ label: string; value: string | number }> => {
    return Object.entries(enumData).map((item: any) => ({
        label: item[0],
        value: item[1],
    }));
};
export const funcEnumKeyByValue = <TEnumKey extends string, TEnumVal extends string | number>(
    myEnum: { [key in TEnumKey]: TEnumVal },
    enumValue: TEnumVal,
): string => {
    const keys = (Object.keys(myEnum) as TEnumKey[]).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : '';
};

export const funcResolveObjectDot = <K>(path: string, obj: K): any => {
    return (
        path
            .split(regexObjectResolver)
            .filter(p => p)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .reduce((o, p) => (o ? o[p] : undefined), obj)
    );
};

export const funcOmitObject = <T extends Record<string, any>>(obj: T, ...keysToOmit: (keyof T | string)[]): Partial<T> => {
    const omittedObj: Partial<T> = Object.assign({}, obj);
    keysToOmit.forEach(key => {
        if (omittedObj.hasOwnProperty(key)) {
            delete omittedObj[key];
        }
    });
    return omittedObj;
};

export const funcRemoveEmptyFromObject = <T extends Record<any, any>>(obj: T) => {
    const newObj: T = {} as T;
    Object.keys(obj).forEach((key: keyof T) => {
        if (obj[key] === Object(obj[key])) newObj[key] = funcRemoveEmptyFromObject(obj[key]);
        else if (!!obj[key] || obj[key] === 0) newObj[key] = obj[key];
    });
    return newObj;
};

export const funcLowercaseObjectKeys = <T extends Record<any, any>>(obj: T) =>
    Object.fromEntries(Object.entries(obj || {}).map(([k, v]) => [k.toLowerCase(), v]));

export const getRandomImageLink = (id: number, width: number, height: number): string => {
    const baseUrl = 'https://picsum.photos';
    return `${baseUrl}/id/${id}/${width}/${height}`;
};

export const getImagePathToLink = (imagePath: TImageEntity['imagePath']): string => {
    if (!imagePath) return '/images/logo.png';
    if (imagePath.startsWith('http') || imagePath.startsWith('https') || imagePath.startsWith('data:image')) return imagePath;
    return `${process.env.NEXT_PUBLIC_AWS_URL}/${imagePath}`;
};
export const funcTruncateText = (text: any, maxLength = 40) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};
export const funcToBase64 = (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
