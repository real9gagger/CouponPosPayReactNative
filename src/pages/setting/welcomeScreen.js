import { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import ImagePicker from "react-native-image-crop-picker";
import GradientButton from "@/components/GradientButton";
import CustomerDisplay from "@/modules/CustomerDisplay";
import ImageButton from "@/components/ImageButton";

const IMG_BOX_WIDTH = deviceDimensions.screenWidth - 30;
const styles = StyleSheet.create({
    imgBox: {
        width: IMG_BOX_WIDTH,
        height: IMG_BOX_WIDTH * (480 / 800), //欢迎界面图片固定宽高：800 × 480像素
        elevation: 1,
        backgroundColor: "#fff"
    }
});

export default function SettingWelcomeScreen(props){
    const i18n = useI18N();
    const [wsSource, setWsSource] = useState(null);
    const [isPicChanged, setIsPicChanged] = useState(false);
    
    //选择相册照片
    const chooseAlbumPhoto = () => {
        ImagePicker.openPicker({
            width: 800,
            height: 480,
            compressImageQuality: 0.8, //图片质量
            cropping: true,
            mediaType: "photo",
            cropperStatusBarColor: "#000000", //必须六位hex数
            cropperToolbarTitle: i18n["cropping"]
        }).then(imageInfo => {
            if(!imageInfo){
                $alert(i18n["welcome.screen.errmsg1"]);
            } else if(imageInfo.size > 102400){// 100 * 1024 （最大支持 100kb 图像大小）
                $alert(i18n["welcome.screen.errmsg2"]);
            } else {
                setWsSource({uri: imageInfo.path });
                setIsPicChanged(true);
            }
        }).catch(err => {
            console.log("裁剪图片出现点小问题:::", err);
        });
    }
    const saveWsPhoto = () => {
        CustomerDisplay.changeWelcomeScreenPicture(wsSource.uri).then(res => {
            console.log("lllllllllllll", res);
            props.navigation.goBack();
        }).catch(console.log);
    }
    
    useEffect(() => {
        setWsSource(CustomerDisplay.getWelcomeScreenSource());
    }, []);
    
    return (
        <View style={[pgEE, pdX]}>
            <ImageButton source={wsSource} style={styles.imgBox} />
            <Text style={[fs14, taC, tcMC, pdS]}>800 × 480</Text>
            <View style={fxG1}>{/* 占位用 */}</View>
            {!isPicChanged ? 
                <GradientButton onPress={chooseAlbumPhoto}>{i18n["btn.change"]}</GradientButton> :
                <>
                    <Text style={[pdVS, taC, tcR0, fs12]}>{i18n["setting.apply.tip"]}</Text>
                    <GradientButton onPress={saveWsPhoto}>{i18n["btn.apply"]}</GradientButton>
                </>
            }
        </View>
    );
}