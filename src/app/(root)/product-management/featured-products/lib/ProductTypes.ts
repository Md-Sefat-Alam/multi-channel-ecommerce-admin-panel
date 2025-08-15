import { ICustomerPost } from "@/app/(root)/farming/lib/types";

export interface IGetProducts extends ICustomerPost {
  uuid: string;
  activeStatus: 1;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy?: string;
}
