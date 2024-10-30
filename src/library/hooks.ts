import React from 'react';
import { useIsomorphicLayoutEffect, useSetState } from 'ahooks';

export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useSetState<{
        width: number | undefined;
        height: number | undefined;
    }>({
        width: undefined,
        height: undefined,
    });
    useIsomorphicLayoutEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return {
        ...windowSize,
        isXs: !!(windowSize.width && windowSize.width < 576),
        isSm: !!(windowSize.width && windowSize.width < 768),
        isMd: !!(windowSize.width && windowSize.width >= 768),
        isLg: !!(windowSize.width && windowSize.width >= 992),
        isXl: !!(windowSize.width && windowSize.width >= 1200),
        isXxl: !!(windowSize.width && windowSize.width >= 1600),
    };
};

export type AddOrEditStateProps = {
    type: 'create' | 'update';
    state: [boolean | string | 'reload' | 'cancel', React.Dispatch<React.SetStateAction<boolean | string | 'reload' | 'cancel'>>];
    onValue?: (id?: string | number) => void;
    editStateId?: string | number;
    onSearch?: (value?: string) => void;
    data?: any;
    onclose?: (id?: string | number) => void;
};
export type AddOrEditStateFormProps = {
    type: AddOrEditStateProps['type'];
    onValue: AddOrEditStateProps['onValue'];
    editStateId: string;
    data?: any;
    onSearch?: (value?: any) => void;
    onClose: (what: 'reload' | 'cancel') => void;
};
export const useAddOrEditState = ({ type, state, onValue, data, onSearch }: AddOrEditStateProps) => {
    const editStateId = React.useMemo(() => {
        if (type === 'update' && !!state[0] && state[0] !== 'reload' && state[0] !== 'cancel') return state[0] as string;
        return '';
    }, [type, state]);
    const isOpen = React.useMemo(() => {
        if (type === 'create') return state[0] === true;
        return !!editStateId;
    }, [editStateId, type, state]);
    return { type, editStateId, isOpen, onClose: state[1], onValue, data, onSearch };
};
