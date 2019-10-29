/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {View} from 'react-native';

import Steg from './src/Steg';

class App extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Steg />
      </View>
    );
  }
}

export default App;
