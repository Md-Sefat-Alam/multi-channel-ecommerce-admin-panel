import { apiSlice } from "@/lib/api/apiSlice";


export const farmingBlogApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        postFarmingBlog: builder.mutation<any, FormData>({
            query: (data) => ({
                url: "/admin/farmingBlog/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["farming-blog"],
        }),
    }),
});

export const { usePostFarmingBlogMutation } = farmingBlogApi;
