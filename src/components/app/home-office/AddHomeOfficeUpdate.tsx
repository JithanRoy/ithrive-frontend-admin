import React, { type Dispatch, type SetStateAction } from 'react';
import type { FileType } from 'next/dist/lib/file-exists';
import { useForm } from 'react-hook-form';
import { useDeepCompareEffect, useRequest, useSafeState, useUpdateEffect } from 'ahooks';

import { Drawer, Form, type UploadFile } from 'antd';

import { useRecoilValue } from 'recoil';
import { UserInfoAtom } from '@store/UserInfoAtom';

import EducareButton from '@components/shared/educare-button';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import EducareUpload, { useEducareUpload } from '@components/shared/educare-upload';
import { zodResolver } from '@hookform/resolvers/zod';
import RequestApi from '@library/apis/request.api';
import { CategoryEnum, LegislativeChangeTypeEnum, VisaTypeEnum } from '@library/enums';
import { funcEnumToOptions, funcToBase64, getImagePathToLink } from '@library/functions';
import type { AddOrEditStateFormProps, AddOrEditStateProps } from '@library/hooks';
import { useAddOrEditState, useWindowSize } from '@library/hooks';
import type { THomeOfficeSchema, THomeOfficeUpdateResponse } from '@library/schemas/home-office';
import { HomeOfficeUpdateSchema } from '@library/schemas/home-office';
import { MdOutlineClose } from '@react-icons/all-files/md/MdOutlineClose';

import EducareInput from '../../shared/educare-input';
import EducareSelect from '../../shared/educare-select';

import HomeOfficeTaxonomy from './atoms/HomeOfficeTaxonomy';

