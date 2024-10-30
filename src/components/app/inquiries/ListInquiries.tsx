import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

import dayjs from 'dayjs';

import { EyeOutlined } from '@ant-design/icons';
import EducareButton from '@components/shared/educare-button';
import {
    EducareDataTableLoadingBuilder,
    EducareDataTableLocalBuilder,
    EducareDataTablePaginationBuilder,
    EducareDataTablePaginationProps,
} from '@components/shared/educare-datatable';
import EducareImage from '@components/shared/educare-image';
import EducareRouterSearch from '@components/shared/educare-router-search';
import EducareRouterSelect from '@components/shared/educare-router-select';
import type { EducareRouterTabsProps } from '@components/shared/educare-router-tabs';
import EducareRouterTabs from '@components/shared/educare-router-tabs';
import { useRequestPagination } from '@library/apis/request-pagination.api';
import { funcTruncateText } from '@library/functions';
import type { TInquiryData } from '@library/schemas/inquiries';

import InquiriesDetails from './InquiriesDetailsModal';

const COLUMNS: ColumnsType<TInquiryData> = [
    {
        title: 'User',
        dataIndex: 'email',
        key: 'email',
        ellipsis: true,
        render: (email, record) => {
            return (
                <div className="flex items-center gap-3">
                    <EducareImage variant="avatar" preview={false} image={record.userInfo.profilePic} />
                    <div>
                        <div>{`${record?.firstName || ''} ${record?.lastName || ''}`}</div>
                        <small>{record?.email || ''}</small>
                    </div>
                </div>
            );
        },
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (title, record) => (
            <div className="max-w-64">
                <small>{funcTruncateText(record?.scholarshipInfo?.title || record?.homeOfficeInfo?.title || '')}</small>
            </div>
        ),
    },
    {
        title: 'Subject',
        dataIndex: 'subject',
        key: 'subject',
        render: subject => <div>{subject}</div>,
    },
    {
        title: 'Phone Number',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber',
        render: mobileNumber => <div>{mobileNumber}</div>,
    },
    {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: date => <div className="flex flex-col">{dayjs(date).format('MMM D, YYYY')}</div>,
    },
];

const INQUIRY_TABLE_TABS: EducareRouterTabsProps = {
    name: 'list-inquiry',
    routerQuery: 'type',
    items: [
        {
            key: 'scholarship',
            label: 'Scholarship',
        },
        {
            key: 'home-office',
            label: 'Home Office',
        },
    ],
};

const ListInquiryComponent = () => {
    const router = useRouter();
    const [selectedRecord, setSelectedRecord] = useState<TInquiryData | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleShowDetails = (record: TInquiryData) => {
        setSelectedRecord(record);
        setIsModalVisible(true);
    };
    const handleCloseModal = () => {
        setIsModalVisible(false);
    };
    const {
        data: inquiriesData,
        loading: inquiriesLoading,
        onChange: onInquiriesTableChange,
    } = useRequestPagination<TInquiryData>(
        {
            version: 'v1',
            module: 'inquiries',
            method: 'GET',
            url: router.query.type as string,
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

    return (
        <>
            <Table
                rowKey="id"
                tableLayout="auto"
                dataSource={inquiriesData?.payload || []}
                pagination={EducareDataTablePaginationBuilder(inquiriesData)}
                loading={EducareDataTableLoadingBuilder(inquiriesLoading)}
                locale={EducareDataTableLocalBuilder(inquiriesLoading)}
                onChange={onInquiriesTableChange}
                title={() => (
                    <>
                        <h3 className="font-bold">Inquiries</h3>
                        <div className="grid md:grid-cols-5 mt-2 gap-2">
                            <EducareRouterTabs className="md:col-span-3" {...INQUIRY_TABLE_TABS} />
                            <div className="md:col-span-2 grid md:grid-cols-2 items-center gap-2">
                                <EducareRouterSearch routerQuery="keyword" name="inquiries-search" />
                                <EducareRouterSelect
                                    name="support-center-sort"
                                    routerQuery="sort"
                                    placeholder="Sort By"
                                    options={[
                                        { label: 'Latest', value: 'createdAt:desc' },
                                        { label: 'Oldest', value: 'createdAt:asc' },
                                    ]}
                                />
                            </div>
                        </div>
                    </>
                )}
                columns={[
                    ...COLUMNS,
                    {
                        title: 'Action',
                        key: 'action',
                        className: 'w-24',
                        render: (_, record) => (
                            <EducareButton
                                type="text"
                                size="small"
                                icon={<EyeOutlined className="text-primary" />}
                                onClick={() => handleShowDetails(record)}
                            />
                        ),
                    },
                ]}
            />
            {isModalVisible && selectedRecord && <InquiriesDetails selectedRecord={selectedRecord} onClose={handleCloseModal} />}
        </>
    );
};

export default ListInquiryComponent;
