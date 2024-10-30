export enum UserTypeEnum {
    ADMIN = 'admin',
    ORGANIZATION = 'organization',
    STUDENT = 'student',
}

export enum SocialPostCategoryEnum {
    BUSINESS_IDEA = 'business-idea',
    SOCIAL_ENGAGEMENT = 'social-engagement',
}

export enum SupperCenterStatusEnum {
    Pending = '1',
    Completed = '2',
}
export enum ReportManagementStatusEnum {
    PENDING = 'Pending',
    UNDER_REVIEW = 'Under review',
    IGNORED = 'Ignored',
    RESOLVED = 'Resolved',
    SUSPENDED_USER = 'Suspended user',
    DELETE_USER = 'Delete user',
}

export enum ReportReason {
    'Harmful or Abusive' = 'This includes content that is hateful, threatening, or promotes violence.',
    'Spam or Misleading' = 'This includes posts that are irrelevant, promotional, or contain false information.',
    'Copyright Infringement' = 'This includes content that violates someone elses intellectual property rights.',
    'Bullying or Harassment' = 'This includes posts that target or intimidate individuals.',
    'Nudity or Sexually Suggestive Content' = 'This includes posts that are sexually explicit or inappropriate.',
    'Hate Speech' = 'This includes content that promotes discrimination or hatred based on race, ethnicity, religion, gender, sexual orientation, or other protected characteristics.',
    'Self-Harm or Suicide' = 'This includes content that promotes or encourages self-harm or suicide.',
    'Fraudulent Listing' = 'This listing is clearly fake or misleading.',
    'Discriminatory Language' = 'This listing contains language that is discriminatory based on race, ethnicity, religion, gender, sexual orientation, or other protected characteristics.',
    'Incorrect or Outdated Information' = 'This listing contains inaccurate or outdated information about the property.',
    'Safety Concerns' = 'This listing highlights potential safety hazards or concerns.',
    'Violation of Terms of Service' = 'This listing violates the platforms terms of service or community guidelines.',
    'Offensive or Harmful Content' = 'This listing contains offensive, harmful, or discriminatory content.',
    'Spam or Misleading Advertising' = 'This listing is primarily promotional or contain false or misleading claims.',
    'Others' = '',
}
export enum ApprovalStatusEnum {
    Pending = '1',
    Verified = '2',
    Rejected = '3',
}
export enum ApprovalAdminEnum {
    Active = '1',
    Inactive = '0',
}

export enum UserApprovalStatusEnum {
    Pending = '1',
    Verified = '2',
    Inactive = '0',
}

export enum LocalStorageEnum {
    APP_SIDEBAR_COLLAPSE = '__app_sidebar_collapse',
    APP_SIDEBAR_OPEN_KEYS = '__app_sidebar_open_keys',
}

export enum VisaTypeEnum {
    STUDENT = 'student',
    WORK_VISA = 'work-visa',
    SHORT_TERM_STUDY_VISA = 'short-term-study-visa',
}
export enum CategoryEnum {
    IMMIGRATION_LAWS = 'immigration-laws',
    SECURITY_UPDATES = 'security-updates',
    LEGAL_CHANGES = 'legal-changes',
    RESIDENCY_RULES = 'residency-rules',
}
export enum LegislativeChangeTypeEnum {
    NEW_LAWS = 'new-laws',
    AMENDMENTS = 'amendments',
}
export enum PermissionModulesEnum {
    HOME_OFFICE_UPDATES = 'Home office updates',
    USER_MANAGEMENT = 'User Management',
    POST_MANAGEMENT = 'Post Management',
    SUPPORT_CENTER = 'Support center',
    CONTENT_MANAGEMENT = 'Content management',
    INQUIRIES_MANAGEMENT = 'Inquiries management',
    SOCIAL_POST = 'Social Post',
    REPORT_MANAGEMENT = 'Report management',
}
export enum PermissionActionsEnum {
    CREATE = 'Create',
    READ = 'Read',
    UPDATE = 'Update',
    DELETE = 'Delete',
}

