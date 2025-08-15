import { apiSlice } from "@/lib/api/apiSlice";
import dayjs from "dayjs";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSalesCount: builder.query<
      IRes<{
        salesCount: number;
        percentageChange: number;
      }>,
      { dateRange: [dayjs.Dayjs, dayjs.Dayjs] }
    >({
      query: (data) => ({
        url: "/admin/dashboard/sales-count",
        method: "POST",
        body: data,
      }),
      providesTags: ["Dashboard"],
    }),
    getTodaySales: builder.query<
      IRes<{
        todaySalesCount: number;
        percentageChange: number;
      }>,
      void
    >({
      query: (data) => ({
        url: "/admin/dashboard/today-sales",
        method: "POST",
        body: data,
      }),
      providesTags: ["Dashboard"],
    }),
    getMonthlySales: builder.query<
      IRes<{
        currentMonthSalesCount: number;
        percentageChange: number;
      }>,
      void
    >({
      query: (data) => ({
        url: "/admin/dashboard/monthly-sales",
        method: "POST",
        body: data,
      }),
      providesTags: ["Dashboard"],
    }),
    getTotalClients: builder.query<
      IRes<{
        totalClientsCount: number;
      }>,
      void
    >({
      query: (data) => ({
        url: "/admin/dashboard/total-clients",
        method: "POST",
        body: data,
      }),
      providesTags: ["Dashboard", "CustomerUser"],
    }),
    pendingOrdersCount: builder.query<
      IRes<{
        pendingOrdersCount: number;
      }>,
      void
    >({
      query: (data) => ({
        url: "/admin/dashboard/pending-orders",
        method: "POST",
        body: data,
      }),
      providesTags: ["Dashboard"],
    }),
    getMonthlyMetrics: builder.query<
      IRes<{
        months: string[];
        sales: number[];
        clients: number[];
      }>,
      void
    >({
      query: (data) => ({
        url: "/admin/dashboard/monthly-metrics",
        method: "POST",
        body: data,
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetSalesCountQuery,
  useGetTodaySalesQuery,
  useGetMonthlySalesQuery,
  useGetTotalClientsQuery,
  usePendingOrdersCountQuery,
  useGetMonthlyMetricsQuery,
} = userApi;
