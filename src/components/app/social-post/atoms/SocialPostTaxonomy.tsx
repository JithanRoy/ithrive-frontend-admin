// eslint-disable-next-line simple-import-sort/imports
import { useDebounceEffect, useRequest, useSafeState } from 'ahooks';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';

import { Card, Divider, Form, Modal, Popover, Skeleton, Space } from 'antd';

import { UserInfoAtom } from '@store/UserInfoAtom';
import { useRecoilValue } from 'recoil';

import { DeleteOutlined, EditOutlined, SendOutlined } from '@ant-design/icons';
import CommentTaxonomy from '@components/app/social-post/atoms/CommentTaxonomy';
import EducareBackdrop from '@components/shared/educare-backdrop';
import IthriveButton from '@components/shared/iThrive-button';
import EducareConfirmDelete from '@components/shared/educare-confirm-delete';
import EducareImage from '@components/shared/educare-image';
import EducareInput from '@components/shared/educare-input';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import type { TEducareShareDetail } from '@components/shared/educare-share';
import EducareShareModal, { DeepLinkToken } from '@components/shared/educare-share';
import { zodResolver } from '@hookform/resolvers/zod';
import RequestApi from '@library/apis/request.api';
import { gradients } from '@library/const';
import { PermissionActionsEnum, PermissionModulesEnum, SocketEnum, UserTypeEnum } from '@library/enums';
import { funcFormatDateAgo, getImagePathToLink } from '@library/functions';
import useCommentPaginate from '@library/hooks/comment/use-comment-hook';
import type { TCommentSchema } from '@library/schemas/comment';
import { CommentSchema } from '@library/schemas/comment';
import type { TBasicUserInfo } from '@library/schemas/login';
import type { CommentResponse } from '@library/schemas/social-post';
import { useSocket } from '@library/sockethook';
import type { TImageEntity } from '@library/types';
import type { Gradient } from '@library/types/shared';
import { useHasPermission } from '@library/utils/permissionUtils';
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';
import { FaRegComment } from '@react-icons/all-files/fa/FaRegComment';
import { FaComment } from '@react-icons/all-files/fa6/FaComment';
import { MdOutlineStar } from '@react-icons/all-files/md/MdOutlineStar';
import { MdOutlineStarBorder } from '@react-icons/all-files/md/MdOutlineStarBorder';
import { TbShare3 } from '@react-icons/all-files/tb/TbShare3';

import SizedBox from './SizedBox';
import Styles from '../SocialPost.module.scss';
import SocialPostDetailsComponent from '../SocialPostDetails';
import ReactImageGallery from 'react-image-gallery';
import classNames from 'classnames';

type SocialPostTaxonomyEditableProps =
    | {
          editable: true;
          onEdit: () => void;
      }
    | {
          editable: false;
      };
type SocialPostTaxonomyDeletableProps =
    | {
          deletable: true;
          onDelete: () => void;
      }
    | {
          deletable: false;
      };
type SocialPostTaxonomyActionableProps =
    | {
          noAction: false;
          likes: number;
          comments: number;
          shares: number;
      }
    | {
          noAction: true;
      };

type SocialPostTaxonomyProps = {
    id: string;
    user: TBasicUserInfo;
    updatedAt: string | Date;
    text: string;
    gradient?: Gradient;
    comments?: number;
    useRichEditor?: boolean;
    setGradient?: (gradient: Gradient) => void;
    images: TImageEntity[];
    inReportPage?: boolean;
} & SocialPostTaxonomyEditableProps &
    SocialPostTaxonomyDeletableProps &
    SocialPostTaxonomyActionableProps;

