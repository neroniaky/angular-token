// Function Data
import { Provider } from '@angular/core';

export interface SignInData {
  login:                  string;
  password:               string;
  userType?:              string;
}

export interface RegisterData {
  login:                  string;
  password:               string;
  passwordConfirmation:   string;
  name?:                  string;
  userType?:              string;
}

export interface RegisterData {
  [key: string]: string | undefined;
}

export interface UpdatePasswordData {
  password:               string;
  passwordConfirmation:   string;
  passwordCurrent?:       string;
  userType?:              string;
  resetPasswordToken?:    string;
}

export interface ResetPasswordData {
  login:                  string;
  userType?:              string;
}

// API Response Format

export interface ApiResponse {
  status?: string;
  success?: boolean;
  statusText?: string;
  data?: UserData;
  errors?: any;
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
  login:          string;
}

// Configuration Options

export interface UserType {
  name:           string;
  path:           string;
}

export interface TokenInAppBrowser<T extends {}, Y extends {}> {
  create(url: string, target?: string, options?: string | Y): T;
}

export interface TokenPlatform {
  is(platformName: string): boolean;
}

export interface AngularTokenOptions {
  angularTokenOptionsProvider?: Provider;

  apiBase?:                   string;
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
  loginField?:                string;

  oAuthBase?:                 string;
  oAuthPaths?:                { [key: string]: string; };
  oAuthCallbackPath?:         string;
  oAuthWindowType?:           string;
  oAuthWindowOptions?:        { [key: string]: string; };
  oAuthBrowserCallbacks?:     { [key: string]: string; };
}
