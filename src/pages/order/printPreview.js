import { useEffect, useState } from "react";
import { ScrollView, View, Text, StatusBar, StyleSheet } from "react-native";
import { useI18N, useUserInfo } from "@/store/getter";
import { formatDate } from "@/utils/helper";
import { getPaymentInfo, EMPTY_DEFAULT_TEXT } from "@/common/Statics";
import ImageX from "@/components/ImageX";
import GradientButton from "@/components/GradientButton";

const CONTENT_WIDTH = 300;
const CONTENT_LEFT = (deviceDimensions.screenWidth - CONTENT_WIDTH) / 2;

const styles = StyleSheet.create({
    contentContainer: {
        width: CONTENT_WIDTH,
        marginLeft: CONTENT_LEFT,
        padding: 15,
        backgroundColor: "#fff",
    },
    headPic:{
        width: "100%",
        resizeMode: "contain"
    },
    hrLine: {
        borderTopWidth: 1,
        borderTopColor: "#333",
        width: "100%",
        marginVertical: 5
    },
    rowBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingVertical: 5
    },
    textTitle: {
        fontSize: 20,
        paddingVertical: 20,
        fontWeight: "bold",
        textAlign: "center"
    },
    textLabel1: {
        fontSize: 14,
        flexGrow: 1
    },
    textValue1: {
        fontSize: 14
    },
    textLabel2: {
        fontSize: 14,
        fontWeight: "bold",
        flexGrow: 1
    },
    textValue2: {
        fontSize: 14,
        fontWeight: "bold"
    },
    printBtn: {
        position: "absolute",
        left: CONTENT_LEFT,
        right: CONTENT_LEFT,
        bottom: 15,
        zIndex: 1
    }
});

export default function OrderPrintPreview(props){
    const i18n = useI18N();
    const userInfo = useUserInfo();
    const [orderInfo, setOrderInfo] = useState({});
    
    useEffect(() => {
        const dat = (props.route.params ? {...props.route.params} : {});
        const pmi = getPaymentInfo(dat.paymentType, dat.creditCardBrand || dat.eMoneyType || dat.qrPayType);
        if(dat){
            dat.paymentName = (pmi?.name || dat.paymentType);
            dat.transactionTime = formatDate(dat.transactionTime);
            dat.currencyCode = (dat.currencyCode || i18n["currency.code"]);
            dat.creditCardMaskedPAN = (dat.creditCardMaskedPAN || dat.eMoneyNumber || EMPTY_DEFAULT_TEXT);
            dat.amount = $tofixed(dat.amount);
            dat.tax = $tofixed(dat.tax);
            dat.printTime = formatDate();
            dat.discountAmount = $tofixed(dat.discountAmount);
            dat.orderAmount = $tofixed(dat.orderAmount);
            setOrderInfo(dat);
        }
    }, []);
    
    return (<>
        <ScrollView style={pgEE} contentContainerStyle={pdVX}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View style={styles.contentContainer}>
                <ImageX src={userInfo.posLogo} style={styles.headPic} />
                <Text style={styles.textTitle}>{i18n["payment.receipt"]}</Text>
                <View style={styles.hrLine}>{/*水平线*/}</View>
                <View style={styles.rowBox}>
                    <Text style={styles.textLabel2}>{i18n["order.amount"]}</Text>
                    <Text style={styles.textValue2}>{orderInfo.orderAmount} {orderInfo.currencyCode}</Text>
                </View>
                <View style={styles.rowBox}>
                    <Text style={styles.textLabel2}>{i18n["tax"]}</Text>
                    <Text style={styles.textValue2}>{orderInfo.tax} {orderInfo.currencyCode}</Text>
                </View>
                <View style={styles.rowBox}>
                    <Text style={styles.textLabel2}>{i18n["coupon.discount"]}</Text>
                    <Text style={styles.textValue2}>-{orderInfo.discountAmount} {orderInfo.currencyCode}</Text>
                </View>
                <View style={styles.rowBox}>
                    <Text style={styles.textLabel2}>{i18n["transaction.amount"]}</Text>
                    <Text style={styles.textValue2}>{orderInfo.amount} {orderInfo.currencyCode}</Text>
                </View>
                <View style={styles.hrLine}>{/*水平线*/}</View>
                <View style={styles.rowBox}>
                    <Text style={styles.textLabel1}>{i18n["payment.method"]}</Text>
                    <Text style={styles.textValue1}>{orderInfo.paymentName}</Text>
                </View>
                <View style={styles.rowBox}>
                    <Text style={styles.textLabel1}>{i18n["payment.payer"]}</Text>
                    <Text style={styles.textValue1}>{orderInfo.creditCardMaskedPAN}</Text>
                </View>
                <View style={styles.rowBox}>
                    <Text style={styles.textLabel1}>{i18n["payment.payee"]}</Text>
                    <Text style={styles.textValue1}>{userInfo.posName}</Text>
                </View>
                <View style={styles.rowBox}>
                    <Text style={styles.textLabel1}>{i18n["transaction.number"]}</Text>
                    <Text style={styles.textValue1}>{orderInfo.slipNumber}</Text>
                </View>
                <View style={styles.rowBox}>
                    <Text style={styles.textLabel1}>{i18n["transaction.time"]}</Text>
                    <Text style={styles.textValue1}>{orderInfo.transactionTime}</Text>
                </View>
                <View style={styles.hrLine}>{/*水平线*/}</View>
                <View style={styles.rowBox}>
                    <Text style={styles.textLabel1}>{i18n["print.time"]}</Text>
                    <Text style={styles.textValue1}>{orderInfo.printTime}</Text>
                </View>
                <View style={styles.rowBox}>
                    <Text style={styles.textLabel1}>{i18n["operator"]}</Text>
                    <Text style={styles.textValue1}>{userInfo.loginAccount}</Text>
                </View>
            </View>
            <View style={{height: 55}}>{/* 占位用 */}</View>
        </ScrollView>
        <GradientButton style={styles.printBtn}>{i18n["print"]}</GradientButton>
    </>);
}