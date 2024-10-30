import type { TBaseEntityNoAuthor } from '@library/types';

export type TSupperCenterResponse = TBaseEntityNoAuthor & {
    ticketNumber: number;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    email: string;
    subject: string;
    message: string;
    status: 1 | 2;
};
