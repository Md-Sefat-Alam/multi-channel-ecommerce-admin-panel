export interface IUserGet {
  uuid: string;
  userRole: "CUSTOMER"; // Why is it?
  fullName: string;
  fullNameBn?: string;
  mobileNumber: string;
  email: string;
  password: string; // Why is it?
  nationalID: number;
  gender: string;
  dob: string;
  division?: string;
  district?: string;
  thana?: string;
  postalCode?: number;
  address: string;
  userProfileImage?: string;
  nomineeFullName?: string;
  nomineeFullNameBn?: string;
  nomineeMobileNumber?: number;
  nomineeDob?: string;
  relationShip?: string;
  activeStatus: 1 | 0;
  remarks?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface ICreateCategory {
  categoryName: string;
  categoryNameBn: string;
  categoryDescription?: string;
  categoryImage?: string;
  activeStatus: 0 | 1;
}
