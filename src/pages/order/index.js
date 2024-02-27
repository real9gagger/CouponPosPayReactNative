import { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StatusBar, ActivityIndicator, StyleSheet } from "react-native";
import { useI18N, useAppSettings } from "@/store/getter";

const styles = StyleSheet.create({
    itemBox: {
        padding: 10,
        backgroundColor: "#fff",
        marginBottom: 5,
        borderRadius: 8
    },
    itemLeft: {
        width: "100%"
    }
});

export default function OrderIndex(props){
    const i18n = useI18N();
    const appSettings = useAppSettings();
    const [orderList, setOrderList] = useState(null);
    
    const onItemPress = () => {
        
    }
    
    useEffect(() => {
        $request("getPosAppOrderList", {
            
        }).then(res => {
            console.log(res);
            setOrderList(res || []);
        });
    }, []);
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={pdX}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            {!orderList ? 
                <View>
                    <ActivityIndicator color={appMainColor} size={30} />
                    <Text style={[fs14, tcMC, mgTX, taC]}>{i18n["loading"]}</Text>
                </View>
            :(!orderList.length ? 
                <Text style={[fs14, tc99, taC]}>{i18n["nodata"]}</Text>
            :orderList.map(vx => 
                <TouchableOpacity key={vx.id} style={styles.itemBox} onPress={onItemPress} activeOpacity={0.5}>
                    <View style={styles.itemLeft}>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["transaction.amount"]}</Text>
                            <Text style={[fs12, fwB]}>{vx.amount} {appSettings.currencyCode}</Text>
                        </View>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["order.amount"]}</Text>
                            <Text style={fs12}>{vx.orderAmount} {appSettings.currencyCode}</Text>
                        </View>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["tax"]}</Text>
                            <Text style={fs12}>{vx.tax} {appSettings.currencyCode}</Text>
                        </View>
                        <View style={fxHC}>
                            <Text style={[fs12, fxG1]}>{i18n["coupon.discount"]}</Text>
                            <Text style={fs12}>-{vx.discountAmount} {appSettings.currencyCode}</Text>
                        </View>
                        <View><Text style={[mgTX, fs10, tc99, taR]}>{vx.transactionTime}</Text></View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}