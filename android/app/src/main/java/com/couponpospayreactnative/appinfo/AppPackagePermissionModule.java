package com.couponpospayreactnative.appinfo;

import static com.couponpospayreactnative.Constants.REQUEST_PERMS_CODE;

import android.Manifest.permission;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.List;

public class AppPackagePermissionModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext mRTcontent;

    public AppPackagePermissionModule(ReactApplicationContext context) {
        mRTcontent = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "AppPackagePermission";
    }

    private boolean isNotGranted(String perm) {
        return (mRTcontent.checkSelfPermission(perm) != PackageManager.PERMISSION_GRANTED);
    }

    private void tryToGranted(String[] list) {
        Activity curAct = mRTcontent.getCurrentActivity();
        if (curAct != null) {
            curAct.requestPermissions(list, REQUEST_PERMS_CODE);
        }
    }

    @ReactMethod
    public void checkAllPermissions() {
        List<String> permList = new ArrayList<>();

        //位置权限
        if (this.isNotGranted(permission.ACCESS_COARSE_LOCATION)) {
            permList.add(permission.ACCESS_COARSE_LOCATION);
        }

        //后台定位权限
        if (this.isNotGranted(permission.ACCESS_FINE_LOCATION)) {
            permList.add(permission.ACCESS_FINE_LOCATION);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                permList.add(permission.ACCESS_BACKGROUND_LOCATION);
            }
        }

        //相机权限
        if (this.isNotGranted(permission.CAMERA)) {
            permList.add(permission.WRITE_EXTERNAL_STORAGE);
        }

        //存储权限
        if (this.isNotGranted(permission.WRITE_EXTERNAL_STORAGE)) {
            permList.add(permission.WRITE_EXTERNAL_STORAGE);
        }
        if (this.isNotGranted(permission.READ_EXTERNAL_STORAGE)) {
            permList.add(permission.READ_EXTERNAL_STORAGE);
        }

        //电话相关权限
        if (this.isNotGranted(permission.READ_PHONE_STATE)) {
            permList.add(permission.READ_PHONE_STATE);
        }

        if (permList.size() > 0) {
            this.tryToGranted(permList.toArray(new String[0]));
        }
    }

    @ReactMethod
    public void checkLocationPermissions(Promise promise) {
        if (this.isNotGranted(permission.ACCESS_FINE_LOCATION)) {
            Activity curAct = mRTcontent.getCurrentActivity();
            if (curAct != null) {
                if (!curAct.shouldShowRequestPermissionRationale(permission.ACCESS_FINE_LOCATION)) {
                    this.tryToGranted(new String[]{permission.ACCESS_FINE_LOCATION});
                    promise.resolve(1); //请求权限，显示授权提示框
                } else {
                    promise.resolve(2); //显示自定义弹窗，让用户跳转到APP设置页，开启权限
                }
            } else {
                promise.resolve(-1); //申请权限出错
            }
        } else {
            promise.resolve(0); //已有权限
        }
    }

    @ReactMethod
    public void goPermissionsSetting() {
        //跳转到APP设置页面，让用户设置权限
        Intent intent = new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        intent.setData(android.net.Uri.parse("package:" + mRTcontent.getPackageName()));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mRTcontent.startActivity(intent);
    }
}
