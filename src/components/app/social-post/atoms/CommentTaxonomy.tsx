// eslint-disable-next-line simple-import-sort/imports
import { useMount, useRequest, useSafeState } from 'ahooks';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Form, Popover, Skeleton, Space } from 'antd';

import { UserInfoAtom } from '@store/UserInfoAtom';
import { useRecoilValue } from 'recoil';

import dayjs from 'dayjs';

import { DeleteOutlined, EditOutlined, SendOutlined } from '@ant-design/icons';
import EducareBackdrop from '@components/shared/educare-backdrop';
import EducareConfirmDelete from '@components/shared/educare-confirm-delete';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import { zodResolver } from '@hookform/resolvers/zod';
import RequestApi from '@library/apis/request.api';
import { SocketEnum } from '@library/enums';
import useCommentReplyPaginate from '@library/hooks/comment/use-comment-reply-hook';
import type { TCommentSchema } from '@library/schemas/comment';
import { CommentSchema } from '@library/schemas/comment';
import type { CommentResponse } from '@library/schemas/social-post';
import { useSocket } from '@library/sockethook';
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';
import { FaRegComment } from '@react-icons/all-files/fa/FaRegComment';
import { FaComment } from '@react-icons/all-files/fa6/FaComment';
import { MdOutlineStar } from '@react-icons/all-files/md/MdOutlineStar';
import { MdOutlineStarBorder } from '@react-icons/all-files/md/MdOutlineStarBorder';

import IthriveButton from '../../../shared/iThrive-button';
import EducareImage from '../../../shared/educare-image';
import EducareInput from '../../../shared/educare-input';

import ReplyItem from './ReplyItem';

type CommentProps = {
    commentCount: number;
    setComments: (value: any) => void;
    setCommentCount: (count: any) => void;
    comment: CommentResponse;
    editable: boolean;
    deletable: boolean;
    onDelete: () => void;
    // commentRefresh: () => void;
    // onEdited: (updatedComment: CommentResponse) => void;
};

