import { ScrollView, View, Text, Image, StatusBar, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import LocalPictures from "@/common/Pictures";
import AppPackageInfo from "@/modules/AppPackageInfo";
import PosPayIcon from "@/components/PosPayIcon"

const styles = StyleSheet.create({
    logoBox: {
        width: 80,
        height: 80,
        borderRadius: 80,
        marginTop: 60,
        backgroundColor: appMainColor
    },
    verBox1: {
        color: "#333",
        textAlign: "center",
        paddingVertical: 15,
        fontSize: 14
    },
    verBox2: {
        color: "#0a0",
        textAlign: "center",
        paddingVertical: 5,
        fontSize: 14
    },
    copyrightBox: {
        color: "#999",
        textAlign: "center",
        fontSize: 12
    }
});

export default function TestAboutSoftware(props){
    const i18n = useI18N();
    return (
        <ScrollView style={pgFF} contentContainerStyle={[pdX, fxC, fxAC, mhF]}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <Image source={LocalPictures.logoApp} style={styles.logoBox} />
            <Text style={styles.verBox1}>{AppPackageInfo.getAppName()} {AppPackageInfo.getFullVersion()}</Text>
            <View style={fxHC}>
                <Text style={styles.verBox2}>{i18n["version.latest.tip"]}</Text>
                <PosPayIcon name="check-confirm" color={styles.verBox2.color} size={16} offset={5} />
            </View>
            <Text style={fxG1}>{/* 占位专用 */}</Text>
            <Text style={styles.copyrightBox}>{i18n["copyright.info"]}</Text>
        </ScrollView>
    );
}