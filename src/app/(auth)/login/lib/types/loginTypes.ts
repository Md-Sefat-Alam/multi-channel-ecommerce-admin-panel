export interface ILoginForm {
  email: string;
  password: string;
}

export interface ILoginUser {
  uuid: string;
  userRole: "admin";
  fullName: string;
  userRoleId: number;
  fullNameBn: string;
  mobileNumber: string;
  email: string;
  nationalID?: string;
  gender?: string;
  dob?: string;
  division?: string;
  district?: string;
  thana?: string;
  postalCode?: string;
  address?: string;
  userProfileImage?: string;
  nomineeFullName?: string;
  nomineeFullNameBn?: string;
  nomineeMobileNumber?: string;
  nomineeDob?: string;
  relationShip?: string;
  activeStatus: 1;
  remarks?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface ILoginResponse {
  data: ILoginUser;
  authentication: {
    accessToken: string;
    sessionId: string;
    refreshToken: string;
  };
  message: string;
}
