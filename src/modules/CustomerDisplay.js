import { NativeModules } from "react-native";
import { getI18N } from "@/store/getter";

//副屏助手
const CDHelper = NativeModules.PosApi;

//显示需要付款的金额信息
function showPayAmountInfo(){
    CDHelper.openCustomerDisplay(function(res, errmsg){
        if(!errmsg){//打开副屏成功！
            CDHelper.setCustomerDisplayContent(`<?xml version="1.0" encoding="UTF-8" ?>
                <customerDisplayApi id="moneyCD">
                    <screenPattern>11</screenPattern>
                    <headerArea>
                        <headerAreaNumber>1</headerAreaNumber>
                        <customerString>付款金额</customerString>
                    </headerArea>
                    <headerArea>
                        <headerAreaNumber>2</headerAreaNumber>
                        <customerString>收款金额</customerString>
                    </headerArea>
                    <headerArea>
                        <headerAreaNumber>3</headerAreaNumber>
                        <customerString>请付款</customerString>
                    </headerArea>
                    <messageArea>
                        <messageAreaNumber>1</messageAreaNumber>
                        <customerString>订单金额：    ￥99.99</customerString>
                    </messageArea>
                    <messageArea>
                        <messageAreaNumber>2</messageAreaNumber>
                        <customerString>税：    ￥0.00</customerString>
                    </messageArea>
                    <messageArea>
                        <messageAreaNumber>3</messageAreaNumber>
                        <customerString>优惠：    ￥11.11</customerString>
                    </messageArea>
                    <messageArea>
                        <messageAreaNumber>4</messageAreaNumber>
                        <customerString>实际金额：    ￥88.88</customerString>
                    </messageArea>
                    <messageArea>
                        <messageAreaNumber>5</messageAreaNumber>
                        <customerString>666666666</customerString>
                    </messageArea>
                </customerDisplayApi>`
            ).catch(errmsg => console.log(errmsg));
        } else {
            $alert(errmsg);
        }
    });
}

//关闭副屏
function turnOff(){
    CDHelper.closeCustomerDisplay(false);
}

export default {
    showPayAmountInfo,
    turnOff
}