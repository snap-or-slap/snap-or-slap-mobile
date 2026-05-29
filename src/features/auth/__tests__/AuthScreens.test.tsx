import React from 'react';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { ApiError } from '@services/api';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { authService } from '../services';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import {
  useLoginMutation,
  useRegisterMutation,
} from '@store/api/authApi';

jest.mock('@store/api/authApi', () => ({
  useLoginMutation: jest.fn(),
  useRegisterMutation: jest.fn(),
}));

jest.mock('../services', () => ({
  authService: {
    checkUsername: jest.fn(),
  },
}));

const loginMock = jest.fn();
const registerMock = jest.fn();
const checkUsernameMock = authService.checkUsername as jest.Mock;

async function settleUsernameCheck() {
  await act(async () => {
    jest.advanceTimersByTime(350);
    await Promise.resolve();
  });
}

function mockMutationSuccess(mock: jest.Mock) {
  const unwrap = jest.fn().mockResolvedValue({});
  mock.mockReturnValue({ unwrap });
  return unwrap;
}

function mockMutationFailure(mock: jest.Mock, error: unknown) {
  const unwrap = jest.fn().mockRejectedValue(error);
  mock.mockReturnValue({ unwrap });
  return unwrap;
}

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLoginMutation as jest.Mock).mockReturnValue([
      loginMock,
      { isLoading: false },
    ]);
  });

  it('renders the login form and navigates to register', () => {
    const onNavigateRegister = jest.fn();
    const onBack = jest.fn();

    renderWithProviders(
      <LoginScreen
        onBack={onBack}
        onNavigateRegister={onNavigateRegister}
      />
    );

    expect(screen.getAllByText('Log in').length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText('example@email.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('********')).toBeTruthy();

    fireEvent.press(screen.getByText('Sign Up'));
    fireEvent.press(screen.getByLabelText('Log in'));

    expect(onNavigateRegister).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Please fill in all fields.')).toBeTruthy();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('submits normalized credentials and calls success callback', async () => {
    const onLoginSuccess = jest.fn();
    mockMutationSuccess(loginMock);

    renderWithProviders(<LoginScreen onLoginSuccess={onLoginSuccess} />);

    fireEvent.changeText(
      screen.getByPlaceholderText('example@email.com'),
      ' USER@Example.COM '
    );
    fireEvent.changeText(screen.getByPlaceholderText('********'), 'secret123');
    fireEvent.press(screen.getByLabelText('Log in'));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'secret123',
      });
      expect(onLoginSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('shows an invalid credential error from the API', async () => {
    mockMutationFailure(
      loginMock,
      new ApiError({ status: 401, message: 'invalid credentials' })
    );

    renderWithProviders(<LoginScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('example@email.com'), 'a@b.com');
    fireEvent.changeText(screen.getByPlaceholderText('********'), 'wrong');
    fireEvent.press(screen.getByLabelText('Log in'));

    expect(await screen.findByText('Email or password is incorrect.')).toBeTruthy();
  });
});

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useRegisterMutation as jest.Mock).mockReturnValue([
      registerMock,
      { isLoading: false },
    ]);
    checkUsernameMock.mockResolvedValue({ available: true });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders registration fields and validates an empty submit', () => {
    renderWithProviders(<RegisterScreen />);

    expect(screen.getByText('Register')).toBeTruthy();
    expect(screen.getByPlaceholderText('example@email.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('huangfu_1204')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Create account'));

    expect(screen.getByText('Please fill in all fields.')).toBeTruthy();
    expect(registerMock).not.toHaveBeenCalled();
  });

  it('validates username format before submitting', () => {
    renderWithProviders(<RegisterScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('example@email.com'), 'new@example.com');
    fireEvent.changeText(screen.getAllByPlaceholderText('********')[0], 'password123');
    fireEvent.changeText(screen.getAllByPlaceholderText('********')[1], 'password123');
    fireEvent.changeText(screen.getByPlaceholderText('huangfu_1204'), 'Bad!');
    fireEvent.press(screen.getByLabelText('Create account'));

    expect(
      screen.getByText('Username must be 4-20 lowercase letters, numbers, or underscores.')
    ).toBeTruthy();
    expect(registerMock).not.toHaveBeenCalled();
  });

  it('validates password mismatch', async () => {
    renderWithProviders(<RegisterScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('example@email.com'), 'new@example.com');
    fireEvent.changeText(screen.getAllByPlaceholderText('********')[0], 'password123');
    fireEvent.changeText(screen.getAllByPlaceholderText('********')[1], 'password456');
    fireEvent.changeText(screen.getByPlaceholderText('huangfu_1204'), 'valid_user');
    await settleUsernameCheck();
    fireEvent.press(screen.getByLabelText('Create account'));

    expect(screen.getByText('Password does not match')).toBeTruthy();
    expect(registerMock).not.toHaveBeenCalled();
  });

  it('submits normalized registration payload and navigates to login', async () => {
    const onRegisterSuccess = jest.fn();
    const onNavigateLogin = jest.fn();
    mockMutationSuccess(registerMock);

    renderWithProviders(
      <RegisterScreen
        onRegisterSuccess={onRegisterSuccess}
        onNavigateLogin={onNavigateLogin}
      />
    );

    fireEvent.changeText(screen.getByPlaceholderText('example@email.com'), ' NEW@Example.COM ');
    fireEvent.changeText(screen.getAllByPlaceholderText('********')[0], 'password123');
    fireEvent.changeText(screen.getAllByPlaceholderText('********')[1], 'password123');
    fireEvent.changeText(screen.getByPlaceholderText('huangfu_1204'), 'valid_user');
    await settleUsernameCheck();
    fireEvent.press(screen.getByText('Log in'));
    fireEvent.press(screen.getByLabelText('Create account'));

    expect(onNavigateLogin).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        username: 'valid_user',
      });
      expect(onRegisterSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('maps duplicate email errors to the email field', async () => {
    mockMutationFailure(
      registerMock,
      new ApiError({ status: 409, message: 'email already exists' })
    );

    renderWithProviders(<RegisterScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('example@email.com'), 'taken@example.com');
    fireEvent.changeText(screen.getAllByPlaceholderText('********')[0], 'password123');
    fireEvent.changeText(screen.getAllByPlaceholderText('********')[1], 'password123');
    fireEvent.changeText(screen.getByPlaceholderText('huangfu_1204'), 'valid_user');
    await settleUsernameCheck();
    fireEvent.press(screen.getByLabelText('Create account'));

    expect(await screen.findByText('Email is already registered.')).toBeTruthy();
  });
});
