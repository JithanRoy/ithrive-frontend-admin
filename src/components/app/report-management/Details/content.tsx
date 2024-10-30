import React from 'react';

import dayjs from 'dayjs';

import PostManagementCard from '@components/app/post-management/PostManagementCard';
import { funcFormatDate } from '@library/functions';
import type { TReportManagementDetails } from '@library/schemas/report-management';
import { AiOutlineBank } from '@react-icons/all-files/ai/AiOutlineBank';
import { AiOutlineCalendar } from '@react-icons/all-files/ai/AiOutlineCalendar';
import { AiOutlineClockCircle } from '@react-icons/all-files/ai/AiOutlineClockCircle';
import { BiSolidOffer } from '@react-icons/all-files/bi/BiSolidOffer';
import { CiLocationArrow1 } from '@react-icons/all-files/ci/CiLocationArrow1';
import { FaFigma } from '@react-icons/all-files/fa/FaFigma';
import { FaFileContract } from '@react-icons/all-files/fa/FaFileContract';
import { FaLink } from '@react-icons/all-files/fa/FaLink';
import { FaRegBuilding } from '@react-icons/all-files/fa/FaRegBuilding';
import { FaSitemap } from '@react-icons/all-files/fa/FaSitemap';
import { FaSmoking } from '@react-icons/all-files/fa/FaSmoking';
import { FaUserGraduate } from '@react-icons/all-files/fa/FaUserGraduate';
import { GiEntryDoor } from '@react-icons/all-files/gi/GiEntryDoor';
import { GoTasklist } from '@react-icons/all-files/go/GoTasklist';
import { GrMapLocation } from '@react-icons/all-files/gr/GrMapLocation';
import { GrUserExpert } from '@react-icons/all-files/gr/GrUserExpert';
import { HiOutlineCog } from '@react-icons/all-files/hi/HiOutlineCog';
import { IoIosTime } from '@react-icons/all-files/io/IoIosTime';
import { IoMdBook } from '@react-icons/all-files/io/IoMdBook';
import { IoBedOutline } from '@react-icons/all-files/io5/IoBedOutline';
import { IoPeopleSharp } from '@react-icons/all-files/io5/IoPeopleSharp';
import { LuBath } from '@react-icons/all-files/lu/LuBath';
import { LuNetwork } from '@react-icons/all-files/lu/LuNetwork';
import { LuUserSquare } from '@react-icons/all-files/lu/LuUserSquare';
import { MdAccessTime } from '@react-icons/all-files/md/MdAccessTime';
import { MdOutlineAutorenew } from '@react-icons/all-files/md/MdOutlineAutorenew';
import { MdOutlineWorkspaces } from '@react-icons/all-files/md/MdOutlineWorkspaces';
import { MdTableRestaurant } from '@react-icons/all-files/md/MdTableRestaurant';
import { RiTimerFlashLine } from '@react-icons/all-files/ri/RiTimerFlashLine';
import { TbBuildingWarehouse } from '@react-icons/all-files/tb/TbBuildingWarehouse';
import { TbTruckDelivery } from '@react-icons/all-files/tb/TbTruckDelivery';

type Props = {
    apiData: TReportManagementDetails;
};

