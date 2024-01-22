import { useState, useRef } from "react";
import { ScrollView, View, Text, StatusBar, StyleSheet } from "react-native";
import { dispatchUpdateUserInfo } from "@/store/setter";
import { useI18N, useUserInfo } from "@/store/getter";
import GradientButton from "@/components/GradientButton";
import ImageButton from "@/components/ImageButton";
import LocalPictures from "@/common/Pictures";
import ImageView from "react-native-image-viewing";

const LOGIN_BOX_WIDTH = Math.min(Math.round(deviceDimensions.screenWidth * 0.8), 400);
const styles = StyleSheet.create({
    accountTitle: {
        paddingTop: 50,
        paddingBottom: 30,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    },
    accountAvatar: {
        width: 80,
        height: 80,
        borderRadius: 80,
        elevation: 5,
        overflow: "hidden"
    },
    accountName: {
        paddingTop: 10,
        fontSize: 16
    },
    logoutBox: {
        marginBottom: 50,
        width: LOGIN_BOX_WIDTH,
        marginLeft: (deviceDimensions.screenWidth - LOGIN_BOX_WIDTH) / 2
    }
});

export default function MineAccount(props){
    const i18n = useI18N();
    const userInfo = useUserInfo();
    const [userAvatar, setUserAvatar] = useState(userInfo.posLogo ? { uri: userInfo.posLogo } : LocalPictures.defaultUserAvatar);
    const [isLogout, setIsLogout] = useState(false);
    const [showImageView, setShowImageView] = useState(false);
        
    const onLogout = () => {
        if(isLogout){
            return; //正在退出，请耐心等待
        }
        
        $confirm(i18n["account.logout.tip"], i18n["alert.title"]).then(() => {
            setIsLogout(true);
            dispatchUpdateUserInfo(null);
            setTimeout(() => {
                props.navigation.reset({ //清空路由，并跳转到登录页
                    index: 0,
                    routes: [{ name: "登录页" }]
                });
            }, 1000);
        }).catch(err => {
            console.log("用户已取消登出");
        });
    }
    
    return (
        <ScrollView style={pgFF} contentContainerStyle={fxG1}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <View style={[fxC, fxAC, pdX]}>
                <Text style={styles.accountTitle}>{i18n["app.alias"]}</Text>
                <ImageButton 
                    onPress={() => setShowImageView(true)} 
                    onError={() => setUserAvatar(LocalPictures.loadingPicError)}
                    style={styles.accountAvatar} 
                    source={userAvatar} />
                <Text style={styles.accountName}>{userInfo.posName}</Text>
            </View>
            <View style={fxG1}>{/*占位用*/}</View>
            <View style={styles.logoutBox}>
                <GradientButton
                    onPress={onLogout} 
                    showLoading={isLogout}
                    disable={isLogout}>{i18n["btn.logout"]}</GradientButton>
            </View>
            <ImageView
                visible={showImageView}
                images={[userAvatar]}
                imageIndex={0}
                swipeToCloseEnabled={false}
                onRequestClose={() => setShowImageView(false)}
            />
        </ScrollView>
    );
}