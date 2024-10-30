import React from 'react';
import { useRouter } from 'next/router';
import { useMemoizedFn } from 'ahooks';

import { EduCareSelectUi } from '@components/shared/educare-select';
import type { TEducareSelectUi } from '@library/types/shared';

export type EducareRouterSearchProps = Omit<TEducareSelectUi, 'defaultValue' | 'onChange'> & {
    name: string;
    routerQuery: string;
};

const EducareRouterSelect = ({ routerQuery, ...restProps }: EducareRouterSearchProps) => {
    const router = useRouter();
    const onSelect = useMemoizedFn(value => {
        const values = [].concat(value).filter(Boolean);
        router.query[routerQuery] = values.join(',');
        router.push({
            pathname: router.pathname,
            query: router.query,
        });
    });
    restProps.value =
        restProps.mode === 'multiple'
            ? (router.query[routerQuery] || '')?.toString()?.split(',')?.filter(Boolean)
            : router.query[routerQuery] || undefined;

    return <EduCareSelectUi allowClear type="free" size="middle" placeholder="Select Option" onChange={onSelect} {...restProps} />;
};

export default EducareRouterSelect;
