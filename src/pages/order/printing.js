import { useState, useRef } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import { getPaymentInfo } from "@/common/Statics";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";
import LoadingTip from "@/components/LoadingTip";

const styles = StyleSheet.create({
    inputBox: {
        borderColor: "#ddd",
        borderWidth: StyleSheet.hairlineWidth,
        backgroundColor: "#fff",
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        borderRadius: 8
    },
    inputActived: {
        borderColor: appMainColor
    },
    searchIcon: {
        position: "absolute",
        top: 12,
        right: 10,
        zIndex: 1
    },
    orderBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 10,
        marginVertical: 5
    }
});

function getOrderInfoBySN(osn){
    return $request("getPosAppOrderList", { slipNumber: osn, pageNum: 1, pageSize: 1 }).then(res => {
        if(!res.rows || !res.rows[0]){
            return null;
        }
        
        const odInfo = res.rows[0];
        const pmInfo = getPaymentInfo(odInfo.paymentType, odInfo.creditCardBrand || odInfo.eMoneyType || odInfo.qrPayType);
        
        odInfo.paymentName = pmInfo.name;
        odInfo.paymentLogo = pmInfo.logo;
        
        return odInfo;
    });
}

export default function OrderPrinting(props){
    const i18n = useI18N();
    const ltRef = useRef(null);
    const [isFocus, setIsFocus] = useState(true);
    const [orderSN, setOrderSN] = useState("");
    const [orderInfo, setOrderInfo] = useState(null);
    
    const onSearchOrder = () => {
        setOrderInfo(null);
        setIsFocus(false);
        
        if(!orderSN){
            return !ltRef.current.resetState();
        }
        
        ltRef.current.setLoading(true);
        getOrderInfoBySN(orderSN).then(res => {            
            setOrderInfo(res);
            if(res){
                ltRef.current.setLoading(false);
            } else {
                ltRef.current.setNoMore(0, 0);
            }
        }).catch(ltRef.current.setErrMsg);
    }
    const onOrderPress = () => {
        props.navigation.navigate("订单详情", orderInfo);
    }
    const onPrintPress = () => {
        props.navigation.navigate("打印预览", orderInfo);
    }
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={[mhF, pdS]}>
            <View>
                <TextInput 
                    style={[styles.inputBox, isFocus && styles.inputActived]} 
                    onFocus={() => setIsFocus(true)}
                    onBlur={onSearchOrder}
                    autoFocus={true}
                    onChangeText={setOrderSN}
                    maxLength={30} 
                    keyboardType="default"
                    placeholder={i18n["transaction.number"]} />
                <PosPayIcon name="search" color={isFocus ? appMainColor : "#aaa"} size={16} style={styles.searchIcon} />
            </View>
            
            {!!orderInfo && !isFocus && <>
                <Text style={[mgTX, fs14, tc66]}>{i18n["search.result"]}</Text>
                <TouchableOpacity style={styles.orderBox} onPress={onOrderPress} activeOpacity={0.75}>
                    <View style={fxG1}>
                        <Text style={[fs16, fwB]}>SN.{orderInfo.slipNumber}</Text>
                        <Text style={fs12}>{orderInfo.amount} {orderInfo.currencyCode}</Text>
                        <Text style={[fs12, tc99]}>{orderInfo.transactionTime}</Text>
                    </View>
                    <Text style={[fs12, tcMC]}>{i18n["details"]}</Text>
                    <PosPayIcon name="right-arrow" color={appMainColor} size={16}/>
                </TouchableOpacity>
                <View style={fxG1}>{/* 占位用 */}</View>
                <GradientButton onPress={onPrintPress}>{i18n["print"]}</GradientButton>
            </>}
            
            <LoadingTip ref={ltRef}
                visible={!orderInfo && !isFocus}
                noMoreText={i18n["nomore"]}
                noDataText={i18n["nodata"]}
                retryLabel={i18n["retry"]}
                errorTitle={i18n["loading.error"]}
                readyText={i18n["order.number.input.tip"]}
                onRetry={onSearchOrder} />
        </ScrollView>
    )
}