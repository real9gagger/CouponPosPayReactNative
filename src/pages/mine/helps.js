import { ScrollView, View, TouchableOpacity, Image, Text, StatusBar, Pressable, StyleSheet, Linking } from "react-native";
import { useI18N, hasFailedOrders, hasAppErrorInfo } from "@/store/getter";
import LocalPictures from "@/common/Pictures";
import PosPayIcon from "@/components/PosPayIcon";

const styles = StyleSheet.create({
    qrBox: {
        width: 180,
        height: 180
    },
    pressBox: {
        position: "absolute",
        top: 0,
        left: (deviceDimensions.screenWidth - 180) / 2,
        width: 180,
        height: 180,
        zIndex: 9
    },
    itemBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 15
    },
    itemContainer: {
        marginHorizontal: 10,
        marginTop: 5,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#fff",
    },
    redDot: {
        color: "#f00",
        fontSize: 8
    }
});

export default function MineHelps(props){
    const i18n = useI18N();
    const hasFO = hasFailedOrders();
    const hasEI = hasAppErrorInfo();
    
    const onQRcodeLongPresss = () => {
        const theURL = "https://qa.smbc-card.com/kamei/steradev";
        Linking.canOpenURL(theURL).then(res => {
            if(res){
                Linking.openURL(theURL);
            } else {//不支持打开链接
                $notify.info(i18n["more.help.errmsg1"]);
            }
        }).catch(err => {
            $notify.info(i18n["more.help.errmsg1"]);
        });
    }
    const gotoSyncFailed = () => {
        props.navigation.navigate("问题订单");
    }
    const gotoErrorLog = () => {
        props.navigation.navigate("软件错误日志");
    }
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={mhF}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View style={{height: 5}}></View>
            <View style={styles.itemContainer}>
                <TouchableOpacity style={styles.itemBox} activeOpacity={0.5} onPress={gotoSyncFailed}>
                    <Text style={[fxG1, fs16]}>{i18n["order.failed.sync"]}</Text>
                    <Text style={hasFO ? styles.redDot : dpN}>●</Text>
                    <PosPayIcon name="right-arrow" color="#aaa" size={20} />
                </TouchableOpacity>
            </View>
            <View style={styles.itemContainer}>
                <TouchableOpacity style={styles.itemBox} activeOpacity={0.5} onPress={gotoErrorLog}>
                    <Text style={[fxG1, fs16]}>{i18n["error.view"]}</Text>
                    <Text style={hasEI ? styles.redDot : dpN}>●</Text>
                    <PosPayIcon name="right-arrow" color="#aaa" size={20} />
                </TouchableOpacity>
            </View>
            <View style={[fxVM, {marginTop: 100}]}>
                <Pressable style={styles.pressBox} android_ripple={tcCC} onLongPress={onQRcodeLongPresss} />
                <Image source={LocalPictures.helpsQRcode} style={styles.qrBox} />
                <Text style={[pdS, tc99, fs14]}>{i18n["more.help.tip"]}</Text>
            </View>
        </ScrollView>
    );
}