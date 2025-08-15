import { apiSlice } from "@/lib/api/apiSlice";
import { ILoginForm, ILoginResponse } from "../types/loginTypes";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // getInsurer: builder.mutation<any, IInsurerGetProps>({
        //   query: (data) => ({
        //     url: "/client/product/fetch",
        //     method: "POST",
        //     body: data,
        //   }),
        // }),
        login: builder.mutation<ILoginResponse, ILoginForm>({
            query: (data) => ({
                url: "/admin/user/login",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useLoginMutation } = userApi;
