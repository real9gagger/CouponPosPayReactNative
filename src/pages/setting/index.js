import { useEffect, useState } from "react";
import { TouchableHighlight, ScrollView, View, Text, Switch, StatusBar, StyleSheet } from "react-native";
import { useI18N, getAppSettings } from "@/store/getter";
import { dispatchUpdateAppSettings } from "@/store/setter";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";

const styles = StyleSheet.create({
    blankBox: {
        height: 10
    },
    boxDivider: {
        borderTopColor: "#ddd",
        borderTopWidth: StyleSheet.hairlineWidth
    },
    bthBox: {
        position: "absolute",
        bottom: 20,
        left: 15,
        right: 15,
        zIndex: 9
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
        i18nLabel: "setting.enable.homeheader",
        settingKey: "isEnableHomeHeader"
    }
];

const switchTrackColor = { 
    "true": appLightColor, 
    "false": "#ccc",
    "thumbColor": "#eee"
};

export default function SettingIndex(props){
    const i18n = useI18N();
    const appSettings = getAppSettings();
    const [switchItems, setSwitchItems] = useState({});
    
    const onItemPress = (actionName) => {
        props.navigation.navigate(actionName);
    }
    
    const onSwitchChange = (settingKey) => {
        return function(){
            switchItems[settingKey] = !switchItems[settingKey];
            switchItems.isSomeItemHasBeenChanged = false; //重置！
            
            for(const vx of switchList){
                if(switchItems[vx.settingKey] !== appSettings[vx.settingKey]) {
                    switchItems.isSomeItemHasBeenChanged = true;
                    break;
                }
            }
            
            setSwitchItems({...switchItems});
        }
    }
    
    const onPressConfirm = () => {
        const newSettings = {};
        
        for(const vx of switchList){
            newSettings[vx.settingKey] = switchItems[vx.settingKey];
        }
        
        dispatchUpdateAppSettings({}, newSettings);
        
        props.navigation.goBack();
    }
    
    useEffect(() => {
        const myItems = { isSomeItemHasBeenChanged: false }; //是否至少有一项被修改过了
        
        for(const vx of switchList){
            myItems[vx.settingKey] = !!appSettings[vx.settingKey];
        }

        setSwitchItems(myItems);
    }, []);
    
    return (
        <ScrollView style={fxG1} contentContainerStyle={mhF}>
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
            <View style={styles.blankBox}>{/*占位专用*/}</View>
            {switchList.map((vx, ix) => (
                <View key={vx.settingKey} style={[pdHX, bgFF]}>
                    <View style={[pdVX, fxHC, ix && styles.boxDivider]}>
                        <Text style={[fs16, fxG1]}>{i18n[vx.i18nLabel]}</Text>
                        <Switch 
                            value={switchItems[vx.settingKey]} 
                            thumbColor={switchItems[vx.settingKey] ? appMainColor : switchTrackColor.thumbColor} 
                            trackColor={switchTrackColor} 
                            onValueChange={onSwitchChange(vx.settingKey)}/>
                    </View>
                </View>
            ))}
            <GradientButton 
                style={styles.bthBox}
                disable={!switchItems.isSomeItemHasBeenChanged} 
                onPress={onPressConfirm}>{i18n["btn.confirm"]}</GradientButton>
        </ScrollView>
    )
}