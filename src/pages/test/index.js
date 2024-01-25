import { ScrollView, View, Text, Button, StatusBar, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    btnBox: {
        marginTop: 30
    }
});

export default function TestIndex(props){
    
    const sendMsgCode = () => {
        const phone = "18249941545";
        $confirm("发送验证码给：" + phone).then(() => {
            $request("sendValidCode", { phone }).then(res => {
                console.log(res);
                $toast("验证码已发送，请注意查收");
            }).catch(err => {
                console.warn(err)
                $toast("发送失败");
            });
        }).catch(err => {
            $toast("已取消发送");
        });
    }
    
    const gotoDevinfo = () => {
        props.navigation.navigate("设备信息");
    }
    
    return (
        <ScrollView style={pdX}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View><Text style={[fs20, taC, tcMC]}>请把要测试的功能放在这里</Text></View>
            <View style={styles.btnBox}><Button title="测试发送短信验证码" onPress={sendMsgCode} /></View>
            <View style={styles.btnBox}><Button title="查看设备信息" onPress={gotoDevinfo} /></View>
        </ScrollView>
    );
}