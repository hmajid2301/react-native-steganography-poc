import React from 'react';
import {Image, View} from 'react-native';
import Steganography from '../Steganography/Steganography';
import ImagePicker from 'react-native-image-picker';

import 'react-native-console-time-polyfill';

export default class Steg extends React.Component {
  async componentDidMount() {
    ImagePicker.launchImageLibrary({}, async response => {
      console.log(response.uri);
      let steganography = new Steganography(response.uri);
      const encodedImage = await steganography.encode('Test Message');
      steganography = new Steganography(encodedImage);
      const decodedMessage = await steganography.decode();
      console.log(decodedMessage);
    });
  }

  render() {
    return <View style={{flex: 1}}></View>;
  }
}
