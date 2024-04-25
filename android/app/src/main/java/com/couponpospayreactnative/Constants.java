package com.couponpospayreactnative;

import android.os.Environment;

//常量
public class Constants {
    public static final int REQUEST_QRCODE_CODE = 77; //扫描二维码
    public static final int REQUEST_PERMS_CODE = 88; //权限设置
    public static final int REQUEST_PAY_CODE = 99; //支付相关
    //2024年4月25日弃用 public static final String APP_FILES_CACHE_DIR = (Environment.getExternalStorageDirectory().getPath() + "/.PosPayFilesCache/"); //文件缓存目录路径（隐藏的文件夹）
}
