import { ScrollView, View, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import GradientButton from "@/components/GradientButton";
import AppPackageInfo from "@/modules/AppPackageInfo";
import LocalPictures from "@/common/Pictures";
import ImageX from "@/components/ImageX";

const styles = StyleSheet.create({
    picBox: {
        width: (deviceDimensions.screenWidth - 30) * 0.68,
        marginHorizontal: (deviceDimensions.screenWidth - 30) * 0.16,
        backgroundColor: "#f0f0f0",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#999"
    }
});

export default function SettingAutoLaunch(props){
    const i18n = useI18N();
    
    const gotoSettingActivity = () => {
        AppPackageInfo.gotoAutoLaunchSettingActivity().catch(err => {
            $alert(err.message);
        });
    }
    
    return (
        <ScrollView style={pgFF} contentContainerStyle={[pdHX, mhF]}>
            <View style={fxG1}>{/* 占位用 */}</View>
            <ImageX src={LocalPictures.autoLaunchTrick} style={styles.picBox} />
            <View style={fxG1}>{/* 占位用 */}</View>
            <GradientButton onPress={gotoSettingActivity} style={mgBS}>{i18n["setting.now"]}</GradientButton>
        </ScrollView>
    );
}