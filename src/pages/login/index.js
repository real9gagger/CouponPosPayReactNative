import { useEffect, useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, ActivityIndicator, Keyboard } from "react-native";
import { dispatchSetAccessToken, dispatchUpdateUserInfo } from "@/store/setter";
import { useI18N, getUserInfo } from "@/store/getter";
import GradientButton from "@/components/GradientButton";
import PosPayIcon from "@/components/PosPayIcon";
import AppPackageInfo from "@/modules/AppPackageInfo";

const LOGIN_BOX_WIDTH = Math.min(Math.round(deviceDimensions.screenWidth * 0.8), 400);
const COLOR_GREY = "#aaa";
const APP_VER = AppPackageInfo.getFullVersion();

const styles = StyleSheet.create({
    loginBox: {
        width: LOGIN_BOX_WIDTH,
        marginTop: (deviceDimensions.screenHeight * 0.125), //需要处理横屏的情况
        marginLeft: (deviceDimensions.screenWidth - LOGIN_BOX_WIDTH) / 2
    },
    loginTitle: {
        paddingBottom: 40,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    },
    loginSubmit: {
        marginTop: 30
    },
    inputWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#fff",
        marginBottom: 10,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: "#fff"
    },
    inputFocus: {
        borderColor: appMainColor
    },
    lgsBox: {
        marginTop: 40,
        padding: 10
    },
    verBox: {
        paddingVertical: 5,
        textAlign: "center",
        fontSize: 12,
        color: "#aaa"
    },
    autoLoginTip: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 99,
        paddingBottom: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    }
});

export default function LoginIndex(props){
    const i18n = useI18N();
    const [isAccountFocus, setIsAccountFocus] = useState(false);
    const [isPswdFocus, setIsPswdFocus] = useState(false);
    const [isPeekPswd, setIsPeekPswd] = useState(false);
    const [isSubmiting, setIsSubmiting] = useState(false);
    const [isAutoLogin, setIsAutoLogin] = useState(false);
    const [username, setUsername] = useState(getUserInfo("loginAccount"));
    const [password, setPassword] = useState(getUserInfo("loginPassword"));
    
    const onSubmit = (evt) => {
        if(isSubmiting){
            return; //正在提交，请耐心等待...
        }
        
        if(!username){
            return !$toast(i18n["login.errmsg1"]);
        }
        if(!password || password.length < 6){
            return !$toast(i18n["login.errmsg2"]);
        }
        
        if(evt === true){
            setIsAutoLogin(true);
        } else {
            setIsSubmiting(true);
            Keyboard.dismiss(); //收起键盘
        }
        
        //console.log("用户输入的账户密码：", username, password);
        $request("loginWithPassword", {username, password}).then(res => {
            dispatchSetAccessToken(res.access_token, res.expires_in, username, password);
            $request("getPostInfo").then(dispatchUpdateUserInfo); //登录成功后获取用户信息
            props.navigation.replace("应用首页");
        }).catch(err => {
            setIsSubmiting(false);
            setIsAutoLogin(false);
        });
    }
    
    const gotoLanguageSetting = () => {
        props.navigation.navigate("语言设置");
    }
    
    useEffect(() => {
        //如果已存在账户密码则自动登录
        if(username && password){
            onSubmit(true);
        }
        //(!username && setUsername("商户")); //测试专用！！！
    }, []);
    
    return (<>
        <ScrollView style={pgEE} contentContainerStyle={hiF} keyboardShouldPersistTaps="handled">
            <StatusBar backgroundColor={isAutoLogin ? "#FFF" : "#EEE"} barStyle="dark-content" />
            <View style={styles.loginBox}>
                <Text style={styles.loginTitle}>{i18n["app.alias"]}</Text>
                <View style={[styles.inputWrapper, isAccountFocus && styles.inputFocus]}>
                    <PosPayIcon name="login-account" color={isAccountFocus ? appMainColor: COLOR_GREY} size={20} />
                    <TextInput 
                        autoCorrect={false} 
                        autoComplete="off" 
                        textContentType="username"
                        maxLength={80}
                        cursorColor={appMainColor}
                        style={[pdLX, fxG1, fs16]}
                        placeholder={i18n["login.username"]}
                        onChangeText={setUsername}
                        defaultValue={username}
                        onFocus={() => setIsAccountFocus(true)}
                        onBlur={() => setIsAccountFocus(false)} />
                </View>
                <View style={[styles.inputWrapper, isPswdFocus && styles.inputFocus]}>
                    <PosPayIcon name="login-lock" color={isPswdFocus ? appMainColor: COLOR_GREY} size={20} />
                    <TextInput 
                        autoCorrect={false}
                        autoComplete="off" 
                        textContentType="password"
                        maxLength={40}
                        cursorColor={appMainColor}
                        style={[pdLX, fxG1, fs16]}
                        placeholder={i18n["login.password"]}
                        secureTextEntry={!isPeekPswd}
                        onChangeText={setPassword}
                        defaultValue={password}
                        onFocus={() => setIsPswdFocus(true)}
                        onBlur={() => setIsPswdFocus(false)} />
                    <PosPayIcon 
                        name={isPeekPswd ? "eye-open" : "eye-close"} 
                        color={isPeekPswd ? appMainColor: COLOR_GREY} 
                        size={20}
                        onPress={() => setIsPeekPswd(!isPeekPswd)} />
                </View>
                <GradientButton 
                    style={styles.loginSubmit} 
                    onPress={onSubmit} 
                    showLoading={isSubmiting}
                    disabled={isSubmiting}>{i18n["btn.login"]}</GradientButton>
            </View>
            <TouchableOpacity style={[fxHM, styles.lgsBox]} onPress={gotoLanguageSetting}>
                <PosPayIcon name="internationalization" color={appMainColor} size={16} offset={-6} />
                <Text style={tc99}>{i18n["app.lgname"]}</Text>
                <PosPayIcon name="right-arrow" color="#999" size={16} offset={3}/>
            </TouchableOpacity>
            <View style={fxG1}>{/* 占位用 */}</View>
            <Text style={styles.verBox}>v{APP_VER}</Text>
        </ScrollView>
        {isAutoLogin && <View style={styles.autoLoginTip}>
            <ActivityIndicator color={appMainColor} size={50} />
            <Text style={[fs14, tcMC, pdVX]}>{i18n["login.waiting"]}</Text>
        </View>}
    </>);
}