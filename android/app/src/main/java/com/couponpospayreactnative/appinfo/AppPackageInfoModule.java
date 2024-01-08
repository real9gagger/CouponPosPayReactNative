package com.couponpospayreactnative.appinfo;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AppPackageInfoModule extends ReactContextBaseJavaModule {

    private final String mAppVersionName;
    private final String mAppFullVersion;
    private final String mAppPackageName;
    private final long mLastUpdateTime;

    public AppPackageInfoModule(ReactApplicationContext context) {
        super(context);

        String verStr = "";
        String verNm = "";
        long updateTime = 0;

        mAppPackageName = context.getPackageName();

        try {
            PackageManager pm = context.getPackageManager();
            PackageInfo pi = pm.getPackageInfo(mAppPackageName, 0);

            verNm = pi.versionName;
            verStr = (pi.versionName + "." + pi.versionCode);
            updateTime = pi.lastUpdateTime;
        } catch (PackageManager.NameNotFoundException ex) {
            ex.printStackTrace();
        }

        mAppVersionName = verNm;
        mLastUpdateTime = updateTime;
        mAppFullVersion = verStr;
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
}
