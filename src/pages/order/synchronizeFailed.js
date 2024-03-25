import { useState } from "react";
import { ScrollView, TouchableHighlight, Animated, Easing, TouchableOpacity, View, Text, StatusBar, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { useI18N, useFailedOrders, checkIsSyncingAll, useIsSyncingAll } from "@/store/getter";
import { dispatchRemoveFailedOrder, dispatchUpdateFailedOrder, dispatchSynchronousAllOrder } from "@/store/setter";
import { formatDate } from "@/utils/helper";
import GradientButton from "@/components/GradientButton";
import PosPayIcon from "@/components/PosPayIcon";

const styles = StyleSheet.create({
    itemBox: {
        borderRadius: 10,
        marginBottom: 1,
        overflow: "hidden"
    },
    maskBox: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)"
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
        overflow: "hidden",
        elevation: 10
    },
    fieldBox: {
        display: "flex",
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomColor: "#e0e0e0",
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    activatedBox: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: "rgba(255, 0, 0, 0.25)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    delete1Box: {
        width: "33%",
        marginHorizontal: 20,
        color: "#333",
        elevation: 2
    },
    delete2Box: {
        width: "33%",
        marginHorizontal: 20,
        color: "#f00",
        elevation: 2
    },
    text99Box: {
        fontSize: 12,
        color: "#999"
    },
    syncBox: {
        position: "absolute",
        bottom: 10,
        right: 10,
        zIndex: 9,
        width: 45,
        height: 45,
        borderRadius: 45,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appMainColor
    }
});

const whiteBtnLg = ["#fff", "#fff"];

//执行同步全部数据
function doSynchronousAll(orders){
    if(!orders?.length){
        console.log("同步订单数据完成...");
        return !dispatchSynchronousAllOrder(false); //同步完毕！！！
    }
    
    if(checkIsSyncingAll()){
        const firstOne = orders.shift();
        if(!firstOne.__isSyncing){
            console.log("正在同步订单数据:::", firstOne.__fid);
            
            dispatchUpdateFailedOrder(firstOne.__fid, firstOne.__errorMessage, true); //更新订单为正在同步的状态...
            
            delete firstOne.__errorMessage; //提交前删除过长的文本消息
            
            $request(firstOne.__apiName, firstOne).then(res => {
                dispatchRemoveFailedOrder(firstOne.__fid);
                setTimeout(doSynchronousAll, 500, orders);
            }).catch(err => {
                dispatchUpdateFailedOrder(firstOne.__fid, err, false); //还是同步失败，则更新信息
                setTimeout(doSynchronousAll, 500, orders);
            });
        } else {
            console.log("订单数据正在同步，已跳过:::", firstOne.__fid);
            doSynchronousAll(orders);
        }
    } else {
        console.log("同步订单数据已取消...");
    }
}

function tryToString(val){
    if(!val && val !== false && val !== 0){
        return "[NULL]";
    }
    return val.toString();
}

