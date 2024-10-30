import React from 'react';
import { useRouter } from 'next/router';
import ImageGallery from 'react-image-gallery';
import { useDeepCompareEffect, useRequest, useSafeState } from 'ahooks';

import dayjs from 'dayjs';

import { CheckCircleOutlined, MinusCircleOutlined, PauseOutlined } from '@ant-design/icons';
import EducareButton from '@components/shared/educare-button';
import EducareEmptyData from '@components/shared/educare-empty';
import RequestApi from '@library/apis/request.api';
import { ApprovalStatusEnum, PermissionActionsEnum, PermissionModulesEnum } from '@library/enums';
import { funcEnumKeyByValue, funcFormatDate, getImagePathToLink } from '@library/functions';
import type { AccommodationData } from '@library/schemas/post-management';
import { AiOutlineBank } from '@react-icons/all-files/ai/AiOutlineBank';
import { AiOutlineCalendar } from '@react-icons/all-files/ai/AiOutlineCalendar';
import { CgGym } from '@react-icons/all-files/cg/CgGym';
import { CiLocationOn } from '@react-icons/all-files/ci/CiLocationOn';
import { FaFileContract } from '@react-icons/all-files/fa/FaFileContract';
import { FaSmoking } from '@react-icons/all-files/fa/FaSmoking';
import { FaWifi } from '@react-icons/all-files/fa/FaWifi';
import { GiCarWheel } from '@react-icons/all-files/gi/GiCarWheel';
import { GiEntryDoor } from '@react-icons/all-files/gi/GiEntryDoor';
import { GiTap } from '@react-icons/all-files/gi/GiTap';
import { IoMdArrowBack } from '@react-icons/all-files/io/IoMdArrowBack';
import { IoBedOutline } from '@react-icons/all-files/io5/IoBedOutline';
import { LuBath } from '@react-icons/all-files/lu/LuBath';
import { PiGasCan } from '@react-icons/all-files/pi/PiGasCan';
import { TbBuildingWarehouse } from '@react-icons/all-files/tb/TbBuildingWarehouse';
import { TbHanger2 } from '@react-icons/all-files/tb/TbHanger2';
import { TbWindElectricity } from '@react-icons/all-files/tb/TbWindElectricity';

import EducareBackdrop from '../../../shared/educare-backdrop';
import EducareImage from '../../../shared/educare-image';
import EducareMessageAlert from '../../../shared/educare-message-alert';
import EduCarePermissionWrapper from '../../../shared/educare-permission-wrapper';
import type { TRejectionPayload } from '../../../shared/educare-rejection';
import EducareRejectionModal from '../../../shared/educare-rejection';
import { EduCareSelectUiTwo } from '../../../shared/educare-select-2';
import PostManagementCard from '../PostManagementCard';

