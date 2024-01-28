import { TouchableHighlight, ScrollView, View, Text, Switch, StatusBar, StyleSheet } from "react-native";
import { useI18N, useAppSettings } from "@/store/getter";
import { dispatchUpdateAppSettings } from "@/store/setter";
import PosPayIcon from "@/components/PosPayIcon";

const styles = StyleSheet.create({
    blankBox: {
        height: 10
    },
    boxDivider: {
        borderTopColor: "#ddd",
        borderTopWidth: StyleSheet.hairlineWidth
    }
});

const settingList = [
    {
        actionName: "语言设置",
        i18nLabel: "language.header",
        i18nDesc: "app.lgname" //描述性文本
    },
    {
        actionName: "测试中心",
        i18nLabel: "test.centre",
        i18nDesc: "test.debug.available",
        disabled: runtimeEnvironment.isProduction
    }
];

const switchList = [
    {
        i18nLabel: "setting.enable.drawer",
        settingKey: "isEnableDrawer"
    },
    {
        i18nLabel: "setting.enable.tabbar",
        settingKey: "isEnableTabbar"
    },
    {
        i18nLabel: "setting.enable.home.header",
        settingKey: "isEnableHomeHeader"
    }
];

const switchTrackColor = { 
    "true": appLightColor, 
    "false": "#ccc",
};

export default function SettingIndex(props){
    const i18n = useI18N();
    const appSettings = useAppSettings();
    
    const onItemPress = (actionName) => {
        props.navigation.navigate(actionName);
    }
    
    const onSwitchChange = (settingKey) => {
        dispatchUpdateAppSettings(settingKey, !appSettings[settingKey]);
    }
    
    return (
        <ScrollView>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View style={styles.blankBox}>{/*占位专用*/}</View>
            {settingList.map((vx, ix) => (
                <TouchableHighlight key={vx.actionName} style={[pdHX, bgFF, vx.disabled && dpN]} underlayColor="#eee" onPress={() => onItemPress(vx.actionName)}>
                    <View style={[pdVX, fxHC, ix && styles.boxDivider]}>
                        <Text style={[fs16, fxG1]}>{i18n[vx.i18nLabel]}</Text>
                        <Text style={!vx.i18nDesc ? dpN : [fs14, tc99]}>{i18n[vx.i18nDesc]}</Text>
                        <PosPayIcon name="right-arrow" color="#aaa" size={22} />
                    </View>
                </TouchableHighlight>
            ))}
            {switchList.map(vx => (
                <View key={vx.settingKey} style={[pdHX, bgFF]}>
                    <View style={[pdVX, fxHC, styles.boxDivider]}>
                        <Text style={[fs16, fxG1]}>{i18n[vx.i18nLabel]}</Text>
                        <Switch 
                            value={appSettings[vx.settingKey]} 
                            thumbColor={appSettings[vx.settingKey] ? appMainColor : "#eee"} 
                            trackColor={switchTrackColor} 
                            onValueChange={() => onSwitchChange(vx.settingKey)}/>
                    </View>
                </View>
            ))}
        </ScrollView>
    )
}