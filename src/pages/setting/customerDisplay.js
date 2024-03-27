import { useEffect, useState } from "react";
import { ScrollView, View, TouchableOpacity, Text, Image, Switch, StatusBar, StyleSheet } from "react-native";
import { useI18N, useAppSettings } from "@/store/getter";
import { dispatchUpdateAppSettings } from "@/store/setter";
import GradientButton from "@/components/GradientButton";
import CustomerDisplay from "@/modules/CustomerDisplay";
import PosPayIcon from "@/components/PosPayIcon";

const styles = StyleSheet.create({
    blankBox: {
        height: 10
    },
    boxDivider: {
        borderTopColor: "#ddd",
        borderTopWidth: StyleSheet.hairlineWidth
    },
    itemBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 15,
        paddingHorizontal: 15
    },
    wsBox: {
        height: 20,
        width: 20 * (800 / 480), //欢迎界面图片固定宽高：800 × 480像素
        resizeMode: "contain"
    }
});

export default function SettingCustomerDisplay(props){
    const i18n = useI18N();
    const wsSource = CustomerDisplay.getWelcomeScreenSource();
    const appSettings = useAppSettings();
    const [isOpened, setIsOpened] = useState(false); //副屏是否已打开
console.log("lllllllllllll", wsSource);
    const onSPAIChange = (newVal) => {
        dispatchUpdateAppSettings("customerDisplayShowPayAmountInfo", !!newVal);
    }
    const onCDTurnOn = () => {
        if(isOpened === null){
            return !$toast(i18n["customer.display.null"]);
        }
        
        setIsOpened(true);
        CustomerDisplay.open();
    }
    const onCDTurnOff = () => {
        if(isOpened === null){
            return !$toast(i18n["customer.display.null"]);
        }
        
        setIsOpened(false);
        CustomerDisplay.turnoff();
    }
    const gotoWS = () => {
        props.navigation.navigate("欢迎屏幕设置");
    }
    
    useEffect(() => {
        setIsOpened(CustomerDisplay.status());
    }, []);
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={mhF}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View style={styles.blankBox}>{/* 空白间隔 */}</View>
            <View style={styles.itemBox}>
                <Text style={[fs16, fxG1]}>{i18n["customer.display.label0"]}</Text>
                {isOpened ? 
                    <Text style={[fs14, tcMC]}>{i18n["customer.display.opened"]}</Text>
                :(isOpened===false ?
                    <Text style={[fs14, tc66]}>{i18n["customer.display.closed"]}</Text> :
                    <Text style={[fs14, tc99]}>{i18n["customer.display.null"]}</Text>
                )}
            </View>
            <View style={[pdHX, bgFF]}><View style={styles.boxDivider}>{/*==== 分割线 ====*/}</View></View>
            <View style={styles.itemBox}>
                <Text style={[fs16, fxG1]}>{i18n["customer.display.label1"]}</Text>
                <Switch
                    style={{height: 20}}
                    value={appSettings.customerDisplayShowPayAmountInfo} 
                    thumbColor={appSettings.customerDisplayShowPayAmountInfo ? appMainColor : switchTrackColor.thumbColor} 
                    trackColor={switchTrackColor}
                    onValueChange={onSPAIChange} />
            </View>
            <View style={[pdHX, bgFF]}><View style={styles.boxDivider}>{/*==== 分割线 ====*/}</View></View>
            <TouchableOpacity style={styles.itemBox} onPress={gotoWS} activeOpacity={0.7}>
                <Text style={[fs16, fxG1]}>{i18n["customer.display.ws"]}</Text>
                <Image source={wsSource} style={styles.wsBox} />
                <PosPayIcon name="right-arrow" color="#aaa" size={20} />
            </TouchableOpacity>
            <View style={fxG1}>{/* 占位用 */}</View>
            <View style={[pdX, fxR]}>
                <GradientButton style={fxG1} onPress={onCDTurnOn}>{i18n["btn.on"]}</GradientButton>
                <GradientButton style={[fxG1, mgLX]} onPress={onCDTurnOff}>{i18n["btn.off"]}</GradientButton>
            </View>
        </ScrollView>
    );
}