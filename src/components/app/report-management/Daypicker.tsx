import React from 'react';
import { useRouter } from 'next/router';

import type { DatePickerProps } from 'antd';
import { DatePicker, Space } from 'antd';

const DayPickerForFilter = () => {
    const router = useRouter();

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        router.push({
            pathname: router.pathname,
            query: {
                date: dateString,
            },
        });
    };

    return (
        <Space direction="vertical">
            <DatePicker
                className="h-[39px] rounded-none"
                format={{
                    format: 'YYYY-MM-DD',
                    type: 'mask',
                }}
                onChange={onChange}
                title="Date"
                placeholder="Date"
            />
        </Space>
    );
};

export default DayPickerForFilter;