const DetailsHouseAndAccommodationComponent = () => {
    const router = useRouter();
    const showHouseAccommodationRejectionState = useSafeState<string>('');
    const id = router.query.id;

    const { data: apiData, run: getData, loading: apiLoading, refresh: apiRefresh } = useRequest(RequestApi<any, AccommodationData>);
    useDeepCompareEffect(() => {
        getData({ version: 'v1', method: 'GET', module: 'housing-accommodation-management', url: `${id}` });
    }, [id]);
    const changeStatusApi = useRequest(RequestApi<TRejectionPayload, any>, {
        manual: true,
        onSuccess: res => {
            EducareMessageAlert(res?.message || 'Status updated successfully');
            apiRefresh();
            router.back();
        },
        onError: (error: any) => {
            EducareMessageAlert(error?.error?.systems || 'Status update failed', 'error');
        },
    });
    const onChangeStatus = (id: string, payload: TRejectionPayload) => {
        changeStatusApi.run({
            module: 'housing-accommodation-management',
            method: 'PUT',
            url: id,
            payload,
        });
    };
    const renderAmenityIcon = (amenity: string) => {
        switch (amenity) {
            case 'wifi':
                return <FaWifi className="text-lg" />;
            case 'gym-access':
                return <CgGym className="text-lg" />;
            case 'water':
                return <GiTap className="text-lg" />;
            case 'parking':
                return <GiCarWheel className="text-lg" />;
            case 'gas':
                return <PiGasCan className="text-lg" />;
            case 'electricity':
                return <TbWindElectricity className="text-lg" />;
            case 'laundry':
                return <TbHanger2 className="text-lg" />;
            default:
                return null;
        }
    };
    if (apiLoading) {
        return <EducareBackdrop status={apiLoading} />;
    }
    const timeAgo = dayjs(apiData?.payload?.updatedAt).fromNow();
    const handleRemove = () => {
        showHouseAccommodationRejectionState[1](router.query.id as string);
    };
    return (
        <div className="p-2">
            <div>
                <div className="flex gap-3 items-center">
                    <IoMdArrowBack className="text-2xl cursor-pointer" onClick={() => router.back()} />
                    <div className="text-xl font-semibold">Housing and accommodation details</div>
                </div>
                {apiData ? (
                    <div className="p-4 bg-white rounded-lg my-2">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <EducareImage
                                    variant="details"
                                    preview={false}
                                    height={86}
                                    width={86}
                                    image={{
                                        imagePath: apiData?.payload?.userInfo?.profilePic || '',
                                        blurHash: apiData?.payload?.userInfo?.profilePicBlurHash || '',
                                    }}
                                />
                                <div>
                                    <div className="text-xl font-semibold">{apiData?.payload?.userInfo.name || ''}</div>
                                    <div className="flex text-[#BBC3CB] gap-2 items-center">
                                        <span className="">{apiData?.payload?.organizationUserType || ''}</span>
                                        <span className="h-2 w-2 rounded-full bg-gray-600"></span>
                                        <span>{timeAgo}</span>
                                    </div>
                                </div>
                            </div>
                            <EduCarePermissionWrapper module={PermissionModulesEnum.POST_MANAGEMENT} permissions={PermissionActionsEnum.UPDATE}>
                                <div>
                                    <EducareButton className="border-none bg-slate-100" variant="reset" onClick={() => handleRemove()}>
                                        <MinusCircleOutlined /> Remove
                                    </EducareButton>
                                </div>
                            </EduCarePermissionWrapper>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 mt-5 gap-5">
                            <div className="col-span-2">
                                {!apiData?.payload ||
                                    (apiData?.payload.images && (
                                        <ImageGallery
                                            items={apiData?.payload.images.map(image => ({
                                                original: getImagePathToLink(image.imagePath),
                                                thumbnail: getImagePathToLink(image.imagePath),
                                            }))}
                                            autoPlay={false}
                                            showFullscreenButton={false}
                                            showPlayButton={false}
                                            showBullets={false}
                                            showNav={false}
                                        />
                                    ))}
                            </div>
                            <div className="col-span-3 flex flex-col gap-5">
                                <div className="w-full">
                                    <div className="text-3xl font-bold">{apiData?.payload?.title || ''}</div>
                                </div>
                                <div className="flex items-center">
                                    <span>
                                        <CiLocationOn className="text-lg" />
                                    </span>
                                    <span className="text-lg">{apiData?.payload?.location || ''}</span>
                                </div>
                                <div className="p-5 text-center font-bold text-2xl border border-gray-300 shadow-lg rounded-md">
                                    £{apiData?.payload?.price || ''} {apiData?.payload?.priceType || ''}
                                </div>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                    <PostManagementCard
                                        icon={<AiOutlineCalendar className="text-2xl" />}
                                        title="Availability date"
                                        value={funcFormatDate(apiData?.payload?.availabilityDate ? apiData?.payload?.availabilityDate : '')}
                                    />
                                    <PostManagementCard
                                        icon={<IoBedOutline className="text-2xl" />}
                                        title="Bedrooms"
                                        value={apiData?.payload?.bedrooms || ''}
                                    />
                                    <PostManagementCard
                                        icon={<LuBath className="text-2xl" />}
                                        title="Bathrooms"
                                        value={apiData?.payload?.bathrooms || ''}
                                    />
                                    <PostManagementCard
                                        icon={<FaFileContract className="text-2xl" />}
                                        title="Lease length"
                                        value={apiData?.payload?.leaseLength || ''}
                                    />
                                    <PostManagementCard
                                        icon={<GiEntryDoor className="text-2xl" />}
                                        title="Accommodation"
                                        value={apiData?.payload?.accommodation || ''}
                                    />
                                    <PostManagementCard
                                        icon={<AiOutlineBank className="text-2xl" />}
                                        title="Landlord type"
                                        value={apiData?.payload?.userInfo?.userType || ''}
                                    />
                                    <PostManagementCard
                                        icon={<FaSmoking className="text-2xl" />}
                                        title="Smoking policy"
                                        value={apiData?.payload?.smokingPolicies || ''}
                                    />
                                    <PostManagementCard
                                        icon={<TbBuildingWarehouse className="text-2xl" />}
                                        title="Furnishing"
                                        value={apiData?.payload?.furnishing || ''}
                                    />
                                </div>
                                <div className="text-3xl mt-12 font-bold">Other benefits</div>
                                <div className="flex items-center flex-wrap gap-4 mt-4">
                                    {apiData?.payload?.amenities.map((amenity, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-2 items-center p-2 rounded-md bg-white shadow-md border border-gray-300 capitalize">
                                            {renderAmenityIcon(amenity)}
                                            {amenity}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="my-5 font-medium text-xl">Description</div>
                            <p className="text-justify">{apiData?.payload?.description || ''}</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <EducareEmptyData title="No Data Found!" description="Data Not Found: Possible Deletion" />
                    </div>
                )}
            </div>
            <EducareRejectionModal
                state={showHouseAccommodationRejectionState}
                onReject={({ relatedId, ...payload }) => {
                    onChangeStatus(relatedId, payload);
                }}
            />
        </div>
    );
};
export default DetailsHouseAndAccommodationComponent;
