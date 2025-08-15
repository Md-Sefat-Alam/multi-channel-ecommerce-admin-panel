import { apiSlice } from "@/lib/api/apiSlice";
import { IUserGet, ICreateCategory } from "../UserTypes";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IRes<IUserGet[]>, IGetProps>({
      query: (data) => ({
        url: "/admin/user/fetch",
        method: "POST",
        body: data,
      }),
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation<IPostReturnType, { uuid: string }>({
      query: (data) => ({
        url: "/admin/user/delete",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery, useDeleteUserMutation } = userApi;
