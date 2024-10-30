import React from 'react';

import { ReportReason } from '@library/enums';
import { funcFormatDate } from '@library/functions';
import type { TReportManagementDetails } from '@library/schemas/report-management';
import { FaArrowCircleRight } from '@react-icons/all-files/fa/FaArrowCircleRight';
import { FaBook } from '@react-icons/all-files/fa/FaBook';
import { FaHeadSideVirus } from '@react-icons/all-files/fa/FaHeadSideVirus';
import { FaOrcid } from '@react-icons/all-files/fa/FaOrcid';
import { FaUser } from '@react-icons/all-files/fa/FaUser';
import { FaUsers } from '@react-icons/all-files/fa/FaUsers';
import { ImStack } from '@react-icons/all-files/im/ImStack';
import { MdDateRange } from '@react-icons/all-files/md/MdDateRange';
type Props = {
    apiData: TReportManagementDetails;
};
const ReportReasons = ({ apiData }: Props) => {
    const getReasonDescription = (x: any) => {
        return ReportReason[x as keyof typeof ReportReason] ?? '';
    };
    return (
        <div>
            <div className="mt-2 flex gap-4 items-center">
                <div className="p-2  bg-white border border-gray-200 rounded-md">
                    <FaOrcid size={30} />
                </div>
                <div className="mt-2">
                    <h1 className="text-lg font-semibold">ID</h1>
                    <p># {apiData.userReport.ticketNumber}</p>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <div className="p-2  bg-white border border-gray-200 rounded-md">
                    <MdDateRange size={30} />
                </div>
                <div className="mt-2">
                    <h1 className="text-lg font-semibold">Report date</h1>
                    <p>{funcFormatDate(apiData.userReport.createdAt)}</p>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <div className="p-2  bg-white border border-gray-200 rounded-md">
                    <ImStack size={30} />
                </div>
                <div className="mt-2">
                    <h1 className="text-lg font-semibold">Category</h1>
                    <p>{apiData.userReport.reportFor}</p>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <div className="p-2  bg-white border border-gray-200 rounded-md">
                    <FaBook size={30} />
                </div>
                <div className="mt-2">
                    <h1 className="text-lg font-semibold">Content/User</h1>
                    <p>{['student', 'organization'].includes(apiData.userReport.reportFor) ? 'User' : 'Content'}</p>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <div className="p-2  bg-white border border-gray-200 rounded-md">
                    <MdDateRange size={30} />
                </div>
                <div className="mt-2">
                    <h1 className="text-lg font-semibold">Action date</h1>
                    <p>{funcFormatDate(apiData.userReport.updatedAt)}</p>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <div className="p-2 bg-white border border-gray-200 rounded-md">
                    <FaHeadSideVirus size={30} />
                </div>
                <div className="mt-2">
                    <h1 className="text-lg font-semibold">Reason(s)</h1>
                    <div>
                        {apiData?.userReport?.reasonForReport.map((reason, index) => {
                            if (!reason)
                                return apiData.userReport.reasonForReport.length === 1 ? (
                                    <>
                                        <p>No reasons found</p>
                                    </>
                                ) : null;

                            const desc = getReasonDescription(reason);
                            return (
                                <div className="space-y-2 flex gap-4 mb-2" key={index}>
                                    <div className="text-primary mt-2">
                                        <FaArrowCircleRight />
                                    </div>
                                    <div className="font-extrabold">
                                        {!!desc ? reason : 'Others'}
                                        <span className="font-medium">
                                            <br /> {!!desc ? desc : reason}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <div className="p-2  bg-white border border-gray-200 rounded-md">
                    <FaUser size={30} />
                </div>
                <div className="mt-4">
                    <h1 className="text-lg font-semibold">Reported by</h1>
                    <p className="text-base font-medium text-primary">
                        {apiData?.reportedBy?.name ? apiData.reportedBy.name : 'User blocked or Deleted'}
                    </p>
                </div>
            </div>
            {Array.isArray(apiData?.reportedByOthers) && apiData.reportedByOthers.length > 0 ? (
                <div className="flex gap-4 items-center">
                    <div className="p-2 bg-white border border-gray-200 rounded-md">
                        <FaUsers size={30} />
                    </div>
                    <div className="mt-2">
                        <h1 className="text-lg font-semibold">Also reported by</h1>
                        <p className="text-base font-medium text-primary">{apiData.reportedByOthers.join(', ')}</p>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ReportReasons;
