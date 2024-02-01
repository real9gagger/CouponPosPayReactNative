package com.couponpospayreactnative;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.activity.result.ActivityResultLauncher;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;
import com.journeyapps.barcodescanner.ScanContract;
import com.journeyapps.barcodescanner.ScanOptions;

import java.util.Arrays;

public class MainActivity extends ReactActivity {

  public static final int REQUEST_QRCODE_CODE = 77;//扫描二维码
  public static final int REQUEST_PERMS_CODE = 88;//权限设置
  public static final int REQUEST_PAY_CODE = 99;//支付相关

  private Callback mActivityResultCallback = null; // 活动页返回结果时调用的 JS 回调函数

  private final String TAG = "PosPayLogs";
  private final ActivityResultLauncher<ScanOptions> mCodeLauncher = registerForActivityResult(new ScanContract(), result -> {
    if (mActivityResultCallback == null) {
      Log.d(TAG, "回调函数为空，不执行任何操作...");
    } else {
      Log.d(TAG, "有获取到二维码扫码结果...");
      mActivityResultCallback.invoke(result.getContents()); //返回的是 ScanIntentResult 实例
      mActivityResultCallback = null; //调用后，重置为空！！！
    }
  });

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

  @Override
  protected void onDestroy() {
    super.onDestroy();
    Log.d(TAG, "主活动页销毁了...");
    mCodeLauncher.unregister();
  }

  //授权后调用函数
  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    if (requestCode == REQUEST_PERMS_CODE) {
      Log.i(TAG, "权限列表：" + Arrays.toString(permissions) + "，请求结果：" + Arrays.toString(grantResults));
    }
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent intent) {
    super.onActivityResult(requestCode, resultCode, intent);

    if (mActivityResultCallback == null) {
      Log.d(TAG, "回调函数为空，不执行任何操作...");
      return;
    }

    if(requestCode != REQUEST_PAY_CODE && requestCode != REQUEST_QRCODE_CODE){
      Log.d(TAG, "检测到未知的请求码，已忽略:::" + requestCode);
      return; //可能是 registerForActivityResult 的回调码，直接 return【重要！！！】因为这个函数比 registerForActivityResult 先调用！
    }

    WritableMap args = Arguments.createMap();
    args.putInt("activityResultCode", resultCode); //安卓调用结果编码 -1:成功，0:取消
    args.putInt("activityRequestCode", requestCode);

    if (intent != null) {
      switch (requestCode) {
        case REQUEST_PAY_CODE:
          //返回数据，参见：https://www.smbc-card.com/steradevelopers/develop/kessai.jsp
          args.putInt("amount", intent.getIntExtra("Amount", 0)); //交易金额
          args.putInt("tax", intent.getIntExtra("Tax", 0));//税费
          args.putString("errorCode", intent.getStringExtra("ErrorCode")); //错误码，空字符串为交易成功
          args.putString("paymentType", intent.getStringExtra("PaymentType")); //支付类型 01-银联，02-电子钱包，03-扫描支付
          args.putString("slipNumber", intent.getStringExtra("SlipNumber")); //单据号码
          args.putString("transactionType", intent.getStringExtra("TransactionType")); //交易类型 1-付款，2-取消付款，3-退款
          args.putString("creditCardBrand", intent.getStringExtra("CreditCardBrand"));//信用卡品牌
          args.putString("creditCardMaskedPAN", intent.getStringExtra("CreditCardMaskedPAN"));//信用卡号
          args.putString("currencyCode", intent.getStringExtra("CurrencyCode")); //货币符号（JPY）
          args.putString("eMoneyNumber", intent.getStringExtra("EMoneyNumber"));//电子钱包会员编号
          args.putString("qrPayType", intent.getStringExtra("QRPayType"));//二维码支付方式，如支付宝、微信
          args.putString("eMoneyType", intent.getStringExtra("EMoneyType"));//电子钱包类型编号
          args.putDouble("transactionTime", System.currentTimeMillis()); //交易完成时间
          break;
        case REQUEST_QRCODE_CODE:
          IntentResult result = IntentIntegrator.parseActivityResult(resultCode, intent);
          args.putString("formatName", result.getFormatName());
          args.putString("errorCorrectionLevel", result.getErrorCorrectionLevel()); //纠错级别
          args.putString("scanResult", result.getContents());
          break;
      }
    } else {
      args.putBoolean("isIntentNull", true); //空的意图
    }

    mActivityResultCallback.invoke(args);
    mActivityResultCallback = null; //调用后，立即重置为空！！！
  }

  //启动扫码摄像头页面
  public void launchScannerForResult(ScanOptions options) {
    mCodeLauncher.launch(options);
  }

  //此函数由外部调用
  public void setActivityResultCallback(Callback cb) {
    mActivityResultCallback = cb;
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
