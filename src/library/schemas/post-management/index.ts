import type { TBaseEntityNoAuthor } from '@library/types';

interface Image {
    blurHash: string;
    imagePath: string;
}

interface UserInfo {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    email: string;
    profilePic: string | null;
    profilePicBlurHash: string | null;
    verified: boolean;
    userType: string;
    organizationUserType: string;
    status: number;
    signInPlatform: string;
    isAgreeToTermsAndCondition: boolean;
    enableTwoFactorAuthentication: boolean;
    isUserActive: boolean;
}
export interface EventData {
    createdAt: string;
    updatedAt: string;
    id: string;
    userId: string;
    title: string;
    description: string;
    images: {
        blurHash: string;
        imagePath: string;
    }[];
    reactionCount: number;
    shareCount: number;
    commentCount: number;
    location: string;
    region: string | null;
    city: string | null;
    longitude: number | null;
    latitude: number | null;
    eventType: string;
    shift: string;
    spot: string;
    duration: string;
    price: number;
    externalLink: string;
    fromDate: string;
    toDate: string;
    status: number;
    postBy: string;
    organizationUserType: string;
    userInfo: UserInfo;
}

export interface AccommodationData {
    createdAt: string;
    updatedAt: string;
    id: string;
    userId: string;
    title: string;
    description: string;
    images: {
        blurHash: string;
        imagePath: string;
    }[];
    reactionCount: number;
    shareCount: number;
    commentCount: number;
    postBy: string;
    organizationUserType: string;
    location: string;
    region: string | null;
    city: string | null;
    longitude: number;
    latitude: number;
    amenities: string[];
    price: number;
    priceType: string;
    availabilityDate: string;
    status: number;
    bedrooms: number;
    bathrooms: number;
    leaseLength: string;
    accommodation: string;
    smokingPolicies: string;
    furnishing: string;
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
    };
}

export type THouseAndAccommodationResponse = TBaseEntityNoAuthor & {
    userId: string;
    title: string;
    description: string;
    images: Image[];
    reactionCount: number;
    shareCount: number;
    commentCount: number;
    postBy: string;
    organizationUserType: string;
    location: string;
    region: string | null;
    city: string | null;
    longitude: number | null;
    latitude: number | null;
    amenities: string[];
    price: number;
    priceType: string;
    availabilityDate: string;
    bedrooms: number;
    bathrooms: number;
    leaseLength: string;
    accommodation: string;
    smokingPolicies: string;
    furnishing: string;
    userInfo: UserInfo;
    status: 1 | 2 | 3;
};
export type TScholarshipResponse = TBaseEntityNoAuthor & {
    userId: string;
    title: string;
    description: string;
    images: Image[];
    reactionCount: number;
    shareCount: number;
    commentCount: number;
    postBy: string;
    organizationUserType: string;
    location: string;
    region: string | null;
    city: string | null;
    longitude: number | null;
    latitude: number | null;
    renewability: string;
    amount: number;
    amountType: string;
    scholarshipType: string;
    fieldOfStudy: string;
    educationLevel: string;
    eligible: string;
    sponsorType: string;
    externalLink: string;
    deadline: string;
    status: 1 | 2 | 3;
    userInfo: UserInfo;
};

export type TNotificationResponse = {
    payload: Notification[];
    logId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    createdBy: string | null;
    updatedBy: string | null;
    deletedBy: string | null;
    documentId: string;
    id: string;
    title: string | null;
    content: string | null;
    notificationFrom: string;
    notificationTo: string | null;
    postType: string;
    postActivity: string;
    relatedDocumentId: string | null;
    isRead: boolean;
    isGlobalNotificationForAdmin: boolean;
    notificationFromInfo: {
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
        sub: string | null;
        isAgreeToTermsAndCondition: boolean;
        enableTwoFactorAuthentication: boolean;
        isUserActive: boolean;
        onboard: boolean;
        contactCountryCode: string;
        contactNumber: string;
        detailContactNumber: string;
        location: string;
        country: string | null;
        city: string | null;
        placeId: string | null;
        longitude: number | null;
        latitude: number | null;
    };
    post: {
        createdAt: string;
        updatedAt: string;
        id: string;
        documentId: string;
        userId: string;
        name: string;
        organizationName: string;
        organizationLogo: string;
        organizationLogoBlurHash: string;
        industry: string;
        jobTitle: string;
        title: string;
        post: string;
        salaryInterval: string | null;
        salaryRangeFrom: number | null;
        salaryRangeTo: number | null;
        isSalaryNegotiable: boolean;
        workArrangement: string[];
        jobType: string[];
        experienceLevel: string[];
        duration: string;
        educationLevel: string[];
        workAuthorization: string;
        aboutJob: string | null;
        roleIncludes: string | null;
        keyQualification: string | null;
        compensationOtherBenefit: string | null;
        applicationInstruction: string | null;
        externalLink: string;
        vacancy: number | null;
        reactionCount: number;
        shareCount: number;
        commentCount: number;
        viewCount: number;
        clickCount: number;
        location: string;
        region: string | null;
        city: string | null;
        longitude: number | null;
        latitude: number | null;
        status: number;
        postBy: string;
        organizationUserType: string;
        applicationDeadline: string;
    };
    comment: {
        comment: string;
    };
};
export type TNotificationCount = {
    nonce: number;
    status: number;
    message: string;
    payload: object;
    count: number;
    lastUnreadCount: number;
    logId: string;
};

