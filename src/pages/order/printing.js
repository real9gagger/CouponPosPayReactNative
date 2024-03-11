import { useState, useRef } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import { getPaymentInfo } from "@/common/Statics";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";
import LoadingTip from "@/components/LoadingTip";

const styles = StyleSheet.create({
    inputBox: {
        borderColor: "#ccc",
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
        if(!res || !res[0]){
            return null;
        }
        
        const odInfo = res[0];
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
        if(ltRef.current.isLoading){
            return;
        }
        
        setOrderInfo(null);
        if(!orderSN){
            return;
        }
        
        ltRef.current.setLoading(true);
        getOrderInfoBySN(orderSN).then(res => {            
            setOrderInfo(res);
            if(res){
                ltRef.current.setLoading(false);
            } else {
                ltRef.current.setNoMore(1, 0);
            }
        }).catch(ltRef.current.setErrMsg);
    }
    const onOrderPress = () => {
        props.navigation.navigate("订单详情", orderInfo);
    }
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={[mhF, pdS]}>
            <View>
                <TextInput 
                    style={[styles.inputBox, isFocus && styles.inputActived]} 
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    autoFocus={true}
                    onSubmitEditing={onSearchOrder}
                    onChangeText={setOrderSN}
                    maxLength={30} 
                    keyboardType="number-pad"
                    placeholder={i18n["transaction.number"]} />
                <PosPayIcon name="search" color={isFocus ? appMainColor : "#aaa"} size={16} style={styles.searchIcon} />
            </View>
            
            {!!orderInfo && !isFocus && <>
                <Text style={[mgTX, fs14, tc66]}>{i18n["search.result"]}</Text>
                <TouchableOpacity style={styles.orderBox} onPress={onOrderPress} activeOpacity={0.75}>
                    <View style={fxG1}>
                        <Text style={[fs16, fwB]}>SN.{orderInfo.slipNumber}</Text>
                        <Text style={[fs12, tc99]}>{orderInfo.transactionTime}</Text>
                    </View>
                    <Text style={[fs16, tcMC]}>{i18n["print"]}</Text>
                    <PosPayIcon name="right-arrow" color={appMainColor} size={16}/>
                </TouchableOpacity>
            </>}
            
            <LoadingTip ref={ltRef}
                visible={!orderInfo && !isFocus}
                noMoreText={i18n["nomore"]}
                noDataText={i18n["nodata"]}
                retryLabel={i18n["retry"]}
                errorTitle={i18n["loading.error"]}
                onRetry={onSearchOrder} />
        </ScrollView>
    )
}