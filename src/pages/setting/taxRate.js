import { useEffect, useState } from "react";
import { ScrollView, View, TextInput, Text, StatusBar, StyleSheet } from "react-native";
import { dispatchUpdateAppSettings } from "@/store/setter";
import { useI18N, getGeneralTaxRate } from "@/store/getter";
import PosPayIcon from "@/components/PosPayIcon";

const styles = StyleSheet.create({
    inputBox: {
        borderBottomColor: appMainColor,
        borderBottomWidth: 1,
        marginBottom: 0,
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "right",
        paddingHorizontal: 20
    },
    percentageBox: {
        position:"absolute",
        right: 15,
        top: 15,
        zIndex: 1,
        fontSize: 20
    }
});

export default function SettingTaxRate(props){
    const i18n = useI18N();
    const [taxRate, setTaxRate] = useState("0");
    
    const onConfirm = () => {
        const newRate = Math.max(+taxRate || 0, 0);
        dispatchUpdateAppSettings("generalTaxRate", Math.min(100, newRate));
        props.navigation.goBack();
    }
    
    useEffect(() => {
        setTaxRate(getGeneralTaxRate().toString());
    }, []);
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={pdHX} keyboardShouldPersistTaps="handled">
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <TextInput 
                style={styles.inputBox}
                defaultValue={taxRate}
                onChangeText={setTaxRate}
                onSubmitEditing={onConfirm}
                keyboardType="number-pad"
                maxLength={5}
                autoFocus={true}
            />
            <Text style={styles.percentageBox}>%</Text>
            <Text style={[mgTX, tc66, taR, fs12]}>{i18n["tax.formula"]}</Text>
            <View style={[mgTX, fxHC]}>
                <PosPayIcon name="info-solid" size={14} color={tcR0.color} offset={-3} />
                <Text style={[fxG1, tcR0, fwB, fs12]}>{i18n["tax.disabled.tip"]}</Text>
            </View>
        </ScrollView>
    )
}