import React from 'react';
import { useRouter } from 'next/router';
import { useMemoizedFn } from 'ahooks';

import type { SearchProps } from 'antd/lib/input';

import { EducareInputUi } from '@components/shared/educare-input';

export type EducareRouterSearchProps = Omit<SearchProps, 'onSearch' | 'defaultValue'> & {
    name: string;
    routerQuery: string;
};

const EducareRouterSearch = ({ routerQuery, ...restProps }: EducareRouterSearchProps) => {
    const router = useRouter();
    const onSearch = useMemoizedFn(value => {
        router.query[routerQuery] = value || undefined;
        router.push({
            pathname: router.pathname,
            query: router.query,
        });
    });
    return (
        <EducareInputUi
            allowClear
            placeholder="Search.."
            {...restProps}
            size="middle"
            type="search"
            className="educare-search"
            defaultValue={router.query[routerQuery] || undefined}
            onSearch={onSearch}
        />
    );
};

export default EducareRouterSearch;
