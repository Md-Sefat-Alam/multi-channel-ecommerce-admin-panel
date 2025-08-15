import { IProductPost } from "../create-product/lib/types";

export interface IGetProducts extends IProductPost {
  uuid: string;
  activeStatus: 1;
  isFeaturedProduct: boolean;
  featuredSortOrder: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy?: string;
}
