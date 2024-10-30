import React from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { ReactElement, ReactNode } from 'react';
import { useLocalStorageState } from 'ahooks';

import { ConfigProvider } from 'antd';

import { RecoilRoot } from 'recoil';

import EducareBackdrop from '@components/shared/educare-backdrop';
import { APP_NAME } from '@library/const';
import { funcTailwindConfig } from '@library/functions';

import '@styles/index.scss';

import '@library/dayjs';

export type NextPageWithLayout<P = NonNullable<unknown>, IP = P> = NextPage<P, IP> & {
    pageTitle?: string;
    getLayout?: (page: ReactElement) => ReactNode;
};

function MyApp({
    Component,
    pageProps,
}: AppProps & {
    Component: NextPageWithLayout;
}) {
    const router = useRouter();

    const [backdrop, setBackdrop] = useLocalStorageState<boolean>('__educare_admin_backdrop', {
        defaultValue: false,
    });
    React.useEffect(() => {
        router.events.on('routeChangeError', () => setBackdrop(false));
        router.events.on('routeChangeStart', () => setBackdrop(true));
        router.events.on('routeChangeComplete', () => setBackdrop(false));
        return () => {
            router.events.off('routeChangeError', () => setBackdrop(false));
            router.events.off('routeChangeStart', () => setBackdrop(true));
            router.events.off('routeChangeComplete', () => setBackdrop(false));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout ?? (page => page);

    const { colors, fontFamily } = funcTailwindConfig().theme;
    const defaultPrimaryColor = colors.primary.DEFAULT;
    const defaultFontFamily = fontFamily['poppins'].join(' ');
    const title = Component?.pageTitle ? `${Component.pageTitle}` : APP_NAME;

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={APP_NAME} />
                <meta name="description" content="student communify" />
                <meta name="keywords" content="student communify" />
                <meta name="theme-color" content={defaultPrimaryColor} />
            </Head>
            <ConfigProvider
                theme={{
                    token: {
                        fontFamily: defaultFontFamily,
                        colorPrimary: defaultPrimaryColor,
                        colorPrimaryActive: defaultPrimaryColor,
                        colorPrimaryText: defaultPrimaryColor,
                        colorPrimaryTextActive: defaultPrimaryColor,
                        colorPrimaryTextHover: defaultPrimaryColor,
                        colorPrimaryBorder: defaultPrimaryColor,
                        colorPrimaryBorderHover: defaultPrimaryColor,
                        colorPrimaryBg: defaultPrimaryColor,
                        colorPrimaryBgHover: defaultPrimaryColor,
                        colorPrimaryHover: defaultPrimaryColor,
                    },
                }}>
                <EducareBackdrop status={!!backdrop} />
                <RecoilRoot>{getLayout(<Component {...pageProps} />)}</RecoilRoot>
            </ConfigProvider>
        </>
    );
}

export default MyApp;
