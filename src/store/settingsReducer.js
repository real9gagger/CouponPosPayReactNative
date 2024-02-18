import { UPDATE_SETTINGS, UNKNOWN_ACTION } from "./types";

const initialState = {
    languageCode: "", //语言编码，如：zh_CN
    isEnableDrawer: true, //启用抽屉栏
    isEnableTabbar: true, //启用底部导航栏
    isEnableHomeHeader: true, //是否显示主页标题栏
    isEnableSystemNavigation: true, //显示系统导航栏
    numbersDecimalOfMoney: 0, //金额保留的小数位数
};

//单个更新本地设置
export function updateAppSettings(key, value){
    if(key){
        const tok = (typeof key);
        if(tok === "string"){
            return {
                type: UPDATE_SETTINGS,
                payload: { [key]: value }
            }
        } else if(tok === "object"){
            return {
                type: UPDATE_SETTINGS,
                payload: value
            }
        }
    }
    
    return {
        type: UNKNOWN_ACTION,
        payload: null
    }
}

//更新语言设置
export function updateLanguageSettings(code){
    return {
        type: UPDATE_SETTINGS,
        payload: {
            "languageCode": code
        }
    }
}

export default settingsReducer = (state = initialState, action) => {
    switch(action.type){
        case UPDATE_SETTINGS: return {...state, ...action.payload};
    }

    return state;
}