import { useEffect, useState, useRef } from "react";
import { ScrollView, View, Image, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useI18N, getI18N, getAppSettings, getUserPosName, getCouponInUse } from "@/store/getter";
import { dispatchSetLastUsed } from "@/store/setter";
import { DISCOUNT_TYPE_LJ } from "@/common/Statics";
import { parseStringDate } from "@/utils/helper"
import LinearGradient from "react-native-linear-gradient"
import PayKeyboard from "@/components/PayKeyboard";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";
import LocalPictures from "@/common/Pictures";
import QRcodeScanner from "@/modules/QRcodeScanner";

const styles = StyleSheet.create({
    codeInput: {
        textAlign: "right",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        fontSize: 24,
        paddingHorizontal: 10,
        marginHorizontal: 15,
        lineHeight: 50
    },
    codeEmpty: {
        color: "#aaa",
        fontSize: 14
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
        paddingLeft: 4
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
        fontSize: 20,
        marginBottom: 3
    },
    couponPic: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 50,
        borderColor: "#fff",
        borderWidth: 1
    },
    couponDiscount: {
        textAlign: "center",
        fontSize: 50,
        color: appMainColor,
    },
    couponTypeLeft: {
        fontSize: 16,
        paddingRight: 4,
        color: "transparent"
    },
    couponTypeRight: {
        fontSize: 16,
        paddingLeft: 4,
        color: appMainColor,
        marginTop: 12
    },
    couponCondition: {
        fontSize: 12,
        textAlign: "center",
        color: "#ff590e",
        marginTop: 0,
        marginBottom: 10
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
    couponWatermark: {
        position: "absolute",
        bottom: 10,
        left: 10,
        zIndex: 0
    },
    couponWMText: {
        letterSpacing: 2,
        fontSize: 12,
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

//检查优惠券是否已过期
function checkCouponExpiration(exp){
    if(!exp){
        return true; //没有时间限制
    }
    const arr = exp.split("~");
    const nowDate = new Date();
    
    if(arr.length === 1){//只有终止日期
        const endDate = parseStringDate(arr[0]);
        endDate.setHours(23, 59, 59);
        return (nowDate <= endDate);
    } else {//起始日期 ~ 终止日期
        const startDate = parseStringDate(arr[0]);
        const endDate = parseStringDate(arr[1]);
        
        startDate.setHours(0, 0, 0);
        endDate.setHours(23, 59, 59);
        return (nowDate >= startDate && nowDate <= endDate);
    }
}

//查询优惠券信息
function getCouponInfo(cc) {
    return new Promise(function(resolve, reject){
        const items = cc.split("#");
        if(items.length >= 8){
            const output = {
                picurl: null,
                title: items[1],
                cpcode: items[1],
                distype: (+items[2] || 0), //1-折扣，2-立减，其他值-未知
                discount: (+items[3] || 0), //折扣率，或者立减金额
                condition: (+items[6] || 0), //满免条件
                expiration: (items[8].replace(/(\d{4})(\d{2})/, "$1-$2-") + " ~ " + items[9].replace(/(\d{4})(\d{2})/, "$1-$2-")),
                distributor: "" //分销员编号
            };
            resolve(output);
        } else {
            //去服务器查询
            resolve({});
            $alert(getI18N("unimplemented.tip"));
        }
    });
}

export default function CouponIndex(props){
    const i18n = useI18N();
    const appSettings = getAppSettings();
    const pkRef = useRef();
    const [couponCode, setCouponCode] = useState("");
    const [pkVisible, setPkVisible] = useState(true);
    const [couponInfo, setCouponInfo] = useState(couponReady);
    
    const showPKBox = () => {
        pkRef.current.initiText(couponCode);
        setPkVisible(true);
    }
    const onPKConfirm = () => {
        if(!couponCode){
            return !$notify.info(i18n["coupon.enter.tip"]);
        }
        setPkVisible(false);
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
                setPkVisible(false);
                setCouponCode(res.scanResult);
                setCouponInfo(couponLoading);
                getCouponInfo(res.scanResult).then(setCouponInfo); //查询优惠券信息...
            }
        });
    }
    const onAddNewCoupon = (cpinfo) => {
        setPkVisible(false);
        setCouponInfo(cpinfo);
    }
    const gotoCouponAdds = () => {
        props.navigation.navigate("优惠券录入", { onGoBack: onAddNewCoupon });
    }
    
    useEffect(() => {
        if(props.route.params?.couponCode){
            const couponCache = getCouponInUse(props.route.params.couponCode);
            if(couponCache){
                setCouponCode(couponCache.cpcode);
                setCouponInfo({...couponCache, inuse: true});
            } else {
                setCouponCode(props.route.params.couponCode);
                setCouponInfo(couponLoading);
                getCouponInfo(props.route.params.couponCode).then(setCouponInfo); //查询优惠券信息...
            }
            setPkVisible(false);
        }
    }, []);
    
    return (<>
        <ScrollView style={pgFF} contentContainerStyle={mhF}>
            <View style={styles.codeIcon}>
                <PosPayIcon name="coupon-code" size={styles.codeText.fontSize} color={styles.codeText.color} />
                <Text style={styles.codeText}>{i18n["coupon.code"]}</Text>
            </View>
            <Text style={[styles.codeInput, !couponCode&&styles.codeEmpty, pkVisible&&styles.codeActived]} numberOfLines={1} onPress={showPKBox}>{couponCode || i18n["coupon.enter.tip"]}</Text>
            {!pkVisible ? (couponInfo.loading ?
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
                    <LinearGradient style={styles.couponBox} colors={lgColors} start={lgStartEnd[0]} end={lgStartEnd[1]}>
                        <View style={styles.couponTip}>
                            <Text style={[fs12, tcG0]}>{i18n["coupon.received"]}</Text>
                            <PosPayIcon name="check-fill" color={tcG0.color} size={12} offset={2} />
                        </View>
                        <View style={[styles.couponSemicircle, styles.couponSC1]}>{/* 优惠券去掉半个圆（上方） */}</View>
                        <View style={[styles.couponSemicircle, styles.couponSC2]}>{/* 优惠券去掉半个圆（下方） */}</View>
                        <View style={styles.couponDashedLine}>{/* 竖杠虚线 */}</View>
                        <View style={styles.couponWatermark}><Text style={styles.couponWMText}>NO.{couponInfo.cpcode}</Text></View>
                        <View style={fxHC}>
                            <Image source={couponInfo.picurl || LocalPictures.couponDefaultPic} style={styles.couponPic} />
                            <View>
                                <Text style={styles.couponTitle}>{couponInfo.title}</Text>
                                <Text style={[fs10, tc66]}>{couponInfo.expiration}</Text>
                            </View>
                        </View>
                        {couponInfo.distype===DISCOUNT_TYPE_LJ ? <>
                            <View style={[fxR, fxJC]}>
                                <Text style={styles.couponTypeLeft}>{i18n["coupon.type2"]/* 为了使金额保持居中，所有需要这个透明文字 */}</Text>
                                <Text style={styles.couponDiscount}>{appSettings.currencySymbol}{couponInfo.discount}</Text>
                                <Text style={styles.couponTypeRight}>{i18n["coupon.type2"]}</Text>
                            </View>
                            <Text style={styles.couponCondition}>{i18n["coupon.reduction"].cloze(couponInfo.condition, couponInfo.discount)}</Text>
                        </> : <>
                            <View style={[fxR, fxJC]}>
                                <Text style={styles.couponTypeLeft}>{i18n["coupon.type1"] /* 为了使金额保持居中，所有需要这个透明文字 */}</Text>
                                <Text style={styles.couponDiscount}>{couponInfo.discount}%</Text>
                                <Text style={styles.couponTypeRight}>{i18n["coupon.type1"]}</Text>
                            </View>
                            <Text style={styles.couponCondition}>{i18n["coupon.off"].cloze(couponInfo.condition, couponInfo.discount)}</Text>
                        </>}
                        <Text style={[fs10, taR, tc66]}>{i18n["coupon.store"]}&emsp;{getUserPosName()}</Text>
                    </LinearGradient>
                    <GradientButton onPress={useThisCoupon}>{i18n[couponInfo.inuse ? "coupon.disuse" : "btn.use"]}</GradientButton>
                </View>
            : /* 暂无优惠券 */
                <View style={fxVM}>
                    <Image source={LocalPictures.noCoupon} style={styles.couponEmpty} />
                    <Text style={[fs18, tc66]}>{i18n["nodata"]}</Text>
                </View>
            ))): 
                <>
                    <Pressable style={[fxHC, pdX]} android_ripple={tcCC} onPress={scanCouponCode}>
                        <Text style={[fxG1, tcMC]}>{i18n["qrcode.identify"]}</Text>
                        <PosPayIcon name="qrcode-scan" color={appMainColor} size={20} />
                    </Pressable>
                    <Pressable style={[fxHC, pdX]} android_ripple={tcCC} onPress={gotoCouponAdds}>
                        <Text style={[fxG1, tcMC]}>{i18n["coupon.adds.manually"]}</Text>
                        <PosPayIcon name="manual-add" color={appMainColor} size={20} />
                    </Pressable>
                    <Text style={fxG1} onPress={() => setPkVisible(false)}>{/* 点我关闭键盘 */}</Text>
                </>
            }
        </ScrollView>
        <PayKeyboard
            ref={pkRef}
            visible={pkVisible}
            fixed={true}
            phoneMode={true} 
            onChange={setCouponCode} 
            onClose={setPkVisible} 
            onConfirm={onPKConfirm}
        />
    </>);
}