/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import router from '@/routers';
import { createAppContainer } from 'react-navigation';
import { Proiver } from '@/store';
import 'react-native-gesture-handler';

export default function App() {
  const Router = createAppContainer(router);
  return (
    <Proiver>
      <Router />
    </Proiver>
  );
}
