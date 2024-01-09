import { useSelector } from "react-redux";
import { store } from "./index";

/* export function useGetter(...names) {
    const output = {};
    const state = useSelector(vs => vs);
    for(const nm of names){
        switch(nm){
            case "i18n": output.i18n = state.localesSetting.i18n; break;
        }
    }
    return output;
} */

//只能在函数组件使用
export function useI18N() {
    return useSelector(state => state.localesSetting.i18n);
}
//类组件中使用
export function getI18N(key){
    if(key){
        return store.getState().localesSetting.i18n[key];
    } else {
        return store.getState().localesSetting.i18n;
    }
}

//获取登录令牌
export function getAuthToken(){
    return store.getState().userInfo.authToken; //具体值待定
}

//使用用户信息，函数组件中使用
export function useUserInfo(){
    return useSelector(state => state.userInfo);
}

//获取用户信息，类组件中使用
export function getUserInfo(){
    return store.getState().userInfo;
}