export type TMarketplaceItemResponse = TBaseEntityNoAuthor & {
    userId: string;
    name: string;
    description: string;
    images: Image[];
    reactionCount: number;
    shareCount: number;
    commentCount: number;
    location: string;
    region: string | null;
    city: string | null;
    longitude: number | null;
    latitude: number | null;
    price: number;
    discountPrice: number;
    itemType: string;
    condition: string;
    offers: string;
    deliveryOption: string;
    listingDate: string;
    sellerName: string;
    sellerEmail: string;
    sellerMobile: string;
    status: 1 | 2 | 3;
    postBy: string;
    organizationUserType: string;
    userInfo: UserInfo;
};

export type TJobPostingResponse = TBaseEntityNoAuthor & {
    userId: string;
    organizationName: string;
    organizationLogo: string | null;
    organizationLogoBlurHash: string | null;
    industry: string;
    jobTitle: string;
    salaryInterval: string;
    salaryRangeFrom: number | null;
    salaryRangeTo: number | null;
    isSalaryNegotiable: boolean;
    workArrangement: string;
    jobType: string[];
    experienceLevel: string[];
    duration: string;
    educationLevel: string[];
    workAuthorization: string;
    aboutJob: string;
    roleIncludes: string | null;
    keyQualification: string | null;
    compensationOtherBenefit: string | null;
    applicationInstruction: string | null;
    externalLink: string;
    vacancy: number | null;
    reactionCount: number;
    shareCount: number;
    commentCount: number;
    location: string;
    region: string | null;
    city: string | null;
    longitude: number | null;
    latitude: number | null;
    status: 1 | 2 | 3;
    postBy: string;
    organizationUserType: string;
    applicationDeadline: string;
    userInfo: UserInfo;
};

export interface OrganisationInfo {
    createdAt: string;
    updatedAt: string;
    id: string;
    userId: string;
    name: string;
    logo: string;
    logoBlurHash: string;
    organisationType: string;
    dateOfFounding: string;
    location: string;
    longitude: number;
    latitude: number;
    contactCountryCode: string;
    contactNumber: string;
    detailContactNumber: string;
    placeId: string;
    organisationSizeFrom: number;
    organisationSizeTo: number;
    organisationDescription: string;
    socialMediaLinks: {
        tiktok: string;
        twitter: string;
        website: string;
        facebook: string;
        linkedin: string;
        instagram: string;
    };
}

export type TOrganisationProfileResponse = TBaseEntityNoAuthor & {
    name: string;
    email: string;
    logo: string | undefined;
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
    organisationInfo: OrganisationInfo;
};
type profileInfo = {
    city: string | null;
    contactCountryCode: string;
    contactNumber: string;
    country: string | null;
    createdAt: string;
    dateOfBirth: string | null;
    detailContactNumber: string;
    firstName: string;
    gender: 'male' | 'female' | 'other' | null;
    id: string;
    adminFirstName: string;
    adminLastName: string;
    lastName: string;
    latitude: number | null;
    longitude: number | null;
    location: string | null;
    updatedAt: string;
    userId: string;
};
export type TAdminData = {
    key: string;
    id: string;
    adminFirstName: string;
    adminLastName: string;
    createdAt: string;
    userId: string;
    name: string;
    email: string;
    phoneNumber: string;
    createdDate: Date;
    permission: string;
    status: string;
    profilePic: string;
    profilePicBlurHash: string;
    profileInfo: profileInfo;
};
export type Timestamps = {
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
};

export type User = {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    email: string;
    verified: boolean;
    status: number;
    profileInfo: TAdminDetails;
    userPermissions: UserPermission[];
};

export type TAdminDetails = Timestamps &
    User &
    UserPermission &
    PermissionDetail & {
        id: string;
        userId: string;
        adminFirstName: string;
        adminLastName: string;
        profilePic?: string | null;
        profilePicBlurHash?: string | null;
        dateOfBirth?: string | null;
        gender?: string | null;
        location?: string | null;
        country?: string | null;
        city?: string | null;
        longitude?: number | null;
        latitude?: number | null;
        region?: string | null;
        contactCountryCode: string;
        contactNumber: string;
        detailContactNumber: string;
        languages?: string[] | null;
        bio?: string | null;
        startDate?: string | null;
        endDate?: string | null;
        subject?: string | null;
        universityName?: string | null;
        degreeLevel?: string | null;
    };

export type UserPermission = {
    module: string;
    permissions: PermissionDetail[];
};

export type PermissionDetail = Timestamps & {
    id: string;
    name: string;
    title: string;
    checked: boolean;
    createdBy?: string | null;
    updatedBy?: string | null;
    deletedBy?: string | null;
};