export enum PostEnum {
    SOCIAL_POST = 'social-post',
    SCHOLARSHIP = 'scholarship',
    MARKETPLACE = 'marketplace',
    JOB = 'job',
    HOUSING_ACCOMMODATION = 'housing-accommodation',
    EVENT = 'event',
    HOME_OFFICE = 'home-office',
    ADMIN = 'admin',
    USER_MANAGEMENT = 'user-management',
    ORGANISATION = 'organisation',
    REPORT_MANAGEMENT = 'report-management',
}

export enum PostActivityEnum {
    ACCOUNT_APPROVED = 'account-approved',
    ACCOUNT_APPROVED_REQUEST = 'account-approval-request',
    ADMIN_POST_APPROVED = 'admin-post-approved',
    ADMIN_POST_REJECTED = 'admin-post-rejected',

    POST_REACTION = 'post-reaction',
    POST_APPROVAL = 'post-approval',
    SHARE = 'share',

    COMMENT_REACTION = 'comment-reaction',
    COMMENT_REPLY_REACTION = 'comment-reply-reaction',
    COMMENT = 'comment',
    COMMENT_REPLY = 'comment-reply',
}
export enum SocketEnum {
    ORGANISATION_ADMIN_APPROVE = 'organisation-admin-approve',

    SOCIAL_POST_NOTIFICATION_COMMENT = 'social-post-notification-comment',
    SOCIAL_POST_ENGAGEMENT_COUNTER = 'social-post-engagement-counter',
    SOCIAL_POST_DELETE = 'social-post-delete',
    SOCIAL_POST_REPLY_ENGAGEMENT_COUNTER = 'social-post-reply-engagement-counter',

    HOUSING_ACCOMMODATION_ENGAGEMENT_COUNTER = 'housing-accommodation-engagement-counter',
    HOUSING_ACCOMMODATION_NOTIFICATION_COMMENT = 'housing-accommodation-notification-comment',
    HOUSING_ACCOMMODATION_DELETE_POST = 'housing-accommodation-delete-post',
    HOUSING_ACCOMMODATION_REPLY_ENGAGEMENT_COUNTER = 'housing-accommodation-reply-engagement-counter',

    SCHOLARSHIP_ENGAGEMENT_COUNTER = 'scholarship-engagement-counter',
    SCHOLARSHIP_NOTIFICATION_COMMENT = 'scholarship-notification-comment',
    SCHOLARSHIP_DELETE_POST = 'scholarship-delete-post',
    SCHOLARSHIP_REPLY_ENGAGEMENT_COUNTER = 'scholarship-reply-engagement-counter',

    EVENT_ENGAGEMENT_COUNTER = 'event-engagement-counter',
    EVENT_NOTIFICATION_COMMENT = 'event-notification-comment',
    EVENT_POST_DELETE = 'event-post-delete',
    EVENT_REPLY_ENGAGEMENT_COUNTER = 'event-reply-engagement-counter',

    JOB_DELETE_POST = 'job-delete-post',
    JOB_ENGAGEMENT_COUNTER = 'job-engagement-counter',
    JOB_NOTIFICATION_COMMENT = 'job-notification-comment',
    JOB_REPLY_ENGAGEMENT_COUNTER = 'job-reply-engagement-counter',

    PRODUCT_ENGAGEMENT_COUNTER = 'product-engagement-counter',
    PRODUCT_NOTIFICATION_COMMENT = 'product-notification-comment',
    PRODUCT_POST_DELETE = 'product-post-delete',
    PRODUCT_REPLY_ENGAGEMENT_COUNTER = 'product-reply-engagement-counter',

    HOME_OFFICE_ENGAGEMENT_COUNTER = 'home-office-engagement-counter',
    HOME_OFFICE_NOTIFICATION_COMMENT = 'home-office-notification-comment',
    HOME_OFFICE_POST_DELETE = 'home-office-post-delete',
    HOME_OFFICE_REPLY_ENGAGEMENT_COUNTER = 'home-office-reply-engagement-counter',

    NOTIFICATION = 'notification',
    NOTIFICATION_ADMIN = 'notification-admin',
    ADMIN_POST_APPROVAL = 'admin-post-approval',
}
