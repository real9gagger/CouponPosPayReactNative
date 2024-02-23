package com.couponpospayreactnative.printer;

import static com.couponpospayreactnative.Constants.APP_FILES_CACHE_DIR;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.util.Log;

import androidx.annotation.NonNull;

import com.couponpospayreactnative.MainActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.panasonic.smartpayment.android.api.FatalException;
import com.panasonic.smartpayment.android.api.IPaymentApi;
import com.panasonic.smartpayment.android.api.IPaymentApiListener;
import com.panasonic.smartpayment.android.api.IPaymentDeviceManager;
import com.panasonic.smartpayment.android.api.IReceiptPrinter;
import com.panasonic.smartpayment.android.api.IReceiptPrinterListener;
import com.panasonic.smartpayment.android.api.PaymentApi;
import com.panasonic.smartpayment.android.api.Result;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

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

        if (MainActivity.isPanasonicJTC60Device()) {
            context.addLifecycleEventListener(mLifecycleEventListener);
        }
    }

    private void intiAPIService() {
        try {
            if (MainActivity.isPanasonicJTC60Device()) {
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

    private File downloadImage(String picurl) {

        int lastIndex = picurl.lastIndexOf('/') + 1;
        int endIndex = picurl.lastIndexOf('?');

        if (lastIndex <= 0) {
            Log.d(TAG, "图片链接格式不正确!!!");
            return null; // 不是正确的 http 网址
        }

        //必须保存为 bmp 格式的图片！否则无法打印
        final String picFileName = (picurl.substring(lastIndex, endIndex > lastIndex ? endIndex : picurl.length()) + ".bmp");

        File dir = new File(APP_FILES_CACHE_DIR);
        if (dir.exists()) {
            File pfo = new File(dir, picFileName);//pic file object
            if (pfo.exists() && pfo.isFile()) {
                return pfo;
            }
        } else {
            if (!dir.mkdir()) { //存储数据到本地
                Log.d(TAG, "创建缓存目录失败:::" + APP_FILES_CACHE_DIR);
                return null;
            }
        }

        //文件不存在，下载网络图片，此方式会阻塞进程！
        try {
            URL url = new URL(picurl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(10000); //连接超时时间 10 秒
            conn.setDoInput(true);
            conn.connect();

            InputStream isss = conn.getInputStream();

            Bitmap oldbmp = BitmapFactory.decodeStream(isss);
            File fileObj = new File(dir, picFileName);
            FileOutputStream fos = new FileOutputStream(fileObj);

            Bitmap newbmp = this.toGrayscale(oldbmp); //转成灰色图像

            newbmp.compress(Bitmap.CompressFormat.PNG, 100, fos); //通过io流的方式来压缩保存图片

            fos.flush();
            fos.close();
            isss.close();
            conn.disconnect();

            return fileObj;
        } catch (IOException ex) {
            ex.printStackTrace();
            Log.d(TAG, "下载图片失败:::" + ex.getMessage());
            return null;
        }
    }

    /*
     * 图片去色,返回黑白图片
     * @param bmpOriginal 传入的图片
     * @return 去色后的图片
     */
    private Bitmap toGrayscale(Bitmap bmpOriginal) {
        int oldWidth = bmpOriginal.getWidth();   //获取位图的宽
        int oldHeight = bmpOriginal.getHeight();  //获取位图的高
        int newWidth = 384;
        int newHeight = 0;

        if (oldWidth > newWidth) { //防止图片宽度超过打印纸宽度，导致报错
            Matrix matrix = new Matrix();
            float scales = ((float) newWidth) / oldWidth;

            newHeight = (int) (oldHeight * scales);
            matrix.postScale(scales, scales);
            bmpOriginal = Bitmap.createBitmap(bmpOriginal, 0, 0, oldWidth, oldHeight, matrix, true);
        } else {
            newWidth = oldWidth;
            newHeight = oldHeight;
        }

        int[] pixels = new int[newWidth * newHeight]; //通过位图的大小创建像素点数组

        bmpOriginal.getPixels(pixels, 0, newWidth, 0, 0, newWidth, newHeight);

        for (int i = 0; i < newHeight; i++) {
            for (int j = 0; j < newWidth; j++) {
                int nth = newWidth * i + j;
                int grey = pixels[nth];
                int red = ((grey & 0x00FF0000) >> 16);
                int green = ((grey & 0x0000FF00) >> 8);
                int blue = (grey & 0x000000FF);
                int rgba = (int) (red * 0.299 + green * 0.587 + blue * 0.114) & 0xFF;
                //pixels[nth] = ((rgba << 16) | (rgba << 8) | rgba);
                pixels[nth] = (rgba >= 0xC0 ? 0xFFFFFF : 0x000000);
            }
        }

        return Bitmap.createBitmap(pixels, newWidth, newHeight, Bitmap.Config.RGB_565);
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

    //2024年2月22日 获取待打印的图片路径
    @ReactMethod
    public void getImagePath(String uri, Promise promise) {
        if (uri != null && !uri.isEmpty()) {
            //防止下载卡顿，因此开启多线程来下载图片
            //new Thread(() -> {
                File pic = downloadImage(uri);
                if (pic != null) {
                    promise.resolve(pic.getPath());
                } else {
                    promise.resolve(null);
                }
            //}).start();
        } else {
            promise.resolve(null);
        }
    }

    //2024年2月23日 清空缓存图像
    @ReactMethod
    public void clearImageCaches(Promise promise) {
        File dir = new File(APP_FILES_CACHE_DIR);
        WritableMap obj = Arguments.createMap();
        int total = 0; //文件总数
        int deleted = 0; //被删除的文件数量

        if (dir.exists() && dir.isDirectory()) {
            File[] files = dir.listFiles();
            if (files != null) {
                for (File ff : files) {
                    if (ff.delete()) {
                        deleted++;
                    }
                }
                total = files.length;
            }
        }

        obj.putInt("total", total);
        obj.putInt("deleted", deleted);

        promise.resolve(obj);
    }

    //2024年2月19日 支付API版本信息
    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getVersionInfo() {
        return mVersionInfo;
    }
}