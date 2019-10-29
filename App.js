/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {View} from 'react-native';

import Bitmap from './src/Bitmap';

class App extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Bitmap />
      </View>
    );
  }
}

export default App;
