/**
 * 全局变量文件
 */
import { Dimensions, Platform, StatusBar, PixelRatio, ToastAndroid } from "react-native";

//防抖定时器ID
let debounceTimer = 0;
//节流开关
let isThrottled = false;

// 获取设备宽高
const dimensionsInfo = Dimensions.get("window");
// 苹果
const isIOS = (Platform.OS === "ios");
// 安卓
const isAndroid = (Platform.OS === "android");
// 苹果x以上会有底部低配区域
const isIPhoneX = (isIOS && dimensionsInfo.height === 812 && dimensionsInfo.width === 375);

// 声明全局变量保存设备宽高 
global.deviceDimensions = {
    // 宽度
    screenWidth: dimensionsInfo.width,
    // 高度
    screenHeight: dimensionsInfo.height,
    // 状态栏高度
    statusBarHeight: (isIOS ? (isIPhoneX ? 44 : 20) : StatusBar.currentHeight),
    // 像素比
    onePixelRatio: 1.0 / PixelRatio.get(),
    // 是否是横屏
    isLandscape: (dimensionsInfo.width > dimensionsInfo.height)
};
// 运行时环境
global.runtimeEnvironment = {
    isIOS: isIOS,
    isAndroid: isAndroid,
    isIPhoneX: isIPhoneX,
    isProduction: (process.env.NODE_ENV === "production"), //是否是生成环境
};
// APP 主色调
global.appMainColor = "#30a3fc";
// APP 主色的浅色调。比主色浅一点
global.appLightColor = "#62b9fd"; //由 SASS 的 lighten(appMainColor, 10%) 生成所得。https://sass.js.org/
// APP 主色的深色调。比主色深一点
global.appDarkColor = "#048cf5"; //由 SASS 的 darken(appMainColor, 10%) 生成所得。https://sass.js.org/
// APP 基准字体大小（后面可以设置1倍、2倍、3倍的基于基准字体的大小）
global.appBaseFontSize = (dimensionsInfo.scale > 2 ? 16 : 14);

//获取基于基准字体的多少倍（get responsive font size）字体，类似于 CSS rem 单位
global.$getrfs = (em) => Math.max((+em || 1) * appBaseFontSize, 0);
// 图片地址。Object Storage Service Path 数据对象存储服务的路径
global.$osspath = (path) => {
    if(path){
        return { uri: ("https://file.xcarbon.cc/driver/" + path) };
    } else {
        return null;
    }
}
// Toast消息提示
global.$toast = (msg, number) => {
    if(msg){
        ToastAndroid.showWithGravity(
            msg,
            number || 2000,
            ToastAndroid.CENTER
        );
    }
}
// 防抖
global.$debounce = (func, delay, ...args) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay, ...args);
}
// 节流
global.$throttle = (func, delay, ...args) => {
    if (!isThrottled) {
        isThrottled = true;
        func(...args);
        setTimeout(() => isThrottled=false, delay);
    }
}
// 保留 N 位小数 Math.round 的升级版
global.$mathround = (n1, n2) => {
    const nNum =(+n1);
    const nPow = (n2 ? Math.pow(10, n2) : 0);
    
    if(!nNum){
        return 0;
    } else {
        if(nPow){
            return Math.round(nNum * nPow) / nPow;
        } else {
            return nNum;
        }
    }
}