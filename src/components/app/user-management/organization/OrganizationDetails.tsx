import React from 'react';
import { useRouter } from 'next/router';
import { useDeepCompareEffect, useRequest } from 'ahooks';

import { Image, Skeleton } from 'antd';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { CheckCircleOutlined, MinusCircleOutlined, PauseOutlined } from '@ant-design/icons';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import type { TStatusPayload } from '@components/shared/educare-rejection';
import RequestApi from '@library/apis/request.api';
import { PermissionActionsEnum, PermissionModulesEnum, UserApprovalStatusEnum } from '@library/enums';
import { funcEnumKeyByValue, funcTruncateText, getImagePathToLink } from '@library/functions';
import type { TOrganisationProfileResponse } from '@library/schemas/post-management';
import { BsLinkedin } from '@react-icons/all-files/bs/BsLinkedin';
import { BsTiktok } from '@react-icons/all-files/bs/BsTiktok';
import { BsTwitterX } from '@react-icons/all-files/bs/BsTwitterX';
import { CiLocationOn } from '@react-icons/all-files/ci/CiLocationOn';
import { FaFacebookSquare } from '@react-icons/all-files/fa/FaFacebookSquare';
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram';
import { FaRegBuilding } from '@react-icons/all-files/fa/FaRegBuilding';
import { GoDotFill } from '@react-icons/all-files/go/GoDotFill';
import { IoMdArrowBack } from '@react-icons/all-files/io/IoMdArrowBack';
import { IoCallOutline } from '@react-icons/all-files/io5/IoCallOutline';
import { MdOutlineEmail } from '@react-icons/all-files/md/MdOutlineEmail';
import { TbWorldSearch } from '@react-icons/all-files/tb/TbWorldSearch';

import EduCarePermissionWrapper from '../../../shared/educare-permission-wrapper';
import { EduCareSelectUiTwo } from '../../../shared/educare-select-2';

dayjs.extend(relativeTime);

