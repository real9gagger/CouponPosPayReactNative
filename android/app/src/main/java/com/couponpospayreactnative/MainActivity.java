package com.couponpospayreactnative;

import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;

import java.util.Arrays;

public class MainActivity extends ReactActivity {

  public static final int REQUEST_PERMS_CODE = 88;

  private final String TAG = "PosPayLogs";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    androidx.core.splashscreen.SplashScreen.installSplashScreen(this); //2024年01月04日 显示启动屏，安卓级别的启动屏
    org.devio.rn.splashscreen.SplashScreen.show(this, true); //2024年01月04日 显示启动屏，并且全屏显示。react native 前端级别的启动屏

    super.onCreate(savedInstanceState);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "CouponPosPayReactNative";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the rendered you wish to use (Fabric or the older renderer).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  //授权后调用函数
  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    if (requestCode == REQUEST_PERMS_CODE) {
      Log.i(TAG, "权限列表：" + Arrays.toString(permissions) + "，请求结果：" + Arrays.toString(grantResults));
    }
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }
}
