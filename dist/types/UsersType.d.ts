export interface UsersType {
    id?: string;
    apps: {
        crm: {
            access: string;
            allowed: boolean;
            role: string;
        };
        www: {
            allowed: boolean;
        };
    };
    createdAt: string;
    email: string;
    firstname: string;
    lastname: string;
    updatedAt: string;
}
