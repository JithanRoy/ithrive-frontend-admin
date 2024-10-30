import React from 'react';
import Image from 'next/image';

const EducareEmptyData = (props: { title: string; description?: string; className?: string }) => {
    return (
        <div className={`p-8 bg-white rounded grid place-items-center px-2 mt-5 ${props?.className}`}>
            <div className="font-bold text-xl mb-3 text-black-500">{props.title}</div>
            <div className="font-16 text-gray-600">{props.description}</div>
            <Image src="/images/box-empty.svg" width={200} height={200} alt="emptyData" />
        </div>
    );
};

export default EducareEmptyData;
