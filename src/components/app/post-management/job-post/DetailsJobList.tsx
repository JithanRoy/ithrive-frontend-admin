import React from 'react';
import { useRouter } from 'next/router';
import { useDeepCompareEffect, useRequest, useSafeState } from 'ahooks';

import dayjs from 'dayjs';

import { CheckCircleOutlined, MinusCircleOutlined, PauseOutlined } from '@ant-design/icons';
import EducareButton from '@components/shared/educare-button';
import EducareEmptyData from '@components/shared/educare-empty';
import RequestApi from '@library/apis/request.api';
import { ApprovalStatusEnum, PermissionActionsEnum, PermissionModulesEnum } from '@library/enums';
import { funcEnumKeyByValue } from '@library/functions';
import type { TJobPostingResponse } from '@library/schemas/post-management';
import { FaGraduationCap } from '@react-icons/all-files/fa/FaGraduationCap';
import { FaLink } from '@react-icons/all-files/fa/FaLink';
import { FaRegBuilding } from '@react-icons/all-files/fa/FaRegBuilding';
import { GoTasklist } from '@react-icons/all-files/go/GoTasklist';
import { GrUserExpert } from '@react-icons/all-files/gr/GrUserExpert';
import { HiOutlineCog } from '@react-icons/all-files/hi/HiOutlineCog';
import { IoIosTime } from '@react-icons/all-files/io/IoIosTime';
import { IoMdArrowBack } from '@react-icons/all-files/io/IoMdArrowBack';
import { IoPeopleSharp } from '@react-icons/all-files/io5/IoPeopleSharp';
import { LuNetwork } from '@react-icons/all-files/lu/LuNetwork';

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

    const { data: apiData, run: getData, loading: apiLoading, refresh: apiRefresh } = useRequest(RequestApi<any, TJobPostingResponse>);
    useDeepCompareEffect(() => {
        getData({ version: 'v1', method: 'GET', module: 'Job-management', url: `${id}` });
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
            module: 'Job-management',
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
                    <div className="text-xl font-semibold">Job details</div>
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
                            <div>
                                <EduCarePermissionWrapper module={PermissionModulesEnum.POST_MANAGEMENT} permissions={PermissionActionsEnum.UPDATE}>
                                    <EducareButton className="border-none bg-slate-100" variant="reset" onClick={() => handleRemove()}>
                                        <MinusCircleOutlined /> Remove
                                    </EducareButton>
                                </EduCarePermissionWrapper>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 mt-5 gap-5">
                            <div className="col-span-2 flex items-center justify-center">
                                <EducareImage
                                    variant="default"
                                    height="40vh"
                                    width="100%"
                                    preview={false}
                                    image={{
                                        imagePath: apiData?.payload?.organizationLogo || '',
                                        blurHash: apiData?.payload?.organizationLogoBlurHash || '',
                                    }}
                                />
                            </div>
                            <div className="col-span-3 flex flex-col gap-2">
                                <div className="text-3xl font-bold w-full">{apiData?.payload?.jobTitle || ''}</div>
                                <div className="flex flex-col">
                                    <span className="text-base">{apiData?.payload?.organizationName}</span>
                                    <span className="text-base">{apiData?.payload?.location}</span>
                                </div>
                                {apiData?.payload?.isSalaryNegotiable ? (
                                    <div className="p-5 text-center font-bold text-2xl border border-gray-300 shadow-lg rounded-md">Negotiable</div>
                                ) : (
                                    <div className="p-5 text-center font-bold text-2xl border border-gray-300 shadow-lg rounded-md">
                                        {`£${apiData?.payload?.salaryRangeFrom || '0'}${apiData?.payload?.salaryRangeTo ? ` - £${apiData?.payload?.salaryRangeTo}` : ''}/ ${apiData?.payload?.salaryInterval}`}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                    <PostManagementCard
                                        icon={<GoTasklist className="text-2xl" />}
                                        title="Job type"
                                        value={apiData?.payload?.jobType[0] || ''}
                                    />
                                    <PostManagementCard
                                        icon={<FaRegBuilding className="text-2xl" />}
                                        title="Industry"
                                        value={apiData?.payload?.industry || ''}
                                    />
                                    <PostManagementCard
                                        icon={<LuNetwork className="text-2xl" />}
                                        title="Work Arrangement"
                                        value={apiData?.payload?.workArrangement[0] || ''}
                                    />
                                    <PostManagementCard
                                        icon={<GrUserExpert className="text-2xl" />}
                                        title="Experience level"
                                        value={apiData?.payload?.experienceLevel[0] || ''}
                                    />
                                    <PostManagementCard
                                        icon={<IoIosTime className="text-2xl" />}
                                        title="Duration"
                                        value={apiData?.payload?.duration || 'Student'}
                                    />
                                    <PostManagementCard
                                        icon={<FaGraduationCap className="text-2xl" />}
                                        title="Education Level"
                                        value={apiData?.payload?.educationLevel[0] || ''}
                                    />
                                    <PostManagementCard
                                        icon={<HiOutlineCog className="text-2xl" />}
                                        title="Authorisation"
                                        value={apiData?.payload?.workAuthorization || ''}
                                    />
                                    {apiData?.payload?.vacancy !== null && (
                                        <PostManagementCard
                                            icon={<IoPeopleSharp className="text-2xl" />}
                                            title="Vacancy"
                                            value={apiData?.payload?.vacancy || ''}
                                        />
                                    )}
                                    <div className="mb-5">
                                        <PostManagementCard
                                            icon={<FaLink className="text-2xl" />}
                                            title="Deadline"
                                            value={apiData?.payload?.applicationDeadline || ''}
                                        />
                                    </div>
                                    <PostManagementCard
                                        icon={<FaLink className="text-2xl" />}
                                        title="Apply link"
                                        value={apiData?.payload?.externalLink || ''}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="my-5 font-bold text-xl">About the job</div>
                            <p>{apiData?.payload?.aboutJob}</p>
                            <div className="my-5 font-bold text-xl">Your role includes</div>
                            <div>
                                <ul className="flex flex-col gap-3">
                                    {apiData?.payload?.roleIncludes ? (
                                        apiData?.payload.roleIncludes.split('\n').map((item, index) => <li key={index}>{item}</li>)
                                    ) : (
                                        <li>No data available</li>
                                    )}
                                </ul>
                            </div>
                            <div className="my-5 font-bold text-xl">Key Qualifications</div>
                            <div>
                                <ul className="flex flex-col gap-3">
                                    {apiData?.payload?.keyQualification ? (
                                        apiData?.payload?.keyQualification.split('\n').map((item, index) => <li key={index}>{item}</li>)
                                    ) : (
                                        <li>No data available</li>
                                    )}
                                </ul>
                            </div>
                            <div className="my-5 font-bold text-xl">Compensation & Other Benefits</div>
                            <div>
                                <ul className="flex flex-col gap-3">
                                    {apiData?.payload?.compensationOtherBenefit ? (
                                        apiData?.payload.compensationOtherBenefit.split('\n').map((item, index) => <li key={index}>{item}</li>)
                                    ) : (
                                        <li>No data available</li>
                                    )}
                                </ul>
                            </div>
                            <div className="my-5 font-bold text-xl">Application Instruction</div>
                            <p>{apiData?.payload?.applicationInstruction}</p>
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
