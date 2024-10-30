import React from 'react';
import { useRequest, useSafeState } from 'ahooks';

import { Popover, Table } from 'antd';

import { useRecoilValue } from 'recoil';
import { UserInfoAtom } from '@store/UserInfoAtom';

import HomeOfficeAddModal from '@components/app/home-office/AddHomeOfficeUpdate';
import EducareBackdrop from '@components/shared/educare-backdrop';
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
import RequestApi from '@library/apis/request.api';
import { useRequestPagination } from '@library/apis/request-pagination.api';
import { PermissionActionsEnum, PermissionModulesEnum } from '@library/enums';
import type { THomeOfficeUpdateResponse } from '@library/schemas/home-office';
import { IoFilter } from '@react-icons/all-files/io5/IoFilter';

import EduCarePermissionWrapper from '../../shared/educare-permission-wrapper';

import HomeOfficeTaxonomy from './atoms/HomeOfficeTaxonomy';

const ListHomeOfficeUpdate = () => {
    const { userInfo } = useRecoilValue(UserInfoAtom);
    const addOrEditHomeOfficeState = useSafeState<string | boolean | 'reload' | 'cancel'>('reload');

    const {
        data: homeOfficeData,
        loading: homeOfficeLoading,
        onChange: onHomeOfficeTableChange,
        onSearch: onHomeOfficeTableSearch,
    } = useRequestPagination<THomeOfficeUpdateResponse>(
        {
            version: 'v1',
            module: 'home-office',
            method: 'GET',
            url: 'my-list',
            urlQueries: {
                page: 1,
                limit: EducareDataTablePaginationProps.pageSize as number,
                sort: 'updatedAt:desc',
            },
        },
        {
            scrollToTop: true,
            routerPagination: true,
            readyDependencies: [addOrEditHomeOfficeState[0] === 'reload'],
        },
    );
    const { run: onDeleteSocialPost, loading: deleteSocialPostLoading } = useRequest(RequestApi<null, string>, {
        manual: true,
        onSuccess: res => {
            onHomeOfficeTableSearch('');
            EducareMessageAlert(res?.message || 'Successfully deleted');
        },
        onError: (err: any) => {
            EducareMessageAlert(err?.error?.systems || 'Failed to delete', 'error');
        },
    });

    return (
        <div className="max-w-full lg:max-w-[75vw] mx-auto">
            <Table
                rowKey="id"
                tableLayout="auto"
                showHeader={false}
                rowHoverable={false}
                bordered={false}
                scroll={{ scrollToFirstRowOnChange: true }}
                dataSource={homeOfficeData?.payload || []}
                pagination={EducareDataTablePaginationBuilder(homeOfficeData)}
                loading={EducareDataTableLoadingBuilder(homeOfficeLoading)}
                locale={EducareDataTableLocalBuilder(homeOfficeLoading)}
                onChange={onHomeOfficeTableChange}
                title={() => (
                    <div>
                        <HomeOfficeAddModal
                            state={addOrEditHomeOfficeState}
                            type={typeof addOrEditHomeOfficeState[0] === 'boolean' ? 'create' : 'update'}
                        />
                        <div className="grid lg:grid-cols-5 gap-2">
                            <div className="lg:col-span-2">
                                <h3 className="font-bold">Home office updates</h3>
                            </div>
                            <div className="grid md:grid-cols-5 items-center gap-2 justify-center lg:col-span-3">
                                <div className="col-span-1 md:col-span-2">
                                    <EducareRouterSearch routerQuery="keyword" name="social-post-search-keyword" />
                                </div>
                                <EducareRouterSelect
                                    name="home-office-sort"
                                    className="col-span-1"
                                    routerQuery="sort"
                                    placeholder="Sort By"
                                    options={[
                                        { label: 'Latest', value: 'updatedAt:desc' },
                                        { label: 'Oldest', value: 'updatedAt:asc' },
                                        { label: 'Most Liked', value: 'reactionCount:desc' },
                                    ]}
                                />
                                <Popover
                                    placement="bottom"
                                    title=""
                                    className=""
                                    trigger="click"
                                    content={
                                        <div className="grid gap-2">
                                            <EducareRouterSelect
                                                className="col-span-1 w-52"
                                                name="home-office-filter"
                                                routerQuery="typeOfVisa"
                                                placeholder="Type of visa"
                                                mode="multiple"
                                                options={[
                                                    { value: 'student', label: 'Student' },
                                                    { value: 'work-visa', label: 'Work Visa' },
                                                    { value: 'short-term-study-visa', label: 'Short Term Study Visa' },
                                                ]}
                                            />
                                            <EducareRouterSelect
                                                className="col-span-1 w-52"
                                                name="home-office-category-filter"
                                                routerQuery="category"
                                                placeholder="Category"
                                                mode="multiple"
                                                options={[
                                                    { value: 'immigration-laws', label: 'Immigration Laws' },
                                                    { value: 'security-updates', label: 'Security Updates' },
                                                    { value: 'legal-changes', label: 'Legal Changes' },
                                                    { value: 'residency-rules', label: 'Residency Rules' },
                                                ]}
                                            />
                                            <EducareRouterSelect
                                                className="col-span-1 w-52"
                                                name="home-office-legislative-filter"
                                                routerQuery="legislativeChanges"
                                                placeholder="Legislative changes"
                                                mode="multiple"
                                                options={[
                                                    { value: 'new-laws', label: 'New Laws' },
                                                    { value: 'amendments', label: 'Amendments' },
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
                                <EduCarePermissionWrapper
                                    module={PermissionModulesEnum.HOME_OFFICE_UPDATES}
                                    permissions={PermissionActionsEnum.CREATE}>
                                    <EducareButton
                                        className="h-9 col-span-1 lg:text-xs lg:!leading-3 text-[10px]"
                                        variant="filled"
                                        onClick={() => addOrEditHomeOfficeState[1](true)}>
                                        Create Update
                                    </EducareButton>
                                </EduCarePermissionWrapper>
                            </div>
                        </div>
                    </div>
                )}
                columns={[
                    {
                        title: 'Post',
                        dataIndex: 'post',
                        className: '!py-2 !border-b-0',
                        render: (post: string, record: THomeOfficeUpdateResponse, index: number) => (
                            <>
                                <EducareBackdrop status={deleteSocialPostLoading} />
                                <div className="md:px-0 px-0">
                                    <HomeOfficeTaxonomy
                                        key={index}
                                        id={record.id}
                                        title={record.title}
                                        description={record.description}
                                        image={record?.image || ''}
                                        imageBlurHash={record?.imageBlurHash || ''}
                                        user={record?.userInfo}
                                        updatedAt={record.updatedAt}
                                        noAction={false}
                                        likes={record?.reactionCount}
                                        comments={record?.commentCount}
                                        shares={record?.shareCount}
                                        editable={record?.userId === userInfo.id}
                                        onEdit={() => addOrEditHomeOfficeState[1](record.id)}
                                        deletable={true}
                                        onDelete={() => {
                                            onDeleteSocialPost({
                                                version: 'v1',
                                                module: 'home-office',
                                                method: 'DELETE',
                                                url: record.id,
                                            });
                                        }}
                                    />
                                </div>
                            </>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default ListHomeOfficeUpdate;
