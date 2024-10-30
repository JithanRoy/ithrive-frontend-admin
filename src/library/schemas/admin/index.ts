import { z } from 'zod';

const passwordRegex = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    specialChar: /[\^$*.[\]{}()?\-"!@#%&/,><':;|_~`]/,
};
export const AdminCrudSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string({ required_error: 'Email is required!' }).min(1, 'Email is required!').email('Email is not valid!'),
    contactNumber: z.string().min(1, 'Contact Number is required'),
    contactCountryCode: z.string().min(1, 'Contact Country Code is required'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .refine(value => passwordRegex.uppercase.test(value), {
            message: 'Password must contain at least one uppercase letter',
        })
        .refine(value => passwordRegex.lowercase.test(value), {
            message: 'Password must contain at least one lowercase letter',
        })
        .refine(value => passwordRegex.specialChar.test(value), {
            message: 'Password must contain at least one special character',
        }),
    permissionId: z.array(z.string()),
});

export type TAdminCrudSchema = z.infer<typeof AdminCrudSchema>;

export const PermissionLevelSchema = z.object({
    create: z.coerce.boolean().default(false),
    read: z.coerce.boolean().default(false),
    update: z.coerce.boolean().default(false),
    delete: z.coerce.boolean().default(false),
});

export const AdminPermissionSchema = z.object({
    socialPost: PermissionLevelSchema,
    homeOfficeUpdates: PermissionLevelSchema,
    userManagement: PermissionLevelSchema,
    postManagement: PermissionLevelSchema,
    userCommunication: PermissionLevelSchema,
    contentManagement: PermissionLevelSchema,
    inquiries: PermissionLevelSchema,
});

export type TAdminPermissionSchema = z.infer<typeof AdminPermissionSchema>;

export const AdminCrudSchemaWithPermissions = AdminCrudSchema.extend({
    permissions: AdminPermissionSchema,
});
export type TAdminCrudSchemaWithPermissions = z.infer<typeof AdminCrudSchemaWithPermissions>;

export const UpdateAdminSchema = z.object({
    email: z.string({ required_error: 'Email is required!' }).email('Email is not valid!'),
    firstName: z.string().min(1, 'First name is required!'),
    lastName: z.string().min(1, 'Last name is required!'),
    contactNumber: z.string().min(1, 'Contact Number is required'),
    contactCountryCode: z.string().min(1, 'Contact Country Code is required'),
    permissionId: z.array(z.string()),
});

export type TUpdateAdminSchema = z.infer<typeof UpdateAdminSchema>;
