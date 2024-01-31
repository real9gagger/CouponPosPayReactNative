package com.couponpospayreactnative.settlement;

import static com.couponpospayreactnative.MainActivity.REQUEST_PAY_CODE;

import android.content.Intent;
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

    public PaymentHelperModule(ReactApplicationContext context){
        this.mContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "PaymentHelper";
    }

    @ReactMethod
    public void startPay(ReadableMap params, Callback callback) {
        final String formPackageName = "com.panasonic.smartpayment.android.salesmenu";
        final String toClassName = "com.panasonic.smartpayment.android.salesmenu.MainActivity";

        if (params != null && callback != null) {
            Log.d(TAG, "开始支付，准备跳转到中间渠道APP...");
        } else {
            Log.d(TAG, "参数为空，支付终止...");
            return;
        }

        MainActivity ma = ((MainActivity) this.mContext.getCurrentActivity());
        if (ma != null) {
            Intent intent = new Intent();
            intent.setClassName(formPackageName, toClassName);

            //参见：https://www.smbc-card.com/steradevelopers/develop/kessai.jsp
            intent.putExtra("TransactionMode", params.getString("transactionMode"));//【必填项】交易模式 1-正常，2-练习
            intent.putExtra("TransactionType", params.getString("transactionType"));//【必填项】交易类型 1-付款，2-取消付款，3-退款
            intent.putExtra("PaymentType", params.getString("paymentType"));//【必填项】銀聯:01，iD:02-01，交通系IC:02-02，楽天Edy:02-03，WAON:02-04，nanaco:02-05，QUICPay:02-06，PiTaPa:02-07，二维码支付:03
            intent.putExtra("Amount", params.getString("amount")); //【必填项】交易金额，1~99999999
            intent.putExtra("Tax", params.getString("tax"));//【必填项】税费 0~9999999
            intent.putExtra("SlipNumber", params.getString("slipNumber"));//单据号码，取消付款或者退款时用到

            ma.setActivityResultCallback(callback);

            this.mContext.startActivityForResult(intent, REQUEST_PAY_CODE, null);
        }
    }
}
