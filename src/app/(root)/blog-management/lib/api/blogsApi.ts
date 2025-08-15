import { apiSlice } from "@/lib/api/apiSlice";

export const blogsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postBlog: builder.mutation({
      query: (formData) => ({
        url: "/admin/farmingBlog/create",
        method: "POST",
        body: formData,
      }),
    }),
    getBlogById: builder.query({
      query: (id) => `/admin/farmingBlog/blog/${id}`,
    }),
    getAllBlogs: builder.query({
      query: () => `/admin/farmingBlog/allBlogs`,
    }),
    updateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/farmingBlog/update/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/admin/farmingBlog/category/create",
        method: "POST",
        body: data,
      }),
    }),
    getCategoryById: builder.query({
      query: (id) => `/admin/farmingBlog/category/${id}`, // Assumed endpoint
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/farmingBlog/category/update/${id}`, // Assumed endpoint
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  usePostBlogMutation,
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
  useCreateCategoryMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useGetAllBlogsQuery,
} = blogsApi;
