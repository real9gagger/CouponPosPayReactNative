import { useState } from "react";
import { ScrollView, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useI18N, useAddedList } from "@/store/getter";
import { dispatchDeleteAddedCoupon, dispatchSetLastUsed } from "@/store/setter";
import { DISCOUNT_TYPE_LJ } from "@/common/Statics";
import { formatDate } from "@/utils/helper";
import GradientButton from "@/components/GradientButton";

const styles = StyleSheet.create({
    itemBox: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        overflow: "hidden"
    },
    fs10TC99: {
        fontSize: 10,
        color: "#999"
    },
    codeText: {
        flex: 1,
        fontSize: 10,
        color: "#999"
    },
    useBtn: {
        position: "absolute",
        right: 10,
        top: 10,
        zIndex: 1,
        width: 80,
        height: 34,
        borderRadius: 40,
        fontSize: 12
    },
    deleteBox: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        zIndex: 9,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    deleteBtn1: {
        width: "33%",
        marginHorizontal: 20,
        color: "#333"
    },
    deleteBtn2: {
        width: "33%",
        marginHorizontal: 20,
        color: "#f00"
    },
});
const whiteBtnLg = ["#fff", "#fff"];

export default function CouponShopCoupons(props){
    const i18n = useI18N();
    const couponList = useAddedList();
    const [activatedIndex, setActivatedIndex] = useState(-1);
    
    const onItemLongPress = (nth) => {
        return function(){
            setActivatedIndex(nth);
        }
    }
    const onItemDelete = () => {
        $attention(i18n["delete.confirm"], i18n["btn.delete"]).then(() => {
            if(activatedIndex >= 0){
                dispatchDeleteAddedCoupon(couponList[activatedIndex].cpcode);
                setActivatedIndex(-1);
            }
        }).catch(() => setActivatedIndex(-1));
    }
    const onUseCoupon = (info) => {
        return function(){
            dispatchSetLastUsed(info);
            props.route.params?.onGoBack(info);
            props.navigation.goBack();
        }
    }
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={pdS}>
            {(couponList && couponList.length) ? couponList.map((vxo, ixo) => 
                <TouchableOpacity key={vxo.createtime} style={styles.itemBox} activeOpacity={0.6} onLongPress={onItemLongPress(ixo)}>
                    <Text style={[fs14, fwB]}>{vxo.title}</Text>
                    <Text style={styles.fs10TC99}>{vxo.expiration}</Text>
                    <Text style={[fs10, tcG0]}>{i18n[vxo.distype===DISCOUNT_TYPE_LJ ? "coupon.reduction" : "coupon.off"].cloze(vxo.condition, vxo.discount)}</Text>
                    <Text style={styles.fs10TC99}>PC.{vxo.ptcode}</Text>
                    <View style={fxHC}>
                        <Text style={styles.codeText}>NO.{vxo.cpcode}</Text>
                        <Text style={styles.fs10TC99}>{formatDate(vxo.createtime)}</Text>
                    </View>
                    <GradientButton style={styles.useBtn} lgToRight={true} onPress={onUseCoupon(vxo)}>{i18n["btn.use"]}</GradientButton>
                    {activatedIndex===ixo &&
                        <View style={styles.deleteBox}>
                            <GradientButton style={styles.deleteBtn2} lgColors={whiteBtnLg} onPress={onItemDelete}>{i18n["btn.delete"]}</GradientButton>
                            <GradientButton style={styles.deleteBtn1} lgColors={whiteBtnLg} onPress={onItemLongPress(-1)}>{i18n["btn.cancel"]}</GradientButton>
                        </View>
                    }
                </TouchableOpacity>) : 
                <Text style={[fs16, tc99, pdX, taC]}>{i18n["nodata"]}</Text>
            }
        </ScrollView>
    )
}