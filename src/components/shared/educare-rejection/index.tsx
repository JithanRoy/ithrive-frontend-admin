import React from 'react';
import { useForm } from 'react-hook-form';
import { useMemoizedFn } from 'ahooks';

import { Form, Modal } from 'antd';

import { z } from 'zod';

import IthriveButton from 'src/components/shared/iThrive-button';
import EducareCheckbox from '@components/shared/educare-checkbox';
import EducareInput from '@components/shared/educare-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApprovalStatusEnum } from '@library/enums';
import { useWindowSize } from '@library/hooks';

const RejectionReasons = {
    'Inappropriate Content': 'The post contains content that violates community guidelines or is deemed inappropriate',
    'Irrelevant Content': 'The post does not align with the purpose or them of the platform',
    'Low Quality': 'The post lacks sufficient quality in terms of clarity, relevance, or presentation',
    'Duplicate Content': 'The same or similar content has already been posted elsewhere on the platform',
    'Misleading Information': 'The post contains misleading or inaccurate information',
    'Offensive Language': 'The post includes language that is offensive, discriminatory, or derogatory',
    'Copyright Infringement': 'The post contains copyrighted material without proper permission or attribution',
    Spam: 'The post contains copyrighted material without proper permission or attribution',
    'Violation of Terms of Service': 'The post violates the terms of service or community guidelines of the platform',
    'For other any reason': 'Please specify..',
} as const;

const RejectionSchema = z.object({
    status: z.nativeEnum(ApprovalStatusEnum).default(ApprovalStatusEnum.Rejected),
    rejectedReason: z.object({}).default({}),
    otherReason: z.string().optional(),
});
type TRejectionSchema = z.infer<typeof RejectionSchema>;
export type TRejectionPayload = {
    status: number;
    rejectedReason: string[];
};
export type TStatusPayload = {
    status: number;
};

type EducareRejectionProps = {
    state: [string, React.Dispatch<React.SetStateAction<string>>];
    onReject: (details: TRejectionPayload & { relatedId: string }) => void;
};
function ReasonRejectionComponent({ state, onReject }: EducareRejectionProps) {
    const [relatedId, setRelatedId] = state;
    const hookForm = useForm<TRejectionSchema>({
        mode: 'onChange',
        resolver: zodResolver(RejectionSchema),
        defaultValues: {
            status: ApprovalStatusEnum.Rejected,
            rejectedReason: {},
            otherReason: '',
        },
    });
    const onSubmit = useMemoizedFn(() => {
        hookForm.clearErrors('otherReason');

        const rejectValues = hookForm.getValues('rejectedReason');
        const otherReason = hookForm.getValues('otherReason');
        const rejectedReason = Object.keys(rejectValues).reduce((acc, curr) => {
            // @ts-expect-error: known type error
            if (rejectValues[curr] === true) acc.push(curr);
            return acc;
        }, [] as string[]);

        const anyOtherReasonIdx = rejectedReason.indexOf('For other any reason');
        if (anyOtherReasonIdx > -1 && !otherReason) {
            hookForm.setError('otherReason', {
                message: 'Please write reason',
            });
            return;
        }

        if (anyOtherReasonIdx > -1) {
            rejectedReason.splice(anyOtherReasonIdx, 1, otherReason as string);
        }

        onReject({
            relatedId,
            status: +hookForm.getValues('status'),
            rejectedReason,
        });

        hookForm.reset();
        setRelatedId('');
    });

    return (
        <Form onFinish={onSubmit}>
            <div className="flex flex-col justify-center gap-3">
                {Object.keys(RejectionReasons).map(_key => {
                    const key = _key as keyof typeof RejectionReasons;
                    return (
                        <div key={key} className="grid gap-3">
                            <EducareCheckbox
                                hookForm={hookForm}
                                name={`rejectedReason.${key}`}
                                activeClassName="bg-primary-2"
                                className="!w-full !px-3 !py-2 border border-primary rounded-md">
                                <div className="ml-2">
                                    <h4 className="font-bold mb-0">{key}:</h4>
                                    <small>{RejectionReasons[key as keyof typeof RejectionReasons]}</small>
                                </div>
                            </EducareCheckbox>
                            {key === 'For other any reason' && hookForm.watch(`rejectedReason.${key}` as any) && (
                                <EducareInput
                                    className="!rounded-md"
                                    type="textarea"
                                    autoSize={{ minRows: 5 }}
                                    hookForm={hookForm}
                                    name="otherReason"
                                    placeholder="Please write reason"
                                />
                            )}
                        </div>
                    );
                })}
                <div className="grid grid-cols-2 items-center justify-around md:gap-10 gap-2 md:px-20 px-2 my-5">
                    <IthriveButton size="large" variant="reset" htmlType="reset" onClick={() => setRelatedId('')}>
                        Cancel
                    </IthriveButton>
                    <IthriveButton size="large" variant="filled" htmlType="submit">
                        Send
                    </IthriveButton>
                </div>
            </div>
        </Form>
    );
}

export default function EducareRejectionModal({ state, onReject }: EducareRejectionProps) {
    const { isSm } = useWindowSize();
    const [relatedId, setRelatedId] = state;
    return (
        <Modal
            destroyOnClose
            centered
            forceRender
            footer={null}
            maskClosable={false}
            open={!!relatedId}
            width={isSm ? '95vw' : '40vw'}
            classNames={{
                body: '!h-[90vh] overflow-y-auto',
            }}
            onCancel={() => setRelatedId('')}
            title={
                <div className="grid gap-1">
                    <span>Reason for removal</span>
                    <small className="font-normal">Select a reason below to explain why this can not be approved</small>
                </div>
            }>
            {!!relatedId && <ReasonRejectionComponent state={state} onReject={onReject} />}
        </Modal>
    );
}
