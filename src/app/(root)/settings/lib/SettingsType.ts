export interface IHeroImagePost {
  heroTitle: string;
  subTitle: string;
  products: string;
  images: object;
  activeStatus: 0 | 1;
}
export interface IHeroImageGet {
  uuid: string;
  sorter: number;
  heroTitle: string;
  subTitle: string;
  products: string;
  images: string;
  activeStatus: 0 | 1;
}
