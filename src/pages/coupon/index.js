import { useEffect, useState, useRef } from "react";
import { ScrollView, View, Image, Text, TextInput, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useI18N, getAppSettings, getUserShopName, getCouponInUse, findCouponInAddedList } from "@/store/getter";
import { dispatchSetLastUsed } from "@/store/setter";
import { DISCOUNT_TYPE_LJ } from "@/common/Statics";
import { parseStringDate, parseCouponScanResult, checkCouponExpiration } from "@/utils/helper";
import LinearGradient from "react-native-linear-gradient";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";
import LocalPictures from "@/common/Pictures";
import QRcodeScanner from "@/modules/QRcodeScanner";

const styles = StyleSheet.create({
    codeInput: {
        textAlign: "right",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        fontSize: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 15,
        height: 50
    },
    codeActived: {
        borderBottomColor: appMainColor,
        backgroundColor: "#e5faf3"
    },
    codeIcon: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 5
    },
    codeText: {
        fontSize: 12,
        color: "#000",
        marginTop: -1,
        paddingLeft: 4,
        flex: 1
    },
    codeQuery: {
        position: "absolute",
        left: 15,
        right: 15,
        bottom: 20,
        zIndex: 9,
        textAlign: "center",
        fontSize: 16
    },
    loadingBox: {
        paddingVertical: 30
    },
    couponBox: {
        backgroundColor: "#ffe2d5",
        borderRadius: 10,
        padding: 10,
        marginBottom: 30,
        marginTop: 15
    },
    couponTitle: {
        fontSize: 18,
        marginBottom: 0
    },
    couponPic: {
        width: 45,
        height: 45,
        marginRight: 10,
        borderRadius: 45,
        borderColor: "#fff",
        borderWidth: 1,
        resizeMode: "contain"
    },
    couponDiscount: {
        textAlign: "center",
        fontSize: 40,
        color: appMainColor,
    },
    couponTypeLeft: {
        fontSize: 12,
        paddingRight: 4,
        color: "transparent"
    },
    couponTypeRight: {
        fontSize: 12,
        paddingLeft: 4,
        color: appMainColor,
        marginTop: 12
    },
    couponCondition: {
        fontSize: 12,
        textAlign: "center",
        color: "#333",
        marginTop: 2,
        marginBottom: 12
    },
    couponTip:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        top: 5,
        right: 8,
        zIndex: 9
    },
    couponSemicircle:{
        position: "absolute",
        right: 100,
        width: 16,
        height: 16,
        borderRadius: 20,
        zIndex: 1,
        backgroundColor: "#fff"
    },
    couponSC1: {
        top: -8
    },
    couponSC2: {
        bottom: -8
    },
    couponDashedLine: {
        position: "absolute",
        top: 8,
        right: 108,
        bottom: 8,
        zIndex: 0,
        borderLeftColor: "#fff",
        borderLeftWidth: 1,
        borderStyle: "dashed"
    },
    couponWatermark1: {
        position: "absolute",
        bottom: 15,
        left: 10,
        zIndex: 2
    },
    couponWatermark2: {
        position: "absolute",
        bottom: 2,
        left: 10,
        zIndex: 1
    },
    couponWMText: {
        letterSpacing: 2,
        fontSize: 10,
        color: "#feb797"
    },
    couponEmpty: {
        height: 150,
        width: 150,
        marginTop: 50,
        marginBottom: 30
    }
});

const lgColors = ["#ffe2d5", "#fee7dc", "#ffc4a9"];
const lgStartEnd = [{x:0, y:0.5}, {x:1, y:0.5}];
const couponLoading = {loading: true}; //正在查询优惠券信息
const couponReady = {ready: true};//已输入优惠码，可查询

//查询优惠券信息
function getCouponInfo(cc) {
    return new Promise(function(resolve, reject){
        const theCP = parseCouponScanResult(cc);
        if(theCP){
            resolve(theCP);
        } else {
            //查找我添加的优惠券
            resolve(findCouponInAddedList(cc) || {});
        }
    });
}

