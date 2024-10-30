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
import type { TScholarshipResponse } from '@library/schemas/post-management';
import { AiOutlineClockCircle } from '@react-icons/all-files/ai/AiOutlineClockCircle';
import { CiLocationOn } from '@react-icons/all-files/ci/CiLocationOn';
import { FaFigma } from '@react-icons/all-files/fa/FaFigma';
import { FaUserGraduate } from '@react-icons/all-files/fa/FaUserGraduate';
import { GrMapLocation } from '@react-icons/all-files/gr/GrMapLocation';
import { IoIosLink } from '@react-icons/all-files/io/IoIosLink';
import { IoMdArrowBack } from '@react-icons/all-files/io/IoMdArrowBack';
import { IoMdBook } from '@react-icons/all-files/io/IoMdBook';
import { MdOutlineAutorenew } from '@react-icons/all-files/md/MdOutlineAutorenew';
import { MdTableRestaurant } from '@react-icons/all-files/md/MdTableRestaurant';

import EducareBackdrop from '../../../shared/educare-backdrop';
import EducareImage from '../../../shared/educare-image';
import EducareMessageAlert from '../../../shared/educare-message-alert';
import EduCarePermissionWrapper from '../../../shared/educare-permission-wrapper';
import type { TRejectionPayload } from '../../../shared/educare-rejection';
import EducareRejectionModal from '../../../shared/educare-rejection';
import PostManagementCard from '../PostManagementCard';

const DetailsScholarshipComponent = () => {
    const router = useRouter();
    const showHouseAccommodationRejectionState = useSafeState<string>('');
    const id = router.query.id;

    const { data: apiData, run: getData, loading: apiLoading, refresh: apiRefresh } = useRequest(RequestApi<any, TScholarshipResponse>);
    useDeepCompareEffect(() => {
        getData({ version: 'v1', method: 'GET', module: 'scholarship-management', url: `${id}` });
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
            module: 'scholarship-management',
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
                    <div className="text-xl font-semibold">Scholarship details</div>
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
                                    <div className="text-xl font-semibold">{apiData?.payload?.userInfo?.name}</div>
                                    <div className="flex text-[#BBC3CB] gap-2 items-center">
                                        <span className="">{apiData?.payload?.postBy}</span>
                                        <span className="h-2 w-2 rounded-full bg-gray-600"></span>
                                        <span>{timeAgo}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <EduCarePermissionWrapper module={PermissionModulesEnum.POST_MANAGEMENT} permissions={PermissionActionsEnum.UPDATE}>
                                    <div>
                                        <EducareButton className="border-none bg-slate-100" variant="reset" onClick={() => handleRemove()}>
                                            <MinusCircleOutlined /> Remove
                                        </EducareButton>
                                    </div>
                                </EduCarePermissionWrapper>
                            </div>
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
                                    £{apiData?.payload?.amount || '0'} {apiData?.payload?.amountType || ''}
                                </div>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                    <PostManagementCard
                                        icon={<FaUserGraduate className="text-2xl" />}
                                        title="Scholarship Type"
                                        value={apiData?.payload?.scholarshipType || ''}
                                    />
                                    <PostManagementCard
                                        icon={<MdTableRestaurant className="text-2xl" />}
                                        title="Field of Study"
                                        value={apiData?.payload?.fieldOfStudy || ''}
                                    />
                                    <PostManagementCard
                                        icon={<IoMdBook className="text-2xl" />}
                                        title="Education Level"
                                        value={apiData?.payload?.educationLevel || ''}
                                    />
                                    <PostManagementCard
                                        icon={<AiOutlineClockCircle className="text-2xl" />}
                                        title="Deadline"
                                        value={funcFormatDate(apiData?.payload?.deadline ? apiData?.payload?.deadline : '')}
                                    />
                                    <PostManagementCard
                                        icon={<GrMapLocation className="text-2xl" />}
                                        title="Eligibility"
                                        value={apiData?.payload?.eligible || ''}
                                    />
                                    <PostManagementCard
                                        icon={<FaFigma className="text-2xl" />}
                                        title="Sponsor Type"
                                        value={apiData?.payload?.sponsorType || ''}
                                    />
                                    <PostManagementCard
                                        icon={<MdOutlineAutorenew className="text-2xl" />}
                                        title="Renewability"
                                        value={apiData?.payload?.renewability || ''}
                                    />
                                </div>
                                <PostManagementCard
                                    icon={<IoIosLink className="text-2xl" />}
                                    title="Apply link"
                                    value={apiData?.payload?.externalLink || ''}
                                />
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
export default DetailsScholarshipComponent;
