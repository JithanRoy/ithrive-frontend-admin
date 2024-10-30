import React from 'react';

import dayjs from 'dayjs';

import { getImagePathToLink } from '@library/functions';
import type { TReportManagementDetails } from '@library/schemas/report-management';

type Props = {
    apiData: TReportManagementDetails;
};

const ProfileDetails = ({ apiData }: Props) => {
    const timeAgo = dayjs(apiData ? apiData?.reportedEvent?.createdAt : '').fromNow();

    return (
        <div className="flex gap-3">
            <div>
                {apiData?.reportedEvent?.profilePic && (
                    <img className="h-20 w-20 rounded-[86px]" src={getImagePathToLink(apiData?.reportedEvent?.profilePic || '')} alt="image" />
                )}
                {apiData?.reportedEvent?.images && apiData.userReport.reportFor !== 'social-post' && (
                    <img
                        className="h-20 w-20 rounded-[86px]"
                        src={getImagePathToLink(apiData?.reportedEvent?.images[0]?.imagePath || '')}
                        alt="image"
                    />
                )}
                {(!apiData.reportedEvent.userInfo?.profilePic && apiData?.reportedEvent?.userInfo?.profilePic) ||
                    (apiData.reportedEvent.userInfo?.profilePic && !apiData?.reportedEvent?.userInfo?.profilePic && (
                        <img
                            className="h-20 w-20 rounded-[86px]"
                            src={getImagePathToLink(apiData?.reportedEvent?.userInfo.profilePic || '')}
                            alt="image"
                        />
                    ))}
            </div>

            <div>
                <div className="text-xl font-semibold">
                    {apiData?.reportedEvent.name && <p className="text-2xl font-bold">{apiData?.reportedEvent?.name}</p>}
                    {apiData?.reportedEvent.userInfo?.name && <p className="text-2xl font-bold">{apiData?.reportedEvent?.userInfo.name}</p>}
                </div>
                <div className="flex text-[#BBC3CB] gap-2 items-center">
                    <span className="">{apiData?.reportedEvent?.organizationUserType}</span>
                    <span className="h-2 w-2 rounded-full bg-gray-600"></span>
                    <span>{timeAgo}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetails;
