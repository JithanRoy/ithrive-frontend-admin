import React, { useState } from 'react';
import { useRequest, useSafeState } from 'ahooks';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

import { CheckCircleOutlined, EyeOutlined, MinusCircleOutlined } from '@ant-design/icons';
import AddAdminModal from '@components/app/user-management/admin/AddAdminModal';
import EducareButton from '@components/shared/educare-button';
import {
    EducareDataTableLoadingBuilder,
    EducareDataTableLocalBuilder,
    EducareDataTablePaginationBuilder,
    EducareDataTablePaginationProps,
} from '@components/shared/educare-datatable';
import EducareImage from '@components/shared/educare-image';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import type { TStatusPayload } from '@components/shared/educare-rejection';
import EducareRouterSearch from '@components/shared/educare-router-search';
import EducareRouterSelect from '@components/shared/educare-router-select';
import type { EducareRouterTabsProps } from '@components/shared/educare-router-tabs';
import EducareRouterTabs from '@components/shared/educare-router-tabs';
import RequestApi from '@library/apis/request.api';
import { useRequestPagination } from '@library/apis/request-pagination.api';
import { ApprovalAdminEnum, PermissionActionsEnum, PermissionModulesEnum } from '@library/enums';
import { funcEnumKeyByValue, funcFormatDate } from '@library/functions';
import type { TAdminData } from '@library/schemas/post-management';

import EduCarePermissionWrapper from '../../../shared/educare-permission-wrapper';
import { EduCareSelectUiTwo } from '../../../shared/educare-select-2';

import ViewDetailsModal from './ViewDetailsModal';

const COLUMNS: ColumnsType<TAdminData> = [
    {
        title: 'Admin Name',
        dataIndex: 'adminName',
        key: 'adminName',
        ellipsis: true,
        render: (email, record) => {
            return (
                <div className="flex items-center gap-3">
                    <EducareImage
                        variant="avatar"
                        preview={false}
                        image={{ imagePath: record?.profilePic || '', blurHash: record?.profilePicBlurHash || '' }}
                    />
                    <div>
                        <div>
                            <span>
                                {record?.profileInfo?.adminFirstName} {''}
                                {record?.profileInfo?.adminLastName}
                            </span>
                            <span></span>
                        </div>
                        <small>{record?.email || ''}</small>
                    </div>
                </div>
            );
        },
    },
    {
        title: 'Phone Number',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render: (detailContactNumber, record) => <small className="capitalize">{`${record?.profileInfo?.detailContactNumber}`}</small>,
    },
    {
        title: 'Created Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: date => <div className="flex flex-col">{funcFormatDate(date, 'DD MMM YYYY')}</div>,
    },
];

const ADMIN_TABLE_TABS: EducareRouterTabsProps = {
    name: 'list-admin',
    routerQuery: 'status',
    items: [
        {
            key: '',
            label: 'All',
        },
        {
            key: '1',
            label: 'Active',
        },
        {
            key: '0',
            label: 'Inactive',
        },
    ],
};

