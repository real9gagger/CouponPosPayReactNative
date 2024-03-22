package com.couponpospayreactnative;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
public class BootReceiver extends BroadcastReceiver {
    private final String TAG = BootReceiver.class.getSimpleName();
    @Override
    public void onReceive(Context context, Intent intent) {
        String acStr = intent.getAction();
        Log.d(TAG, "APP 开机自启了::::" + acStr);
        /* 2024年3月22日，效果不佳，暂停使用  if (Intent.ACTION_BOOT_COMPLETED.equals(acStr)) {
            //开机后，启动 APP...
            Intent launchIntent = new Intent(context, MainActivity.class);
            launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(launchIntent);
        } */
    }
}
