import React, { type Dispatch, type SetStateAction } from 'react';
import type { FileType } from 'next/dist/lib/file-exists';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { useDeepCompareEffect, useRequest, useSafeState, useUpdateEffect } from 'ahooks';

import { Form, Switch, type UploadFile } from 'antd';

import { useRecoilValue } from 'recoil';
import { UserInfoAtom } from '@store/UserInfoAtom';

import SocialPostTaxonomy from '@components/app/social-post/atoms/SocialPostTaxonomy';
import IthriveButton from '@components/shared/iThrive-button';
import EducareInput from '@components/shared/educare-input';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import EducareRichEditor from '@components/shared/educare-rich-editor';
import EducareUpload, { useEducareUpload } from '@components/shared/educare-upload';
import { zodResolver } from '@hookform/resolvers/zod';
import RequestApi from '@library/apis/request.api';
import { SocialPostCategoryEnum } from '@library/enums';
import { funcToBase64, getImagePathToLink } from '@library/functions';
import type { AddOrEditStateFormProps, AddOrEditStateProps } from '@library/hooks';
import { useAddOrEditState, useWindowSize } from '@library/hooks';
import type { TSocialPostResponse, TSocialPostSchema } from '@library/schemas/social-post';
import { SocialPostSchema } from '@library/schemas/social-post';
import type { Gradient } from '@library/types/shared';
import { MdOutlineClose } from '@react-icons/all-files/md/MdOutlineClose';

