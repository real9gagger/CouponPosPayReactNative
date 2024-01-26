## 项目名称
> POS机付款APP -- 2024年1月4日
* logo艺术字体生成（字体大小：150px，保存到本地后用PS调整画布大小为1000x1000即可）：https://font.chinaz.com/diy/971022.html

## 运行条件
> 列出运行该项目所必须的条件和相关依赖  
* npm install
* Android Studio 打开项目下的 android 文件夹，等 Gradle 构建好后【建议C盘预留 20GB 空间】，Rebuild。不出错然后把APP运行到AVD或者手机
* npm start

* 【如果手机不是USB调试，摇动手机四下，弹出的框选 “Settings” >> “Debug server host & port for device” 然后输入电脑IP地址和端口号：8081】
* 【后续如果新增了第三方插件，可能需要重新运行 Android Studio 的 Rebuild Project】
* 【如果用 Android Studio 编译 react-native-reanimated 失败：出现 react-native-reanimated:downloadXXX FAILED 的情况】
    *  打开 /node_modules/react-native-reanimated/android/build.gradle 搜索：
    *  https://github.com/react-native-community/boost-for-react-native、
    *  https://github.com/google/glog/archive、
    *  https://github.com/facebook/folly/archive、
    *  https://github.com/google/double-conversion/archive 
    *  将上述四个链接中的 “github.com” 换成 “kkgithub.com”（或者其他镜像网站也可以）

## 调试 Panasonic JT-C60 开发专用POS机
> 注意：必须是【开发专用】POS机。【商用】的无法用于开发
* 1、APK签名详细信息参考官方 APK 签名方法：https://www.smbc-card.com/steradevelopers/develop/signature.jsp
* 2、打包出 APK 文件后，使用 /android/app/AppStoreTestSign.bat 文件，执行命令行 AppStoreTestSign.bat zzz/yyy/xxx.apk 
    * 【注意】官方的 AppStoreTestSign.bat 是有问题的，需要修改后才能使用！放在 /android/app/ 目录下的 AppStoreTestSign.bat 是修改后的文件，可直接使用
    * 【注意】如果运行 AppStoreTestSign.bat 后仍然安装失败，请打开 AppStoreTestSign.bat 查看详细信息
    * 【注意】推荐安装 openssl 版本：1.1.1w，或者其他低于 3.0.0 的版本（已放在 /android/app/Win64OpenSSL_Light-1_1_1w-20240125.zip 中，解压安装即可）
* 3、安装 APK 时，必须使用 adb install -r xxx.apk 命令行安装，直接复制 APK 文件到设备将无法安装！
* 4、显示POS机调试设置界面：安装 Debug 版 APK 后，打开出行红字错误。运行 adb shell input keyevent KEYCODE_MENU 即可显示调试设置页面，设置 debug host 后，重启APP即可。
> 【>> 经测试发现，第 2 步只需要执行首次就行，后续可以直接跳过这步，执行第 3 步 <<】

## 打包条件
> 列出打包该项目所必须的条件和相关依赖 
* 先运行在项目根目录下命令行 react-native bundle --entry-file index.js --bundle-output ./android/app/src/main/assets/index.android.bundle --platform android --assets-dest ./android/app/src/main/res/ --dev false
* 接着用 Android Studio 打包 或者 根目录下直接运行命令 cd android && gradlew assembleRelease 
* 【打包输出文件：/android/app/build/outputs/apk/release】
* 【或者直接用 Android Studio 直接打包】

## 第三方插件修改说明
> 说明如何修改第三方项目，建议给出具体的步骤说明  
> 【以下修改可以改善第三方组件的体验】  
> 【！！！每次添加新插件后，以下配置都可能被覆盖，需要重新修改！！！】  
* 【图片预览点击空白无法关闭问题】打开 /node_modules/react-native-image-viewing/ImageViewing.js。转到第42行，将 View 改为 TouchableOpacity（需要 import），并添加两个属性 “ activeOpacity={1} onPress={onRequestCloseEnhanced} ”。
* 【Android 8+ 启动屏无法全屏问题】打开 /node_modules/react-native-splash-screen/android/src/main/java/org/devio/rn/splashscreen/SplashScreen.java 找到 setActivityAndroidP 函数。在 if(Build.VERSION.SDK_INT >= 28){...} 语句后面加上如下代码：（2024年1月26日 使用的是 react-native-splash-screen 3.3.0 版本）
```java
else {
    if (dialog != null && dialog.getWindow() != null) {
        int uiFlags =
                ( View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
        dialog.getWindow().getDecorView().setSystemUiVisibility(uiFlags);
    }
} //！！！需要 import android.view.View;
```

## 测试说明
> 如果有测试相关内容需要说明，请填写在这里  



## 技术架构
> 使用的技术框架或系统架构图等相关说明，请填写在这里  


## 协作者
> 高效的协作会激发无尽的创造力，将他们的名字记录在这里吧
