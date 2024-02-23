import { useState, useRef } from "react";
import { TouchableHighlight, ScrollView, View, Text, StatusBar, StyleSheet } from "react-native";
import { dispatchChangeLanguage } from "@/store/setter";
import { useI18N, getLanguageCode } from "@/store/getter";
import { supportLanguageList } from "@/common/Statics";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";

const styles = StyleSheet.create({
    lgItem: {
        paddingVertical: 18,
        borderBottomColor: "#ccc",
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    bthBox: {
        marginTop: 60
    }
});

export default function SettingLanguage(props){
    const initCode = useRef(getLanguageCode());
    const [lgCode, setLgCode] = useState(initCode.current);
    const i18n = useI18N();

    const setLanguage = function(item){
        if(!item.disabled){
            dispatchChangeLanguage(item.code);
            setLgCode(item.code);
        } else {
            $notify.info(i18n["language.disabled.tip"]);
        }
    }
    
    const restartAPP = function(){
        props.navigation.goBack();
    }
    
    return (
        <ScrollView style={pgFF}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            {supportLanguageList.map(vx => (
                <TouchableHighlight key={vx.code} underlayColor="#f0f0f0" style={pdHX} onPress={() => setLanguage(vx)}>
                    <View style={[fxHC, styles.lgItem]}>
                        <Text style={[fxG1, fs16, vx.code===lgCode&&tcMC]}>{vx.name}</Text>
                        <PosPayIcon name="check-v" color={appMainColor} visible={vx.code===lgCode} size={18} />
                    </View>
                </TouchableHighlight>
            ))}
            <View style={[pdX, styles.bthBox]}>
                <GradientButton disabled={initCode.current===lgCode} onPress={restartAPP}>{i18n["btn.apply"]}</GradientButton>
            </View>
        </ScrollView>
    )
}