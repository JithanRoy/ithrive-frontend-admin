import React from 'react';
import Link from 'next/link';

import { Image } from 'antd';

import classNames from 'classnames';

import { DEFAULT_ROUTE } from '@library/const';

type Props = {
    className?: string;
    style?: React.CSSProperties;
};
export default function MainLogoOnly(props: Props) {
    return (
        <Link href={DEFAULT_ROUTE} as={DEFAULT_ROUTE}>
            <Image
                src="/images/logo.png"
                alt="educare-main-logo"
                width="100%"
                height="100%"
                preview={false}
                {...props}
                className={classNames('rounded-full', props.className)}
            />
        </Link>
    );
}
