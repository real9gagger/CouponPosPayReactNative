package com.couponpospayreactnative.appinfo;

import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Locale;

public class AppPackageInfoModule extends ReactContextBaseJavaModule {

    private final String mAppVersionName;
    private final String mAppFullVersion;
    private final String mAppPackageName;
    private final String mApplicationName;
    private final long mLastUpdateTime;

    public AppPackageInfoModule(ReactApplicationContext context) {
        super(context);

        String verStr = "";
        String verNm = "";
        String appNm = "";
        long updateTime = 0;

        mAppPackageName = context.getPackageName();

        try {
            PackageManager pm = context.getPackageManager();
            PackageInfo pi = pm.getPackageInfo(mAppPackageName, 0);

            verNm = pi.versionName;
            verStr = (pi.versionName + "." + pi.versionCode);
            appNm = pm.getApplicationLabel(pm.getApplicationInfo(mAppPackageName, 0)).toString();
            updateTime = pi.lastUpdateTime;
        } catch (PackageManager.NameNotFoundException ex) {
            ex.printStackTrace();
        }

        mAppVersionName = verNm;
        mLastUpdateTime = updateTime;
        mAppFullVersion = verStr;
        mApplicationName = appNm;
    }

    @NonNull
    @Override
    public String getName() {
        return "AppPackageInfo";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getVersionName(){
        return mAppVersionName;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getFullVersion(){
        return mAppFullVersion;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getPackageName(){
        return mAppPackageName;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public double getLastUpdateTime() {
        return ((double) mLastUpdateTime);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getAppName(){
        return mApplicationName;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getLocaleLanguage() {
        return (Locale.getDefault().getLanguage() + "_" + Locale.getDefault().getCountry());
    }

    //2024年4月1日 转到开机自启设置页面（第三方设置页面）
    //探测开机自启设置页的命令行：adb shell dumpsys activity activities
    //打开方式：POS的设置 >> 系统 >> Operation Settings >> Automatic start service setting
    @ReactMethod
    public void gotoAutoLaunchSettingActivity(Promise promise) {
        try {
            Intent settingIntent = new Intent();
            settingIntent.setClassName("com.panasonic.pmc.android.enterpriselauncher", "com.panasonic.pmc.android.enterpriselauncher.DefaultLaunchAppActivity");
            settingIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            this.getReactApplicationContext().startActivity(settingIntent);
            promise.resolve(1);
        } catch (Exception ex) {
            ex.printStackTrace();
            promise.reject(ex.getMessage());
        }
    }
}
