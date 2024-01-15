import { useEffect, useRef } from "react";
import { ScrollView, View, Text, Button, StatusBar } from "react-native";
import { useI18N } from "@/store/getter";
import TextualButton from "@/components/TextualButton";
import { showConfirm } from "@/common/Modals";

export default function IndexHome(props){
    const i18n = useI18N();
    const rrr = useRef(0);
    const hhhh = () => {
        rrr.current++;
        
        props.navigation.navigate("语言设置")
    }
    const sendMsgCode = () => {
        $confirm("发送验证码").then(() => {
            $request("sendValidCode", {phone: "18249941545"})
            .then(res => console.log(res))
            .catch(err => console.warn(err))
        }).catch(err => {
            $toast("已取消发送");
        });
    }
    
    const testModal = () => {
        $notify.success("已提交").then(res => {
            console.log("xxxxxxx关闭了", res);
        });
    }
    
    
    useEffect(() => {
        //console.log();
    }, []);
    
    return (
        <ScrollView style={pdX}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <Text style={fs20}>{i18n["copyright.info"].cloze("1.0.0", 2025)}</Text>
            <Text style={fs20}>{i18n["development.test"].cloze(2023, 1, 7)}</Text>
            <Button title="切换语言" onPress={hhhh} style={{height: 40}} />
            <TextualButton style={mgVX} onPress={sendMsgCode}>测试发送短信验证码</TextualButton>
            <Button title="测试弹窗" onPress={testModal} style={{height: 40}} />
        </ScrollView>
    )
}