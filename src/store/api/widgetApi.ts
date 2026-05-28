import { baseApi } from './baseApi';
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
          return {
            error: {
              status: 'CUSTOM_ERROR' as const,
              error: error instanceof Error ? error.message : 'Unknown error',
              data: error,
            },
          };
        }
      },
      providesTags: ['Widget'],
    }),
  }),
});

export const { useGetWidgetSummaryQuery } = widgetApi;
