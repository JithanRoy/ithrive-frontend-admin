import React from 'react';
import { useRouter } from 'next/router';
import { useMemoizedFn } from 'ahooks';

import { Dropdown } from 'antd';

import { useRecoilValue, useResetRecoilState } from 'recoil';
import { UserInfoAtom } from '@store/UserInfoAtom';

import { DownOutlined } from '@ant-design/icons';
import EducareButton from '@components/shared/educare-button';
import EducareImage from '@components/shared/educare-image';
import { IsomorphicLocalStorage } from '@library/isomorphic-local-storage';

export default function HeaderMenuComponent() {
    const { replace } = useRouter();
    const { userInfo } = useRecoilValue(UserInfoAtom);
    const resetUserInfo = useResetRecoilState(UserInfoAtom);
    const onLogout = useMemoizedFn(() => {
        resetUserInfo();
        IsomorphicLocalStorage.clear();
        replace('/login');
    });

    return (
        <div className="border-l md:pl-4 flex items-center">
            <EducareImage
                variant="avatar"
                preview={false}
                image={{ imagePath: userInfo?.profilePic || '', blurHash: userInfo?.profilePicBlurHash || '' }}
            />
            <div className="hidden md:flex flex-col items-center">
                <span className="text-base">{userInfo?.name}</span>
                <span className="text-xs">{userInfo?.email}</span>
            </div>
            <Dropdown
                placement="bottomRight"
                trigger={['click']}
                overlayClassName="w-40"
                dropdownRender={() => (
                    <div className="p-2 rounded-sm bg-white shadow-xl">
                        <div className="flex flex-col gap-2">
                            <div className="text-black text-center my-2 border-b pb-2">{userInfo?.name}</div>
                            <EducareButton type="link" className="text-black" htmlType="button" onClick={onLogout}>
                                Logout
                            </EducareButton>
                        </div>
                    </div>
                )}>
                <EducareButton type="text" icon={<DownOutlined className="text-xl" />} />
            </Dropdown>
        </div>
    );
}
