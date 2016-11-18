// Function Data

export interface SignInData {
    email:                  string;
    password:               string;
    userType?:              string;
}

export interface RegisterData {
    email:                  string;
    password:               string;
    passwordConfirmation:   string;
    userType?:              string;
}

export interface UpdatePasswordData {
    password:               string;
    passwordConfirmation:   string;
    passwordCurrent:        string;
    userType?:              string;
}

export interface ResetPasswordData {
    email:                  string;
    userType?:              string;
}

// State Data

export interface AuthData {
    accessToken:    string;
    client:         string;
    expiry:         string;
    tokenType:      string;
    uid:            string;
}

export interface UserData {
    id:             number;
    provider:       string; 
    uid:            string; 
    name:           string; 
    nickname:       string; 
    image:          any;
    email:          string;
}

// Configuration Options

export interface UserType {
    name:           string;
    path:           string;
}

export interface OAuthPaths {
    github?:        string;
}

export interface GlobalOptions {
    headers?:       { [key:string]: string; }
}

export interface Angular2TokenOptions {
    apiPath?:                   string;

    signInPath?:                string;
    signInRedirect?:            string;
    signInStoredUrlStorageKey?: string;

    signOutPath?:               string;
    validateTokenPath?:         string;
    signOutFailedValidate?:     boolean;

    deleteAccountPath?:         string;
    registerAccountPath?:       string;
    registerAccountCallback?:   string;

    updatePasswordPath?:        string;

    resetPasswordPath?:         string;
    resetPasswordCallback?:     string;

    userTypes?:                 UserType[];

    oAuthPaths?:                OAuthPaths;

    globalOptions?:             GlobalOptions;
}