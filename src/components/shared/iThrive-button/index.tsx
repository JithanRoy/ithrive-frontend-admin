import type { ReactNode } from 'react';

import { Button } from 'antd';
import type { ButtonProps } from 'antd/lib/button/button';

import classNames from 'classnames';

type IthriveButtonProps = ButtonProps & { variant?: 'filled' | 'bordered' | 'reset'; children?: ReactNode };

const IthriveButton = ({ variant, ...props }: IthriveButtonProps) => {
    props.className = classNames(
        'flex justify-center place-items-center rounded-none',
        {
            'h-8': !props.size,
        },
        props.className,
    );
    if (variant === 'filled') {
        props = { type: 'primary', ...props };
    } else if (variant === 'reset') {
        props = {
            type: 'default',
            ...props,
            className: classNames('border-red-500 text-red-500', props.className),
        };
    } else if (variant === 'bordered') {
        props = {
            type: 'default',
            ...props,
            className: classNames('border-primary text-primary', props.className),
        };
    }
    return <Button {...props} />;
};

export default IthriveButton;
