import { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, StatusBar, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import { formatDate } from "@/utils/helper";
import { getPaymentInfo } from "@/common/Statics";
import LocalPictures from "@/common/Pictures";
import AppPackageInfo from "@/modules/AppPackageInfo";
import CircleTick from "@/components/CircleTick"

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
            creditCardMaskedPAN:  "123456******3456", 
            currencyCode:         "JPY", 
            eMoneyNumber:         null, 
            eMoneyType:           null, 
            errorCode:            "", 
            paymentType:          "01", 
            qrPayType:            null, 
            slipNumber:           "99999", 
            tax:                  0, 
            transactionTime:      1706862993364, 
            transactionType:      "1"
        };
        
        if(params){
            params.paymentInfo = getPaymentInfo(params.paymentType);
            setTransactionResult(params);
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
                    <Text style={fxG1}>{i18n["transaction.amount"]}</Text>
                    <Text>{transactionResult.amount} {transactionResult.currencyCode}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["tax"]}</Text>
                    <Text>{transactionResult.tax} {transactionResult.currencyCode}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["payment.method"]}</Text>
                    {transactionResult.paymentInfo ? 
                        <>
                            <Image style={styles.paymentLogo} source={LocalPictures[transactionResult.paymentInfo.logo]} />
                            <Text>{transactionResult.paymentInfo.name}</Text>
                        </>
                    : /* 如果找不到支付方式详情，则显示支付代码 */
                        <Text>{transactionResult.paymentType}</Text>
                    }
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["transaction.number"]}</Text>
                    <Text>{transactionResult.slipNumber}</Text>
                </View>
                <View style={styles.itemBox}>
                    <Text style={fxG1}>{i18n["transaction.time"]}</Text>
                    <Text>{formatDate(transactionResult.transactionTime)}</Text>
                </View>
            </>}
        </ScrollView>
    );
}