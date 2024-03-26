import { useState } from "react";
import { TouchableHighlight, ScrollView, View, Text, StatusBar, StyleSheet } from "react-native";
import { dispatchUpdateAppSettings } from "@/store/setter";
import { useI18N, getAppSettings } from "@/store/getter";
import { supportCurrencyList } from "@/common/Statics";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";

const styles = StyleSheet.create({
    itemBox: {
        paddingVertical: 18,
        borderBottomColor: "#ccc",
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    bthBox: {
        marginTop: 60
    }
});

export default function SettingCurrency(props){
    const i18n = useI18N();
    const appSettings = getAppSettings();
    const [selCode, setSelCode] = useState(appSettings.regionalCurrencyCode);
    
    const onConfirm = function(){
        const thatCurrency = supportCurrencyList.find(vx => vx.code === selCode);
        if(thatCurrency){
            dispatchUpdateAppSettings({}, {
                regionalCurrencySymbol: thatCurrency.symbol, //货币符号
                regionalCurrencyCode: thatCurrency.code, //货币代号
                regionalCurrencyUnit: thatCurrency.unit //货币单元
            });
        }
        props.navigation.goBack();
    }
    
    return (
        <ScrollView style={pgFF}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            {supportCurrencyList.map(vx => (
                <TouchableHighlight key={vx.code} underlayColor="#f0f0f0" style={pdHX} onPress={() => setSelCode(vx.code)}>
                    <View style={[fxHC, styles.itemBox]}>
                        <Text style={[fxG1, fs16, vx.code===selCode&&tcMC]}>{vx.name} ({vx.code})</Text>
                        <PosPayIcon name="check-v" color={appMainColor} visible={vx.code===selCode} size={18} />
                    </View>
                </TouchableHighlight>
            ))}
            <View style={[pdX, styles.bthBox]}>
                <GradientButton disabled={appSettings.regionalCurrencyCode===selCode} onPress={onConfirm}>{i18n["btn.apply"]}</GradientButton>
            </View>
        </ScrollView>
    );
}