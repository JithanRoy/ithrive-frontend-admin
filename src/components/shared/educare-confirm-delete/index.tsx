import React from 'react';
import { useMemoizedFn } from 'ahooks';

import { Divider, Modal } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import EducareButton from '@components/shared/educare-button';
import { useWindowSize } from '@library/hooks';

type EducareConfirmDeleteProps = {
    title: string;
    subtitle: string;
    loading?: boolean;
    onDelete: () => any;
    children?: React.ReactNode;
};

const EducareConfirmDelete = (props: EducareConfirmDeleteProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { isSm } = useWindowSize();
    const onClose = useMemoizedFn(() => setIsOpen(false));
    return (
        <>
            <Modal
                centered
                destroyOnClose
                forceRender
                footer={null}
                maskClosable={false}
                closeIcon={null}
                open={isOpen}
                width={isSm ? '95vw' : '35vw'}
                onCancel={onClose}>
                <div className="grid place-items-center my-5 gap-2 p-5">
                    <DeleteOutlined className="text-white text-xl bg-red-500 p-4 rounded-full" />
                    <h2 className="font-bold">{props.title}</h2>
                    <h4>{props.subtitle}</h4>
                    <Divider />
                    <div className="flex justify-center gap-5">
                        <EducareButton variant="bordered" onClick={onClose} disabled={props.loading}>
                            Cancel
                        </EducareButton>
                        <EducareButton
                            variant="filled"
                            loading={props.loading}
                            onClick={() => {
                                props.onDelete();
                                onClose();
                            }}>
                            Delete
                        </EducareButton>
                    </div>
                </div>
            </Modal>
            {!!props.children && React.cloneElement(props.children as React.ReactElement, { onClick: () => setIsOpen(true) })}
        </>
    );
};

export default EducareConfirmDelete;
