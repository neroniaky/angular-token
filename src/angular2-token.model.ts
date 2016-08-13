export interface UserType {
    name: string;
    path: string;
}

export interface AuthData {
    accessToken: string;
    client: string;
    expiry: string;
    tokenType: string;
    uid: string;
}

export interface Angular2TokenOptions {
    apiPath?: string;
    signInPath?: string;
    signOutPath?: string;
    registerAccountPath?: string,
    deleteAccountPath?: string,
    validateTokenPath?: string;
    updatePasswordPath?: string;
    userTypes?: UserType[];
}
