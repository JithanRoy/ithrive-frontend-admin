import { useState } from 'react';
import { useRouter } from 'next/router';
import { useRequest } from 'ahooks';

import { Button, Modal, Popover, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    PauseOutlined,
    UndoOutlined,
} from '@ant-design/icons';
import EducareButton from '@components/shared/educare-button';
import {
    EducareDataTableLoadingBuilder,
    EducareDataTableLocalBuilder,
    EducareDataTablePaginationBuilder,
    EducareDataTablePaginationProps,
} from '@components/shared/educare-datatable';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import EduCarePermissionWrapper from '@components/shared/educare-permission-wrapper';
import EducareRouterSelect from '@components/shared/educare-router-select';
import type { EducareRouterTabsProps } from '@components/shared/educare-router-tabs';
import EducareRouterTabs from '@components/shared/educare-router-tabs';
import RequestApi from '@library/apis/request.api';
import { useRequestPagination } from '@library/apis/request-pagination.api';
import { PermissionActionsEnum, PermissionModulesEnum, ReportManagementStatusEnum, ReportReason } from '@library/enums';
import { funcFormatDate, funcTruncateText } from '@library/functions';
import type { TReportManagementResponse } from '@library/schemas/report-management';
import { FaArrowCircleRight } from '@react-icons/all-files/fa/FaArrowCircleRight';
import { IoFilter } from '@react-icons/all-files/io5/IoFilter';

import { EduCareSelectUiTwo } from '../../shared/educare-select-2';

import DayPickerForFilter from './Daypicker';
export type TReportStatusPayload = {
    actionStatus: string;
};

const SUPPORT_TABLE_TABS: EducareRouterTabsProps = {
    name: 'list-report-management',
    routerQuery: 'reportType',
    items: [
        {
            key: '',
            label: 'All',
        },
        {
            key: 'content',
            label: 'Content',
        },
        {
            key: 'user',
            label: 'User',
        },
    ],
};
const getReasonDescription = (x: any) => {
    return ReportReason[x as keyof typeof ReportReason] ?? '';
};

