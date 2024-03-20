import { View, Text, StatusBar, Image, StyleSheet } from "react-native";
import { useI18N, getAppSettings } from "@/store/getter";
import { dispatchAddFailedOrder } from "@/store/setter";
import { EMPTY_DEFAULT_TEXT, TRANSACTION_TYPE_REFUND } from "@/common/Statics";
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
                    $toast(i18n["refund.success"]);
                    props.navigation.goBack();
                }).catch(err => {
                    dispatchAddFailedOrder("posAppRefund", dat, err);
                });
            } else if(payRes.activityResultCode === 2){//取消退款
                //$toast(i18n["payment.errmsg2"]);
            } else {//退款失败
                $alert(i18n["payment.errmsg3"].cloze(payRes.errorCode));
            }
        });
    }
    
    return (
        <View style={[pgEE, pdX]}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View style={[fxHC, pdBX]}>
                <Text style={styles.labelBox}>{i18n["refund.amount"]}</Text>
                <Text style={fwB}>({orderInfo.currencyCode})</Text>
            </View>
            <Text style={styles.amountBox}>
                <Text style={fs16}>{appSettings.currencySymbol}</Text>
                <Text>{orderInfo.amount}</Text>
                <Text style={[fs16, tcEE]}>{appSettings.currencySymbol /*因此的文字，目的是让金额居中*/}</Text>
            </Text>
            <Text style={[fs12, taC, pdVX]}>
                <Text >{i18n["order.amount"]}&nbsp;</Text>
                <Text style={[tcMC, fwB]}>{orderInfo.orderAmount}&emsp;</Text>
                <Text>{i18n["tax"]}&nbsp;</Text>
                <Text style={[tcMC, fwB]}>{orderInfo.tax}&emsp;</Text>
                <Text>{i18n["coupon.discount"]}&nbsp;</Text>
                <Text style={[tcMC, fwB]}>-{orderInfo.discountAmount}</Text>
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
            <GradientButton onPress={confirmRefund}>{i18n["refund.confirm"]}</GradientButton>
        </View>
    )
}