const OneImage = ({ image }: { image: TImageEntity }) => {
    return (
        <div className="grid justify-center gap-2">
            {/*<EducareImage className="!rounded-md !mix-blend-difference" image={image} width="100%" height={400} />*/}
            <EducareImage className="!rounded-md" image={image} width="100%" height={500} />
        </div>
    );
};
const TwoImages = ({ images }: { images: TImageEntity[] }) => {
    return (
        <div className="grid sm:grid-cols-2 justify-center gap-2">
            {images.map((image, index) => (
                <EducareImage key={index} className="!rounded-md" image={image} width="100%" height={450} />
            ))}
        </div>
    );
};
const ThreeImages = ({ images }: { images: TImageEntity[] }) => {
    return (
        <div className="grid sm:grid-cols-3 justify-center gap-2">
            {images.map((image, index) => (
                <EducareImage key={index} className="!rounded-md" image={image} width="100%" height={400} />
            ))}
        </div>
    );
};
const FourImages = ({ images }: { images: TImageEntity[] }) => {
    return (
        <div className="grid sm:grid-cols-2 justify-center gap-2">
            {images.map((image, index) => (
                <EducareImage key={index} className="!rounded-md" image={image} width="100%" height={400} />
            ))}
        </div>
    );
};
const FiveImages = ({ images }: { images: TImageEntity[] }) => {
    const [popOpen, setPopOpen] = useSafeState<boolean>(false);
    const fifth = images.slice(4, 5);
    const handlePopOpen = () => {
        setPopOpen(!popOpen);
    };

    return (
        <>
            {fifth?.map((image, index) => (
                <div key={index} className="relative cursor-pointer" onClick={handlePopOpen}>
                    <EducareImage key={index} className="!rounded-md blur-sm" preview={false} image={image} width="100%" height={450} />
                    <div
                        style={{
                            top: '40%',
                            left: '40%',
                            fontSize: '40px',
                        }}
                        className="absolute">
                        + {images.length - 4}
                    </div>
                </div>
            ))}
            <Modal centered open={popOpen} onCancel={handlePopOpen} width={860} footer={null}>
                <div className="pt-4 pb-2 px-2">
                    <ReactImageGallery
                        items={images.map(image => ({
                            original: getImagePathToLink(image.imagePath),
                            thumbnail: getImagePathToLink(image.imagePath),
                        }))}
                        autoPlay={false}
                        showFullscreenButton={false}
                        showPlayButton={false}
                        showBullets={false}
                        showNav={true}
                    />
                </div>
            </Modal>
        </>
    );
};

