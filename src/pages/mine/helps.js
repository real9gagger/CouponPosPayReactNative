import { ScrollView, View, Image, Text, StatusBar, Pressable, StyleSheet, Linking } from "react-native";
import { useI18N } from "@/store/getter";
import LocalPictures from "@/common/Pictures";

const styles = StyleSheet.create({
    qrBox: {
        width: 180,
        height: 180,
        overflow: "hidden"
    },
    pressBox: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2
    },
    nodataBox: {
        lineHeight: 125,
        fontSize: 18,
        color: "#000",
        fontWeight: "bold",
        opacity: 0
    }
});

export default function MineHelps(props){
    const i18n = useI18N();
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
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={[fxC, fxAC, mhF]}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <Text style={styles.nodataBox}>{i18n["nodata"]}</Text>
            <View style={styles.qrBox}>
                <Pressable style={styles.pressBox} android_ripple={tcCC} onLongPress={onQRcodeLongPresss} />
                <Image source={LocalPictures.helpsQRcode} style={whF} />
            </View>
            <Text style={[pdX, taC, tc99, fs16]}>{i18n["more.help.tip"]}</Text>
        </ScrollView>
    );
}