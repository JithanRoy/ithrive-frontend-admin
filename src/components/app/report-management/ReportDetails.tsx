import { useRouter } from 'next/router';
import ImageGallery from 'react-image-gallery';
import { useDeepCompareEffect, useRequest } from 'ahooks';

import { Image, Skeleton } from 'antd';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, EyeInvisibleOutlined, PauseOutlined, UndoOutlined } from '@ant-design/icons';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import EduCarePermissionWrapper from '@components/shared/educare-permission-wrapper';
import { EduCareSelectUiTwo } from '@components/shared/educare-select-2';
import RequestApi from '@library/apis/request.api';
import { PermissionActionsEnum, PermissionModulesEnum, ReportManagementStatusEnum } from '@library/enums';
import { getImagePathToLink } from '@library/functions';
import type { TBasicUserInfo } from '@library/schemas/login';
import type { TReportManagementDetails } from '@library/schemas/report-management';
import type { TImageEntity } from '@library/types';
import { CiLocationOn } from '@react-icons/all-files/ci/CiLocationOn';
import { IoMdArrowBack } from '@react-icons/all-files/io/IoMdArrowBack';

import SocialPostTaxonomy from '../social-post/atoms/SocialPostTaxonomy';

import AboutJobDetails from './Details/aboutJob';
import ContentDetails from './Details/content';
import ProfileDetails from './Details/profile';
import ReportReasons from './Details/reasons';
import UserDetails from './Details/user';
import type { TReportStatusPayload } from './ListReportManagement';

dayjs.extend(relativeTime);

