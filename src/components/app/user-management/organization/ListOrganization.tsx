import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useRequest } from 'ahooks';

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
import type { TStatusPayload } from '@components/shared/educare-rejection';
import EducareRouterSearch from '@components/shared/educare-router-search';
import EducareRouterSelect from '@components/shared/educare-router-select';
import type { EducareRouterTabsProps } from '@components/shared/educare-router-tabs';
import EducareRouterTabs from '@components/shared/educare-router-tabs';
import RequestApi from '@library/apis/request.api';
import { useRequestPagination } from '@library/apis/request-pagination.api';
import { PermissionActionsEnum, PermissionModulesEnum, UserApprovalStatusEnum } from '@library/enums';
import { funcEnumKeyByValue, funcFormatDate } from '@library/functions';
import type { TOrganisationProfileResponse } from '@library/schemas/post-management';

import EducareImage from '../../../shared/educare-image';
import EduCarePermissionWrapper from '../../../shared/educare-permission-wrapper';
import { EduCareSelectUiTwo } from '../../../shared/educare-select-2';

import OrganizationModal from './OrganizationDetailsModal';

const COLUMNS: ColumnsType<TOrganisationProfileResponse> = [
    {
        title: 'Organisation Name',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        width: 200,
        render: (email, record) => {
            return (
                <div className="flex items-center gap-3">
                    <EducareImage
                        variant="avatar"
                        preview={false}
                        image={{ imagePath: record?.organisationInfo?.logo || '', blurHash: record?.organisationInfo?.logoBlurHash || '' }}
                    />
                    <div>
                        <div>{`${record?.organisationInfo.name || ''}`}</div>
                        <small>{record?.email || ''}</small>
                    </div>
                </div>
            );
        },
    },
    {
        title: 'Industry type',
        width: 200,
        align: 'center',
        dataIndex: 'organizationUserType',
        key: 'organizationUserType',
        render: organizationUserType => <small className="capitalize">{`${organizationUserType || ''}`}</small>,
    },
    {
        title: 'Mobile number',
        width: 200,
        align: 'center',
        dataIndex: 'detailContactNumber',
        key: 'detailContactNumber',
        render: (detailContactNumber, record) => <small className="capitalize">{`${record.organisationInfo.detailContactNumber}`}</small>,
    },

    {
        title: 'Organisation Size',
        ellipsis: true,
        width: 200,
        align: 'center',
        dataIndex: 'orgSize',
        key: 'orgSize',
        render: (email, record) => (
            <small className="capitalize">{`${record.organisationInfo.organisationSizeFrom || 0} - ${record.organisationInfo.organisationSizeTo || 0}`}</small>
        ),
    },
    {
        title: 'Date',
        width: 200,
        align: 'center',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: date => <div className="flex flex-col">{funcFormatDate(date, 'DD MMM YYYY')}</div>,
    },
];

const TABLE_TABS: EducareRouterTabsProps = {
    name: 'list-organisation',
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
            label: 'Verified',
        },
        {
            key: '0',
            label: 'Inactive',
        },
    ],
};

