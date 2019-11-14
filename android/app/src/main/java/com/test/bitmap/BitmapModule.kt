package com.test.bitmap

import android.graphics.BitmapFactory
import android.graphics.Bitmap
import android.graphics.Color
import android.util.Log
import android.os.Environment
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableNativeArray
import java.lang.Math
import java.io.File
import java.io.FileOutputStream

class BitmapModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "Bitmap"
    }

    @ReactMethod
    fun getPixels(filePath: String, bitsRequired: Int, promise: Promise) {
        try {
            val pixels = WritableNativeArray()
            val bitmap = BitmapFactory.decodeFile(filePath)

            if (bitmap == null) {
                promise.reject("invalid_image", "Failed to decode. Path is incorrect or image is corrupted")
                return
            }

            val pixelsRequired = Math.ceil(bitsRequired / 3.0).toInt()
            val width = bitmap.getWidth()
            val height = bitmap.getHeight()

            val requiredWidth = pixelsRequired % width
            val requiredHeight = pixelsRequired.div(height) + 1

            for (x in 0 until requiredWidth) {
                for (y in 0 until requiredHeight) {
                    val color = bitmap.getPixel(x, y)
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
    fun setPixels(filePath: String, pixels: ReadableArray, promise: Promise) {
        try {
            val bitmap = convertPixelsToColor(filePath, pixels)

            val myDir = File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), "Stegappasaurus")
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
            promise.resolve("$myDir/$fname")
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    fun convertPixelsToColor(filePath: String, pixels: ReadableArray): Bitmap {
        val opt = BitmapFactory.Options();
        opt.inMutable = true;
        val bitmap = BitmapFactory.decodeFile(filePath, opt)

        val width = bitmap.getWidth()
        val height = bitmap.getHeight()
        val pixelsRequired = pixels.size().div(3)
        for (i in 0 until pixelsRequired) {
            val color = Color.argb(255, pixels.getInt(i * 3), pixels.getInt(i * 3 + 1), pixels.getInt(i * 3 + 2))
            val x = i % width 
            val y = i.toInt().div(height)
            bitmap.setPixel(x, y, color)
        }

        return bitmap
    }
}
