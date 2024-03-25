import { ScrollView, View, Text, Image, Switch, StatusBar, StyleSheet, Pressable } from "react-native";
import { useI18N, useAppSettings } from "@/store/getter";
import { dispatchUpdateAppSettings } from "@/store/setter";
import PosPayIcon from "@/components/PosPayIcon";
import LocalPictures from "@/common/Pictures";

const styles = StyleSheet.create({
    blankBox: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 15
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
    picBox: {
        width: 12,
        height: 22,
        marginRight: 2,
        backgroundColor: "#fff",
        borderColor: "#aaa",
        borderWidth: StyleSheet.hairlineWidth
    }
});

export default function SettingPrint(props){
    
    const i18n = useI18N();
    const appSettings = useAppSettings();
    
    const onBotTextChange = (newTxt) =>{
        dispatchUpdateAppSettings("paymentReceiptBottomText", newTxt);
    };
    const onPSLChange = (newVal) => {
        dispatchUpdateAppSettings("paymentReceiptPrintShopLogo", !!newVal);
    }
    const gotoInputBotText = () => {
        props.navigation.navigate("文本输入器", { 
            defaultText: appSettings.paymentReceiptBottomText,
            onGoBack: onBotTextChange
        });
    };
    const printPV = () => {
        props.navigation.navigate("打印预览");
    };
    
    return (
        <ScrollView style={pgEE} keyboardShouldPersistTaps="handled">
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View style={styles.blankBox}><Text style={[fs14, fwB]}>{i18n["payment.receipt"]}</Text></View>
            <Pressable style={styles.itemBox} android_ripple={tcBB} onPress={gotoInputBotText}>
                <Text style={fs16}>{i18n["print.bottext"]}</Text>
                <Text style={[fs14, tc66, fxG1, pdLX, taR]} numberOfLines={1}>{appSettings.paymentReceiptBottomText}</Text>
                <PosPayIcon name="edit-pen" color="#999" size={20} offset={2} />
            </Pressable>
            <View style={[pdHX, bgFF]}><View style={styles.boxDivider}>{/*==== 分割线 ====*/}</View></View>
            <View style={styles.itemBox}>
                <Text style={[fs16, fxG1]}>{i18n["print.shoplogo"]}</Text>
                <Switch
                    style={{height: 20}}
                    value={appSettings.paymentReceiptPrintShopLogo} 
                    thumbColor={appSettings.paymentReceiptPrintShopLogo ? appMainColor : switchTrackColor.thumbColor} 
                    trackColor={switchTrackColor} 
                    onValueChange={onPSLChange} />
            </View>
            <View style={[pdHX, bgFF]}><View style={styles.boxDivider}>{/*==== 分割线 ====*/}</View></View>
            <Pressable style={styles.itemBox} android_ripple={tcBB} onPress={printPV}>
                <Text style={[fs16, fxG1]}>{i18n["preview"]}</Text>
                <Image source={LocalPictures.printPreview} style={styles.picBox} resizeMode="contain" />
                <PosPayIcon name="right-arrow" color="#aaa" size={20} />
            </Pressable>
        </ScrollView>
    );
}