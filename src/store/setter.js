import { store } from "./index"; //使用 useDispatch 报错，因此直接使用 store.dispatch，但官方不推荐：https://github.com/reduxjs/react-redux/discussions/1789
import { changeLanguage, initiLanguage } from "./localesReducer";
import { updateUserInfo, setAccessToken } from "./userReducer";
import { updateAppSettings, updateLanguageSettings } from "./settingsReducer";

/* ================ 本地语言相关 ================ */
export function dispatchChangeLanguage(lgcode){
    const actionType = changeLanguage(lgcode);
    store.dispatch(actionType);
    store.dispatch(updateLanguageSettings(actionType.payload.code)); //保存语言编码
}
export function dispatchInitiLanguage(){
    const lgcode = store.getState().appSettings.languageCode;
    const actionType = initiLanguage(lgcode);
    
    store.dispatch(actionType);
    
    if(actionType.payload.code !== lgcode){
        store.dispatch(updateLanguageSettings(actionType.payload.code)); //保存语言编码
    }
}
/* ================ 用户信息相关 ================ */
export function dispatchUpdateUserInfo(infos){
    store.dispatch(updateUserInfo(infos));
}
export function dispatchSetAccessToken(token, expin, account, password){
    store.dispatch(setAccessToken(token, expin, account, password));
}

/* ================ 本地设置项 ================ */
export function dispatchUpdateAppSettings(key, value){
    store.dispatch(updateAppSettings(key, value));
}