const FormComponent = ({
    type,
    onClose,
    editStateId,
    onValue,
    currentScreenState,
}: AddOrEditStateFormProps & {
    currentScreenState: ['write' | 'preview', Dispatch<SetStateAction<'write' | 'preview'>>];
}) => {
    const { userInfo } = useRecoilValue(UserInfoAtom);
    const [base64Images, setBase64Images] = useSafeState<Record<string, string>[]>([]);
    const [currentScreen, setCurrentScreen] = currentScreenState;
    const [fileList, setFileList] = useSafeState<UploadFile[]>([]);
    const [imageErrorFlag, setImageErrorFlag] = useSafeState<boolean>(false);

    const hookForm = useForm<THomeOfficeSchema>({
        mode: 'onChange',
        resolver: zodResolver(HomeOfficeUpdateSchema),
        defaultValues: {
            image: [{ imagePath: '' }],
            typeOfVisa: VisaTypeEnum.STUDENT,
            title: '',
            description: '',
            legislativeChanges: LegislativeChangeTypeEnum.NEW_LAWS,
            category: CategoryEnum.IMMIGRATION_LAWS,
        },
    });

    useDeepCompareEffect(() => {
        const convertFilesToBase64 = async () => {
            const convertedFiles = await Promise.all(
                fileList.map(async file => {
                    if (file.url) {
                        return {
                            imagePath: file.url || 'base64' || '',
                            blurHash: '',
                        };
                    } else {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        const base64 = await funcToBase64(file.originFileObj as FileType);
                        return {
                            imagePath: base64 || '',
                            blurHash: '',
                        };
                    }
                }),
            );
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setBase64Images(convertedFiles);
        };
        convertFilesToBase64();
    }, [fileList]);
    const { loading: homeOfficeDataLoading } = useRequest(RequestApi<null, THomeOfficeUpdateResponse>, {
        ready: type === 'update' && !!editStateId,
        defaultParams: [
            {
                method: 'GET',
                module: 'home-office',
                url: editStateId,
            },
        ],
        onSuccess: data => {
            const editData = data.payload;
            hookForm.reset({
                typeOfVisa: editData.typeOfVisa || VisaTypeEnum.STUDENT,
                image: editData.image ? [{ imagePath: data.payload.image }] : [],
                legislativeChanges: editData.legislativeChanges || LegislativeChangeTypeEnum.NEW_LAWS,
                description: editData.description || '',
                title: editData.title || '',
                category: editData.category || CategoryEnum,
            });
            setFileList([
                {
                    uid: '0',
                    status: 'done',
                    name: data.payload.image,
                    url: getImagePathToLink(data.payload.image),
                    type: 'image/jpeg',
                },
            ]);
        },
    });
    const { uploadImages, loading: uploadImagesApiLoading } = useEducareUpload();
    const { run: onCreateHomeOfficeUpdateApi, loading: createUpdatePostApiLoading } = useRequest(
        RequestApi<THomeOfficeSchema, THomeOfficeUpdateResponse>,
        {
            manual: true,
            onSuccess: data => {
                onValue?.(data?.payload?.id);
                setTimeout(() => onCancel('reload'), 1000);
                EducareMessageAlert(data?.message || 'Post created successfully');
            },
            onError: (error: any) => {
                EducareMessageAlert(error?.error?.systems || 'Failed to create post', 'error');
            },
        },
    );

    const { run: onUpdateHomeOfficeApi, loading: updateHomeOfficePostApiLoading } = useRequest(
        RequestApi<THomeOfficeSchema, THomeOfficeUpdateResponse>,
        {
            manual: true,
            onSuccess: data => {
                onValue?.(data?.payload?.id);
                setTimeout(() => onCancel('reload'), 1000);
                EducareMessageAlert(data?.message || 'Post updated successfully');
            },
            onError: (error: any) => {
                EducareMessageAlert(error?.error?.systems || 'Failed to update post', 'error');
            },
        },
    );
    const onSubmit = async (payload: THomeOfficeSchema) => {
        if (fileList.length === 0) {
            setImageErrorFlag(true);
        } else {
            if (currentScreen === 'preview') {
                const files = fileList
                    .filter(f => !f.url)
                    .map(f => ({
                        folder: 'homeOffice' as const,
                        fileName: f.name.split('.').slice(0, -1).join('.').replace(/\s+/g, ''),
                        fileExtension: (f.type ?? 'image/jpg').split('/')[1],
                        fileSize: f.size as number,
                        originFileObj: f.originFileObj as File,
                    }));
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const images = await uploadImages(files);
                const uploadedImages = [...fileList.filter(f => !!f.url).map(f => ({ imagePath: f.name })), ...images.map(f => ({ imagePath: f }))];
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                payload.image = uploadedImages[0].imagePath;
                if (type === 'create') {
                    onCreateHomeOfficeUpdateApi({
                        method: 'POST',
                        module: 'home-office',
                        url: '',
                        payload,
                    });
                } else {
                    onUpdateHomeOfficeApi({
                        method: 'PUT',
                        module: 'home-office',
                        url: editStateId,
                        payload,
                    });
                }
            } else {
                setCurrentScreen('preview');
            }
        }
    };
    const onCancel = (what: 'reload' | 'cancel' = 'reload') => {
        hookForm.reset();
        setFileList([]);
        onClose(what);
    };
    const loading = homeOfficeDataLoading || uploadImagesApiLoading || createUpdatePostApiLoading || updateHomeOfficePostApiLoading;
    return (
        <Form onFinish={hookForm.handleSubmit(onSubmit)}>
            {currentScreen === 'write' ? (
                <div className="flex flex-col gap-5 mt-5 px-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <EducareSelect
                            hookForm={hookForm}
                            name="typeOfVisa"
                            label="Type of visa"
                            required
                            options={funcEnumToOptions(VisaTypeEnum)}
                        />
                        <EducareSelect hookForm={hookForm} name="category" label="Category" required options={funcEnumToOptions(CategoryEnum)} />
                        <EducareSelect
                            hookForm={hookForm}
                            name="legislativeChanges"
                            required
                            label="Legislative changes"
                            options={funcEnumToOptions(LegislativeChangeTypeEnum)}
                        />
                    </div>
                    <EducareInput type="text" hookForm={hookForm} required name="title" label="Title" placeholder="Title" />
                    <EducareInput
                        type="textarea"
                        autoSize={{ minRows: 5 }}
                        hookForm={hookForm}
                        required
                        name="description"
                        label="Description"
                        placeholder="Description"
                    />
                    <EducareUpload
                        fileLength={fileList.length}
                        sizeInMb={1}
                        maxCount={1}
                        buttonText="Upload Image"
                        instructionText={`(382*382 or larger recommended, up to ${1}MB each and upto 1 image)`}
                        fileList={fileList}
                        setFileList={({ fileList: newFileList }) => {
                            setFileList(newFileList);
                            setImageErrorFlag(false);
                        }}
                    />
                    {imageErrorFlag && <span className="right-0 text-red-600 bottom-50 -mt-8">Image is required</span>}
                </div>
            ) : (
                <HomeOfficeTaxonomy
                    description={hookForm.getValues('description')}
                    title={hookForm.getValues('title')}
                    image={fileList[0].thumbUrl ? (base64Images.length > 0 ? base64Images[0]?.imagePath : '') : (fileList[0].url as string)}
                    // image={fileList[0].thumbUrl ? (fileUrl as unknown as string) : (fileList[0].url as string)}
                    imageBlurHash=""
                    id="preview"
                    noAction={true}
                    deletable={false}
                    editable={false}
                    user={userInfo}
                    updatedAt={new Date().toISOString()}
                />
            )}
            <div className="flex items-center justify-center gap-5 mt-5">
                <EducareButton variant="reset" htmlType="reset" disabled={loading} onClick={() => onCancel('cancel')}>
                    Cancel
                </EducareButton>
                <EducareButton variant="filled" loading={loading} htmlType="submit">
                    {currentScreen === 'write' ? 'Preview' : 'Post'}
                </EducareButton>
            </div>
        </Form>
    );
};

const AddSocialPostModal = (props: AddOrEditStateProps) => {
    const { type, isOpen, onClose, editStateId, onValue } = useAddOrEditState(props);
    const [currentScreen, setCurrentScreen] = useSafeState<'write' | 'preview'>('write');
    const { isSm } = useWindowSize();

    useUpdateEffect(() => {
        if (!isOpen) setCurrentScreen('write');
    }, [isOpen]);

    return (
        <Drawer
            destroyOnClose
            forceRender
            footer={null}
            maskClosable={false}
            open={isOpen}
            width={isSm ? '95vw' : '75vw'}
            closeIcon={null}
            extra={
                currentScreen === 'write' ? (
                    <EducareButton
                        type="link"
                        icon={<MdOutlineClose size={20} />}
                        onClick={() => {
                            onClose('cancel');
                        }}
                    />
                ) : (
                    <EducareButton type="text" className="text-primary" onClick={() => setCurrentScreen('write')}>
                        Edit Post
                    </EducareButton>
                )
            }
            title={
                type === 'create'
                    ? currentScreen === 'write'
                        ? 'Add update'
                        : 'Preview update'
                    : currentScreen === 'write'
                      ? 'Update home office '
                      : 'Preview'
            }>
            {isOpen && (
                <FormComponent
                    type={type}
                    editStateId={editStateId}
                    onClose={onClose}
                    onValue={onValue}
                    currentScreenState={[currentScreen, setCurrentScreen]}
                />
            )}
        </Drawer>
    );
};

export default AddSocialPostModal;
