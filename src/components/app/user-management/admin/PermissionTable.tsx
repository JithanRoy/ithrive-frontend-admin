import React from 'react';
import { useRequest } from 'ahooks';

import { Skeleton } from 'antd';

import EducareCheckbox from '@components/shared/educare-checkbox';
import RequestApi from '@library/apis/request.api';
import type { TUserPermissionApiResponse } from '@library/schemas';
import type { TAdminCrudSchemaWithPermissions } from '@library/schemas/admin';

type Props = {
    hookForm?: any;
    userData?: TAdminCrudSchemaWithPermissions;
};

export default function PermissionListTable({ hookForm, userData }: Props) {
    const {
        data,
        run: getData,
        loading: getDataLoading,
    } = useRequest(RequestApi<any, TUserPermissionApiResponse[]>, {
        manual: true,
    });

    React.useEffect(() => {
        getData({
            method: 'GET',
            module: 'admin-user',
            url: 'permission-list',
        });
    }, [getData]);

    const ensureReadPermission = (permissions: string[], modulePermissions: any[], isChecked: boolean) => {
        const readPermission = modulePermissions.find(permission => permission.name === 'Read');
        if (isChecked) {
            if (readPermission && !permissions.includes(readPermission.id)) {
                permissions.push(readPermission.id);
            }
        } else {
            const otherPermissionsChecked = modulePermissions
                .filter(permission => permission.name !== 'Read')
                .some(permission => permissions.includes(permission.id));
            if (!otherPermissionsChecked && readPermission) {
                permissions = permissions.filter(permissionId => permissionId !== readPermission.id);
            }
        }
        return permissions;
    };

    const handleChange = (value: any, id: string, modulePermissions: any[]) => {
        const isChecked = value.target.checked;
        const currentPermissions = hookForm.watch('permissionId', []);
        let updatedPermissions;

        if (isChecked) {
            if (!currentPermissions.includes(id)) {
                updatedPermissions = [...currentPermissions, id];
            }
        } else {
            updatedPermissions = currentPermissions.filter((item: string) => item !== id);
        }

        updatedPermissions = ensureReadPermission(updatedPermissions, modulePermissions, isChecked);
        hookForm.setValue('permissionId', updatedPermissions);
    };

    const permissionItems = userData ? Object.values(userData.permissions) : [];
    const flattenedPermissions: any = permissionItems.flatMap(item => Object.values(item));
    const filteredPermissions = flattenedPermissions.filter((item: { checked: any }) => item.checked);

    const getCheckedValue = (p: string) => {
        if (!!hookForm) return (hookForm.getValues('permissionId') || []).includes(p);
        if (filteredPermissions.length > 0) return filteredPermissions.some((i: { id: string }) => i.id === p);
    };

    const makeArrayFourByOrder = (arr: any[]) => {
        return ['Read', 'Create', 'Update', 'Delete'].map(permission => {
            const existingPermission = arr.find(item => item.name.replace(/\d+/g, '') === permission);
            return (
                existingPermission || {
                    id: Math.random(),
                    name: '',
                    checked: false,
                }
            );
        });
    };

    return (
        <Skeleton paragraph={{ rows: 6 }} loading={getDataLoading}>
            <div className="w-full overflow-x-auto">
                <div className="flex flex-col">
                    <div className="flex justify-between bg-gray-100 rounded-md mb3">
                        <div className="flex-1 p-2 rounded-l-sm font-bold">Module Permission</div>
                    </div>
                    {data?.payload.map(item => (
                        <div key={item.module} className="grid grid-cols-5 items-center justify-start">
                            <div className="p-2 font-medium">{item.module}</div>
                            {makeArrayFourByOrder(item?.permissions)?.map(p => {
                                return (
                                    <div key={p.id} className="p-2 font-medium">
                                        {!!hookForm ? (
                                            <div className="flex items-center gap-x-2 gap-y-4">
                                                {p.name ? (
                                                    <>
                                                        <EducareCheckbox
                                                            checked={getCheckedValue(p.id)}
                                                            onChange={e => handleChange(e, p.id, item.permissions)}
                                                            name="permissionId"
                                                            hookForm={hookForm}
                                                            id={p.id}
                                                        />
                                                        <label htmlFor={p.id}>{p.name}</label>
                                                    </>
                                                ) : (
                                                    <span></span>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </Skeleton>
    );
}
