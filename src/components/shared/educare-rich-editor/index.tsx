import React from 'react';
import dynamic from 'next/dynamic';
import { Controller } from 'react-hook-form';

import { funcResolveObjectDot } from '@library/functions';
import type { TEducareRichEditor } from '@library/types/shared';

import 'react-quill/dist/quill.snow.css';
import styles from './Editor.module.scss';

const ReactQuill: any = dynamic(() => import('react-quill'), { ssr: false });

const EducareRichEditor = ({ hookForm, name, label, required, ...rest }: TEducareRichEditor) => {
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
                    <div>
                        {!!label && (
                            <label htmlFor={name} className={styles.educareInputLabel}>
                                <span>
                                    {label} {required ? <small className="text-red-800">*</small> : ''}
                                </span>
                            </label>
                        )}
                        <div id="quillContainer">
                            <ReactQuill
                                theme="snow"
                                bounds={'#quillContainer'}
                                {...rest}
                                value={field.value || ''}
                                onChange={field.onChange}
                                id={name}
                            />
                        </div>
                        <span className="right-0 text-red-600 bottom-50 h-4">{errorMessage}</span>
                    </div>
                );
            }}
        />
    );
};

export default EducareRichEditor;