export default function CouponIndex(props){
    const theCPCode = (props.route.params?.couponCode || "");
    const i18n = useI18N();
    const tiRef = useRef();
    const appSettings = getAppSettings();
    const [couponCode, setCouponCode] = useState("");
    const [isFocus, setIsFocus] = useState(!theCPCode);
    const [couponInfo, setCouponInfo] = useState(couponReady);

    const onClearCode = () => {
        setCouponCode("");
        tiRef.current.focus();
    }
    const onPKConfirm = () => {
        if(!couponCode){
            return !$notify.info(i18n["coupon.enter.tip"]);
        }
        setCouponInfo(couponLoading);
        getCouponInfo(couponCode).then(setCouponInfo); //查询优惠券信息...
    }
    const useThisCoupon = () => {
        if(couponInfo.cpcode && !couponInfo.inuse){
            if(!checkCouponExpiration(couponInfo.expiration)){
                return !$notify.error(i18n["coupon.errmsg2"]);
            }
            
            dispatchSetLastUsed(couponInfo);
            props.route.params?.onGoBack(couponInfo);
        } else {
            dispatchSetLastUsed(null);
            props.route.params?.onGoBack(null);
        }
        props.navigation.goBack();
    }
    const scanCouponCode = () => {
        QRcodeScanner.openScanner(function(res){
            if(res.scanResult){
                setCouponCode(res.scanResult);
                setCouponInfo(couponLoading);
                getCouponInfo(res.scanResult).then(setCouponInfo); //查询优惠券信息...
                tiRef.current.blur();
            }
        });
    }
    const onAddNewCoupon = (cpinfo) => {
        setCouponCode(cpinfo.cpcode);
        setCouponInfo(cpinfo);
    }
    const updatePromotionCode = (dn) => { //更新分销码
        setCouponInfo({...couponInfo, ptcode: dn});
    }
    const gotoCouponAdds = () => {
        props.navigation.navigate("优惠券录入", { onGoBack: onAddNewCoupon });
    }
    const gotoShopCoupons = () => {
        props.navigation.navigate("店铺优惠券", { onGoBack: onAddNewCoupon });
    }
    const gotoInputBotText = () => {
        props.navigation.navigate("文本输入器", { 
            defaultText: couponInfo.ptcode,
            onGoBack: updatePromotionCode,
            isNumberPad: true
        });
    };
    
    useEffect(() => {
        if(theCPCode){
            const couponCache = getCouponInUse(theCPCode);
            if(couponCache){
                setCouponCode(couponCache.cpcode);
                setCouponInfo({...couponCache, inuse: true});
            } else {
                setCouponCode(theCPCode);
                setCouponInfo(couponLoading);
                getCouponInfo(theCPCode).then(setCouponInfo); //查询优惠券信息...
            }
        }
    }, []);
    
    return (
        <ScrollView style={pgFF} contentContainerStyle={mhF} keyboardShouldPersistTaps="handled">
            {/* 2024年4月3日 功能改为仅开发模式下可用： */ !runtimeEnvironment.isProduction && <>
                <View style={styles.codeIcon}>
                    <PosPayIcon name="coupon-code" size={styles.codeText.fontSize} color={styles.codeText.color} />
                    <Text style={styles.codeText}>{i18n["coupon.code"]}</Text>
                    <Text style={[fs12, tc66, pdLS]} onPress={onClearCode}>{i18n["btn.clear"]}</Text>
                    <PosPayIcon name="close-circle" size={14} color="#666" offset={3} onPress={onClearCode} />
                </View>
                <TextInput 
                    ref={tiRef}
                    style={[styles.codeInput, isFocus&&styles.codeActived]} 
                    onBlur={() => setIsFocus(false)}
                    onFocus={() => setIsFocus(true)}
                    placeholder={i18n["coupon.enter.tip"]}
                    onChangeText={setCouponCode}
                    onSubmitEditing={onPKConfirm}
                    autoFocus={!theCPCode}
                    defaultValue={couponCode}
                    keyboardType="default" />
            </>}
            
            {!isFocus && (couponInfo.loading ?
                <View style={styles.loadingBox}>
                    <ActivityIndicator color={appMainColor} size={40} />
                    <Text style={[fs14, tcMC, mgTX, taC]}>{i18n["loading"]}</Text>
                </View>
            :(couponInfo.ready ?
                <GradientButton
                    onPress={useThisCoupon} 
                    style={styles.codeQuery}
                    disabled={!couponCode}
                    onPress={onPKConfirm}>{i18n[!couponCode ? "coupon.enter.tip" : "btn.query"]}</GradientButton>
            :(couponInfo.cpcode ?
                <View style={pdX}>
                    <Text style={fs16}>{i18n[couponInfo.inuse ? "coupon.inuse" : "coupon.identified"]}</Text>
                    <LinearGradient style={styles.couponBox} colors={lgColors} start={lgStartEnd[0]} end={lgStartEnd[1]}>
                        <View style={styles.couponTip}>
                            <Text style={[fs12, tcG0]}>{i18n["coupon.received"]}</Text>
                            <PosPayIcon name="check-fill" color={tcG0.color} size={12} offset={2} />
                        </View>
                        <View style={[styles.couponSemicircle, styles.couponSC1]}>{/* 优惠券去掉半个圆（上方） */}</View>
                        <View style={[styles.couponSemicircle, styles.couponSC2]}>{/* 优惠券去掉半个圆（下方） */}</View>
                        <View style={styles.couponDashedLine}>{/* 竖杠虚线 */}</View>
                        <View style={styles.couponWatermark1}><Text style={styles.couponWMText}>NO.{couponInfo.cpcode}</Text></View>
                        <View style={styles.couponWatermark2}><Text style={styles.couponWMText}>PC.{couponInfo.ptcode}</Text></View>
                        <View style={fxHC}>
                            <Image source={couponInfo.picurl ? {uri: couponInfo.picurl} : LocalPictures.couponDefaultPic} style={styles.couponPic} />
                            <View>
                                <Text style={styles.couponTitle}>{couponInfo.title}</Text>
                                <Text style={[fs10, tc66]}>{couponInfo.expiration}</Text>
                            </View>
                        </View>
                        {couponInfo.distype===DISCOUNT_TYPE_LJ ? <>
                            <View style={[fxR, fxJC]}>
                                <Text style={styles.couponTypeLeft}>{i18n["coupon.type2"]/* 为了使金额保持居中，所有需要这个透明文字 */}</Text>
                                <Text style={styles.couponDiscount}><Text style={fs18}>{appSettings.regionalCurrencySymbol}</Text>{couponInfo.discount}</Text>
                                <Text style={styles.couponTypeRight}>{i18n["coupon.type2"]}</Text>
                            </View>
                            <Text style={styles.couponCondition}>{i18n["coupon.reduction"].cloze(couponInfo.condition, couponInfo.discount)}</Text>
                        </> : <>
                            <View style={[fxR, fxJC]}>
                                <Text style={styles.couponTypeLeft}>{i18n["coupon.type1"] /* 为了使金额保持居中，所有需要这个透明文字 */}</Text>
                                <Text style={styles.couponDiscount}>{couponInfo.discount}<Text style={fs18}>%</Text></Text>
                                <Text style={styles.couponTypeRight}>{i18n["coupon.type1"]}</Text>
                            </View>
                            <Text style={styles.couponCondition}>{i18n["coupon.off"].cloze(couponInfo.condition, couponInfo.discount)}</Text>
                        </>}
                        <Text style={[fs10, taR, tc99]}>{i18n["coupon.store"]}&emsp;{getUserShopName()}</Text>
                    </LinearGradient>
                    <GradientButton onPress={useThisCoupon}>{i18n[couponInfo.inuse ? "coupon.disuse" : "btn.use"]}</GradientButton>
                </View>
            : /* 暂无优惠券 */
                <View style={fxVM}>
                    <Image source={LocalPictures.noCoupon} style={styles.couponEmpty} />
                    <Text style={[fs18, tc66]}>{i18n["nodata"]}</Text>
                </View>
            )))}
            
            {(isFocus || !!couponInfo.ready) && <>
                <Pressable style={[fxHC, pdX]} android_ripple={tcCC} onPress={scanCouponCode}>
                    <Text style={[fxG1, tcMC]}>{i18n["qrcode.identify"]}</Text>
                    <PosPayIcon name="qrcode-scan" color={appMainColor} size={20} />
                </Pressable>
                <Pressable style={[fxHC, pdX]} android_ripple={tcCC} onPress={gotoInputBotText}>
                    <Text style={[fxG1, tcMC]}>{i18n["coupon.promotion.code"]}</Text>
                    <Text style={[pdRS, tc66]}>{couponInfo.ptcode}</Text>
                    <PosPayIcon name="edit-pen" color={appMainColor} size={20} />
                </Pressable>
                <Pressable style={runtimeEnvironment.isProduction ? dpN : [fxHC, pdX]} android_ripple={tcCC} onPress={gotoCouponAdds}>
                    <Text style={[fxG1, tcMC]}>{i18n["coupon.adds.manually"]}</Text>
                    <Text style={[fs12, pdRS, tc99]}>({i18n["test.debug.available"]})</Text>
                    <PosPayIcon name="manual-add" color={appMainColor} size={20} />
                </Pressable>
                <Pressable style={runtimeEnvironment.isProduction ? dpN : [fxHC, pdX]} android_ripple={tcCC} onPress={gotoShopCoupons}>
                    <Text style={[fxG1, tcMC]}>{i18n["coupon.adds.history"]}</Text>
                    <Text style={[fs12, pdRS, tc99]}>({i18n["test.debug.available"]})</Text>
                    <PosPayIcon name="my-coupons" color={appMainColor} size={20} />
                </Pressable>
            </>}
        </ScrollView>
    );
}