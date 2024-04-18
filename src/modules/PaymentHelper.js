import { NativeModules } from "react-native";
import { CASH_PAYMENT_CODE } from "@/common/Statics";

const SupportPaymentMap = {};

//获取 POS 机支持的支付方式，返回的是支付方式代码！
export function getSupportPaymentMap(){
    if(!SupportPaymentMap[CASH_PAYMENT_CODE]){
        const arr = NativeModules.PosApi.getSupportPaymentListSync();
        
        for(let pm of arr){
            SupportPaymentMap[pm] = true;
        }
        
        SupportPaymentMap[CASH_PAYMENT_CODE] = true; //现金支付，默认支持
    }
    
    return SupportPaymentMap;
}

export default NativeModules.PaymentHelper;