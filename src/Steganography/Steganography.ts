import {NativeModules} from 'react-native';
import {arrayToString, stringToArray} from 'utf8-to-bytes';
import varint from 'varint';
import LZUTF8 from 'lzutf8';

import Canvas, {Image as CanvasImage, ImageData} from 'react-native-canvas';
import {ImageNotEncodedError, MessageTooLongError} from './exceptions';
import {DecodeLSB, EncodeLSB} from './LSB';

type AlgorithmNames = 'LSBv1';

interface IMetaData {
  [name: string]: number | string;
}

interface IAlgorithms {
  [name: number]: AlgorithmNames;
}

export default class Steganography {
  private readonly canvas: Canvas;
  private readonly imageURI: string;
  private readonly width: number;
  private readonly height: number;
  private progress: {
    increment: number;
    value: number;
  };

  private numToAlgorithmTypes: IAlgorithms = {
    0: 'LSBv1',
  };

  constructor(canvas: Canvas, imageURI: string, width: number, height: number) {
    this.canvas = canvas;
    this.imageURI = imageURI;
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.progress = {
      increment: 0,
      value: 0,
    };
  }

  public async encode(
    message: string,
    algorithm: AlgorithmNames = 'LSBv1',
    metadata?: IMetaData,
  ) {
    try {
      const uri =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAgMAAAC+UIlYAAAADFBMVEUzMzOwZTrEsH3S0r0zVvYfAAACtUlEQVRYha2XsZajMAxF1ahxk19To0YNv+bGjRp+jSYNjffJgZBMdhabLOdwZoAbP0kWkiD6jwfLy4VcAUTzCz0MKDGrfwEwqYjZ70Z2ADjV83eAqJVfnTgFYkXm4hcB2WxS/UXiDGAWfvxVk5cf9QOCED3+ERXST40O4HmXRbfEGwH44WGTCJJ/GtkHBBLG4nw8uwBQe9xQej9OgY/k+pkLwwCFEs/fADwIfBaCkChfAZDg7wDtMfJvwB5i/s3NfwOMfBFtide2exxoT7XFnS8BrExWAKWW/GNA2+6E9YtxW54vAbCPU0HeG4ohjQPshjjZimip3fkCYFpkWaaVlqWYyzDAVJQzEQAkK1m+AlRU8TStiVKxMg6Q+F1LdQCzF/IrgN2LFwOAHcufbp4D2KZitU7rrVbb3jkAtwGAXEnDSC+8dUYAKXcDYaUkOFoQc5crAKcVQV4DoM29QYDMObkWdT6AOgTANKgQTt6aM/L3LgMAKd8cx/xsBYyLIYBkmuOQ/WYSmfMQwLd5Xev8rIkA8jIE6ORzrbPuEgxgXUYAng2OzceQExK3EUAn1BCb3iQWWgYARpTWeXqTyEseAGiaVadjfwKoW0nsAyBREah3CYyP0g2kuW3W0yoMfrRwsW5AGU5Wr0+JiFGybNoJIMOnGschsWYkbrZN4wxgFBBevbrLvlu8oMa7dAI3lRJdBa8/37e0naKsK/UBeHM1be6k+zaxxhhbold1AJhzC87W0dGej5xBQbTSAzRLoAFPBf76+tyf8NK7AC7CkmLoxZLu+waaZ44GdQpEYy3bmAEFhEx2ALetD4gKHkZaSf7yJRCwSRcQHoGwLFj1GNkc0toDxHX4qIovsXa99RR43CzuAmLWi6/BNiEdABpMLxCE6iNjeZ9BDRLSA2wr7s8jcHLE+hz4A3pxh22e4cuYAAAAAElFTkSuQmCC';

      var output = LZUTF8.compress(message);
      const binaryMessage = this.convertMessageToBits(output);
      const imageData = await this.getImageData(uri, binaryMessage.length);
      const newImageData = this.encodeData(
        imageData,
        binaryMessage,
        algorithm,
        metadata,
      );
      const url = await this.getEncodedImageURI(newImageData);
      return url;
    } catch (error) {
      if (error instanceof RangeError) {
        throw new MessageTooLongError('Message too long to encode', message);
      } else {
        throw new Error(error);
      }
    }
  }

  public async decode() {
    try {
      // const imageData = await this.getImageData(this.imageURI, 100);
      const imageData = [
        50,
        50,
        50,
        50,
        50,
        50,
        50,
        50,
        50,
        50,
        50,
        50,
        51,
        51,
        50,
        50,
        50,
        51,
        50,
        51,
        50,
        51,
        50,
        50,
        50,
        51,
        51,
        50,
        50,
        51,
        50,
        51,
        50,
        51,
        51,
        51,
        50,
        50,
        51,
        51,
        50,
        51,
        51,
        51,
        50,
        51,
        50,
        50,
        50,
        50,
        51,
        50,
        50,
        50,
        50,
        50,
        50,
        51,
        50,
        50,
        51,
        51,
        50,
        51,
        50,
        51,
        51,
        50,
        50,
        51,
        50,
        51,
        50,
        51,
        51,
        51,
        50,
        50,
        51,
        51,
        50,
        51,
        51,
        51,
        50,
        50,
        51,
        51,
        50,
        51,
        51,
        50,
        50,
        50,
        50,
        51,
        50,
        51,
        51,
        50,
        50,
        51,
        51,
        51,
        50,
        51,
        51,
        50,
        50,
        51,
        50,
        51,
        51,
        51,
      ];
      const decodedDecimalData = this.decodeData(imageData);
      const message: string = arrayToString(Array.from(decodedDecimalData));
      console.log(message);
      return message;
    } catch (error) {
      if (error instanceof RangeError) {
        throw new ImageNotEncodedError(
          'Image is not encoded with any data',
          this.imageURI,
        );
      } else {
        throw new Error(error);
      }
    }
  }

