'use client';
import React from 'react';

import { Image } from 'antd';

type Props = {
    className?: string;
    style?: React.CSSProperties;
};
export default function MainLogo(props: Props) {
    return <Image src="/images/Thrive_Secondary_CMYK.png" preview={false} alt="iThrive-main-logo" className="px-5" />;
}
