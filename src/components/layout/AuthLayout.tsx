import React from 'react';

import AppAuthHOC from './AuthHOC';

type Props = {
    children: React.ReactNode;
};

const AuthLayoutComponent = (props: Props) => {
    return (
        <AppAuthHOC loginRequired={false}>
            <div className="flex min-h-screen bg-gray-100">
                <div className="w-full md:w-2/5 flex flex-col justify-center items-center">{props.children}</div>
                <div className="hidden md:block md:w-3/5">
                    <img src="/images/login-bg.png" alt="admin-login-background" className="object-cover w-full h-full" />
                </div>
            </div>
        </AppAuthHOC>
    );
};

export default AuthLayoutComponent;
