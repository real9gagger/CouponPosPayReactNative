import { UPDATE_SETTINGS, INITI_SETTINGS, CHECK_SETTINGS, ADD_APP_ERROR_INFO, CLEAR_APP_ERROR_INFO, UNKNOWN_ACTION } from "./types";
import { CASH_PAYMENT_CODE, CREDIT_CARD_PAYMENT_CODE, E_MONEY_PAYMENT_CODE, QR_CODE_PAYMENT_CODE } from "@/common/Statics";
import { getSupportPaymentMap, isSupportPayType } from "@/modules/PaymentHelper";
import AppPackageInfo from "@/modules/AppPackageInfo";

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
    isUsePosMode: true, //是否使用POS模式，功能和界面上和手机不一样
    appErrorList: [], //APP全局错误列表
    lastErrorMessage: "", //最后的错误信息（【英文】一般用于记录APP设置时的错误信息）
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

//检查配置项
export function checkAppSettings(){
    return {
        type: CHECK_SETTINGS,
        payload: 0x8888
    }
}

//添加应用错误
export function addAppErrorInfo(errMsg, isFatal){
    if(errMsg){
        return {
            type: ADD_APP_ERROR_INFO,
            payload: {
                createTime: Date.now(),
                errorMsg: errMsg.toString(),
                isFatal: !!isFatal
            }
        };
    } else {
        return {
            type: UNKNOWN_ACTION,
            payload: null
        };
    }
}

//清除应用错误
export function clearAppErrorInfo(){
    return {
        type: CLEAR_APP_ERROR_INFO,
        payload: null
    };
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
                state.isUsePosMode = AppPackageInfo.isPosDevice();
                return {...state};
            }
            break;
        case ADD_APP_ERROR_INFO:
            if(state.appErrorList){
                if(state.appErrorList.length > 100){//数量限制
                    state.appErrorList.splice(0, 50); //删除大约一半的项
                }
                state.appErrorList.push(action.payload);
            } else {
                state.appErrorList = [action.payload];
            }
            return {...state};
        case CLEAR_APP_ERROR_INFO: 
            if(state.appErrorList){
                state.appErrorList.splice(0);
            } else {
                state.appErrorList = [];
            }
            return {...state};
        case CHECK_SETTINGS:
            if(action.payload === 0x8888){
                let count = 0;
                //双向检查！！！先检查没有的
                for(const key in initialState){
                    if(state[key] === undefined){
                        state[key] = initialState[key];
                        count++;
                    }
                }
                //再检查有的
                for(const key in state){
                    if(initialState[key] === undefined){
                        delete state[key];
                        count++;
                    }
                }
                state.lastErrorMessage = (`Detected ${count} configuration items with issues!`);
                return {...state};
            }
            break;
    }

    return state;
}