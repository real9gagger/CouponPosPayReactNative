import { useEffect } from "react";
import { View, StatusBar } from "react-native";
import { getAccessToken } from "@/store/getter";
import SplashScreen from "react-native-splash-screen";

//应用启动屏
export default function IndexSplash(props){
    useEffect(() => {
        // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        
        setTimeout(SplashScreen.hide, 100); //延迟一点时间！
        if(getAccessToken()){
            props.navigation.replace("应用首页"); //初始化完成，跳转到首页
        } else {
            props.navigation.replace("登录页"); //如果没有登录，则跳转到登录页
        }
    }, []);
    
    /*正在启动... react-native-navigation-bar-color */
    return (<View><StatusBar hidden={true} /></View>);
}