import { Modal } from 'antd';

import dayjs from 'dayjs';

import type { TInquiryData } from '@library/schemas/inquiries';

type InquiriesDetailsProps = {
    selectedRecord: TInquiryData;
    onClose: () => void;
};
const InquiriesDetails = ({ selectedRecord, onClose }: InquiriesDetailsProps) => {
    return (
        <>
            <Modal centered open={true} onOk={onClose} onCancel={onClose} width={860} footer={null}>
                <div className="divide-y-2">
                    <h1 className="text-xl pt-3 font-semibold mb-6">Inquiries</h1>
                    <div className="grid gap-2 py-2 p-2">
                        <div className="grid md:grid-cols-7 gap-36">
                            <h3 className="text-gray-500 w-96">Name:</h3>
                            <h3 className="md:col-span-6">
                                {selectedRecord?.firstName} {selectedRecord?.lastName}
                            </h3>
                        </div>
                        <div className="grid md:grid-cols-7 gap-36">
                            <h3 className="text-gray-500 w-96">Title :</h3>
                            <h3 className="md:col-span-6 mr-12">
                                {selectedRecord?.scholarshipInfo?.title || selectedRecord?.homeOfficeInfo?.title || ''}
                            </h3>
                        </div>
                        <div className="grid md:grid-cols-7 gap-36">
                            <h3 className="text-gray-500 w-96">Email:</h3>
                            <h3 className="md:col-span-6">{selectedRecord?.email}</h3>
                        </div>
                        <div className="grid md:grid-cols-7 gap-36">
                            <h3 className="text-gray-500 w-96">Phone:</h3>
                            <h3 className="md:col-span-6">{selectedRecord?.mobileNumber}</h3>
                        </div>
                        <div className="grid md:grid-cols-7 gap-36">
                            <h3 className="text-gray-500 w-96">Created Date:</h3>
                            <h3 className="md:col-span-6">{dayjs(selectedRecord?.updatedAt).format('MMM D, YYYY')}</h3>
                        </div>
                        <div className="grid md:grid-cols-7 gap-36">
                            <h3 className="text-gray-500 w-96">Subject:</h3>
                            <h3 className="md:col-span-6">{selectedRecord?.subject}</h3>
                        </div>
                        <div className="grid md:grid-cols-7 gap-36">
                            <h3 className="text-gray-500 w-96">Message:</h3>
                            <h3 className="md:col-span-6 max-w-screen-sm">{selectedRecord?.message}</h3>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default InquiriesDetails;
