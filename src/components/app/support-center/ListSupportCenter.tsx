import React from 'react';
import { useRequest, useSafeState } from 'ahooks';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

import { CheckCircleOutlined, EyeOutlined, PauseOutlined } from '@ant-design/icons';
import ShowSupperCenterModal from '@components/app/support-center/ShowSupportCenterModal';
import EducareButton from '@components/shared/educare-button';
import {
    EducareDataTableLoadingBuilder,
    EducareDataTableLocalBuilder,
    EducareDataTablePaginationBuilder,
    EducareDataTablePaginationProps,
} from '@components/shared/educare-datatable';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import EducareRouterSearch from '@components/shared/educare-router-search';
import EducareRouterSelect from '@components/shared/educare-router-select';
import type { EducareRouterTabsProps } from '@components/shared/educare-router-tabs';
import EducareRouterTabs from '@components/shared/educare-router-tabs';
import RequestApi from '@library/apis/request.api';
import { useRequestPagination } from '@library/apis/request-pagination.api';
import { PermissionActionsEnum, PermissionModulesEnum, SupperCenterStatusEnum } from '@library/enums';
import { funcEnumKeyByValue, funcFormatDate, funcFormatDateAgo } from '@library/functions';
import type { TSupperCenterResponse } from '@library/schemas/support-center';

import EduCarePermissionWrapper from '../../shared/educare-permission-wrapper';
import { EduCareSelectUiTwo } from '../../shared/educare-select-2';

const COLUMNS: ColumnsType<TSupperCenterResponse> = [
    {
        title: 'Id',
        dataIndex: 'ticketNumber',
        key: 'ticketNumber',
        render: ticketNumber => <span>{`#${ticketNumber}`}</span>,
    },
    {
        title: 'User',
        dataIndex: 'email',
        key: 'email',
        ellipsis: true,
        render: (email, record) => {
            return (
                <div>
                    <div>{`${record.firstName || ''} ${record.lastName || ''}`.trim()}</div>
                    <small>{email}</small>
                </div>
            );
        },
    },
    {
        title: 'Subject',
        dataIndex: 'subject',
        key: 'subject',
        ellipsis: true,
    },
    {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: date => (
            <div className="flex flex-col">
                {funcFormatDate(date)}
                <small>{funcFormatDateAgo(date, 24, 'hh:mm:ss A')}</small>
            </div>
        ),
    },
];

const SUPPORT_TABLE_TABS: EducareRouterTabsProps = {
    name: 'list-supper-center',
    routerQuery: 'status',
    items: [
        {
            key: '',
            label: 'All',
        },
        {
            key: '1',
            label: 'Pending',
        },
        {
            key: '2',
            label: 'Completed',
        },
    ],
};

const ListSupportCenterComponent = () => {
    const showSupperCenterState = useSafeState<TSupperCenterResponse | null>(null);

    const {
        data: supperCenterData,
        loading: supperCenterLoading,
        onChange: onSupperCenterTableChange,
        onSearch: onSupperCenterSearch,
    } = useRequestPagination<TSupperCenterResponse>(
        {
            version: 'v1',
            module: 'support-center',
            method: 'GET',
            url: 'list',
            urlQueries: {
                page: 1,
                limit: EducareDataTablePaginationProps.pageSize as number,
            },
        },
        {
            scrollToTop: true,
            routerPagination: true,
            readyDependencies: [true],
        },
    );

    const changeStatusApi = useRequest(RequestApi<Pick<TSupperCenterResponse, 'status'>, any>, {
        manual: true,
        onSuccess: res => {
            EducareMessageAlert(res?.message || 'Status updated successfully');
            onSupperCenterSearch('');
        },
        onError: (error: any) => {
            EducareMessageAlert(error?.error?.systems || 'Status update failed', 'error');
        },
    });
    const onChangeStatus = (id: string, status: 1 | 2) => {
        changeStatusApi.run({
            module: 'support-center',
            method: 'PUT',
            url: id,
            payload: { status },
        });
    };

    return (
        <Table
            rowKey="id"
            tableLayout="auto"
            scroll={{ scrollToFirstRowOnChange: true, x: 1000 }}
            dataSource={supperCenterData?.payload || []}
            pagination={EducareDataTablePaginationBuilder(supperCenterData)}
            loading={EducareDataTableLoadingBuilder(supperCenterLoading)}
            locale={EducareDataTableLocalBuilder(supperCenterLoading)}
            onChange={onSupperCenterTableChange}
            title={() => (
                <div>
                    <ShowSupperCenterModal state={showSupperCenterState} />
                    <h3 className="font-bold">Support Center</h3>
                    <div className="grid md:grid-cols-5 mt-2 gap-2">
                        <EducareRouterTabs className="md:col-span-3" {...SUPPORT_TABLE_TABS} />
                        <div className="md:col-span-2 grid md:grid-cols-2 items-center gap-2">
                            <EducareRouterSearch routerQuery="keyword" name="support-center-search" />
                            <EducareRouterSelect
                                name="support-center-sort"
                                routerQuery="sort"
                                placeholder="Sort By"
                                options={[
                                    { label: 'Latest', value: 'updatedAt:desc' },
                                    { label: 'Oldest', value: 'createdAt:asc' },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            )}
            columns={COLUMNS.concat([
                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    render: (status, record) => (
                        <EduCarePermissionWrapper module={PermissionModulesEnum.SUPPORT_CENTER} permissions={PermissionActionsEnum.UPDATE}>
                            <EduCareSelectUiTwo
                                showSearch={false}
                                name="status"
                                type="default"
                                className="w-fit"
                                value={funcEnumKeyByValue(SupperCenterStatusEnum, status.toString())}
                                options={[
                                    {
                                        label: (
                                            <div className="text-blue-500">
                                                <PauseOutlined /> Pending
                                            </div>
                                        ),
                                        value: SupperCenterStatusEnum.Pending.toString(),
                                    },
                                    {
                                        label: (
                                            <div className="text-green-500">
                                                <CheckCircleOutlined /> Completed
                                            </div>
                                        ),
                                        value: SupperCenterStatusEnum.Completed.toString(),
                                    },
                                ]}
                                onSelect={value => {
                                    if (value !== status.toString()) onChangeStatus(record.id, +value as 1 | 2);
                                }}
                            />
                        </EduCarePermissionWrapper>
                    ),
                },
                {
                    title: 'Action',
                    key: 'action',
                    render: (_, record) => (
                        <EducareButton
                            type="text"
                            size="small"
                            icon={<EyeOutlined className="text-primary" />}
                            onClick={() => showSupperCenterState[1](record)}
                        />
                    ),
                },
            ])}
        />
    );
};

export default ListSupportCenterComponent;
