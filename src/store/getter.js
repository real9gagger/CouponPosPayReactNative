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
export function getUserShopName(){
    return store.getState().userInfo.shopName;
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
//获取上次输入的分销码
export function getLastInputPromotionCode(){
    return (store.getState().couponData.lastInputPromotionCode || "");
}
//使用上次输入的分销码
export function useLastInputPromotionCode(){
    return useSelector(state => state.couponData.lastInputPromotionCode);
}
export function useAddedList(){
    return useSelector(state => state.couponData.addedList);
}
export function findCouponInAddedList(code){
    const al = store.getState().couponData.addedList;
    
    if(al && al.length){
        return al.find(vxo => vxo.cpcode === code);
    }
    
    return null;
}
/* ================ 订单相关 ================ */
export function useFailedOrders(){
    return useSelector(state => state.orderData.postFailedCache);
}
export function getFailedOrders(){
    return store.getState().orderData.postFailedCache;
}
export function hasFailedOrders(){
    return useSelector(state => state.orderData.postFailedCache.length);
}
export function checkIsSyncingAll(){
    return store.getState().orderData.isSyncingAll;
}
export function useIsSyncingAll(){
    return useSelector(state => state.orderData.isSyncingAll);
}
export function useOnRefundSuccessful(){
    return useSelector(state => state.orderData.refundSuccessfulOrderID);
}