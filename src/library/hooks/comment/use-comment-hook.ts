import { useEffect, useState } from 'react';

import { EducareDataTablePaginationProps } from '@components/shared/educare-datatable';
import type { TApiModule } from '@library/apis/request.api';
import { useRequestPagination } from '@library/apis/request-pagination.api';
import type { CommentResponse } from '@library/schemas/social-post';

export default function useCommentPaginate({ id, module }: { id: string; module: TApiModule }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [reachedEnd, setReachedEnd] = useState(false);
    const updateComment = (comment: CommentResponse, isDeleted?: boolean) => {
        setComments(oldComments => {
            return isDeleted ? oldComments.filter(o => o.id !== comment.id) : oldComments.map(o => (o.id === comment.id ? comment : o));
        });
    };

    const { data: apiData, loading } = useRequestPagination<CommentResponse>(
        {
            version: 'v1',
            method: 'GET',
            module,
            url: `${id}/comment`,
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
    //     return apiData?.metadata?.totalPage === currentPage;
    // }, [apiData, currentPage, loading]);

    useEffect(() => {
        if (apiData?.payload && !loading) {
            const newComments = apiData.payload;
            setComments(prevComments => {
                const ncs = [...prevComments, ...newComments.filter(comment => !prevComments.some(prevComment => prevComment.id === comment.id))];
                return ncs;
            });
            setFetchingMore(false);
            if (apiData?.metadata?.totalPage === currentPage) {
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
        comments,
        setComments,
        reachedEnd,
        handleSeeMore,
        loading,
        updateComment,
    };
}
