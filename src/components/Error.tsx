import React from 'react';
import Link from 'next/link';

import { Result } from 'antd';

import EducareButton from '@components/shared/educare-button';
import VoidLogo from '@components/shared/icons/void';
import { DEFAULT_ROUTE } from '@library/const';

function ErrorCode({ statusCode = 404, statusText = 'Sorry, the page you visited does not exist.' }) {
    return (
        <div className="h-full grid place-items-center bg-white-primary-gradient-b">
            <Result
                rootClassName="!p-0"
                icon={<VoidLogo className="h-96 w-96" />}
                title={<span className="text-black">{statusCode}</span>}
                subTitle={<span className="text-black">{statusText}</span>}
                extra={
                    <Link href={DEFAULT_ROUTE} passHref as={DEFAULT_ROUTE} className="flex justify-center">
                        <EducareButton variant="bordered">Back Home</EducareButton>
                    </Link>
                }
            />
        </div>
    );
}

export default ErrorCode;
