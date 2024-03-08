import { useState } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet } from "react-native";
import { useI18N, getAppSettings } from "@/store/getter";
import { DISCOUNT_TYPE_ZK } from "@/common/Statics";
import { formatDate } from "@/utils/helper";
import GradientButton from "@/components/GradientButton";
import RadioBox from "@/components/RadioBox";
import DatePicker from "react-native-date-picker";

const styles = StyleSheet.create({
    itemBox: {
        marginTop: 5
    },
    inputBox: {
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 0,
        fontSize: 16,
        textAlign: "right"
    },
    inputActivated: {
        borderBottomColor: appMainColor
    },
    typeBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        paddingVertical: 4.25
    },
    suffixBox: {
        position: "absolute",
        right: 0,
        bottom: 10,
        zIndex: 1,
        fontSize: 12,
        color: "#666"
    },
    textLh1: {
        lineHeight: 28
    },
    textLh2: {
        lineHeight: 28,
        color: "#999"
    }
});

export default function CouponAdds(props){
    const i18n = useI18N();
    const today = new Date();
    const appSettings = getAppSettings();
    
    const [couponTitle, setCouponTitle] = useState(""); //优惠券名称
    const [couponCode, setCouponCode] = useState("");//优惠码
    const [couponType, setCouponType] = useState(1); //1-折扣，2-立减
    const [couponDiscount, setCouponDiscount] = useState("");//优惠金额或者比例
    const [couponCondition, setCouponCondition] = useState("");//生效条件
    const [couponExpiration, setCouponExpiration] = useState([null, null, "", ""]);//有效期
    const [distributorNumber, setDistributorNumber] = useState("");//分销员编号
    const [dpOpenedCode, setDpOpenedCode] = useState(-1);//日期选择器是否打开 0-开始日期，1-结束日期, 其他值-关闭日期选择框
    const [inputNth, setInputNth] = useState(0); //哪个输入框获得了焦点
    
    const onDpDone = (date) => {
        setDpOpenedCode(-1);
        if(date){
            couponExpiration[dpOpenedCode] = date;
            couponExpiration[dpOpenedCode + 2] = formatDate(date, "yyyy/MM/dd");
            setCouponExpiration([...couponExpiration]);
        }
    }
    const onInputFocus = (nth) => {
        return function(){
            setInputNth(nth);
        }
    }
    const onInputBlur = () => {
        setInputNth(0);
    }
    const onChangeCouponType = (tp) => {
        return function(){
            setCouponType(tp);
            setInputNth(0xBB22);
        }
    }
    const onOpenDp = (code) => {
        return function(){
            setDpOpenedCode(code);
            setInputNth(0xBB88);
        }
    }
    
    const onAddCoupon = () => {
        if(!couponTitle){
            return !$notify.info(i18n["coupon.errmsg0"].cloze(i18n["coupon.name"]));
        }
        if(!couponCode){
            return !$notify.info(i18n["coupon.errmsg0"].cloze(i18n["coupon.code"]));
        }
        if(!couponDiscount){
            return !$notify.info(i18n["coupon.errmsg0"].cloze(couponType===DISCOUNT_TYPE_ZK ? i18n["coupon.off.rate"] : i18n["coupon.reduction.amount"]));
        }
        if(!couponCondition){
            return !$notify.info(i18n["coupon.errmsg0"].cloze(i18n["coupon.condition"]));
        }
        if(!couponExpiration[0] || !couponExpiration[1]){
            return !$notify.info(i18n["coupon.errmsg0"].cloze(i18n["coupon.expiration"]));
        } else if(couponExpiration[0] > couponExpiration[1]){
            return !$notify.info(i18n["coupon.errmsg1"]);
        }
        if(!distributorNumber){
            return !$notify.info(i18n["coupon.errmsg0"].cloze(i18n["coupon.distributor.number"]));
        }
        
        const couponData = {
            picurl:     null,
            title:      couponTitle.trim(),
            cpcode:     couponCode.replace(/[^\d]/g, ""),
            distype:    couponType, //1-折扣，2-立减
            discount:   (+couponDiscount || 0),
            expiration: (couponExpiration[2] + " ~ " + couponExpiration[3]),
            condition:  (+couponCondition || 0), //满免条件
            distributor:distributorNumber.replace(/[^\d]/g, "") //分销员编号
        };
        
        props.route.params?.onGoBack(couponData);
        props.navigation.goBack();
    }
    
    return (
        <ScrollView style={pgFF} contentContainerStyle={[mhF, pdHX]} keyboardShouldPersistTaps="handled">
            <View style={styles.itemBox}>
                <Text style={[fs12, inputNth===0xFF00&&tcMC]}>{i18n["coupon.name"]}</Text>
                <TextInput 
                    style={[styles.inputBox, inputNth===0xFF00&&styles.inputActivated]} 
                    defaultValue={couponTitle} 
                    onChangeText={setCouponTitle} 
                    placeholder={i18n["required"]} 
                    onBlur={onInputBlur}
                    onFocus={onInputFocus(0xFF00)} />
            </View>
            <View style={styles.itemBox}>
                <Text style={[fs12, inputNth===0xAA00&&tcMC]}>{i18n["coupon.code"]}</Text>
                <TextInput 
                    style={[styles.inputBox, inputNth===0xAA00&&styles.inputActivated]} 
                    keyboardType="number-pad" 
                    defaultValue={couponCode} 
                    onChangeText={setCouponCode}
                    placeholder={i18n["required"]} 
                    onBlur={onInputBlur}
                    onFocus={onInputFocus(0xAA00)} />
            </View>
            <View style={styles.itemBox}>
                <Text style={[fs12, inputNth===0xBB22&&tcMC]}>{i18n["coupon.types"]}</Text>
                <View style={[styles.typeBox, inputNth===0xBB22&&styles.inputActivated]}>
                    <RadioBox size={18} label={i18n["coupon.type1"]} checked={couponType===DISCOUNT_TYPE_ZK} onPress={onChangeCouponType(1)} />
                    <RadioBox size={18} label={i18n["coupon.type2"]} checked={couponType!==DISCOUNT_TYPE_ZK} onPress={onChangeCouponType(2)} style={{marginLeft: 40}} />
                </View>
            </View>
            <View style={styles.itemBox}>
                <Text style={[fs12, inputNth===0xDD88&&tcMC]}>{couponType===DISCOUNT_TYPE_ZK ? i18n["coupon.off.rate"] : i18n["coupon.reduction.amount"]}</Text>
                <TextInput 
                    style={[styles.inputBox, pdRX, inputNth===0xDD88&&styles.inputActivated]} 
                    keyboardType="number-pad" 
                    defaultValue={couponDiscount} 
                    onChangeText={setCouponDiscount}
                    maxLength={10}
                    placeholder={i18n["required"]} 
                    onBlur={onInputBlur}
                    onFocus={onInputFocus(0xDD88)} />
                <Text style={styles.suffixBox}>{couponType===DISCOUNT_TYPE_ZK ? "%" : appSettings.currencyUnit}</Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={[fs12, inputNth===0xCC99&&tcMC]}>{i18n["coupon.condition"]}</Text>
                <TextInput 
                    style={[styles.inputBox, pdRX, inputNth===0xCC99&&styles.inputActivated]} 
                    keyboardType="number-pad" 
                    defaultValue={couponCondition} 
                    onChangeText={setCouponCondition}
                    maxLength={10}
                    placeholder={i18n["required"]} 
                    onBlur={onInputBlur}
                    onFocus={onInputFocus(0xCC99)} />
                <Text style={styles.suffixBox}>{appSettings.currencyUnit}</Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={[fs12, inputNth===0xBB88&&tcMC]}>{i18n["coupon.expiration"]}</Text>
                <View style={[fxHC, fxJE, styles.inputBox, inputNth===0xBB88&&styles.inputActivated]}>
                    <Text style={couponExpiration[0] ? styles.textLh1 : styles.textLh2} onPress={onOpenDp(0)}>{couponExpiration[2] || i18n["begindate"]}</Text>
                    <Text style={mgHX}>~</Text>
                    <Text style={couponExpiration[1] ? styles.textLh1 : styles.textLh2} onPress={onOpenDp(1)}>{couponExpiration[3] || i18n["enddate"]}</Text>
                </View>
                <DatePicker 
                    modal={true}
                    date={couponExpiration[dpOpenedCode] || today} 
                    open={dpOpenedCode >= 0} 
                    minimumDate={today} 
                    onCancel={onDpDone}
                    onConfirm={onDpDone}
                    confirmText={i18n["btn.confirm"]}
                    cancelText={i18n["btn.cancel"]}
                    theme="light"
                    mode="date" 
                    title={dpOpenedCode < 1 ? i18n["begindate"] : i18n["enddate"]} />
            </View>
            <View style={styles.itemBox}>
                <Text style={[fs12, inputNth===0xEE44&&tcMC]}>{i18n["coupon.distributor.number"]}</Text>
                <TextInput 
                    style={[styles.inputBox, inputNth===0xEE44&&styles.inputActivated]} 
                    keyboardType="number-pad" 
                    defaultValue={distributorNumber} 
                    onChangeText={setDistributorNumber}
                    placeholder={i18n["required"]} 
                    onBlur={onInputBlur}
                    onFocus={onInputFocus(0xEE44)} />
            </View>
            <View style={fxG1}>{/* 占位专用 */}</View>
            <GradientButton style={mgVS} onPress={onAddCoupon}>{i18n["btn.confirm"]}</GradientButton>
        </ScrollView>
    );
}