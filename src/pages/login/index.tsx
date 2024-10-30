import React from 'react';
import type { ReactElement } from 'react';

import LoginComponent from '@components/auth/Login';
import AuthLayoutComponent from '@components/layout/AuthLayout';
import { APP_NAME } from '@library/const';

import type { NextPageWithLayout } from '../_app';

const LoginPage: NextPageWithLayout = () => <LoginComponent />;

LoginPage.pageTitle = `Login-${APP_NAME}`;
LoginPage.getLayout = function getLayout(page: ReactElement) {
    return <AuthLayoutComponent>{page}</AuthLayoutComponent>;
};

export default LoginPage;
