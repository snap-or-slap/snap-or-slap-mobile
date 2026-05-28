import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { baseApi } from './api/baseApi';

// Import API endpoint files so they register with baseApi via injectEndpoints.
// These are side-effect imports — the endpoints are injected at import time.
import './api/authApi';
import './api/challengeApi';
import './api/checkinApi';
import './api/friendApi';
import './api/userApi';
import './api/notificationApi';
import './api/widgetApi';

// ── Store ────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for RTK Query internal actions
      serializableCheck: {
        ignoredActions: ['api/executeMutation', 'api/executeQuery'],
      },
    }).concat(baseApi.middleware),
});

// ── Types ────────────────────────────────────────────────────────

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ── Re-exports ──────────────────────────────────────────────────

export { useAppDispatch, useAppSelector } from './hooks';
export {
  setAuthenticated,
  setGuest,
  setSetupStage,
  completeOnboarding,
  updateUser,
  restoreSession,
} from './slices/authSlice';
export type { AuthStatus, SetupStage, AuthState } from './slices/authSlice';
export { baseApi } from './api/baseApi';
