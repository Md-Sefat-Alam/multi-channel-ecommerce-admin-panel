import { apiSlice } from "@/lib/api/apiSlice";
import { IOrderGet, OrderDetails } from "../orderType";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<IRes<IOrderGet[]>, IGetProps>({
      query: (data) => ({
        url: "/admin/order",
        method: "POST",
        body: data,
      }),
      providesTags: ["Order"],
    }),
    getOrdersDetails: builder.query<IRes<OrderDetails>, string>({
      query: (id) => ({
        url: `/admin/order/details/${id}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    updateOrderStatus: builder.mutation<
      IRes<OrderDetails>,
      { uuid: string; status: string }
    >({
      query: (data) => ({
        url: `/admin/order/update-status`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    updatePaymentStatus: builder.mutation<
      IRes<any>,
      { paymentId: string; status: string }
    >({
      query: (data) => ({
        url: `/admin/order/update-payment`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrdersDetailsQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
} = orderApi;
