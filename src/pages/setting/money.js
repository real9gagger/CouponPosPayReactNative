import { useRef, useState } from "react";
import { ScrollView, TextInput, Text, StatusBar, Keyboard, StyleSheet } from "react-native";
import { dispatchUpdateAppSettings } from "@/store/setter";
import { useI18N, getNumbersDecimalOfMoney } from "@/store/getter";
import GradientButton from "@/components/GradientButton";

const styles = StyleSheet.create({
    inputBox: {
        borderBottomColor: appMainColor,
        borderBottomWidth: 1,
        marginBottom: 5,
        fontSize: 24,
        fontWeight: "bold"
    }
});


export default function SettingMoney(props){
    const i18n = useI18N();
    const lastDec = useRef(getNumbersDecimalOfMoney().toString());
    const [decNum, setDecNum] = useState(lastDec.current);
    
    const onConfirm = () => {
        Keyboard.dismiss();
        dispatchUpdateAppSettings("numbersDecimalOfMoney", +decNum || 0);
        props.navigation.goBack();
    }
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={pdX} keyboardShouldPersistTaps="handled">
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <Text style={fs14}>{i18n["money.decnum.tip"]}</Text>
            <TextInput 
                style={styles.inputBox}
                defaultValue={decNum}
                onChangeText={setDecNum}
                keyboardType="number-pad"
                autoFocus={true}
            />
            <Text style={[fs14, taR]}>{i18n["money.last.tip"]}<Text style={[fwB, tcMC]}>{lastDec.current}</Text></Text>
            <GradientButton onPress={onConfirm} style={{marginTop: 50, marginBottom: 10}}>{i18n["btn.confirm"]}</GradientButton>
            <Text style={[fs14, taC, tcR1]}>{i18n["setting.restart.tip"]}</Text>
        </ScrollView>
    )
}