import { useEffect, useState } from "react";
import { ScrollView, TextInput, Text, StatusBar, StyleSheet } from "react-native";
import { dispatchUpdateAppSettings } from "@/store/setter";
import { useI18N, getNumbersDecimalOfMoney } from "@/store/getter";

const NUM99 = "99.9999999999";
const styles = StyleSheet.create({
    inputBox: {
        borderBottomColor: appMainColor,
        borderBottomWidth: 1,
        marginBottom: 2.5,
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "right"
    }
});

export default function SettingMoney(props){
    const i18n = useI18N();
    const [decNum, setDecNum] = useState("0");
    
    const onConfirm = () => {
        dispatchUpdateAppSettings("numbersDecimalOfMoney", Math.floor(+decNum || 0));
        props.navigation.goBack();
    }
    
    useEffect(() => {
        setDecNum(getNumbersDecimalOfMoney().toString());
    }, []);
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={pdX} keyboardShouldPersistTaps="handled">
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <Text style={fs14}>{i18n["money.decnum.tip"]}</Text>
            <TextInput 
                style={styles.inputBox}
                defaultValue={decNum}
                onChangeText={setDecNum}
                onSubmitEditing={onConfirm}
                keyboardType="number-pad"
                maxLength={1}
                autoFocus={true}
            />
            <Text style={[fs10, taR, tc99]}>{i18n["preview"]}: {NUM99.substr(0, +decNum ? 3 : 2)}{NUM99.substr(3, +decNum)}</Text>
            <Text style={[fs14, taC, tcR1, pdVX]}>{i18n["setting.restart.tip"]}</Text>
        </ScrollView>
    )
}