import { useState } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import { DISCOUNT_TYPE_ZK } from "@/common/Statics";
import GradientButton from "@/components/GradientButton";
import RadioBox from "@/components/RadioBox";
import DatePicker from "react-native-date-picker";

const styles = StyleSheet.create({
    itemBox: {
        marginTop: 10
    },
    inputBox: {
        borderBottomColor: "#666",
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingVertical: 5,
        paddingHorizontal: 0,
        fontSize: 16
    },
    typeBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        borderBottomColor: "#666",
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingVertical: 4.25
    }
});

export default function CouponAdds(props){
    const i18n = useI18N();
    const [couponTitle, setCouponTitle] = useState(""); //优惠券名称
    const [couponCode, setCouponCode] = useState("");//优惠码
    const [couponType, setCouponType] = useState(1); //1-折扣，2-立减
    const [couponDiscount, setCouponDiscount] = useState("");//优惠金额或者比例
    const [couponCondition, setCouponCondition] = useState("");//生效条件
    const [couponExpiration, setCouponExpiration] = useState("");//有效期至
    
    return (
        <ScrollView style={pgEE} contentContainerStyle={[mhF, pdHX]}>
            <View style={styles.itemBox}>
                <Text style={fs12}>优惠券名称</Text>
                <TextInput style={styles.inputBox} defaultValue={couponTitle} onChangeText={setCouponTitle} />
            </View>
            <View style={styles.itemBox}>
                <Text style={fs12}>优惠码</Text>
                <TextInput style={styles.inputBox} defaultValue={couponCode} onChangeText={setCouponCode} />
            </View>
            <View style={styles.itemBox}>
                <Text style={fs12}>优惠券类型</Text>
                <View style={styles.typeBox}>
                    <RadioBox size={18} label="折扣" checked={couponType===DISCOUNT_TYPE_ZK} onPress={()=>setCouponType(1)} />
                    <RadioBox size={18} label="立减" checked={couponType!==DISCOUNT_TYPE_ZK} onPress={()=>setCouponType(2)} style={{marginLeft: 40}} />
                </View>
            </View>
            <View style={styles.itemBox}>
                <Text style={fs12}>{couponType===DISCOUNT_TYPE_ZK ? "折扣比例" : "立减金额"}</Text>
                <TextInput style={styles.inputBox} keyboardType="number-pad" defaultValue={couponDiscount} onChangeText={setCouponDiscount} />
            </View>
            <View style={styles.itemBox}>
                <Text style={fs12}>生效条件</Text>
                <TextInput style={styles.inputBox} keyboardType="number-pad" defaultValue={couponCondition} onChangeText={setCouponCondition} />
            </View>
            <View style={styles.itemBox}>
                <Text style={fs12}>有效期至</Text>
                <DatePicker date={new Date()} modal={false} mode="date" title="请选择有效期" />
            </View>
            <View style={fxG1}>{/* 占位专用 */}</View>
            <GradientButton style={mgBX}>{i18n["btn.confirm"]}</GradientButton>
        </ScrollView>
    );
}