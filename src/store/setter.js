import { store } from "./index"; //使用 useDispatch 报错，因此直接使用 store.dispatch，但官方不推荐：https://github.com/reduxjs/react-redux/discussions/1789
import { changeLanguage, initiLanguage } from "./localesReducer";
import { updateUserInfo, resetUserInfo, setAccessToken } from "./userReducer";
import { updateAppSettings, initiAppSettings, checkAppSettings, updateLanguageSettings, addAppErrorInfo, clearAppErrorInfo } from "./settingsReducer";
import { setLastUsed, addNewCoupon, deleteAddedCoupon, onInitiCouponData, removeLastInputPromotionCode } from "./couponReducer";
import { addFailedOrder, removeFailedOrder, updateFailedOrder, updateFailedField, synchronousAllOrder, onRefundSuccessful, onInitiOrderData } from "./orderReducer";

//初始化存储仓库
export function dispatchInitiStore(){
    const lgcode = store.getState().appSettings.languageCode;
    const actionType = initiLanguage(lgcode);
    
    store.dispatch(actionType); //加载语言包
    
    if(actionType.payload.code !== lgcode){
        store.dispatch(updateLanguageSettings(actionType.payload.code)); //保存语言编码
    }
    
    store.dispatch(initiAppSettings());
    store.dispatch(onInitiCouponData()); //初始化优惠券数据
    store.dispatch(onInitiOrderData()); //初始化订单数据
}

/* ================ 本地语言相关 ================ */
export function dispatchChangeLanguage(lgcode){
    const actionType = changeLanguage(lgcode);
    store.dispatch(actionType);
    store.dispatch(updateLanguageSettings(actionType.payload.code)); //保存语言编码
}
/* ================ 用户信息相关 ================ */
export function dispatchUpdateUserInfo(infos){
    if(infos && typeof infos === "object"){
        store.dispatch(updateUserInfo(infos));
    }
}
export function dispatchResetUserInfo(){
    store.dispatch(resetUserInfo());
}
export function dispatchSetAccessToken(token, expin, account, password){
    store.dispatch(setAccessToken(token, expin, account, password));
}

/* ================ 本地设置项 ================ */
export function dispatchUpdateAppSettings(key, value){
    store.dispatch(updateAppSettings(key, value));
}
export function dispatchCheckAppSettings(){
    store.dispatch(checkAppSettings());
}
export function dispatchAddAppErrorInfo(errMsg, isFatal){
    store.dispatch(addAppErrorInfo(errMsg, isFatal));
}
export function dispatchClearAppErrorInfo(){
    store.dispatch(clearAppErrorInfo());
}
/* ================ 优惠券相关 ================ */
export function dispatchSetLastUsed(info){
    store.dispatch(setLastUsed(info));
}
export function dispatchAddNewCoupon(info){
    store.dispatch(addNewCoupon(info));
}
export function dispatchDeleteAddedCoupon(code){
    store.dispatch(deleteAddedCoupon(code));
}
export function dispatchRemoveLastInputPromotionCode(){
    store.dispatch(removeLastInputPromotionCode());
}
/* ================ 订单相关 ================ */
export function dispatchAddFailedOrder(api, data, msg){
    store.dispatch(addFailedOrder(api, data, msg));
}
export function dispatchRemoveFailedOrder(fid){
    store.dispatch(removeFailedOrder(fid));
}
export function dispatchUpdateFailedOrder(fid, msg, syncing){
    store.dispatch(updateFailedOrder(fid, msg, syncing));
}
export function dispatchUpdateFailedField(fid, field, newval){
    store.dispatch(updateFailedField(fid, field, newval));
}
export function dispatchSynchronousAllOrder(bo){
    store.dispatch(synchronousAllOrder(bo));
}
export function dispatchOnRefundSuccessful(oid){
    store.dispatch(onRefundSuccessful(oid));
}