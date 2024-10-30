import React from 'react';
import { useForm } from 'react-hook-form';
import { useDeepCompareEffect, useRequest } from 'ahooks';

import { Form, Modal } from 'antd';

import { getCountries, getCountryCallingCode } from 'libphonenumber-js';

import EducareButton from '@components/shared/educare-button';
import EducareInput from '@components/shared/educare-input';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import EducateSelect from '@components/shared/educare-select';
import { zodResolver } from '@hookform/resolvers/zod';
import RequestApi from '@library/apis/request.api';
import type { AddOrEditStateFormProps, AddOrEditStateProps } from '@library/hooks';
import { useAddOrEditState, useWindowSize } from '@library/hooks';
import type { TAdminCrudSchema, TAdminCrudSchemaWithPermissions } from '@library/schemas/admin';
import { AdminCrudSchema, UpdateAdminSchema } from '@library/schemas/admin';
import type { TAdminDetails } from '@library/schemas/post-management';

import PermissionListTable from './PermissionTable';

const FormComponent = ({
    type,
    onClose,
    editStateId,
    data,
    onValue,
    onlyPermission,
    onSearch,
}: AddOrEditStateFormProps & { onlyPermission: boolean }) => {
    const { run: onAdminUpdateApi, loading: onAdminUpdateLoading } = useRequest(RequestApi<TAdminCrudSchema, TAdminCrudSchemaWithPermissions>, {
        manual: true,
        onSuccess: data => {
            onSearch && onSearch('');
            setTimeout(() => onClose('reload'), 50);
            EducareMessageAlert(data?.message || 'Admin updated successfully');
        },
        onError: (error: any) => {
            EducareMessageAlert(error?.error?.fields[0]?.message || 'Update Admin failed', 'error');
        },
    });

    const { run: onAdminCreateApi, loading: onAdminCreateLoading } = useRequest(RequestApi<TAdminCrudSchema, TAdminCrudSchemaWithPermissions>, {
        manual: true,
        onSuccess: data => {
            onSearch && onSearch('');
            setTimeout(() => onClose('reload'), 50);
            EducareMessageAlert(data?.message || 'Admin added successfully');
        },
        onError: (error: any) => {
            EducareMessageAlert(error.error.fields[0].message || 'Add Admin failed', 'error');
        },
    });

    const onSubmit = async (payload: TAdminCrudSchema) => {
        if (type === 'create') {
            onAdminCreateApi({
                module: 'admin-user',
                method: 'POST',
                url: 'create',
                payload: payload,
            });
        } else {
            onAdminUpdateApi({
                module: 'admin-user',
                method: 'PUT',
                url: `${data?.id}`,
                payload: payload,
            });
        }
    };

    const hookForm = useForm<TAdminCrudSchema>({
        resolver: zodResolver(type === 'create' ? AdminCrudSchema : UpdateAdminSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            contactNumber: '',
            contactCountryCode: '+44',
            password: '',
            permissionId: [],
        },
    });
    const { data: apiData, run: getData } = useRequest(RequestApi<any, TAdminDetails>);
    useDeepCompareEffect(() => {
        if (type === 'update') {
            getData({ version: 'v1', method: 'GET', module: 'admin-user', url: `${data?.id}` });
            const adminPermission: TAdminDetails | undefined = apiData?.payload;
            if (adminPermission) {
                const permissionItems = adminPermission.userPermissions.map(item => item.permissions);
                const filteredPermissions = permissionItems.flat().filter(permission => permission.checked);
                const permissionIds = filteredPermissions.map(permission => permission.id);
                const defaultValues = {
                    firstName: adminPermission?.profileInfo?.adminFirstName || '',
                    lastName: adminPermission?.profileInfo?.adminLastName || '',
                    email: adminPermission?.email || '',
                    contactNumber: adminPermission?.profileInfo?.contactNumber || '',
                    contactCountryCode: adminPermission?.profileInfo?.contactCountryCode || '+44',
                    permissionId: permissionIds,
                };
                hookForm.reset(defaultValues);
            }
        }
    }, [apiData?.payload, hookForm]);

    const onCancel = (what: 'reload' | 'cancel' = 'reload') => {
        hookForm.reset();
        onClose(what);
    };
    const loading = onAdminCreateLoading || onAdminUpdateLoading;
    return (
        <Form onFinish={hookForm.handleSubmit(onSubmit)}>
            {!onlyPermission && (
                <>
                    <div className="grid md:grid-cols-8 gap-5 my-5">
                        <div className="md:col-span-2">
                            <EducareInput type="text" hookForm={hookForm} required name="firstName" label="First Name" placeholder="First Name" />
                        </div>
                        <div className="md:col-span-2">
                            <EducareInput type="text" hookForm={hookForm} required name="lastName" label="Last Name" placeholder="Last Name" />
                        </div>
                        <div className="md:col-span-3">
                            <EducareInput type="email" hookForm={hookForm} required name="email" label="Email" placeholder="Email" />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-8 gap-5">
                        <div className="md:col-span-4">
                            <EducareInput
                                type="text"
                                hookForm={hookForm}
                                style={{ boxShadow: 'none' }}
                                required
                                name="contactNumber"
                                label="Contact Number"
                                placeholder="Contact number"
                                addonBefore={
                                    <span>
                                        <EducateSelect
                                            hookForm={hookForm}
                                            required
                                            name="contactCountryCode"
                                            options={getCountries().map(c => ({
                                                label: `+${getCountryCallingCode(c)}`,
                                                value: `+${getCountryCallingCode(c)}`,
                                            }))}
                                        />
                                    </span>
                                }
                            />
                        </div>
                        {type !== 'update' && (
                            <>
                                <div className="md:col-span-3">
                                    <EducareInput
                                        type="password"
                                        hookForm={hookForm}
                                        required
                                        className="h-15"
                                        name="password"
                                        label="Password"
                                        placeholder="Password"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="my-8">
                        <PermissionListTable hookForm={hookForm} />
                    </div>
                </>
            )}
            <div className="flex items-center justify-center gap-5 py-10">
                <EducareButton variant="reset" htmlType="reset" disabled={onAdminCreateLoading} onClick={() => onCancel('cancel')}>
                    Cancel
                </EducareButton>
                <EducareButton variant="filled" loading={loading} htmlType="submit">
                    Submit
                </EducareButton>
            </div>
        </Form>
    );
};

const AddAdminModal = (props: AddOrEditStateProps & { onlyPermission: boolean }) => {
    const { type, isOpen, onClose, editStateId, onValue, data, onSearch } = useAddOrEditState(props);
    const { isSm } = useWindowSize();

    return (
        <Modal
            centered
            destroyOnClose
            forceRender
            footer={null}
            maskClosable={false}
            open={isOpen}
            confirmLoading
            width={isSm ? '95vw' : '85vw'}
            onCancel={() => onClose('cancel')}
            title={type === 'create' ? 'Add Admin' : 'Update Admin'}>
            {isOpen && (
                <FormComponent
                    onSearch={onSearch}
                    type={type}
                    editStateId={editStateId}
                    data={data}
                    onClose={onClose}
                    onValue={onValue}
                    onlyPermission={props.onlyPermission}
                />
            )}
        </Modal>
    );
};

export default AddAdminModal;
