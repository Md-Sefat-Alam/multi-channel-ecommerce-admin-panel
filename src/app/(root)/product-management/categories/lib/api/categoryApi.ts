import { apiSlice } from "@/lib/api/apiSlice";
import { ICategoryGet, ICreateCategory } from "../CategoryTypes";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategory: builder.query<IRes<ICategoryGet[]>, IGetProps>({
      query: (data) => ({
        url: "/admin/category/fetch",
        method: "POST",
        body: data,
      }),
      providesTags: ["Category"],
    }),
    getSingleCategory: builder.query<
      IRes<ICategoryGet>,
      {
        uuid: string;
      }
    >({
      query: (data) => ({
        url: "/admin/category/fetch-by-uuid",
        method: "POST",
        body: data,
      }),
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation<IPostReturnType, FormData>({
      query: (data) => ({
        url: "/admin/category/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    editCategory: builder.mutation<IPostReturnType, any>({
      query: (data) => ({
        url: "/admin/category/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useEditCategoryMutation,
  useGetSingleCategoryQuery,
} = categoryApi;
