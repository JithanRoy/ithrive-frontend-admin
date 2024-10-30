import { useRouter } from 'next/router';
import { useDebounceEffect, useMemoizedFn, useRequest } from 'ahooks';

import type { TableProps } from 'antd/lib/table';

import { EducareDataTablePaginationProps } from '@components/shared/educare-datatable';
import $fetch from '@library/apis/fetch';
import type { TApiModule } from '@library/apis/request.api';
import { funcOmitObject, funcRemoveEmptyFromObject } from '@library/functions';
import type { TApiPaginatedPayload, TApiPaginatedResponse, THttpMethod } from '@library/types';

type TRequestPaginationApi = {
    version?: 'v1';
    module: TApiModule;
    method: THttpMethod;
    url: string;
    urlQueries?: TApiPaginatedPayload;
    payload?: TApiPaginatedPayload;
};
type TRequestPaginationApiOptions = {
    scrollToTop?: boolean;
    routerPagination: boolean;
    readyDependencies: ReadonlyArray<unknown>;
    skipUrlQueries?: string[];
    urlQueriesAsPayload?: boolean;
    removeEmptyFromQueries?: boolean;
};

const RequestPaginationApi = <Response>({ version = 'v1', module, method, url, urlQueries, payload }: TRequestPaginationApi) => {
    const __req: RequestInit = {
        method: method,
        headers: {
            accept: '*/*',
        },
    };
    const urlSearchParams = new URLSearchParams();
    for (const each in urlQueries) {
        if (!!urlQueries[each] || urlQueries[each] === 0) urlSearchParams.set(each, urlQueries[each]);
    }

    if (payload) {
        __req.body = JSON.stringify(payload);
    }
    return $fetch<Response>(version, module, `${url}?${decodeURIComponent(urlSearchParams.toString())}`, __req);
};

export const useRequestPagination = <Response>(
    props: TRequestPaginationApi,
    options: TRequestPaginationApiOptions = {
        scrollToTop: false,
        routerPagination: true,
        readyDependencies: [],
        skipUrlQueries: [],
        urlQueriesAsPayload: false,
        removeEmptyFromQueries: true,
    },
) => {
    const { push, pathname, query } = useRouter();
    const allowedQueries = funcOmitObject(query, ...(options?.skipUrlQueries || []));

    const {
        runAsync: __getData,
        data,
        error,
        loading,
        refresh: refreshPrevious,
    } = useRequest(RequestPaginationApi<TApiPaginatedResponse<Response>>, {
        manual: true,
    });

    useDebounceEffect(
        () => {
            // Check if any of the skipUrlQueries are present in the current query
            if (!!options?.skipUrlQueries && !!options?.skipUrlQueries.length) {
                const shouldSkipEffect = options.skipUrlQueries.some(key => Object.keys(query).includes(key));
                if (shouldSkipEffect) return;
            }
            //TODO: if url queries doesn't work remove filterQueries.
            const filterQueries = options.routerPagination ? allowedQueries : [];

            const queryChange = options.routerPagination && Object.keys(filterQueries).length;
            const dependencyChange = options.readyDependencies.some(f => !!f);
            if (queryChange || dependencyChange) {
                getData({
                    page: 0,
                    limit: EducareDataTablePaginationProps.pageSize as number,
                    ...(props.urlQueries || {}),
                    ...filterQueries,
                });
            }
        },
        [query, ...options.readyDependencies],
        {
            wait: 50,
        },
    );

    const getData = useMemoizedFn((urlQueries: TApiPaginatedPayload) => {
        if (options.urlQueriesAsPayload) {
            props['payload'] = urlQueries;
            props['urlQueries'] = undefined;
        } else {
            props['urlQueries'] = urlQueries;
            props['payload'] = undefined;
        }
        __getData(props).then(() => {
            if (options.scrollToTop) {
                setTimeout(() => {
                    document.querySelector('.ant-layout-content')?.scrollTo(0, 0);
                }, 5);
            }
        });
    });

    const pushSearchParams = useMemoizedFn((urlQueries: Partial<TApiPaginatedPayload>) => {
        let queries = funcRemoveEmptyFromObject({
            page: 0,
            limit: EducareDataTablePaginationProps.pageSize as number,
            ...(props.urlQueries || {}),
            ...allowedQueries,
            ...urlQueries,
        });
        if (options.removeEmptyFromQueries) queries = funcRemoveEmptyFromObject(queries);
        if (options.routerPagination) {
            push({
                pathname: pathname,
                query: queries,
            });
        } else {
            getData(queries);
        }
    });
    const onChange: TableProps<Response>['onChange'] = useMemoizedFn((pagination, filters, sorter, extra) => {
        if (extra.action === 'paginate') {
            pushSearchParams({
                page: pagination?.current ?? 1,
                limit: pagination.pageSize,
            });
        } else if (extra.action === 'sort') {
            pushSearchParams({
                sortBy: sorter?.field,
                orderBy: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : undefined,
            });
        }
    });
    const onSearch = useMemoizedFn((value: string, queryName = 'keyword') => {
        pushSearchParams({
            page: 0,
            [queryName]: value,
        });
    });

    return {
        data,
        error,
        loading,
        onChange,
        onSearch,
        refreshPrevious,
    };
};
