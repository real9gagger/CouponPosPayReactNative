import { ScrollView, View, TouchableHighlight, Text } from "react-native";
import { useI18N, useAppSettings } from "@/store/getter";
import { dispatchClearAppErrorInfo, dispatchCheckAppSettings } from "@/store/setter";
import { formatDate } from "@/utils/helper";
import GradientButton from "@/components/GradientButton";

//应用错误所有的信息
export default function AppErrors(props){
    const i18n = useI18N();
    const appSettings = useAppSettings();
    const errList = Array.from(appSettings.appErrorList || []).reverse();
    
    const onItemPress = () => {
        //nothing to do
    }
    const onClearErrors = () => {
        $confirm(i18n["clear.confirm"]).then(dispatchClearAppErrorInfo);
    }
    const repairAppSettings = () => {
        dispatchCheckAppSettings();
        setTimeout($toast, 250, appSettings.lastErrorMessage);
    }
    
    return (<>
        <ScrollView style={pgFF}>
            {errList.map(vx => <TouchableHighlight key={vx.createTime} style={pdHX} underlayColor="#eee" onPress={onItemPress}>
                <View style={pdVS}>
                    <Text style={[fs14, tcR0, fwB]}>{vx.errorMsg}</Text>
                    <Text style={fs12}>{formatDate(vx.createTime)}&ensp;•&ensp;{i18n["error.level"]}:&nbsp;{i18n[vx.isFatal ? "error.fatal" : "error.general"]}</Text>
                </View>
            </TouchableHighlight>)}
            {errList.length ?
                <Text style={[pdX, taC, tc99, fs14]}>{i18n["how.many.items"].cloze(errList.length)}</Text> :
                <Text style={[pdX, taC, tc99, fs18]}>{i18n["nodata"]}</Text>
            }
        </ScrollView>
        <View style={[fxHC, pdHX, pdVS, bgFF]}>
            <GradientButton onPress={repairAppSettings} style={fxG1}>{i18n["error.repair"]}</GradientButton>
            <GradientButton onPress={onClearErrors} style={[fxG1, mgLS]} disabled={errList.length===0}>{i18n["btn.clear"]}</GradientButton>
        </View>
    </>);
}