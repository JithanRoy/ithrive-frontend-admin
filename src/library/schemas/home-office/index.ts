import { z } from 'zod';

import { CategoryEnum, LegislativeChangeTypeEnum, UserTypeEnum, VisaTypeEnum } from '@library/enums';
import type { TBasicUserInfo } from '@library/schemas/login';
import type { TBaseEntity } from '@library/types';
export const HomeOfficeUpdateSchema = z.object({
    typeOfVisa: z.nativeEnum(VisaTypeEnum, { required_error: 'Visa Type is required' }).default(VisaTypeEnum.STUDENT),
    legislativeChanges: z
        .nativeEnum(LegislativeChangeTypeEnum, { required_error: 'Legislative Changes is required' })
        .default(LegislativeChangeTypeEnum.NEW_LAWS),
    category: z.nativeEnum(CategoryEnum, { required_error: 'Category is required' }).default(CategoryEnum.IMMIGRATION_LAWS),
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    image: z
        .array(
            z.object({
                imagePath: z.string(),
            }),
        )
        .min(1, { message: 'At least one image is required' }),
});

export type THomeOfficeSchema = z.infer<typeof HomeOfficeUpdateSchema>;

export type THomeOfficeUpdateResponse = TBaseEntity & {
    createdBy: string;
    updatedBy: string;
    isDeleted: boolean;
    isUserActive: true;
    id: string;
    category: CategoryEnum;
    typeOfVisa: VisaTypeEnum;
    legislativeChanges: LegislativeChangeTypeEnum;
    title: string;
    description: string;
    image: string;
    imageBlurHash: string;
    userId: string;
    reactionCount: number;
    shareCount: number;
    commentCount: number;
    status: number;
    userInfo: TBasicUserInfo;
};

export interface UserInfo {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    email: string;
    profilePic: string | null;
    profilePicBlurHash: string | null;
    verified: boolean;
    userType: string;
    organizationUserType: string | null;
    status: number;
    signInPlatform: string;
    isAgreeToTermsAndCondition: boolean;
    enableTwoFactorAuthentication: boolean;
    isUserActive: boolean;
}

export interface PayloadData {
    createdAt: string;
    updatedAt: string;
    id: string;
    userId: string;
    category: CategoryEnum;
    typeOfVisa: VisaTypeEnum;
    legislativeChanges: LegislativeChangeTypeEnum;
    title: string;
    description: string;
    image: string;
    imageBlurHash: string;
    status: number;
    reactionCount: number;
    shareCount: number;
    commentCount: number;
    userInfo: UserInfo;
}

export interface HomeOfficeResponseData {
    typeOfVisa: any;
    nonce: number;
    status: number;
    message: string;
    payload: PayloadData;
    logId: string;
}
