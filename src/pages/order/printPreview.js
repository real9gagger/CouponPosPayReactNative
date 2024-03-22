import { useEffect, useRef, useState } from "react";
import { ScrollView, View, Text, StatusBar, StyleSheet } from "react-native";
import { useI18N, getUserInfo, getAppSettings } from "@/store/getter";
import { formatDate } from "@/utils/helper";
import { getPaymentInfo, EMPTY_DEFAULT_TEXT } from "@/common/Statics";
import ImageX from "@/components/ImageX";
import GradientButton from "@/components/GradientButton";
import ReceiptsPlus from "@/modules/ReceiptsPlus";

const CONTENT_WIDTH = 300;
const CONTENT_LEFT = (deviceDimensions.screenWidth - CONTENT_WIDTH) / 2;
const OVERVIEW_DEFAULT_LG = ["#aaa", "#999"]; //全览默认渐变色

const styles = StyleSheet.create({
    contentContainer: {
        width: CONTENT_WIDTH,
        marginLeft: CONTENT_LEFT,
        padding: 15,
        backgroundColor: "#fff"
    },
    topGap: {
        height: 10,
        backgroundColor: "#eee"
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
        paddingTop: 5,
        paddingBottom: 15,
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
        fontWeight: "normal",
        flexGrow: 1
    },
    textValue2: {
        fontSize: 14,
        fontWeight: "normal"
    },
    textValue3: {
        fontSize: 10,
        textAlign: "center",
        paddingTop: 10
    },
    printBtn: {
        display: "flex",
        flexDirection: "row",
        paddingHorizontal: CONTENT_LEFT,
        paddingVertical: 10,
        backgroundColor: "#eee"
    }
});

export default function OrderPrintPreview(props){
    const i18n = useI18N();
    const svHeight = useRef(0); //滚动框高度
    const ctHeight = useRef(0); //滚动框里的内容高度
    const [orderInfo, setOrderInfo] = useState({});
    const [contentXY, setContentXY] = useState({});
    
    const onSVLayout = (evt) => {
        svHeight.current = evt.nativeEvent.layout.height;
        //$debounce(resetContentXY, 200);
    }
    const onCSChange = (cw, ch) => {
        ctHeight.current = ch;
        //$debounce(resetContentXY, 200);
    }
    
    //全览打印内容
    const resetContentXY = () => {
        if(svHeight.current && ctHeight.current){
            if(ctHeight.current > svHeight.current){
                if(!contentXY.scaleXY){
                    setContentXY({
                        scaleXY: { transform: [{ scale: svHeight.current / ctHeight.current }] },
                        offsetXY: { x: 0, y: (ctHeight.current - svHeight.current) / 2 }
                    });
                } else {
                    setContentXY({});
                }
            } else {
                if(!contentXY.scaleXY){
                    setContentXY({
                        scaleXY: { marginTop: (svHeight.current - ctHeight.current) / 2 },
                        offsetXY: null
                    });
                } else {
                    setContentXY({});
                }
            }
        }
    }
    //确认打印小票
    const confirmPrint = () => {
        ReceiptsPlus.printPaymentReceipts(orderInfo).catch($alert);
    }
    
    useEffect(() => {
        const dat = (props.route.params ? {...props.route.params} : {});
        const pmi = getPaymentInfo(dat.paymentType, dat.creditCardBrand || dat.eMoneyType || dat.qrPayType);
        const userInfo = getUserInfo();
        const appSettings = getAppSettings();

        if(dat){
            dat.paymentName = (pmi?.name || dat.paymentType);
            dat.transactionTime = formatDate(dat.transactionTime);
            dat.currencyCode = (dat.currencyCode || appSettings.currencyCode);
            dat.creditCardMaskedPan = (dat.creditCardMaskedPan || dat.eMoneyNumber || EMPTY_DEFAULT_TEXT);
            dat.amount = $tofixed(dat.amount);
            dat.tax = $tofixed(dat.tax);
            dat.printTime = formatDate();
            dat.discountAmount = $tofixed(dat.discountAmount);
            dat.orderAmount = $tofixed(dat.orderAmount);
            dat.shopLogo = (appSettings.paymentReceiptPrintShopLogo ? userInfo.posLogo : null);
            dat.payeeName = userInfo.posName;
            dat.operatorName = userInfo.loginAccount;
            dat.bottomText = appSettings.paymentReceiptBottomText;
            
            setOrderInfo(dat);
        }
    }, []);
    
    return (<>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <View style={styles.topGap}>{/* 占位用 */}</View>
        <ScrollView style={pgEE} 
            scrollEnabled={!contentXY.scaleXY} 
            contentContainerStyle={[styles.contentContainer, contentXY.scaleXY]} 
            contentOffset={contentXY.offsetXY}
            onLayout={onSVLayout} 
            onContentSizeChange={onCSChange}>
            <ImageX visible={!!orderInfo.shopLogo} src={orderInfo.shopLogo} style={styles.headPic} />
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
                <Text style={styles.textValue1}>{orderInfo.paymentName || EMPTY_DEFAULT_TEXT}</Text>
            </View>
            <View style={styles.rowBox}>
                <Text style={styles.textLabel1}>{i18n["payment.payer"]}</Text>
                <Text style={styles.textValue1}>{orderInfo.creditCardMaskedPan}</Text>
            </View>
            <View style={styles.rowBox}>
                <Text style={styles.textLabel1}>{i18n["payment.payee"]}</Text>
                <Text style={styles.textValue1}>{orderInfo.payeeName}</Text>
            </View>
            <View style={styles.rowBox}>
                <Text style={styles.textLabel1}>{i18n["coupon.code"]}</Text>
                <Text style={styles.textValue1}>{orderInfo.couponCode || EMPTY_DEFAULT_TEXT}</Text>
            </View>
            <View style={styles.rowBox}>
                <Text style={styles.textLabel1}>{i18n["transaction.number"]}</Text>
                <Text style={styles.textValue1}>{orderInfo.slipNumber || EMPTY_DEFAULT_TEXT}</Text>
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
                <Text style={styles.textValue1}>{orderInfo.operatorName}</Text>
            </View>
            {!!orderInfo.bottomText && <>
                <View style={styles.hrLine}>{/*水平线*/}</View>
                <Text style={styles.textValue3}>{orderInfo.bottomText}</Text>
            </>}
        </ScrollView>
        <View style={styles.printBtn}>
            <GradientButton style={fxG1} onPress={resetContentXY} lgColors={!contentXY.scaleXY && OVERVIEW_DEFAULT_LG}>{i18n["overview"]}</GradientButton>
            <GradientButton style={[fxG1, mgLX]} onPress={confirmPrint}>{i18n["print"]}</GradientButton>
        </View>
    </>);
}