const Drawer = dynamic(() => import('antd').then(m => m.Drawer), { ssr: false });

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
    const [currentScreen, setCurrentScreen] = currentScreenState;
    const [fileList, setFileList] = useSafeState<UploadFile[]>([]);
    const [useRichEditor, setUseRichEditor] = useSafeState<boolean>(false);
    const [disabled, setDisabled] = useSafeState<boolean>(false);
    const [gradients, setGradients] = useSafeState<Gradient>({
        name: 'Gradient 1',
        colors: ['#1c11b8a3', '#1B11B8'],
        deg: 45,
    });
    const [base64Images, setBase64Images] = useSafeState<Record<string, string>[]>([]);
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

    const hookForm = useForm<TSocialPostSchema>({
        mode: 'onChange',
        resolver: zodResolver(SocialPostSchema),
        defaultValues: {
            category: SocialPostCategoryEnum.SOCIAL_ENGAGEMENT,
            post: '',
            images: [],
            statusBackgroundColor: gradients || undefined,
        },
    });
    useDeepCompareEffect(() => {
        if (gradients !== undefined) {
            hookForm.setValue('statusBackgroundColor', gradients);
        }
    }, [gradients]);

    const { loading: existingSocialPostLoading } = useRequest(RequestApi<null, TSocialPostResponse>, {
        ready: type === 'update' && !!editStateId,
        defaultParams: [
            {
                method: 'GET',
                module: 'social-post',
                url: editStateId,
            },
        ],
        onSuccess: data => {
            const images = data?.payload?.images.map(image => ({ imagePath: image.imagePath }));
            hookForm.reset({
                category: data?.payload?.category,
                post: data?.payload?.post,
                statusBackgroundColor: data?.payload?.statusBackgroundColor,
                images,
            });
            setGradients(data?.payload?.statusBackgroundColor);
            setFileList(
                images
                    ?.filter(f => !!f.imagePath)
                    ?.map((i, idx) => {
                        const ext = i?.imagePath?.split('.').pop();
                        return {
                            uid: idx.toString(),
                            status: 'done',
                            name: i.imagePath,
                            url: getImagePathToLink(i.imagePath),
                            type: ext ? `image/${ext}` : 'image/jpg',
                        };
                    }),
            );
        },
    });
    const { uploadImages, loading: uploadImagesApiLoading } = useEducareUpload();

    const { run: onCreateSocialPostApi, loading: createSocialPostApiLoading } = useRequest(RequestApi<TSocialPostSchema, TSocialPostResponse>, {
        manual: true,
        onSuccess: data => {
            onValue?.(data?.payload?.id);
            setTimeout(() => onCancel('reload'), 1000);
            EducareMessageAlert(data?.message || 'Social post created successfully');
        },
        onError: (error: any) => {
            EducareMessageAlert(error?.error?.systems || 'Failed to create social post', 'error');
        },
    });

    const { run: onUpdateSocialPostApi, loading: updateSocialPostApiLoading } = useRequest(RequestApi<TSocialPostSchema, TSocialPostResponse>, {
        manual: true,
        onSuccess: data => {
            onValue?.(data?.payload?.id);
            setTimeout(() => onCancel('reload'), 1000);
            EducareMessageAlert(data?.message || 'Social post updated successfully');
        },
        onError: (error: any) => {
            EducareMessageAlert(error?.error?.systems || 'Failed to update social post', 'error');
        },
    });
    const onSubmit = async (payload: TSocialPostSchema) => {
        if (currentScreen === 'preview') {
            const files = fileList
                .filter(f => !f.url)
                .map(f => ({
                    folder: 'socialPost' as const,
                    fileName: f.name.split('.').slice(0, -1).join('.').replace(/\s+/g, ''),
                    fileExtension: (f.type ?? 'image/jpeg').split('/')[1],
                    fileSize: f.size as number,
                    originFileObj: f.originFileObj as File,
                }));
            const images = await uploadImages(files);
            payload.images = [...fileList.filter(f => !!f.url).map(f => ({ imagePath: f.name })), ...images.map(f => ({ imagePath: f }))];

            if (type === 'create') {
                onCreateSocialPostApi({
                    method: 'POST',
                    module: 'social-post',
                    url: '',
                    payload,
                });
            } else {
                onUpdateSocialPostApi({
                    method: 'PUT',
                    module: 'social-post',
                    url: editStateId,
                    payload,
                });
            }
        } else {
            setCurrentScreen('preview');
        }
    };
    const onCancel = (what: 'reload' | 'cancel' = 'reload') => {
        hookForm.reset();
        setFileList([]);
        onClose(what);
    };

    const loading = existingSocialPostLoading || uploadImagesApiLoading || createSocialPostApiLoading || updateSocialPostApiLoading;

    const onChange = (checked: boolean) => {
        setUseRichEditor(checked);
    };

    const changeText = useRichEditor ? 'Disable rich text' : 'Enable rich text';

    React.useEffect(() => {
        const postValue = hookForm.watch('post');
        if (postValue && postValue.startsWith('<')) {
            setUseRichEditor(true);
        } else {
            setUseRichEditor(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hookForm.watch('post')]);

    const toggleInput = () => <Switch checked={useRichEditor} disabled={disabled} onChange={onChange} />;

    return (
        <Form onFinish={hookForm.handleSubmit(onSubmit)}>
            {currentScreen !== 'preview' && (
                <div className="flex justify-end mt-3 gap-2">
                    {changeText} {toggleInput()}
                </div>
            )}
            {currentScreen === 'write' ? (
                <div className="flex flex-col gap-5 mt-5">
                    {!useRichEditor ? (
                        <EducareInput
                            type="textarea"
                            autoSize={{ minRows: 8 }}
                            hookForm={hookForm}
                            required
                            name="post"
                            label="Post"
                            placeholder="Write your thoughts..."
                        />
                    ) : (
                        <EducareRichEditor hookForm={hookForm} required name="post" label="Post" placeholder="Write your thoughts..." />
                    )}
                    <EducareUpload
                        fileLength={fileList.length}
                        sizeInMb={2}
                        maxCount={10}
                        buttonText="Upload Images"
                        instructionText={`(382*382 or larger recommended, up to ${2}MB each and upto 10 images)`}
                        fileList={fileList}
                        setFileList={({ fileList: newFileList }) => setFileList(newFileList)}
                    />
                </div>
            ) : (
                <SocialPostTaxonomy
                    id="preview"
                    noAction={true}
                    useRichEditor={useRichEditor}
                    deletable={false}
                    editable={false}
                    gradient={gradients}
                    setGradient={setGradients}
                    text={hookForm.getValues('post')}
                    images={fileList.map((f, index) => ({
                        imagePath: f.url || (base64Images[index]?.imagePath as unknown as string) || '',
                        blurHash: '',
                    }))}
                    user={userInfo}
                    updatedAt={new Date().toISOString()}
                />
            )}
            <div className="flex items-center justify-center gap-5 mt-5">
                <IthriveButton variant="reset" htmlType="reset" disabled={loading} onClick={() => onCancel('cancel')}>
                    Cancel
                </IthriveButton>
                <IthriveButton variant="filled" loading={loading} htmlType="submit">
                    {currentScreen === 'write' ? 'Preview' : 'Post'}
                </IthriveButton>
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
                    <IthriveButton
                        type="link"
                        icon={<MdOutlineClose size={20} />}
                        onClick={() => {
                            onClose('cancel');
                        }}
                    />
                ) : (
                    <IthriveButton type="text" className="text-primary" onClick={() => setCurrentScreen('write')}>
                        Edit Post
                    </IthriveButton>
                )
            }
            title={
                type === 'create'
                    ? currentScreen === 'write'
                        ? 'Add social post'
                        : 'Preview social post'
                    : currentScreen === 'write'
                      ? 'Update social post'
                      : 'Preview update social post'
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
