export type TReportManagementResponse = {
    createdAt: string;
    updatedAt: string;
    id: string;
    ticketNumber: number;
    userId: string;
    reportToUserId: string;
    postId: string;
    reportFor: string;
    reasonForReport: [];
};
type ReportReason =
    | 'Harmful or Abusive'
    | 'Spam or Misleading'
    | 'Copyright Infringement'
    | 'Bullying or Harassment'
    | 'Nudity or Sexually Suggestive Content'
    | 'Hate Speech';

type UserInfo = {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    email: string;
    profilePic: string;
    profilePicBlurHash: string;
    verified: boolean;
    userType: string;
    organizationUserType: string | null;
    status: number;
    signInPlatform: string;
    sub: string | null;
    isAgreeToTermsAndCondition: boolean;
    profileIsPublic: boolean;
    enableTwoFactorAuthentication: boolean;
    isUserActive: boolean;
    onboard: boolean;
    contactCountryCode: string | null;
    contactNumber: string | null;
    detailContactNumber: string | null;
    ethnicity: string | null;
    location: string | null;
    country: string | null;
    city: string | null;
    placeId: string | null;
    longitude: number | null;
    latitude: number | null;
};
type UserProfile = {
    createdAt: string;
    updatedAt: string;
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    adminFirstName: string | null;
    adminLastName: string | null;
    profilePic: string;
    profilePicBlurHash: string;
    dateOfBirth: string | null;
    gender: string | null;
    location: string;
    country: string;
    city: string;
    longitude: number;
    region: string | null;
    latitude: number;
    contactCountryCode: string | null;
    contactNumber: string;
    detailContactNumber: string | null;
    languages: string[];
    bio: string;
    startDate: string | null;
    endDate: string | null;
    subject: string;
    universityName: string;
    degreeLevel: string;
    ethnicity: string | null;
};
type OrganisationProfile = {
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
    country: string | null;
    city: string | null;
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
};
type UserInfoList = {
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
    profileIsPublic: boolean;
    enableTwoFactorAuthentication: boolean;
    isUserActive: boolean;
    onboard: boolean;
    contactCountryCode: string;
    contactNumber: string;
    detailContactNumber: string;
    ethnicity: string | null;
    location: string;
    country: string | null;
    city: string | null;
    placeId: string | null;
    longitude: number | null;
    latitude: number | null;
};

type ReportedEvent = {
    createdAt: string;
    updatedAt: string;
    id: string;
    post?: string;
    statusBackgroundColor?: any;
    aboutJob: string;
    roleIncludes: string;
    keyQualification: string;
    compensationOtherBenefit: string;
    applicationInstruction: string;
    workAuthorization: string;
    vacancy: string;
    applicationDeadline: string;
    userId: string;
    eventType: string;
    scholarshipType?: string;
    fieldOfStudy?: string;
    educationLevel: string;
    deadline: string;
    eligible: string;
    sponsorType: string;
    renewability: string;
    shift: string;
    spot: string;
    jobType: [string];
    experienceLevel: [string];
    workArrangement: [string];
    industry: string;
    duration: string;
    externalLink: string;
    availabilityDate: string;
    bedrooms: string;
    bathrooms: string;
    amount?: number;
    amountType?: string;
    leaseLength: string;
    accommodation: string;
    smokingPolicies: string;
    furnishing: string;
    profilePic?: any;
    userInfo?: UserInfoList;
    email?: string;
    images?: [
        {
            blurHash: string;
            imagePath: string;
        },
    ];
    title?: string;
    profileInfo?: UserProfile;
    organisationInfo?: OrganisationProfile;
    detailContactNumber?: string;
    name: string;
    description: string;
    profilePicBlurHash?: string;
    reactionCount: number;
    shareCount: number;
    commentCount: number;
    viewCount: number;
    userType: string;
    clickCount: number;
    location: string;
    region: string | null;
    city: string | null;
    postCode: string | null;
    longitude: number;
    latitude: number;
    price: number;
    discountPrice: number;
    itemType: string;
    condition: string;
    offers: string;
    deliveryOption: string;
    sellerName: string;
    sellerEmail: string;
    sellerMobile: string;
    status: number;
    postBy: string;
    organizationUserType: string | null;
};

type UserReport = {
    createdAt: string;
    updatedAt: string;
    id: string;
    ticketNumber: number;
    userId: string;
    reportToUserId: string;
    postId: string;
    actionStatus: string;
    reportFor: string;
    reasonForReport: ReportReason[];
    otherReason: string | null;
    userInfo: UserInfo | null;
};

export type TReportManagementDetails = {
    userReport: UserReport;
    reportedBy: UserInfo;
    reportedByOthers: any[];
    reportedEvent: ReportedEvent;
};

type ReportPayload = {
    createdAt: string;
    updatedAt: string;
    id: string;
    ticketNumber: number;
    userId: string;
    reportToUserId: string;
    postId: string;
    actionStatus: string;
    reportFor: string;
    reasonForReport: string[];
    otherReason: string | null;
};

export type TReportResponse = {
    nonce: number;
    status: number;
    message: string;
    payload: ReportPayload;
    logId: string;
};
