import { apiSlice } from "@/lib/api/apiSlice";
import { IProductPost } from "../types";

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postProduct: builder.mutation<any, FormData>({
      query: (data) => ({
        url: "/admin/product/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["product-management/product"],
    }),
  }),
});

export const { usePostProductMutation } = customerApi;
