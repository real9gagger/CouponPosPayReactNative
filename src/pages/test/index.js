import { ScrollView, View, Text, Image, Button, StatusBar, StyleSheet, DevSettings } from "react-native";
import LocalPictures from "@/common/Pictures";
import CustomerDisplay from "@/modules/CustomerDisplay";

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
    
    const restartApp = () => {
        DevSettings.reload();
    }
    
    const showCD = () => {
        CustomerDisplay.showPayAmountInfo(100, 0, 10, 90);
    }
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={pdX}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View><Text style={[fs20, taC, tcMC]}>请把要测试的功能放在这里</Text></View>
            <View style={styles.btnBox}><Button title="测试发送短信验证码" onPress={sendMsgCode} /></View>
            <View style={styles.btnBox}><Button title="重启应用" onPress={restartApp} /></View>
            <View style={styles.btnBox}><Button title="显示副屏" onPress={showCD} /></View>
            <View style={styles.btnBox}><Button title="关闭副屏" onPress={CustomerDisplay.turnoff} /></View>
            <View style={{height: 30}}>{/* 占位专用 */}</View>
            <Text style={[fs18, taC]}>测试专用优惠码</Text>
            <Image style={styles.imgBox} source={LocalPictures.couponCodeTest} resizeMode="contain" />
        </ScrollView>
    );
}