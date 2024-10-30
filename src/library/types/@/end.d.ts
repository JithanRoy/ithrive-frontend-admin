declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_TELEMETRY_DISABLED: number;
            RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: boolean;

            PORT: number;
            NEXT_PUBLIC_API_URL: string;
            NEXT_PUBLIC_AWS_URL: string;
        }
    }
}

export {};
