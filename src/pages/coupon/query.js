import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Keyboard, TouchableOpacity } from "react-native";
import { useI18N, useLastInputPromotionCode } from "@/store/getter";
import { dispatchSetLastUsed, dispatchRemoveLastInputPromotionCode } from "@/store/setter";
import { DISCOUNT_TYPE_ZK, DISCOUNT_TYPE_LJ } from "@/common/Statics";
import GradientButton from "@/components/GradientButton";
import PosPayIcon from "@/components/PosPayIcon";

const styles = StyleSheet.create({
    codeInput: {
        textAlign: "right",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        fontSize: 16,
        height: 40,
        letterSpacing: 1
    },
    codeActived: {
        borderBottomColor: appMainColor
    },
    lastPcBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: "#eee",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 40,
        fontSize: 14,
        marginLeft: 10
    }
});

export default function CouponQuery(props){
    const i18n = useI18N();
    const useLastIPC = useLastInputPromotionCode(); //获取上次输入的分销码
    const [couponCode, setCouponCode] = useState(""); //测试码：JPTDI0001
    const [promotionCode, setPromotionCode] = useState(""); //测试码：66010101
    const [inputNth, setInputNth] = useState(0);
    const [isQuerying, setIsQuerying] = useState(false);
    
    const changeInputBox = (nth) => {
        return function(){
            setInputNth(nth);
        }
    }
    const queryCouponInfo = () => {
        if(!couponCode){
            return !$notify.info(i18n["coupon.enter.tip"]);
        }
        
        if(!promotionCode){
            return !$notify.info(i18n["coupon.promotion.tip"]);
        }
        
        Keyboard.dismiss();
        
        setIsQuerying(true);
        //防止频繁点击！每隔一点时间才能点击一次
        $debounce(function(){
            $request("getPosDiscountDetail", {
                discountCode: couponCode,
                promotionCode: promotionCode
            }).then(res => {
                const output = {
                    picurl: res.posLogo,
                    title: res.discountName,
                    cpcode: res.discountCode, //优惠码
                    ptcode: promotionCode, //分销码
                    distype: (res.discountTypeValue == 1 ? DISCOUNT_TYPE_ZK : DISCOUNT_TYPE_LJ), //1-折扣，2-立减，其他值-未知
                    discount: (+res.attrValue || 0), //折扣率或者立减金额
                    condition: (+res.startAmount || 0), //满免条件，忽略 endAmount
                    expiration: (res.startTime ? res.startTime.substr(0, 10) : "0001-01-01") + " ~ " + (res.endTime ? res.endTime.substr(0, 10) : "9999-12-31"),
                    taxfreerate: (+res.taxRate || 0), //免税比例 tax free rate，百分数，有多少比例是免税的。比如 5%，总金额是 100，那么有 20 块是免税的，剩下80元需要计算税收
                    createtime: Date.now() //创建时间的时间戳
                };
                dispatchSetLastUsed(output);
                props.route.params?.onGoBack(output);
                props.navigation.goBack();
            }).catch(err => {
                setIsQuerying(false);
            });
        }, 500);
    }
    const setLastIPC = () => {
        setPromotionCode(useLastIPC);
    }
    const deleteLastIPC = () => {
        $confirm(i18n["delete.confirm"]).then(dispatchRemoveLastInputPromotionCode);
    }
    
    return (
        <View style={[pgFF, pdX]}>
            <Text style={[fs16, inputNth===0xFF00 && tcMC]}>{i18n["coupon.code"]}</Text>
            <TextInput
                style={[styles.codeInput, inputNth===0xFF00 && styles.codeActived]} 
                onBlur={changeInputBox(0)}
                onFocus={changeInputBox(0xFF00)}
                placeholder={i18n["coupon.enter.tip"]}
                onChangeText={setCouponCode}
                autoFocus={true}
                defaultValue={couponCode}
                keyboardType="default" />
            <Text style={[fs16, mgTS, inputNth===0xFF99 && tcMC]}>{i18n["coupon.promotion.code"]}</Text>
            <TextInput
                style={[styles.codeInput, inputNth===0xFF99 && styles.codeActived]} 
                onBlur={changeInputBox(0)}
                onFocus={changeInputBox(0xFF99)}
                placeholder={i18n["coupon.promotion.tip"]}
                onChangeText={setPromotionCode}
                autoFocus={false}
                defaultValue={promotionCode}
                keyboardType="number-pad" />
            <TouchableOpacity style={[fxR, fxG1, fxJE, pdVS]} onPress={Keyboard.dismiss} activeOpacity={1}>
                {(!!useLastIPC && promotionCode !== useLastIPC) && 
                    <View style={styles.lastPcBox}>
                        <PosPayIcon name="promotion-code" color="#000" size={16} offset={-5} />
                        <Text style={fs14} onPress={setLastIPC}>{useLastIPC}</Text>
                        <PosPayIcon name="close-circle" color="#999" size={16} offset={10} onPress={deleteLastIPC} />
                    </View>
                }
            </TouchableOpacity>
            <GradientButton showLoading={isQuerying} disabled={isQuerying} onPress={queryCouponInfo}>{i18n["btn.query"]}</GradientButton>
        </View>
    );
}