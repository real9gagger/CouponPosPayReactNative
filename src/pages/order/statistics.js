import { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useI18N, useAppSettings } from "@/store/getter";
import { EMPTY_DEFAULT_TEXT } from "@/common/Statics";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";

const styles = StyleSheet.create({
    itemBox: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10
    },
    itemRight: {
        marginLeft: 5
    },
    rowBottom: {
        marginTop: 5
    },
    labelBox: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 10
    },
    valueBox: {
        fontSize: 20,
        fontWeight: "bold",
        color: appDarkColor
    },
    valueUnit: {
        fontSize: 10,
        marginLeft: 2,
        paddingTop: 6,
        color: "#666"
    },
    valueUnitHidden: {
        fontSize: 10,
        marginRight: 2,
        color: "#fff"
    }
});

export default function OrderStatistics(props){
    
    const i18n = useI18N();
    const appSettings = useAppSettings();
    const [statisData, setStatisData] = useState({});
    
    useEffect(() => {
        $request("getOrderStatistics").then(setStatisData);
    }, []);
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={[mhF, pdX]}>
            <View style={[fxHC, fxWP]}>
                <View style={styles.itemBox}>
                    <View style={fxHM}>
                        <Text style={styles.valueUnitHidden}>{appSettings.currencyUnit}</Text>
                        <Text style={styles.valueBox}>{statisData.totalOrderAmount || EMPTY_DEFAULT_TEXT}</Text>
                        <Text style={styles.valueUnit}>{appSettings.currencyUnit}</Text>
                    </View>
                    <Text style={styles.labelBox}>累计销售</Text>
                </View>
                <View style={[styles.itemBox, styles.itemRight]}>
                    <View style={fxHM}>
                        <Text style={styles.valueUnitHidden}>{appSettings.currencyUnit}</Text>
                        <Text style={styles.valueBox}>{statisData.totalDiscountAmount || EMPTY_DEFAULT_TEXT}</Text>
                        <Text style={styles.valueUnit}>{appSettings.currencyUnit}</Text>
                    </View>
                    <Text style={styles.labelBox}>累计优惠</Text>
                </View>
            </View>
            <View style={[fxHC, fxWP, styles.rowBottom]}>
                <View style={styles.itemBox}>
                    <View style={fxHM}>
                        <Text style={styles.valueUnitHidden}>{appSettings.currencyUnit}</Text>
                        <Text style={styles.valueBox}>{statisData.totalTax || EMPTY_DEFAULT_TEXT}</Text>
                        <Text style={styles.valueUnit}>{appSettings.currencyUnit}</Text>
                    </View>
                    <Text style={styles.labelBox}>累计收税</Text>
                </View>
                <View style={[styles.itemBox, styles.itemRight]}>
                    <View style={fxHM}>
                        <Text style={styles.valueUnitHidden}>{appSettings.currencyUnit}</Text>
                        <Text style={styles.valueBox}>{statisData.totalAmount || EMPTY_DEFAULT_TEXT}</Text>
                        <Text style={styles.valueUnit}>{appSettings.currencyUnit}</Text>
                    </View>
                    <Text style={styles.labelBox}>累计收入</Text>
                </View>
            </View>
        </ScrollView>
    );
}