import type { UseFormReturn } from 'react-hook-form';
import type { ReactQuillProps } from 'react-quill';

import type { CheckboxProps } from 'antd';
import type { SearchProps } from 'antd/lib/input';
import type { GroupProps } from 'antd/lib/input/Group';
import type { InputProps } from 'antd/lib/input/Input';
import type { PasswordProps } from 'antd/lib/input/Password';
import type { TextAreaProps } from 'antd/lib/input/TextArea';
import type { InputNumberProps } from 'antd/lib/input-number';
import type { SelectProps } from 'antd/lib/select';

export type TValueAndLabel<T> = {
    label: string;
    value: T;
};

export type TEducareInputBase =
    | (InputProps & { type: 'text' | 'email' | 'url' }) // add more type manually to avoid type error
    | (PasswordProps & { type: 'password' })
    | (InputNumberProps & { type: 'number' })
    | (TextAreaProps & { type: 'textarea' })
    | (SearchProps & { type: 'search' })
    | (GroupProps & { type: 'group' });

export type TEducareInput = TEducareInputBase & {
    hookForm: UseFormReturn<any, any>;
    name: string;
    label?: string;
    required?: boolean;
};

export type TEducareInputUi = TEducareInputBase & {
    helperText?: string;
    name: string;
    label?: string;
    required?: boolean;
};

export type TEducareSelect = SelectProps & {
    hookForm: UseFormReturn<any, any>;
    name: string;
    label?: string;
    required?: boolean;
};

export type TEducareSelectUi = SelectProps & {
    name: string;
    type?: 'free' | 'default';
    label?: string;
    required?: boolean;
};

export type TEducareCheckbox = CheckboxProps & {
    hookForm: UseFormReturn<any, any>;
    name: string;
    activeClassName?: string;
};

export type TEducareDatePicker = {
    hookForm: UseFormReturn<any, any>;
    placeholder?: string;
    name: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
};

export type TEducareRichEditor = ReactQuillProps & {
    hookForm: UseFormReturn<any, any>;
    name: string;
    label?: string;
    required?: boolean;
};
export interface Gradient {
    deg: number;
    name: string;
    colors: string[];
}
