import { apiSlice } from "@/lib/api/apiSlice";
import { ICustomerEdit } from "../types";

export const customerApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        editProduct: builder.mutation<any, FormData>({
            query: (data) => ({
                url: "/admin/product/update",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["product-management/product"],
        }),
    }),
});

export const { useEditProductMutation } = customerApi;
