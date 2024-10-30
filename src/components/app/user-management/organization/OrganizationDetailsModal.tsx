import React from 'react';
import { useRequest, useSafeState } from 'ahooks';

import { Modal } from 'antd';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { CheckCircleOutlined, MinusCircleOutlined, PauseOutlined } from '@ant-design/icons';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import type { TStatusPayload } from '@components/shared/educare-rejection';
import { EduCareSelectUi } from '@components/shared/educare-select';
import RequestApi from '@library/apis/request.api';
import { UserApprovalStatusEnum } from '@library/enums';
import { funcEnumKeyByValue, getImagePathToLink } from '@library/functions';
import type { TOrganisationProfileResponse } from '@library/schemas/post-management';

dayjs.extend(relativeTime);
type OrganizationModalProps = {
    data: TOrganisationProfileResponse;
    onClose: () => void;
    onSearch: (this: any, value: string, queryName?: any) => void;
};

const OrganizationModal = ({ data: organizationData, onClose, onSearch }: OrganizationModalProps) => {
    const [status, setStatus] = useSafeState(organizationData.status);

    const changeStatusApi = useRequest(RequestApi<TStatusPayload, any>, {
        manual: true,
        onSuccess: res => {
            EducareMessageAlert(res?.message || 'Status updated successfully');
            onSearch('');
            setStatus(organizationData?.status);
            onClose();
        },
        onError: (error: any) => {
            EducareMessageAlert(error?.error?.systems || 'Status update failed', 'error');
        },
    });
    const onChangeStatus = (id: string, payload: TStatusPayload) => {
        changeStatusApi.run({
            module: 'organisation-user',
            method: 'PUT',
            url: id,
            payload,
        });
    };
    if (!organizationData) {
        return null;
    }
    const timeAgo = dayjs(organizationData?.organisationInfo?.createdAt).fromNow();

    return (
        <Modal centered open={true} onOk={onClose} onCancel={onClose} width={1000} footer={null}>
            <div className="p-2">
                <div className="bg-white p-6 mt-8">
                    <div className="flex justify-between">
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
                                    <p>{organizationData?.organizationUserType}</p>
                                    <svg className="mt-1" width="6" height="7" viewBox="0 0 6 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M5.13158 5.80179C4.55263 6.38074 3.84211 6.67021 3 6.67021C2.15789 6.67021 1.44737 6.38074 0.868421 5.80179C0.289474 5.22284 0 4.51232 0 3.67021C0 2.82811 0.289474 2.11758 0.868421 1.53863C1.44737 0.959685 2.15789 0.670212 3 0.670212C3.84211 0.670212 4.55263 0.959685 5.13158 1.53863C5.71053 2.11758 6 2.82811 6 3.67021C6 4.51232 5.71053 5.22284 5.13158 5.80179Z"
                                            fill="#BBC3CB"
                                        />
                                    </svg>
                                    <p> {timeAgo} </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="h-20 w-48 font-normal border px-6 py-4 text-center rounded bg-slate-100">
                                <p className="h-12 w-36 p-2 bg-white rounded">
                                    <div className="border-0">
                                        <EduCareSelectUi
                                            showSearch={false}
                                            name="status"
                                            type="default"
                                            className="w-32"
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
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <img
                        className="w-96 h-96 rounded-sm"
                        src={getImagePathToLink(organizationData?.organisationInfo?.logo)}
                        alt="Organization image"
                    />
                    <div>
                        <div className="flex gap-6 mb-4">
                            <div className="flex gap-2 items-center">
                                <div className="p-4 bg-white border border-gray-200 rounded-md">
                                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3.33398 5.83337L8.50065 9.70833C9.38957 10.375 10.6117 10.375 11.5007 9.70833L16.6673 5.83333"
                                            stroke="#333333"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M15.8333 4.16667H4.16667C3.24619 4.16667 2.5 4.91286 2.5 5.83334V14.1667C2.5 15.0871 3.24619 15.8333 4.16667 15.8333H15.8333C16.7538 15.8333 17.5 15.0871 17.5 14.1667V5.83334C17.5 4.91286 16.7538 4.16667 15.8333 4.16667Z"
                                            stroke="#333333"
                                            stroke-linecap="round"
                                        />
                                    </svg>
                                </div>
                                <div className="w-52">
                                    <h1 className="text-xl font-semibold">Email</h1>
                                    <p>{organizationData.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="p-4 bg-white ml-1 border border-gray-200 rounded-md">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M14.4625 18.5269C12.7791 18.1052 9.33283 16.9161 6.20854 13.7918C3.08428 10.6676 1.89524 7.22132 1.47347 5.53792C1.23108 4.57049 1.66756 3.63695 2.40765 3.10831L4.34786 1.72244C5.48309 0.911567 7.06234 1.18672 7.85644 2.33376L9.07791 4.09813C9.59641 4.84708 9.41757 5.87358 8.67633 6.40304L7.70236 7.09874C7.84977 7.66258 8.30823 8.8205 9.74407 10.2563C11.1799 11.6922 12.3378 12.1506 12.9017 12.298L13.5973 11.324C14.1268 10.5828 15.1533 10.4039 15.9022 10.9224L17.6667 12.1439C18.8137 12.9381 19.0888 14.5173 18.2779 15.6525L16.8921 17.5927C16.3634 18.3328 15.4299 18.7693 14.4625 18.5269ZM7.38705 12.6133C10.2282 15.4545 13.3636 16.5334 14.8675 16.9102C15.0873 16.9652 15.3531 16.8798 15.5358 16.624L16.9217 14.6838C17.192 14.3054 17.1003 13.779 16.7179 13.5142L14.9536 12.2927L14.207 13.338C13.9019 13.7652 13.3377 14.1002 12.6807 13.9584C11.8607 13.7815 10.3448 13.2141 8.56558 11.4348C6.78633 9.65558 6.2189 8.13975 6.04197 7.31975C5.90022 6.66275 6.23525 6.09851 6.6624 5.7934L7.70761 5.04682L6.48612 3.28244C6.22142 2.90009 5.695 2.80838 5.31659 3.07867L3.37638 4.46453C3.12052 4.64729 3.03509 4.91304 3.09017 5.13286C3.46698 6.63682 4.5459 9.77217 7.38705 12.6133Z"
                                            fill="#333333"
                                        />
                                    </svg>
                                </div>
                                <div className="w-52">
                                    <h1 className="text-xl font-semibold">Mobile number</h1>
                                    <p>{organizationData?.organisationInfo?.detailContactNumber}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-5 mb-4">
                            <div className="flex gap-2 items-center">
                                <div className="p-4 bg-white border border-gray-200 rounded-md">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14.7578 11.4101H7.46094C7.17578 11.4101 6.9375 11.6406 6.91406 11.9355L5.69531 17.8652V17.9043C5.69531 18.2207 5.94141 18.4765 6.24219 18.4765H15.9746C16.2773 18.4765 16.5215 18.2207 16.5215 17.9043V17.8652L15.3027 11.9355C15.2793 11.6406 15.043 11.4101 14.7578 11.4101ZM13.3867 6.87888C13.3867 8.35153 12.582 9.54684 11.1094 9.54684C9.63672 9.54684 8.44141 8.35153 8.44141 6.87888C8.44141 5.40622 9.63672 4.21091 11.1094 4.21091C12.582 4.21091 13.3867 5.40622 13.3867 6.87888Z"
                                            fill="white"
                                        />
                                        <path
                                            d="M6.45703 6.9082C6.45703 8.82031 8.02734 10.375 9.95898 10.375C10.8945 10.375 11.7734 10.0156 12.4336 9.36133C13.0957 8.70703 13.4609 7.83594 13.4609 6.9082C13.4609 4.99609 11.8906 3.44141 9.95898 3.44141C8.0293 3.44141 6.45703 4.99609 6.45703 6.9082ZM9.95898 4.22266C11.459 4.22266 12.6797 5.42773 12.6797 6.9082C12.6797 8.38867 11.459 9.59375 9.95898 9.59375C8.45898 9.59375 7.23828 8.38867 7.23828 6.9082C7.23828 5.42773 8.45898 4.22266 9.95898 4.22266ZM14.6562 10.6484H5.29102C4.92383 10.6484 4.61914 10.9141 4.58984 11.252L3.02539 18.0645V18.1094C3.02539 18.4727 3.3418 18.7676 3.72852 18.7676H16.2188C16.6074 18.7676 16.9219 18.4727 16.9219 18.1094V18.0645L15.3574 11.252C15.3262 10.9141 15.0234 10.6484 14.6562 10.6484ZM3.84375 17.9863L5.35156 11.4297H9.93555L8.66797 12.6836C8.61133 12.7402 8.58789 12.8223 8.60742 12.9004L9.79883 17.6152C9.85742 17.8457 10.1875 17.8457 10.2461 17.6152L11.4395 12.9004C11.459 12.8223 11.4355 12.7402 11.3789 12.6836L10.1113 11.4297H14.5957L16.1016 17.9863H3.84375Z"
                                            fill="#333333"
                                        />
                                        <path
                                            d="M5.56641 6.88675C5.60742 6.90042 5.64844 6.90628 5.6875 6.90628C5.85156 6.90628 6.00391 6.80081 6.05859 6.63675C6.125 6.43167 6.01367 6.21097 5.80859 6.14456C5.17969 5.93948 4.50977 5.20706 4.50977 4.25784C4.50977 3.04105 5.51367 2.05081 6.74609 2.05081C7.44531 2.05081 8.02344 2.39651 8.46875 3.08011C8.58594 3.26175 8.82812 3.31253 9.00977 3.19534C9.19141 3.07816 9.24219 2.83597 9.125 2.65433C8.53516 1.74808 7.71289 1.26956 6.74609 1.26956C5.08203 1.26956 3.72852 2.60941 3.72852 4.25784C3.72852 5.58987 4.65234 6.58792 5.56641 6.88675ZM3.82422 13.1231C3.82422 12.9082 3.64844 12.7325 3.43359 12.7325H2.08008L3.25391 7.77347H5.78906C6.00391 7.77347 6.17969 7.59769 6.17969 7.38284C6.17969 7.168 6.00391 6.99222 5.78906 6.99222H3.14844C2.81445 6.99222 2.54102 7.2305 2.50781 7.53519L1.24414 12.8692V12.9141C1.24414 13.2461 1.5332 13.5137 1.88672 13.5137H3.43359C3.64844 13.5137 3.82422 13.3399 3.82422 13.1231ZM10.9395 3.18558C11.1211 3.30276 11.3613 3.25198 11.4805 3.07034C11.9258 2.38675 12.5059 2.03909 13.2051 2.03909C14.4395 2.03909 15.4434 3.02933 15.4434 4.24808C15.4434 5.19925 14.7734 5.93167 14.1426 6.13675C13.9375 6.20316 13.8262 6.42386 13.8926 6.62894C13.9473 6.793 14.0996 6.89847 14.2637 6.89847C14.3047 6.89847 14.3457 6.89261 14.3848 6.87894C15.2988 6.58011 16.2246 5.58011 16.2246 4.24808C16.2246 2.59964 14.8691 1.25784 13.2051 1.25784C12.2383 1.25784 11.416 1.73831 10.8262 2.64456C10.707 2.8262 10.7578 3.06839 10.9395 3.18558ZM17.4648 7.52933C17.4336 7.22464 17.1582 6.98636 16.8242 6.98636H14.1797C13.9648 6.98636 13.7891 7.16214 13.7891 7.37698C13.7891 7.59183 13.9648 7.76761 14.1797 7.76761H16.7168L17.8926 12.7325H16.5371C16.3223 12.7325 16.1465 12.9082 16.1465 13.1231C16.1465 13.3379 16.3223 13.5137 16.5371 13.5137H18.0859C18.4414 13.5137 18.7285 13.2442 18.7285 12.9121V12.8672L17.4648 7.52933Z"
                                            fill="#333333"
                                        />
                                    </svg>
                                </div>
                                <div className="w-52">
                                    <h1 className="font-semibold text-xl">Industry type</h1>
                                    <p>{organizationData?.organizationUserType}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="p-4 bg-white border border-gray-200 rounded-md ml-3">
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
                                    <h1 className="text-base font-semibold">Organisation size</h1>
                                    <p>
                                        {organizationData?.organisationInfo?.organisationSizeFrom}-
                                        {organizationData?.organisationInfo?.organisationSizeTo}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-5 mb-4">
                            <div className="flex gap-2 items-center">
                                <div className="p-4 bg-white border border-gray-200 rounded-md">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12.4773 17.4125C10.9193 17.9369 9.23498 17.9535 7.66685 17.46C6.09872 16.9664 4.72759 15.9881 3.75073 14.6659C2.77387 13.3436 2.24165 11.7455 2.23064 10.1016C2.21964 8.45768 2.73042 6.85263 3.68949 5.51741C4.64856 4.18219 6.00647 3.18563 7.56785 2.67113C9.12923 2.15662 10.8136 2.15068 12.3785 2.65418C13.9435 3.15768 15.3084 4.14465 16.2769 5.47308C17.2453 6.80151 17.7674 8.40292 17.768 10.0469C17.7429 10.677 17.6666 11.3041 17.5398 11.9219"
                                            stroke="#333333"
                                        />
                                        <path d="M11.8313 15.9688C11.2724 16.6037 10.6597 17.1892 10 17.7188" stroke="#333333" />
                                        <path
                                            d="M10 2.1875C12.097 4.01966 13.3946 6.59912 13.6156 9.375C13.661 9.8789 13.6704 10.3854 13.6437 10.8906"
                                            stroke="#333333"
                                        />
                                        <path
                                            d="M10.0008 2.1875C8.863 3.17921 7.94893 4.40137 7.31914 5.77302C6.68935 7.14466 6.35821 8.63447 6.34766 10.1437C6.34766 15.2062 8.62266 16.7063 9.99141 17.7188"
                                            stroke="#333333"
                                        />
                                        <path d="M3.24023 6.21875H16.7965" stroke="#333333" />
                                        <path d="M10 2.18439V17.7188" stroke="#333333" />
                                        <path d="M3.45312 14.2125H11.575" stroke="#333333" />
                                        <path d="M2.23047 10.1437L17.768 9.95312" stroke="#333333" />
                                        <path
                                            d="M16.7415 17.8125L18.1259 16.425L15.6259 13.925L17.0478 13.0156C17.0685 13.0034 17.085 12.9851 17.0951 12.9633C17.1052 12.9414 17.1085 12.917 17.1044 12.8933C17.1003 12.8696 17.0891 12.8477 17.0723 12.8304C17.0555 12.8132 17.0339 12.8015 17.0103 12.7969L12.2321 11.6781C12.2124 11.6741 12.192 11.675 12.1727 11.6808C12.1534 11.6866 12.1359 11.6971 12.1216 11.7114C12.1074 11.7256 12.0969 11.7431 12.0911 11.7624C12.0853 11.7817 12.0844 11.8021 12.0884 11.8219L13.1259 16.6906C13.1309 16.7143 13.1428 16.7359 13.1601 16.7528C13.1774 16.7697 13.1994 16.781 13.2232 16.7854C13.247 16.7897 13.2715 16.7869 13.2937 16.7773C13.3159 16.7676 13.3347 16.7516 13.3478 16.7312L14.2415 15.3125L16.7415 17.8125Z"
                                            stroke="#333333"
                                        />
                                    </svg>
                                </div>
                                <div className="w-52">
                                    <h1 className="text-xl font-semibold">Website URL</h1>
                                    <p>{organizationData?.organisationInfo?.socialMediaLinks?.website}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="p-4 bg-white border border-gray-200 rounded-md ml-3">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M11.6667 4.99999H14.1667C14.3877 4.99999 14.5996 4.91219 14.7559 4.75591C14.9122 4.59963 15 4.38767 15 4.16666V2.49999C15 2.27898 14.9122 2.06701 14.7559 1.91073C14.5996 1.75445 14.3877 1.66666 14.1667 1.66666H11.6667C10.5616 1.66666 9.50179 2.10564 8.72039 2.88704C7.93899 3.66845 7.5 4.72825 7.5 5.83332V8.33332H5.83333C5.61232 8.33332 5.40036 8.42112 5.24408 8.5774C5.0878 8.73368 5 8.94564 5 9.16666V10.8333C5 11.0543 5.0878 11.2663 5.24408 11.4226C5.40036 11.5789 5.61232 11.6667 5.83333 11.6667H7.5V17.5C7.5 17.721 7.5878 17.933 7.74408 18.0892C7.90036 18.2455 8.11232 18.3333 8.33333 18.3333H10C10.221 18.3333 10.433 18.2455 10.5893 18.0892C10.7455 17.933 10.8333 17.721 10.8333 17.5V11.6667H12.6833C12.8737 11.6722 13.0602 11.6124 13.2118 11.4971C13.3635 11.3819 13.471 11.2182 13.5167 11.0333L13.9333 9.36665C13.9642 9.24187 13.9659 9.11164 13.9381 8.98613C13.9103 8.86061 13.8538 8.74324 13.7731 8.64317C13.6924 8.5431 13.5897 8.46306 13.4729 8.40931C13.3561 8.35556 13.2285 8.32955 13.1 8.33332H10.8333V5.83332C10.8333 5.61231 10.9211 5.40035 11.0774 5.24407C11.2337 5.08779 11.4457 4.99999 11.6667 4.99999Z"
                                            fill="#333333"
                                        />
                                    </svg>
                                </div>
                                <div className="w-52">
                                    <h1 className="text-xl font-semibold">Facebook</h1>
                                    <p>{organizationData?.organisationInfo?.socialMediaLinks?.facebook}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex gap-2 items-center">
                                <div className="p-4 bg-white border border-gray-200 rounded-md">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M4.99148 18.3386V6.52723H1.06604V18.3385H4.99148V18.3386ZM3.02917 4.91518C4.39762 4.91518 5.25006 4.00745 5.25006 2.87403C5.22418 1.71542 4.39762 0.833313 3.05483 0.833313C1.71183 0.833349 0.833984 1.71546 0.833984 2.87407C0.833984 4.00748 1.68595 4.91522 3.00333 4.91522L3.02917 4.91518ZM7.16405 18.3386C7.16405 18.3386 7.21555 7.63545 7.16405 6.52727H11.0901V8.24017H11.064C11.5803 7.43414 12.5103 6.24991 14.6279 6.24991C17.2114 6.24991 19.1478 7.93804 19.1478 11.566V18.3386H15.2224V12.0199C15.2224 10.4322 14.6544 9.34875 13.2334 9.34875C12.1491 9.34875 11.503 10.0791 11.2192 10.7852C11.1154 11.0365 11.0901 11.3895 11.0901 11.7425V18.3386H7.16405Z"
                                            fill="#333333"
                                        />
                                    </svg>
                                </div>
                                <div className="w-52">
                                    <h1 className="text-xl font-semibold">LinkedIn</h1>
                                    <p>{organizationData?.organisationInfo?.socialMediaLinks?.linkedin}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="p-4 bg-white border border-gray-200 rounded-md ml-4">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9.99935 17.5C12.916 14.5 15.8327 11.8137 15.8327 8.5C15.8327 5.18629 13.221 2.5 9.99935 2.5C6.77769 2.5 4.16602 5.18629 4.16602 8.5C4.16602 11.8137 7.08268 14.5 9.99935 17.5Z"
                                            stroke="#333333"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M10.0007 9.99999C10.9212 9.99999 11.6673 9.25382 11.6673 8.33332C11.6673 7.41285 10.9212 6.66666 10.0007 6.66666C9.08015 6.66666 8.33398 7.41285 8.33398 8.33332C8.33398 9.25382 9.08015 9.99999 10.0007 9.99999Z"
                                            stroke="#333333"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div className="w-52">
                                    <h1 className="text-xl font-semibold">Location</h1>
                                    <p>{organizationData?.organisationInfo?.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <h1 className="text-2xl font-bold">About</h1>
                    <h3>{organizationData?.organisationInfo?.organisationDescription}</h3>
                </div>
            </div>
        </Modal>
    );
};

export default OrganizationModal;