const SocialPostTaxonomy = (props: SocialPostTaxonomyProps) => {
    /* static variables */
    // const maxCommentToShowByDefault = 1;

    /* /static variables end*/

    const { id, text, updatedAt, user, images, noAction, setGradient, useRichEditor, gradient, editable, deletable, inReportPage = false } = props;
    const socket = useSocket(String(process.env.NEXT_PUBLIC_SOCKET_URL), '/notification');

    const { userInfo } = useRecoilValue(UserInfoAtom);

    const [shareState, setShareState] = useSafeState<TEducareShareDetail | null>(null);
    const [commentOpen, setCommentOpen] = useSafeState<boolean>(false);
    // const [comments, setComments] = useSafeState<any[]>([]);
    const [localState, setLocalState] = useSafeState<boolean>(false);
    const [commentCount, setCommentCount] = useSafeState(props.comments || 0);
    const [likes, setLikes] = useSafeState(noAction ? 0 : props.likes || 0);
    const [commentToDelete, setCommentToDelete] = useSafeState<undefined | CommentResponse>();

    const {
        comments,
        setComments,
        fetchingMore,
        handleSeeMore,
        reachedEnd,
        loading: apiLoading,
        updateComment,
    } = useCommentPaginate({ id, module: 'social-post-activity' });

    // const [isLoadMoreCommentActive, setIsLoadMoreCommentActive] = useSafeState<boolean>(false);
    // const [isCommentScrollable, setIsCommentScrollable] = useSafeState<boolean>(false);

    // const commentsWrapperRef = useRef<HTMLDivElement>(null);

    // const setCommentWrapperHeight = (height: number) => {};

    // const isCommentScrollable = () => {
    //     const newValue = (commentsWrapperRef?.current?.clientHeight || 0) > 500;
    //     // if (isCommentScrollable === newValue) return;
    //     // setIsCommentScrollable(newValue);
    //     // console.log('is commentScrollable: ', newValue, commentsWrapperRef, commentsWrapperRef.current?.clientHeight);
    //     return newValue;
    // };

    const [ref, inView] = useInView({
        threshold: 0.1,
        rootMargin: '50px 0px',
    });

    useEffect(() => {
        if (inView && !reachedEnd) {
            // console.log('handling see more...');
            handleSeeMore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView, reachedEnd]);

    const hookForm = useForm<TCommentSchema>({
        mode: 'onChange',
        resolver: zodResolver(CommentSchema),
        defaultValues: {
            id: self.crypto.randomUUID(),
            parentCommentId: '',
            comment: '',
        },
    });

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
    const {
        run: onIsUserReacted,
        loading: isUserReactedLoading,
        data: isUserReactedBefore,
    } = useRequest(RequestApi<null, { isUserReactedToPost: boolean }>, {
        manual: true,
    });
    const canEdit = useHasPermission(PermissionModulesEnum.SOCIAL_POST, PermissionActionsEnum.UPDATE);
    const canDelete = useHasPermission(PermissionModulesEnum.SOCIAL_POST, PermissionActionsEnum.DELETE);

    // const showLodeMoreButton = useMemo(
    //     () => comments.length > maxCommentToShowByDefault && !isLoadMoreCommentActive,
    //     [comments, isLoadMoreCommentActive],
    // );

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
            module: 'social-post-activity',
            method: 'POST',
            url: `${id}/comment`,
            payload: payload,
        });
    };
    const handleButtonClick = (newGradient: Gradient) => {
        if (setGradient) {
            setLocalState(true);
            setGradient(newGradient);
        }
    };
    const handleOnDelete = (comment: CommentResponse) => {
        // console.log('on delete comment: ', comment);

        setCommentToDelete(comment);
        setCommentCount(commentCount - 1);

        onDeleteComment({
            version: 'v1',
            module: 'social-post-activity',
            method: 'DELETE',
            url: `comment/${comment.id}`,
        });
    };

    // const handleLoadMoreComments = () => {
    //     setIsLoadMoreCommentActive(o => !o);
    // };

    useDebounceEffect(
        () => {
            if (id && !noAction) {
                onIsUserReacted({
                    method: 'GET',
                    module: 'social-post-activity',
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
    // const allComments = commentData?.payload || [];

    // React.useEffect(() => {
    //     if (commentOpen) {
    //         onCommentSocialPost({
    //             method: 'GET',
    //             module: 'social-post-activity',
    //             url: `${id}/comment`,
    //         });
    //     }
    // }, [commentOpen, onCommentSocialPost, id]);

    // React.useEffect(() => {
    //     if (commentData?.payload) {
    //         setComments(commentData?.payload);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [commentData]);

    React.useEffect(() => {
        if (socket) {
            socket.on('connect_error', (err: any) => {});
            socket.on('connect', function () {});
            socket.on(`${SocketEnum.SOCIAL_POST_NOTIFICATION_COMMENT}-${id}`, function (res: Record<string, any>) {
                if (localState === false) {
                    setComments(prev => [res.data, ...prev]);
                }
                // console.log(res);
            });

            socket.on(`${SocketEnum.SOCIAL_POST_ENGAGEMENT_COUNTER}-${id}`, function (res: Record<string, any>) {
                if (localState === false) {
                    setLikes(res?.data?.reactionCount);
                    setCommentCount(res?.data?.commentCount);
                }
            });
            socket.on('disconnect', function () {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    // React.useEffect(() => {
    //     // console.log('ref changed: ', commentsWrapperRef.current);
    //     if (!commentsWrapperRef.current) return;

    //     setCommentWrapperHeight(commentsWrapperRef.current.clientHeight);
    // }, [commentsWrapperRef.current]);
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
                        alt={user?.name || ''}
                        image={{ imagePath: user?.profilePic || '', blurHash: user?.profilePicBlurHash || '' }}
                    />
                    <div>
                        <div className="text-sm font-medium">
                            {user?.name ? (
                                user.name
                            ) : (
                                <span className="bg-gray-200 text-gray-500 p-[2px] rounded border border-gray-400">[Deleted User]</span>
                            )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{funcFormatDateAgo(updatedAt)}</div>
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
                                    // <EduCarePermissionWrapper module={PermissionModulesEnum.SOCIAL_POST} permissions={PermissionActionsEnum.UPDATE}>
                                    <IthriveButton
                                        type="text"
                                        size="small"
                                        className="!justify-start mr-5"
                                        icon={<EditOutlined />}
                                        onClick={props?.onEdit}>
                                        Edit
                                    </IthriveButton>
                                )}
                                {props?.deletable && (
                                    <EducareConfirmDelete
                                        title="Delete Social Post"
                                        subtitle="Are you sure to delete this Social POST?"
                                        onDelete={props?.onDelete}>
                                        {/*<EduCarePermissionWrapper*/}
                                        {/*    module={PermissionModulesEnum.SOCIAL_POST}*/}
                                        {/*    permissions={PermissionActionsEnum.DELETE}>*/}
                                        <IthriveButton type="text" size="small" className="text-red-500 !justify-start" icon={<DeleteOutlined />}>
                                            Delete
                                        </IthriveButton>
                                        {/*</EduCarePermissionWrapper>*/}
                                    </EducareConfirmDelete>
                                )}
                            </div>
                        }>
                        {props.user.userType === UserTypeEnum.ADMIN && <IthriveButton type="text" icon={<BsThreeDotsVertical />} />}
                    </Popover>
                )}
            </div>
            {images.length > 0 ? (
                <p dangerouslySetInnerHTML={{ __html: text }}></p>
            ) : (
                // <p className="text-sm">{text}</p>
                <>
                    <div
                        className="w-full rounded-md py-4 md:py-10 min-h-96 flex items-center"
                        style={{
                            backgroundImage: !text.startsWith('<')
                                ? `linear-gradient(to right, ${gradient?.colors[0]}, ${gradient?.colors[1]})`
                                : 'none',
                        }}>
                        {text.startsWith('<') ? (
                            <div className="px-4 !text-start text-black" dangerouslySetInnerHTML={{ __html: text }}></div>
                        ) : (
                            <div className={`text-2xl w-full text-center ${gradient?.colors[0] === '#fff' ? 'text-black' : 'text-white'}`}>
                                {text}
                            </div>
                        )}
                    </div>
                    {id === 'preview' && useRichEditor === false && (
                        <div>
                            <div className="text-base text-start font-bold">Select status background</div>
                            <div className="mt-5 flex gap-4">
                                {gradients.map((gr: Gradient, index: number) => (
                                    <div
                                        key={index}
                                        className={`h-14 w-14 rounded-md cursor-pointer ${gr.name === 'Gradient 10' ? 'border-4 border-black' : ''} ${gr === gradient ? 'border-4 border-orange-500' : ''}`}
                                        style={{ backgroundImage: `linear-gradient(to right, ${gr.colors[0]}, ${gr.colors[1]})` }}
                                        onClick={() => handleButtonClick(gr)}></div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {images.length === 1 && <OneImage image={images?.[0]} />}
            {images.length === 2 && <TwoImages images={images} />}
            {images.length === 3 && <ThreeImages images={images} />}
            {images.length === 4 && <FourImages images={images} />}
            {images.length >= 5 && (
                <>
                    <TwoImages images={images.slice(0, 2)} />
                    <div className="grid grid-cols-3">
                        <div className="col-span-2">
                            <TwoImages images={images.slice(2, 4)} />
                        </div>
                        <div className="col-span-1">
                            <FiveImages images={images} />
                        </div>
                    </div>
                </>
            )}
            {/* {images.length > 5 && (
                <>
                    <TwoImages images={images.slice(0, 2)} />
                    <ThreeImages images={images.slice(2, 5)} />
                    <MoreThenFive images={images} />
                </>
            )} */}
            <EducareShareModal
                state={[shareState, setShareState]}
                onShare={() => {
                    onShareSocialPost({
                        method: 'PUT',
                        module: 'social-post-activity',
                        url: `${id}/share`,
                    });
                }}
            />
            {!noAction && !inReportPage && (
                <>
                    <div className="flex items-center text-gray-500 text-sm gap-5">
                        <Space>
                            <IthriveButton
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
                                        module: 'social-post-activity',
                                        url: `${id}/reaction`,
                                    });
                                }}>
                                <span>{likes}</span>
                            </IthriveButton>
                        </Space>
                        <Space>
                            <IthriveButton
                                size="small"
                                type="text"
                                className="text-blue-500"
                                icon={commentOpen ? <FaComment /> : <FaRegComment />}
                                // loading={commentSocialPostLoading}
                                onClick={() => {
                                    setCommentOpen(o => !o);
                                }}>
                                <span>{commentCount}</span>
                            </IthriveButton>
                        </Space>
                        <Space>
                            <IthriveButton
                                size="small"
                                type="text"
                                className="text-violet-500"
                                icon={<TbShare3 />}
                                loading={shareSocialPostLoading}
                                onClick={() => {
                                    setShareState({
                                        title: props.user?.name as string,
                                        // description: props.text as string,
                                        // shareUrl: `${window.location.href}/social-post/${id}`,
                                        encryptedRoute: DeepLinkToken.EncryptedRoutes.social_post_details,
                                        id: id,
                                    });
                                }}>
                                <span>{props?.shares}</span>
                            </IthriveButton>
                        </Space>
                    </div>
                    {commentOpen && (
                        <>
                            <div className="flex gap-5 mt-5">
                                <EducareImage variant="avatar" preview={false} image={{ imagePath: '', blurHash: '' }} />
                                <Form onFinish={hookForm.handleSubmit(onSubmit)} className="w-full">
                                    <div className="gap-2 w-full relative">
                                        <EducareInput
                                            type="textarea"
                                            autoSize={{ minRows: 1 }}
                                            hookForm={hookForm}
                                            name="comment"
                                            placeholder="Write a comment..."
                                            className="w-full rounded-xl"
                                        />
                                        <div className="flex justify-end absolute top-[30%] right-3 ">
                                            <IthriveButton
                                                className="self-end rounded-lg border-none"
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

                            <Skeleton avatar paragraph={{ rows: 3 }} loading={apiLoading && !comments}>
                                {/* {showLodeMoreButton && (
                                    <div onClick={handleLoadMoreComments}>
                                        <span className="text-[#0979d4] px-3 cursor-pointer">load more comments</span>
                                    </div>
                                )} */}

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
                                                <EducareBackdrop status={deleteCommentLoading} />

                                                <CommentTaxonomy
                                                    commentCount={commentCount}
                                                    setComments={setComments}
                                                    setCommentCount={setCommentCount}
                                                    comment={comment}
                                                    // commentRefresh={commentRefresh}
                                                    editable={userInfo.id === comment?.userId}
                                                    deletable={userInfo.id === comment?.userId}
                                                    onDelete={() => handleOnDelete(comment)}
                                                />
                                            </div>
                                        ))}
                                        <div ref={ref} className="flex justify-center items-center">
                                            {!reachedEnd && (
                                                <IthriveButton
                                                    variant="reset"
                                                    className="border-none text-center"
                                                    loading={apiLoading}></IthriveButton>
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

export default SocialPostTaxonomy;
