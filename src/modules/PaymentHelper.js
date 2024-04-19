import { NativeModules } from "react-native";
import { CASH_PAYMENT_CODE } from "@/common/Statics";

const supportPaymentMap = {};

//获取 POS 机支持的支付方式，返回的是支付方式代码！
export function getSupportPaymentMap(){
    if(!supportPaymentMap[CASH_PAYMENT_CODE]){
        const arr = NativeModules.PosApi.getSupportPaymentListSync();
        
        for(const pm of arr){
            supportPaymentMap[pm] = true;
        }
        
        supportPaymentMap[CASH_PAYMENT_CODE] = true; //现金支付，默认支持
    }
    
    return supportPaymentMap;
}

//重新获取POS机支持的支付方式
export function refreshSupportPaymentMap(){
    return NativeModules.PosApi.getSupportPaymentList().then(arr => {
        for(const kk in supportPaymentMap){
            delete supportPaymentMap[kk]; //先删除！
        }
        
        for(const pm of arr){
            supportPaymentMap[pm] = true;
        }
        
        supportPaymentMap[CASH_PAYMENT_CODE] = true; //现金支付，默认支持
        
        return supportPaymentMap;
    });
}

//检查系统是否支持某个支付类型
export function isSupportPayType(ptype){    
    if(supportPaymentMap[ptype]){
        return true;
    }
    
    for(const kkk in supportPaymentMap){
        if(kkk.startsWith(ptype)){
            return true;
        }
    }
    
    return false;
}

export default NativeModules.PaymentHelper;