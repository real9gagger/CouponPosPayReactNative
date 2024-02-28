import { useEffect, useState } from "react";
import { TouchableHighlight, ScrollView, View, Text, Switch, StatusBar, StyleSheet } from "react-native";
import { useI18N, getAppSettings } from "@/store/getter";
import { dispatchUpdateAppSettings } from "@/store/setter";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";
import AppPackageInfo from "@/modules/AppPackageInfo";
//import AppNavigationInfo from "@/modules/AppNavigationInfo";

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
    },
    tipBox: {
        color: "#f90",
        textAlign: "center",
        paddingHorizontal: 10,
        paddingVertical: 20,
        fontSize: 14
    },
    switchBox: {
        height: 20,
    }
});

const settingList = [
    {
        actionName: "语言设置",
        i18nLabel: "language.header",
        i18nDesc: "app.lgname" //描述性文本，需要翻译
    },
    {
        actionName: "金额设置",
        i18nLabel: "money.header",
        i18nDesc: "test.debug.available",
        disabled: runtimeEnvironment.isProduction
    },
    {
        actionName: "货币设置",
        i18nLabel: "currency.header",
        i18nDesc: "test.debug.available",
        disabled: runtimeEnvironment.isProduction
    },
    {
        actionName: "测试中心",
        i18nLabel: "test.centre",
        i18nDesc: "test.debug.available",
        disabled: runtimeEnvironment.isProduction
    },
    {
        actionName: "设备信息",
        i18nLabel: "test.devinfo",
        i18nDesc: ""
    },
    {
        actionName: "支付合作商",
        i18nLabel: "payment.supports",
        i18nDesc: ""
    },
    {
        actionName: "关于软件",
        i18nLabel: "about.software",
        i18nDesc: "",
        descText: AppPackageInfo.getFullVersion() //描述性文本，不需要翻译
    },
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
    },
    /* {
        i18nLabel: "setting.enable.sysnav",
        settingKey: "isEnableSystemNavigation"
    } */
];

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
        
        //AppNavigationInfo.setVisible(newSettings.isEnableSystemNavigation);
        
        props.navigation.goBack();
    }
    
    useEffect(() => {
        const myItems = { isSomeItemHasBeenChanged: false }; //是否至少有一项被修改过了
        
        for(const vx of switchList){
            myItems[vx.settingKey] = !!appSettings[vx.settingKey];
        }

        setSwitchItems(myItems);
    }, []);
    
    return (<>
        <ScrollView style={pgEE} contentContainerStyle={mhF}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View style={styles.blankBox}>{/*==== 占位专用 ====*/}</View>
            {switchList.map((vx, ix) => (
                <View key={vx.settingKey} style={[pdHX, bgFF]}>
                    <View style={[pdVX, fxHC, ix && styles.boxDivider]}>
                        <Text style={[fs16, fxG1]}>{i18n[vx.i18nLabel]}</Text>
                        <Switch 
                            style={styles.switchBox}
                            value={switchItems[vx.settingKey]} 
                            thumbColor={switchItems[vx.settingKey] ? appMainColor :switchTrackColor.thumbColor} 
                            trackColor={switchTrackColor} 
                            onValueChange={onSwitchChange(vx.settingKey)}/>
                    </View>
                </View>
            ))}
            <View style={styles.blankBox}>{/*==== 占位专用 ====*/}</View>
            {settingList.map((vx, ix) => (
                <TouchableHighlight key={vx.actionName} style={vx.disabled ? dpN : [pdHX, bgFF]} underlayColor="#eee" onPress={() => onItemPress(vx.actionName)}>
                    <View style={[pdVX, fxHC, ix && styles.boxDivider]}>
                        <Text style={[fs16, fxG1]}>{i18n[vx.i18nLabel]}</Text>
                        <Text style={!vx.i18nDesc && !vx.descText ? dpN : [fs14, tc99]}>{vx.descText || i18n[vx.i18nDesc]}</Text>
                        <PosPayIcon name="right-arrow" color="#aaa" size={20} />
                    </View>
                </TouchableHighlight>
            ))}
            <Text style={[styles.tipBox, !switchItems.isSomeItemHasBeenChanged && op00]}>{i18n["setting.apply.tip"]}</Text>
            <View style={{height:60}}>{/* 占位专用 */}</View>
        </ScrollView>
        <GradientButton
            style={styles.bthBox}
            disabled={!switchItems.isSomeItemHasBeenChanged} 
            onPress={onPressConfirm}>{i18n["btn.apply"]}</GradientButton>
    </>)
}