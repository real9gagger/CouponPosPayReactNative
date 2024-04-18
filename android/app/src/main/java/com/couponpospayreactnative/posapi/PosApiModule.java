package com.couponpospayreactnative.posapi;

import static com.couponpospayreactnative.Constants.APP_FILES_CACHE_DIR;

import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.util.Log;

import androidx.annotation.NonNull;

import com.couponpospayreactnative.BuildConfig;
import com.couponpospayreactnative.MainActivity;
import com.couponpospayreactnative.R;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.panasonic.smartpayment.android.api.FatalException;
import com.panasonic.smartpayment.android.api.ICustomerDisplay;
import com.panasonic.smartpayment.android.api.ICustomerDisplayListener;
import com.panasonic.smartpayment.android.api.IInstalledInformation;
import com.panasonic.smartpayment.android.api.IPaymentApi;
import com.panasonic.smartpayment.android.api.IPaymentApiListener;
import com.panasonic.smartpayment.android.api.IPaymentDeviceManager;
import com.panasonic.smartpayment.android.api.IReceiptPrinter;
import com.panasonic.smartpayment.android.api.IReceiptPrinterListener;
import com.panasonic.smartpayment.android.api.PaymentApi;
import com.panasonic.smartpayment.android.api.Result;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

public class PosApiModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private IReceiptPrinter mReceiptPrinter;
    private ICustomerDisplay mCustomerDisplay;
    private IInstalledInformation mInstalledInfo;
    private Callback mPrintCallback;
    private Callback mCdOpenedCallback;
    private boolean isCdOpened = false;
    private boolean isSetAppLogo = false;
    private long wsPicModifyTime = 0; //图片修改时间戳，用来更新图片缓存

    private final String mWelcomeScreenPath;
    private final String TAG = PosApiModule.class.getSimpleName();
    private final String PACKAGE_NAME = BuildConfig.APPLICATION_ID;
    private final PaymentApi mPaymentApi;
    private final ReactApplicationContext mContext;
    private final IPaymentApiListener mPaymentApiListener = new IPaymentApiListener.Stub() {
        @Override
        public void onApiConnected() {
            // Set PaymentConfig need
            try {
                // Get PaymentApi instance.
                IPaymentApi pmApi = mPaymentApi.getPaymentApi();
                // Get PaymentDeviceManager instance.
                IPaymentDeviceManager paymentDeviceManager = pmApi.getPaymentDeviceManager();
                // Get ReceiptPrinter instance.
                mReceiptPrinter = paymentDeviceManager.getReceiptPrinter();
                mCustomerDisplay = paymentDeviceManager.getCustomerDisplay();
                mInstalledInfo = pmApi.getInstalledInformation();

                Log.d(TAG, "连接支付接口成功...");
            } catch (Exception ex) {
                ex.printStackTrace();
                mReceiptPrinter = null;
                mCustomerDisplay = null;
                mInstalledInfo = null;
                mPrintCallback = null;
                mCdOpenedCallback = null;
                Log.d(TAG, "连接支付接口出错:::" + ex.getMessage());
            }
        }

        @Override
        public void onApiDisconnected() {
            closeCustomerDisplay(false);
            mReceiptPrinter = null;
            mCustomerDisplay = null;
            mInstalledInfo = null;
            mPrintCallback = null;
            mCdOpenedCallback = null;
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
    private final ICustomerDisplayListener mCustomerDisplayListener = new ICustomerDisplayListener.Stub() {
        @Override
        public void onDetectButton(int idx) {
            Log.d(TAG, "副屏按钮点击结果:::" + idx);
        }

        @Override
        public void onOpenComplete(boolean bo) {
            Log.d(TAG, "副屏打开是否成功:::" + bo);
            if (bo) {
                showDefaultCustomerDisplay();
            }

            if (mCdOpenedCallback != null) {
                mCdOpenedCallback.invoke(bo ? null : mContext.getResources().getString(R.string.customer_display_open_failed));
                mCdOpenedCallback = null; //立即重置
            }

            isCdOpened = bo;
        }
    };

    public PosApiModule(ReactApplicationContext context) {
        super(context);

        mContext = context;
        mPaymentApi = new PaymentApi();
        if (MainActivity.isPanasonicJTC60Device()) {
            context.addLifecycleEventListener(this);
        } else {
            this.copyCustomerDisplayPics(); //虽然不是 POS 机，但也复制一份
        }

        String myPath = context.getExternalCacheDir().getPath() + "/customer_display/";
        File wsFile = new File(myPath + "welcome_screen.jpg");

        if (wsFile.exists()) {
            wsPicModifyTime = wsFile.lastModified();
            mWelcomeScreenPath = (myPath + "welcome_screen.jpg");
        } else {
            wsPicModifyTime = 1;
            mWelcomeScreenPath = (myPath + "app_logo.jpg");
        }
    }

    private void intiAPIService() {
        try {
            if (MainActivity.isPanasonicJTC60Device()) {
                if (!mPaymentApi.isInit()) {
                    mPaymentApi.init(mContext, mPaymentApiListener);
                    this.copyCustomerDisplayPics();
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

    //2024年2月27日显示默认副屏
    private void showDefaultCustomerDisplay() {
        if (mCustomerDisplay != null) {
            if (!isSetAppLogo) {
                mCustomerDisplay.setCustomerImage(PACKAGE_NAME, ICustomerDisplay.IMAGE_KIND_DISPLAY, 0, mWelcomeScreenPath);
                isSetAppLogo = true;
            }
            mCustomerDisplay.doDisplayScreen(PACKAGE_NAME,
                    "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>" +
                    "<customerDisplayApi id=\"defaultCD\">" +
                    "    <screenPattern>1</screenPattern>" +
                    "    <imageArea><imageAreaNumber>1</imageAreaNumber><imageNumber>0</imageNumber></imageArea>" +
                    "</customerDisplayApi>"
            );
        } else {
            Log.d(TAG, "副屏实例为空，无法显示默认副屏...");
        }
    }

    //2024年2月27日 复制副屏需要用到的图像，暴露给外部程序使用
    private void copyCustomerDisplayPics() {
        try {
            AssetManager am = mContext.getResources().getAssets();
            String[] filePaths = am.list("customer_display");
            if (filePaths != null && filePaths.length > 0) {
                File cdDir = new File(mContext.getExternalCacheDir().getPath() + "/customer_display");
                if (!cdDir.exists() && !cdDir.mkdir()) {
                    Log.d(TAG, "创建副屏图像保存目录失败:::" + cdDir.getPath());
                    return;
                }

                //Log.d(TAG, "副屏图像保存目录:::" + cdDir.getPath());
                for (String fp : filePaths) {
                    File theFile = new File(cdDir, fp);
                    if (!theFile.exists()) {
                        byte[] buffer = new byte[8192];
                        int readLength = -1;
                        InputStream ips = am.open("customer_display/" + fp);
                        FileOutputStream fos = new FileOutputStream(theFile);
                        while ((readLength = ips.read(buffer)) != -1) {
                            fos.write(buffer, 0, readLength);
                        }
                        fos.flush();
                        fos.close();
                        ips.close();
                    }
                }
            }
        } catch (IOException ex) {
            Log.d(TAG, "复制副屏图像出错:::" + ex.getMessage());
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "PosApi";
    }

    @Override
    public void onHostResume() {
        Log.d(TAG, "调用了小票打印的 onHostResume...");
        PosApiModule.this.intiAPIService();
    }

    @Override
    public void onHostPause() {
        Log.d(TAG, "调用了小票打印的 onHostPause...");
        closeCustomerDisplay(false);
    }

    @Override
    public void onHostDestroy() {
        try {
            mPaymentApi.term(mContext);
            Log.d(TAG, "销毁了支付/打印接口...");
        } catch (Exception ex) {
            Log.d(TAG, "销毁支付接口出错:::" + ex.getMessage());
        }
    }

    /* ================================ 打印相关 ================================ */

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
                    errMsg = mContext.getResources().getString(R.string.pinter_connection_failed);
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
            errMsg = mContext.getResources().getString(R.string.pinter_xml_is_empty);
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
            new Thread(() -> {
                File pic = downloadImage(uri);
                if (pic != null) {
                    promise.resolve(pic.getPath());
                } else {
                    promise.resolve(null);
                }
            }).start();
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
            if (files != null && files.length > 1) { //2024年4月18日 至少需要两个以上的文件才会清理，否则不必浪费时间去处理
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

    //2024年3月29日，获取打印时留下的缓存大小
    @ReactMethod
    public void getCacheSize(Promise promise) {
        File dir = new File(APP_FILES_CACHE_DIR);
        long size = 0;
        if (dir.exists() && dir.isDirectory()) {
            File[] files = dir.listFiles();
            if (files != null) {
                for (File ff : files) {
                    size += ff.length();
                }
            }
        }
        promise.resolve((double) size);
    }

    /* ================================ 副屏相关 ================================ */

    //2024年2月29日 是否有副屏
    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean hasCustomerDisplay() {
        return (mCustomerDisplay != null);
    }

    //2024年2月26日 打开副屏显示器
    @ReactMethod
    public void openCustomerDisplay(Callback callback) {
        mCdOpenedCallback = callback;
        try {
            if (mCustomerDisplay != null) {
                if (!isCdOpened) {
                    mCustomerDisplay.registerCustomerDisplayListeners(PACKAGE_NAME, mCustomerDisplayListener);
                    mCustomerDisplay.openCustomerDisplay(PACKAGE_NAME);
                } else if (mCdOpenedCallback != null) {
                    mCdOpenedCallback.invoke((String) null);
                    mCdOpenedCallback = null; //立即重置
                }
            } else {
                throw new Exception(mContext.getResources().getString(R.string.customer_display_connection_failed));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            if (mCdOpenedCallback != null) {
                mCdOpenedCallback.invoke(ex.getMessage());
                mCdOpenedCallback = null; //立即重置
            }
        }
    }

    //2024年2月26日 关闭副屏显示器，布尔参数：是否强制关闭！
    @ReactMethod
    public void closeCustomerDisplay(boolean forced) {
        try {
            mCdOpenedCallback = null;
            if (mCustomerDisplay != null && (isCdOpened || forced)) {//如果副屏没有关闭或者需要强制关闭！
                mCustomerDisplay.closeCustomerDisplay(PACKAGE_NAME, true);
                mCustomerDisplay.unregisterCustomerDisplayListeners(PACKAGE_NAME);
            }
            isCdOpened = false;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    //2024年2月26日 设置副屏内容
    @ReactMethod
    public void setCustomerDisplayContent(String content, Promise promise) {
        if (mCustomerDisplay != null) {
            try {
                if (content == null || content.isEmpty()) {
                    showDefaultCustomerDisplay(); //显示欢迎界面
                } else {
                    mCustomerDisplay.doDisplayScreen(PACKAGE_NAME, content);
                }
                promise.resolve(0);
            } catch (Exception ex) {
                ex.printStackTrace();
                promise.reject(ex.getMessage());
            }
        } else {
            promise.reject(mContext.getResources().getString(R.string.customer_display_connection_failed));
        }
    }

    //2024年2月29日 副屏是否开启中
    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isCustomerDisplayOpened() {
        return isCdOpened;
    }

    //2024年3月26日 获取副屏欢迎界面的图像路径
    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getWelcomeScreenImagePath() {
        if (mWelcomeScreenPath != null) {
            return ("file://" + mWelcomeScreenPath + "?ts=" + wsPicModifyTime);
        } else {
            return "";
        }
    }

    //2024年3月27日 更换欢迎泡面图片
    @ReactMethod
    public void changeWelcomeScreenPicture(String path, boolean deletes, Promise promise) {
        if (path != null && !path.isEmpty()) {
            File sourceFile = new File(path);
            if (sourceFile.exists()) {
                try {
                    byte[] buffer = new byte[8192];
                    int readLength = -1;
                    File targetFile = new File(mContext.getExternalCacheDir().getPath() + "/customer_display/welcome_screen.jpg");

                    //创建目录和文件
                    if (!targetFile.exists() && !targetFile.getParentFile().mkdirs()) {
                        Log.d(TAG, "创建文件所在的目录失败...");
                    }

                    FileInputStream fis = new FileInputStream(sourceFile);
                    FileOutputStream fos = new FileOutputStream(targetFile);
                    //复制文件到目标目录
                    while ((readLength = fis.read(buffer)) != -1) {
                        fos.write(buffer, 0, readLength);
                    }
                    fos.flush();
                    fos.close();
                    fis.close();

                    if (deletes && !sourceFile.delete()) {
                        Log.d(TAG, "删除源文件失败...");
                    }

                    wsPicModifyTime = System.currentTimeMillis(); //用来更新图片缓存！

                    promise.resolve((double) wsPicModifyTime);
                } catch (Exception ex) {
                    ex.printStackTrace();
                    promise.reject(ex.getMessage());
                }
            } else {
                promise.reject(mContext.getResources().getString(R.string.welcome_screen_path_is_null));
            }
        } else {
            promise.reject(mContext.getResources().getString(R.string.welcome_screen_path_is_null));
        }
    }

    /* ================================ API版本相关信息 ================================ */
    //2024年2月29日 获取安装信息（异步）
    @ReactMethod
    public void getInstalledInfo(Promise promise) {
        if (mInstalledInfo != null) {
            promise.resolve(getInstalledInfoSync());
        } else {
            promise.reject(mContext.getResources().getString(R.string.installed_info_is_null));
        }
    }

    //2024年2月29日 获取安装信息（同步）
    @ReactMethod(isBlockingSynchronousMethod = true)
    public WritableMap getInstalledInfoSync() {
        WritableMap data = Arguments.createMap();
        if (mInstalledInfo != null) {
            data.putString("tid", mInstalledInfo.getTerminalInfo(IInstalledInformation.ValueType.TID)); //终端识别番号
            data.putString("sysver", mInstalledInfo.getTerminalInfo(IInstalledInformation.ValueType.SYSTEM_VERSION)); //系统版本
            data.putString("sno", mInstalledInfo.getTerminalInfo(IInstalledInformation.ValueType.SERIAL_NUMBER)); //终端序列号
            data.putString("pno", mInstalledInfo.getTerminalInfo(IInstalledInformation.ValueType.PRODUCT_NUMBER)); //产品代码
            data.putString("mno", mInstalledInfo.getMerchantInfo(IInstalledInformation.ValueType.MERCHANT_NUMBER)); //加盟店番号
            data.putString("industry_code", mInstalledInfo.getMerchantInfo(IInstalledInformation.ValueType.INDUSTRY_CODE)); //行业代码
            data.putString("industry_name", mInstalledInfo.getMerchantInfo(IInstalledInformation.ValueType.INDUSTRY_NAME)); //行业名称
            data.putString("sdkver", mPaymentApi.getSdkVersion()); //支付 API 版本
        } else {
            data.putString("tid", "--"); //终端识别番号
            data.putString("sysver", "--"); //系统版本
            data.putString("sno", "--"); //终端序列号
            data.putString("pno", "--"); //产品代码
            data.putString("mno", "--"); //加盟店番号
            data.putString("industry_code", "--"); //行业代码
            data.putString("industry_name", "--"); //行业名称
            data.putString("sdkver", "--"); //支付 API 版本
        }
        return data;
    }

    //2024年4月17日 获取支持的支付方式（异步）
    @ReactMethod
    public void getSupportPaymentList(Promise promise) {
        promise.resolve(this.getSupportPaymentListSync());
    }

    //2024年4月17日 获取支持的支付方式（同步）
    @ReactMethod(isBlockingSynchronousMethod = true)
    public WritableArray getSupportPaymentListSync() {
        WritableArray wa = Arguments.createArray();

        if (mInstalledInfo != null) {
            List<String> ls = mInstalledInfo.getPaymentType();
            if (ls != null) {
                for (String item : ls) {
                    wa.pushString(item);
                }
            }
        }

        return wa;
    }
}