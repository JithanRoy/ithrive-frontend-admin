import React from 'react';
import { useRouter } from 'next/router';
import { useDeepCompareEffect, useRequest } from 'ahooks';

import { Skeleton } from 'antd';

import RequestApi from '@library/apis/request.api';
import type { TSocialPostResponse } from '@library/schemas/social-post';
import { IoMdArrowBack } from '@react-icons/all-files/io/IoMdArrowBack';

import SocialPostTaxonomy from './atoms/SocialPostTaxonomy';

const SocialPostDetailsComponent = () => {
    const router = useRouter();
    const { data: apiData, run: getData, loading: apiLoading, refresh: apiRefresh } = useRequest(RequestApi<any, TSocialPostResponse>);
    useDeepCompareEffect(() => {
        getData({ version: 'v1', method: 'GET', module: 'social-post', url: `${router.query.id}` });
    }, [router.query.id]);

    const postData: TSocialPostResponse | '' = apiData ? apiData.payload : '';
    if (apiLoading) {
        return <Skeleton avatar paragraph={{ rows: 5 }} loading={apiLoading} />;
    }
    return (
        <div className="p-2">
            <div className="flex gap-3 items-center mb-2">
                <IoMdArrowBack className="text-2xl cursor-pointer" onClick={() => router.back()} />
                <div className="text-xl font-semibold">Social Post Details</div>
            </div>
            <div className="md:px-0 px-0">
                {postData && (
                    <SocialPostTaxonomy
                        id={postData.id}
                        text={postData.post}
                        noAction={false}
                        likes={postData.reactionCount}
                        shares={postData.shareCount}
                        images={postData.images}
                        comments={postData.commentCount}
                        updatedAt={postData.updatedAt}
                        gradient={postData.statusBackgroundColor}
                        user={postData.userInfo}
                        editable={false}
                        deletable={false}
                    />
                )}
            </div>
        </div>
    );
};
export default SocialPostDetailsComponent;
