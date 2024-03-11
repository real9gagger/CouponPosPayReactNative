import { useEffect, useState } from "react";
import { ScrollView, View, StatusBar, Text, Image, StyleSheet, Pressable, TouchableOpacity, DevSettings } from "react-native";
import { useI18N, useUserInfo } from "@/store/getter";
import LocalPictures from "@/common/Pictures";
import PosPayIcon from "@/components/PosPayIcon";

const styles = StyleSheet.create({
    accountBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 10,
        paddingTop: 20
    },
    accountAvatar: {
        width: 60,
        height: 60,
        borderRadius: 80,
        elevation: 5,
        marginRight: 10,
        overflow: "hidden",
        backgroundColor: "#fff"
    },
    actionGrid: {
        overflow: "hidden",
        width: (deviceDimensions.screenWidth / 2 - 15 - 4), /* 减去 左外边距，再减去 左外边距 */
        marginTop: 8, /* 上下外边距 */
        borderRadius: 8,
        elevation: 0
    },
    actionLeft: {
        marginRight: 8,/* 左右外边距 */
    },
    actionItem: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F6F1EE",
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    actionItem1: {
        backgroundColor: "#EFEFEF",
    },
    sectionTitle: {
        marginTop: 15,
        fontSize: 18
    }
});

const actionList1 = [
    {
        i18nName: "drawer.sale",
        iconName: "sale-flag",
        pageName: "订单列表"
    },
    {
        i18nName: "drawer.returns",
        iconName: "return-goods",
        pageName: "订单退款"
    },
    {
        i18nName: "print",
        iconName: "printing",
        pageName: "订单打印"
    },
    {
        i18nName: "statistics",
        iconName: "sub-total",
        pageName: "订单统计"
    }
];
const actionList2 = [
    {
        i18nName: "customer.display",
        iconName: "customer-display",
        pageName: "顾客屏幕",
    },
    {
        i18nName: "setting",
        iconName: "system-setting",
        pageName: "设置页"
    },
    {
        i18nName: "print.items",
        iconName: "printer-stroke",
        pageName: "打印设置",
    },
    {
        i18nName: "drawer.helps",
        iconName: "help-stroke",
        pageName: "帮助页"
    }
];

export default function MineIndex(props){
    const i18n = useI18N();
    const userInfo = useUserInfo();
    const [userAvatar, setUserAvatar] = useState(LocalPictures.defaultUserAvatar);
    
    const restartApp = () => {
        DevSettings.reload();
    }
    const gotoMyAccount = () => {
        props.navigation.navigate("我的账户")
    }
    const onLoadAvatarError = () => {
        setUserAvatar(LocalPictures.loadingPicError);
    }
    const onActionPress = (pn) => {
        if(pn){
            props.navigation.navigate(pn);
        } else {
            $toast(i18n["unimplemented.tip"]);
        }
    }
    
    useEffect(() => {
        if(userInfo.posLogo){
            setUserAvatar({ uri: userInfo.posLogo });
        }
    }, [userInfo]);
    
    return (
        <ScrollView style={pgFF} contentContainerStyle={pdX}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <TouchableOpacity style={styles.accountBox} activeOpacity={0.8} onPress={gotoMyAccount}>
                <View style={styles.accountAvatar}>
                    <Image style={whF} source={userAvatar} onError={onLoadAvatarError} resizeMode="contain" />
                </View>
                <View style={fxG1}>
                    <Text style={fs16}>{userInfo.posName}</Text>
                    <Text style={[fs10, tc99]}>{userInfo.posAddress}</Text>
                </View>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>{i18n["business"]}</Text>
            <View style={[fxR, fxWP]}>
                {actionList1.map((vx, ix) => (
                    <View key={vx.i18nName} style={[styles.actionGrid, (ix%2===0) && styles.actionLeft]}>
                        <Pressable android_ripple={tcCC} onPress={() => onActionPress(vx.pageName)} style={styles.actionItem}>
                            <PosPayIcon name={vx.iconName} color={appMainColor} size={24} offset={-10} />
                            <Text style={[fxG1, fs16]} numberOfLines={1}>{i18n[vx.i18nName]}</Text>
                        </Pressable>
                    </View>
                ))}
            </View>
            <Text style={styles.sectionTitle}>{i18n["system"]}</Text>
            <View style={[fxR, fxWP]}>
                {actionList2.map((vx, ix) => (
                    <View key={vx.i18nName} style={[styles.actionGrid, (ix%2===0) && styles.actionLeft]}>
                        <Pressable android_ripple={tcCC} onPress={() => onActionPress(vx.pageName)} style={[styles.actionItem, styles.actionItem1]}>
                            <PosPayIcon name={vx.iconName} color={appMainColor} size={24} offset={-10} />
                            <Text style={[fxG1, fs16]} numberOfLines={1}>{i18n[vx.i18nName]}</Text>
                        </Pressable>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}