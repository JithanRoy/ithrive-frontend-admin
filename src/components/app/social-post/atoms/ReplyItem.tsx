// eslint-disable-next-line simple-import-sort/imports
import { useRequest, useSafeState } from 'ahooks';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Form, Popover, Space } from 'antd';

import dayjs from 'dayjs';

import { DeleteOutlined, EditOutlined, SendOutlined } from '@ant-design/icons';
import EducareConfirmDelete from '@components/shared/educare-confirm-delete';
import EducareInput from '@components/shared/educare-input';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import { zodResolver } from '@hookform/resolvers/zod';
import RequestApi from '@library/apis/request.api';
import { SocketEnum } from '@library/enums';
import type { TCommentSchema } from '@library/schemas/comment';
import { CommentSchema } from '@library/schemas/comment';
import { useSocket } from '@library/sockethook';
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';
import { MdOutlineStar } from '@react-icons/all-files/md/MdOutlineStar';
import { MdOutlineStarBorder } from '@react-icons/all-files/md/MdOutlineStarBorder';

import IthriveButton from '../../../shared/iThrive-button';
import EducareImage from '../../../shared/educare-image';

type Props = {
    reply: any;
    editable: boolean;
    deletable: boolean;
    // commentRefresh: () => void;
    onDelete: () => void;
    // replyFetch: () => void;
};
const ReplyItem = ({ reply, editable, deletable, onDelete }: Props) => {
    const socket = useSocket(String(process.env.NEXT_PUBLIC_SOCKET_URL), '/notification');
    const [localState, setLocalState] = useSafeState<boolean>(false);
    const [clickedEdit, setClickedEdit] = useSafeState<boolean>(false);
    const [likes, setLikes] = useSafeState(reply.reactionCount);
    const [isReacted, setIsReacted] = useSafeState<boolean>(reply.isReactedToComment || false);
    const [commentText, setCommentText] = useSafeState('');
    const [commentTextToEdit, setCommentTextToEdit] = useSafeState<string | undefined>(undefined);
    const [isPopoverOpened, setIsPopoverOpened] = useSafeState(false);
    const { run: onReactSocialComment, loading: reactSocialCommentLoading } = useRequest(RequestApi<null, { status: 'unReacted' | 'reacted' }>, {
        manual: true,
        onSuccess: res => {
            setLocalState(true);
            setIsReacted(res.payload.status === 'reacted');
        },
    });
    const hookForm = useForm<TCommentSchema>({
        mode: 'onChange',
        resolver: zodResolver(CommentSchema),
        defaultValues: {
            id: reply.id,
            parentCommentId: reply.parentCommentId || '',
            comment: reply.comment || '',
        },
    });
    const { run: onEditComment, loading: onEditCommentLoading } = useRequest(RequestApi<TCommentSchema, any>, {
        manual: true,
        onSuccess: res => {
            setLocalState(true);
            // replyFetch();
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
        payload.id = reply.id;

        setCommentTextToEdit(payload.comment);

        onEditComment({
            module: 'social-post-activity',
            method: 'PUT',
            url: `${reply.socialPostId}/comment`,
            payload: payload,
        });
    };
    const onEditCommentClick = () => {
        setClickedEdit(true);
        setIsPopoverOpened(false);
    };

    React.useEffect(() => {
        hookForm.setValue('comment', commentText);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentText]);
    React.useEffect(() => {
        setCommentText(reply.comment);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reply]);

    React.useEffect(() => {
        if (socket) {
            socket.on('connect_error', () => {});
            socket.on('connect', function () {});
            socket.on(`${SocketEnum.SOCIAL_POST_REPLY_ENGAGEMENT_COUNTER}-${reply?.id}`, function (res: Record<string, any>) {
                if (localState === false) {
                    setLikes(res?.data?.reactionCount);
                }
            });
            socket.on('disconnect', function () {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    return (
        <div className="flex flex-col gap-3 mt-3">
            <div className="ml-3 flex flex-col gap-1" id="No reply items">
                <div className="flex gap-4">
                    <EducareImage
                        className="mt-2"
                        variant="avatar"
                        preview={false}
                        image={{
                            imagePath: reply.userInfo.profilePic ? reply.userInfo.profilePic : '/public/images/logo.png',
                            blurHash: reply.userInfo.profilePicBlurHash,
                        }}
                    />
                    <div className="mb-2">
                        <div className="flex justify-between">
                            <div className="text-lg font-semibold">
                                {reply?.userInfo?.name ? (
                                    reply.userInfo.name
                                ) : (
                                    <span className="bg-gray-200 text-gray-500 p-[2px] rounded border border-gray-400">[Deleted User]</span>
                                )}
                            </div>
                            <div className="flex items-center">
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
                        <div className="text-xs font-thin">{dayjs(reply?.updatedAt).fromNow()}</div>
                    </div>
                </div>
                {!clickedEdit && <div className="text-base ms-12">{commentText}</div>}
                {clickedEdit && (
                    <Form onFinish={hookForm.handleSubmit(onEdit)} className="w-full">
                        <div className="gap-2 w-full relative">
                            <EducareInput type="text" hookForm={hookForm} name="comment" className="w-full rounded-xl" />
                            <div className="flex justify-end absolute top-[30%] right-3 ">
                                <IthriveButton
                                    className="self-end rounded-lg border-none"
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
            </div>
            <div className="text-gray-500 ml-3">
                <Space>
                    <IthriveButton
                        size="small"
                        type="text"
                        className="text-red-500"
                        icon={isReacted ? <MdOutlineStar className="text-base" /> : <MdOutlineStarBorder className="text-base" />}
                        // disabled={isUserReactedLoading}
                        loading={reactSocialCommentLoading}
                        onClick={() => {
                            onReactSocialComment({
                                method: 'PUT',
                                module: 'social-post-activity',
                                url: `comment/${reply.id}/reaction`,
                            });
                        }}>
                        <span>{likes}</span>
                    </IthriveButton>
                </Space>
            </div>
        </div>
    );
};
export default ReplyItem;
