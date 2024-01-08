import { useEffect } from "react";
import { View, StatusBar } from "react-native";
import SplashScreen from "react-native-splash-screen";

//应用启动屏
export default function IndexSplash(props){
    useEffect(() => {
        // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        setTimeout(SplashScreen.hide, 200); //延迟一点时间！
        props.navigation.replace("应用首页"); //初始化完成，跳转到主页
    }, []);
    
    /*正在启动... react-native-navigation-bar-color */
    return (<View><StatusBar hidden={true} /></View>);
}