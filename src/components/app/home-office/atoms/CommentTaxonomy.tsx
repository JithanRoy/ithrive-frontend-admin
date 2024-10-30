/* eslint-disable simple-import-sort/imports */
import { useMount, useRequest, useSafeState } from 'ahooks';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Form, Popover, Skeleton, Space } from 'antd';

import dayjs from 'dayjs';

import { SendOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import RequestApi from '@library/apis/request.api';
import { SocketEnum } from '@library/enums';
import useCommentReplyPaginate from '@library/hooks/comment/use-comment-reply-hook';
import type { TCommentSchema } from '@library/schemas/comment';
import { CommentSchema } from '@library/schemas/comment';
import { useSocket } from '@library/sockethook';
import { FaRegComment } from '@react-icons/all-files/fa/FaRegComment';
import { FaComment } from '@react-icons/all-files/fa6/FaComment';
import { MdOutlineStar } from '@react-icons/all-files/md/MdOutlineStar';
import { MdOutlineStarBorder } from '@react-icons/all-files/md/MdOutlineStarBorder';

import EducareButton from '../../../shared/educare-button';
import EducareImage from '../../../shared/educare-image';
import EducareInput from '../../../shared/educare-input';

import ReplyItem from './ReplyItem';
import EducareConfirmDelete from '@components/shared/educare-confirm-delete';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';
import EducareBackdrop from '@components/shared/educare-backdrop';
import type { CommentResponse } from '@library/schemas/social-post';
import { useRecoilValue } from 'recoil';
import { UserInfoAtom } from '@store/UserInfoAtom';

type Props = {
    comment: any;
    editable: boolean;
    deletable: boolean;
    onDelete: () => void;
};
const CommentTaxonomy = ({ comment, editable, deletable, onDelete }: Props) => {
    const { userInfo } = useRecoilValue(UserInfoAtom);

    const [replyOpen, setReplyOpen] = useSafeState<boolean>(false);
    const socket = useSocket(String(process.env.NEXT_PUBLIC_SOCKET_URL), '/notification');
    const [commentText, setCommentText] = useSafeState('');

    const [likes, setLikes] = useSafeState(comment.reactionCount || 0);
    const [replys, setReplys] = useSafeState(comment.replyCount || 0);
    const [localState, setLocalState] = useSafeState<boolean>(false);
    const [isPopoverOpened, setIsPopoverOpened] = useSafeState(false);
    const [clickedEdit, setClickedEdit] = useSafeState<boolean>(false);
    const [commentTextToEdit, setCommentTextToEdit] = useSafeState<string | undefined>(undefined);

    const [replyToDelete, setReplyToDelete] = useSafeState<undefined | CommentResponse>();

    // const [commentReply, setCommentReply] = useSafeState<any[]>([]);
    const [isReacted, setIsReacted] = useSafeState<boolean>(comment.isReactedToComment || false);

    const {
        replies: commentReply,
        setReplies: setCommentReply,
        handleSeeMore,
        reachedEnd,
        loading: apiLoading,
        updateReply,
    } = useCommentReplyPaginate({
        postId: comment.homeOfficeId,
        commentId: comment.id,
        module: 'home-office-activity',
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

    const { run: onComment, loading: onCommentLoading } = useRequest(RequestApi<TCommentSchema, any>, {
        manual: true,
        onSuccess: () => {
            setLocalState(true);
            // setReplys(replys + 1);
            // replyFetch();
            hookForm.reset();
        },
    });
    const onSubmit = async (payload: TCommentSchema) => {
        payload.id = self.crypto.randomUUID();
        onComment({
            module: 'home-office-activity',
            method: 'POST',
            url: `${comment.homeOfficeId}/comment`,
            payload: payload,
        });
    };
    const { run: onReactSocialComment, loading: reactSocialCommentLoading } = useRequest(RequestApi<null, { status: 'unReacted' | 'reacted' }>, {
        manual: true,
        onSuccess: res => {
            setLocalState(true);
            setIsReacted(res.payload.status === 'reacted');
            // setLikes((l: number) => (res.payload?.status === 'unReacted' ? l - 1 : l + 1));
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
            module: 'home-office-activity',
            method: 'PUT',
            url: `${comment.homeOfficeId}/comment`,
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

    const handleOnDelete = (reply: CommentResponse) => {
        setReplyToDelete(reply);

        onDeleteReply({
            version: 'v1',
            module: 'home-office-activity',
            method: 'DELETE',
            url: `comment/${reply.id}`,
        });
    };

    React.useEffect(() => {
        hookForm2.setValue('comment', commentText);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentText]);
    React.useEffect(() => {
        setCommentText(comment.comment);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comment]);

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
    //                 module: 'home-office-activity',
    //                 url: `${comment.homeOfficeId}/comment/${comment.id}/reply`,
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
        if (socket) {
            socket.on('connect_error', () => {});
            socket.on('connect', function () {});

            socket.on(`${SocketEnum.HOME_OFFICE_NOTIFICATION_COMMENT}-${comment.homeOfficeId}-${comment.id}`, function (res: Record<string, any>) {
                if (localState === false) {
                    setCommentReply(prev => [res.data, ...prev]);
                }
            });
            socket.on(`${SocketEnum.HOME_OFFICE_REPLY_ENGAGEMENT_COUNTER}-${comment?.id}`, function (res: Record<string, any>) {
                if (localState === false) {
                    setReplys(res.data.replyCount);
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
                image={{ imagePath: comment.userInfo.profilePic, blurHash: comment.userInfo.profilePicBlurHash || '' }}
            />
            <div className="bg-gray-100 p-4 rounded-lg w-full">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <div className="text-lg font-semibold">{comment.userInfo.name || ''}</div>
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
                                                <EducareButton
                                                    type="text"
                                                    size="small"
                                                    className="!justify-start mr-5"
                                                    icon={<EditOutlined />}
                                                    loading={onEditCommentLoading}
                                                    onClick={onEditCommentClick}>
                                                    Edit
                                                </EducareButton>
                                            )}
                                            {deletable && (
                                                <EducareConfirmDelete
                                                    title="Delete Comment"
                                                    subtitle="Are you sure to delete this comment?"
                                                    onDelete={onDelete}>
                                                    <EducareButton
                                                        type="text"
                                                        size="small"
                                                        className="text-red-500 !justify-start"
                                                        icon={<DeleteOutlined />}>
                                                        Delete
                                                    </EducareButton>
                                                </EducareConfirmDelete>
                                            )}
                                        </div>
                                    }>
                                    <EducareButton type="text" icon={<BsThreeDotsVertical />} />
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
                                    <EducareButton
                                        className="self-end border-none rounded-lg"
                                        size="small"
                                        htmlType="submit"
                                        variant="bordered"
                                        loading={onEditCommentLoading}>
                                        <SendOutlined className="text-[#FF8743] text-xl" />
                                    </EducareButton>
                                </div>
                            </div>
                        </Form>
                    )}
                    <div className="flex items-center text-gray-500 text-sm gap-5">
                        <Space>
                            <EducareButton
                                size="small"
                                type="text"
                                className="text-red-500"
                                icon={isReacted ? <MdOutlineStar className="text-base" /> : <MdOutlineStarBorder className="text-base" />}
                                loading={reactSocialCommentLoading}
                                onClick={() => {
                                    onReactSocialComment({
                                        method: 'PUT',
                                        module: 'home-office-activity',
                                        url: `comment/${comment.id}/reaction`,
                                    });
                                }}>
                                <span>{likes || 0}</span>
                            </EducareButton>
                        </Space>
                        <Space>
                            <EducareButton
                                size="small"
                                type="text"
                                className="text-blue-500"
                                icon={replyOpen ? <FaComment /> : <FaRegComment />}
                                onClick={() => {
                                    setReplyOpen(!replyOpen);
                                }}>
                                <span>{replys || 0}</span>
                            </EducareButton>
                        </Space>
                    </div>
                    {replyOpen && (
                        <div className="flex gap-5 mt-5">
                            <EducareImage variant="avatar" preview={false} image={{ imagePath: '', blurHash: '' }} />
                            <Form onFinish={hookForm.handleSubmit(onSubmit)} className="w-full">
                                <div className="gap-2 w-full relative">
                                    <EducareInput
                                        type="text"
                                        hookForm={hookForm}
                                        name="comment"
                                        placeholder="Write a comment..."
                                        className="w-full rounded-xl"
                                    />
                                    <div className="flex justify-end absolute top-[30%] right-3 ">
                                        <EducareButton
                                            className="self-end rounded-lg border-none"
                                            size="small"
                                            htmlType="submit"
                                            variant="bordered"
                                            loading={onCommentLoading}>
                                            <SendOutlined className="text-[#FF8743] text-xl" />
                                        </EducareButton>
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
                                    <EducareButton variant="reset" className="text-center border-none" loading></EducareButton>
                                ) : (
                                    <EducareButton variant="reset" className="text-center border-none" onClick={handleSeeMore}>
                                        <div>load more replies</div>
                                    </EducareButton>
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
