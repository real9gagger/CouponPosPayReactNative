package com.couponpospayreactnative.settlement;

import static com.couponpospayreactnative.Constants.REQUEST_PAY_CODE;

import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.couponpospayreactnative.MainActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

public class PaymentHelperModule extends ReactContextBaseJavaModule {

    private final String TAG = PaymentHelperModule.class.getSimpleName();
    private final String CASH_PAY_CODE = "00";
    private final ReactApplicationContext mContext;
    private final String mFromPackageName = "com.panasonic.smartpayment.android.salesmenu";
    private final String mToClassName = "com.panasonic.smartpayment.android.salesmenu.MainActivity";

    public PaymentHelperModule(ReactApplicationContext context) {
        this.mContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "PaymentHelper";
    }

    //是否支持支付功能
    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isSupport() {
        return MainActivity.isPanasonicJTC60Device();
    }

    @ReactMethod
    public void startPay(ReadableMap params, Callback callback) {
        if (params == null || callback == null) {
            Log.d(TAG, "参数为空，支付终止...");
            return;
        }

        //2024年4月18日 如果是现金支付，需要单独处理！
        if (CASH_PAY_CODE.equals(params.getString("paymentType"))) {
            callback.invoke(cashPayOrRefundHandler(
                    this.getMapValue(params, "amount", "0"),
                    this.getMapValue(params, "tax", "0"),
                    this.getMapValue(params, "transactionType", "1"),
                    this.getMapValue(params, "slipNumber", "")
            ));
            return; //单独处理！！！以下代码不需要执行！！！
        }

        if (!MainActivity.isPanasonicJTC60Device()) {
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

    //2024年4月18日 现金付款或退款由于不需要经过第三方APP，因此单独处理，直接返回成功的数据就行
    //【注意；返回的数据必须和 MainActivity 中的 onActivityResult 的数据一致】
    private WritableMap cashPayOrRefundHandler(String amt, String tax, String tst, String snm) {
        WritableMap args = Arguments.createMap();

        //**刷卡/电子钱包/扫码收款时：0=成功, 1=失败, 2=取消
        args.putInt("activityResultCode", 0);
        args.putInt("activityRequestCode", REQUEST_PAY_CODE);

        //返回数据，参见：https://www.smbc-card.com/steradevelopers/develop/kessai.jsp
        args.putInt("amount", Integer.parseInt(amt)); //交易金额
        args.putInt("tax", Integer.parseInt(tax));//税费
        args.putString("errorCode", ""); //错误码，空字符串为交易成功
        args.putString("paymentType", CASH_PAY_CODE); //支付类型 00-现金支付，01-银联，02-电子钱包，03-扫描支付
        args.putString("slipNumber", (snm == null || snm.isEmpty()) ? createSlipNumberForCashPay() : snm); //单据号码
        args.putString("transactionType", tst); //交易类型 1-付款，2-取消付款，3-退款
        args.putString("creditCardBrand", "");//信用卡品牌类型，如 11,12,13...
        args.putString("creditCardMaskedPan", "");//信用卡号
        args.putString("currencyCode", "JPY"); //货币符号（写死为 JPY）
        args.putString("eMoneyNumber", "");//电子钱包会员编号
        args.putString("qrPayType", "");//二维码支付方式，如支付宝、微信等
        args.putString("eMoneyType", "");//电子钱包类型，如 01,02,03...
        args.putDouble("transactionTime", System.currentTimeMillis()); //交易完成时间

        return args;
    }

    //2024年4月18日 为现金支付创建一个单据号（尽量避免与第三方支付APP重复，第三方返回的是 5 位数，范围：00001-99999）
    //所有为了避免冲突，以 9 开头（商家订单数可能达不到 90000+），后面四位是随机数
    private String createSlipNumberForCashPay() {
        //返回 5 位数字，第一位必须以 9 开头，表示是现金支付
        String num = String.valueOf((int) (Math.random() * 10000));
        String base = "90000";

        return base.substring(0, base.length() - num.length()) + num;
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
