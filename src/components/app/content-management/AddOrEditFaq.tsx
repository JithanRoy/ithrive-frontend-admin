import React from 'react';
import { useForm } from 'react-hook-form';
import { useRequest } from 'ahooks';

import { Drawer, Form } from 'antd';

import IthriveButton from 'src/components/shared/iThrive-button';
import EducareInput from '@components/shared/educare-input';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import { zodResolver } from '@hookform/resolvers/zod';
import RequestApi from '@library/apis/request.api';
import type { AddOrEditStateFormProps, AddOrEditStateProps } from '@library/hooks';
import { useAddOrEditState, useWindowSize } from '@library/hooks';
import type { TFaqResponse, TFaqSchema } from '@library/schemas/content-management/faq';
import { FaqSchema } from '@library/schemas/content-management/faq';
import { MdOutlineClose } from '@react-icons/all-files/md/MdOutlineClose';

const FormComponent = ({ type, onClose, editStateId, onValue }: AddOrEditStateFormProps) => {
    const hookForm = useForm<TFaqSchema>({
        mode: 'onChange',
        resolver: zodResolver(FaqSchema),
        defaultValues: {
            question: '',
            answer: '',
        },
    });
    const { loading: existingFaqLoading } = useRequest(RequestApi<null, TFaqResponse>, {
        ready: type === 'update' && !!editStateId,
        defaultParams: [
            {
                method: 'GET',
                module: 'faq',
                url: editStateId,
            },
        ],
        onSuccess: data => {
            hookForm.reset({
                question: data?.payload?.question,
                answer: data?.payload?.answer,
            });
        },
    });
    const { run: onFaqCreateApi, loading: onFaqCreateLoading } = useRequest(RequestApi<TFaqSchema, TFaqResponse>, {
        manual: true,
        onSuccess: data => {
            onValue?.(data?.payload?.id);
            setTimeout(() => onClose('reload'), 50);
            EducareMessageAlert(data?.message || 'Faq added successfully');
        },
        onError: (error: any) => {
            EducareMessageAlert(error?.error?.systems || 'Add Faq failed', 'error');
        },
    });
    const { run: onUpdateFaqApi, loading: onUpdateFaqLoading } = useRequest(RequestApi<TFaqSchema, TFaqResponse>, {
        manual: true,
        onSuccess: data => {
            onValue?.(data?.payload?.id);
            setTimeout(() => onClose('reload'), 50);
            EducareMessageAlert(data?.message || 'FAQ updated successfully');
        },
        onError: (error: any) => {
            EducareMessageAlert(error?.error?.systems || 'Failed to update FAQ', 'error');
        },
    });
    const onSubmit = async (payload: TFaqSchema) => {
        if (type === 'create') {
            onFaqCreateApi({
                module: 'faq',
                method: 'POST',
                url: '',
                payload: payload,
            });
        } else {
            onUpdateFaqApi({
                method: 'PUT',
                module: 'faq',
                url: editStateId,
                payload,
            });
            return;
        }
    };
    const onCancel = (what: 'reload' | 'cancel' = 'reload') => {
        hookForm.reset();
        onClose(what);
    };
    const loading = onFaqCreateLoading || onUpdateFaqLoading || existingFaqLoading;

    return (
        <Form onFinish={hookForm.handleSubmit(onSubmit)}>
            <div className="grid gap-5 mt-5">
                <EducareInput type="text" hookForm={hookForm} required name="question" label="Question" placeholder="Question" />
                <EducareInput
                    type="textarea"
                    autoSize={{ minRows: 5 }}
                    hookForm={hookForm}
                    required
                    name="answer"
                    label="Answer"
                    placeholder="Answer"
                />
            </div>
            <div className="flex items-center justify-center gap-5 py-5">
                <IthriveButton variant="reset" htmlType="reset" disabled={loading} onClick={() => onCancel('cancel')}>
                    Cancel
                </IthriveButton>
                <IthriveButton variant="filled" loading={loading} htmlType="submit">
                    Submit
                </IthriveButton>
            </div>
        </Form>
    );
};

const AddOrEditFaqDrawer = (props: AddOrEditStateProps) => {
    const { type, isOpen, onClose, editStateId, onValue } = useAddOrEditState(props);
    const { isSm } = useWindowSize();
    return (
        <Drawer
            destroyOnClose
            forceRender
            footer={null}
            maskClosable={false}
            open={isOpen}
            width={isSm ? '95vw' : '75vw'}
            closeIcon={null}
            extra={<IthriveButton type="link" size="large" icon={<MdOutlineClose />} onClick={() => onClose('cancel')} />}
            onClose={() => onClose('cancel')}
            title={type === 'create' ? 'New FAQ' : 'Edit FAQ'}>
            {isOpen && <FormComponent type={type} editStateId={editStateId} onClose={onClose} onValue={onValue} />}
        </Drawer>
    );
};

export default AddOrEditFaqDrawer;
