import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { session } from '../../services/api';
import type { SessionUser } from '../../services/api/session';

// ── Types ────────────────────────────────────────────────────────

export type AuthStatus = 'unknown' | 'guest' | 'authenticated';
export type SetupStage = 'checking' | 'profile' | 'permissions' | 'done';

export type AuthState = {
  status: AuthStatus;
  user: SessionUser | null;
  setupStage: SetupStage;
  onboardingDone: boolean;
};

// ── Initial State ────────────────────────────────────────────────

const initialState: AuthState = {
  status: 'unknown',
  user: null,
  setupStage: 'checking',
  onboardingDone: false,
};

// ── Thunks ───────────────────────────────────────────────────────

/**
 * Reads session from AsyncStorage and sets auth state accordingly.
 * Called on app boot to restore previous session.
 */
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { dispatch }) => {
    try {
      const currentSession = await session.getSession();

      if (currentSession?.accessToken && currentSession?.user) {
        dispatch(setAuthenticated(currentSession.user));
      } else {
        dispatch(setGuest());
      }
    } catch {
      dispatch(setGuest());
    }
  },
);

// ── Slice ────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<SessionUser>) {
      state.status = 'authenticated';
      state.user = action.payload;
      state.onboardingDone = true;
    },
    setGuest(state) {
      state.status = 'guest';
      state.user = null;
      state.setupStage = 'checking';
    },
    setSetupStage(state, action: PayloadAction<SetupStage>) {
      state.setupStage = action.payload;
    },
    completeOnboarding(state) {
      state.onboardingDone = true;
    },
    updateUser(state, action: PayloadAction<Partial<SessionUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    resetAuth() {
      return initialState;
    },
  },
});

// ── Exports ──────────────────────────────────────────────────────

export const {
  setAuthenticated,
  setGuest,
  setSetupStage,
  completeOnboarding,
  updateUser,
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;
