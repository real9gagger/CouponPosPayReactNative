package com.couponpospayreactnative.settlement;

import static com.couponpospayreactnative.MainActivity.REQUEST_PAY_CODE;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.couponpospayreactnative.MainActivity;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class PaymentHelperModule extends ReactContextBaseJavaModule {

    private final String TAG = PaymentHelperModule.class.getSimpleName();
    private final ReactApplicationContext mContext;
    private final boolean isPanasonicJTC60;
    private final String mFromPackageName = "com.panasonic.smartpayment.android.salesmenu";
    private final String mToClassName = "com.panasonic.smartpayment.android.salesmenu.MainActivity";

    public PaymentHelperModule(ReactApplicationContext context) {
        this.mContext = context;

        PackageManager pm = context.getPackageManager();
        boolean existsApp = false;
        try {
            pm.getPackageInfo(mFromPackageName, PackageManager.GET_ACTIVITIES);
            existsApp = true;
        } catch (PackageManager.NameNotFoundException ex) {
            //ex.printStackTrace();
        }

        Log.d(TAG, "是否是 Panasonic JT-C60 POS 设备:::" + existsApp);

        isPanasonicJTC60 = existsApp;
    }

    @NonNull
    @Override
    public String getName() {
        return "PaymentHelper";
    }

    //是否支持支付功能
    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isSupport(){
        return this.isPanasonicJTC60;
    }

    @ReactMethod
    public void startPay(ReadableMap params, Callback callback) {
        if (params == null || callback == null) {
            Log.d(TAG, "参数为空，支付终止...");
            return;
        }

        if(!isPanasonicJTC60) {
            Log.d(TAG, "非 Panasonic JT-C60 POS 设备，无法支付");
            callback.invoke((Object) null);
            return;
        }

        Log.d(TAG, "开始支付，准备跳转到中间支付渠道...");
        MainActivity ma = ((MainActivity) this.mContext.getCurrentActivity());
        if (ma != null) {
            Intent intent = new Intent();
            intent.setClassName(mFromPackageName, mToClassName);

            //参见：https://www.smbc-card.com/steradevelopers/develop/kessai.jsp
            intent.putExtra("TransactionMode", this.getMapValue(params, "transactionMode", "2"));//【必填项】交易模式 1-正常，2-练习
            intent.putExtra("TransactionType", this.getMapValue(params, "transactionType", "1"));//【必填项】交易类型 1-付款，2-取消付款，3-退款
            intent.putExtra("PaymentType", this.getMapValue(params, "paymentType", "03"));//【必填项】銀聯:01，iD:02-01，交通系IC:02-02，楽天Edy:02-03，WAON:02-04，nanaco:02-05，QUICPay:02-06，PiTaPa:02-07，二维码支付:03
            intent.putExtra("Amount", this.getMapValue(params, "amount", "1")); //【必填项】交易金额，1~99999999
            intent.putExtra("Tax", this.getMapValue(params, "tax", "0"));//【必填项】税费 0~9999999
            intent.putExtra("SlipNumber", this.getMapValue(params, "slipNumber", ""));//单据号码，取消付款或者退款时用到

            ma.setActivityResultCallback(callback);

            ma.startActivityForResult(intent, REQUEST_PAY_CODE, null);
        }
    }

    private String getMapValue(ReadableMap map, String key, String def) {
        String val = map.getString(key);
        if (val == null || val.isEmpty()) {
            return def;
        } else {
            return val;
        }
    }
}
