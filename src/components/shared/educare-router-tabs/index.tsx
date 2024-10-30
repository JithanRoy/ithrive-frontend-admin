import React from 'react';
import { useRouter } from 'next/router';
import { useMemoizedFn } from 'ahooks';

import { Tabs } from 'antd';
import type { TabsProps } from 'antd/lib/tabs';

import classNames from 'classnames';

import styles from './EducareRouterTab.module.scss';

export type EducareRouterTabsProps = TabsProps & {
    routerQuery: string;
    name?: string;
};

const EducareRouterTabs = ({ routerQuery, name, ...restProps }: EducareRouterTabsProps) => {
    const router = useRouter();
    const onChange = useMemoizedFn((activeKey: string) => {
        const newQuery = { ...router.query };
        newQuery[routerQuery] = activeKey || undefined;
        newQuery.page = '0';
        router.push({
            pathname: router.pathname,
            query: newQuery,
        });
    });
    return (
        <Tabs
            animated
            destroyInactiveTabPane
            {...restProps}
            className={classNames(styles.educareTab, restProps.className)}
            activeKey={(router.query[routerQuery] || '') as any}
            onChange={onChange}
        />
    );
};

export default EducareRouterTabs;
