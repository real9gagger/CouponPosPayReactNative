import { useEffect, useRef } from "react";
import { ScrollView, View, Text, Button, StatusBar } from "react-native";
import { dispatchChangeLanguage } from "@/store/setter";
import { useI18N } from "@/store/getter";
import TextualButton from "@/components/TextualButton";

export default function MineIndex(props){
    const i18n = useI18N();
    const rrr = useRef(0);
    const hhhh = () => {
        dispatchChangeLanguage(rrr.current%2===0?"en_US":"zh_CN");
        rrr.current++;
    }
    const sendMsgCode = () => {
        console.log("准备发送短信验证码")
        $request("sendValidCode", {phone: "18249941545"})
        .then(res => console.log(res))
        .catch(err => console.warn(err))
    }
    
    useEffect(() => {
        //console.log(i18n);
    }, []);
    
    return (
        <ScrollView style={pdX}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <Text style={fs20}>{i18n["$copyright.info"].cloze("1.0.0", 2025)}</Text>
            <Text style={fs20}>{i18n["$development.test"].cloze(2023, 1, 7)}</Text>
            <Button title="切换语言" onPress={hhhh} style={{height: 40}} />
            <TextualButton style={mgTX} onPress={sendMsgCode}>测试发送短信验证码</TextualButton>
        </ScrollView>
    )
}