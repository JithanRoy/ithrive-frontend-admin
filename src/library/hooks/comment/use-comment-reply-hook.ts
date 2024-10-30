// eslint-disable-next-line simple-import-sort/imports
import { useEffect, useState } from 'react';

import { EducareDataTablePaginationProps } from '@components/shared/educare-datatable';
import { useRequestPagination } from '@library/apis/request-pagination.api';
import type { TApiModule } from '@library/apis/request.api';
import type { CommentResponse } from '@library/schemas/social-post';

export default function useCommentReplyPaginate({ postId, commentId, module }: { postId: string; commentId: string; module: TApiModule }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [replies, setReplies] = useState<CommentResponse[]>([]);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [reachedEnd, setReachedEnd] = useState(false);
    const updateReply = (reply: CommentResponse, isDeleted?: boolean) => {
        setReplies(oldReplies => {
            return isDeleted ? oldReplies.filter(o => o.id !== reply.id) : oldReplies.map(o => (o.id === reply.id ? reply : o));
        });
    };

    const { data: apiData, loading } = useRequestPagination<CommentResponse>(
        {
            version: 'v1',
            method: 'GET',
            module,
            url: `${postId}/comment/${commentId}/reply`,
            urlQueries: {
                page: currentPage,
                limit: EducareDataTablePaginationProps.pageSize as number,
                // sort: 'createdAt:desc',
            },
        },
        {
            routerPagination: false,
            readyDependencies: [currentPage],
        },
    );

    // const reachedEnd = useMemo(() => {
    //     return ;
    // }, [apiData, currentPage, loading]);

    useEffect(() => {
        if (apiData?.payload && !loading) {
            const newReplies = apiData.payload;
            setReplies(prevReplies => {
                const ncs = [...prevReplies, ...newReplies.filter(comment => !prevReplies.some(prevComment => prevComment.id === comment.id))];
                return ncs;
            });
            setFetchingMore(false);
            if (!apiData?.metadata.totalPage || apiData?.metadata?.totalPage === currentPage) {
                setReachedEnd(true);
            }
        }
    }, [apiData, currentPage, loading]);

    const handleSeeMore = () => {
        if (!fetchingMore) {
            setCurrentPage(prevPage => prevPage + 1);
            setFetchingMore(true);
        }
    };

    return {
        fetchingMore,
        replies,
        setReplies,
        reachedEnd,
        handleSeeMore,
        loading,
        updateReply,
    };
}
