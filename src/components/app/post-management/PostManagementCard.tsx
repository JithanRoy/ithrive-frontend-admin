import React from 'react';

import { funcTruncateText } from '@library/functions';

interface Props {
    icon: React.ReactNode;
    title: string;
    value: string | number | undefined;
}

const PostManagementCard = ({ icon, title, value }: Props) => {
    return (
        <div className="flex gap-3 items-center">
            <div className="p-2 border border-gray-100 rounded-md bg-white shadow-md w-fit flex justify-center items-center">{icon}</div>
            <div>
                <div className="text-base font-bold">{title}</div>
                {title === 'Apply link' ? (
                    <a href={value as string} className="text-blue-500 ">
                        {funcTruncateText(value)}
                    </a>
                ) : (
                    <div className="capitalize">{value || ''}</div>
                )}
            </div>
        </div>
    );
};

export default PostManagementCard;
