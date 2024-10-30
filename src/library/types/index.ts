export type TAnyRecord = {
    [x: string]: any;
};

export type THttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type TRequestApiResponse<ResponsePayload> = {
    logId: string;
    nonce: number;
    status: number;
    message: string;
    payload: ResponsePayload;
};

export type TApiPaginatedPayload = {
    page: number;
    limit: number;
    [x: string]: any;
};

export type TApiPaginatedResponse<T> = TRequestApiResponse<T[]> & {
    metadata: {
        limit: number;
        page: number;
        total: number;
        totalCount: number;
        totalPage: number;
    };
};

export type TBaseEntityNoAuthor = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};

export type TBaseEntity = TBaseEntityNoAuthor & {
    createdBy: string;
    updatedBy: string;
};

export type TImageEntity = {
    blurHash: string;
    imagePath: string;
};
