export interface ICategoryGet {
  uuid: string;
  categoryName: string;
  categoryNameBn?: string;
  categoryDescription?: string;
  categoryDescriptionBn?: string;
  categoryImage?: string[];
  activeStatus: 0 | 1;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ICreateCategory {
  categoryName: string;
  categoryNameBn: string;
  categoryDescription?: string;
  categoryDescriptionBn?: string;
  activeStatus: 0 | 1;
}
