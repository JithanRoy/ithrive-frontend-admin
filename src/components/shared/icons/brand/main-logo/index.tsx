'use client';
import React from 'react';

import { Image } from 'antd';

type Props = {
    className?: string;
    style?: React.CSSProperties;
};
export default function MainLogo(props: Props) {
    return <Image src="/images/logo-m.png" preview={false} alt="educare-main-log" className="w-full" />;
}
