import React from 'react';
import { useRequest, useSafeState } from 'ahooks';

import { Popover, Table } from 'antd';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AddOrEditFaqDrawer from '@components/app/content-management/AddOrEditFaq';
import IthriveButton from 'src/components/shared/iThrive-button';
import EducareConfirmDelete from '@components/shared/educare-confirm-delete';
import {
    EducareDataTableLoadingBuilder,
    EducareDataTableLocalBuilder,
    EducareDataTablePaginationBuilder,
    EducareDataTablePaginationProps,
} from '@components/shared/educare-datatable';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import EducareRouterSearch from '@components/shared/educare-router-search';
import EducareRouterSelect from '@components/shared/educare-router-select';
import RequestApi from '@library/apis/request.api';
import { useRequestPagination } from '@library/apis/request-pagination.api';
import { PermissionActionsEnum, PermissionModulesEnum } from '@library/enums';
import type { TFaqResponse } from '@library/schemas/content-management/faq';
import { useHasPermission } from '@library/utils/permissionUtils';
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';

import EduCarePermissionWrapper from '../../shared/educare-permission-wrapper';

const ListFaqsComponent = () => {
    const addOrEditFaqState = useSafeState<string | boolean | 'reload' | 'cancel'>('reload');
    const {
        data: faqData,
        loading: faqLoading,
        onChange: onFaqTableChange,
        onSearch: onFaqSearch,
    } = useRequestPagination<TFaqResponse>(
        {
            version: 'v1',
            module: 'faq',
            method: 'GET',
            url: 'list',
            urlQueries: {
                page: 1,
                limit: EducareDataTablePaginationProps.pageSize as number,
            },
        },
        {
            routerPagination: true,
            readyDependencies: [addOrEditFaqState[0] === 'reload'],
        },
    );
    const { run: onDeleteFaq, loading: deleteFaqLoading } = useRequest(RequestApi<null, string>, {
        manual: true,
        onSuccess: res => {
            onFaqSearch('');
            EducareMessageAlert(res?.message || 'Successfully deleted');
        },
        onError: (err: any) => {
            EducareMessageAlert(err?.error?.systems || 'Failed to delete', 'error');
        },
    });
    const canEdit = useHasPermission(PermissionModulesEnum.CONTENT_MANAGEMENT, PermissionActionsEnum.UPDATE);
    const canDelete = useHasPermission(PermissionModulesEnum.CONTENT_MANAGEMENT, PermissionActionsEnum.DELETE);

    return (
        <Table
            rowKey="id"
            tableLayout="auto"
            showHeader={false}
            dataSource={faqData?.payload || []}
            pagination={EducareDataTablePaginationBuilder(faqData)}
            loading={EducareDataTableLoadingBuilder(faqLoading)}
            locale={EducareDataTableLocalBuilder(faqLoading)}
            onChange={onFaqTableChange}
            title={() => (
                <div>
                    <AddOrEditFaqDrawer state={addOrEditFaqState} type={typeof addOrEditFaqState[0] === 'boolean' ? 'create' : 'update'} />
                    <div className="flex justify-between gap-2">
                        <h3 className="font-bold">FAQs</h3>
                        <EduCarePermissionWrapper module={PermissionModulesEnum.CONTENT_MANAGEMENT} permissions={PermissionActionsEnum.CREATE}>
                            <IthriveButton variant="filled" onClick={() => addOrEditFaqState[1](true)}>
                                Add FAQ
                            </IthriveButton>
                        </EduCarePermissionWrapper>
                    </div>
                    <div className="grid md:grid-cols-5 mt-2 gap-2">
                        <div className="md:col-span-3" />
                        <div className="md:col-span-2 grid md:grid-cols-2 items-center gap-2">
                            <EducareRouterSearch routerQuery="keyword" name="faq-search-keyword" />
                            <EducareRouterSelect
                                name="faq-sort"
                                routerQuery="sort"
                                placeholder="Sort By"
                                options={[
                                    { label: 'A-Z', value: 'question:asc' },
                                    { label: 'Z-A', value: 'question:desc' },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            )}
            columns={[
                {
                    title: 'Question',
                    dataIndex: 'question',
                    className: '!py-2',
                    render: (question: string, record: TFaqResponse, index: number) => (
                        <div className="flex justify-between my-1">
                            <div className="flex gap-2">
                                <span className="mt-0.5">{(index + 1).toString().padStart(2, '0')}.</span>
                                <div className="grid">
                                    <h3 className="font-bold">{question}</h3>
                                    <span dangerouslySetInnerHTML={{ __html: record.answer }}></span>
                                </div>
                            </div>
                            <Popover
                                destroyTooltipOnHide
                                forceRender
                                trigger={['click']}
                                placement="leftTop"
                                zIndex={2}
                                content={
                                    <div className="flex flex-col gap-2">
                                        <EduCarePermissionWrapper
                                            module={PermissionModulesEnum.CONTENT_MANAGEMENT}
                                            permissions={PermissionActionsEnum.UPDATE}>
                                            <IthriveButton
                                                type="text"
                                                size="small"
                                                className="!justify-start mr-5"
                                                icon={<EditOutlined />}
                                                disabled={faqLoading || deleteFaqLoading}
                                                onClick={() => {
                                                    addOrEditFaqState[1](record.id);
                                                }}>
                                                Edit
                                            </IthriveButton>
                                        </EduCarePermissionWrapper>
                                        <EduCarePermissionWrapper
                                            module={PermissionModulesEnum.CONTENT_MANAGEMENT}
                                            permissions={PermissionActionsEnum.DELETE}>
                                            <EducareConfirmDelete
                                                title="Delete FAQ"
                                                subtitle="Are you sure to delete this FAQ?"
                                                loading={deleteFaqLoading}
                                                onDelete={() => {
                                                    onDeleteFaq({
                                                        version: 'v1',
                                                        module: 'faq',
                                                        method: 'DELETE',
                                                        url: record.id,
                                                    });
                                                }}>
                                                <IthriveButton
                                                    type="text"
                                                    size="small"
                                                    className="text-red-500 !justify-start"
                                                    disabled={faqLoading}
                                                    loading={deleteFaqLoading}
                                                    icon={<DeleteOutlined />}>
                                                    Delete
                                                </IthriveButton>
                                            </EducareConfirmDelete>
                                        </EduCarePermissionWrapper>
                                    </div>
                                }>
                                {!canDelete && !canEdit ? <div></div> : <IthriveButton type="text" icon={<BsThreeDotsVertical />} />}
                            </Popover>
                        </div>
                    ),
                },
            ]}
        />
    );
};

export default ListFaqsComponent;
