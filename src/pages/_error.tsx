import type { NextPage } from 'next';
import Head from 'next/head';

import ErrorComponent from '@components/Error';

const ErrorPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Error</title>
            </Head>
            <ErrorComponent />
        </>
    );
};

export default ErrorPage;