const CommentTaxonomy = ({ comment, editable, deletable, onDelete }: CommentProps) => {
    const { userInfo } = useRecoilValue(UserInfoAtom);

    const [commentText, setCommentText] = useSafeState('');

    const [replyOpen, setReplyOpen] = useSafeState<boolean>(false);
    const [likes, setLikes] = useSafeState(comment.reactionCount || 0);

    const [clickedEdit, setClickedEdit] = useSafeState<boolean>(false);
    const [localState, setLocalState] = useSafeState<boolean>(false);
    const [replys, setReplys] = useSafeState(comment.replyCount || 0);
    const [isReacted, setIsReacted] = useSafeState<boolean>(comment.isReactedToComment || false);
    const [commentTextToEdit, setCommentTextToEdit] = useSafeState<string | undefined>(undefined);
    const [isPopoverOpened, setIsPopoverOpened] = useState(false);

    const socket = useSocket(String(process.env.NEXT_PUBLIC_SOCKET_URL), '/notification');

    const [replyToDelete, setReplyToDelete] = useSafeState<undefined | CommentResponse>();

    const {
        replies: commentReply,
        setReplies: setCommentReply,
        handleSeeMore,
        reachedEnd,
        loading: apiLoading,
        updateReply,
    } = useCommentReplyPaginate({
        postId: comment.socialPostId,
        commentId: comment.id,
        module: 'social-post-activity',
    });

    const hookForm = useForm<TCommentSchema>({
        mode: 'onChange',
        resolver: zodResolver(CommentSchema),
        defaultValues: {
            id: self.crypto.randomUUID(),
            parentCommentId: comment.id,
            comment: '',
        },
    });
    const hookForm2 = useForm<TCommentSchema>({
        mode: 'onChange',
        resolver: zodResolver(CommentSchema),
        defaultValues: {
            id: self.crypto.randomUUID(),
            parentCommentId: '',
            comment: commentText || '',
        },
    });

    const onEditCommentClick = () => {
        setClickedEdit(true);
        setIsPopoverOpened(false);
    };
    const { run: onEditComment, loading: onEditCommentLoading } = useRequest(RequestApi<TCommentSchema, any>, {
        manual: true,
        onSuccess: res => {
            setLocalState(true);
            EducareMessageAlert(res?.message || 'Comment updated successfully');
            setClickedEdit(false);
            hookForm.reset();
            if (!commentTextToEdit) return;
            setCommentText(commentTextToEdit);
            setCommentTextToEdit(undefined);
        },
        onError: (err: any) => {
            setCommentTextToEdit(undefined);
            EducareMessageAlert(err?.error?.systems || 'Failed to update', 'error');
        },
    });
    const onEdit = async (payload: TCommentSchema) => {
        payload.id = comment.id;
        payload.parentCommentId = '';

        setCommentTextToEdit(payload.comment);

        onEditComment({
            module: 'social-post-activity',
            method: 'PUT',
            url: `${comment.socialPostId}/comment`,
            payload: payload,
        });
    };

    const { run: onDeleteReply, loading: deleteReplyLoading } = useRequest(RequestApi<null, string>, {
        manual: true,
        onSuccess: res => {
            EducareMessageAlert(res?.message || 'Successfully deleted');
            setReplys(replys - 1);

            if (!replyToDelete) return;
            updateReply(replyToDelete, true);
            setReplyToDelete(undefined);
        },
        onError: (err: any) => {
            setReplyToDelete(undefined);
            EducareMessageAlert(err?.error?.systems || 'Failed to delete', 'error');
        },
    });
    const { run: onComment, loading: onCommentLoading } = useRequest(RequestApi<TCommentSchema, any>, {
        manual: true,
        onSuccess: () => {
            setLocalState(true);
            hookForm.reset();
        },
    });
    const onSubmit = async (payload: TCommentSchema) => {
        payload.id = self.crypto.randomUUID();
        onComment({
            module: 'social-post-activity',
            method: 'POST',
            url: `${comment.socialPostId}/comment`,
            payload: payload,
        });
    };
    const { run: onReactSocialComment, loading: reactSocialCommentLoading } = useRequest(RequestApi<null, { status: 'unReacted' | 'reacted' }>, {
        manual: true,
        onSuccess: res => {
            setLocalState(true);
            setIsReacted(res.payload.status === 'reacted');
        },
    });

    const handleOnDelete = (reply: CommentResponse) => {
        setReplyToDelete(reply);

        onDeleteReply({
            version: 'v1',
            module: 'social-post-activity',
            method: 'DELETE',
            url: `comment/${reply.id}`,
        });
    };

    // const {
    //     run: onReplySocialPost,
    //     loading: replySocialPostLoading,
    //     data: replyData,
    //     refresh: replyFetch,
    // } = useRequest(RequestApi<null, any>, {
    //     manual: true,
    // });

    // useDebounceEffect(
    //     () => {
    //         if (replyOpen) {
    //             onReplySocialPost({
    //                 method: 'GET',
    //                 module: 'social-post-activity',
    //                 url: `${comment.socialPostId}/comment/${comment.id}/reply`,
    //             });
    //         }
    //     },
    //     [replyOpen, onReplySocialPost, comment.id],
    //     { wait: 10 },
    // );
    // React.useEffect(() => {
    //     if (replyData?.payload) {
    //         setCommentReply(replyData?.payload);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [replyData]);

    React.useEffect(() => {
        hookForm2.setValue('comment', commentText);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentText]);
    React.useEffect(() => {
        setCommentText(comment.comment);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comment]);

    React.useEffect(() => {
        if (socket) {
            socket.on('connect_error', () => {});
            socket.on('connect', function () {});

            socket.on(`${SocketEnum.SOCIAL_POST_NOTIFICATION_COMMENT}-${comment.socialPostId}-${comment.id}`, function (res: Record<string, any>) {
                if (localState === false) {
                    setCommentReply(prev => [res.data, ...prev]);
                }
            });
            socket.on(`${SocketEnum.SOCIAL_POST_REPLY_ENGAGEMENT_COUNTER}-${comment?.id}`, function (res: Record<string, any>) {
                if (localState === false) {
                    setReplys(res?.data?.replyCount);
                    setLikes(res?.data?.reactionCount);
                }
            });
            socket.on('disconnect', function () {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    useMount(() => handleSeeMore());

    return (
        <div className="flex gap-5 mt-3">
            <EducareImage
                variant="avatar"
                preview={false}
                image={{
                    imagePath: comment?.userInfo?.profilePic ? comment.userInfo.profilePic : '/public/images/logo.png',
                    blurHash: comment.userInfo.profilePicBlurHash ? comment.userInfo.profilePicBlurHash : '/public/images/logo.png',
                }}
            />
            <div className="w-full p-4 bg-gray-100 rounded-lg">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <div className="text-lg font-semibold">
                            {comment?.userInfo?.name ? (
                                comment.userInfo.name
                            ) : (
                                <span className="bg-gray-200 text-gray-500 p-[2px] rounded border border-gray-400">[Deleted User]</span>
                            )}
                        </div>
                        <div>
                            {!!(editable || deletable) && (
                                <Popover
                                    open={isPopoverOpened}
                                    onOpenChange={setIsPopoverOpened}
                                    destroyTooltipOnHide
                                    forceRender
                                    trigger={['click']}
                                    placement="leftTop"
                                    zIndex={2}
                                    content={
                                        <div className="flex flex-col gap-2">
                                            {editable && (
                                                <IthriveButton
                                                    type="text"
                                                    size="small"
                                                    className="!justify-start mr-5"
                                                    icon={<EditOutlined />}
                                                    loading={onEditCommentLoading}
                                                    onClick={onEditCommentClick}>
                                                    Edit
                                                </IthriveButton>
                                            )}
                                            {deletable && (
                                                <EducareConfirmDelete
                                                    title="Delete Comment"
                                                    subtitle="Are you sure to delete this comment?"
                                                    onDelete={onDelete}>
                                                    <IthriveButton
                                                        type="text"
                                                        size="small"
                                                        className="text-red-500 !justify-start"
                                                        icon={<DeleteOutlined />}>
                                                        Delete
                                                    </IthriveButton>
                                                </EducareConfirmDelete>
                                            )}
                                        </div>
                                    }>
                                    <IthriveButton type="text" icon={<BsThreeDotsVertical />} />
                                </Popover>
                            )}
                        </div>
                    </div>
                    <div className="text-sm font-thin">{dayjs(comment?.updatedAt).fromNow()}</div>
                    {!clickedEdit && <div className="text-base">{commentText}</div>}
                    {clickedEdit && (
                        <Form onFinish={hookForm2.handleSubmit(onEdit)} className="w-full">
                            <div className="relative w-full gap-2">
                                <EducareInput type="text" hookForm={hookForm2} name="comment" className="w-full rounded-xl" />
                                <div className="flex justify-end absolute top-[30%] right-3 ">
                                    <IthriveButton
                                        className="self-end border-none rounded-lg"
                                        size="small"
                                        htmlType="submit"
                                        variant="bordered"
                                        loading={onEditCommentLoading}>
                                        <SendOutlined className="text-[#FF8743] text-xl" />
                                    </IthriveButton>
                                </div>
                            </div>
                        </Form>
                    )}
                    <div className="flex items-center gap-5 text-sm text-gray-500">
                        <Space>
                            <IthriveButton
                                size="small"
                                type="text"
                                className="text-red-500"
                                icon={isReacted ? <MdOutlineStar className="text-base" /> : <MdOutlineStarBorder className="text-base" />}
                                loading={reactSocialCommentLoading}
                                onClick={() => {
                                    onReactSocialComment({
                                        method: 'PUT',
                                        module: 'social-post-activity',
                                        url: `comment/${comment.id}/reaction`,
                                    });
                                }}>
                                <span>{likes || 0}</span>
                            </IthriveButton>
                        </Space>
                        <Space>
                            <IthriveButton
                                size="small"
                                type="text"
                                className="text-blue-500"
                                icon={replyOpen ? <FaComment /> : <FaRegComment />}
                                onClick={() => {
                                    setReplyOpen(!replyOpen);
                                }}>
                                <span>{replys || 0}</span>
                            </IthriveButton>
                        </Space>
                    </div>
                    {replyOpen && (
                        <div className="flex gap-5 mt-5">
                            <EducareImage variant="avatar" preview={false} image={{ imagePath: '', blurHash: '' }} />
                            <Form onFinish={hookForm.handleSubmit(onSubmit)} className="w-full">
                                <div className="relative w-full gap-2">
                                    <EducareInput
                                        type="text"
                                        hookForm={hookForm}
                                        name="comment"
                                        placeholder="Write a comment..."
                                        className="w-full rounded-xl"
                                    />
                                    <div className="flex justify-end absolute top-[30%] right-3 ">
                                        <IthriveButton
                                            className="self-end border-none rounded-lg"
                                            size="small"
                                            htmlType="submit"
                                            variant="bordered"
                                            loading={onCommentLoading}>
                                            <SendOutlined className="text-[#FF8743] text-xl" />
                                        </IthriveButton>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    )}
                </div>
                {replyOpen && (
                    <Skeleton avatar paragraph={{ rows: 3 }} loading={apiLoading && !commentReply}>
                        {Array.isArray(commentReply) &&
                            commentReply.map((reply, index) => (
                                <div key={index}>
                                    <EducareBackdrop status={deleteReplyLoading} />
                                    <ReplyItem
                                        reply={reply}
                                        editable={reply?.userId === userInfo.id}
                                        deletable={reply?.userId === userInfo.id}
                                        onDelete={() => handleOnDelete(reply)}
                                    />
                                </div>
                            ))}

                        {!reachedEnd && Array.isArray(commentReply) && (
                            <div>
                                {apiLoading ? (
                                    <IthriveButton variant="reset" className="text-center border-none" loading></IthriveButton>
                                ) : (
                                    <IthriveButton variant="reset" className="text-center border-none" onClick={handleSeeMore}>
                                        <div>load more replies</div>
                                    </IthriveButton>
                                )}
                            </div>
                        )}
                    </Skeleton>
                )}
            </div>
        </div>
    );
};

export default CommentTaxonomy;
