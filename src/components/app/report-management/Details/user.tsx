import dayjs from 'dayjs';

import PostManagementCard from '@components/app/post-management/PostManagementCard';
import type { TReportManagementDetails } from '@library/schemas/report-management';
import { BsLinkedin } from '@react-icons/all-files/bs/BsLinkedin';
import { BsTiktok } from '@react-icons/all-files/bs/BsTiktok';
import { BsTwitterX } from '@react-icons/all-files/bs/BsTwitterX';
import { CiLocationOn } from '@react-icons/all-files/ci/CiLocationOn';
import { FaFacebookSquare } from '@react-icons/all-files/fa/FaFacebookSquare';
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram';
import { FaRegBuilding } from '@react-icons/all-files/fa/FaRegBuilding';
import { FaUniversity } from '@react-icons/all-files/fa/FaUniversity';
import { FaBookJournalWhills } from '@react-icons/all-files/fa6/FaBookJournalWhills';
import { IoCallOutline } from '@react-icons/all-files/io5/IoCallOutline';
import { MdCastForEducation } from '@react-icons/all-files/md/MdCastForEducation';
import { MdOutlineEmail } from '@react-icons/all-files/md/MdOutlineEmail';
import { TbWorldSearch } from '@react-icons/all-files/tb/TbWorldSearch';

type Props = {
    apiData: TReportManagementDetails;
};

const UserDetails = ({ apiData }: Props) => {
    const timeAgo = dayjs(apiData ? apiData?.reportedEvent?.createdAt : '').fromNow();

    return (
        <div className="space-y-10">
            {apiData.reportedEvent.detailContactNumber && (
                <PostManagementCard
                    icon={<IoCallOutline size={30} />}
                    title="Mobile number"
                    value={apiData.reportedEvent.detailContactNumber || ''}
                />
            )}
            {apiData.reportedEvent.email && (
                <PostManagementCard icon={<MdOutlineEmail size={30} />} title="Email" value={apiData.reportedEvent.email || ''} />
            )}

            {apiData.reportedEvent.userType && (
                <PostManagementCard icon={<FaRegBuilding size={30} />} title="Industry type" value={apiData.reportedEvent.userType || ''} />
            )}
            {apiData.reportedEvent.location && (
                <PostManagementCard icon={<CiLocationOn size={30} />} title="Location" value={apiData.reportedEvent.location || ''} />
            )}

            {apiData?.reportedEvent?.organisationInfo?.socialMediaLinks?.website && (
                <PostManagementCard
                    icon={<TbWorldSearch size={30} />}
                    title="Website URL"
                    value={apiData.reportedEvent.organisationInfo.socialMediaLinks.website || ''}
                />
            )}
            {apiData?.reportedEvent?.organisationInfo?.socialMediaLinks?.facebook && (
                <PostManagementCard
                    icon={<FaFacebookSquare size={30} />}
                    title="Facebook"
                    value={apiData.reportedEvent.organisationInfo.socialMediaLinks.facebook || ''}
                />
            )}
            {apiData?.reportedEvent?.organisationInfo?.socialMediaLinks?.linkedin && (
                <PostManagementCard
                    icon={<BsLinkedin size={30} />}
                    title="Linkedin"
                    value={apiData.reportedEvent.organisationInfo.socialMediaLinks.linkedin || ''}
                />
            )}
            {apiData?.reportedEvent?.organisationInfo?.socialMediaLinks?.instagram && (
                <PostManagementCard
                    icon={<FaInstagram size={30} />}
                    title="Instagram"
                    value={apiData.reportedEvent.organisationInfo.socialMediaLinks.instagram || ''}
                />
            )}
            {apiData?.reportedEvent?.organisationInfo?.socialMediaLinks?.tiktok && (
                <PostManagementCard
                    icon={<BsTiktok size={30} />}
                    title="Tiktok"
                    value={apiData.reportedEvent.organisationInfo.socialMediaLinks.tiktok || ''}
                />
            )}
            {apiData?.reportedEvent?.organisationInfo?.socialMediaLinks?.twitter && (
                <PostManagementCard
                    icon={<BsTwitterX size={30} />}
                    title="Twitter"
                    value={apiData.reportedEvent.organisationInfo.socialMediaLinks.twitter || ''}
                />
            )}
            {apiData?.reportedEvent?.profileInfo?.degreeLevel && (
                <PostManagementCard
                    icon={<MdCastForEducation size={30} />}
                    title="Degree level"
                    value={apiData.reportedEvent.profileInfo?.degreeLevel || ''}
                />
            )}
            {apiData.reportedEvent.profileInfo?.universityName && (
                <PostManagementCard
                    icon={<FaUniversity size={30} />}
                    title="University"
                    value={apiData.reportedEvent.profileInfo.universityName || ''}
                />
            )}
            {apiData?.reportedEvent?.profileInfo?.subject && (
                <PostManagementCard
                    icon={<FaBookJournalWhills size={30} />}
                    title="Subject"
                    value={apiData.reportedEvent.profileInfo.subject || ''}
                />
            )}
        </div>
    );
};

export default UserDetails;
