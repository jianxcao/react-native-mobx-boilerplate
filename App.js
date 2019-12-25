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
import store from '@/store';
console.log(11111, store);

export default createAppContainer(router);
