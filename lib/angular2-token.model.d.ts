export interface SignInData {
    email: string;
    password: string;
    userType?: string;
}
export interface RegisterData {
    email: string;
    password: string;
    passwordConfirmation: string;
    name?: string;
    userType?: string;
}
export interface RegisterData {
    [key: string]: string;
}
export interface UpdatePasswordData {
    password: string;
    passwordConfirmation: string;
    passwordCurrent?: string;
    userType?: string;
    resetPasswordToken?: string;
}
export interface ResetPasswordData {
    email: string;
    userType?: string;
}
export interface AuthData {
    accessToken: string;
    client: string;
    expiry: string;
    tokenType: string;
    uid: string;
}
export interface UserData {
    id: number;
    provider: string;
    uid: string;
    name: string;
    nickname: string;
    image: any;
    email: string;
}
export interface UserType {
    name: string;
    path: string;
}
export interface GlobalOptions {
    headers?: {
        [key: string]: string;
    };
}
export interface Angular2TokenOptions {
    apiBase?: string;
    apiPath?: string;
    signInPath?: string;
    signInRedirect?: string;
    signInStoredUrlStorageKey?: string;
    signOutPath?: string;
    validateTokenPath?: string;
    signOutFailedValidate?: boolean;
    deleteAccountPath?: string;
    registerAccountPath?: string;
    registerAccountCallback?: string;
    updatePasswordPath?: string;
    resetPasswordPath?: string;
    resetPasswordCallback?: string;
    userTypes?: UserType[];
    oAuthBase?: string;
    oAuthPaths?: {
        [key: string]: string;
    };
    oAuthCallbackPath?: string;
    oAuthWindowType?: string;
    oAuthWindowOptions?: {
        [key: string]: string;
    };
    globalOptions?: GlobalOptions;
}
