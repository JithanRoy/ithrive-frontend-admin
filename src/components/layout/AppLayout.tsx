/* eslint-disable simple-import-sort/imports */
import AppAuthHOC from '@components/layout/AuthHOC';

import NotificationMenuComponent from '@components/layout/menu/Notifications/NotificationMenu';
import IthriveButton from 'src/components/shared/iThrive-button';
import MainLogo from '@components/shared/icons/brand/main-logo';
import MainLogoOnly from '@components/shared/icons/brand/main-logo-only';
import ContentManagementLogo from '@components/shared/icons/content-management';
import HomeOfficeUpdateLogo from '@components/shared/icons/home-office-update';
import InquiriesLogo from '@components/shared/icons/inquiries';
import PostManagementLogo from '@components/shared/icons/post-management';
import SocialPostLogo from '@components/shared/icons/social-post';
import SupportCenterLogo from '@components/shared/icons/support-center';
import UserManagementLogo from '@components/shared/icons/user-management';
import { APP_NAME } from '@library/const';
import { LocalStorageEnum, PermissionActionsEnum, PermissionModulesEnum } from '@library/enums';
import { useWindowSize } from '@library/hooks';
import { AiOutlineMenuFold } from '@react-icons/all-files/ai/AiOutlineMenuFold';
import { AiOutlineMenuUnfold } from '@react-icons/all-files/ai/AiOutlineMenuUnfold';
import { MdKeyboardArrowRight } from '@react-icons/all-files/md/MdKeyboardArrowRight';

import { permissionsState } from '@store/permissionAtom';
import { useDebounceEffect, useLocalStorageState, useSafeState } from 'ahooks';

import { Layout, Menu } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';

