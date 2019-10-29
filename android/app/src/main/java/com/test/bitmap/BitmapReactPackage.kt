package com.test.bitmap

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import java.util.ArrayList
import java.util.Collections

// public class BitmapReactPackage implements ReactPackage {

//   @Override
//   public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
//     return Collections.emptyList();
//   }

//   @Override
//   public List<NativeModule> createNativeModules(
//                               ReactApplicationContext reactContext) {
//     List<NativeModule> modules = new ArrayList<>();

//     modules.add(new BitmapModule(reactContext));

//     return modules;
//   }

// }

class BitmapReactPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): MutableList<NativeModule> {
        val modules = ArrayList<NativeModule>()
        modules.add(BitmapModule(reactContext))
        return modules
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): MutableList<ViewManager<*, *>> {
        return Collections.emptyList<ViewManager<*, *>>()
    }
}
