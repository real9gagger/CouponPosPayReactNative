import { useEffect } from "react";
import { dispatchUpdateUserInfo } from "@/store/setter";
import SplashScreen from "react-native-splash-screen";

//应用启动屏
export default function IndexSplash(props){
    useEffect(() => {
        //检查用户是否已登录或者登录是否成功
        $request("getPostInfo", { doNotToastErrMsg: true }).then(res => {
            dispatchUpdateUserInfo(res); //每次启动时更新用户信息！
            SplashScreen.hide();
            props.navigation.replace("应用首页"); //初始化完成，跳转到首页
        }).catch(err => {
            SplashScreen.hide();
            props.navigation.replace("登录页"); //如果没有登录，则跳转到登录页
        });
    }, []);
    
    /* 正在启动... */
    return (null);
}