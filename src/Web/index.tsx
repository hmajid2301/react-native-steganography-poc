import React from 'react';
import {View} from 'react-native';

import Canvas, {Image as CanvasImage, ImageData} from 'react-native-canvas';

export default class MyWeb extends React.Component {
  public async encodeData(canvas: Canvas) {
    const image = new CanvasImage(canvas);
    image.addEventListener('load', () => {
      context.drawImage(image, 0, 0);
    });
    image.src = this.state.photo;
    const context = canvas.getContext('2d');
    const imageData = await context.getImageData(
      0,
      0,
      image.width,
      image.height,
    );

    const imgData = new ImageData(
      canvas,
      encodedData,
      image.width,
      image.height,
    );
    context.putImageData(imgData, 0, 0);
    return canvas.toDataURL();
  }
}
