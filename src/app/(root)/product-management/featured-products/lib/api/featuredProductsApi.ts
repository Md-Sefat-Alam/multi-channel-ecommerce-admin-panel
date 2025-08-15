import { apiSlice } from "@/lib/api/apiSlice";
import { IGetProducts } from "../../../products/lib/ProductTypes";

export const featuredProductsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateSorterFeaturedProducts: builder.mutation<
      IRes<IGetProducts[]>,
      { uuid: string; sorter: number }[]
    >({
      query: (data) => ({
        url: "/admin/product/featured-products/sorter",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["product-management/featured-product"],
    }),
    getFeaturedProducts: builder.query<IRes<IGetProducts[]>, IGetProps>({
      query: (data) => ({
        url: `/admin/product/featured-products`,
        method: "POST",
        body: data,
      }),
      providesTags: ["product-management/featured-product"],
    }),
    featuredProductUpdater: builder.mutation<
      IRes<IGetProducts[]>,
      { uuid: string }
    >({
      query: (data) => ({
        url: `/admin/product/add-or-remove-featured-products`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["product-management/featured-product"],
    }),
  }),
});

export const {
  useGetFeaturedProductsQuery,
  useUpdateSorterFeaturedProductsMutation,
  useFeaturedProductUpdaterMutation,
} = featuredProductsApi;
