import { useEffect } from "react";
import { ScrollView, View, Text, Image, Button, StatusBar, StyleSheet, DevSettings, DeviceEventEmitter } from "react-native";
import LocalPictures from "@/common/Pictures";
import asyncStorage from "@react-native-async-storage/async-storage";
import AppPackageInfo from "@/modules/AppPackageInfo";
import ReceiptsPlus from "@/modules/ReceiptsPlus";
import CardReader from "@/modules/CardReader";

const styles = StyleSheet.create({
    btnBox: {
        marginTop: 20
    },
    imgBox: {
        width: 300,
        height: 500,
        marginHorizontal: (deviceDimensions.screenWidth - 300 - 30) / 2,
        marginTop: 5,
        marginBottom: 20
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
        //AppPackageInfo.appTestFunction();
        DevSettings.reload();
    }
    
    const showStorage = () => {
        //asyncStorage.getAllKeys().then(console.log);
        asyncStorage.getItem("persist:root").then(console.log);
    }
    
    const printTest = () => {
        ReceiptsPlus.printPaymentReceipts4SC({}).catch(console.log);
    }
    
    const cardReaderTest = () => {
        CardReader.startRead(0xFF0000);
    }
    
    useEffect(() => {
        const evt1000 = DeviceEventEmitter.addListener(CardReader.getEventName(), function(infos){
            console.log(infos);
        });
        
        return () => {
            evt1000.remove();
            CardReader.cancelRead();
        }
    });
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={pdX}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View><Text style={[fs20, taC, tcMC]}>请把要测试的功能放在这里</Text></View>
            <View style={styles.btnBox}><Button title="测试发送短信验证码" onPress={sendMsgCode} /></View>
            <View style={styles.btnBox}><Button title="重启应用" onPress={restartApp} /></View>
            <View style={styles.btnBox}><Button title="显示本地存储信息" onPress={showStorage} /></View>
            <View style={styles.btnBox}><Button title="打印测试" onPress={printTest} /></View>
            <View style={styles.btnBox}><Button title="读卡器测试" onPress={cardReaderTest} /></View>
            <View style={{height: 30}}>{/* 占位专用 */}</View>
            <Text style={[fs18, taC]}>测试专用优惠码</Text>
            <Image style={styles.imgBox} source={LocalPictures.couponCodeTest} resizeMode="contain" />
        </ScrollView>
    );
}