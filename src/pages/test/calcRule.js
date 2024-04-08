import { ScrollView, Text, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import GradientButton from "@/components/GradientButton";

const styles = StyleSheet.create({
    btnBox: {
        position: "absolute",
        left: 15,
        right: 15,
        bottom: 15,
        zIndex: 99
    }
});

//金额计算规则
export default function TestCalcRule(props){
    const i18n = useI18N();
    
    return (<>
        <ScrollView style={pgFF} contentContainerStyle={pdX}>
            <Text style={[fs20, fwB, taC, pdBX]}>{i18n["calc.rule.header"]}</Text>
            <Text style={[fs14, mgTS]}>{i18n["calc.rule.desc"]}</Text>
        </ScrollView>
        <GradientButton style={styles.btnBox} onPress={props.navigation.goBack}>{i18n["btn.understand"]}</GradientButton>
    </>);
}