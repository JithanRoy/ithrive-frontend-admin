import { z } from 'zod';

import type { TBaseResponse } from '@library/schemas';

export const FaqSchema = z
    .object({
        question: z.string().min(1, 'Question is required.'),
        answer: z.string().min(5, 'Answer is required.'),
    })
    .superRefine((args, ctx) => {
        const parsed = args.answer.replace(/<[^>]*>/g, '').trim(); // remove html tags and whitespaces
        if (parsed.length < 5) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'You need to write something of 5 characters',
                path: ['answer'],
            });
        }
    });

export type TFaqSchema = z.infer<typeof FaqSchema>;

export type TFaqResponse = TFaqSchema & TBaseResponse;
