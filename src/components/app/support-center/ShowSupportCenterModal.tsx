import React from 'react';

import { Modal } from 'antd';

import { funcFormatDateAgo } from '@library/functions';
import { useWindowSize } from '@library/hooks';
import type { TSupperCenterResponse } from '@library/schemas/support-center';

type ShowSupperCenterModalProps = {
    state: [TSupperCenterResponse | null, React.Dispatch<React.SetStateAction<TSupperCenterResponse | null>>];
};

const FormComponent = ({ state }: ShowSupperCenterModalProps) => {
    return (
        <div className="grid gap-2 py-5">
            <div className="grid md:grid-cols-7 gap-2">
                <h3 className="text-gray-500">Name:</h3>
                <h3 className="md:col-span-6">{`${state[0]?.firstName || ''} ${state[0]?.lastName || ''}`}</h3>
            </div>
            <div className="grid md:grid-cols-7 gap-2">
                <h3 className="text-gray-500">Email:</h3>
                <h3 className="md:col-span-6">{`${state[0]?.email || ''}`}</h3>
            </div>
            <div className="grid md:grid-cols-7 gap-2">
                <h3 className="text-gray-500">Phone:</h3>
                <h3 className="md:col-span-6">{`${state[0]?.mobileNumber || ''}`}</h3>
            </div>
            <div className="grid md:grid-cols-7 gap-2">
                <h3 className="text-gray-500">Create Date:</h3>
                <h3 className="md:col-span-6">{funcFormatDateAgo(state[0]?.createdAt as Date, 24, 'MMM DD, YYYY hh:mm:s A')}</h3>
            </div>
            <div className="grid md:grid-cols-7 gap-2">
                <h3 className="text-gray-500">Subject:</h3>
                <h3 className="md:col-span-6">{`${state[0]?.subject || ''}`}</h3>
            </div>
            <div className="grid md:grid-cols-7 gap-2">
                <h3 className="text-gray-500">Message:</h3>
                <h3 className="md:col-span-6">{`${state[0]?.message || ''}`}</h3>
            </div>
        </div>
    );
};

const ShowSupperCenterModal = ({ state }: ShowSupperCenterModalProps) => {
    const { isSm } = useWindowSize();
    return (
        <Modal
            destroyOnClose
            centered
            forceRender
            footer={null}
            maskClosable={false}
            open={!!state[0]}
            width={isSm ? '95vw' : '75vw'}
            onCancel={() => state[1](null)}
            title="Support Message">
            {!!state[0] && <FormComponent state={state} />}
        </Modal>
    );
};

export default ShowSupperCenterModal;
