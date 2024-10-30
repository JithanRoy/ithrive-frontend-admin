import React from 'react';
import { Controller } from 'react-hook-form';

import { Select } from 'antd';

import classNames from 'classnames';

import { funcResolveObjectDot } from '@library/functions';
import type { TEducareSelect, TEducareSelectUi } from '@library/types/shared';

import styles from './EducareSelect.module.scss';

export const EduCareSelectUi = ({ name, required, label, className, options, type, ...rest }: TEducareSelectUi) => {
    return (
        <div>
            {!!label && (
                <label htmlFor={name} className={styles.educareSelectLabel}>
                    <span>
                        {label} {required ? <small className="text-red-800">*</small> : ''}
                    </span>
                </label>
            )}
            <Select
                className={classNames(
                    { [styles.educareSelectFree]: type === 'free', [styles.educareSelect]: !type },
                    styles.educareSelect,
                    className,
                )}
                showSearch={true}
                filterOption={(input, option) =>
                    (option?.children || '')
                        .toString()
                        .toLowerCase()
                        .indexOf((input || '').toLowerCase()) >= 0
                }
                {...rest}>
                {options?.map((sv, index) => {
                    if (typeof sv === 'string') {
                        return (
                            <Select.Option key={index} value={sv}>
                                {sv}
                            </Select.Option>
                        );
                    } else {
                        return (
                            <Select.Option key={index} value={sv.value}>
                                {sv.label}
                            </Select.Option>
                        );
                    }
                })}
            </Select>
        </div>
    );
};

const EducareSelect = (props: TEducareSelect) => {
    const { hookForm, name, ...restProps } = props;
    const {
        formState: { errors },
        setValue,
        control,
    } = hookForm;
    const errorMessage = funcResolveObjectDot(`${name}.message`, errors) || '';

    return (
        <div>
            <Controller
                control={control}
                name={name}
                render={props => (
                    <EduCareSelectUi
                        {...restProps}
                        name={name}
                        value={props.field.value}
                        onChange={e => setValue(name, e, { shouldValidate: true })}
                    />
                )}
            />
            <span className="right-0 text-red-600 bottom-50 h-4">{errorMessage}</span>
        </div>
    );
};

export default EducareSelect;
