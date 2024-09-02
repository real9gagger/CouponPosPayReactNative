package com.couponpospayreactnative;

import android.app.Application;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;

import com.couponpospayreactnative.cardreader.CardReaderPackage;
import com.couponpospayreactnative.posapi.PosApiPackage;
import com.couponpospayreactnative.settlement.SettlementPackage;
import com.couponpospayreactnative.appinfo.AppPackageInfoPackage;
import com.couponpospayreactnative.newarchitecture.MainApplicationReactNativeHost;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import org.jetbrains.annotations.Nullable;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
      @Override
      public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
      }

      @Override
      protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());

          packages.add(new AppPackageInfoPackage());//2024年1月4日 APP版本、权限信息
          packages.add(new SettlementPackage());//2024年1月29日 结算功能
          packages.add(new PosApiPackage());//2024年2月19日 打印、副屏相关功能
          packages.add(new CardReaderPackage());//2024年4月28日 读卡器相关功能
          return packages;
      }

      @Override
      protected String getJSMainModuleName() {
          return "index";
      }
  };

  private final ReactNativeHost mNewArchitectureNativeHost = new MainApplicationReactNativeHost(this);

  @Override
  public ReactNativeHost getReactNativeHost() {
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      return mNewArchitectureNativeHost;
    } else {
      return mReactNativeHost;
    }
  }

  //2024年9月2日 处理 react-native 版本小于 0.73 时，安卓13、14打开闪退问题。参见：https://github.com/facebook/react-native/issues/41288
  // Put this above "public void onCreate(){...}"
  @Override
  public Intent registerReceiver(@Nullable BroadcastReceiver receiver, IntentFilter filter) {
      if (Build.VERSION.SDK_INT >= 34 && getApplicationInfo().targetSdkVersion >= 34) {
          return super.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED);
      } else {
          return super.registerReceiver(receiver, filter);
      }
  }

  @Override
  public void onCreate() {
    super.onCreate();
    // If you opted-in for the New Architecture, we enable the TurboModule system
    ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context 上下文
   * @param reactInstanceManager RN实例管理器
   */
  private static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.couponpospayreactnative.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException | IllegalAccessException | NoSuchMethodException | InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