const ListAdminComponent = () => {
    const addOrEditAdminState = useSafeState<string | boolean | 'reload' | 'cancel'>('reload');
    const [onlyPermissionState, setOnlyPermissionState] = useSafeState(false);
    const [selectedRecord, setSelectedRecord] = useState<TAdminData | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editSelectedRecord, setEditSelectedRecord] = useState<TAdminData | null>(null);
    const [adminModalState, setAdminModalState] = useState<string | boolean>('reload');

    const {
        data: apiData,
        loading: apiLoading,
        onChange: onTableChange,
        onSearch: onSearch,
    } = useRequestPagination<TAdminData>(
        {
            version: 'v1',
            module: 'admin-user',
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
            module: 'admin-user',
            method: 'PUT',
            url: `${id}/status`,
            payload,
        });
    };
    const handleViewDetails = (record: TAdminData) => {
        setSelectedRecord(record);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };
    const handleEditDetails = (record: TAdminData) => {
        setEditSelectedRecord(record);
        setAdminModalState('update');
        setIsEditModalVisible(true);
    };

    return (
        <>
            <Table
                rowKey="id"
                tableLayout="auto"
                dataSource={apiData?.payload || []}
                scroll={{ scrollToFirstRowOnChange: true, x: 1000 }}
                pagination={EducareDataTablePaginationBuilder(apiData)}
                loading={EducareDataTableLoadingBuilder(apiLoading)}
                locale={EducareDataTableLocalBuilder(apiLoading)}
                onChange={onTableChange}
                title={() => (
                    <div>
                        <AddAdminModal
                            onSearch={onSearch as any}
                            state={addOrEditAdminState}
                            type={typeof addOrEditAdminState[0] === 'boolean' ? 'create' : 'update'}
                            onlyPermission={onlyPermissionState}
                        />
                        <div className="flex justify-between gap-2">
                            <h3 className="font-bold">Admin</h3>
                            <EduCarePermissionWrapper module={PermissionModulesEnum.USER_MANAGEMENT} permissions={PermissionActionsEnum.CREATE}>
                                <EducareButton variant="filled" onClick={() => addOrEditAdminState[1](true)}>
                                    Add admin
                                </EducareButton>
                            </EduCarePermissionWrapper>
                        </div>

                        <div className="grid md:grid-cols-5 mt-2 gap-2">
                            <EducareRouterTabs className="md:col-span-3" {...ADMIN_TABLE_TABS} />
                            <div className="md:col-span-2 grid md:grid-cols-3 items-center gap-2">
                                <div className="col-span-2">
                                    <EducareRouterSearch routerQuery="keyword" name="list-admin-search" />
                                </div>
                                <EducareRouterSelect
                                    name="list-organization-sort"
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
                columns={[
                    ...COLUMNS,
                    {
                        title: 'Permission',
                        dataIndex: 'permission',
                        key: 'permission',
                        render: (_, record) => (
                            <EducareButton
                                variant="filled"
                                size="small"
                                className="rounded-md"
                                icon={<EyeOutlined />}
                                onClick={() => handleViewDetails(record)}>
                                View
                            </EducareButton>
                        ),
                    },
                    {
                        title: 'Status',
                        dataIndex: 'status',
                        key: 'status',
                        render: (status, record) => (
                            <EduCarePermissionWrapper module={PermissionModulesEnum.USER_MANAGEMENT} permissions={PermissionActionsEnum.UPDATE}>
                                <EduCareSelectUiTwo
                                    showSearch={false}
                                    name="status"
                                    type="default"
                                    loading={
                                        JSON.stringify(changeStatusApi.params?.[0]?.url.split('/')[0]) === record.userId && changeStatusApi.loading
                                    }
                                    value={funcEnumKeyByValue(ApprovalAdminEnum, status.toString())}
                                    options={[
                                        {
                                            label: (
                                                <div className="text-green-500">
                                                    <CheckCircleOutlined /> Active
                                                </div>
                                            ),
                                            value: ApprovalAdminEnum.Active.toString(),
                                        },
                                        {
                                            label: (
                                                <div className="text-red-500">
                                                    <MinusCircleOutlined /> Inactive
                                                </div>
                                            ),
                                            value: ApprovalAdminEnum.Inactive.toString(),
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
                        ),
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        render: (_, record) => (
                            <EduCarePermissionWrapper module={PermissionModulesEnum.USER_MANAGEMENT} permissions={PermissionActionsEnum.UPDATE}>
                                <EducareButton
                                    type="text"
                                    size="small"
                                    icon={
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_5280_15808)">
                                                <path
                                                    d="M14.1866 4.2667L7.8266 10.6267C7.19327 11.26 5.31325 11.5533 4.89325 11.1333C4.47325 10.7133 4.75991 8.83333 5.39325 8.2L11.7599 1.83334C11.9169 1.66205 12.107 1.52436 12.3187 1.42856C12.5304 1.33276 12.7593 1.28082 12.9917 1.27593C13.2239 1.27104 13.4549 1.31327 13.6704 1.40008C13.8859 1.48688 14.0817 1.61648 14.2457 1.78102C14.4098 1.94555 14.5389 2.14162 14.6251 2.35739C14.7113 2.57317 14.7529 2.80417 14.7474 3.03647C14.7419 3.26877 14.6893 3.49756 14.5929 3.709C14.4965 3.92043 14.3583 4.11016 14.1866 4.2667Z"
                                                    stroke="#FF8743"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M7.33398 2.66666H4.00065C3.2934 2.66666 2.61517 2.94761 2.11507 3.44771C1.61498 3.94781 1.33398 4.62608 1.33398 5.33333V12C1.33398 12.7073 1.61498 13.3855 2.11507 13.8856C2.61517 14.3857 3.2934 14.6667 4.00065 14.6667H11.334C12.8073 14.6667 13.334 13.4667 13.334 12V8.66666"
                                                    stroke="#FF8743"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_5280_15808">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    }
                                    onClick={() => handleEditDetails(record)}
                                />
                            </EduCarePermissionWrapper>
                        ),
                    },
                ]}
            />
            {isModalVisible && selectedRecord && <ViewDetailsModal id={selectedRecord.id} onClose={handleCloseModal} />}
            {isEditModalVisible && editSelectedRecord && (
                <AddAdminModal
                    state={[adminModalState, setAdminModalState]}
                    type="update"
                    onSearch={onSearch as any}
                    onlyPermission={false}
                    editStateId={editSelectedRecord.key}
                    data={editSelectedRecord}
                    onclose={() => {
                        setIsEditModalVisible(false);
                    }}
                />
            )}
        </>
    );
};

export default ListAdminComponent;
