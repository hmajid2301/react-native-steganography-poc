package com.test.bitmap

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.os.Environment
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableNativeArray
import java.io.File
import java.io.FileOutputStream
import java.lang.System
// public class BitmapModule extends ReactContextBaseJavaModule {
//     private static ReactApplicationContext reactContext;

//     public BitmapModule(ReactApplicationContext context) {
//         super(context);
//         reactContext = context;
//     }

//         @Override
//     public String getName() {
//         return "Bitmap";
//     }

//     @ReactMethod
//     public void getPixels(String filePath, final Promise promise) {
//         try {
//             WritableNativeArray pixels = new WritableNativeArray();
//             Bitmap bitmap = BitmapFactory.decodeFile(filePath);

//             if (bitmap == null) {
//                 promise.reject("Failed to decode. Path is incorrect or image is corrupted");
//                 return;
//             }

//             int width = bitmap.getWidth();
//             int height = bitmap.getHeight();

//             for (int x = 0; x < width; x++) {
//                 for (int y = 0; y < height; y++) {
//                     int color = bitmap.getPixel(x, y);
//                     pixels.pushString(Integer.toBinaryString(color));
//                 }
//             }
//             promise.resolve(pixels);
//         } catch (Exception e) {
//             promise.reject(e);
//         }
//     }

// }

class BitmapModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "Bitmap"
    }

    @ReactMethod
    fun getPixels(filePath: String, promise: Promise) {
        try {
            val pixels = WritableNativeArray()
            val bitmap = BitmapFactory.decodeFile(filePath)

            if (bitmap == null) {
                promise.reject("invalid_image", "Failed to decode. Path is incorrect or image is corrupted")
                return
            }

            val width = bitmap.getWidth()
            val height = bitmap.getHeight()

            for (x in 0 until width) {
                for (y in 0 until height) {
                    val color = bitmap.getPixel(x, y)

                    pixels.pushInt(Color.alpha(color))
                    pixels.pushInt(Color.red(color))
                    pixels.pushInt(Color.green(color))
                    pixels.pushInt(Color.blue(color))
                }
            }

            promise.resolve(pixels)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun setPixels(pixels: ReadableArray, width: Int, height: Int, promise: Promise) {
        try {
            val colors = convertPixelsToColor(pixels)
            val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
            bitmap.setPixels(colors, 0, width, 0, 0, width, height)

            val myDir = File(Environment.getExternalStorageDirectory(), "Stegappasaurus")
            if (!myDir.exists()) {
                if (!myDir.mkdirs()) {
                    promise.reject("failed_create_folder", "failed to create directory")
                }
            }

            val date = System.currentTimeMillis()
            val fname = "$date.png"
            val file = File(myDir, fname)
            val out = FileOutputStream(file)

            bitmap.compress(Bitmap.CompressFormat.PNG, 100, out)
            out.flush()
            out.close()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    fun convertPixelsToColor(pixels: ReadableArray): IntArray {
        val colors: IntArray = IntArray(pixels.size().div(4))
        for (x in 0 until colors.size) {
            val temp = Color.argb(pixels.getInt(x * 4), pixels.getInt(x * 4 + 1), pixels.getInt(x *4 + 2), pixels.getInt(x * 4 + 3))
            colors[x] = temp
        }

        return colors
    }
}
