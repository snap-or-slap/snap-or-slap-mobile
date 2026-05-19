import { apiClient, apiRoutes, mapKeysToCamel } from '@services/api';

export async function getSummary<T = unknown>(): Promise<T> {
  const response = await apiClient.get(apiRoutes.widget.summary, {
    withCurrentUser: true,
  });
  return mapKeysToCamel<T>(response);
}

export const widgetService = {
  getSummary,
};
