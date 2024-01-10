package com.couponpospayreactnative.appinfo;

import android.app.Activity;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AppNavigationInfoModule extends ReactContextBaseJavaModule {

    private final String TAG = "AppNavigationInfoModule";
    private final ReactApplicationContext mRNContext;

    private boolean mIsFirstSet = true;
    private int mDefaultColor = -1;

    public AppNavigationInfoModule(ReactApplicationContext context) {
        super(context);
        this.mRNContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "AppNavigationInfo";
    }

    @ReactMethod
    public void setColor(int hexColor) {
        Activity act = this.mRNContext.getCurrentActivity();
        if(act != null){
            if(this.mIsFirstSet){
                this.mDefaultColor = act.getWindow().getNavigationBarColor();
                this.mIsFirstSet = false;
                Log.d(TAG, "系统导航栏默认颜色：" + this.mDefaultColor);
            }
            act.runOnUiThread(() -> act.getWindow().setNavigationBarColor(hexColor));
        } else {
            Log.d(TAG, "活动页为空，无法设置系统导航栏颜色...");
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int getColor(boolean isGetDef) {
        if(isGetDef){
            return this.mDefaultColor;
        }

        Activity act = this.mRNContext.getCurrentActivity();
        if (act != null) {
            return act.getWindow().getNavigationBarColor();
        } else {
            Log.d(TAG, "活动页为空，无法获取系统导航栏颜色...");
        }
        return 0;
    }

    @ReactMethod
    public void resetColor(){
        this.setColor(this.mDefaultColor);
    }
}