import classNames from 'classnames';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import React, { useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import styles from './Applayout.module.scss';
import ReportManagementLogo from '@components/shared/icons/report-management';

const HeaderMenuComponent = dynamic(() => import('@components/layout/menu/HeaderMenu'), { ssr: false });

type Props = {
    children: React.ReactNode;
    activeMenu?: string;
    showSidebar?: boolean;
    showTopbar?: boolean;
};
interface MenuItem {
    key: string;
    label: ReactNode;
    icon?: ReactNode;
    permission?: {
        module: string;
        action: string;
    };
    popupClassName?: string;
    children?: MenuItem[];
}

const AppLayoutComponent = ({ children, activeMenu, showSidebar = true, showTopbar = true }: Props) => {
    // useLoginCheck();
    const permissions = useRecoilValue(permissionsState);
    const [filteredMenus, setFilteredMenus] = React.useState<ItemType[]>([]);
    const { pathname } = useRouter();

    const [hideSideBar, setHideSideBar] = useSafeState<boolean>(false);
    const { width } = useWindowSize();
    useDebounceEffect(
        () => {
            setHideSideBar(!!(width && width < 768));
        },
        [width],
        {
            wait: 100,
        },
    );

    const [collapsed, setCollapsed] = useLocalStorageState(LocalStorageEnum.APP_SIDEBAR_COLLAPSE, {
        defaultValue: true,
    });
    const [openKeys, setOpenKeys] = useLocalStorageState<string[]>(LocalStorageEnum.APP_SIDEBAR_OPEN_KEYS, {
        defaultValue: [],
    });

    const SIDEBAR_MENUS: MenuItem[] = useMemo(
        () => [
            {
                key: '/',
                label: <Link href="/">Social Post</Link>,
                icon: <SocialPostLogo stroke={pathname === '/' ? '#ff8743' : '#000'} />,
            },
            {
                key: '/home-office',
                label: <Link href="/home-office">Home Office Update</Link>,
                icon: <HomeOfficeUpdateLogo fill={pathname.startsWith('/home-office') ? styles.educareAdminMenuPopupStyle : ''} />,
                permission: { module: PermissionModulesEnum.HOME_OFFICE_UPDATES, action: PermissionActionsEnum.READ },
            },
            {
                key: '/user-management',
                icon: <UserManagementLogo fill={pathname.startsWith('/user-management') ? styles.educareAdminMenuPopupStyle : ''} />,
                label: 'User Management',
                popupClassName: styles.educareAdminMenuPopupStyle,
                permission: { module: PermissionModulesEnum.USER_MANAGEMENT, action: PermissionActionsEnum.READ },
                children: [
                    {
                        key: '/user-management/organization',
                        label: <Link href="/user-management/organization">Organisation</Link>,
                    },
                    {
                        key: '/user-management/admin',
                        label: <Link href="/user-management/admin">Admin</Link>,
                    },
                ],
            },
            {
                key: '/post-management',
                icon: <PostManagementLogo stroke={pathname.startsWith('/post-management') ? '#ff8743' : '#000'} />,
                label: 'Post Management',
                popupClassName: styles.educareAdminMenuPopupStyle,
                permission: { module: PermissionModulesEnum.POST_MANAGEMENT, action: PermissionActionsEnum.READ },
                children: [
                    {
                        key: '/post-management/housing-accommodation',
                        label: <Link href="/post-management/housing-accommodation">Housing & Accommodation</Link>,
                    },
                    {
                        key: '/post-management/scholarship',
                        label: <Link href="/post-management/scholarship">Scholarship</Link>,
                    },
                    {
                        key: '/post-management/marketplace',
                        label: <Link href="/post-management/marketplace">Marketplace</Link>,
                    },
                    {
                        key: '/post-management/job-post',
                        label: <Link href="/post-management/job-post">Job Post</Link>,
                    },
                    {
                        key: '/post-management/event',
                        label: <Link href="/post-management/event">Events</Link>,
                    },
                ],
            },
            {
                key: '/support',
                icon: <SupportCenterLogo stroke={pathname.startsWith('/support') ? '#ff8743' : '#000'} />,
                label: <Link href="/support">Support Center</Link>,
                permission: { module: PermissionModulesEnum.SUPPORT_CENTER, action: PermissionActionsEnum.READ },
            },
            {
                key: '/report-management',
                icon: <ReportManagementLogo fill={pathname === '/report-management' ? '#ff8743' : '#000'} />,
                permission: { module: PermissionModulesEnum.REPORT_MANAGEMENT, action: PermissionActionsEnum.READ },
                label: <Link href="/report-management">Report management</Link>,
            },
            {
                key: '/content-management',
                icon: <ContentManagementLogo fill={pathname === '/content-management' ? styles.educareAdminMenuPopupStyle : ''} />,
                label: <Link href="/content-management">Content Management</Link>,
                permission: { module: PermissionModulesEnum.CONTENT_MANAGEMENT, action: PermissionActionsEnum.READ },
            },
            {
                key: '/inquiry',
                icon: <InquiriesLogo stroke={pathname.startsWith('/inquiry') ? '#ff8743' : '#000'} />,
                label: <Link href="/inquiry?type=scholarship">Inquiries</Link>,
                permission: { module: PermissionModulesEnum.INQUIRIES_MANAGEMENT, action: PermissionActionsEnum.READ },
            },
        ],
        [pathname],
    );

    useEffect(() => {
        const filtered = SIDEBAR_MENUS.filter(item => {
            if (!item.permission) return true;
            if (item?.permission as unknown) {
                const { module, action } = item.permission as { module: string; action: string };
                if (module && action) {
                    const modulePermissions = permissions.find(perm => perm.module === module);
                    return modulePermissions ? modulePermissions.permissions.includes(action) : false;
                }
            }
            return false;
        });
        setFilteredMenus(filtered);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, permissions]);

    return (
        <AppAuthHOC loginRequired={true}>
            <Layout className="max-h-screen min-h-screen">
                {showSidebar && (
                    <Layout.Sider
                        collapsible
                        collapsed={collapsed}
                        className={classNames(styles.educareAdminMenuStyle, {
                            hidden: hideSideBar,
                        })}
                        trigger={null}
                        width="250px"
                        collapsedWidth="50px">
                        <div className="flex justify-center items-center bg-white">
                            <div className="my-3">
                                {collapsed ? (
                                    <MainLogoOnly className="h-12 w-12 p-2" />
                                ) : (
                                    <Link href="/">
                                        <MainLogo className="h-12 p-2" />
                                    </Link>
                                )}
                            </div>
                        </div>
                        {!hideSideBar && (
                            <div className="educare-menu-collapsed-icon-inside" onClick={() => setCollapsed(p => !p)}>
                                <MdKeyboardArrowRight
                                    className={classNames('text-gray-100', {
                                        'rotate-180': !collapsed,
                                    })}
                                />
                            </div>
                        )}
                        <Menu
                            className="mt-2"
                            mode="inline"
                            items={filteredMenus}
                            openKeys={openKeys}
                            onOpenChange={setOpenKeys}
                            selectedKeys={[activeMenu || pathname]}
                        />
                    </Layout.Sider>
                )}

                <Layout>
                    {showTopbar && (
                        <Layout.Header className="!p-0">
                            <div className="flex bg-white justify-between items-center gap-2 px-2 shadow-sm overflow-auto">
                                <div className="flex gap-2">
                                    <IthriveButton
                                        className="md:hidden"
                                        type="text"
                                        size="small"
                                        icon={!hideSideBar ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
                                        onClick={() => {
                                            setHideSideBar(p => !p);
                                            setCollapsed(true);
                                        }}
                                        onDoubleClick={() => {
                                            setHideSideBar(p => !p);
                                            setCollapsed(false);
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <NotificationMenuComponent />
                                    <HeaderMenuComponent />
                                </div>
                            </div>
                        </Layout.Header>
                    )}

                    <Layout.Content className="p-1 md:p-2 overflow-y-auto">{children}</Layout.Content>
                    <Layout.Footer className="text-center text-xs text-gray-500 bg-white py-2">
                        &#169;{new Date().getFullYear()} {APP_NAME} All Rights Reserved.
                    </Layout.Footer>
                </Layout>
            </Layout>
        </AppAuthHOC>
    );
};

export default AppLayoutComponent;
