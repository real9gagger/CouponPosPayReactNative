import { ScrollView, View, Text, Button, StatusBar } from "react-native";

export default function TestIndex(props){
    
    const sendMsgCode = () => {
        console.log("准备发送短信验证码");
        $request("sendValidCode", {
            phone: "18249941545"
        }).then(res => console.log(res)).catch(err => console.warn(err))
    }
    
    return (
        <ScrollView style={pdX}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View style={pdHX}>
                <Text style={[fs30, taC, pdX]}>这是一个测试页面</Text>
            </View>
            <Button title="测试发送短信验证码" onPress={sendMsgCode} />
        </ScrollView>
    );
}