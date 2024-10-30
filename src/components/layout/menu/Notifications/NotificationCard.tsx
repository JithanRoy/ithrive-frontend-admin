import React from 'react';
import { useRouter } from 'next/router';
import { useRequest } from 'ahooks';

import { notification } from 'antd';

import dayjs from 'dayjs';

import EducareImage from '@components/shared/educare-image';
import RequestApi from '@library/apis/request.api';
import { PostActivityEnum, PostEnum } from '@library/enums';
import type { TNotificationCount, TNotificationResponse } from '@library/schemas/post-management';
import { FaRegComment } from '@react-icons/all-files/fa6/FaRegComment';
import { GoDotFill } from '@react-icons/all-files/go/GoDotFill';
import { MdApproval } from '@react-icons/all-files/md/MdApproval';
import { MdOutlineStarBorder } from '@react-icons/all-files/md/MdOutlineStarBorder';
import { RxCross2 } from '@react-icons/all-files/rx/RxCross2';
import { TbShare3 } from '@react-icons/all-files/tb/TbShare3';
import { TiTick } from '@react-icons/all-files/ti/TiTick';

interface NotificationCardProps {
    data: TNotificationResponse;
    onClose: () => void;
    setNotifications: any;
    setNotificationCount: any;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ data, onClose, setNotifications, setNotificationCount }) => {
    const timeAgo = dayjs(data?.createdAt).fromNow();
    const router = useRouter();

    const onReadNotificationApi = useRequest(RequestApi<TNotificationCount, any>, {
        manual: true,
    });

    const onReadNotification = (id: string) => {
        onReadNotificationApi.run({
            module: 'notification',
            method: 'PUT',
            url: `${id}/read-notification`,
        });
    };
    const makePostType = (postType: string) => {
        if (postType == PostEnum.HOUSING_ACCOMMODATION) {
            return 'housing and accommodation';
        } else if (postType == PostEnum.SOCIAL_POST) {
            return 'social post';
        }
        return postType;
    };
    const makePostTitle = (notification: TNotificationResponse) => {
        if (notification.postType === PostEnum.JOB) {
            return notification?.post?.jobTitle;
        } else if (notification.postType === PostEnum.SOCIAL_POST) {
            return notification?.post?.post;
        } else if (notification.postType === PostEnum.HOME_OFFICE) {
            return notification?.post?.title;
        }
    };
    const makeNotification = (notification: TNotificationResponse) => {
        if (notification.postActivity === PostActivityEnum.POST_APPROVAL && notification?.postType === PostEnum.MARKETPLACE) {
            return (
                <span>
                    has requested an approval for a <span className="font-bold">{makePostType(notification.postType)}</span> post
                    {` : "${data?.post?.name}"`}
                </span>
            );
        } else if (notification.postActivity === PostActivityEnum.POST_APPROVAL && notification?.postType === PostEnum.JOB) {
            return (
                <span>
                    has requested an approval for a <span className="font-bold">{makePostType(notification.postType)}</span> post
                    {` : "${data?.post?.jobTitle}"`}
                </span>
            );
        } else if (notification.postActivity === PostActivityEnum.POST_APPROVAL) {
            return (
                <span>
                    has requested an approval for a <span className="font-bold">{makePostType(notification.postType)}</span> post
                    {` : "${data?.post?.title}"`}
                </span>
            );
        } else if (notification.postActivity === PostActivityEnum.POST_REACTION) {
            const notificationContent = makePostTitle(notification);
            if (!notificationContent?.startsWith('<')) {
                return (
                    <span>
                        liked your post in <span className="font-bold">{makePostType(notification.postType)}</span> {` : "${notificationContent}"`}
                    </span>
                );
            } else {
                return (
                    <span>
                        liked on your post in <span className="font-bold">{makePostType(notification.postType)}</span>
                    </span>
                );
            }
        } else if (notification.postActivity === PostActivityEnum.COMMENT && notification?.postType === PostEnum.HOME_OFFICE) {
            return (
                <span>
                    commented on your post in <span className="font-bold">{notification?.postType}</span>
                    {` : "${notification?.post?.title}"`}
                </span>
            );
        } else if (notification.postActivity === PostActivityEnum.COMMENT) {
            const notificationContent = notification?.post?.post;
            if (!notificationContent?.startsWith('<')) {
                return (
                    <span>
                        commented on your post in <span className="font-bold">{makePostType(notification.postType)}</span>
                        {` : "${notificationContent}"`}
                    </span>
                );
            } else {
                return (
                    <span>
                        commented on your post in <span className="font-bold">{makePostType(notification.postType)}</span>
                    </span>
                );
            }
        } else if (notification.postActivity === PostActivityEnum.COMMENT_REPLY) {
            const notificationContent = makePostTitle(notification);
            if (!notificationContent?.startsWith('<')) {
                return (
                    <span>
                        replied your comment in <span className="font-bold">{makePostType(notification.postType)}</span>
                        {` : "${notificationContent}"`}
                    </span>
                );
            } else {
                return (
                    <span>
                        replied your comment in <span className="font-bold">{makePostType(notification.postType)}</span>
                    </span>
                );
            }
        } else if (notification.postActivity === PostActivityEnum.COMMENT_REACTION && notification.postType === PostEnum.SOCIAL_POST) {
            const notificationContent = notification?.post?.post;
            if (!notificationContent?.startsWith('<')) {
                return (
                    <span>
                        liked your comment in <span className="font-bold">{makePostType(notification.postType)}</span>
                        {` : "${notificationContent}"`}
                    </span>
                );
            } else {
                return (
                    <span>
                        liked your comment in <span className="font-bold">{makePostType(notification.postType)}</span>
                    </span>
                );
            }
        } else if (notification.postActivity === PostActivityEnum.COMMENT_REACTION) {
            return (
                <span>
                    liked your comment in <span className="font-bold">{makePostType(notification.postType)}</span>
                    {` : "${notification?.post?.title}"`}
                </span>
            );
        } else if (notification.postActivity === PostActivityEnum.COMMENT_REPLY_REACTION) {
            const notificationContent = notification?.post?.post;
            if (!notificationContent?.startsWith('<')) {
                return (
                    <span>
                        liked your replied comment on <span className="font-bold">{makePostType(notification.postType)}</span>
                        {` : "${notificationContent}"`}
                    </span>
                );
            } else {
                return (
                    <span>
                        liked your replied comment on <span className="font-bold">{makePostType(notification.postType)}</span>
                    </span>
                );
            }
        } else if (notification.postActivity === PostActivityEnum.ACCOUNT_APPROVED_REQUEST && notification.postType === PostEnum.USER_MANAGEMENT) {
            return (
                <span>
                    has requested an approval for a <span className="font-bold">{notification.notificationFromInfo.userType}</span>
                </span>
            );
        } else if (notification.postActivity === PostActivityEnum.SHARE && notification.postType === PostEnum.HOME_OFFICE) {
            return (
                <span>
                    shared a post on <span className="font-bold">{notification.postType}</span>
                    {` : "${notification?.post?.title}"`}
                </span>
            );
        } else if (notification.postActivity === PostActivityEnum.SHARE) {
            return (
                <span>
                    shared a post on <span className="font-bold">{notification.postType}</span>
                    {` : "${notification?.post?.post}"`}
                </span>
            );
        }
    };
    const handleDetails = () => {
        onClose();
        if (!data?.isRead) {
            onReadNotification(data?.id as string);
            setNotifications((prevNotifications: TNotificationResponse[]) => [
                ...prevNotifications.map((notifications: TNotificationResponse) => {
                    if (notifications.id == data?.id) {
                        return { ...notifications, isRead: true };
                    }
                    return notifications;
                }),
            ]);
            setNotificationCount((prevCount: number) => prevCount - 1);
        }
        if (
            ([PostEnum.EVENT, PostEnum.MARKETPLACE, PostEnum.HOUSING_ACCOMMODATION, PostEnum.SCHOLARSHIP] as string[]).includes(
                data.postType as string,
            )
        ) {
            router.push(`/post-management/${data?.postType}/details?id=${data?.post?.id}`);
        } else if (data.postType === PostEnum.JOB) {
            router.push(`/post-management/job-post/details?id=${data?.post?.id}`);
        } else if (data.postType === PostEnum.SOCIAL_POST) {
            router.push(`/post-details?id=${data?.post?.id}`);
        } else if (data.postType === PostEnum.HOME_OFFICE) {
            router.push(`/home-office/details?id=${data?.post?.id}`);
        } else if (data.postType === PostEnum.USER_MANAGEMENT) {
            router.push(`/user-management/organization-details?id=${data?.documentId}`);
        } else if (data.postType === PostEnum.ORGANISATION) {
            router.push(`/user-management/organization-details?id=${data?.documentId}`);
        }
    };
    return (
        <div className="mb-4 mt-4 p-1 ms-6 cursor-pointer" onClick={handleDetails}>
            <div className={`flex gap-4 rounded p-4 ${data?.isRead === false && 'bg-slate-100'}`}>
                <div className="relative">
                    <div className="relative">
                        <EducareImage
                            variant="avatar"
                            preview={false}
                            image={{
                                imagePath: data?.notificationFromInfo?.profilePic || '',
                                blurHash: data?.notificationFromInfo?.profilePicBlurHash || '',
                            }}
                        />
                        {(data?.postActivity === PostActivityEnum.COMMENT_REACTION ||
                            data?.postActivity === PostActivityEnum.COMMENT_REPLY_REACTION ||
                            data?.postActivity === PostActivityEnum.POST_REACTION) && (
                            <div className="absolute bottom-[-6] right-[-10]">
                                <MdOutlineStarBorder className="text-rose-500 rounded-full bg-rose-100" />
                            </div>
                        )}

                        {(data?.postActivity === PostActivityEnum.COMMENT || data?.postActivity === PostActivityEnum.COMMENT_REPLY) && (
                            <div className="absolute bottom-[-6] right-[-10]">
                                <FaRegComment className="text-blue-600 text-sm bg-gray-200 rounded" />
                            </div>
                        )}

                        {(data?.postActivity === PostActivityEnum.ACCOUNT_APPROVED ||
                            data?.postActivity === PostActivityEnum.ADMIN_POST_APPROVED) && (
                            <div className="absolute bottom-[-6] right-[-10]">
                                <TiTick className="text-green-600 bg-green-200 rounded-full" />
                            </div>
                        )}

                        {data?.postActivity === PostActivityEnum.ADMIN_POST_REJECTED && (
                            <div className="absolute bottom-[-6] right-[-10]">
                                <RxCross2 className="text-red-600 bg-red-200 rounded-full" />
                            </div>
                        )}

                        {data?.postActivity === PostActivityEnum.SHARE && (
                            <div className="absolute bottom-[-6] right-[-10]">
                                <TbShare3 className="text-fuchsia-700 bg-fuchsia-400 rounded-full" />
                            </div>
                        )}

                        {(data?.postActivity === PostActivityEnum.ADMIN_POST_APPROVED ||
                            data?.postActivity === PostActivityEnum.POST_APPROVAL ||
                            data?.postActivity === PostActivityEnum.ACCOUNT_APPROVED_REQUEST) && (
                            <div className="absolute bottom-[-6] right-[-10]">
                                <MdApproval className="text-teal-800 text-sm bg-teal-100 rounded-full" />
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div>
                        <span className="font-bold">{data?.notificationFromInfo?.name || ''}</span> {makeNotification(data)}
                    </div>
                    <small className="text-gray-500">{timeAgo}</small>
                </div>
                <div className="flex justify-end items-center flex-grow">{data?.isRead === false ? <GoDotFill className="text-primary" /> : ''}</div>
            </div>
        </div>
    );
};

export default NotificationCard;
