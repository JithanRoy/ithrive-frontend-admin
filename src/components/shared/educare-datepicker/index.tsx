import React from 'react';
import { Controller } from 'react-hook-form';

import { DatePicker } from 'antd';

import classNames from 'classnames';
import dayjs from 'dayjs';

import { funcResolveObjectDot } from '@library/functions';
import type { TEducareDatePicker } from '@library/types/shared';

const EducareDatePicker = ({ hookForm, label, placeholder, name, required, disabled }: TEducareDatePicker) => {
    const {
        formState: { errors },
        setValue,
        control,
    } = hookForm;
    const errorMessage = funcResolveObjectDot(`${name}.message`, errors) || '';

    return (
        <div className="mb-5">
            {!!label && (
                <label htmlFor={name} className="block mb-3 text-sm font-medium text-black">
                    {!!required ? (
                        <p className="p-0 m-0 ml-3">
                            {label}: <span className="text-red-800">*</span>
                        </p>
                    ) : (
                        label
                    )}
                </label>
            )}
            <Controller
                control={control}
                name={name}
                render={p => (
                    <DatePicker
                        disabled={disabled}
                        value={p.field.value ? dayjs(p.field.value) : null}
                        placeholder={placeholder}
                        allowClear={!required}
                        onChange={e => setValue(name, e || '', { shouldValidate: true })}
                        className={classNames('w-full h-14 pt-1 px-4 m-0 border rounded-none border-[1px] bg-clip-padding outline-0 shadow-none', {
                            'border-black': !errorMessage,
                            'border-red': !!errorMessage,
                        })}
                    />
                )}
            />
            {!!errorMessage && <span className="right-0 text-red-800 bottom-50"> {errorMessage} </span>}
        </div>
    );
};

export default EducareDatePicker;
