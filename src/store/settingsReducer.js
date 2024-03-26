import { UPDATE_SETTINGS, UNKNOWN_ACTION } from "./types";

const initialState = {
    generalTaxRate: 0, //通用税率（%）
    languageCode: "", //语言编码，如：zh_CN
    regionalCurrencySymbol: "￥", //所在地区的货币符号，默认日本货币符号
    regionalCurrencyCode: "JPY", //所在地区的货币代号，默认日元代号
    regionalCurrencyUnit: "円", //所在地区的货币单元，默认円（日元）
    isEnableDrawer: true, //启用抽屉栏
    isEnableTabbar: true, //启用底部导航栏
    isEnableHomeHeader: true, //是否显示主页标题栏
    isEnableSystemNavigation: true, //显示系统导航栏
    numbersDecimalOfMoney: 0, //金额保留的小数位数
    paymentReceiptBottomText: "", //付款单底部自定义文本
    paymentReceiptPrintShopLogo: true, //款单小票是否打印付店铺LOGO
    customerDisplayShowPayAmountInfo: true, //结账时副屏显示付款金额
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