const ListReportManagement = () => {
    const router = useRouter();
    const [currentReasons, setCurrentReasons] = useState<string[]>([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleCloseModal = () => {
        setIsModalVisible(false);
        setCurrentReasons([]);
    };
    const {
        data: reportManagementData,
        loading: reportManagementLoading,
        onChange: onReportManagementTableChange,
        onSearch: onReportManagementSearch,
    } = useRequestPagination<TReportManagementResponse>(
        {
            version: 'v1',
            module: 'report-management',
            method: 'GET',
            url: 'find-report',
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

    const COLUMNS: ColumnsType<TReportManagementResponse> = [
        {
            title: 'Id',
            dataIndex: 'ticketNumber',
            key: 'ticketNumber',
            render: ticketNumber => <span>{`#${ticketNumber}`}</span>,
        },
        {
            title: 'Report date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: createdAt => <div className="flex flex-col">{funcFormatDate(createdAt)}</div>,
        },
        {
            title: 'Category',
            dataIndex: 'reportFor',
            key: 'reportFor',
            ellipsis: true,
            render: reportFor => <div>{reportFor}</div>,
        },
        {
            title: 'Content/User',
            dataIndex: 'reportFor',
            key: 'reportFor',
            ellipsis: true,
            render: reportFor => (['student', 'organization'].includes(reportFor) ? 'User' : 'Content'),
        },
        {
            title: <div className="text-center">Reason(s)</div>,
            dataIndex: 'reasonForReport',
            key: 'reasonForReport',
            render: (reasonForReport, record) => (
                <div className="text-center">
                    <Button
                        className="w-80 m-1 p-5 shadow-xl rounded-3xl"
                        onClick={() => {
                            setIsModalVisible(true);
                            setCurrentReasons(reasonForReport);
                        }}>
                        {reasonForReport[0].length > 40 ? funcTruncateText(reasonForReport[0]) : `${reasonForReport[0]}....`}
                    </Button>
                    <Modal
                        title={'Reason(s)'}
                        centered
                        onCancel={handleCloseModal}
                        onOk={handleCloseModal}
                        open={isModalVisible}
                        width={860}
                        footer={null}>
                        <div className="p-4">
                            <div>
                                {currentReasons.map((reason, index) => {
                                    if (!reason)
                                        return currentReasons.length === 1 ? (
                                            <>
                                                <p>No reasons found</p>
                                            </>
                                        ) : null;

                                    const desc = getReasonDescription(reason);
                                    return (
                                        <div className="space-y-2 flex gap-4 mb-2" key={index}>
                                            <div className="text-primary mt-2">
                                                <FaArrowCircleRight />
                                            </div>
                                            <div className="font-extrabold">
                                                {!!desc ? reason : 'Others'}
                                                <span className="font-medium">
                                                    <br /> {!!desc ? desc : reason}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Modal>
                </div>
            ),
        },
        {
            title: 'Action status',
            dataIndex: 'actionStatus',
            key: 'actionStatus',
            render: (actionStatus, record) => (
                <EduCarePermissionWrapper module={PermissionModulesEnum.REPORT_MANAGEMENT} permissions={PermissionActionsEnum.UPDATE}>
                    {actionStatus === 'Delete user' ? (
                        <span className="text-red-600 bg-yellow-50 border-emerald-400 p-3 rounded-lg">Deleted User</span>
                    ) : (
                        <EduCareSelectUiTwo
                            showSearch={false}
                            name="status"
                            type="default"
                            loading={changeStatusApi.params?.[0]?.url === record.id && changeStatusApi.loading}
                            value={actionStatus ? actionStatus.toString() : ReportManagementStatusEnum.PENDING.toString()}
                            options={[
                                {
                                    label: (
                                        <div className="text-blue-500">
                                            <PauseOutlined /> Pending
                                        </div>
                                    ),
                                    value: ReportManagementStatusEnum.PENDING.toString(),
                                },
                                {
                                    label: (
                                        <div className="text-orange-500">
                                            <UndoOutlined /> Under review
                                        </div>
                                    ),
                                    value: ReportManagementStatusEnum.UNDER_REVIEW.toString(),
                                },
                                {
                                    label: (
                                        <div className="text-pink-700">
                                            <EyeInvisibleOutlined /> Ignored
                                        </div>
                                    ),
                                    value: ReportManagementStatusEnum.IGNORED.toString(),
                                },
                                {
                                    label: (
                                        <div className="text-green-500">
                                            <CheckCircleOutlined /> Resolved
                                        </div>
                                    ),
                                    value: ReportManagementStatusEnum.RESOLVED.toString(),
                                },
                                {
                                    label: (
                                        <div className="text-red-900">
                                            <CloseCircleOutlined /> Suspended user
                                        </div>
                                    ),
                                    value: ReportManagementStatusEnum.SUSPENDED_USER.toString(),
                                },
                                {
                                    label: (
                                        <div className="text-red-500">
                                            <DeleteOutlined /> Deleted user
                                        </div>
                                    ),
                                    value: ReportManagementStatusEnum.DELETE_USER.toString(),
                                },
                            ]}
                            onSelect={value => {
                                if (value !== actionStatus?.toString()) {
                                    onChangeStatus(record.id, {
                                        actionStatus: value,
                                    });
                                }
                            }}
                        />
                    )}
                </EduCarePermissionWrapper>
            ),
        },
    ];
    const changeStatusApi = useRequest(RequestApi<TReportStatusPayload, any>, {
        manual: true,
        onSuccess: res => {
            EducareMessageAlert(res?.message || 'Status updated successfully');
            onReportManagementSearch('');
        },
        onError: error => {
            EducareMessageAlert(error?.message || 'Failed to update status');
        },
    });
    const onChangeStatus = (id: string, actionStatus: TReportStatusPayload) => {
        changeStatusApi.run({
            module: 'report-management',
            method: 'PUT',
            url: `change-report-status/${id}?actionStatus=${actionStatus?.actionStatus}`,
        });
    };
    return (
        <Table
            rowKey="id"
            tableLayout="auto"
            scroll={{ scrollToFirstRowOnChange: true, x: 1000 }}
            dataSource={reportManagementData?.payload || []}
            pagination={EducareDataTablePaginationBuilder(reportManagementData)}
            loading={EducareDataTableLoadingBuilder(reportManagementLoading)}
            locale={EducareDataTableLocalBuilder(reportManagementLoading)}
            onChange={onReportManagementTableChange}
            title={() => (
                <div>
                    <h3 className="font-bold">Report management</h3>
                    <div className="grid md:grid-cols-5 mt-2 gap-2">
                        <EducareRouterTabs className="md:col-span-3" {...SUPPORT_TABLE_TABS} />
                        <div className="md:col-span-2 grid md:grid-cols-2 items-center gap-2">
                            <Popover
                                placement="bottom"
                                title=""
                                className=""
                                trigger="click"
                                content={
                                    <div className="grid gap-2">
                                        <div className="col-span-1 w-52">
                                            <DayPickerForFilter />
                                        </div>
                                        <EducareRouterSelect
                                            className="col-span-1 w-52"
                                            name="report-management-category-filter"
                                            routerQuery="reportCategory"
                                            placeholder="Category"
                                            options={[
                                                { value: 'student', label: 'Student Profile' },
                                                { value: 'organization', label: 'Organisation Profile' },
                                                { value: 'social-post', label: 'Social Post' },
                                                { value: 'housing-accommodation', label: 'Housing & Accommodation' },
                                                { value: 'marketplace', label: 'Marketplace' },
                                                { value: 'scholarship', label: 'Scholarship' },
                                                { value: 'event', label: 'Event' },
                                                { value: 'home-office', label: 'Home Office Update' },
                                                { value: 'job', label: 'Job' },
                                            ]}
                                        />
                                        <EducareRouterSelect
                                            className="col-span-1 w-52"
                                            name="report-management-action-filter"
                                            routerQuery="actionStatus"
                                            placeholder="Action status"
                                            options={[
                                                { value: 'Pending', label: 'Pending' },
                                                { value: 'Under review', label: 'Under review' },
                                                { value: 'Ignored', label: 'Ignored' },
                                                { value: 'Resolved', label: 'Resolved' },
                                                { value: 'Suspended user', label: 'Suspended user' },
                                                { value: 'Delete user', label: 'Deleted user' },
                                            ]}
                                        />
                                    </div>
                                }>
                                <EducareButton className="flex gap-3 text-gray-500 h-[40px] justify-center items-center">
                                    <div className="pt-1">
                                        <IoFilter size={14} />
                                    </div>
                                    <span>Filters</span>
                                </EducareButton>
                            </Popover>
                            <EducareRouterSelect
                                name="report-management-sort"
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
                    title: 'Action date',
                    dataIndex: 'actionDate',
                    key: 'actionDate',
                    render: updatedAt => <div className="flex flex-col">{funcFormatDate(updatedAt)}</div>,
                },
                {
                    title: 'Details',
                    width: 200,
                    align: 'center',
                    key: 'details',
                    render: (_, record) => (
                        <div className="flex justify-center">
                            <EducareButton
                                type="text"
                                className="text-center"
                                size="small"
                                icon={<EyeOutlined className="text-primary" />}
                                onClick={() => router.push(`/report-management/report-details?id=${record.id}`)}
                            />
                        </div>
                    ),
                },
            ]}
        />
    );
};

export default ListReportManagement;
