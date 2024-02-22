package com.couponpospayreactnative.settlement;

import static com.couponpospayreactnative.Constants.REQUEST_QRCODE_CODE;

import androidx.annotation.NonNull;

import com.couponpospayreactnative.MainActivity;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.zxing.integration.android.IntentIntegrator;
import com.journeyapps.barcodescanner.ScanOptions;

public class QRcodeScannerModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext mContext;
    public QRcodeScannerModule(ReactApplicationContext context) {
        this.mContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "QRcodeScanner";
    }

    //2024年1月30日 直接返回扫码后的字符串
    @ReactMethod
    public void startScanner(Callback callback) {
        MainActivity ma = ((MainActivity) this.mContext.getCurrentActivity());
        if (ma != null) {
            ScanOptions options = new ScanOptions();
            options.setDesiredBarcodeFormats(ScanOptions.ALL_CODE_TYPES);
            options.setOrientationLocked(false);
            options.setCameraId(0);  // Use a specific camera of the device
            options.setBeepEnabled(true);
            options.setBarcodeImageEnabled(false);
            options.setCaptureActivity(QRcodeScannerCapture.class);
            options.setPrompt(""); // 不显示官方的底部文字

            ma.setActivityResultCallback(callback);
            ma.launchScannerForResult(options);
        }
    }

    //返回扫描结果：是一个JS对象
    @ReactMethod
    public void openScanner(Callback callback) {
        MainActivity ma = ((MainActivity) this.mContext.getCurrentActivity());
        if (ma != null) {
            IntentIntegrator ii = new IntentIntegrator(this.mContext.getCurrentActivity());

            ii.setCameraId(0);
            ii.setBeepEnabled(true);
            ii.setCaptureActivity(QRcodeScannerCapture.class);
            ii.setOrientationLocked(false);
            ii.setBarcodeImageEnabled(false);
            ii.setDesiredBarcodeFormats(ScanOptions.ALL_CODE_TYPES);
            ii.setRequestCode(REQUEST_QRCODE_CODE);
            ii.setPrompt(""); //不显示官方的底部文字

            ma.setActivityResultCallback(callback);

            ii.initiateScan();
        }
    }
}
