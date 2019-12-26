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

export default function App() {
  const Router = createAppContainer(router);
  console.log('in app');
  return (
    <Proiver>
      <Router />
    </Proiver>
  );
}
