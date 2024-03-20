import { useState } from "react";
import { ScrollView, TouchableHighlight, TouchableOpacity, View, Text, StatusBar, StyleSheet, Modal } from "react-native";
import { useI18N, useFailedOrders } from "@/store/getter";
import { formatDate } from "@/utils/helper";
import GradientButton from "@/components/GradientButton";

const styles = StyleSheet.create({
    itemBox: {
        padding: 10,
        borderRadius: 10,
        overflow: "hidden"
    },
    maskBox: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    contentBox: {
        position: "absolute",
        top: "5%",
        left: "5%",
        width: "90%",
        height: "90%",
        borderRadius: 10,
        padding: 15,
        backgroundColor: "#fff",
        overflow: "hidden"
    },
    fieldBox: {
        display: "flex",
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomColor: "#e0e0e0",
        borderBottomWidth: StyleSheet.hairlineWidth
    }
});

//同步失败的订单数据
export default function OrderSynchronizeFailed(props){
    const i18n = useI18N();
    const failedOrders = useFailedOrders();
    const [selOrder, setSelOrder] = useState(null);
    
    const hideModalBox = () => {
        setSelOrder(null);
    }
    const onItemPress = (ooo) => {
        return function(){
            setSelOrder(ooo);
        }
    }
    const onItemLongPress = (ooo) => {
        return function(){
            $confirm("确认删除吗？").then(res => {
                
            });
        }
    }
    
    return (<>
        <ScrollView style={pgFF} contentContainerStyle={{padding: 5}}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            {failedOrders.map(vx => (
                <TouchableHighlight key={vx.__fid} style={styles.itemBox} underlayColor="#eee" onPress={onItemPress(vx)} onLongPress={onItemLongPress(vx)}>
                    <View>
                        <View style={fxHC}>
                            <Text style={[fs14, fxG1, fwB]}>{vx.__apiName}</Text>
                            <Text style={[fs12, tc99]}>NO.{vx.__fid}</Text>
                        </View>
                        <Text style={[fs12, tc99]}>{i18n["order.try.times"].cloze(vx.__tryTimes)} / {formatDate(vx.__postTimestamp)}</Text>
                        <Text style={[fs12, tcO0]} numberOfLines={1}>{vx.__errorMessage}</Text>
                    </View>
                </TouchableHighlight>
            ))}
        </ScrollView>
        <Modal
            visible={!!selOrder} 
            presentationStyle="overFullScreen" 
            animationType="fade" 
            statusBarTranslucent={true}
            hardwareAccelerated={true}
            transparent={true}
            onRequestClose={hideModalBox}>
            <TouchableOpacity style={styles.maskBox} activeOpacity={1} onPress={hideModalBox}>{/* 遮罩层 */}</TouchableOpacity>
            <View style={styles.contentBox}>
                <Text style={[fs16, taC, fwB, mgBX]}>{i18n["details"]}</Text>
                <ScrollView style={fxG1}>
                    {Object.keys(selOrder || {}).map(vx =>
                        <View key={vx} style={styles.fieldBox}>
                            <Text style={[fs12, fwB]}>{vx}</Text>
                            <Text style={[fs12, fxG1, pdLS, taR]}>{selOrder[vx]}</Text>
                        </View>
                    )}
                </ScrollView>
                <View style={[fxHC, mgTS]}>
                    <GradientButton style={fxG1} onPress={hideModalBox}>{i18n["btn.cancel"]}</GradientButton>
                    <GradientButton style={[fxG1, mgLS]}>{i18n["btn.synchronous"]}</GradientButton>
                </View>
            </View>
        </Modal>
    </>)
}