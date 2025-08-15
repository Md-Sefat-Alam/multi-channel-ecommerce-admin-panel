import { apiSlice } from "@/lib/api/apiSlice";
import { IHeroImageGet } from "../SettingsType";

export const settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSetting: builder.mutation<
      void,
      { title: string; config: Object; remarks?: string }
    >({
      query: (data) => ({
        url: "/admin/setting/create-and-update",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["setting"],
    }),
    postHeroImage: builder.mutation<any, FormData>({
      query: (data) => ({
        url: "/admin/settings/add-hero-image",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["setting/hero-image"],
    }),
    fetchHeroImages: builder.query<IRes<IHeroImageGet[]>, IGetProps>({
      query: (data) => ({
        url: "/admin/settings/hero-image/fetch",
        method: "POST",
        body: data,
      }),
      providesTags: ["setting/hero-image"],
    }),
    updateSorterHero: builder.mutation<
      IRes<IHeroImageGet[]>,
      { uuid: string; sorter: number }[]
    >({
      query: (data) => ({
        url: "/admin/settings/hero-image/sorter",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["setting/hero-image"],
    }),
    updateActiveStatusHero: builder.mutation<
      IRes<IHeroImageGet[]>,
      { uuid: string; activeStatus: 0 | 1 | -1 }
    >({
      query: (data) => ({
        url: "/admin/settings/hero-image/status",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["setting/hero-image"],
    }),
  }),
});

export const {
  useCreateSettingMutation,
  usePostHeroImageMutation,
  useFetchHeroImagesQuery,
  useUpdateSorterHeroMutation,
  useUpdateActiveStatusHeroMutation,
} = settingsApi;
