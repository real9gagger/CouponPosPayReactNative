import { useEffect, useRef, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, StatusBar, ActivityIndicator, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import { getPaymentInfo } from "@/common/Statics";
import LocalPictures from "@/common/Pictures";

const styles = StyleSheet.create({
    itemBox: {
        display: "flex",
        flexDirection: "row",
        padding: 10,
        backgroundColor: "#fff",
        marginBottom: 5,
        borderRadius: 8
    },
    itemLeft: {
        width: "75%",
        paddingRight: 10
    },
    logoBox: {
        width: 40,
        height: 40,
        marginBottom: 4
    },
    nameLabel: {
        fontSize: 10,
        color: "#666"
    }
});

export default function OrderIndex(props){
    const i18n = useI18N();
    const [orderList, setOrderList] = useState(null);
    
    const onItemPress = (oo) => {
        props.navigation.navigate("订单详情", oo);
    }
    
    useEffect(() => {
        $request("getPosAppOrderList").then(res => {
            const list = (res || []);
            for(const vx of list){
                const pmi = getPaymentInfo(vx.paymentType, vx.creditCardBrand || vx.eMoneyType || vx.qrPayType);
                if(pmi){
                    vx.paymentName = pmi.name;
                    vx.paymentLogo = pmi.logo;
                }
            }
            setOrderList(list);
        });
    }, []);
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={{padding: 10}}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            {!orderList ? 
                <View>
                    <ActivityIndicator color={appMainColor} size={30} />
                    <Text style={[fs14, tcMC, mgTX, taC]}>{i18n["loading"]}</Text>
                </View>
            :(!orderList.length ? 
                <Text style={[fs14, tc99, taC]}>{i18n["nodata"]}</Text>
            :orderList.map((vx, ix) => 
                <TouchableOpacity key={vx.id} style={styles.itemBox} onPress={() => onItemPress(vx)} activeOpacity={0.5}>
                    <View style={styles.itemLeft}>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["transaction.amount"]}</Text>
                            <Text style={[fs12, fwB]}>{vx.amount} {vx.currencyCode}</Text>
                        </View>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["transaction.type"]}</Text>
                            {vx.transactionType==1
                            ? <Text style={[fs12, tcG0, taC]}>{i18n["transaction.receive"]}</Text>
                            : <Text style={[fs12, tcR1, taC]}>{i18n["transaction.refund"]}</Text>
                            }
                        </View>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["transaction.time"]}</Text>
                            <Text style={fs12}>{vx.transactionTime}</Text>
                        </View>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["transaction.number"]}</Text>
                            <Text style={fs12}>{vx.slipNumber}</Text>
                        </View>
                    </View>
                    <View style={[fxG1, fxVM]}>
                        <Image style={styles.logoBox} source={LocalPictures[vx.paymentLogo] || LocalPictures.unknownPayment} />
                        <Text style={styles.nameLabel}>{vx.paymentName || i18n["unknown"]}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}