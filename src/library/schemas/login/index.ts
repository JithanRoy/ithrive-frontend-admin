import { z } from 'zod';

import { UserTypeEnum } from '@library/enums';
import type { TBaseEntity } from '@library/types';

export const LoginSchema = z.object({
    email: z.string().email({ message: 'Email not valid' }),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    userType: z.nativeEnum(UserTypeEnum, { required_error: 'User type is required' }),
});

export type TLoginSchema = z.infer<typeof LoginSchema>;

export type TBasicUserInfo = {
    id: string;
    email: string;
    name: string;
    profilePic: string | null;
    profilePicBlurHash: string | null;
    userType: string;
};

export type TLoginResponse = {
    userInfo: TBasicUserInfo &
        TBaseEntity & {
            verified: boolean;
            organizationUserType: string | null;
            status: number;
            signInPlatform: string;
            isAgreeToTermsAndCondition: boolean;
            organisationInfo: string | null;
        };
    refreshToken: string;
    accessToken: string;
    permissions: any;
    expiration: number;
    feedViewPermissionOrganisation: never[];
};
