import { useEffect, useState } from "react";
import { TouchableHighlight, ScrollView, View, Text, Switch, StatusBar, StyleSheet } from "react-native";
import { useI18N, useAppSettings } from "@/store/getter";
import { dispatchUpdateAppSettings } from "@/store/setter";
import useStateRef from "@/utils/useStateRef";
import PosPayIcon from "@/components/PosPayIcon";
import AppPackageInfo from "@/modules/AppPackageInfo";
import ReceiptsPlus from "@/modules/ReceiptsPlus";
//import AppNavigationInfo from "@/modules/AppNavigationInfo";

const styles = StyleSheet.create({
    blankBox: {
        height: 10
    },
    boxDivider: {
        borderTopColor: "#ddd",
        borderTopWidth: StyleSheet.hairlineWidth
    },
    switchBox: {
        height: 20,
    },
    descBox: {
        fontSize: 14,
        color: "#888",
        flex: 1,
        textAlign: "right"
    }
});

const settingList = [
    {
        actionName: "语言设置",
        i18nLabel: "language.header"
    },
    {
        actionName: "开机自启设置",
        i18nLabel: "setting.auto.launch"
    },
    {
        actionName: "支付类型设置",
        i18nLabel: "setting.paytype.tabs"
    },
    {
        actionName: "税率设置",
        i18nLabel: "tax.rate",
        disabled: runtimeEnvironment.isProduction
    },
    {
        actionName: "金额设置",
        i18nLabel: "money.header",
        disabled: runtimeEnvironment.isProduction
    },
    {
        actionName: "货币设置",
        i18nLabel: "currency.header",
        disabled: runtimeEnvironment.isProduction
    }
];

const infoList = [
    {
        actionName: "测试中心",
        i18nLabel: "test.centre",
        disabled: runtimeEnvironment.isProduction
    },
    {
        actionName: "软件图标",
        i18nLabel: "app.icons",
        disabled: runtimeEnvironment.isProduction
    },
    {
        actionName: "设备信息",
        i18nLabel: "test.devinfo"
    },
    {
        actionName: "支付合作商",
        i18nLabel: "payment.supports"
    },
    {
        actionName: "关于软件",
        i18nLabel: "about.software"
    },
    {
        actionName: "清理缓存",
        i18nLabel: "app.clean.caches",
        iconName: "cleans"
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
    },
    /* {
        i18nLabel: "setting.enable.sysnav",
        settingKey: "isEnableSystemNavigation"
    } */
];

export default function SettingIndex(props){
    const i18n = useI18N();
    const appSettings = useAppSettings();
    const [switchItems, setSwitchItems, switchItemsRef] = useStateRef({});
    const [descTexts, setDescTexts] = useState({});
    
    const onItemPress = (actionName) => {
        return function(){
            if(actionName === "清理缓存"){
                $confirm(i18n["app.clean.caches"]).then(() => {
                    ReceiptsPlus.clearPrintCaches();
                    $toast(i18n["cleaning.completed.tip"]);
                    setDescTexts({...descTexts, "清理缓存": "0KB"})
                });
            } else {
                props.navigation.navigate(actionName);
            }
        };
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
    
    const onPageGoBack = () => {
        //必须使用引用，否则无法获取最新的值，因为此函数不是用户点击、触摸屏幕触发的，而是页面退出时，软件调用的
        if(switchItemsRef.current.isSomeItemHasBeenChanged){
            $toast(i18n["setting.apply.tip"]);
            
            const newSettings = {};
            
            for(const vx of switchList){
                newSettings[vx.settingKey] = switchItemsRef.current[vx.settingKey];
            }
            
            dispatchUpdateAppSettings({}, newSettings);
            
            //AppNavigationInfo.setVisible(newSettings.isEnableSystemNavigation);
        }
    }
    
    useEffect(() => {
        const myItems = { isSomeItemHasBeenChanged: false }; //是否至少有一项被修改过了
        for(const vx of switchList){
            myItems[vx.settingKey] = !!appSettings[vx.settingKey];
        }
        setSwitchItems(myItems);
        
        return onPageGoBack;
    }, []);
    
    useEffect(() => {
        ReceiptsPlus.getAppCacheSize().then(theCacheSize => {
            setDescTexts({
                "语言设置": i18n["app.lgname"],
                "税率设置": appSettings.generalTaxRate + "%",
                "金额设置": appSettings.numbersDecimalOfMoney.toString(),
                "货币设置": appSettings.regionalCurrencyCode,
                
                "测试中心": i18n["test.debug.available"],
                "软件图标": i18n["test.debug.available"],
                "清理缓存": theCacheSize,
                "关于软件": AppPackageInfo.getFullVersion()
            });
        });
    }, [i18n, appSettings]);
    
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
                            thumbColor={switchItems[vx.settingKey] ? appMainColor : switchTrackColor.thumbColor} 
                            trackColor={switchTrackColor} 
                            onValueChange={onSwitchChange(vx.settingKey)}/>
                    </View>
                </View>
            ))}
            <View style={styles.blankBox}>{/*==== 占位专用 ====*/}</View>
            {settingList.map((vx, ix) => (
                <TouchableHighlight key={vx.actionName} style={vx.disabled ? dpN : [pdHX, bgFF]} underlayColor="#eee" onPress={onItemPress(vx.actionName)}>
                    <View style={[pdVX, fxHC, ix && styles.boxDivider]}>
                        <Text style={fs16}>{i18n[vx.i18nLabel]}</Text>
                        <PosPayIcon visible={vx.disabled !== undefined} name="debug" color={appMainColor} size={16} />
                        <Text style={styles.descBox}>{descTexts[vx.actionName]}</Text>
                        <PosPayIcon name="right-arrow" color="#aaa" size={20} />
                    </View>
                </TouchableHighlight>
            ))}
            <View style={styles.blankBox}>{/*==== 占位专用 ====*/}</View>
            {infoList.map((vx, ix) => (
                <TouchableHighlight key={vx.actionName} style={vx.disabled ? dpN : [pdHX, bgFF]} underlayColor="#eee" onPress={onItemPress(vx.actionName)}>
                    <View style={[pdVX, fxHC, ix && styles.boxDivider]}>
                        <Text style={fs16} numberOfLines={1}>{i18n[vx.i18nLabel]}</Text>
                        <PosPayIcon visible={vx.disabled !== undefined} name="debug" color={appMainColor} size={16} />
                        <Text style={styles.descBox} numberOfLines={1}>{descTexts[vx.actionName]}</Text>
                        <PosPayIcon name={vx.iconName || "right-arrow"} color="#aaa" size={20} />
                    </View>
                </TouchableHighlight>
            ))}
            <View style={{height:50}}>{/* 占位专用 */}</View>
        </ScrollView>
    </>)
}