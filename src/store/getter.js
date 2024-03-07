import { useSelector } from "react-redux";
import { store } from "./index";

/* ================ 本地语言相关 ================ */
//只能在函数组件使用
export function useI18N() {
    return useSelector(state => state.localesLanguage.i18n);
}
//类组件中使用
export function getI18N(key, ...args){
    if(key){
        const output = store.getState().localesLanguage.i18n[key];
        if(args && typeof output === "object"){
            return output.cloze(...args);
        } else {
            return output;
        }
    } else {
        return store.getState().localesLanguage.i18n;
    }
}
//获取语言对应的代码
export function getLanguageCode(){
    return store.getState().localesLanguage.code;
}
//获取语言名称
export function getLanguageName(){
    return store.getState().localesLanguage.i18n["app.lgname"];
}

/* ================ 用户信息相关 ================ */
//获取登录令牌
export function getAccessToken(){
    return store.getState().userInfo.accessToken; //具体值待定
}
//使用用户信息，函数组件中使用
export function useUserInfo(){
    return useSelector(state => state.userInfo);
}
//获取用户信息，类组件中使用
export function getUserInfo(key){
    if(key){
        return store.getState().userInfo[key];
    } else {
        return store.getState().userInfo;
    }
}
export function getUserPosName(){
    return store.getState().userInfo.posName;
}

/* ================ APP设置相关 ================ */
//使用APP设置，函数组件中使用
export function useAppSettings(){
    return useSelector(state => state.appSettings);
}
export function getAppSettings(key){
    if(key){
        return store.getState().appSettings[key];
    } else {
        return store.getState().appSettings;
    }
}
export function getNumbersDecimalOfMoney(key){
    return (store.getState().appSettings.numbersDecimalOfMoney || 0);
}
export function getGeneralTaxRate(){
    return (+store.getState().appSettings.generalTaxRate || 0);
}

/* ================ 优惠券相关 ================ */
export function isCouponInUse(code){
    if(!code){
        return false;
    }
    
    const lu = store.getState().couponData.lastUsed;
    return (!!lu && lu.cpcode === code);
}
//获取正在使用的优惠券信息
export function getCouponInUse(code){
    if(!code){
        return null;
    }
    
    const lu = store.getState().couponData.lastUsed;
    return (lu && lu.cpcode === code ? lu : null);
}