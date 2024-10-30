import { useRequest, useSafeState } from 'ahooks';

import type { GetProp, UploadFile, UploadProps } from 'antd';
import { Image, Upload } from 'antd';
import type { DraggerProps } from 'antd/lib/upload/Dragger';

import IthriveButton from 'src/components/shared/iThrive-button';
import EducareMessageAlert from '@components/shared/educare-message-alert';
import RequestApi from '@library/apis/request.api';
import UploadRequestApi from '@library/apis/upload-request.api';
import type { TFileArrayUpload, TFileUpload, TFIleUploadResponse } from '@library/schemas';
import { AiOutlineClose } from '@react-icons/all-files/ai/AiOutlineClose';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
export const GetEducareUploadBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

export const useEducareUpload = () => {
    const { runAsync: onUploadImagesPresignedUrlApi, loading: uploadImagesPresignedUrlApiLoading } = useRequest(
        RequestApi<TFileArrayUpload, TFIleUploadResponse[]>,
        {
            manual: true,
        },
    );

    const { runAsync: onUploadImagesApi, loading: uploadImagesApiLoading } = useRequest(UploadRequestApi, {
        manual: true,
    });

    const uploadImages = async (files: Array<TFileUpload & { originFileObj: File }>) => {
        try {
            const res = await onUploadImagesPresignedUrlApi({
                version: 'v1',
                module: 'file',
                method: 'POST',
                url: 'generate-multiple-pre-sign-url',
                payload: { files: files.map(f => ({ ...f, originFileObj: undefined })) },
            });
            const successfulUploads: string[] = [];
            for (const file of files) {
                const signed = res?.payload?.find(f => f.filename.includes(file.fileName));
                if (signed?.signedUrl) {
                    try {
                        await onUploadImagesApi({
                            method: 'PUT',
                            url: signed.signedUrl,
                            payload: file.originFileObj,
                        });
                        successfulUploads.push(signed.filename);
                    } catch (error) {
                        // console.error("Error uploading image:", error);
                    }
                } else {
                    // console.error("Signed URL not found for file:", file.fileName);
                }
            }
            return successfulUploads;
        } catch (error) {
            // console.error("Error:", error);
            return [];
        }
    };
    return {
        uploadImages,
        loading: uploadImagesPresignedUrlApiLoading || uploadImagesApiLoading,
    };
};

const EducareUpload = ({
    sizeInMb,
    maxCount = 1,
    buttonText = 'Upload Image',
    instructionText,
    setFileList,
    fileLength,
    ...props
}: Omit<DraggerProps, 'onChange' | 'onPreview'> & {
    buttonText: string;
    instructionText: string;
    sizeInMb: number;
    fileLength?: number;
    setFileList: DraggerProps['onChange'];
}) => {
    const [previewOpen, setPreviewOpen] = useSafeState(false);
    const [previewImage, setPreviewImage] = useSafeState('');

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await GetEducareUploadBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    const onChange: DraggerProps['onChange'] = ({ file, fileList: newFileList }) => {
        const isImg = file.type?.startsWith('image/');
        if (!isImg) {
            EducareMessageAlert('You can only upload image file!', 'error');
            return;
        }
        const isRightMb = (file?.size || 0) / 1024 / 1024 < sizeInMb;
        if (!isRightMb) {
            EducareMessageAlert(`Image must smaller than ${sizeInMb}MB!`, 'error');
            return;
        }
        setFileList && setFileList({ file, fileList: newFileList });
    };

    return (
        <>
            <Upload.Dragger
                action="#"
                multiple={true}
                accept="image/*"
                progress={{ strokeWidth: 2, showInfo: false }}
                showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                    removeIcon: (
                        <AiOutlineClose
                            size={20}
                            className="border border-primary rounded-full bg-white text-black absolute -top-[50px] -right-[20px]"
                        />
                    ),
                }}
                listType="picture-card"
                {...props}
                beforeUpload={() => false}
                maxCount={maxCount}
                onChange={onChange}
                onPreview={handlePreview}>
                <div className="grid place-items-center gap-2">
                    <IthriveButton disabled={fileLength === maxCount} variant="filled">
                        {buttonText}
                    </IthriveButton>
                    <p className="ant-upload-hint">{instructionText}</p>
                </div>
            </Upload.Dragger>

            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: visible => setPreviewOpen(visible),
                        afterOpenChange: visible => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                    alt="preview"
                />
            )}
        </>
    );
};

export default EducareUpload;
