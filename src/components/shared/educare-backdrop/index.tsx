import React, { type CSSProperties } from 'react';
import dynamic from 'next/dynamic';

import { PiSpinnerGapBold } from '@react-icons/all-files/pi/PiSpinnerGapBold';

import styles from './EducareBackdrop.module.scss';

const Modal = dynamic(() => import('antd').then(m => m.Modal), { ssr: false });
const Spin = dynamic(() => import('antd').then(m => m.Spin), { ssr: false });

const EducareBackdrop: React.FC<{ status: boolean; maskStyle?: CSSProperties }> = ({ status, maskStyle = {} }) => {
    if (!status) return null;
    return (
        <Modal
            destroyOnClose={true}
            wrapClassName={styles.educareModelContentTransparent}
            styles={{
                mask: { backgroundColor: 'inherit', ...maskStyle },
            }}
            transitionName=""
            maskTransitionName=""
            centered
            open={status}
            width="auto"
            footer={false}
            closable={false}>
            <Spin size="large" indicator={<PiSpinnerGapBold className="animate-spin mt-5" />} />
        </Modal>
    );
};

export default EducareBackdrop;
