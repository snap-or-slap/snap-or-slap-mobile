import React from 'react';
import { Text } from 'react-native';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../test-utils/renderWithTheme';
import { AuthAnimatedContainer } from '../components/AuthAnimatedContainer';
import { AuthTextField } from '../components/AuthTextField';

describe('AuthTextField', () => {
  it('renders label, placeholder, value, and helper text', () => {
    renderWithTheme(
      <AuthTextField
        label="Email"
        placeholder="example@email.com"
        value="user@example.com"
        onChangeText={jest.fn()}
        subtext="Use your school email"
      />
    );

    expect(screen.getByDisplayValue('user@example.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('example@email.com')).toBeTruthy();
    expect(screen.getByText('Use your school email')).toBeTruthy();
  });

  it('prioritizes error text and calls the right icon handler', () => {
    const onRightIconPress = jest.fn();

    renderWithTheme(
      <AuthTextField
        label="Password"
        placeholder="Password"
        value=""
        onChangeText={jest.fn()}
        error="Password is required"
        subtext="Hidden helper"
        rightIcon={<Text>toggle</Text>}
        onRightIconPress={onRightIconPress}
      />
    );

    expect(screen.getByText('Password is required')).toBeTruthy();
    expect(screen.queryByText('Hidden helper')).toBeNull();

    fireEvent.press(screen.getByText('toggle'));

    expect(onRightIconPress).toHaveBeenCalledTimes(1);
  });
});

describe('AuthAnimatedContainer', () => {
  it('renders children inside the animated wrapper', () => {
    renderWithTheme(
      <AuthAnimatedContainer>
        <Text>Animated content</Text>
      </AuthAnimatedContainer>
    );

    expect(screen.getByText('Animated content')).toBeTruthy();
  });
});
