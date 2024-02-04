import { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { useI18N, getUserInfo } from "@/store/getter";
import { formatDate } from "@/utils/helper";
import { getPaymentInfo } from "@/common/Statics";
import LocalPictures from "@/common/Pictures";
import AppPackageInfo from "@/modules/AppPackageInfo";
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
    paymentLogo: {
        width: 16,
        height: 16,
        marginRight: 18,
        transform: [{ scale: 2.5 }]
    }
});

export default function IndexTransactionSuccess(props){
    const i18n = useI18N();
    const [transactionResult, setTransactionResult] = useState(null);
    
    useEffect(() => {
        const params = //props.route.params;
        { //2024年2月2日。支付成功时的测试数据
            activityRequestCode:  99, 
            activityResultCode:   0, 
            amount:               108, 
            creditCardBrand:      "01", 
            creditCardMaskedPAN:  "123456******3456", //信用卡账号，如果是信用卡支付的会有账号
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
        };/*  */
        
        if(params){
            params.paymentInfo = getPaymentInfo(params.paymentType, params.eMoneyType || params.qrPayType);
            params.payeeName = getUserInfo("posName");
            params.transactionTimeTxt = formatDate(params.transactionTime);
            params.currencyCode = (params.currencyCode || i18n["currency.code"]);
            params.amountTxt = (+params.amount || 0).toFixed(2);
            params.taxTxt = (+params.tax || 0).toFixed(2);
            
            setTransactionResult(params);
        }
    }, []);
    
    return (
        <ScrollView style={pgFF} contentContainerStyle={[pdX, fxC, fxAC, mhF]}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <CircleTick progressing={2} size={80} style={styles.tickBox} color={styles.tickText.color} />
            <Text style={styles.tickText}>{i18n["transaction.success"]}</Text>
            {transactionResult && <>
                <Text style={styles.moneyText}>+{transactionResult.amountTxt}<Text style={tcTP}>+</Text></Text>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["transaction.amount"]}</Text>
                    <Text>{transactionResult.amountTxt} {transactionResult.currencyCode}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["tax"]}</Text>
                    <Text>{transactionResult.taxTxt} {transactionResult.currencyCode}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["payment.method"]}</Text>
                    <Image style={styles.paymentLogo} source={transactionResult.paymentInfo ? LocalPictures[transactionResult.paymentInfo.logo] : LocalPictures.unknownPayment} />
                    <Text>{transactionResult.paymentInfo ? transactionResult.paymentInfo.name : transactionResult.paymentType}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["payment.payer"]}</Text>
                    <Text>{transactionResult.creditCardMaskedPAN || transactionResult.eMoneyNumber}</Text>
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
                    <Text>{transactionResult.transactionTimeTxt}</Text>
                </View>
            </>}
            <View style={[fxR, fxJB, pdTX, wiF]}>
                <TouchableOpacity activeOpacity={0.5} style={[pdVX, fxHC]}>
                    <Text style={[fs14, tcMC]}>{i18n["transaction.doubt"]}</Text>
                    <PosPayIcon name="help-stroke" color={appDarkColor} size={12} offset={3} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} style={[pdVX, fxHC]}>
                    <Text style={[fs14, tcMC]}>{i18n["transaction.detail"]}</Text>
                    <PosPayIcon name="right-arrow-double" color={appDarkColor} size={12} offset={3} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}