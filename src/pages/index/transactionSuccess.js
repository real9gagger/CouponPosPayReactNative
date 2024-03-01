import { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { useI18N, getUserInfo, getAppSettings } from "@/store/getter";
import { formatDate } from "@/utils/helper";
import { getPaymentInfo, EMPTY_DEFAULT_TEXT } from "@/common/Statics";
import LocalPictures from "@/common/Pictures";
import CircleTick from "@/components/CircleTick"
import PosPayIcon from "@/components/PosPayIcon";

const styles = StyleSheet.create({
    tickBox: {
        marginTop: 30
    },
    tickText: {
        fontSize: 20,
        color: "#03C988",
        marginTop: 10
    },
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

export default function IndexTransactionSuccess(props){
    const i18n = useI18N();
    const [transactionResult, setTransactionResult] = useState(null);
    
    const gotoPrintPreview = () => {
        props.navigation.navigate("打印预览", props.route.params);
    }
    
    const gotoOrderDetails = () => {
        props.navigation.navigate("订单详情", transactionResult);
    }
    
    useEffect(() => {
        const params = props.route.params;
        /* { //2024年2月2日。支付成功时的测试数据
            activityRequestCode:  99, 
            activityResultCode:   0, 
            amount:               108, 
            creditCardBrand:      "01", 
            creditCardMaskedPan:  "123456******3456", //信用卡账号，如果是信用卡支付的会有账号
            currencyCode:         "JPY", 
            eMoneyNumber:         null, //电子钱包账号，如果是电子钱包支付的会有账号
            eMoneyType:           null, 
            errorCode:            "", 
            paymentType:          "01", 
            qrPayType:            null, 
            slipNumber:           "99999", 
            tax:                  0, 
            transactionTime:      1706862993364, 
            transactionType:      "1"
        }; */
        
        if(params && !transactionResult){//防止重复调用
            const dat = {...params}; //复制一份！！！
            const uif = getUserInfo();
            const pmi = getPaymentInfo(params.paymentType, params.creditCardBrand || params.eMoneyType || params.qrPayType);
            
            dat.paymentName = pmi?.name;
            dat.paymentLogo = pmi?.logo;
            dat.payeeName = uif.posName;
            dat.createBy = uif.loginAccount;
            dat.posId = uif.posId;
            dat.transactionTime = formatDate(params.transactionTime);
            dat.currencyCode = (params.currencyCode || getAppSettings("currencyCode"));
            dat.amount = $tofixed(params.amount);
            dat.tax = $tofixed(params.tax);
            dat.discountAmount = $tofixed(params.discountAmount);
            dat.orderAmount = $tofixed(params.orderAmount);
            
            setTransactionResult(dat);
            
            //保存订单信息！
            $request("savePosAppOrder", dat);
        }
    }, []);
    
    return (
        <ScrollView style={pgFF} contentContainerStyle={[pdX, fxC, fxAC, mhF]}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <CircleTick progressing={2} size={80} style={styles.tickBox} color={styles.tickText.color} />
            <Text style={styles.tickText}>{i18n["transaction.success"]}</Text>
            {transactionResult && <>
                <Text style={styles.moneyText}>+{transactionResult.amount}<Text style={tcTP}>+</Text></Text>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["order.amount"]}</Text>
                    <Text><Text style={fwB}>{transactionResult.orderAmount}</Text> {transactionResult.currencyCode}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["tax"]}</Text>
                    <Text><Text style={fwB}>{transactionResult.tax}</Text> {transactionResult.currencyCode}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["coupon.discount"]}</Text>
                    <Text><Text style={fwB}>-{transactionResult.discountAmount}</Text> {transactionResult.currencyCode}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["transaction.amount"]}</Text>
                    <Text style={tcR1}><Text style={fwB}>{transactionResult.amount}</Text> {transactionResult.currencyCode}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["coupon.code"]}</Text>
                    <PosPayIcon name="coupon-code" size={14} color="#f90" offset={-5} />
                    <Text>{transactionResult.couponCode || EMPTY_DEFAULT_TEXT}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["payment.method"]}</Text>
                    <Image style={styles.pmLogo} source={LocalPictures[transactionResult.paymentLogo] || LocalPictures.unknownPayment} />
                    <Text>{transactionResult.paymentName || transactionResult.paymentType}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["payment.payer"]}</Text>
                    <Text>{transactionResult.creditCardMaskedPan || transactionResult.eMoneyNumber || EMPTY_DEFAULT_TEXT}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["payment.payee"]}</Text>
                    <Text>{transactionResult.payeeName}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["transaction.number"]}</Text>
                    <Text>{transactionResult.slipNumber}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["transaction.time"]}</Text>
                    <Text>{transactionResult.transactionTime}</Text>
                </View>
            </>}
            <View style={[fxR, fxJB, pdTX, wiF]}>
                <TouchableOpacity activeOpacity={0.5} style={[pdVX, fxHC]} onPress={gotoPrintPreview}>
                    <Text style={[fs14, tcMC]}>{i18n["print"]}</Text>
                    <PosPayIcon name="printer-stroke" color={appDarkColor} size={12} offset={3} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} style={[pdVX, fxHC]} onPress={gotoOrderDetails}>
                    <Text style={[fs14, tcMC]}>{i18n["transaction.details"]}</Text>
                    <PosPayIcon name="right-arrow-double" color={appDarkColor} size={12} offset={3} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}