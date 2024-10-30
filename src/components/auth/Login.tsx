import React from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useLocalStorageState, useMemoizedFn, useRequest } from 'ahooks';

import { Checkbox, Form } from 'antd';

import { useSetRecoilState } from 'recoil';
import { permissionsState } from '@store/permissionAtom';
import { UserInfoAtom } from '@store/UserInfoAtom';

import EducareButton from '@components/shared/educare-button';
import EducareInput from '@components/shared/educare-input';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import MainLogo from '@components/shared/icons/brand/main-logo';
import { zodResolver } from '@hookform/resolvers/zod';
import RequestApi from '@library/apis/request.api';
import { APP_NAME, REFRESH_TOKEN_ENABLED } from '@library/const';
import { UserTypeEnum } from '@library/enums';
import type { TLoginResponse, TLoginSchema } from '@library/schemas/login';
import { LoginSchema } from '@library/schemas/login';

const LoginComponent = () => {
    const { replace, query } = useRouter();

    const setUserInfoAtom = useSetRecoilState(UserInfoAtom);
    const setPermissions = useSetRecoilState(permissionsState);

    const hookForm = useForm<TLoginSchema>({
        mode: 'onChange',
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
            userType: UserTypeEnum.ADMIN,
        },
    });


    const [rememberMe, setRememberMe] = useLocalStorageState<boolean>(REFRESH_TOKEN_ENABLED, {
        defaultValue: false,
    });

    const { run: onLoginApi, loading: onLoginLoading } = useRequest(RequestApi<TLoginSchema, TLoginResponse>, {
        manual: true,
        onSuccess: data => {
            setPermissions(data.payload.permissions);
            setUserInfoAtom(data.payload);
            replace(typeof query?.returnTo === 'string' && query?.returnTo ? query?.returnTo : '/').finally(() => {
                EducareMessageAlert(data?.message || 'Login success');
            });
        },
        onError: (error: any) => {
            EducareMessageAlert(error?.error?.systems || 'Login failed', 'error');
        },
    });

    const onLogin = useMemoizedFn((data: TLoginSchema) => {
        onLoginApi({
            module: 'auth',
            method: 'POST',
            url: 'login',
            payload: data,
        });
    });

    return (
        <div className=" p-8">
            <div className="mb-5 max-w-sm mx-auto">
                <MainLogo />
                <h1 className="font-semibold mt-10">Welcome to {APP_NAME} Admin Panel</h1>
                <h3 className="text-sm">Please log in to access your account.</h3>
            </div>
            <Form className="max-w-sm mx-auto grid gap-5" onFinish={hookForm.handleSubmit(onLogin)}>
                <EducareInput hookForm={hookForm} name="email" type="email" placeholder="admin@communify.com" label="Email" />
                <EducareInput hookForm={hookForm} name="password" type="password" placeholder="******" label="Password" />
                <Checkbox name="remember" checked={rememberMe === false} onClick={() => setRememberMe(p => !p)}>
                    Remember me
                </Checkbox>
                <EducareButton size="large" variant="filled" htmlType="submit" loading={onLoginLoading}>
                    Log in
                </EducareButton>
            </Form>
        </div>
    );
};

export default LoginComponent;
