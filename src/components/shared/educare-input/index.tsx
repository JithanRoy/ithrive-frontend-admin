import React from 'react';
import { Controller } from 'react-hook-form';

import { Input, InputNumber } from 'antd';

import classNames from 'classnames';

import { funcResolveObjectDot } from '@library/functions';
import type { TEducareInput, TEducareInputUi } from '@library/types/shared';
import { TbEye } from '@react-icons/all-files/tb/TbEye';
import { TbEyeClosed } from '@react-icons/all-files/tb/TbEyeClosed';

import styles from './EducareInput.module.scss';

export const EducareInputByType = React.forwardRef(function AntdInput(props: TEducareInputUi, ref) {
    if (props.type === 'password') {
        return (
            <Input.Password
                classNames={{
                    ...(props.classNames || {}),
                    input: 'bg-gray-50 mt-2',
                }}
                iconRender={visible => (visible ? <TbEye /> : <TbEyeClosed />)}
                {...props}
            />
        );
    } else if (props.type === 'number') {
        return (
            <InputNumber
                {...props}
                style={{
                    ...props.style,
                    padding: 0,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            />
        );
    } else if (props.type === 'textarea') {
        return (
            <Input.TextArea
                {...props}
                style={{
                    ...(props.style || {}),
                    paddingTop: 10,
                }}
            />
        );
    } else if (props.type === 'search') {
        return (
            <Input.Search
                {...props}
                style={{
                    ...(props.style || {}),
                }}
            />
        );
    } else if (props.type === 'group') {
        return (
            <Input.Group
                {...props}
                style={{
                    ...(props.style || {}),
                    paddingTop: 10,
                }}
            />
        );
    } else if (props.type === 'text') {
        return (
            <Input
                classNames={{
                    input: 'rounded-none h-11 shadow-none',
                }}
                {...props}
            />
        );
    } else {
        return (
            <Input
                classNames={{
                    ...(props.classNames || {}),
                    input: 'bg-gray-50',
                }}
                {...props}
            />
        );
    }
});

export const EducareInputUi = ({ label, required, name, helperText, className, ...rest }: TEducareInputUi) => {
    const ref = React.useRef<HTMLElement>();
    return (
        <div>
            {!!label && (
                <label htmlFor={name} className={styles.educareInputLabel}>
                    <span>
                        {label} {required ? <small className="text-red-800">*</small> : ''}
                    </span>
                </label>
            )}
            <EducareInputByType size="large" ref={ref} name={name} {...rest} className={classNames(styles.educareInput, className)} />
            <span className="right-0 text-red-600 bottom-50 h-4">{helperText}</span>
        </div>
    );
};

const EducareInput = ({ hookForm, name, ...rest }: TEducareInput) => {
    const {
        formState: { errors },
        control,
    } = hookForm;
    const errorMessage = funcResolveObjectDot(`${name}.message`, errors) || '';
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                return (
                    <EducareInputUi
                        value={field.value}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={name}
                        helperText={errorMessage}
                        status={errorMessage ? 'error' : ''}
                        {...rest}
                    />
                );
            }}
        />
    );
};

export default EducareInput;