//同步失败的订单数据
export default function OrderSynchronizeFailed(props){
    const i18n = useI18N();
    const failedOrders = useFailedOrders();
    const isSyAll = useIsSyncingAll();
    const saBoxStyle = {};
    const [selOrder, setSelOrder] = useState(null);
    const [activatedIndex, setActivatedIndex] = useState(-1);
    
    if(isSyAll){
        const loopingZ = new Animated.Value(0); //绕 Z 轴旋转
        saBoxStyle.transform = [{
            rotateZ: loopingZ.interpolate({
                inputRange: [0, 360],
                outputRange: ["0deg", "360deg"]
            })
        }];
        
        Animated.loop(Animated.timing(loopingZ, {
            toValue: 360,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.linear
        })).start(); //绕 Z 轴旋转的动画（无限循环）
    }
    
    const hideModalBox = () => {
        setSelOrder(null);
    }
    const onItemPress = (ooo) => {
        return function(){
            setSelOrder(ooo);
        }
    }
    const onItemLongPress = (nth) => {
        return function(){
            setActivatedIndex(nth);
        }
    }
    const onItemDelete = () => {
        $confirm(i18n["order.failed.delete.tip"]).then(() => {
            $attention(i18n["delete.confirm"], i18n["btn.delete"]).then(() => {
                if(activatedIndex >= 0){
                    dispatchRemoveFailedOrder(failedOrders[activatedIndex].__fid);
                    setActivatedIndex(-1);
                }
            }).catch(() => setActivatedIndex(-1));
        }).catch(() => setActivatedIndex(-1));
    }
    const onSynchronousOne = () => {
        if(!isSyAll || selOrder.__isSyncing){
            return; //防止重复点同步
        }
        
        const fid = selOrder.__fid;
        
        dispatchUpdateFailedOrder(fid, selOrder.__errorMessage, true); //更新订单为正在同步的状态...
        
        delete selOrder.__errorMessage; //提交前删除过长的文本消息
        
        $request(selOrder.__apiName, selOrder).then(res => {
            setTimeout(dispatchRemoveFailedOrder, 500, fid); //同步成功，删除缓存数据
            $toast(i18n["synchronous.success"]);
        }).catch(err => {
            setTimeout(dispatchUpdateFailedOrder, 500, fid, err, false); //如果还是同步失败，则更新信息
        });
        
        setSelOrder(null);
    }
    const onSynchronousAll = () => {
        if(!isSyAll){
            dispatchSynchronousAllOrder(true);
            doSynchronousAll(JSON.parse(JSON.stringify(failedOrders))); //深度复制一份
        } else {
            dispatchSynchronousAllOrder(false);
        }
    }
    
    return (<>
        <ScrollView style={pgFF} contentContainerStyle={{padding: 5}}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            {failedOrders.map((vx, ix) => (
                <TouchableHighlight key={vx.__fid} style={styles.itemBox} underlayColor="#eee" onPress={onItemPress(vx)} onLongPress={onItemLongPress(ix)}>
                    <View style={pdS}>
                        <View style={fxHC}>
                            <Text style={[fs14, fxG1, fwB]}>{vx.__apiName}</Text>
                            <Text style={styles.text99Box}>NO.{vx.__fid}</Text>
                        </View>
                        <Text style={styles.text99Box}>{i18n["order.try.times"].cloze(vx.__tryTimes)} / {formatDate(vx.__postTimestamp)}</Text>
                        {vx.__isSyncing ?
                            <View style={fxHC}><ActivityIndicator color={appMainColor} size={14} /><Text style={[fs12, tcMC]}>&nbsp;{i18n["syncing"]}</Text></View>
                        :(isSyAll ? 
                            <View style={fxHC}><PosPayIcon name="clock-ready" size={14} color={appMainColor} /><Text style={[fs12, tcMC]}>&nbsp;{i18n["synchronous.ready"]}</Text></View>:
                            <Text style={[fs12, tcO0]} numberOfLines={1}>{vx.__errorMessage}</Text> 
                        )}
                        {activatedIndex===ix &&
                            <View style={styles.activatedBox}>
                                <GradientButton style={styles.delete2Box} lgColors={whiteBtnLg} onPress={onItemDelete}>{i18n["btn.delete"]}</GradientButton>
                                <GradientButton style={styles.delete1Box} lgColors={whiteBtnLg} onPress={onItemLongPress(-1)}>{i18n["btn.cancel"]}</GradientButton>
                            </View>
                        }
                    </View>
                </TouchableHighlight>
            ))}
            {failedOrders.length ? 
                <Text style={[pdX, taC, tc99, fs14]}>{i18n["how.many.items"].cloze(failedOrders.length)}</Text> :
                <Text style={[pdX, taC, tc99, fs18]}>{i18n["nodata"]}</Text>
            }
        </ScrollView>
        {!!failedOrders.length && 
            <TouchableOpacity style={styles.syncBox} activeOpacity={0.5} onPress={onSynchronousAll}>
                <Animated.View style={saBoxStyle}><PosPayIcon name="synchronous" size={22} color="#fff" /></Animated.View>
            </TouchableOpacity>
        }
        <Modal
            visible={!!selOrder} 
            presentationStyle="overFullScreen" 
            animationType="fade" 
            statusBarTranslucent={true}
            hardwareAccelerated={true}
            transparent={true}
            onRequestClose={hideModalBox}>
            <TouchableOpacity style={styles.maskBox} activeOpacity={1} onPress={hideModalBox}>{/* 遮罩层 */}</TouchableOpacity>
            {!!selOrder && <View style={styles.contentBox}>
                <Text style={[fs16, taC, fwB, mgBX]}>{i18n["details"]}</Text>
                <ScrollView style={fxG1}>
                    {Object.keys(selOrder).map(vx =>
                        <View key={vx} style={styles.fieldBox}>
                            <Text style={[fs12, fwB]}>{vx}</Text>
                            <Text style={[fs12, fxG1, pdLS, taR]}>{tryToString(selOrder[vx])}</Text>
                        </View>
                    )}
                </ScrollView>
                <View style={[fxHC, mgTS]}>
                    <GradientButton style={fxG1} onPress={hideModalBox}>{i18n["btn.cancel"]}</GradientButton>
                    <GradientButton style={[fxG1, mgLS]} disabled={selOrder.__isSyncing} onPress={onSynchronousOne}>{i18n[selOrder.__isSyncing ? "syncing" : "btn.synchronous"]}</GradientButton>
                </View>
            </View>}
        </Modal>
    </>)
}