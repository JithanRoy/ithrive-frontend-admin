import React, { useEffect, useMemo, useRef, useState } from 'react';

import { ResizeObserver } from '@juggle/resize-observer';

const SizedBox = ({
    children,
    maxHeight,
    scrollableOverflowOnMaxHeight = false,
    onHeight,
    style,
}: {
    children: React.ReactNode;
    onHeight?: (height: number) => void;
    style?: React.CSSProperties;
    maxHeight?: number;
    scrollableOverflowOnMaxHeight?: boolean;
}) => {
    const divRef = useRef(null);
    const [height, setHeight] = useState(0);

    const isScrollable = useMemo(() => {
        if (scrollableOverflowOnMaxHeight && maxHeight) {
            return height > maxHeight;
        }
    }, [height, scrollableOverflowOnMaxHeight, maxHeight]);

    useEffect(() => {
        const dr = divRef.current;
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target === divRef.current) {
                    // const h = maxHeight ? Math.min(entry.contentRect.height, maxHeight) : entry.contentRect.height;
                    const h = entry.contentRect.height;
                    setHeight(h);
                    onHeight && onHeight(h);
                }
            }
        });
        if (dr) resizeObserver.observe(dr);
        return () => {
            if (dr) resizeObserver.unobserve(dr);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={`overflow-hidden ${isScrollable ? 'h-[500px] overflow-y-scroll custom-scrollbar' : ''}`}>
            <div style={style} ref={divRef}>
                {children}
            </div>
        </div>
    );
};

export default SizedBox;
