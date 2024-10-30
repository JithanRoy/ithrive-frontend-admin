import React from 'react';
import { useRouter } from 'next/router';
import { useDeepCompareEffect, useRequest } from 'ahooks';

import { Skeleton } from 'antd';

import RequestApi from '@library/apis/request.api';
import type { THomeOfficeUpdateResponse } from '@library/schemas/home-office';
import { IoMdArrowBack } from '@react-icons/all-files/io/IoMdArrowBack';

import HomeOfficeTaxonomy from './atoms/HomeOfficeTaxonomy';

const HomeOfficeDetailsComponent = () => {
    const router = useRouter();
    const { data: apiData, run: getData, loading: apiLoading, refresh: apiRefresh } = useRequest(RequestApi<any, THomeOfficeUpdateResponse>);
    useDeepCompareEffect(() => {
        getData({ version: 'v1', method: 'GET', module: 'home-office', url: `${router.query.id}` });
    }, [router.query.id]);

    const postData: THomeOfficeUpdateResponse | '' = apiData ? apiData.payload : '';
    if (apiLoading) {
        return <Skeleton avatar paragraph={{ rows: 5 }} loading={apiLoading} />;
    }
    return (
        <div className="p-2">
            <div className="flex gap-3 items-center mb-2">
                <IoMdArrowBack className="text-2xl cursor-pointer" onClick={() => router.back()} />
                <div className="text-xl font-semibold">Home Office Update</div>
            </div>
            <div className="md:px-0 px-0">
                {postData && (
                    <HomeOfficeTaxonomy
                        id={postData.id}
                        noAction={false}
                        likes={postData.reactionCount}
                        shares={postData.shareCount}
                        comments={postData.commentCount}
                        updatedAt={postData.updatedAt}
                        user={postData.userInfo}
                        editable={false}
                        deletable={false}
                        title={postData.title}
                        description={postData.description}
                        image={postData?.image || ''}
                        imageBlurHash={postData?.imageBlurHash || ''}
                    />
                )}
            </div>
        </div>
    );
};
export default HomeOfficeDetailsComponent;
