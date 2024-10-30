import React from 'react';
import Link from 'next/link';
import { useRequest, useSafeState } from 'ahooks';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

import { CheckCircleOutlined, EyeOutlined, MinusCircleOutlined, PauseOutlined } from '@ant-design/icons';
import EducareButton from '@components/shared/educare-button';
import {
    EducareDataTableLoadingBuilder,
    EducareDataTableLocalBuilder,
    EducareDataTablePaginationBuilder,
    EducareDataTablePaginationProps,
} from '@components/shared/educare-datatable';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import type { TRejectionPayload } from '@components/shared/educare-rejection';
import EducareRejectionModal from '@components/shared/educare-rejection';
import EducareRouterSearch from '@components/shared/educare-router-search';
import EducareRouterSelect from '@components/shared/educare-router-select';
import type { EducareRouterTabsProps } from '@components/shared/educare-router-tabs';
import EducareRouterTabs from '@components/shared/educare-router-tabs';
import RequestApi from '@library/apis/request.api';
import { useRequestPagination } from '@library/apis/request-pagination.api';
import { ApprovalStatusEnum, PermissionActionsEnum, PermissionModulesEnum } from '@library/enums';
import { funcEnumKeyByValue, funcFormatDate, funcTruncateText } from '@library/functions';
import type { THouseAndAccommodationResponse } from '@library/schemas/post-management';

import EducareImage from '../../../shared/educare-image';
import EduCarePermissionWrapper from '../../../shared/educare-permission-wrapper';
import { EduCareButtonForRemoval, EduCareSelectUiTwo } from '../../../shared/educare-select-2';

const COLUMNS: ColumnsType<THouseAndAccommodationResponse> = [
    {
        title: 'User Name',
        dataIndex: 'userName',
        key: 'userName',
        ellipsis: true,
        render: (email, record) => {
            return (
                <div className="flex items-center gap-3">
                    <EducareImage
                        variant="avatar"
                        preview={false}
                        image={{ imagePath: record?.userInfo?.profilePic || '', blurHash: record?.userInfo?.profilePicBlurHash || '' }}
                    />
                    <div>
                        <div>{record?.userInfo?.name || ''}</div>
                        <small>{record?.userInfo?.email || ''}</small>
                    </div>
                </div>
            );
        },
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: title => <small className="capitalize">{funcTruncateText(title)}</small>,
    },
    {
        title: 'User Type',
        dataIndex: 'postBy',
        key: 'postBy',
        render: postBy => <small className="capitalize">{postBy}</small>,
    },
    {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        render: location => {
            return (
                <div className="max-w-32 ">
                    <small>{location}</small>
                </div>
            );
        },
    },
    {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: date => <div className="flex flex-col">{funcFormatDate(date)}</div>,
    },
];

const HOUSING_TABLE_TABS: EducareRouterTabsProps = {
    name: 'list-housing',
    routerQuery: 'status',
    items: [
        {
            key: '',
            label: 'All',
        },
    ],
};

const ListHouseAndAccommodationComponent = () => {
    const showHouseAccommodationRejectionState = useSafeState<string>('');

    const {
        data: houseAccommodationData,
        loading: houseAccommodationLoading,
        onChange: houseAccommodationTableChange,
        onSearch: houseAccommodationSearch,
    } = useRequestPagination<THouseAndAccommodationResponse>(
        {
            version: 'v1',
            module: 'housing-accommodation-management',
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

    const changeStatusApi = useRequest(RequestApi<TRejectionPayload, any>, {
        manual: true,
        onSuccess: res => {
            EducareMessageAlert(res?.message || 'Status updated successfully');
            houseAccommodationSearch('');
        },
        onError: (error: any) => {
            EducareMessageAlert(error?.error?.systems || 'Status update failed', 'error');
        },
    });
    const onChangeStatus = (id: string, payload: TRejectionPayload) => {
        changeStatusApi.run({
            module: 'housing-accommodation-management',
            method: 'PUT',
            url: id,
            payload,
        });
    };

    return (
        <>
            <Table
                rowKey="id"
                tableLayout="auto"
                scroll={{ scrollToFirstRowOnChange: true, x: 1000 }}
                dataSource={houseAccommodationData?.payload || []}
                pagination={EducareDataTablePaginationBuilder(houseAccommodationData)}
                loading={EducareDataTableLoadingBuilder(houseAccommodationLoading)}
                locale={EducareDataTableLocalBuilder(houseAccommodationLoading)}
                onChange={houseAccommodationTableChange}
                title={() => (
                    <div>
                        <h2 className="font-bold mt-2 mb-2">Housing & Accommodation</h2>
                        <div className="grid md:grid-cols-5 mt-2 gap-2">
                            <EducareRouterTabs className="md:col-span-2" {...HOUSING_TABLE_TABS} />
                            <div className="md:col-span-3 grid md:grid-cols-3 items-center gap-2 justify-end">
                                <EducareRouterSearch routerQuery="keyword" name="housing-accommodation-search" />
                                <EducareRouterSelect
                                    name="housing-accommodation-sort"
                                    routerQuery="sort"
                                    placeholder="Sort By"
                                    options={[
                                        { label: 'Latest', value: 'createdAt:desc' },
                                        { label: 'Oldest', value: 'createdAt:asc' },
                                    ]}
                                />
                                <EducareRouterSelect
                                    name="housing-accommodation-filter"
                                    routerQuery="postBy"
                                    placeholder="Filters"
                                    mode="multiple"
                                    allowClear
                                    options={[
                                        { label: 'Organisation', value: 'organization' },
                                        { label: 'Student', value: 'student' },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                )}
                columns={COLUMNS.concat([
                    {
                        title: 'Action',
                        dataIndex: 'status',
                        key: 'status',
                        render: (status, record) => (
                            <EduCarePermissionWrapper module={PermissionModulesEnum.POST_MANAGEMENT} permissions={PermissionActionsEnum.UPDATE}>
                                <EducareButton
                                    className="border-none bg-slate-100"
                                    variant="reset"
                                    onClick={() => showHouseAccommodationRejectionState[1](record.id)}>
                                    <MinusCircleOutlined /> Remove
                                </EducareButton>
                            </EduCarePermissionWrapper>
                        ),
                    },
                    {
                        title: 'View',
                        key: 'action',
                        render: (_, record) => (
                            <div className="ps-3">
                                <Link href={`/post-management/housing-accommodation/details?id=${record.id}`}>
                                    <EducareButton type="text" size="small" icon={<EyeOutlined className="text-primary" />} />
                                </Link>
                            </div>
                        ),
                    },
                ])}
            />
            <EducareRejectionModal
                state={showHouseAccommodationRejectionState}
                onReject={({ relatedId, ...payload }) => {
                    onChangeStatus(relatedId, payload);
                }}
            />
        </>
    );
};

export default ListHouseAndAccommodationComponent;
