import Link from 'next/link';
import { useRequest, useSafeState } from 'ahooks';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

import { EyeOutlined, MinusCircleOutlined } from '@ant-design/icons';
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
import { PermissionActionsEnum, PermissionModulesEnum } from '@library/enums';
import { funcFormatDate, funcTruncateText } from '@library/functions';
import type { TMarketplaceItemResponse } from '@library/schemas/post-management';

import EducareImage from '../../../shared/educare-image';
import EduCarePermissionWrapper from '../../../shared/educare-permission-wrapper';

const COLUMNS: ColumnsType<TMarketplaceItemResponse> = [
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
        title: 'Product Name',
        dataIndex: 'name',
        key: 'name',
        render: name => <small className="capitalize">{funcTruncateText(name)}</small>,
    },
    {
        title: 'User Type',
        dataIndex: 'postBy',
        key: 'postBy',
        render: postBy => <small className="capitalize">{postBy}</small>,
    },
    {
        title: 'Item Type',
        dataIndex: 'itemType',
        key: 'itemType',
        render: itemType => {
            return (
                <div className="max-w-32">
                    <small className="capitalize">{itemType}</small>
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

const TABLE_TABS: EducareRouterTabsProps = {
    name: 'list-marketplace',
    routerQuery: 'status',
    items: [
        {
            key: '',
            label: 'All',
        },
    ],
};

const ListMarketPlaceComponent = () => {
    const showRejectionState = useSafeState<string>('');

    const {
        data: apiData,
        loading: apiLoading,
        onChange: onTableChange,
        onSearch: onSearch,
    } = useRequestPagination<TMarketplaceItemResponse>(
        {
            version: 'v1',
            module: 'marketplace-management',
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
            onSearch('');
        },
        onError: (error: any) => {
            EducareMessageAlert(error?.error?.systems || 'Status update failed', 'error');
        },
    });
    const onChangeStatus = (id: string, payload: TRejectionPayload) => {
        changeStatusApi.run({
            module: 'marketplace-management',
            method: 'PUT',
            url: id,
            payload,
        });
    };

    return (
        <Table
            rowKey="id"
            tableLayout="auto"
            scroll={{ scrollToFirstRowOnChange: true, x: 1000 }}
            dataSource={apiData?.payload || []}
            pagination={EducareDataTablePaginationBuilder(apiData)}
            loading={EducareDataTableLoadingBuilder(apiLoading)}
            locale={EducareDataTableLocalBuilder(apiLoading)}
            onChange={onTableChange}
            title={() => (
                <div>
                    <EducareRejectionModal
                        state={showRejectionState}
                        onReject={({ relatedId, ...payload }) => {
                            onChangeStatus(relatedId, payload);
                        }}
                    />
                    <h2 className="font-bold mt-2 mb-2">Marketplace</h2>
                    <div className="grid md:grid-cols-5 mt-2 gap-2">
                        <EducareRouterTabs className="md:col-span-2" {...TABLE_TABS} />
                        <div className="md:col-span-3 grid md:grid-cols-3 items-center gap-2">
                            <EducareRouterSearch routerQuery="keyword" name="marketPlace-search" />
                            <EducareRouterSelect
                                name="marketPlace-sort"
                                routerQuery="sort"
                                placeholder="Sort By"
                                options={[
                                    { label: 'Latest', value: 'updatedAt:desc' },
                                    { label: 'Oldest', value: 'createdAt:asc' },
                                ]}
                            />
                            <EducareRouterSelect
                                name="marketPlace-filter"
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
                            <EducareButton className="border-none bg-slate-100" variant="reset" onClick={() => showRejectionState[1](record.id)}>
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
                            <Link href={`/post-management/marketplace/details?id=${record.id}`}>
                                <EducareButton type="text" size="small" icon={<EyeOutlined className="text-primary" />} />
                            </Link>
                        </div>
                    ),
                },
            ])}
        />
    );
};

export default ListMarketPlaceComponent;