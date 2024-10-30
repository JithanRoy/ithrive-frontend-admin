import React from 'react';
import { useRouter } from 'next/router';
import { useIsomorphicLayoutEffect } from 'ahooks';

import { useRecoilValue } from 'recoil';
import { UserInfoAtom } from '@store/UserInfoAtom';

import EducareBackdrop from '@components/shared/educare-backdrop';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import { DEFAULT_ROUTE } from '@library/const';

function AppAuthHOC({ loginRequired, children }: { loginRequired: boolean; children: React.ReactNode }) {
    const { replace } = useRouter();
    const { accessToken } = useRecoilValue(UserInfoAtom);

    const [check, setCheck] = React.useState<boolean>(false);

    useIsomorphicLayoutEffect(() => {
        setCheck(() => false);
        if (!accessToken && loginRequired) {
            EducareMessageAlert('You are not logged in!', 'warning');
            replace('/login');
        } else if (!!accessToken && !loginRequired) {
            EducareMessageAlert('Welcome back!');
            replace(DEFAULT_ROUTE);
        } else {
            setCheck(() => true);
        }
    }, [loginRequired, accessToken]);

    if (!check) return <EducareBackdrop status={true} />;

    return children;
}

export default AppAuthHOC;
