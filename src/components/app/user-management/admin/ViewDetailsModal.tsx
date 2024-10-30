import React from 'react';
import { useDeepCompareEffect, useRequest } from 'ahooks';

import { Modal, Skeleton } from 'antd';

import RequestApi from '@library/apis/request.api';
import { funcFormatDate } from '@library/functions';
import type { TAdminDetails } from '@library/schemas/post-management';
import { FaCheck } from '@react-icons/all-files/fa/FaCheck';
import { ImCross } from '@react-icons/all-files/im/ImCross';

type ViewDetailsModalProps = {
    onClose: () => void;
    id: string;
};

const ViewDetailsModal = ({ id, onClose }: ViewDetailsModalProps) => {
    const { data: apiData, run: getData, loading: apiLoading, refresh: apiRefresh } = useRequest(RequestApi<any, TAdminDetails>);
    useDeepCompareEffect(() => {
        getData({ version: 'v1', method: 'GET', module: 'admin-user', url: `${id}` });
    }, []);
    const formatText = (text: string | undefined) => text;

    const makeArrayFourByOrder = (arr: any[]) => {
        const permissions = ['Read', 'Create', 'Update', 'Delete'];

        const newArr = permissions.map(permission => {
            const existingPermission = arr.find(item => item.name.replace(/\d+/g, '') === permission);
            return (
                existingPermission || {
                    id: Math.random(),
                    name: '',
                    checked: null,
                }
            );
        });

        return newArr;
    };
    return (
        <Modal title="Admin Permission" centered open={true} footer={null} onOk={onClose} onCancel={onClose} width={860}>
            <Skeleton paragraph={{ rows: 6 }} loading={apiLoading}>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <p>
                            <span className="text-base font-normal text-slate-400">Name: </span>
                            <span className="text-base font-normal ml-2">
                                {formatText(
                                    `${apiData?.payload?.profileInfo?.adminFirstName || ''} ${apiData?.payload?.profileInfo?.adminLastName || ''}`,
                                )}
                            </span>
                        </p>
                        <p>
                            <span className="text-base font-normal text-slate-400">Created date: </span>
                            <span className="text-base font-normal ml-2">
                                {formatText(funcFormatDate(`${apiData?.payload?.createdAt}`, 'DD MMM YYYY'))}
                            </span>
                        </p>
                    </div>
                    <div>
                        <p>
                            <span className="text-base font-normal text-slate-400">Email: </span>
                            <span className="text-base font-normal ml-2">{formatText(apiData?.payload?.email)}</span>
                        </p>
                        <p className="flex">
                            <span className="text-base font-normal text-slate-400">Phone number: </span>
                            <span className="text-base font-normal ml-2">{formatText(apiData?.payload?.profileInfo?.detailContactNumber)}</span>
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-6 mt-6 mb-2 bg-gray-100 p-4 w-full rounded mr-3">
                    <div className="col-span-2 text-left font-extrabold">Module permissions</div>
                </div>
                <div className="pb-3 ms-2">
                    {apiData?.payload?.userPermissions.map((permissionGroup, index) => (
                        <div key={index}>
                            <div className="grid grid-cols-6 gap-2 my-5 px-4 text-start">
                                <div className="pb-3 font-semibold col-span-2">{permissionGroup.module}</div>
                                {makeArrayFourByOrder(permissionGroup.permissions).map((permission, idx) => (
                                    <div key={idx} className="flex items-center">
                                        {permission.checked === true ? (
                                            <FaCheck className="text-green-500" />
                                        ) : permission.checked === false ? (
                                            <ImCross className="text-red-500" />
                                        ) : (
                                            <span></span>
                                        )}
                                        <span className="ml-2">{formatText(permission.name)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Skeleton>
        </Modal>
    );
};

export default ViewDetailsModal;