  public updateProgress() {
    this.progress.value += this.progress.increment;
  }

  public getProgress() {
    return this.progress.value;
  }

  private convertMessageToBits(message: Uint8Array) {
    const messageLength = varint.encode(message.length);
    const arrayToEncode = [...messageLength, ...message];

    let bitsToEncode: string = '';
    for (const element of arrayToEncode) {
      bitsToEncode += this.convertDecimalToBytes(element as number);
    }

    return bitsToEncode;
  }

  private async getImageData(imageURI: string, length: number) {
    const context = this.canvas.getContext('2d');
    const uri = imageURI;
    const image = await this.loadImage(uri);
    context.drawImage(image, 0, 0, this.width, this.height);

    const bytesRequired = this.getBytesRequired(length);
    const width = bytesRequired % this.width;
    const height = Math.floor(bytesRequired / this.height) + 1;

    const rgbaImageObject = await context.getImageData(0, 0, width, height);
    const rgbData = Object.values(rgbaImageObject.data).filter((_, index) => {
      return (index + 1) % 4 !== 0;
    });
    return rgbData;
  }

  private loadImage(url): Promise<CanvasImage> {
    return new Promise(resolve => {
      const image = new CanvasImage(this.canvas);
      image.addEventListener('load', () => {
        resolve(image);
      });
      image.src = url;
    });
  }

  private getBytesRequired(
    messageLength: number,
    algorithm: AlgorithmNames = 'LSBv1',
  ) {
    const bytesRequired = Math.ceil((messageLength + 8) / 3);
    return bytesRequired;
  }

  private encodeData(
    imageData: number[],
    data: string,
    algorithm: AlgorithmNames,
    metadata?: IMetaData,
  ) {
    this.progress.increment = 100 / data.length;
    metadata = this.setDefaultMetaData(
      metadata && algorithm !== 'LSBv1' ? metadata : {},
      algorithm,
    );
    const {newImageData, startEncodingAt} = this.encodeMetadata(
      imageData,
      metadata,
    );

    let encodedData;
    switch (algorithm) {
      default: {
        encodedData = new EncodeLSB(this.updateProgress.bind(this)).encode(
          newImageData,
          data,
          startEncodingAt,
        );
      }
    }

    return encodedData;
  }

  private setDefaultMetaData(metadata: IMetaData, algorithm: AlgorithmNames) {
    const algorithmNum = this.algorithmsTypesToNum(algorithm);
    metadata.algorithm = algorithmNum;

    return metadata;
  }

  private algorithmsTypesToNum(algorithm = 'LSB') {
    const values = Object.values(this.numToAlgorithmTypes);
    return values.indexOf(algorithm);
  }

  private encodeMetadata(imageData: number[], metadata: IMetaData) {
    const metadataToEncode = [];
    const dataToEncode = ['algorithm'];

    for (const data of dataToEncode) {
      const tempData = metadata[data];
      if (!tempData && tempData !== 0) {
        continue;
      }

      let decimalDataToEncode;
      if (typeof tempData === 'string') {
        decimalDataToEncode = stringToArray(tempData) as number[];
      } else {
        decimalDataToEncode = varint.encode(tempData);
      }
      metadataToEncode.push(...decimalDataToEncode);
    }

    let binaryMetadata = '';
    for (const data of metadataToEncode) {
      binaryMetadata += this.convertDecimalToBytes(data);
    }
    const imageDataWithMetadata = new EncodeLSB().encode(
      imageData,
      binaryMetadata,
    );

    return {
      newImageData: imageDataWithMetadata,
      startEncodingAt: binaryMetadata.length,
    };
  }

  private async getEncodedImageURI(data: number[]) {
    const context = this.canvas.getContext('2d');
    for (let index = 3; index < data.length + 3; index += 4) {
      data.splice(index, 0, 255);
    }
    const width = data.length / 4;
    const height = Math.floor(width / this.height) + 1;

    const imgData = new ImageData(this.canvas, data, width, height);
    await context.putImageData(imgData, 0, 0);
    return this.canvas.toDataURL();
  }

  private decodeData(imageData: number[]) {
    const {algorithm, startDecodingAt} = this.decodeMetadata(imageData);
    let decodedMessage;

    switch (algorithm) {
      default: {
        decodedMessage = new DecodeLSB(this.updateProgress.bind(this)).decode(
          imageData,
          startDecodingAt,
        );
      }
    }

    const decodedDecimal: number[] = [];
    for (const byte of decodedMessage) {
      const decimal = this.convertBytesToDecimal(byte);
      decodedDecimal.push(decimal);
    }

    return new Uint8Array(decodedDecimal);
  }

  private decodeMetadata(imageData: number[]) {
    const decodeLSB = new DecodeLSB();
    const algorithmTypeBinary = decodeLSB.decodeNextByte(imageData);
    const algorithmNum = this.convertBytesToDecimal(algorithmTypeBinary);
    const algorithm = this.numToAlgorithmTypes[algorithmNum] || 'LSB';
    const metadata: IMetaData = {};

    const startDecodingAt = decodeLSB.getCurrentIndex();
    return {
      algorithm,
      metadata,
      startDecodingAt,
    };
  }

  private convertDecimalToBytes(data: number) {
    const binaryString = data.toString(2);
    const nearestByte = Math.ceil(binaryString.length / 8) * 8;
    const byte = binaryString.padStart(nearestByte, '0');
    return byte;
  }

  private convertBytesToDecimal(bytes: string) {
    const decimal = parseInt(bytes, 2);
    return decimal;
  }
}
