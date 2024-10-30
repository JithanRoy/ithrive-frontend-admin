import { z } from 'zod';

import { SocialPostCategoryEnum } from '@library/enums';
import type { TBasicUserInfo } from '@library/schemas/login';
import type { TBaseEntity, TImageEntity } from '@library/types';

export const SocialPostSchema = z
    .object({
        category: z.nativeEnum(SocialPostCategoryEnum, { required_error: 'Category is required' }).default(SocialPostCategoryEnum.SOCIAL_ENGAGEMENT),
        post: z.string().min(10, { message: 'You need to write something of 10 characters' }),
        statusBackgroundColor: z.any().optional().nullable(),
        images: z
            .array(
                z.object({
                    imagePath: z.string(),
                }),
            )
            .default([]),
    })
    .superRefine((args, ctx) => {
        const parsedPost = args.post.replace(/<[^>]*>/g, '').trim(); // remove html tags and whitespaces
        if (parsedPost.length < 10) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'You need to write something of 10 characters',
                path: ['post'],
            });
        }
    });

export type TSocialPostSchema = z.infer<typeof SocialPostSchema>;

export type TSocialPostResponse = TBaseEntity & {
    category: SocialPostCategoryEnum;
    id: string;
    commentCount: number;
    isDeleted: boolean;
    isShared: boolean;
    mainPostId: string | null;
    post: string;
    postBy: string;
    reactionCount: number;
    shareCount: number;
    shareThought: string | null;
    shareUserInfo: string | null;
    sharedBy: string | null;
    statusBackgroundColor: { deg: number; name: string; colors: Array<string> };
    userId: string;
    userInfo: TBasicUserInfo;
    images: Array<TImageEntity>;
};
export type CommentResponse = {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    createdBy: string;
    updatedBy: string;
    deletedBy: string | null;
    id: string;
    userId: string;
    socialPostId: string;
    parentCommentId: string | null;
    reactionCount: number;
    replyCount: number;
    comment: string;
    postUserId: string | null;
    userInfo: {
        createdAt: string;
        updatedAt: string;
        id: string;
        name: string;
        email: string;
        profilePic: string;
        profilePicBlurHash: string;
        verified: boolean;
        userType: string;
        organizationUserType: string;
        status: number;
        signInPlatform: string;
        isAgreeToTermsAndCondition: boolean;
        enableTwoFactorAuthentication: boolean;
        isUserActive: boolean;
        contactCountryCode: string | null;
        contactNumber: string | null;
        detailContactNumber: string | null;
        location: string | null;
        country: string | null;
        city: string | null;
        placeId: string | null;
        longitude: number | null;
        latitude: number | null;
    };
    isReactedToComment: boolean;
};
