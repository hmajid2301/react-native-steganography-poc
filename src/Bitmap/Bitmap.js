import React from 'react';
import ImagePicker from 'react-native-image-picker';
import {NativeModules, Button, View, Text} from 'react-native';

import 'react-native-console-time-polyfill';

export default class Bitmap extends React.Component {
  test = imagePath => {
    console.time('hello');
    NativeModules.Bitmap.getPixels(imagePath)
      .then(image => {
        console.log(image);
        console.timeEnd('hello');

        console.time('helloa');
        NativeModules.Bitmap.setPixels(image, 480, 480)
          .then(x => {
            console.log('HELLOA', x);
          })
          .catch(err => {
            console.error(err);
          });
        console.timeEnd('helloa');
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Hello</Text>
        <Button
          title="Get pixels"
          onPress={() => {
            ImagePicker.launchCamera({}, response => {
              this.test(response.path);
            });
          }}></Button>
      </View>
    );
  }
}
