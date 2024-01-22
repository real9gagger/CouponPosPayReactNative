import { useEffect, useState } from "react";
import { ScrollView, View, Text, TextInput, StatusBar, StyleSheet } from "react-native";
import { dispatchSetAccessToken, dispatchUpdateUserInfo } from "@/store/setter";
import { useI18N, getUserInfo } from "@/store/getter";
import GradientButton from "@/components/GradientButton";
import PosPayIcon from "@/components/PosPayIcon";

const LOGIN_BOX_WIDTH = Math.min(Math.round(deviceDimensions.screenWidth * 0.8), 400);
const COLOR_GREY = "#aaa";

const styles = StyleSheet.create({
    loginBox: {
        width: LOGIN_BOX_WIDTH,
        marginTop: (deviceDimensions.isLandscape ? 30 : deviceDimensions.screenHeight * 0.25), //需要处理横屏的情况
        marginLeft: (deviceDimensions.screenWidth - LOGIN_BOX_WIDTH) / 2
    },
    loginTitle: {
        paddingBottom: 50,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    },
    loginSubmit: {
        marginTop: 50
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
    }
});

export default function LoginIndex(props){
    const i18n = useI18N();
    const [isAccountFocus, setIsAccountFocus] = useState(false);
    const [isPswdFocus, setIsPswdFocus] = useState(false);
    const [isPeekPswd, setIsPeekPswd] = useState(false);
    const [isSubmiting, setIsSubmiting] = useState(false);
    const [username, setUsername] = useState(getUserInfo("loginAccount"));
    const [password, setPassword] = useState(getUserInfo("loginPassword"));
    
    const onSubmit = () => {
        if(isSubmiting){
            return; //正在提交，请耐心等待...
        }
        
        if(!username){
            return !$notify.error(i18n["login.errmsg1"]);
        }
        if(!password || password.length < 4){
            return !$notify.error(i18n["login.errmsg2"]);
        }
        
        setIsSubmiting(true);
        
        //console.log("用户输入的账户密码：", username, password);
        $request("loginWithPassword", {username, password}).then(res => {
            dispatchSetAccessToken(res.access_token, res.expires_in, username, password);
            $request("getPostInfo").then(dispatchUpdateUserInfo); //登录成功后获取用户信息
            props.navigation.replace("应用首页");
        }).catch(err => {
            setIsSubmiting(false);
        });
    }
    
    useEffect(() => {
        //如果已存在账户密码则自动登录
        if(username && password){
            onSubmit();
        }
    }, []);
    
    return (
        <ScrollView style={pgEE}>
            <StatusBar backgroundColor="#eee" barStyle="dark-content" />
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
                    disable={isSubmiting}>{i18n["btn.login"]}</GradientButton>
            </View>
        </ScrollView>
    );
}