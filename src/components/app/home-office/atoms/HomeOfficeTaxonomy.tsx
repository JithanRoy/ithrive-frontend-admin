import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { useDebounceEffect, useRequest, useSafeState } from 'ahooks';

import { Card, Form, Popover, Skeleton, Space } from 'antd';

import { useRecoilValue } from 'recoil';
import { UserInfoAtom } from '@store/UserInfoAtom';

import dayjs from 'dayjs';

import { DeleteOutlined, EditOutlined, SendOutlined } from '@ant-design/icons';
import SizedBox from '@components/app/social-post/atoms/SizedBox';
import EducareButton from '@components/shared/educare-button';
import EducareConfirmDelete from '@components/shared/educare-confirm-delete';
import EducareImage from '@components/shared/educare-image';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import type { TEducareShareDetail } from '@components/shared/educare-share';
import EducareShareModal, { DeepLinkToken } from '@components/shared/educare-share';
import { zodResolver } from '@hookform/resolvers/zod';
import RequestApi from '@library/apis/request.api';
import { PermissionActionsEnum, PermissionModulesEnum, SocketEnum } from '@library/enums';
import useCommentPaginate from '@library/hooks/comment/use-comment-hook';
import type { TCommentSchema } from '@library/schemas/comment';
import { CommentSchema } from '@library/schemas/comment';
import type { TBasicUserInfo } from '@library/schemas/login';
import type { CommentResponse } from '@library/schemas/social-post';
import { useSocket } from '@library/sockethook';
import { useHasPermission } from '@library/utils/permissionUtils';
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';
import { FaRegComment } from '@react-icons/all-files/fa/FaRegComment';
import { MdOutlineStar } from '@react-icons/all-files/md/MdOutlineStar';
import { MdOutlineStarBorder } from '@react-icons/all-files/md/MdOutlineStarBorder';
import { TbShare3 } from '@react-icons/all-files/tb/TbShare3';

import EducareInput from '../../../shared/educare-input';
import EduCarePermissionWrapper from '../../../shared/educare-permission-wrapper';

import CommentTaxonomy from './CommentTaxonomy';

type HomeOfficeTaxonomyEditableProps =
    | {
          editable: true;
          onEdit: () => void;
      }
    | {
          editable: false;
      };
type HomeOfficeTaxonomyDeletableProps =
    | {
          deletable: true;
          onDelete: () => void;
      }
    | {
          deletable: false;
      };
type HomeOfficeTaxonomyActionableProps =
    | {
          noAction: false;
          likes: number;
          comments: number;
          shares: number;
      }
    | {
          noAction: true;
      };

type HomeOfficeTaxonomyProps = {
    id: string;
    user: TBasicUserInfo;
    updatedAt: string | Date;
    image: string;
    imageBlurHash: string;
    title: string;
    comments?: number;
    description: string;
} & HomeOfficeTaxonomyEditableProps &
    HomeOfficeTaxonomyDeletableProps &
    HomeOfficeTaxonomyActionableProps;
