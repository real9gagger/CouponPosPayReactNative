package com.couponpospayreactnative.printer;

import static com.couponpospayreactnative.MainActivity.isPanasonicJTC60Device;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.panasonic.smartpayment.android.api.FatalException;
import com.panasonic.smartpayment.android.api.IPaymentApi;
import com.panasonic.smartpayment.android.api.IPaymentApiListener;
import com.panasonic.smartpayment.android.api.IPaymentDeviceManager;
import com.panasonic.smartpayment.android.api.IReceiptPrinter;
import com.panasonic.smartpayment.android.api.IReceiptPrinterListener;
import com.panasonic.smartpayment.android.api.PaymentApi;
import com.panasonic.smartpayment.android.api.Result;

public class ReceiptsModule extends ReactContextBaseJavaModule {

    private IReceiptPrinter mReceiptPrinter;
    private Callback mPrintCallback;
    private String mVersionInfo; //版本信息

    private final String TAG = ReceiptsModule.class.getSimpleName();
    private final PaymentApi mPaymentApi;
    private final ReactApplicationContext mContext;
    private final IPaymentApiListener mPaymentApiListener = new IPaymentApiListener.Stub() {
        @Override
        public void onApiConnected() {
            // Set PaymentConfig need
            try {
                // Get PaymentApi instance.
                IPaymentApi paymentApi = mPaymentApi.getPaymentApi();
                // Get PaymentDeviceManager instance.
                IPaymentDeviceManager paymentDeviceManager = paymentApi.getPaymentDeviceManager();
                // Get ReceiptPrinter instance.
                mReceiptPrinter = paymentDeviceManager.getReceiptPrinter();

                mVersionInfo =
                        ( "@:SdkVersion: " + mPaymentApi.getSdkVersion()
                        + ", ServiceVersion: " + paymentApi.getServiceVersion()
                        + ", DeviceManagerVersion: " + paymentDeviceManager.getVersion()
                        );

                Log.d(TAG, "连接支付接口成功...");
            } catch (Exception ex) {
                ex.printStackTrace();
                mReceiptPrinter = null;
                mVersionInfo = ex.getMessage();
                Log.d(TAG, "连接支付接口出错:::" + ex.getMessage());
            }
        }

        @Override
        public void onApiDisconnected() {
            mReceiptPrinter = null;
            Log.d(TAG, "支付接口断开连接...");
        }
    };
    private final IReceiptPrinterListener mReceiptPrinterListener = new IReceiptPrinterListener.Stub() {
        @Override
        public void onPrintReceipt(Result result) {
            if (mPrintCallback != null) {
                mPrintCallback.invoke(result.getMessage(), result.getResultCode());
                mPrintCallback = null; //调用完成后立即重置。
                Log.d(TAG, "调用了打印完成接口...");
            }
        }
    };
    private final LifecycleEventListener mLifecycleEventListener = new LifecycleEventListener() {
        @Override
        public void onHostResume() {
            Log.d(TAG, "调用了小票打印的 onHostResume...");
            ReceiptsModule.this.intiAPIService();
        }

        @Override
        public void onHostPause() {
            Log.d(TAG, "调用了小票打印的 onHostPause...");
        }

        @Override
        public void onHostDestroy() {
            try {
                mPaymentApi.term(mContext);
                //mContext.removeLifecycleEventListener(mLifecycleEventListener); //不必移除监听器，避免热启动时无法触发事件
                Log.d(TAG, "销毁了支付/打印接口...");
            } catch (Exception ex) {
                Log.d(TAG, "销毁支付接口出错:::" + ex.getMessage());
            }
        }
    };

    public ReceiptsModule(ReactApplicationContext context) {
        super(context);

        mContext = context;

        mPaymentApi = new PaymentApi();

        if (isPanasonicJTC60Device) {
            context.addLifecycleEventListener(mLifecycleEventListener);
        }
    }

    private void intiAPIService() {
        try {
            if (isPanasonicJTC60Device) {
                if (!mPaymentApi.isInit()) {
                    mPaymentApi.init(mContext, mPaymentApiListener);
                } else {
                    Log.d(TAG, "支付服务已经初始化过了...");
                }
            } else {
                Log.d(TAG, "初始化支付接口失败:::不是松下POS机设备！");
            }
        } catch (Exception ex) {
            Log.d(TAG, "初始化支付接口出错:::" + ex.getMessage());
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "ReceiptsDP"; //东鹏提神了，就以 “DP” 为后缀
    }

    //2024年2月19日 是否可以打印
    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean canPrint() {
        return (mReceiptPrinter != null);
    }

    //2024年2月19日 打印顾客回持小票
    @ReactMethod
    public void startPrint(String xml, Callback callback) {
        mPrintCallback = callback;
        String errMsg = null;
        int errCode = 0xFFFFFFFF;

        if (xml != null && !xml.isEmpty()) {
            try {
                if (mReceiptPrinter != null) {
                    mReceiptPrinter.printReceipt(xml, mReceiptPrinterListener);
                } else {
                    errMsg = "Unable to connect to the printer!";
                }
            } catch (FatalException ex) {
                ex.printStackTrace();
                errCode = ex.getResultCode();
                errMsg = ex.getMessage();
            } catch (Exception ex) {
                ex.printStackTrace();
                errCode = 0xFF0000FF;
                errMsg = ex.getMessage();
            }
        } else {
            errMsg = "Printing data is empty!";
            Log.d(TAG, "打印数据为空!!!");
        }

        if (errMsg != null && mPrintCallback != null) {
            mPrintCallback.invoke(errMsg, errCode);
            mPrintCallback = null; //重置
        }
    }

    //2024年2月19日 支付API版本信息
    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getVersionInfo() {
        return mVersionInfo;
    }
}