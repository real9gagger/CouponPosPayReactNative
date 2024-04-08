import { useEffect, useState } from "react";
import { View, Text, StatusBar, Image, StyleSheet } from "react-native";
import { useI18N, getAppSettings } from "@/store/getter";
import { dispatchAddFailedOrder, dispatchOnRefundSuccessful } from "@/store/setter";
import { EMPTY_DEFAULT_TEXT, TRANSACTION_TYPE_REFUND } from "@/common/Statics";
import { parseStringDate } from "@/utils/helper"
import GradientButton from "@/components/GradientButton";
import LocalPictures from "@/common/Pictures";
import PaymentHelper from "@/modules/PaymentHelper";

const styles = StyleSheet.create({
    amountBox: {
        fontSize: 40,
        color: appMainColor,
        textAlign: "center",
        fontWeight: "bold",
        paddingVertical: 20
    },
    pmLogo: {
        width: 30,
        height: 30,
        marginRight: 5,
    },
    labelBox: {
        flexGrow: 1,
        fontSize: 16
    }
});

export default function OrderRefundConfirm(props){
    const i18n = useI18N();
    const appSettings = getAppSettings();
    const orderInfo = props.route.params;
    const [canRefund, setCanRefund] = useState(false); //是否可以退款

    const confirmRefund = () => {
        //如果不支持支付功能
        if(!PaymentHelper.isSupport()){
            return $alert(i18n["payment.errmsg1"]);
        }
        
        PaymentHelper.startPay({
            transactionMode: (runtimeEnvironment.isProduction ? "1" : "2"), //1-正常，2-练习
            transactionType: TRANSACTION_TYPE_REFUND, //1-付款，2-取消付款，3-退款
            slipNumber: orderInfo.slipNumber //单据号码，取消付款或者退款时用到
        }, function(payRes){
            if(payRes.activityResultCode === 0){//退款成功
                const dat = { id: orderInfo.id, slipNumber: orderInfo.slipNumber };
                $request("posAppRefund", dat).then(res => {
                    dispatchOnRefundSuccessful(orderInfo.id);
                    $toast(i18n["refund.success"]);
                    props.navigation.goBack();
                }).catch(err => {
                    dispatchAddFailedOrder("posAppRefund", dat, err);
                    props.navigation.goBack();
                });
            } else if(payRes.activityResultCode === 2){//取消退款
                //$toast(i18n["payment.errmsg2"]);
            } else {//退款失败
                $alert(i18n["payment.errmsg3"].cloze(payRes.errorCode));
            }
        });
    }
    
    useEffect(() => {
        const transTime = parseStringDate(orderInfo.transactionTime);
        const diffDays = (Date.now() - transTime.getTime()) / 86400000; //交易时间距离现在已经过去多少天了
        
        if(diffDays >= 0 && diffDays <= 1){
            setCanRefund(true); //一天之内可退款
        } else {
            setCanRefund(false); //收款超过一天就不能退了！！！
        }
    }, []);
    
    return (
        <View style={[pgFF, pdX]}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View style={[fxHC, pdBX]}>
                <Text style={styles.labelBox}>{i18n["refund.amount"]}</Text>
                <Text style={fwB}>({orderInfo.currencyCode})</Text>
            </View>
            <Text style={styles.amountBox}>
                <Text style={fs16}>{appSettings.regionalCurrencySymbol}</Text>
                <Text>{orderInfo.amount}</Text>
            </Text>
            <View style={[fxHC, pdVX]}>
                <Text style={styles.labelBox}>{i18n["refund.method"]}</Text>
                <Image style={styles.pmLogo} source={LocalPictures[orderInfo.paymentLogo] || LocalPictures.unknownPayment} />
                <Text style={[fs16, fwB]}>{orderInfo.paymentName || i18n["unknown"]}</Text>
            </View>
            <View style={fxHC}>
                <Text style={styles.labelBox}>{i18n["payment.payee"]}</Text>
                <Text style={[fs16, fwB]}>{orderInfo.creditCardMaskedPan || orderInfo.eMoneyNumber || EMPTY_DEFAULT_TEXT}</Text>
            </View>
            <View style={fxG1}>{/* 占位专用 */}</View>
            <Text style={canRefund ? dpN : [fs12, tcO0, taC, pdS]}>{i18n["refund.unsupport"]}</Text>
            <GradientButton disabled={!canRefund} onPress={confirmRefund}>{i18n["refund.confirm"]}</GradientButton>
        </View>
    )
}