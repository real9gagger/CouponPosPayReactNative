import { useEffect, useRef } from "react";
import { ScrollView, View, Text, Button, StatusBar, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import ImageButton from "@/components/ImageButton";
import PayKeyboard from "@/components/PayKeyboard";
import LocalPictures from "@/common/Pictures";

const styles = StyleSheet.create({
    headerBox: {
        height: 56
    },
    toggleIcon: {
        position: "absolute",
        left: 11,
        top: 13,
        height: 30,
        width: 30,
        padding: 3,
        overflow: "hidden"
    }
});

export default function IndexHome(props){
    const i18n = useI18N();
    const rrr = useRef(0);
    const hhhh = () => {        
        props.navigation.navigate("语言设置")
    }
    
    const testModal = () => {
        rrr.current++;
        
        $notify.success("已提交");
        console.log("xxxxxxx关闭了", rrr.current);
    }
    
    
    const openDrawer = () => {
        props.navigation.openDrawer();
    }
    
    useEffect(() => {
        //console.log();
    }, []);
    
    return (
        <View style={fxG1}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View style={[fxVM, styles.headerBox]}>
                <ImageButton source={LocalPictures.iconToggleDrawer} style={styles.toggleIcon} onPress={openDrawer} />
                <Text style={[taC,fs20]}>{i18n["tabbar.home"]}</Text>
            </View>
            <ScrollView style={[fxG1, pdX]}>
                <Text style={fs20}>{i18n["copyright.info"].cloze("1.0.0", 2025)}</Text>
                <Text style={fs20}>{i18n["development.test"].cloze(2023, 1, 7)}</Text>
                <Button title="切换语言" onPress={hhhh} style={{height: 40}} />
                <Button title="测试弹窗" onPress={testModal} />
                <View style={{height: 40}}></View>
                <Button title="打开抽屉" onPress={openDrawer} />
            </ScrollView>
            <PayKeyboard precision={3} />
            <View style={{height:20}}></View>
        </View>
    );
}