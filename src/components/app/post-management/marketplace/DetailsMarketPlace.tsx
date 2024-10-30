import { useRouter } from 'next/router';
import ImageGallery from 'react-image-gallery';
import { useDeepCompareEffect, useRequest, useSafeState } from 'ahooks';

import dayjs from 'dayjs';

import { MinusCircleOutlined } from '@ant-design/icons';
import EducareButton from '@components/shared/educare-button';
import EducareEmptyData from '@components/shared/educare-empty';
import RequestApi from '@library/apis/request.api';
import { PermissionActionsEnum, PermissionModulesEnum } from '@library/enums';
import { funcFormatDate, getImagePathToLink } from '@library/functions';
import type { TMarketplaceItemResponse } from '@library/schemas/post-management';
import { AiOutlineCalendar } from '@react-icons/all-files/ai/AiOutlineCalendar';
import { BiSolidOffer } from '@react-icons/all-files/bi/BiSolidOffer';
import { CiLocationOn } from '@react-icons/all-files/ci/CiLocationOn';
import { FaSitemap } from '@react-icons/all-files/fa/FaSitemap';
import { IoMdArrowBack } from '@react-icons/all-files/io/IoMdArrowBack';
import { LuUserSquare } from '@react-icons/all-files/lu/LuUserSquare';
import { MdOutlineWorkspaces } from '@react-icons/all-files/md/MdOutlineWorkspaces';
import { TbTruckDelivery } from '@react-icons/all-files/tb/TbTruckDelivery';

import EducareBackdrop from '../../../shared/educare-backdrop';
import EducareImage from '../../../shared/educare-image';
import EducareMessageAlert from '../../../shared/educare-message-alert';
import EduCarePermissionWrapper from '../../../shared/educare-permission-wrapper';
import type { TRejectionPayload } from '../../../shared/educare-rejection';
import EducareRejectionModal from '../../../shared/educare-rejection';
import PostManagementCard from '../PostManagementCard';

const DetailsMarketplaceComponent = () => {
    const router = useRouter();
    const showHouseAccommodationRejectionState = useSafeState<string>('');
    const id = router.query.id;

    const { data: apiData, run: getData, loading: apiLoading, refresh: apiRefresh } = useRequest(RequestApi<any, TMarketplaceItemResponse>);
    useDeepCompareEffect(() => {
        getData({ version: 'v1', method: 'GET', module: 'marketplace-management', url: `${id}` });
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
            module: 'marketplace-management',
            method: 'PUT',
            url: id,
            payload,
        });
    };
    if (apiLoading) {
        return <EducareBackdrop status={apiLoading} />;
    }
    const timeAgo = dayjs(apiData?.payload?.updatedAt).fromNow();
    return (
        <div className="p-2">
            <div>
                <div className="flex gap-3 items-center">
                    <IoMdArrowBack className="text-2xl cursor-pointer" onClick={() => router.back()} />
                    <div className="text-xl font-semibold">Product details</div>
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
                                    <div className="text-xl font-semibold">{apiData?.payload?.sellerName}</div>
                                    <div className="flex text-[#BBC3CB] gap-2 items-center">
                                        <span className="">{apiData?.payload?.postBy}</span>
                                        <span className="h-2 w-2 rounded-full bg-gray-600"></span>
                                        <span>{timeAgo}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <EduCarePermissionWrapper module={PermissionModulesEnum.POST_MANAGEMENT} permissions={PermissionActionsEnum.UPDATE}>
                                    <EducareButton
                                        className="border-none bg-slate-100"
                                        variant="reset"
                                        onClick={() => showHouseAccommodationRejectionState[1](router.query.id as string)}>
                                        <MinusCircleOutlined /> Remove
                                    </EducareButton>
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
                                <div className="text-3xl font-bold">{apiData?.payload?.name || ''}</div>
                                <div className="flex items-center">
                                    <span>
                                        <CiLocationOn className="text-lg" />
                                    </span>
                                    <span className="text-lg">{apiData?.payload?.location || ''}</span>
                                </div>
                                <div className="p-5 text-center font-bold text-2xl border border-gray-300 shadow-lg rounded-md">
                                    £{apiData?.payload?.price}
                                    {apiData?.payload?.discountPrice && (
                                        <span className="line-through text-gray-600 font-thin ">£{apiData?.payload?.discountPrice}</span>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                    <PostManagementCard
                                        icon={<FaSitemap className="text-2xl" />}
                                        title="Item type"
                                        value={apiData?.payload?.itemType || ''}
                                    />
                                    <PostManagementCard
                                        icon={<MdOutlineWorkspaces className="text-2xl" />}
                                        title="Condition"
                                        value={apiData?.payload?.condition || ''}
                                    />
                                    <PostManagementCard
                                        icon={<LuUserSquare className="text-2xl" />}
                                        title="Seller type"
                                        value={apiData?.payload?.userInfo?.userType || ''}
                                    />
                                    <PostManagementCard
                                        icon={<TbTruckDelivery className="text-2xl" />}
                                        title="Delivery options"
                                        value={apiData?.payload?.deliveryOption || ''}
                                    />
                                    <PostManagementCard
                                        icon={<AiOutlineCalendar className="text-2xl" />}
                                        title="Listing date"
                                        value={funcFormatDate(apiData?.payload?.createdAt ? apiData?.payload?.createdAt : '')}
                                    />
                                    {apiData?.payload?.offers && (
                                        <PostManagementCard
                                            icon={<BiSolidOffer className="text-2xl" />}
                                            title="Offers"
                                            value={apiData?.payload?.offers || ''}
                                        />
                                    )}
                                </div>
                                <div className="p-4 bg-gray-100 rounded-md">
                                    <h2>Seller Details</h2>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex flex-col gap-2">
                                            <div>Email</div>
                                            <div className="font-bold">{apiData?.payload?.sellerEmail || ''}</div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div>Seller name</div>
                                            <div className="font-bold">{apiData?.payload?.sellerName || ''}</div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div>Mobile number</div>
                                            <div className="font-bold">{apiData?.payload?.sellerMobile || ''}</div>
                                        </div>
                                    </div>
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
export default DetailsMarketplaceComponent;
