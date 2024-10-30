import React from 'react';
import { useSafeState } from 'ahooks';

import type { TablePaginationConfig } from 'antd';
import type { SpinProps } from 'antd/lib/spin';

import type { TApiPaginatedResponse } from '@library/types';
import { MdOutlineKeyboardDoubleArrowLeft } from '@react-icons/all-files/md/MdOutlineKeyboardDoubleArrowLeft';
import { MdOutlineKeyboardDoubleArrowRight } from '@react-icons/all-files/md/MdOutlineKeyboardDoubleArrowRight';
import { PiSpinnerGapBold } from '@react-icons/all-files/pi/PiSpinnerGapBold';

export const EducareDataTablePaginationProps: TablePaginationConfig = {
    pageSize: 10,
    responsive: true,
    hideOnSinglePage: true,
    showSizeChanger: false,
    pageSizeOptions: [10, 20, 50],
    position: ['bottomCenter'],
    prevIcon: <MdOutlineKeyboardDoubleArrowLeft />,
    nextIcon: <MdOutlineKeyboardDoubleArrowRight />,
};

export const useEducareDataTablePaginationProps = () => {
    const [config, setConfig] = useSafeState<TablePaginationConfig>(EducareDataTablePaginationProps);
    return {
        config: config,
        setConfig: setConfig,
    };
};

export function EducareDataTablePaginationBuilder<T>(
    apiResponse?: TApiPaginatedResponse<T>,
    override: TablePaginationConfig = {},
): TablePaginationConfig {
    if (!apiResponse?.metadata) return EducareDataTablePaginationProps;
    const { page, limit, totalCount } = apiResponse?.metadata ?? {};
    return {
        ...EducareDataTablePaginationProps,
        current: page ?? 1,
        defaultCurrent: 0,
        pageSize: limit ?? EducareDataTablePaginationProps.pageSize,
        total: totalCount ?? 0,
        pageSizeOptions: EducareDataTablePaginationProps.pageSizeOptions,
        ...override,
    };
}

export const EducareDataTableLocalBuilder = (loading = false) => {
    return {
        emptyText: !loading && <div className="grid gap-5 justify-center items-center">No Data Found</div>,
    };
};

export const EducareDataTableLoadingBuilder = (loading = false): SpinProps | boolean => {
    if (!loading) return false;
    return {
        spinning: true,
        size: 'large',
        tip: 'Fetching...',
        className: '!max-h-[100%]',
        indicator: <PiSpinnerGapBold className="animate-spin text-primary" />,
    };
};
