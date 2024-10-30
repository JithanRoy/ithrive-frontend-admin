import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { z } from 'zod';

export const ZodInternationalPhoneNumberSchema = z
    .object({
        code: z.string().optional(),
        number: z.number({ required_error: 'Phone number is required!' }).min(1, 'Phone number is required!').nonnegative('Phone number is required'),
    })
    .refine(
        data => {
            const { code, number } = data;
            const fullNumber = `${code}${number}`;
            const parsedNumber = parsePhoneNumberFromString(fullNumber);
            return parsedNumber?.isValid() ?? false;
        },
        {
            message: 'Invalid phone number',
            path: ['number'],
        },
    );

export type TBaseResponse = {
    createdAt: Date;
    updatedAt: Date;
    id: string;
};

export type TFileUpload = {
    fileName: string;
    fileExtension: string;
    fileSize: number;
    folder: 'socialPost'; // add more folder types here when needed
};

export type TFileArrayUpload = {
    files: Array<TFileUpload>;
};

export type TFIleUploadResponse = {
    signedUrl: string;
    filename: string;
};
export type UserPermissionType = TBaseResponse & {
    name: string;
    title: string;
    checked: boolean;
};

export type TUserPermissionApiResponse = {
    module: string;
    permissions: UserPermissionType[];
};