const OrganizationDetails = () => {
    const router = useRouter();
    const changeStatusApi = useRequest(RequestApi<TStatusPayload, any>, {
        manual: true,
        onSuccess: res => {
            EducareMessageAlert(res?.message || 'Status updated successfully');
            apiRefresh();
        },
        onError: (error: any) => {
            EducareMessageAlert(error?.error?.systems || 'Status update failed', 'error');
        },
    });

    const { data: apiData, run: getData, loading: apiLoading, refresh: apiRefresh } = useRequest(RequestApi<any, TOrganisationProfileResponse>);

    useDeepCompareEffect(() => {
        getData({ version: 'v1', method: 'GET', module: 'organisation-user', url: `${router.query.id}` });
    }, [router.query.id]);

    const organizationData: TOrganisationProfileResponse | '' = apiData ? apiData.payload : '';

    if (apiLoading) {
        return <Skeleton avatar paragraph={{ rows: 5 }} loading={apiLoading} />;
    }
    const onChangeStatus = (id: string, payload: TStatusPayload) => {
        changeStatusApi.run({
            module: 'organisation-user',
            method: 'PUT',
            url: id,
            payload,
        });
    };
    const timeAgo = dayjs(organizationData ? organizationData?.organisationInfo?.createdAt : '').fromNow();
    return (
        <div>
            <div className="flex gap-3">
                <IoMdArrowBack className="text-3xl cursor-pointer mt-5" onClick={() => router.back()} />
                <div className="text-xl font-bold my-5">Organisation Details</div>
            </div>
            <div className="p-4 flex gap-3 bg-white mb-5">
                {organizationData && (
                    <div className="w-full">
                        <div className="bg-white p-6 mt-8">
                            <div className="flex flex-col md:flex-row justify-between">
                                <div className="flex gap-3">
                                    <div>
                                        <img
                                            className="h-20 w-20 rounded-[86px]"
                                            src={getImagePathToLink(organizationData?.organisationInfo?.logo || '')}
                                            alt="image"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{organizationData.name}</p>
                                        <div className="flex gap-2 text-slate-400 pb-1">
                                            <p className="capitalize">{organizationData?.organizationUserType}</p>
                                            <GoDotFill />
                                            <p> {timeAgo} </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <EduCarePermissionWrapper
                                        module={PermissionModulesEnum.USER_MANAGEMENT}
                                        permissions={PermissionActionsEnum.UPDATE}>
                                        <div className="h-20 w-48 font-normal border px-6 py-4 text-center rounded bg-slate-100">
                                            <p className="h-12 w-36 p-2 bg-white rounded">
                                                <div className="border-0">
                                                    <EduCareSelectUiTwo
                                                        showSearch={false}
                                                        name="status"
                                                        type="default"
                                                        className="w-fit"
                                                        loading={changeStatusApi.params?.[0]?.url === organizationData?.id && changeStatusApi.loading}
                                                        value={funcEnumKeyByValue(UserApprovalStatusEnum, organizationData.status.toString())}
                                                        options={[
                                                            {
                                                                label: (
                                                                    <div className="text-blue-500">
                                                                        <PauseOutlined /> Pending
                                                                    </div>
                                                                ),
                                                                value: UserApprovalStatusEnum.Pending.toString(),
                                                            },
                                                            {
                                                                label: (
                                                                    <div className="text-green-500">
                                                                        <CheckCircleOutlined /> Verified
                                                                    </div>
                                                                ),
                                                                value: UserApprovalStatusEnum.Verified.toString(),
                                                            },
                                                            {
                                                                label: (
                                                                    <div className="text-red-500">
                                                                        <MinusCircleOutlined /> Inactive
                                                                    </div>
                                                                ),
                                                                value: UserApprovalStatusEnum.Inactive.toString(),
                                                            },
                                                        ]}
                                                        onSelect={value => {
                                                            if (value !== organizationData.status.toString()) {
                                                                onChangeStatus(organizationData.id, {
                                                                    status: +value,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </p>
                                        </div>
                                    </EduCarePermissionWrapper>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <Image
                                className="object-cover max-h-96"
                                src={getImagePathToLink(organizationData?.organisationInfo?.logo)}
                                alt="Organization image"
                            />
                            <div className="col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex gap-4 items-center">
                                            <div className="p-2  bg-white border border-gray-200 rounded-md">
                                                <MdOutlineEmail size={30} />
                                            </div>
                                            <div className="w-52">
                                                <h1 className="text-xl font-semibold">Email</h1>
                                                <p className="w-8">{organizationData.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex gap-4 items-center">
                                            <div className="p-2 bg-white border border-gray-200 rounded-md">
                                                <IoCallOutline size={30} />
                                            </div>
                                            <div className="w-52">
                                                <h1 className="text-xl font-semibold">Mobile number</h1>
                                                <p>{organizationData?.organisationInfo?.detailContactNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex gap-2 items-center">
                                            <div className="p-2 bg-white border border-gray-200 rounded-md">
                                                <FaRegBuilding size={30} />
                                            </div>
                                            <div className="w-52">
                                                <h1 className="font-semibold text-xl">Industry type</h1>
                                                <p className="capitalize">{organizationData?.organizationUserType}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="flex gap-2 items-center">
                                            <div className="p-4 bg-white border border-gray-200 rounded-md">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_245_22188)">
                                                        <path
                                                            d="M13.3966 7.48436L18.7729 2.14123L18.7554 5.16998C18.7498 5.42248 18.9498 5.64186 19.2029 5.63623L19.5235 5.63561C19.776 5.62998 19.9854 5.47936 19.991 5.22686L20.0041 0.714983C20.0041 0.710608 19.9873 0.707483 19.9873 0.703108L20.0123 0.474358C20.0148 0.347483 19.9848 0.234358 19.9035 0.153733C19.8223 0.0718579 19.7091 0.0224829 19.5835 0.0262329L19.3548 0.0318579C19.3504 0.0318579 19.3473 0.0337329 19.3423 0.0343579L14.8598 0.0143579C14.6073 0.0199829 14.3985 0.228733 14.3929 0.481858L14.3923 0.802483C14.4304 1.09998 14.6648 1.27436 14.9173 1.26873L17.871 1.27686L12.5135 6.60186C12.2698 6.84561 12.2698 7.24186 12.5135 7.48623C12.7573 7.73061 13.1529 7.72998 13.3973 7.48623L13.3966 7.48436ZM6.6235 12.5156L1.24725 17.8425L1.26413 14.83C1.27038 14.5775 1.06913 14.3575 0.816629 14.3631L0.476629 14.3637C0.223504 14.37 0.0147544 14.52 0.00912937 14.7725L-0.00399563 19.2844C-0.00399563 19.2887 0.0135044 19.2912 0.0135044 19.2962L-0.0114956 19.5244C-0.0146206 19.6512 0.0153794 19.765 0.0972544 19.8456C0.177879 19.9275 0.291629 19.9769 0.417254 19.9737L0.646004 19.9681C0.650379 19.9681 0.653504 19.9662 0.658504 19.9662L5.16038 19.9862C5.41288 19.98 5.62163 19.7712 5.62788 19.5187L5.6285 19.1975C5.58975 18.9 5.356 18.7256 5.1035 18.7312L2.14975 18.7237L7.50663 13.4C7.75038 13.1562 7.75038 12.7606 7.50663 12.5162C7.26288 12.2719 6.86725 12.2712 6.6235 12.5156ZM20.0048 19.2844L19.9916 14.7725C19.986 14.52 19.7773 14.3694 19.5248 14.3637L19.2041 14.3631C18.9516 14.3575 18.751 14.5775 18.7566 14.83L18.7741 17.8587L13.3979 12.5156C13.1541 12.2719 12.7585 12.2719 12.5141 12.5156C12.2698 12.7594 12.2704 13.155 12.5141 13.3994L17.871 18.7231L14.9173 18.7306C14.6648 18.725 14.4304 18.8994 14.3923 19.1969L14.3929 19.5181C14.3985 19.7706 14.6079 19.98 14.8598 19.9856L19.3423 19.9656C19.3473 19.9656 19.3504 19.9675 19.3548 19.9675L19.5835 19.9731C19.7091 19.9762 19.8235 19.9269 19.9035 19.845C19.9854 19.7644 20.0148 19.6506 20.0123 19.5237L19.9873 19.2956C19.9873 19.2906 20.0041 19.2881 20.0041 19.2837L20.0048 19.2844ZM2.14975 1.27561L5.10413 1.26811C5.35663 1.27373 5.59038 1.09936 5.62913 0.801858L5.6285 0.481233C5.62225 0.228108 5.4135 0.0193579 5.161 0.0137329L0.658504 0.0331079C0.653504 0.0324829 0.650379 0.0306079 0.646004 0.0306079L0.417254 0.0249829C0.291629 0.0218579 0.177879 0.0712329 0.0972544 0.152483C0.0147544 0.233733 -0.0146206 0.346233 -0.0114956 0.473733L0.0135044 0.702483C0.0135044 0.706858 -0.00399563 0.709983 -0.00399563 0.714983L0.00912937 5.22686C0.0147544 5.47936 0.223504 5.62998 0.476629 5.63561L0.817254 5.63623C1.06975 5.64186 1.26975 5.42248 1.26413 5.16998L1.24663 2.15811L6.62288 7.48498C6.86663 7.72873 7.26288 7.72873 7.50663 7.48498C7.75038 7.24123 7.75038 6.84498 7.50663 6.60061L2.14975 1.27561Z"
                                                            fill="#333333"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_245_22188">
                                                            <rect width="20" height="20" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </div>
                                            <div className="w-52">
                                                <h1 className="text-xl font-semibold">Organisation size</h1>
                                                <p>
                                                    {organizationData?.organisationInfo?.organisationSizeFrom}-
                                                    {organizationData?.organisationInfo?.organisationSizeTo}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {organizationData?.organisationInfo?.socialMediaLinks?.website && (
                                        <div className="flex gap-2 items-center">
                                            <div className="p-2 bg-white border border-gray-200 rounded-md">
                                                <TbWorldSearch size={30} />
                                            </div>
                                            <div className="w-52">
                                                <h1 className="text-xl font-semibold">Website URL</h1>
                                                <p className="break-words">
                                                    {funcTruncateText(organizationData?.organisationInfo?.socialMediaLinks?.website, 25)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {organizationData?.organisationInfo?.socialMediaLinks?.facebook && (
                                        <div className="flex gap-2 items-center">
                                            <div className="p-2 bg-white border border-gray-200 rounded-md">
                                                <FaFacebookSquare size={30} />
                                            </div>
                                            <div className="w-52">
                                                <h1 className="text-xl font-semibold">Facebook</h1>
                                                <p className="break-words">
                                                    {funcTruncateText(organizationData?.organisationInfo?.socialMediaLinks?.facebook)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {organizationData?.organisationInfo?.socialMediaLinks?.linkedin && (
                                        <div className="flex gap-2 items-center">
                                            <div className="p-2 bg-white border border-gray-200 rounded-md">
                                                <BsLinkedin size={30} />
                                            </div>
                                            <div className="w-52">
                                                <h1 className="text-xl font-semibold">LinkedIn</h1>
                                                <a
                                                    className="break-words"
                                                    target="_blank"
                                                    href={organizationData?.organisationInfo?.socialMediaLinks?.linkedin}>
                                                    {funcTruncateText(organizationData?.organisationInfo?.socialMediaLinks?.linkedin)}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {organizationData?.organisationInfo?.socialMediaLinks?.instagram && (
                                        <div className="flex gap-2 items-center">
                                            <div className="p-2 bg-white border border-gray-200 rounded-md">
                                                <FaInstagram size={30} />
                                            </div>
                                            <div className="w-52">
                                                <h1 className="text-xl font-semibold">Instagram</h1>
                                                <a
                                                    target="_blank"
                                                    href={organizationData?.organisationInfo?.socialMediaLinks?.instagram}
                                                    className="break-words">
                                                    {funcTruncateText(organizationData?.organisationInfo?.socialMediaLinks?.instagram, 25)}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {organizationData?.organisationInfo?.socialMediaLinks?.tiktok && (
                                        <div className="flex gap-2 items-center">
                                            <div className="p-2 bg-white border border-gray-200 rounded-md">
                                                <BsTiktok size={30} />
                                            </div>
                                            <div className="w-52">
                                                <h1 className="text-xl font-semibold">Tiktok</h1>
                                                <p className="break-words">{organizationData?.organisationInfo?.socialMediaLinks?.tiktok}</p>
                                            </div>
                                        </div>
                                    )}
                                    {organizationData?.organisationInfo?.socialMediaLinks?.twitter && (
                                        <div className="flex gap-2 items-center">
                                            <div className="p-2 bg-white border border-gray-200 rounded-md">
                                                <BsTwitterX size={30} />
                                            </div>
                                            <div className="w-52">
                                                <h1 className="text-xl font-semibold">Twitter</h1>
                                                <p className="break-words">{organizationData?.organisationInfo?.socialMediaLinks?.twitter}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex gap-2 items-center">
                                        <div className="p-2 bg-white border border-gray-200 rounded-md">
                                            <CiLocationOn size={30} />
                                        </div>
                                        <div className="w-52">
                                            <h1 className="text-xl font-semibold">Location</h1>
                                            <p>{organizationData?.organisationInfo?.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <h1 className="text-2xl font-bold">About</h1>
                            <h3>{organizationData?.organisationInfo?.organisationDescription}</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizationDetails;
