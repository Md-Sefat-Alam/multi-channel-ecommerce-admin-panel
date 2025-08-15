export interface ICustomerPost {
    title: string;
    subTitle?: string;
    description: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    finalPrice: number;
    stock?: number | null;
    lowStockAlert?: number;
    restockDate?: string; // ISO date string
    unitType: "KG" | "LITER" | "PIECES" | "METER" | "GRAM" | "ML" | "other";
    categoryId: string; // UUID format, v4
    activeStatus?: 0 | 1; // Defaults to 1 if not specified
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;
    tags: string[]; // Required array of strings, can be empty
    variants?: Record<string, unknown>; // Generic object for variants
    averageRating?: number; // Range from 0 to 5

    images: Array<object>;
}
