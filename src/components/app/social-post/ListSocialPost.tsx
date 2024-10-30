import React from 'react';
import { useRouter } from 'next/router';
import { useRequest, useSafeState } from 'ahooks';

import { Popover, Table } from 'antd';

import { useRecoilValue } from 'recoil';
import { UserInfoAtom } from '@store/UserInfoAtom';

import AddSocialPostModal from '@components/app/social-post/AddSocialPost';
import SocialPostTaxonomy from '@components/app/social-post/atoms/SocialPostTaxonomy';
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
import type { TSocialPostResponse } from '@library/schemas/social-post';
import { IoFilter } from '@react-icons/all-files/io5/IoFilter';

const ListSocialPost = () => {
    const router = useRouter();
    const { userInfo } = useRecoilValue(UserInfoAtom);

    const addOrEditSocialPostState = useSafeState<string | boolean | 'reload' | 'cancel'>('reload');

    const {
        data: socialPostData,
        loading: socialPostLoading,
        onChange: onSocialPostTableChange,
        onSearch: onSocialPostTableSearch,
    } = useRequestPagination<TSocialPostResponse>(
        {
            version: 'v1',
            module: 'social-post',
            method: 'GET',
            url: 'list',
            urlQueries: {
                page: 1,
                limit: EducareDataTablePaginationProps.pageSize as number,
                sort: 'updatedAt:desc',
            },
        },
        {
            scrollToTop: true,
            routerPagination: true,
            readyDependencies: [addOrEditSocialPostState[0] === 'reload'],
        },
    );

    const { run: onDeleteSocialPost, loading: deleteSocialPostLoading } = useRequest(RequestApi<null, string>, {
        manual: true,
        onSuccess: res => {
            onSocialPostTableSearch('');
            EducareMessageAlert(res?.message || 'Successfully deleted');
        },
        onError: (err: any) => {
            EducareMessageAlert(err?.error?.systems || 'Failed to delete', 'error');
        },
    });
    React.useEffect(() => {
        if (!socialPostLoading) {
            window.scrollTo(0, 0);
        }
    }, [socialPostLoading, socialPostData, router.query.page, onSocialPostTableChange]);

    return (
        <div className="max-w-full lg:max-w-[75vw] mx-auto">
            <Table
                rowKey="id"
                tableLayout="auto"
                showHeader={false}
                rowHoverable={false}
                bordered={false}
                dataSource={socialPostData?.payload || []}
                pagination={EducareDataTablePaginationBuilder(socialPostData)}
                loading={EducareDataTableLoadingBuilder(socialPostLoading)}
                locale={EducareDataTableLocalBuilder(socialPostLoading)}
                onChange={onSocialPostTableChange}
                title={() => (
                    <div>
                        <AddSocialPostModal
                            state={addOrEditSocialPostState}
                            type={typeof addOrEditSocialPostState[0] === 'boolean' ? 'create' : 'update'}
                        />
                        <div className="grid lg:grid-cols-5 gap-2">
                            <div className="lg:col-span-2">
                                <h3 className="font-bold">Social Post</h3>
                            </div>
                            <div className="grid md:grid-cols-5 items-center gap-2 justify-center lg:col-span-3">
                                <div className="col-span-1 md:col-span-2">
                                    <EducareRouterSearch routerQuery="keyword" name="social-post-search-keyword" />
                                </div>
                                <EducareRouterSelect
                                    className="col-span-1"
                                    name="social-post-sort"
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
                                    title={''}
                                    className=""
                                    content={
                                        <div className="grid gap-2">
                                            <EducareRouterSelect
                                                className="col-span-1 w-44"
                                                name="social-post-filter"
                                                routerQuery="postBy"
                                                placeholder="Posted by"
                                                mode="multiple"
                                                options={[
                                                    { value: 'organization', label: 'Organisations' },
                                                    { value: 'student', label: 'Students' },
                                                    { value: 'admin', label: 'Admin' },
                                                ]}
                                            />
                                            <EducareRouterSelect
                                                className="col-span-1 w-44"
                                                name="social-post-category"
                                                routerQuery="category"
                                                placeholder="Category"
                                                options={[
                                                    { label: 'Business Idea', value: 'business-idea' },
                                                    { label: 'Social Engagement', value: 'social-engagement' },
                                                ]}
                                            />
                                        </div>
                                    }
                                    trigger="click">
                                    <EducareButton className="flex gap-3 text-gray-500 h-[40px] justify-center items-center">
                                        <div className="pt-1">
                                            <IoFilter size={14} />
                                        </div>
                                        <span>Filters</span>
                                    </EducareButton>
                                </Popover>
                                {/*<EduCarePermissionWrapper module={PermissionModulesEnum.SOCIAL_POST} permissions={PermissionActionsEnum.CREATE}>*/}
                                <EducareButton
                                    className="h-9 col-span-1 lg:text-xs text-[10px]"
                                    variant="filled"
                                    onClick={() => addOrEditSocialPostState[1](true)}>
                                    Create Post
                                </EducareButton>
                                {/*</EduCarePermissionWrapper>*/}
                            </div>
                        </div>
                    </div>
                )}
                columns={[
                    {
                        title: 'Post',
                        dataIndex: 'post',
                        className: '!py-2 !border-b-0',
                        render: (post: string, record: TSocialPostResponse, index: number) => (
                            <>
                                <EducareBackdrop status={deleteSocialPostLoading} />
                                <div className="md:px-0 px-0">
                                    <SocialPostTaxonomy
                                        key={index}
                                        id={record.id}
                                        text={post}
                                        noAction={false}
                                        images={record.images}
                                        likes={record.reactionCount}
                                        comments={record.commentCount}
                                        shares={record.shareCount}
                                        updatedAt={record.updatedAt}
                                        gradient={record.statusBackgroundColor}
                                        user={record.userInfo}
                                        editable={true}
                                        onEdit={() => addOrEditSocialPostState[1](record.id)}
                                        deletable={true}
                                        onDelete={() => {
                                            onDeleteSocialPost({
                                                version: 'v1',
                                                module: 'social-post',
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

export default ListSocialPost;
