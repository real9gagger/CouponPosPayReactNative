import { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, StatusBar, StyleSheet } from "react-native";
import { useI18N, useOnRefundSuccessful } from "@/store/getter";
import { EMPTY_DEFAULT_TEXT, TRANSACTION_TYPE_REFUND } from "@/common/Statics";
import LocalPictures from "@/common/Pictures";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";

const styles = StyleSheet.create({
    moneyText: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 30
    },
    itemBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderBottomColor: "#ddd",
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingVertical: 15
    },
    pmLogo: {
        width: 16,
        height: 16,
        marginRight: 18,
        transform: [{ scale: 2.5 }]
    }
});

export default function OrderDetails(props){
    const i18n = useI18N();
    const useOrs = useOnRefundSuccessful();
    const [orderInfo, setOrderInfo] = useState(props.route.params);
    
    const printOrder = () => {
        props.navigation.navigate("打印预览", orderInfo);
    }
    
    const refundMoney = () => {
        props.navigation.navigate("退款确认", orderInfo);
    }
    
    //退款成功时订单 ID 会变化，则更新相关状态。
    useEffect(() => {
        if(orderInfo && useOrs === orderInfo.id){
            orderInfo.transactionType = TRANSACTION_TYPE_REFUND;
            setOrderInfo({...orderInfo});
        }
    }, [useOrs]);
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={pdS}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            {!!orderInfo ? <>
                <View style={[bgFF, brX, pdHX]}>
                    <View style={styles.itemBox}>
                        <Text style={fxG1}>{i18n["order.status"]}</Text>
                        {orderInfo.transactionType!==TRANSACTION_TYPE_REFUND
                        ? <Text style={tcG0}>{i18n["order.status.received"]}</Text>
                        : <Text style={tcR0}>{i18n["order.status.refunded"]}</Text>
                        }
                    </View>
                    <View style={styles.itemBox}>
                        <Text style={fxG1}>{i18n["order.amount"]}</Text>
                        <Text><Text style={fwB}>{orderInfo.orderAmount}</Text> {orderInfo.currencyCode}</Text>
                    </View>
                    <View style={+orderInfo.tax ? styles.itemBox : dpN}>
                        <Text style={fxG1}>{i18n["tax"]}</Text>
                        <Text><Text style={fwB}>{orderInfo.tax}</Text> {orderInfo.currencyCode}</Text>
                    </View>
                    <View style={styles.itemBox}>
                        <Text style={fxG1}>{i18n["coupon.discount"]}</Text>
                        <Text><Text style={fwB}>-{orderInfo.discountAmount}</Text> {orderInfo.currencyCode}</Text>
                    </View>
                    <View style={styles.itemBox}>
                        <Text style={fxG1}>{i18n["transaction.amount"]}</Text>
                        <Text style={tcR0}><Text style={fwB}>{orderInfo.amount}</Text> {orderInfo.currencyCode}</Text>
                    </View>
                    <View style={styles.itemBox}>
                        <Text style={fxG1}>{i18n["coupon.code"]}</Text>
                        <PosPayIcon visible={!!orderInfo.couponCode} name="coupon-code" size={14} color="#f90" offset={-5} />
                        <Text>{orderInfo.couponCode || EMPTY_DEFAULT_TEXT}</Text>
                    </View>
                    <View style={styles.itemBox}>
                        <Text style={fxG1}>{i18n["coupon.promotion.code"]}</Text>
                        <PosPayIcon visible={!!orderInfo.distributorNumber} name="coupon-code" size={14} color="#f90" offset={-5} />
                        <Text>{orderInfo.distributorNumber || EMPTY_DEFAULT_TEXT}</Text>
                    </View>
                    <View style={styles.itemBox}>
                        <Text style={fxG1}>{i18n["payment.method"]}</Text>
                        <Image style={styles.pmLogo} source={LocalPictures[orderInfo.paymentLogo] || LocalPictures.unknownPayment} />
                        <Text>{orderInfo.paymentName || i18n["unknown"]}</Text>
                    </View>
                    <View style={styles.itemBox}>
                        <Text style={fxG1}>{i18n["payment.payer"]}</Text>
                        <Text>{orderInfo.creditCardMaskedPan || orderInfo.eMoneyNumber || EMPTY_DEFAULT_TEXT}</Text>
                    </View>
                    <View style={styles.itemBox}>
                        <Text style={fxG1}>{i18n["transaction.number"]}</Text>
                        <Text>{orderInfo.slipNumber}</Text>
                    </View>
                    <View style={styles.itemBox}>
                        <Text style={fxG1}>{i18n["transaction.time"]}</Text>
                        <Text>{orderInfo.transactionTime}</Text>
                    </View>
                    <View style={styles.itemBox}>
                        <Text style={fxG1}>{i18n["operator"]}</Text>
                        <Text>{orderInfo.createBy || EMPTY_DEFAULT_TEXT}</Text>
                    </View>
                    <View style={styles.itemBox}>
                        <Text style={fxG1}>{i18n["operation.time"]}</Text>
                        <Text>{orderInfo.createTime || orderInfo.transactionTime}</Text>
                    </View>
                    <View style={[styles.itemBox, {borderBottomWidth: 0}]}>
                        <Text style={fxG1}>{i18n["remarks"]}</Text>
                        <Text>{orderInfo.remark || EMPTY_DEFAULT_TEXT}</Text>
                    </View>
                </View>
                <View style={[fxR, mgTX]}>
                    <GradientButton disabled={!orderInfo} style={fxG1} onPress={printOrder}>{i18n["reprint"]}</GradientButton>
                    <GradientButton disabled={orderInfo?.transactionType===TRANSACTION_TYPE_REFUND} style={[fxG1, mgLX]} onPress={refundMoney}>{i18n["transaction.refund"]}</GradientButton>
                </View>
            </>: <Text style={[pdX, tc99, fs16, taC]}>{i18n["nodata"]}</Text>}
        </ScrollView>
    );
}