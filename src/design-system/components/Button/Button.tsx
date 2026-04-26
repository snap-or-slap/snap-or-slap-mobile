import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from '../Text';
import { useTheme } from '../../theme';
import { ButtonProps } from './Button.types';
import { createButtonStyles, getButtonTextVariant } from './Button.styles';

export const Button: React.FC<ButtonProps> = ({
  intent = 'primary',
  variant = 'solid',
  size = 'md',
  title,
  children,
  leftIcon,
  rightIcon,
  iconOnly = false,
  disabled = false,
  loading = false,
  fullWidth = false,
  onPress,
  accessibilityLabel,
  testID,
  style,
  textStyle,
}) => {
  const theme = useTheme();
  
  const content = children || title;
  const isInteractive = !disabled && !loading;

  const aLabel = accessibilityLabel || (typeof title === 'string' ? title : typeof children === 'string' ? children : undefined);

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      accessibilityLabel={aLabel}
      disabled={!isInteractive}
      onPress={onPress}
      style={({ pressed }) => [
        createButtonStyles(theme, { intent, variant, size, disabled, loading, fullWidth, iconOnly, pressed }).container,
        style
      ]}
    >
      {({ pressed }) => {
        const styles = createButtonStyles(theme, { intent, variant, size, disabled, loading, fullWidth, iconOnly, pressed });
        const textVariant = getButtonTextVariant(size);
        
        if (iconOnly) {
          return <>{leftIcon || rightIcon}</>;
        }

        return (
          <>
            {leftIcon && <View>{leftIcon}</View>}
            {content && (
               <AppText variant={textVariant} style={[styles.text, textStyle]}>
                 {loading && !children && !title ? 'Loading...' : content}
               </AppText>
            )}
            {rightIcon && <View>{rightIcon}</View>}
          </>
        );
      }}
    </Pressable>
  );
};