const ReportDetails = () => {
    const router = useRouter();

    const { data: apiData, run: getData, loading: apiLoading, refresh: apiRefresh } = useRequest(RequestApi<any, TReportManagementDetails>);
    useDeepCompareEffect(() => {
        getData({ version: 'v1', method: 'GET', module: 'report-management', url: `report-details/${router.query.id}` });
    }, [router.query.id]);

    const changeStatusApi = useRequest(RequestApi<TReportStatusPayload, any>, {
        manual: true,
        onSuccess: res => {
            EducareMessageAlert(res?.message || 'Status updated successfully');
            apiRefresh();
        },
        onError: error => {
            EducareMessageAlert(error?.message || 'Failed to update status');
        },
    });
    const onChangeStatus = (id: string, actionStatus: TReportStatusPayload) => {
        changeStatusApi.run({
            module: 'report-management',
            method: 'PUT',
            url: `change-report-status/${id}?actionStatus=${actionStatus?.actionStatus}`,
        });
    };
    if (apiLoading) {
        return <Skeleton avatar paragraph={{ rows: 5 }} loading={apiLoading} />;
    }

    return (
        <div>
            <div className="flex gap-3">
                <IoMdArrowBack className="text-3xl cursor-pointer mt-5" onClick={() => router.back()} />
                <div className="text-xl font-bold my-5">Report Details</div>
            </div>
            {apiData && (
                <div className="grid grid-cols-2">
                    <>
                        <div className="bg-white p-4 col-span-1">
                            <EduCarePermissionWrapper module={PermissionModulesEnum.REPORT_MANAGEMENT} permissions={PermissionActionsEnum.UPDATE}>
                                <div className="h-20 w-fit font-normal border px-6 py-4 text-center rounded bg-slate-100">
                                    <p className="h-12 w-fit p-2 bg-white rounded">
                                        <div className="border-0">
                                            {apiData?.payload?.userReport?.actionStatus === 'Delete user' ? (
                                                <span className="text-red-600 border-emerald-400 w-fit rounded-lg">Deleted User</span>
                                            ) : (
                                                <EduCareSelectUiTwo
                                                    showSearch={false}
                                                    name="status"
                                                    type="default"
                                                    className="w-fit"
                                                    loading={
                                                        changeStatusApi.params[0]?.url.split('/')[1].split('?')[0] ===
                                                            apiData?.payload?.userReport?.id && changeStatusApi.loading
                                                    }
                                                    value={apiData && apiData?.payload?.userReport?.actionStatus.toString()}
                                                    options={[
                                                        {
                                                            label: (
                                                                <div className="text-blue-500">
                                                                    <PauseOutlined /> Pending
                                                                </div>
                                                            ),
                                                            value: ReportManagementStatusEnum.PENDING.toString(),
                                                        },
                                                        {
                                                            label: (
                                                                <div className="text-orange-500">
                                                                    <UndoOutlined /> Under review
                                                                </div>
                                                            ),
                                                            value: ReportManagementStatusEnum.UNDER_REVIEW.toString(),
                                                        },
                                                        {
                                                            label: (
                                                                <div className="text-pink-700">
                                                                    <EyeInvisibleOutlined /> Ignored
                                                                </div>
                                                            ),
                                                            value: ReportManagementStatusEnum.IGNORED.toString(),
                                                        },
                                                        {
                                                            label: (
                                                                <div className="text-green-500">
                                                                    <CheckCircleOutlined /> Resolved
                                                                </div>
                                                            ),
                                                            value: ReportManagementStatusEnum.RESOLVED.toString(),
                                                        },
                                                        {
                                                            label: (
                                                                <div className="text-red-900">
                                                                    <CloseCircleOutlined /> Suspended user
                                                                </div>
                                                            ),
                                                            value: ReportManagementStatusEnum.SUSPENDED_USER.toString(),
                                                        },
                                                        {
                                                            label: (
                                                                <div className="text-red-500">
                                                                    <DeleteOutlined /> Deleted user
                                                                </div>
                                                            ),
                                                            value: ReportManagementStatusEnum.DELETE_USER.toString(),
                                                        },
                                                    ]}
                                                    onSelect={value => {
                                                        if (value !== apiData?.payload?.userReport?.actionStatus?.toString()) {
                                                            onChangeStatus(apiData.payload.userReport.id, {
                                                                actionStatus: value,
                                                            });
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </p>
                                </div>
                            </EduCarePermissionWrapper>
                            <ReportReasons apiData={apiData.payload} />
                        </div>
                    </>
                    <>
                        <div className="bg-white col-span-1 border border-l-slate-200 p-4">
                            <p className="text-2xl mb-16 text-slate-600 font-bold">
                                {['student', 'organization'].includes(apiData.payload.userReport.reportFor) ? 'User' : 'Content'}
                            </p>
                            <div>
                                {apiData.payload.userReport.reportFor !== 'social-post' && apiData.payload.reportedEvent && (
                                    <ProfileDetails apiData={apiData.payload} />
                                )}
                                {apiData.payload.userReport.reportFor === 'social-post' && apiData.payload.reportedEvent && (
                                    <SocialPostTaxonomy
                                        id={apiData.payload.reportedEvent.id}
                                        text={String(apiData?.payload?.reportedEvent?.post)}
                                        noAction={false}
                                        likes={apiData.payload.reportedEvent.reactionCount}
                                        shares={apiData.payload.reportedEvent.shareCount}
                                        images={apiData.payload.reportedEvent.images as TImageEntity[]}
                                        comments={apiData.payload.reportedEvent.commentCount}
                                        updatedAt={apiData.payload.reportedEvent.updatedAt}
                                        gradient={apiData.payload.reportedEvent.statusBackgroundColor}
                                        user={apiData.payload.reportedEvent.userInfo as TBasicUserInfo}
                                        editable={false}
                                        deletable={false}
                                        inReportPage={true}
                                    />
                                )}
                                {!apiData.payload.reportedEvent ? (
                                    <p className="text-4xl font-medium text-red flex items-center justify-center">No Content/User found</p>
                                ) : (
                                    <>
                                        {['student', 'organization'].includes(apiData.payload.userReport.reportFor) ? (
                                            <div>
                                                <div className="text-center mb-8">
                                                    <Image
                                                        className="object-cover w-full rounded-md"
                                                        alt="images"
                                                        src={getImagePathToLink(apiData?.payload?.reportedEvent?.profilePic)}
                                                    />
                                                </div>
                                                <UserDetails apiData={apiData.payload} />
                                                {apiData.payload.reportedEvent.organisationInfo?.organisationDescription && (
                                                    <div className="mt-8">
                                                        <h1 className="text-2xl font-bold">About</h1>
                                                        <h3>{apiData?.payload?.reportedEvent?.organisationInfo?.organisationDescription}</h3>
                                                    </div>
                                                )}
                                                {apiData.payload.reportedEvent.profileInfo?.bio && (
                                                    <div className="mt-8">
                                                        <h1 className="text-2xl font-bold">Bio</h1>
                                                        <h3>{apiData?.payload?.reportedEvent?.profileInfo?.bio}</h3>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                {apiData.payload.reportedEvent.title && (
                                                    <div className="w-full mt-8">
                                                        <div className="text-3xl font-bold">{apiData?.payload?.reportedEvent?.title || ''}</div>
                                                    </div>
                                                )}
                                                {apiData.payload.reportedEvent.location && (
                                                    <div className="flex items-center mt-8">
                                                        <span>
                                                            <CiLocationOn className="text-lg" />
                                                        </span>
                                                        <span className="text-lg ml-2">{apiData?.payload?.reportedEvent?.location || ''}</span>
                                                    </div>
                                                )}
                                                {apiData.payload.reportedEvent.price !== null &&
                                                    apiData.payload.reportedEvent.price !== undefined && (
                                                        <div className="p-5 text-center mt-8 font-bold text-2xl border border-gray-300 shadow-lg rounded-md">
                                                            {apiData.payload.reportedEvent.price > 0
                                                                ? `£${apiData.payload.reportedEvent.price}`
                                                                : 'FREE'}
                                                        </div>
                                                    )}
                                                <ContentDetails apiData={apiData.payload} />
                                                <div className="mt-16">
                                                    {apiData.payload.reportedEvent.amount !== null &&
                                                        apiData.payload.reportedEvent.amount !== undefined &&
                                                        apiData.payload.reportedEvent.amountType && (
                                                            <div className="p-5 text-center font-bold text-2xl border border-gray-300 shadow-lg rounded-md">
                                                                £{apiData.payload.reportedEvent.amount} {apiData.payload.reportedEvent.amountType}
                                                            </div>
                                                        )}
                                                </div>
                                                <div className="mt-16">
                                                    {apiData.payload.reportedEvent.sellerName && (
                                                        <div className="p-4 w-full bg-gray-100 rounded-md">
                                                            <h2>Seller Details</h2>
                                                            <div className="flex items-center justify-between gap-2">
                                                                <div className="flex flex-col gap-2">
                                                                    <div>Email</div>
                                                                    <div className="font-bold">{apiData.payload.reportedEvent.sellerEmail || ''}</div>
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <div>Seller name</div>
                                                                    <div className="font-bold">{apiData.payload.reportedEvent.sellerName || ''}</div>
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <div>Mobile number</div>
                                                                    <div className="font-bold">
                                                                        {apiData.payload.reportedEvent.sellerMobile || ''}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <AboutJobDetails apiData={apiData.payload} />

                                                <div className="mt-8">
                                                    {apiData.payload.reportedEvent.images &&
                                                        apiData.payload.userReport.reportFor !== 'social-post' && (
                                                            <ImageGallery
                                                                items={apiData?.payload.reportedEvent.images.map(image => ({
                                                                    original: getImagePathToLink(image.imagePath),
                                                                    thumbnail: getImagePathToLink(image.imagePath),
                                                                }))}
                                                                autoPlay={false}
                                                                showFullscreenButton={false}
                                                                showPlayButton={false}
                                                                showBullets={false}
                                                                showNav={false}
                                                            />
                                                        )}
                                                </div>
                                                {apiData.payload.reportedEvent.description && (
                                                    <div className="w-full mt-8">
                                                        <div className="my-5 font-bold text-xl">Description</div>
                                                        <p className="text-justify w-full">{apiData.payload.reportedEvent.description || ''}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                </div>
            )}
        </div>
    );
};

export default ReportDetails;