const ListOrganizationComponent = () => {
    const router = useRouter();

    const [selectedRecord, setSelectedRecord] = useState<TOrganisationProfileResponse | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const {
        data: apiData,
        loading: apiLoading,
        onChange: onTableChange,
        onSearch: onSearch,
    } = useRequestPagination<TOrganisationProfileResponse>(
        {
            version: 'v1',
            module: 'organisation-user',
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

    const changeStatusApi = useRequest(RequestApi<TStatusPayload, any>, {
        manual: true,
        onSuccess: res => {
            EducareMessageAlert(res?.message || 'Status updated successfully');
            onSearch('');
        },
        onError: (error: any) => {
            EducareMessageAlert(error?.error?.systems || 'Status update failed', 'error');
        },
    });
    const onChangeStatus = (id: string, payload: TStatusPayload) => {
        changeStatusApi.run({
            module: 'organisation-user',
            method: 'PUT',
            url: id,
            payload,
        });
    };
    const handleCloseModal = () => {
        setIsModalVisible(false);
    };
    return (
        <>
            <Table
                rowKey="id"
                tableLayout="auto"
                dataSource={apiData?.payload || []}
                pagination={EducareDataTablePaginationBuilder(apiData)}
                loading={EducareDataTableLoadingBuilder(apiLoading)}
                locale={EducareDataTableLocalBuilder(apiLoading)}
                scroll={{ scrollToFirstRowOnChange: true, x: 1000 }}
                onChange={onTableChange}
                title={() => (
                    <div>
                        <h2 className="font-bold mt-2 mb-2">User management (Organisation)</h2>
                        <div className="grid md:grid-cols-5 mt-2 gap-2">
                            <EducareRouterTabs className="md:col-span-3" {...TABLE_TABS} />
                            <div className="md:col-span-2 grid md:grid-cols-3 items-center gap-2">
                                <EducareRouterSearch routerQuery="keyword" name="housing-accommodation-search" />
                                <EducareRouterSelect
                                    name="housing-accommodation-sort"
                                    routerQuery="sort"
                                    placeholder="Sort By"
                                    options={[
                                        { label: 'Latest', value: 'updatedAt:desc' },
                                        { label: 'Oldest', value: 'createdAt:asc' },
                                    ]}
                                />
                                <EducareRouterSelect
                                    name="housing-accommodation-filter"
                                    routerQuery="organizationUserType"
                                    placeholder="Filters"
                                    mode="multiple"
                                    allowClear
                                    options={[
                                        { label: 'University', value: 'university' },
                                        { label: 'Business', value: 'business' },
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
                        width: 200,
                        align: 'center',
                        key: 'status',
                        render: (status, record) => (
                            <div className="flex justify-center">
                                <EduCarePermissionWrapper module={PermissionModulesEnum.USER_MANAGEMENT} permissions={PermissionActionsEnum.UPDATE}>
                                    <EduCareSelectUiTwo
                                        showSearch={false}
                                        name="status"
                                        type="default"
                                        loading={changeStatusApi.params?.[0]?.url === record.id && changeStatusApi.loading}
                                        value={funcEnumKeyByValue(UserApprovalStatusEnum, status.toString())}
                                        options={[
                                            {
                                                label: (
                                                    <div className="text-blue-500">
                                                        <PauseOutlined /> Pending
                                                    </div>
                                                ),
                                                value: UserApprovalStatusEnum.Pending.toString(),
                                            },
                                            {
                                                label: (
                                                    <div className="text-green-500">
                                                        <CheckCircleOutlined /> Verified
                                                    </div>
                                                ),
                                                value: UserApprovalStatusEnum.Verified.toString(),
                                            },
                                            {
                                                label: (
                                                    <div className="text-red-500">
                                                        <MinusCircleOutlined /> Inactive
                                                    </div>
                                                ),
                                                value: UserApprovalStatusEnum.Inactive.toString(),
                                            },
                                        ]}
                                        onSelect={value => {
                                            if (value !== status.toString()) {
                                                onChangeStatus(record.id, {
                                                    status: +value,
                                                });
                                            }
                                        }}
                                    />
                                </EduCarePermissionWrapper>
                            </div>
                        ),
                    },
                    {
                        title: 'Action',
                        width: 200,
                        align: 'center',
                        key: 'action',
                        render: (_, record) => (
                            <div className="flex justify-center">
                                <EducareButton
                                    type="text"
                                    className="text-center"
                                    size="small"
                                    icon={<EyeOutlined className="text-primary" />}
                                    onClick={() => router.push(`/user-management/organization-details?id=${record.id}`)}
                                />
                            </div>
                        ),
                    },
                ])}
            />
            {isModalVisible && selectedRecord && <OrganizationModal onSearch={onSearch} data={selectedRecord} onClose={handleCloseModal} />}
        </>
    );
};

export default ListOrganizationComponent;
