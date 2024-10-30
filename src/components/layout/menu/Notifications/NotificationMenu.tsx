import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import { useRequest } from 'ahooks';

import { Badge, Drawer } from 'antd';
import type { DrawerProps } from 'antd/lib';

import IthriveButton from 'src/components/shared/iThrive-button';
import { EducareDataTablePaginationProps } from '@components/shared/educare-datatable';
import RequestApi from '@library/apis/request.api';
import { useRequestPagination } from '@library/apis/request-pagination.api';
import type { TNotificationCount, TNotificationResponse } from '@library/schemas/post-management';
import { useSocket } from '@library/sockethook';
import { IoNotificationsOutline } from '@react-icons/all-files/io5/IoNotificationsOutline';
import { MdOutlinePlaylistAddCheck } from '@react-icons/all-files/md/MdOutlinePlaylistAddCheck';

import NotificationCard from './NotificationCard';

export default function NotificationMenuComponent() {
    const { isReady } = useRouter();
    const [openNotification, setOpenNotification] = useState(false);
    const [size, setSize] = useState<DrawerProps['size']>();
    const [currentPage, setCurrentPage] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState<TNotificationResponse[]>([]);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [reachedEnd, setReachedEnd] = useState(false);

    const socket = useSocket(String(process.env.NEXT_PUBLIC_SOCKET_URL), '/notification');

    const {
        data: apiNotificationData,
        loading: apiLoading,
        refreshPrevious: refreshNotification,
    } = useRequestPagination<TNotificationResponse>(
        {
            version: 'v1',
            module: 'notification',
            method: 'GET',
            url: 'list',
            urlQueries: {
                page: currentPage,
                limit: EducareDataTablePaginationProps.pageSize as number,
                sort: 'createdAt:desc',
            },
        },
        {
            routerPagination: false,
            readyDependencies: [currentPage],
        },
    );
    const { run: readAllNotification, loading: readNotificationLoading } = useRequest(RequestApi<null, { status: 'unReacted' | 'reacted' }>, {
        manual: true,
        onSuccess: () => {
            refreshNotification();
            setNotificationCount(0); // Assuming all notifications are marked as read
        },
    });

    useEffect(() => {
        // This effect updates the notifications list based on the apiNotificationData changes
        if (apiNotificationData?.payload) {
            const newNotifications = apiNotificationData.payload.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setNotifications(current => {
                // Create a map to avoid duplicates
                const map = new Map(current.map(notification => [notification.id, notification]));
                newNotifications.forEach(notification => map.set(notification.id, notification));
                return Array.from(map.values());
            });
            setFetchingMore(false);
            if (apiNotificationData.metadata?.totalPage === currentPage + 1) {
                setReachedEnd(true);
            }
        }
    }, [apiNotificationData, currentPage]);

    const onClose = () => setOpenNotification(false);

    const showLargeDrawer = () => {
        setSize('large');
        setOpenNotification(true);
    };

    const handleSeeMore = () => {
        if (!fetchingMore) {
            setCurrentPage(prevPage => prevPage + 1);
            setFetchingMore(true);
        }
    };

    const [ref, inView] = useInView({
        threshold: 0.1,
        rootMargin: '50px 0px',
    });

    useEffect(() => {
        if (inView && !reachedEnd) {
            handleSeeMore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView, apiNotificationData, reachedEnd]);

    useEffect(() => {
        if (fetchingMore && apiNotificationData?.payload) {
            const newNotifications = apiNotificationData.payload.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setNotifications(prevNotifications => [
                ...prevNotifications,
                ...newNotifications.filter(notification => !notifications.some(prevNotification => prevNotification.id === notification.id)),
            ]);
            setFetchingMore(false);
            if (apiNotificationData.metadata?.totalPage === currentPage) {
                setReachedEnd(true);
            }
        }
    }, [fetchingMore, apiNotificationData, currentPage, notifications]);

    const { data: unreadCountData } = useRequest(RequestApi<null, TNotificationCount>, {
        ready: isReady,
        defaultParams: [{ version: 'v1', method: 'GET', module: 'notification', url: 'un-read-notification-count' }],
    });

    useEffect(() => {
        if (unreadCountData?.payload?.count) {
            setNotificationCount(unreadCountData?.payload?.count);
        }
    }, [unreadCountData]);

    useEffect(() => {
        if (socket) {
            socket.on('connect_error', (err: any) => {});
            socket.on('connect', function () {});

            socket.on(`notification-admin`, function (res: Record<string, any>) {
                setNotifications(prevNotifications => [res.data, ...prevNotifications]);
                setNotificationCount(prevNotifications => prevNotifications + 1);
            });

            socket.on('disconnect', function () {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);
    return (
        <>
            <div className="cursor-pointer mr-5 mt-2" onClick={showLargeDrawer}>
                <Badge count={notificationCount} overflowCount={99}>
                    <IoNotificationsOutline className="text-xl" />
                </Badge>
            </div>
            <Drawer title="Notifications" className="custom-drawer relative" size={size} onClose={onClose} open={openNotification}>
                <IthriveButton
                    size="small"
                    className="text-white absolute top-1.5 right-10 p-3 h-3  border-0 shadow-none disabled:bg-primary"
                    icon={<MdOutlinePlaylistAddCheck size={20} />}
                    loading={readNotificationLoading}
                    disabled={!(notificationCount > 0) || readNotificationLoading}
                    variant="filled"
                    onClick={() => {
                        readAllNotification({
                            method: 'PUT',
                            module: 'notification',
                            url: `read-all-notification`,
                        });
                    }}>
                    Mark all as read
                </IthriveButton>

                {notifications.map((item: TNotificationResponse) => (
                    <NotificationCard
                        key={item.id}
                        data={item}
                        onClose={onClose}
                        setNotifications={setNotifications}
                        setNotificationCount={setNotificationCount}
                    />
                ))}
                <div ref={ref} className="flex justify-center items-center">
                    {(apiNotificationData?.metadata?.totalPage as number) > currentPage && (
                        <IthriveButton variant="reset" className="border-none text-center" loading={apiLoading}></IthriveButton>
                    )}
                </div>
            </Drawer>
        </>
    );
}
