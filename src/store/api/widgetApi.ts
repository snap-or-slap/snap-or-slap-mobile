import { baseApi, toApiError } from './baseApi';
import { getSummary } from '../../features/widget/services/widget.service';

// ── API ──────────────────────────────────────────────────────────

export const widgetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWidgetSummary: builder.query<unknown, void>({
      queryFn: async () => {
        try {
          const data = await getSummary();
          return { data };
        } catch (error) {
          return toApiError(error);
        }
      },
      providesTags: ['Widget'],
    }),
  }),
});

export const { useGetWidgetSummaryQuery } = widgetApi;
