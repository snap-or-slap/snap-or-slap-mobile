import React from 'react';
import { SafeAreaView } from 'react-native';
export const SafeAreaScreen: React.FC<{children: React.ReactNode}> = ({children}) => <SafeAreaView>{children}</SafeAreaView>;