const ContentDetails = ({ apiData }: Props) => {
    const timeAgo = dayjs(apiData ? apiData?.reportedEvent?.createdAt : '').fromNow();

    return (
        <div className="mt-8 grid grid-cols-2 gap-y-8 gap-x-4">
            {apiData.reportedEvent.eventType && (
                <PostManagementCard
                    icon={<AiOutlineCalendar className="text-2xl" />}
                    title="Event Type"
                    value={apiData?.reportedEvent.eventType || ''}
                />
            )}
            {apiData.reportedEvent.shift && (
                <PostManagementCard icon={<MdAccessTime className="text-2xl" />} title="Time" value={apiData?.reportedEvent.shift || ''} />
            )}
            {apiData.reportedEvent.spot && (
                <PostManagementCard icon={<CiLocationArrow1 className="text-2xl" />} title="Spot" value={apiData?.reportedEvent.spot || ''} />
            )}
            {apiData.reportedEvent.duration && (
                <PostManagementCard icon={<RiTimerFlashLine className="text-2xl" />} title="Duration" value={apiData?.reportedEvent.duration || ''} />
            )}
            {apiData.reportedEvent.externalLink && (
                <PostManagementCard icon={<FaLink className="text-2xl" />} title="Apply link" value={apiData?.reportedEvent.externalLink || ''} />
            )}
            {apiData.reportedEvent.availabilityDate && (
                <PostManagementCard
                    icon={<AiOutlineCalendar className="text-2xl" />}
                    title="Availability date"
                    value={funcFormatDate(apiData?.reportedEvent.availabilityDate ? apiData?.reportedEvent.availabilityDate : '')}
                />
            )}
            {apiData.reportedEvent.bedrooms && (
                <PostManagementCard icon={<IoBedOutline className="text-2xl" />} title="Bedrooms" value={apiData?.reportedEvent.bedrooms || ''} />
            )}
            {apiData.reportedEvent.bathrooms && (
                <PostManagementCard icon={<LuBath className="text-2xl" />} title="Bathrooms" value={apiData?.reportedEvent.bathrooms || ''} />
            )}
            {apiData.reportedEvent.leaseLength && (
                <PostManagementCard
                    icon={<FaFileContract className="text-2xl" />}
                    title="Lease length"
                    value={apiData?.reportedEvent.leaseLength || ''}
                />
            )}
            {apiData.reportedEvent.accommodation && (
                <PostManagementCard
                    icon={<GiEntryDoor className="text-2xl" />}
                    title="Accommodation"
                    value={apiData?.reportedEvent.accommodation || ''}
                />
            )}
            {apiData.reportedEvent.userInfo?.userType && apiData.userReport.reportFor === 'housing-accommodation' && (
                <PostManagementCard
                    icon={<AiOutlineBank className="text-2xl" />}
                    title="Landlord type"
                    value={apiData?.reportedEvent.userInfo?.userType || ''}
                />
            )}

            {apiData.reportedEvent.smokingPolicies && (
                <PostManagementCard
                    icon={<FaSmoking className="text-2xl" />}
                    title="Smoking policy"
                    value={apiData?.reportedEvent.smokingPolicies || ''}
                />
            )}
            {apiData.reportedEvent.furnishing && (
                <PostManagementCard
                    icon={<TbBuildingWarehouse className="text-2xl" />}
                    title="Furnishing"
                    value={apiData?.reportedEvent.furnishing || ''}
                />
            )}
            {apiData.reportedEvent.itemType && (
                <PostManagementCard icon={<FaSitemap className="text-2xl" />} title="Item type" value={apiData.reportedEvent.itemType || ''} />
            )}
            {apiData.reportedEvent.condition && (
                <PostManagementCard
                    icon={<MdOutlineWorkspaces className="text-2xl" />}
                    title="Condition"
                    value={apiData.reportedEvent.condition || ''}
                />
            )}
            {apiData.reportedEvent.userInfo?.userType && apiData.userReport.reportFor === 'marketplace' && (
                <PostManagementCard
                    icon={<LuUserSquare className="text-2xl" />}
                    title="Seller type"
                    value={apiData.reportedEvent.userInfo?.userType || ''}
                />
            )}
            {apiData.reportedEvent.deliveryOption && (
                <PostManagementCard
                    icon={<TbTruckDelivery className="text-2xl" />}
                    title="Delivery options"
                    value={apiData.reportedEvent.deliveryOption || ''}
                />
            )}
            {apiData.reportedEvent.createdAt && apiData.userReport.reportFor === 'marketplace' && (
                <PostManagementCard
                    icon={<AiOutlineCalendar className="text-2xl" />}
                    title="Listing date"
                    value={funcFormatDate(apiData.reportedEvent.createdAt ? apiData.reportedEvent.createdAt : '')}
                />
            )}

            {apiData.reportedEvent.offers && (
                <PostManagementCard icon={<BiSolidOffer className="text-2xl" />} title="Offers" value={apiData.reportedEvent.offers || ''} />
            )}
            {apiData.reportedEvent.scholarshipType && apiData.userReport.reportFor === 'scholarship' && (
                <PostManagementCard
                    icon={<FaUserGraduate className="text-2xl" />}
                    title="Scholarship Type"
                    value={apiData?.reportedEvent.scholarshipType || ''}
                />
            )}
            {apiData.reportedEvent.fieldOfStudy && apiData.userReport.reportFor === 'scholarship' && (
                <PostManagementCard
                    icon={<MdTableRestaurant className="text-2xl" />}
                    title="Field of Study"
                    value={apiData.reportedEvent.fieldOfStudy || ''}
                />
            )}
            {apiData.reportedEvent.educationLevel && apiData.userReport.reportFor === 'scholarship' && (
                <PostManagementCard
                    icon={<IoMdBook className="text-2xl" />}
                    title="Education Level"
                    value={apiData.reportedEvent.educationLevel || ''}
                />
            )}
            {apiData.reportedEvent.deadline && apiData.userReport.reportFor === 'scholarship' && (
                <PostManagementCard
                    icon={<AiOutlineClockCircle className="text-2xl" />}
                    title="Deadline"
                    value={funcFormatDate(apiData.reportedEvent.deadline ? apiData.reportedEvent.deadline : '')}
                />
            )}
            {apiData.reportedEvent.eligible && apiData.userReport.reportFor === 'scholarship' && (
                <PostManagementCard icon={<GrMapLocation className="text-2xl" />} title="Eligibility" value={apiData.reportedEvent.eligible || ''} />
            )}
            {apiData.reportedEvent.sponsorType && apiData.userReport.reportFor === 'scholarship' && (
                <PostManagementCard icon={<FaFigma className="text-2xl" />} title="Sponsor Type" value={apiData.reportedEvent.sponsorType || ''} />
            )}
            {apiData.reportedEvent.renewability && apiData.userReport.reportFor === 'scholarship' && (
                <PostManagementCard
                    icon={<MdOutlineAutorenew className="text-2xl" />}
                    title="Renewability"
                    value={apiData.reportedEvent.renewability || ''}
                />
            )}
            {apiData.reportedEvent.jobType && apiData.userReport.reportFor === 'job' && (
                <PostManagementCard icon={<GoTasklist className="text-2xl" />} title="Job type" value={apiData?.reportedEvent.jobType[0] || ''} />
            )}
            {apiData.reportedEvent.industry && apiData.userReport.reportFor === 'job' && (
                <PostManagementCard icon={<FaRegBuilding className="text-2xl" />} title="Industry" value={apiData.reportedEvent.industry || ''} />
            )}
            {apiData.reportedEvent.workArrangement && apiData.userReport.reportFor === 'job' && (
                <PostManagementCard
                    icon={<LuNetwork className="text-2xl" />}
                    title="Work Arrangement"
                    value={apiData?.reportedEvent.workArrangement[0] || ''}
                />
            )}
            {apiData.reportedEvent.experienceLevel && apiData.userReport.reportFor === 'job' && (
                <PostManagementCard
                    icon={<GrUserExpert className="text-2xl" />}
                    title="Experience level"
                    value={apiData.reportedEvent.experienceLevel[0] || ''}
                />
            )}
            {apiData.reportedEvent.duration && apiData.userReport.reportFor === 'job' && (
                <PostManagementCard icon={<IoIosTime className="text-2xl" />} title="Duration" value={apiData?.reportedEvent.duration || 'Student'} />
            )}
            {apiData.reportedEvent.workAuthorization && apiData.userReport.reportFor === 'job' && (
                <PostManagementCard
                    icon={<HiOutlineCog className="text-2xl" />}
                    title="Authorisation"
                    value={apiData.reportedEvent.workAuthorization || ''}
                />
            )}
            {apiData.reportedEvent.vacancy && apiData.reportedEvent.vacancy !== null && apiData.userReport.reportFor === 'job' && (
                <PostManagementCard icon={<IoPeopleSharp className="text-2xl" />} title="Vacancy" value={apiData?.reportedEvent.vacancy || ''} />
            )}
            {apiData.reportedEvent.applicationDeadline && apiData.userReport.reportFor === 'job' && (
                <PostManagementCard
                    icon={<FaLink className="text-2xl" />}
                    title="Deadline"
                    value={apiData?.reportedEvent.applicationDeadline || ''}
                />
            )}
        </div>
    );
};

export default ContentDetails;
