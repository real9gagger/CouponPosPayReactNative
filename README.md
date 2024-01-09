## 项目名称
> POS机付款APP -- 2024年1月4日
* logo艺术字体生成：https://font.chinaz.com/diy/971022.html

## 运行条件
> 列出运行该项目所必须的条件和相关依赖  
* npm install
* Android Studio 打开项目下的 android 文件夹，等 Gradle 构建好后【建议C盘预留 10GB 空间】，Rebuild。不出错然后把APP运行到AVD或者手机
* npm start
* 【如果手机不是USB调试，摇动手机四下，弹出的框选 “Settings” >> “Debug server host & port for device” 然后输入电脑IP地址和端口号：8081】
* 【后续如果新增了第三方插件，可能需要重新运行 Android Studio 的 Rebuild Project】

## 打包条件
> 列出打包该项目所必须的条件和相关依赖 
* 先运行在项目根目录下命令行 react-native bundle --entry-file index.js --bundle-output ./android/app/src/main/assets/index.android.bundle --platform android --assets-dest ./android/app/src/main/res/ --dev false
* 接着用 Android Studio 打包 或者 根目录下直接运行命令 cd android && gradlew assembleRelease 
* 【打包输出文件：/android/app/build/outputs/apk/release】

* 【或者直接用 Android Studio 直接打包】

## 第三方插件修改说明
> 说明如何修改第三方项目，建议给出具体的步骤说明
    
## 测试说明
> 如果有测试相关内容需要说明，请填写在这里  



## 技术架构
> 使用的技术框架或系统架构图等相关说明，请填写在这里  


## 协作者
> 高效的协作会激发无尽的创造力，将他们的名字记录在这里吧
