import { NativeModules } from "react-native";
import { getI18N, getUserPosName, getAppSettings } from "@/store/getter";
import { formatDate } from "@/utils/helper";

//副屏助手
const CDHelper = NativeModules.PosApi;
const MAX_CHARS = 39; //消息文字一行最多可以显示 50 个半角字符
const ONE_SPACE = "\x20"; //一个空格

//中文占两个字节，英文占一个
function getTextSize(txt){
    let count = 0;
    if(txt){
        for(let ix = 0, nx = txt.length; ix < nx; ix++){
            if(txt.charCodeAt(ix) <= 255){
                count += 1;
            } else {
                count += 2;
            }
        }
    }
    return count;
}

//获取内容行
function getContentLine(txt1, txt2){
    const len1 = getTextSize(txt1);
    const len2 = getTextSize(txt2);
    const len0 = len1 + len2 + 1; //中间至少留一个空格！
    
    if(len0 < MAX_CHARS){
        return (txt1 + ONE_SPACE.repeat(MAX_CHARS - len0 + 1) + txt2);
    } else {
        return (txt1 + ONE_SPACE +  txt2).substr(0, MAX_CHARS - 2) + "…";
    }
}

//获取居中文本
function getContentCentered(txt){
    const len = getTextSize(txt);
    const paddingL = Math.floor((MAX_CHARS - len) / 2); //左边距
    //const paddingR = (MAX_CHARS - len - paddingL); //右边距
    
    if(paddingL >= 0){
        return (ONE_SPACE.repeat(paddingL) + txt);
    } else {
        return (txt).substr(0, MAX_CHARS - 2) + "…";
    }
}

//显示需要付款的金额信息
function showPayAmountInfo(total, tax, discount, amount){
    const ass = getAppSettings();
    if(!ass.customerDisplayShowPayAmountInfo){ //结账时副屏是否显示付款金额
        return;
    }
    
    CDHelper.openCustomerDisplay(function(errmsg){
        if(errmsg){//打开副屏失败！
            return !$alert(errmsg);
        }
        
        const i18n = getI18N();
        const ccode = ass.currencyCode;
        const title1 = getUserPosName();
        const title2 = formatDate();
        const title3 = i18n["settlement"];
        const msgAM = getContentLine(i18n["input.amount"],      `${total} ${ccode}`);
        const msgTX = getContentLine(i18n["tax"],               `${tax} ${ccode}`);
        const msgDC = getContentLine(i18n["coupon.discount"],   `-${discount} ${ccode}`);
        const msgFA = getContentLine(i18n["final.amount"],      `${amount} ${ccode}`);
        const msgPA = getContentCentered(i18n["payment.amount"].cloze(ass.currencySymbol, amount));
        
        CDHelper.setCustomerDisplayContent(`<?xml version="1.0" encoding="UTF-8" ?>
            <customerDisplayApi id="settlementCD">
                <screenPattern>11</screenPattern>
                <headerArea>
                    <headerAreaNumber>1</headerAreaNumber>
                    <customerString>${title1}</customerString>
                </headerArea>
                <headerArea>
                    <headerAreaNumber>2</headerAreaNumber>
                    <customerString>${title2}</customerString>
                </headerArea>
                <headerArea>
                    <headerAreaNumber>3</headerAreaNumber>
                    <customerString>${title3}</customerString>
                </headerArea>
                <messageArea>
                    <messageAreaNumber>1</messageAreaNumber>
                    <customerString>${msgAM}</customerString>
                </messageArea>
                <messageArea>
                    <messageAreaNumber>2</messageAreaNumber>
                    <customerString>${msgTX}</customerString>
                </messageArea>
                <messageArea>
                    <messageAreaNumber>3</messageAreaNumber>
                    <customerString>${msgDC}</customerString>
                </messageArea>
                <messageArea>
                    <messageAreaNumber>4</messageAreaNumber>
                    <customerString>${msgFA}</customerString>
                </messageArea>
                <messageArea>
                    <messageAreaNumber>5</messageAreaNumber>
                    <customerString>${msgPA}</customerString>
                </messageArea>
            </customerDisplayApi>`
        ).catch(errdat => {
            const msgtxt = errdat.message?.replace(/\b(0x[0-9a-f]+)\b/gim, "\"$1\"");
            try{
                $alert(JSON.parse(msgtxt).message || msgtxt);
            } catch(ex){
                $alert(msgtxt);
            }
        });
    });
}

//强制关闭副屏
function turnoff(){
    CDHelper.closeCustomerDisplay(true);
}

//关闭副屏
function close(){
    CDHelper.closeCustomerDisplay(false);
}

//打开副屏
function open(){
    CDHelper.openCustomerDisplay(null);
}

//副屏状态：true-已打开，false-已关闭
function status(){
    return CDHelper.isCustomerDisplayOpened();
}

export default {
    showPayAmountInfo,
    turnoff,
    close,
    open,
    status
}