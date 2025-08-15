import { apiSlice } from "@/lib/api/apiSlice";
import { IGetProducts } from "../ProductTypes";

// Define types for the updateProductField request
interface UpdateProductFieldRequest {
  uuid: string;
  price?: number;
  stock?: number;
  discount?: number;
}

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProduct: builder.query<IRes<IGetProducts[]>, IGetProps>({
      query: (data) => ({
        url: `/admin/product/fetch`,
        method: "POST",
        body: data,
      }),
      providesTags: ["product-management/product"],
    }),
    deleteProduct: builder.mutation<IRes<IGetProducts[]>, { uuid: string }>({
      query: (data) => ({
        url: `/admin/product/delete`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["product-management/product"],
    }),
    // Add the new updateProductField endpoint
    updateProductField: builder.mutation<
      IRes<IGetProducts>,
      UpdateProductFieldRequest
    >({
      query: (data) => ({
        url: `/admin/product/update-field`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["product-management/product"],
    }),
  }),
});

export const {
  useGetProductQuery,
  useDeleteProductMutation,
  useUpdateProductFieldMutation,
} = productApi;
