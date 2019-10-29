import React from 'react';
import {View} from 'react-native';
import Steganography from '../Steganography/Steganography';
import Canvas from 'react-native-canvas';

import 'react-native-console-time-polyfill';

export default class Steg extends React.Component {
  async encode(canvas) {
    const steganography = new Steganography(canvas, '', 128, 128);
    // const timer = setInterval(() => {
    //   console.log(steganography.getProgress());
    // }, 100);
    const encodedImage = await steganography.encode('Test Message');
    const decode = await steganography.decode();
    // clearInterval(timer);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Canvas ref={this.encode} />
      </View>
    );
  }
}