const HomeOfficeTaxonomy = (props: HomeOfficeTaxonomyProps) => {
    const { userInfo } = useRecoilValue(UserInfoAtom);

    const { id, title, updatedAt, user, image, imageBlurHash, noAction, description, deletable } = props;
    const socket = useSocket(String(process.env.NEXT_PUBLIC_SOCKET_URL), '/notification');
    const [shareState, setShareState] = useSafeState<TEducareShareDetail | null>(null);
    const [commentOpen, setCommentOpen] = useSafeState<boolean>(false);
    // const [comments, setComments] = useSafeState<any[]>([]);
    const [localState, setLocalState] = useSafeState<boolean>(false);
    const [commentCount, setCommentCount] = useSafeState(props.comments || 0);
    const [likes, setLikes] = useSafeState(noAction ? 0 : props.likes);
    const [commentToDelete, setCommentToDelete] = useSafeState<undefined | CommentResponse>();

    const {
        comments,
        setComments,
        fetchingMore,
        handleSeeMore,
        reachedEnd,
        updateComment,
        loading: apiLoading,
    } = useCommentPaginate({ id, module: 'home-office-activity' });

    const hookForm = useForm<TCommentSchema>({
        mode: 'onChange',
        resolver: zodResolver(CommentSchema),
        defaultValues: {
            id: self.crypto.randomUUID(),
            parentCommentId: '',
            comment: '',
        },
    });

    const [ref, inView] = useInView({
        threshold: 0.1,
        rootMargin: '50px 0px',
    });

    useEffect(() => {
        if (inView && !reachedEnd) {
            handleSeeMore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView, reachedEnd]);

    const canEdit = useHasPermission(PermissionModulesEnum.HOME_OFFICE_UPDATES, PermissionActionsEnum.UPDATE);
    const canDelete = useHasPermission(PermissionModulesEnum.HOME_OFFICE_UPDATES, PermissionActionsEnum.DELETE);

    const { run: onComment, loading: onCommentLoading } = useRequest(RequestApi<TCommentSchema, any>, {
        manual: true,
        onSuccess: () => {
            setLocalState(true);
            // commentRefresh();
            hookForm.reset();
            // setCommentCount(commentCount + 1);
        },
    });
    const onSubmit = async (payload: TCommentSchema) => {
        payload.id = self.crypto.randomUUID();
        onComment({
            module: 'home-office-activity',
            method: 'POST',
            url: `${id}/comment`,
            payload: payload,
        });
    };
    const {
        run: onIsUserReacted,
        loading: isUserReactedLoading,
        data: isUserReactedBefore,
    } = useRequest(RequestApi<null, { isUserReactedToPost: boolean }>, {
        manual: true,
    });
    useDebounceEffect(
        () => {
            if (id) {
                onIsUserReacted({
                    method: 'GET',
                    module: 'home-office-activity',
                    url: `${id}/is-user-reacted-to-post`,
                });
            }
        },
        [id],
        {
            wait: 5,
        },
    );
    const {
        run: onReactSocialPost,
        loading: reactSocialPostLoading,
        data: isUserReacted,
    } = useRequest(RequestApi<null, { status: 'unReacted' | 'reacted' }>, {
        manual: true,
        onSuccess: res => {
            if (!noAction) {
                setLocalState(true);
                // setLikes(l => (res.payload?.status === 'unReacted' ? l - 1 : l + 1));
            }
        },
    });
    const { run: onShareSocialPost, loading: shareSocialPostLoading } = useRequest(RequestApi<null, { status: boolean }>, {
        manual: true,
    });
    // const {
    //     run: onCommentSocialPost,
    //     loading: commentSocialPostLoading,
    //     data: commentData,
    //     refresh: commentRefresh,
    // } = useRequest(RequestApi<null, any>, {
    //     manual: true,
    // });
    // React.useEffect(() => {
    //     if (commentData?.payload) {
    //         setComments(commentData?.payload);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [commentData]);
    // React.useEffect(() => {
    //     if (commentOpen) {
    //         onCommentSocialPost({
    //             method: 'GET',
    //             module: 'home-office-activity',
    //             url: `${id}/comment`,
    //         });
    //     }
    // }, [commentOpen, onCommentSocialPost, id]);

    const { run: onDeleteComment, loading: deleteCommentLoading } = useRequest(RequestApi<null, string>, {
        manual: true,
        onSuccess: (res, params) => {
            // commentRefresh();
            // console.log(res, 'params:', params);
            EducareMessageAlert(res?.message || 'Successfully deleted');

            // console.log('on delete comment success: ', commentToDelete);

            if (!commentToDelete) return;
            updateComment(commentToDelete, true);
            setCommentToDelete(undefined);
        },
        onError: (err: any) => {
            setCommentToDelete(undefined);
            EducareMessageAlert(err?.error?.systems || 'Failed to delete', 'error');
        },
    });

    const handleOnDelete = (comment: CommentResponse) => {
        // console.log('on delete comment: ', comment);

        setCommentToDelete(comment);
        setCommentCount(commentCount - 1);

        onDeleteComment({
            version: 'v1',
            module: 'home-office-activity',
            method: 'DELETE',
            url: `comment/${comment.id}`,
        });
    };
    React.useEffect(() => {
        if (socket) {
            socket.on('connect_error', (err: any) => {});
            socket.on('connect', function () {});

            socket.on(`${SocketEnum.HOME_OFFICE_NOTIFICATION_COMMENT}-${id}`, function (res: Record<string, any>) {
                if (localState === false) {
                    setComments(prev => [res.data, ...prev]);
                }
            });
            socket.on(`${SocketEnum.HOME_OFFICE_ENGAGEMENT_COUNTER}-${id}`, function (res: Record<string, any>) {
                if (localState === false) {
                    setLikes(res.data.reactionCount);
                    setCommentCount(res.data.commentCount);
                }
            });
            socket.on('disconnect', function () {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);
    return (
        <Card
            data-social-post-id={id}
            className="border border-gray-200"
            classNames={{
                body: '!py-0 !px-4 grid gap-y-4',
            }}>
            <div className="flex justify-between">
                <Space>
                    <EducareImage
                        variant="social-avatar"
                        alt={user?.name}
                        image={{ imagePath: user?.profilePic || '', blurHash: user?.profilePicBlurHash || '' }}
                    />
                    <div>
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">{dayjs(updatedAt).fromNow() || ''}</div>
                    </div>
                </Space>

                {!!(props?.editable || props?.deletable) && (
                    <Popover
                        destroyTooltipOnHide
                        forceRender
                        trigger={['click']}
                        placement="leftTop"
                        zIndex={2}
                        content={
                            <div className="flex flex-col gap-2">
                                {props?.editable && (
                                    <EduCarePermissionWrapper
                                        module={PermissionModulesEnum.HOME_OFFICE_UPDATES}
                                        permissions={PermissionActionsEnum.UPDATE}>
                                        <EducareButton
                                            type="text"
                                            size="small"
                                            className="!justify-start mr-5"
                                            icon={<EditOutlined />}
                                            onClick={props?.onEdit}>
                                            Edit
                                        </EducareButton>
                                    </EduCarePermissionWrapper>
                                )}
                                {props?.deletable && (
                                    <EduCarePermissionWrapper
                                        module={PermissionModulesEnum.HOME_OFFICE_UPDATES}
                                        permissions={PermissionActionsEnum.DELETE}>
                                        <EducareConfirmDelete
                                            title="Delete post"
                                            subtitle="Are you sure you want to delete this post?"
                                            onDelete={props?.onDelete}>
                                            <EducareButton type="text" size="small" className="text-red-500 !justify-start" icon={<DeleteOutlined />}>
                                                Delete
                                            </EducareButton>
                                        </EducareConfirmDelete>
                                    </EduCarePermissionWrapper>
                                )}
                            </div>
                        }>
                        {!canDelete && !canEdit ? <div></div> : <EducareButton type="text" icon={<BsThreeDotsVertical />} />}
                    </Popover>
                )}
            </div>

            <div className="grid justify-center gap-2 w-full">
                <EducareImage
                    preview={false}
                    className="!rounded-md w-full object-fit"
                    image={{ imagePath: image, blurHash: imageBlurHash }}
                    width="100%"
                    height={500}
                />
            </div>
            <div className="font-bold my-2 text-xl">{title}</div>
            <div className="text-base">{description}</div>
            <EducareShareModal
                state={[shareState, setShareState]}
                onShare={() => {
                    onShareSocialPost({
                        method: 'PUT',
                        module: 'home-office-activity',
                        url: `${id}/share`,
                    });
                }}
            />
            {!noAction && (
                <>
                    <div className="flex items-center text-gray-500 text-sm gap-5">
                        <Space>
                            <EducareButton
                                size="small"
                                type="text"
                                className="text-red-500"
                                icon={
                                    (!isUserReacted?.payload?.status && isUserReactedBefore?.payload?.isUserReactedToPost) ||
                                    isUserReacted?.payload?.status === 'reacted' ? (
                                        <MdOutlineStar className="text-base" />
                                    ) : (
                                        <MdOutlineStarBorder className="text-base" />
                                    )
                                }
                                disabled={isUserReactedLoading}
                                loading={reactSocialPostLoading}
                                onClick={() => {
                                    onReactSocialPost({
                                        method: 'PUT',
                                        module: 'home-office-activity',
                                        url: `${id}/reaction`,
                                    });
                                }}>
                                <span>{likes}</span>
                            </EducareButton>
                        </Space>
                        <Space>
                            <EducareButton
                                size="small"
                                type="text"
                                className="text-blue-500"
                                icon={<FaRegComment />}
                                loading={apiLoading}
                                onClick={() => {
                                    setCommentOpen(!commentOpen);
                                }}>
                                <span>{commentCount}</span>
                            </EducareButton>
                        </Space>
                        <Space>
                            <EducareButton
                                size="small"
                                type="text"
                                className="text-violet-500"
                                icon={<TbShare3 />}
                                loading={shareSocialPostLoading}
                                onClick={() => {
                                    setShareState({
                                        title: props.user?.name as string,
                                        // description: props.title as string,
                                        // shareUrl: `${window.location.href}/home-office/${id}`,
                                        encryptedRoute: DeepLinkToken.EncryptedRoutes.home_office_details,
                                        id: id,
                                    });
                                }}>
                                <span>{props?.shares}</span>
                            </EducareButton>
                        </Space>
                    </div>
                    {commentOpen && (
                        <>
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
                            <Skeleton avatar paragraph={{ rows: 3 }} loading={apiLoading && !comments}>
                                {comments && Array.isArray(comments) && (
                                    <SizedBox
                                        maxHeight={500}
                                        scrollableOverflowOnMaxHeight
                                        // onHeight={height => {
                                        //     // console.log('height change: ', height);
                                        // }}
                                    >
                                        {comments.map((comment, index) => (
                                            <div key={comment.id}>
                                                <CommentTaxonomy
                                                    comment={comment}
                                                    editable={userInfo.id === comment?.userId}
                                                    deletable={userInfo.id === comment?.userId}
                                                    onDelete={() => handleOnDelete(comment)}
                                                />
                                            </div>
                                        ))}
                                        <div ref={ref} className="flex justify-center items-center">
                                            {!reachedEnd && (
                                                <EducareButton variant="reset" className="border-none text-center" loading></EducareButton>
                                            )}
                                        </div>
                                    </SizedBox>
                                )}
                            </Skeleton>
                        </>
                    )}
                </>
            )}
        </Card>
    );
};

export default HomeOfficeTaxonomy;
