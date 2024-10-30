import { z } from 'zod';

export const CommentSchema = z.object({
    id: z.string().min(1, 'id is required'),
    parentCommentId: z.string().optional(),
    comment: z.string().min(1, ' '),
});

export type TCommentSchema = z.infer<typeof CommentSchema>;
