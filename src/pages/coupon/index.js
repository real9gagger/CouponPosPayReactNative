import { useEffect, useState, useRef } from "react";
import { ScrollView, View, Image, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useI18N } from "@/store/getter";
import { DISCOUNT_TYPE_LJ } from "@/common/Statics";
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
    loadingTip: {
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

//查询优惠券信息
function getCouponInfo(cc, iu) {
    return new Promise(function(resolve, reject){
        setTimeout(() => {
            if("02468".indexOf(cc[cc.length - 1]) >= 0){
                resolve({
                    picurl: LocalPictures.couponDefaultPic,
                    title: "新年大促销",
                    discount: 17,
                    distype: 1, //1-折扣，2-立减
                    expiration: "2025/02/10 ~ 2025/12/31",
                    condition: 100, //满免条件
                    store: "东京路51号门店",
                    cpcode: cc,
                    inuse: iu //in use 是否正在使用
                });
            } else {
                resolve({});
            }
        }, 500);
    });
}

export default function CouponIndex(props){
    const i18n = useI18N();
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
        getCouponInfo(couponCode, false).then(setCouponInfo); //查询优惠券信息...
    }
    const useThisCoupon = () => {
        //带参数返回上一页
        props.route.params?.onGoBack(couponInfo.cpcode && !couponInfo.inuse ? couponInfo : null);
        props.navigation.goBack();
    }
    const scanCouponCode = () => {
        QRcodeScanner.openScanner(function(res){
            if(res.scanResult){
                setCouponCode(res.scanResult);
                setPkVisible(false);
                setCouponInfo(couponLoading);
                getCouponInfo(res.scanResult, false).then(setCouponInfo); //查询优惠券信息...
            }
        });
    }
    
    useEffect(() => {
        if(props.route.params?.couponCode){
            //查询优惠券信息
            setCouponCode(props.route.params.couponCode);
            setPkVisible(false);
            setCouponInfo(couponLoading);
            getCouponInfo(props.route.params.couponCode, props.route.params.isInUse).then(setCouponInfo);
        }
    }, []);
    
    return (<>
        <ScrollView style={pgFF} contentContainerStyle={mhF}>
            <View style={styles.codeIcon}>
                <PosPayIcon name="coupon-code" size={styles.codeText.fontSize} color={styles.codeText.color} />
                <Text style={styles.codeText}>{i18n["coupon.code"]}</Text>
            </View>
            <Text style={[styles.codeInput, !couponCode&&styles.codeEmpty, pkVisible&&styles.codeActived]} onPress={showPKBox}>{couponCode || i18n["coupon.enter.tip"]}</Text>
            {!pkVisible ? (couponInfo.loading ?
                <View style={styles.loadingTip}>
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
                            <Image source={couponInfo.picurl} style={styles.couponPic} />
                            <View>
                                <Text style={styles.couponTitle}>{couponInfo.title}</Text>
                                <Text style={[fs10, tc66]}>{couponInfo.expiration}</Text>
                            </View>
                        </View>
                        {couponInfo.distype===DISCOUNT_TYPE_LJ ? <>
                            <View style={[fxR, fxJC]}>
                                <Text style={styles.couponTypeLeft}>{i18n["coupon.type2"]/* 为了使金额保持居中，所有需要这个透明文字 */}</Text>
                                <Text style={styles.couponDiscount}>{i18n["currency.symbol"]}{couponInfo.discount}</Text>
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
                        <Text style={[fs10, taR, tc66]}>{i18n["coupon.store"]}&emsp;{couponInfo.store}</Text>
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
                    <Pressable style={[fxHC, pdX, mgTX]} android_ripple={tcCC} onPress={scanCouponCode}>
                        <Text style={[fxG1, tcMC]}>{i18n["qrcode.identify"]}</Text>
                        <PosPayIcon name="qrcode-scan" color={appMainColor} size={24} />
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