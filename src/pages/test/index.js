import { ScrollView, View, Text, Image, Button, StatusBar, StyleSheet } from "react-native";
import LocalPictures from "@/common/Pictures";

const styles = StyleSheet.create({
    btnBox: {
        marginTop: 30
    },
    imgBox: {
        width: 300,
        height: 500,
        marginHorizontal: (deviceDimensions.screenWidth - 300 - 30) / 2,
        marginTop: 10,
        marginBottom: 30
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
            <View style={{height: 200}}>{/* 占位专用 */}</View>
            <Text style={[fs18, taC]}>测试专用优惠码</Text>
            <Image style={styles.imgBox} source={LocalPictures.couponCodeTest} resizeMode="contain" />
        </ScrollView>
    );
}