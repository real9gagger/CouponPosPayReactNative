import { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { useI18N, getUserInfo, getAppSettings } from "@/store/getter";
import { dispatchAddFailedOrder } from "@/store/setter";
import { formatDate } from "@/utils/helper";
import { getPaymentInfo, EMPTY_DEFAULT_TEXT, CASH_PAYMENT_CODE } from "@/common/Statics";
import LocalPictures from "@/common/Pictures";
import CircleTick from "@/components/CircleTick"
import PosPayIcon from "@/components/PosPayIcon";
import ReceiptsPlus from "@/modules/ReceiptsPlus";

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
        if(params && !transactionResult){//防止重复调用
            const dat = {...params}; //复制一份！！！
            const uif = getUserInfo();
            const aps = getAppSettings();
            const pmi = getPaymentInfo(params.paymentType, params.creditCardBrand || params.eMoneyType || params.qrPayType);
            
            dat.paymentName = pmi?.name;
            dat.paymentLogo = pmi?.logo;
            dat.payeeName = uif.shopName;
            dat.createBy = uif.loginAccount;
            dat.posId = uif.posId; //商户ID
            dat.shopId = uif.shopId; //店铺ID（店铺隶属于商户）
            dat.transactionTime = formatDate(params.transactionTime);
            dat.currencySymbol = aps.regionalCurrencySymbol;
            dat.amount = $tofixed(params.amount);
            dat.tax = $tofixed(params.tax);
            dat.isShowTaxInfo = (+params.tax ? true : false);
            dat.discountAmount = $tofixed(params.discountAmount);
            dat.orderAmount = $tofixed(params.orderAmount);
            dat.printTime = formatDate();
            dat.shopLogo = (aps.paymentReceiptPrintShopLogo ? uif.shopLogo : null);
            dat.operatorName = uif.loginAccount;
            dat.bottomText = aps.paymentReceiptBottomText;
            
            setTransactionResult(dat);
            
            //保存订单信息！！！如果保存失败则存入缓存，留下次手动同步到服务器
            $request("savePosAppOrder", dat).catch(err => dispatchAddFailedOrder("savePosAppOrder", dat, err));
            
            //2024年4月26日 现金支付不经过 POS 机内置交易APP，因此需要在此处自行打印
            if(dat.paymentType === CASH_PAYMENT_CODE){
                ReceiptsPlus.printPaymentReceipts(dat).catch($alert);
            }
        }
    }, []);
    
    return (
        <ScrollView style={pgFF} contentContainerStyle={[pdX, fxC, fxAC, mhF]}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <CircleTick progressing={2} size={80} style={styles.tickBox} color={styles.tickText.color} />
            <Text style={styles.tickText}>{i18n["transaction.success"]}</Text>
            {transactionResult && <>
                <Text style={styles.moneyText}>+{transactionResult.amount}</Text>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["order.amount"]}</Text>
                    <Text><Text style={fwB}>{transactionResult.orderAmount}</Text> {transactionResult.currencyCode}</Text>
                </View>
                <View style={transactionResult.isShowTaxInfo ? styles.itemBox : dpN}>
                    <Text style={fxG1}>{i18n["tax"]}</Text>
                    <Text><Text style={fwB}>{transactionResult.tax}</Text> {transactionResult.currencyCode}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["coupon.discount"]}</Text>
                    <Text><Text style={fwB}>-{transactionResult.discountAmount}</Text> {transactionResult.currencyCode}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["transaction.amount"]}</Text>
                    <Text style={tcR0}><Text style={fwB}>{transactionResult.amount}</Text> {transactionResult.currencyCode}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["coupon.code"]}</Text>
                    <PosPayIcon visible={!!transactionResult.couponCode} name="coupon-code" size={14} color="#f90" offset={-5} />
                    <Text>{transactionResult.couponCode || EMPTY_DEFAULT_TEXT}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["coupon.promotion.code"]}</Text>
                    <PosPayIcon visible={!!transactionResult.distributorNumber} name="promotion-code" size={14} color="#f90" offset={-5} />
                    <Text>{transactionResult.distributorNumber || EMPTY_DEFAULT_TEXT}</Text>
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