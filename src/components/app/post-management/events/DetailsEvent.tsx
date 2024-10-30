import { useRouter } from 'next/router';
import ImageGallery from 'react-image-gallery';
import { useDeepCompareEffect, useRequest, useSafeState } from 'ahooks';

import dayjs from 'dayjs';

import { MinusCircleOutlined } from '@ant-design/icons';
import EducareButton from '@components/shared/educare-button';
import EducareEmptyData from '@components/shared/educare-empty';
import RequestApi from '@library/apis/request.api';
import { PermissionActionsEnum, PermissionModulesEnum } from '@library/enums';
import { getImagePathToLink } from '@library/functions';
import type { EventData } from '@library/schemas/post-management';
import { AiOutlineCalendar } from '@react-icons/all-files/ai/AiOutlineCalendar';
import { CiLocationArrow1 } from '@react-icons/all-files/ci/CiLocationArrow1';
import { CiLocationOn } from '@react-icons/all-files/ci/CiLocationOn';
import { FaLink } from '@react-icons/all-files/fa/FaLink';
import { IoMdArrowBack } from '@react-icons/all-files/io/IoMdArrowBack';
import { MdAccessTime } from '@react-icons/all-files/md/MdAccessTime';
import { RiTimerFlashLine } from '@react-icons/all-files/ri/RiTimerFlashLine';

import EducareBackdrop from '../../../shared/educare-backdrop';
import EducareImage from '../../../shared/educare-image';
import EducareMessageAlert from '../../../shared/educare-message-alert';
import EduCarePermissionWrapper from '../../../shared/educare-permission-wrapper';
import type { TRejectionPayload } from '../../../shared/educare-rejection';
import EducareRejectionModal from '../../../shared/educare-rejection';
import PostManagementCard from '../PostManagementCard';

const DetailsHouseAndAccommodationComponent = () => {
    const router = useRouter();
    const showHouseAccommodationRejectionState = useSafeState<string>('');
    const id = router.query.id;

    const { data: apiData, run: getData, loading: apiLoading, refresh: apiRefresh } = useRequest(RequestApi<any, EventData>);
    useDeepCompareEffect(() => {
        getData({ version: 'v1', method: 'GET', module: 'event-management', url: `${id}` });
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
            module: 'event-management',
            method: 'PUT',
            url: id,
            payload,
        });
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
                    <div className="text-xl font-semibold">Event details</div>
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
                                    <div className="text-xl font-semibold">{apiData?.payload?.userInfo.name}</div>
                                    <div className="flex text-[#BBC3CB] gap-2 items-center">
                                        <span className="capitalize">{apiData?.payload?.organizationUserType}</span>
                                        <span className="h-2 w-2 rounded-full bg-gray-600"></span>
                                        <span>{timeAgo}</span>
                                    </div>
                                </div>
                            </div>
                            <EduCarePermissionWrapper module={PermissionModulesEnum.POST_MANAGEMENT} permissions={PermissionActionsEnum.UPDATE}>
                                <EducareButton className="border-none bg-slate-100" variant="reset" onClick={() => handleRemove()}>
                                    <MinusCircleOutlined /> Remove
                                </EducareButton>
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
                                <h2 className="uppercase">{`${dayjs(apiData?.payload?.fromDate).format('ddd, D MMM YYYY')} - ${dayjs(apiData?.payload?.toDate).format('D MMM YYYY')}`}</h2>
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
                                    {apiData ? (apiData.payload.price > 0 ? `£${apiData.payload.price} Per Ticket` : 'FREE') : 'FREE'}
                                </div>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                    <PostManagementCard
                                        icon={<AiOutlineCalendar className="text-2xl" />}
                                        title="Event Type"
                                        value={apiData?.payload?.eventType || ''}
                                    />
                                    <PostManagementCard
                                        icon={<MdAccessTime className="text-2xl" />}
                                        title="Time"
                                        value={apiData?.payload?.shift || ''}
                                    />
                                    <PostManagementCard
                                        icon={<CiLocationArrow1 className="text-2xl" />}
                                        title="Spot"
                                        value={apiData?.payload?.spot || ''}
                                    />
                                    <PostManagementCard
                                        icon={<RiTimerFlashLine className="text-2xl" />}
                                        title="Duration"
                                        value={apiData?.payload?.duration || ''}
                                    />
                                    <PostManagementCard
                                        icon={<FaLink className="text-2xl" />}
                                        title="Apply link"
                                        value={apiData?.payload?.externalLink || ''}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="my-5 font-medium text-xl">Description</div>
                            <p className="text-justify w-full">{apiData?.payload?.description || ''}</p>
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
