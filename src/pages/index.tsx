import type { ReactElement } from 'react';

import ListSocialPost from '@components/app/social-post/ListSocialPost';
import AppLayoutComponent from '@components/layout/AppLayout';
import { APP_NAME } from '@library/const';

import type { NextPageWithLayout } from './_app';

const EntryPage: NextPageWithLayout = () => <ListSocialPost />;

EntryPage.pageTitle = `Social Post-${APP_NAME}`;
EntryPage.getLayout = function getLayout(page: ReactElement) {
    return <AppLayoutComponent>{page}</AppLayoutComponent>;
};

export default EntryPage;
