import { UPDATE_SETTINGS, INITI_SETTINGS, UNKNOWN_ACTION } from "./types";
import { CASH_PAYMENT_CODE, CREDIT_CARD_PAYMENT_CODE, E_MONEY_PAYMENT_CODE, QR_CODE_PAYMENT_CODE } from "@/common/Statics";
import { getSupportPaymentMap, isSupportPayType } from "@/modules/PaymentHelper";

const initialState = {
    generalTaxRate: 0, //通用税率（%）
    languageCode: "", //语言编码，如：zh_CN
    regionalCurrencySymbol: "￥", //所在地区的货币符号，默认日本货币符号
    regionalCurrencyCode: "JPY", //所在地区的货币代号，默认日元代号
    regionalCurrencyUnit: "円", //所在地区的货币单元，默认円（日元）
    isEnableDrawer: true, //启用抽屉栏
    isEnableTabbar: true, //启用底部导航栏
    isEnableHomeHeader: false, //是否显示主页标题栏
    isEnableSystemNavigation: true, //显示系统导航栏
    numbersDecimalOfMoney: 0, //金额保留的小数位数
    paymentReceiptBottomText: "", //付款单底部自定义文本
    paymentReceiptPrintShopLogo: true, //款单小票是否打印付店铺LOGO
    customerDisplayShowPayAmountInfo: true, //结账时副屏显示付款金额
    homePayTypeTabs: [
        { tabkey: "tabQRCode", disabled: false, pmtype: QR_CODE_PAYMENT_CODE },
        { tabkey: "tabBankCard", disabled: false, pmtype: CREDIT_CARD_PAYMENT_CODE },
        { tabkey: "tabEWallet", disabled: false, pmtype: E_MONEY_PAYMENT_CODE },
        { tabkey: "tabCashPay", disabled: false, pmtype: CASH_PAYMENT_CODE },
    ], //首页支付类型显示哪些标签页，以及标签页的排序顺序。【空数组表示全部显示（默认）！】
    isAppFirstLaunch: true, //是否是软件安装之后首次启动！
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

//初始化配置项
export function initiAppSettings(){
    return {
        type: INITI_SETTINGS,
        payload: null
    }
}

export default settingsReducer = (state = initialState, action) => {
    switch(action.type){
        case UPDATE_SETTINGS: return {...state, ...action.payload};
        case INITI_SETTINGS: 
            if(state.isAppFirstLaunch){//仅首次运行时初始化
                getSupportPaymentMap(); //先获取支持的支付方式数据
                for(const tab of state.homePayTypeTabs){
                    tab.disabled = !isSupportPayType(tab.pmtype);
                }
                state.isAppFirstLaunch = false;
                return {...state};
            }
            break;
    }

    return state;
}