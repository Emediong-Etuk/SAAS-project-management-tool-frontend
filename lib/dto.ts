export type VerifyEmailResponse = {
  data: {
    token: string;
    tenantId: string;
    user: object;
  };
};

export type LoginResponse = {
  data: {
    token: string;
    tenantId: string;
    user: object;
  };
};

export type PasswordTokenResponse = {
  message: string;
};

export type ResetPasswordResponse = {
  message: string;
};
