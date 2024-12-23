import React from 'react';
import { View } from 'react-native';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
const HeaderContainer = ({ children }) => {
  return (
    <View className="relative items-center top-0">
      {children}
    </View>
  );
};

export default HeaderContainer;