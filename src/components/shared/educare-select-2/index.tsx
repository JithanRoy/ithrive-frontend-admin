import React, { useState } from 'react';

import { Button, Popover, Spin } from 'antd';

import classNames from 'classnames';

import { CloseCircleOutlined, DeleteOutlined, EyeInvisibleOutlined, EyeOutlined, PauseOutlined, UndoOutlined } from '@ant-design/icons';
import { CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { AiOutlineArrowDown } from '@react-icons/all-files/ai/AiOutlineArrowDown';
import { IoMdArrowDropdown } from '@react-icons/all-files/io/IoMdArrowDropdown';

import styles from './EducareSelectTwo.module.scss';

interface Option {
    value: string;
    label: React.ReactNode;
}

interface TEducareSelectUiTwo {
    name: string;
    required?: boolean;
    label?: string;
    className?: string;
    options: Array<Option>;
    type?: 'free' | 'default';
    loading?: boolean;
    value?: string;
    showSearch?: boolean;
    onSelect?: (value: string) => void;
    [key: string]: any;
}
const getLabelByValue = (value: string) => {
    switch (value) {
        case 'Pending':
            return (
                <div className="text-blue-500">
                    <PauseOutlined /> Pending
                </div>
            );
        case 'Verified':
            return (
                <div className="text-green-500">
                    <CheckCircleOutlined /> Verified
                </div>
            );
        case 'Active':
            return (
                <div className="text-green-500">
                    <CheckCircleOutlined /> Active
                </div>
            );
        case 'Completed':
            return (
                <div className="text-green-500">
                    <CheckCircleOutlined /> Completed
                </div>
            );
        case 'Inactive':
            return (
                <div className="text-red-500">
                    <MinusCircleOutlined /> Inactive
                </div>
            );
        case 'Rejected':
            return (
                <div className="text-red-500">
                    <MinusCircleOutlined /> Remove
                </div>
            );
        case 'Under review':
            return (
                <div className="text-orange-500">
                    <UndoOutlined /> Under review
                </div>
            );
        case 'Ignored':
            return (
                <div className="text-pink-700">
                    <EyeInvisibleOutlined /> Ignored
                </div>
            );
        case 'Resolved':
            return (
                <div className="text-green-500">
                    <CheckCircleOutlined /> Resolved
                </div>
            );
        case 'Suspended user':
            return (
                <div className="text-red-900">
                    <CloseCircleOutlined /> Suspended user
                </div>
            );
        case 'Deleted user':
            return (
                <div className="text-red-500">
                    <DeleteOutlined /> Deleted user
                </div>
            );
        default:
            return 'Select';
    }
};

export const EduCareSelectUiTwo: React.FC<TEducareSelectUiTwo> = ({
    name,
    required,
    label,
    className,
    options,
    type,
    loading,
    value,
    showSearch,
    onSelect,
    ...rest
}) => {
    const [visible, setVisible] = useState(false);
    const handleSelect = (value: string) => {
        if (onSelect) {
            onSelect(value);
        }
        setVisible(false);
    };

    const content = (
        <div className={styles.optionList} style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {options?.map((option, index) => (
                <div key={index} className={styles.optionItem} onClick={() => handleSelect(option.value)}>
                    {option.label}
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-fit">
            {!!label && (
                <label htmlFor={name} className={styles.educareSelectLabel}>
                    <span>
                        {label} {required ? <small className="text-red-800">*</small> : ''}
                    </span>
                </label>
            )}
            <Popover content={content} trigger="click" visible={visible} onVisibleChange={visible => setVisible(visible)}>
                <Button
                    className={classNames(
                        { [styles.educareSelectFree]: type === 'free', [styles.educareSelect]: !type },
                        styles.educareSelect,
                        className,
                        'w-fit',
                    )}
                    {...rest}>
                    <div className="flex gap-2 items-center justify-between">
                        {loading ? <Spin /> : getLabelByValue(value as string) || ''}
                        <IoMdArrowDropdown />
                    </div>
                </Button>
            </Popover>
        </div>
    );
};

export const EduCareButtonForRemoval: React.FC<TEducareSelectUiTwo> = ({
    name,
    required,
    label,
    className,
    options,
    type,
    loading,
    value,
    showSearch,
    onSelect,
    ...rest
}) => {
    const [visible, setVisible] = useState(false);
    const handleSelect = (value: string) => {
        if (onSelect) {
            onSelect(value);
        }
        setVisible(false);
    };

    const content = (
        <div className={styles.optionList}>
            {options?.map((option, index) => (
                <div key={index} className={styles.optionItem} onClick={() => handleSelect(option.value)}>
                    {option.label}
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-fit">
            {!!label && (
                <label htmlFor={name} className={styles.educareSelectLabel}>
                    <span>
                        {label} {required ? <small className="text-red-800">*</small> : ''}
                    </span>
                </label>
            )}
            <Popover content={content} trigger="click" visible={visible} onVisibleChange={visible => setVisible(visible)}>
                <Button
                    className={classNames(
                        { [styles.educareSelectFree]: type === 'free', [styles.educareSelect]: !type },
                        styles.educareSelect,
                        className,
                        'w-fit',
                    )}
                    {...rest}>
                    <div className="flex gap-2 items-center justify-between">
                        {loading ? <Spin /> : getLabelByValue(value as string) || ''}
                        <IoMdArrowDropdown />
                    </div>
                </Button>
            </Popover>
        </div>
    );
};
