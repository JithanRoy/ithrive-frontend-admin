import React from 'react';
import { Controller } from 'react-hook-form';

import { Checkbox } from 'antd';

import classNames from 'classnames';

import { funcResolveObjectDot } from '@library/functions';
import type { TEducareCheckbox } from '@library/types/shared';

const EducareCheckbox = ({ hookForm, name, activeClassName, ...props }: TEducareCheckbox) => {
    const {
        formState: { errors },
        control,
    } = hookForm;
    const errorMessage = funcResolveObjectDot(`${name}.message`, errors) || '';
    return (
        <div>
            <Controller
                control={control}
                name={name}
                render={({ field }) => {
                    props.className = classNames('text-black-500', props.className, {
                        [activeClassName as string]: !!field.value,
                    });
                    return (
                        <Checkbox onChange={field.onChange} checked={field.value} id={field.name} name={field.name} {...props}>
                            {props.children}
                        </Checkbox>
                    );
                }}
            />
            {!!errorMessage && <br />}
            {!!errorMessage && <span className="text-[12px] right-0 text-red-800 bottom-50">{errorMessage}</span>}
        </div>
    );
};

export default EducareCheckbox;
