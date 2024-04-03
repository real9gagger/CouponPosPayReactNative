import { useEffect, useState, useRef } from "react";
import { ScrollView, View, Text, Pressable, Image, StatusBar, StyleSheet, TouchableOpacity, DeviceEventEmitter } from "react-native";
import { useI18N, getI18N, useAppSettings } from "@/store/getter";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { eWalletList, CREDIT_CARD_PAYMENT_CODE, QR_CODE_PAYMENT_CODE, DISCOUNT_TYPE_LJ, TRANSACTION_TYPE_RECEIVE } from "@/common/Statics";
import CustomerDisplay from "@/modules/CustomerDisplay";
import LocalPictures from "@/common/Pictures";
import QRcodeScanner from "@/modules/QRcodeScanner";
import PaymentHelper from "@/modules/PaymentHelper";
import ImageButton from "@/components/ImageButton";
import PayKeyboard from "@/components/PayKeyboard";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";

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
    },
    tabBar1: {
        backgroundColor: "#eee",
        elevation: 0 /* 禁用底部阴影效果 */
    },
    tabBar2: {
        backgroundColor: "#fff",
        elevation: 1
    },
    tabIndicator: {
        backgroundColor: appMainColor
    },
    tabActived: {
        color: appMainColor,
        fontSize: 14,
        fontWeight: "bold",
        paddingLeft: 5
    },
    tabInactived: {
        color: "#333",
        fontSize: 14,
        fontWeight: "bold",
        paddingLeft: 5
    },
    tabView: {
        width: deviceDimensions.screenWidth
    },
    tabItem: {
        width: deviceDimensions.screenWidth / 3
    },
    rowBox: {
        paddingHorizontal: 15,
        paddingVertical: 5
    },
    moneyLabel: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 5
    },
    moneyInput: {
        textAlign: "right",
        borderBottomColor: "#999",
        borderBottomWidth: StyleSheet.hairlineWidth,
        fontSize: 30,
        paddingHorizontal: 10,
        lineHeight: 45
    },
    couponLabel: {
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    couponInput: {
        textAlign: "right",
        borderBottomColor: "#999",
        borderBottomWidth: StyleSheet.hairlineWidth,
        fontSize: 30,
        paddingHorizontal: 10,
        lineHeight: 45
    },
    couponEmpty: {
        color: "#aaa",
        fontSize: 14
    },
    couponInfo: {
        position: "absolute",
        left: 25,
        top: 5,
        zIndex: 1
    },
    InputActived: {
        borderBottomColor: appMainColor,
        backgroundColor: "#e5faf3"
    },
    paymentLabel: {
        fontSize: 16,
        paddingTop: 10
    },
    paymentBox: {
        width: 62,
        height: 62,
        padding: 5,
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        marginTop: 4,
        marginRight: 4
    },
    paymentSelected: {
        borderColor: appDarkColor,
        backgroundColor: "#e5faf3",
    },
    paymentChecked: {
        position: "absolute",
        top: 2,
        right: 2,
        zIndex: 1
    },
    paymentScaning: {
        marginTop: 25,
        width: 60,
        height: 60
    },
    paymentDetails: {
        paddingVertical: 10, 
        paddingHorizontal: 15,
        backgroundColor: "#eee", 
        marginHorizontal: 15, 
        marginBottom: -5, 
        borderRadius: 10
    }
});
const renderScene = SceneMap({ tabBankCard, tabEWallet, tabQRCode });
const eventEmitterName = "HOME_EVENT_BUS"; //事件总枢纽
const onInputToggle = "ON_INPUT_TOGGLE"; //切换输入框
const onInputChange = "ON_INPUT_CHANGE"; //文本变化
const onTransactionSuccess = "ON_TRANSACTION_SUCCESS"; //建议成功时触发
const onSeePayments = "ON_SEE_PAYMENTS"; //查看支持的支付方式
const onCouponInfo = "ON_COUPON_INFO"; //接收到优惠券信息
const regZeros = /^0*$/;
const iNthNone = 0;
const iNthAmount = 1;
const iNthCoupon = 2;

//扫描二维码结束后调用
function onScanFinish(dat){
    if(dat.scanResult){
        DeviceEventEmitter.emit(eventEmitterName, { 
            nth: iNthCoupon, 
            txt: dat.scanResult,
            action: onInputToggle
        }); //发送数据给父组件
    }
}

//调用支付功能
function callPayment(payMoney, disMoney, taxMoney, couponCode, paymentCode, promotionCode){
    if(regZeros.test(payMoney)){
        return !$notify.info(getI18N("input.amount.tip"));
    }
    
    //如果不支持支付功能
    if(!PaymentHelper.isSupport()){
        return $alert(getI18N("payment.errmsg1"));
    }
    
    //以下属性数据类型都是字符串！
    PaymentHelper.startPay({
        transactionType: TRANSACTION_TYPE_RECEIVE, //1-付款，2-取消付款，3-退款
        transactionMode: (runtimeEnvironment.isProduction ? "1" : "2"), //1-正常，2-练习
        paymentType: paymentCode,
        amount: $tofixed(payMoney - disMoney), //至少一块钱，否则报错
        tax: taxMoney, //税费
        slipNumber: "" //单据号码，取消付款或者退款时用到
    }, function(payRes){
        if(payRes.activityResultCode === 0 && payRes.transactionTime){//支付成功
            payRes.action = onTransactionSuccess;
            payRes.discountAmount = disMoney; //优惠总金额
            payRes.orderAmount = payMoney; //订单总金额
            payRes.couponCode = (disMoney && couponCode ? couponCode : ""); //有折扣才有优惠码
            payRes.remark = (runtimeEnvironment.isProduction ? "" : "开发测试的数据");
            payRes.tax = (payRes.tax || taxMoney);
            payRes.promotionCode = promotionCode; //分销码
            DeviceEventEmitter.emit(eventEmitterName, payRes); //发
        } else if(payRes.activityResultCode === 2){//取消支付
            $toast(getI18N("payment.errmsg2"));
        } else {//支付失败
            $alert(getI18N("payment.errmsg3", payRes.errorCode || "E5128"));
        }
    });
}

//关闭键盘
function togglePKHidden(evt){
    if(evt !== iNthNone){
        DeviceEventEmitter.emit(eventEmitterName, {
            nth: iNthNone, 
            txt: "",
            action: onInputToggle
        });
    }
}

//计算支付金额信息
//参数含义：总金额、折扣比例或者立减金额、折扣类型、满减条件、税率
function calcPaymentInfo(tl, dc, dt, cd, rt){
    if(!tl){
        return {
            T_X: 0,
            F_A: 0,
            D_C: 0
        };
    } else {
        //必须满足条件才能优惠
        const dddd = (!dc || tl < cd) ? 0 : (dt === DISCOUNT_TYPE_LJ ? Math.min(tl, dc) : (tl * dc / 100));
        const temp = (!rt) ? 0 : ((tl - dddd) * (rt / 100)); //先减去优惠金额在计算
        return {
            T_X: $tofixed(temp),
            F_A: $tofixed(tl - dddd + temp),
            D_C: $tofixed(dddd)
        };
    }
}

//显示实际金额的计算规则
function showAmountCalcRule(){
    $alert(getI18N("final.amount.formula"));
}

//银行卡
function tabBankCard(props){
    const i18n = useI18N();
    const appSettings = useAppSettings();
    const [payAmounts, setPayAmounts] = useState("");
    const [moneyInfo, setMoneyInfo] = useState({}); //收款信息
    const [cpInfos, setCpInfos] = useState(null);
    const [currentInputBox, setCurrentInputBox] = useState(0);
    
    const toggleAmountInput = () => {
        DeviceEventEmitter.emit(eventEmitterName, { 
            nth: (currentInputBox !== iNthAmount ? iNthAmount : iNthNone), 
            txt: payAmounts,
            action: onInputToggle
        });
    }
    const toggleCouponInput = () => {
        DeviceEventEmitter.emit(eventEmitterName, {
            nth: iNthCoupon,
            txt: (cpInfos?.cpcode || ""),
            action: onInputToggle
        });
    }
    const scanCouponCode = () => {
        togglePKHidden(currentInputBox);
        QRcodeScanner.openScanner(onScanFinish);
    }
    const startPayMoney = () => {
        callPayment(payAmounts, moneyInfo.D_C, moneyInfo.T_X, cpInfos?.cpcode, CREDIT_CARD_PAYMENT_CODE, cpInfos?.ptcode);
    }
    
    useEffect(() => {
        const evt1000 = DeviceEventEmitter.addListener(eventEmitterName, function(infos){
            switch(infos.action){
                case onInputChange:
                    if(infos.nth === iNthAmount){
                        setPayAmounts(infos.txt);
                    }
                    break;
                case onInputToggle:
                    setCurrentInputBox(infos.nth);
                    break;
                case onTransactionSuccess: //交易成功重置数据
                    setPayAmounts("");
                    setCpInfos(null);
                    setCurrentInputBox(iNthNone);
                    break;
                case onCouponInfo:
                    setCpInfos(infos.cpinfo);
                    break;
            }
        });
        return () => { 
            evt1000.remove();
        }
    }, []);
    
    useEffect(() => {
        const mi = calcPaymentInfo(payAmounts, cpInfos?.discount, cpInfos?.distype, cpInfos?.condition, appSettings.generalTaxRate);
        
        //加入防抖功能
        appSettings.customerDisplayShowPayAmountInfo && $debounce(CustomerDisplay.showPayAmountInfo, 800, {
            total: payAmounts,
            tax: mi.T_X,
            discount: mi.D_C,
            amount: mi.F_A,
            cysymbol: appSettings.regionalCurrencySymbol
        });
        
        setMoneyInfo(mi);
    }, [payAmounts, appSettings, cpInfos]);
    
    //银行卡支付界面
    return (
        <ScrollView style={fxG1} contentContainerStyle={mhF}>
            <View style={[fxHC, styles.moneyLabel]}>
                <Text style={[fxG1, fs16]}>{i18n["input.amount"]}</Text>
                <Text style={tc99}>{appSettings.regionalCurrencyUnit}</Text>
            </View>
            <View style={styles.rowBox}>
                <Text style={[styles.moneyInput, currentInputBox===iNthAmount&&styles.InputActived]} onPress={toggleAmountInput}>{appSettings.regionalCurrencySymbol}{payAmounts}</Text>
            </View>
            <Pressable style={[fxHC, styles.couponLabel]} android_ripple={tcCC} onPress={scanCouponCode}>
                <Text style={[fxG1, fs16]}>{i18n["coupon"]}</Text>
                <Text style={[tcMC, mgRX]}>{i18n["qrcode.identify"]}</Text>
                <PosPayIcon name="qrcode-scan" color={appMainColor} size={24} />
            </Pressable>
            <View style={pdHX}>
                {!cpInfos ? 
                    <Text style={[styles.couponInput, styles.couponEmpty, currentInputBox===iNthCoupon&&styles.InputActived]} onPress={toggleCouponInput}>{i18n["coupon.enter.tip"]}</Text>
                :<>
                    <View style={styles.couponInfo}>
                        <Text style={[fs14, fwB]}>{cpInfos.title}&nbsp;<PosPayIcon name="check-fill" color={moneyInfo.D_C ? tcG0.color : tc99.color} size={14} /></Text>
                        <Text style={[fs12, moneyInfo.D_C ? tcG0 : tc99]}>{i18n[cpInfos.distype===DISCOUNT_TYPE_LJ ? "coupon.reduction" : "coupon.off"].cloze(cpInfos.condition, cpInfos.discount)}</Text>
                    </View>
                    <Text style={[styles.couponInput, currentInputBox===iNthCoupon&&styles.InputActived]} onPress={toggleCouponInput}>-{moneyInfo.D_C}</Text>
                </>}
            </View>
            <View style={[fxHC, styles.rowBox]}>
                <Text style={[fxG1, styles.paymentLabel]}>{i18n["payment.method"]}</Text>
                <Text style={styles.paymentLabel}>{i18n["credit.card"]}</Text>
            </View>
            <View style={[fxR, fxWP, pdHX]}>
                <TouchableOpacity activeOpacity={0.5} style={[styles.paymentBox, styles.paymentSelected]}>
                    <Image style={whF} source={LocalPictures.creditCardList} />
                    <PosPayIcon name="check-fill" color={appMainColor} size={20} style={styles.paymentChecked} />
                </TouchableOpacity>
            </View>
            <Text style={fxG1} onPress={togglePKHidden}>{/* 点我关闭键盘 */}</Text>
            {!!payAmounts && <View style={styles.paymentDetails}>
                <View style={fxHC}>
                    <Text style={[fs12, fxG1]}>{i18n["input.amount"]}</Text>
                    <Text style={fs12}><Text style={fwB}>{$tofixed(payAmounts)}</Text> {appSettings.regionalCurrencyUnit}</Text>
                </View>
                <View style={appSettings.generalTaxRate > 0 ? fxHC : dpN}>{/* 小于等于0，表示不使用税收功能！ */}
                    <Text style={fs12}>{i18n["tax"]}</Text>
                    <Text style={[fs12, tc99, fxG1]}>&nbsp;({appSettings.generalTaxRate}%)</Text>
                    <Text style={fs12}><Text style={fwB}>{moneyInfo.T_X}</Text> {appSettings.regionalCurrencyUnit}</Text>
                </View>
                <View style={fxHC}>
                    <Text style={[fs12, fxG1]}>{i18n["coupon.discount"]}</Text>
                    <Text style={[fs12, tcG0]}><Text style={fwB}>-{moneyInfo.D_C}</Text> {appSettings.regionalCurrencyUnit}</Text>
                </View>
                <TouchableOpacity style={fxHC} activeOpacity={0.5} onPress={showAmountCalcRule}>
                    <Text style={fs12}>{i18n["final.amount"]}</Text>
                    <PosPayIcon name="help-stroke" size={12} color={appMainColor} offset={5} />
                    <Text style={[fxG1, fs12, tcR0, taR]}><Text style={fwB}>{moneyInfo.F_A}</Text> {appSettings.regionalCurrencyUnit}</Text>
                </TouchableOpacity>
            </View>}
            <View style={pdX}>
                <GradientButton onPress={startPayMoney}>{i18n["btn.collect"]}</GradientButton>
            </View>
        </ScrollView>
    );
}

//电子钱包
function tabEWallet(props){
    const i18n = useI18N();
    const appSettings = useAppSettings();
    const [payAmounts, setPayAmounts] = useState("");
    const [moneyInfo, setMoneyInfo] = useState({}); //收款信息
    const [cpInfos, setCpInfos] = useState(null);
    const [paymentIndex, setPaymentIndex] = useState(0);
    const [currentInputBox, setCurrentInputBox] = useState(0);
    
    const toggleAmountInput = () => {
        DeviceEventEmitter.emit(eventEmitterName, {
            nth: (currentInputBox !== iNthAmount ? iNthAmount : iNthNone), 
            txt: payAmounts,
            action: onInputToggle
        });
    }
    const toggleCouponInput = () => {
        DeviceEventEmitter.emit(eventEmitterName, {
            nth: iNthCoupon,
            txt: (cpInfos?.cpcode || ""),
            action: onInputToggle
        });
    }
    const togglePayment = (idx) => {
        return function() {
            setPaymentIndex(idx);
            togglePKHidden(currentInputBox);
        }
    }
    const scanCouponCode = () => {//点击钱包扫码识别
        togglePKHidden(currentInputBox);
        QRcodeScanner.openScanner(onScanFinish);
    }
    const startPayMoney = () => {
        callPayment(payAmounts, moneyInfo.D_C, moneyInfo.T_X, cpInfos?.cpcode, eWalletList[paymentIndex].pmcode, cpInfos?.ptcode);
    }
    
    useEffect(() => {
        const evt2000 = DeviceEventEmitter.addListener(eventEmitterName, function(infos){
            switch(infos.action){
                case onInputChange:
                    if(infos.nth === iNthAmount){
                        setPayAmounts(infos.txt);
                    }
                    break;
                case onInputToggle:
                    setCurrentInputBox(infos.nth);
                    break;
                case onTransactionSuccess: //交易成功重置数据
                    setPayAmounts("");
                    setCpInfos(null);
                    setCurrentInputBox(iNthNone);
                    break;
                case onCouponInfo:
                    setCpInfos(infos.cpinfo);
                    break;
            }
        });
        return () => { 
            evt2000.remove();
        }
    }, []);
    
    useEffect(() => {
        const mi = calcPaymentInfo(payAmounts, cpInfos?.discount, cpInfos?.distype, cpInfos?.condition, appSettings.generalTaxRate);
        
        //加入防抖功能
        appSettings.customerDisplayShowPayAmountInfo && $debounce(CustomerDisplay.showPayAmountInfo, 800, {
            total: payAmounts,
            tax: mi.T_X,
            discount: mi.D_C,
            amount: mi.F_A,
            cysymbol: appSettings.regionalCurrencySymbol
        });
        
        setMoneyInfo(mi);
    }, [payAmounts, appSettings, cpInfos]);
    
    //电子钱包支付界面
    return (
        <ScrollView style={fxG1} contentContainerStyle={mhF}>
            <View style={[fxHC, styles.moneyLabel]}>
                <Text style={[fxG1, fs16]}>{i18n["input.amount"]}</Text>
                <Text style={tc99}>{appSettings.regionalCurrencyUnit}</Text>
            </View>
            <View style={styles.rowBox}>
                <Text style={[styles.moneyInput, currentInputBox===iNthAmount&&styles.InputActived]} onPress={toggleAmountInput}>{appSettings.regionalCurrencySymbol}{payAmounts}</Text>
            </View>
            <Pressable style={[fxHC, styles.couponLabel]} android_ripple={tcCC} onPress={scanCouponCode}>
                <Text style={[fxG1, fs16]}>{i18n["coupon"]}</Text>
                <Text style={[tcMC, mgRX]}>{i18n["qrcode.identify"]}</Text>
                <PosPayIcon name="qrcode-scan" color={appMainColor} size={24} />
            </Pressable>
            <View style={pdHX}>
                {!cpInfos ? 
                    <Text style={[styles.couponInput, styles.couponEmpty, currentInputBox===iNthCoupon&&styles.InputActived]} onPress={toggleCouponInput}>{i18n["coupon.enter.tip"]}</Text>
                :<>
                    <View style={styles.couponInfo}>
                        <Text style={[fs14, fwB]}>{cpInfos.title}&nbsp;<PosPayIcon name="check-fill" color={moneyInfo.D_C ? tcG0.color : tc99.color} size={14} /></Text>
                        <Text style={[fs12, moneyInfo.D_C ? tcG0 : tc99]}>{i18n[cpInfos.distype===DISCOUNT_TYPE_LJ ? "coupon.reduction" : "coupon.off"].cloze(cpInfos.condition, cpInfos.discount)}</Text>
                    </View>
                    <Text style={[styles.couponInput, currentInputBox===iNthCoupon&&styles.InputActived]} onPress={toggleCouponInput}>-{moneyInfo.D_C}</Text>
                </>}
            </View>
            <View style={[fxHC, styles.rowBox]}>
                <Text style={[fxG1, styles.paymentLabel]}>{i18n["payment.method"]}</Text>
                <Text style={styles.paymentLabel}>{eWalletList[paymentIndex].name}</Text>
            </View>
            <View style={[fxR, fxWP, pdHX]}>
                {eWalletList.map((vx, ix) => (
                    <TouchableOpacity key={vx.name} activeOpacity={0.5} onPress={togglePayment(ix)} style={[styles.paymentBox, paymentIndex===ix&&styles.paymentSelected]}>
                        <Image style={whF} source={LocalPictures[vx.logo]} />
                        <PosPayIcon visible={paymentIndex===ix} name="check-fill" color={appMainColor} size={20} style={styles.paymentChecked} />
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={fxG1} onPress={togglePKHidden}>{/* 点我关闭键盘 */}</Text>
            {!!payAmounts && <View style={styles.paymentDetails}>
                <View style={fxHC}>
                    <Text style={[fs12, fxG1]}>{i18n["input.amount"]}</Text>
                    <Text style={fs12}><Text style={fwB}>{$tofixed(payAmounts)}</Text> {appSettings.regionalCurrencyUnit}</Text>
                </View>
                <View style={appSettings.generalTaxRate > 0 ? fxHC : dpN}>{/* 小于等于0，表示不使用税收功能！ */}
                    <Text style={fs12}>{i18n["tax"]}</Text>
                    <Text style={[fs12, tc99, fxG1]}>&nbsp;({appSettings.generalTaxRate}%)</Text>
                    <Text style={fs12}><Text style={fwB}>{moneyInfo.T_X}</Text> {appSettings.regionalCurrencyUnit}</Text>
                </View>
                <View style={fxHC}>
                    <Text style={[fs12, fxG1]}>{i18n["coupon.discount"]}</Text>
                    <Text style={[fs12, tcG0]}><Text style={fwB}>-{moneyInfo.D_C}</Text> {appSettings.regionalCurrencyUnit}</Text>
                </View>
                <TouchableOpacity style={fxHC} activeOpacity={0.5} onPress={showAmountCalcRule}>
                    <Text style={fs12}>{i18n["final.amount"]}</Text>
                    <PosPayIcon name="help-stroke" size={12} color={appMainColor} offset={5} />
                    <Text style={[fxG1, fs12, tcR0, taR]}><Text style={fwB}>{moneyInfo.F_A}</Text> {appSettings.regionalCurrencyUnit}</Text>
                </TouchableOpacity>
            </View>}
            <View style={pdX}>
                <GradientButton onPress={startPayMoney}>{i18n["btn.collect"]}</GradientButton>
            </View>
        </ScrollView>
    );
}

//二维码
function tabQRCode(props){
    const i18n = useI18N();
    const appSettings = useAppSettings();
    const [payAmounts, setPayAmounts] = useState("");
    const [moneyInfo, setMoneyInfo] = useState({}); //收款信息
    const [cpInfos, setCpInfos] = useState(null);
    const [currentInputBox, setCurrentInputBox] = useState(0);
    
    const toggleAmountInput = () => {
        DeviceEventEmitter.emit(eventEmitterName, {
            nth: (currentInputBox !== iNthAmount ? iNthAmount : iNthNone), 
            txt: payAmounts,
            action: onInputToggle
        });
    }
    const toggleCouponInput = () => {
        DeviceEventEmitter.emit(eventEmitterName, {
            nth: iNthCoupon,
            txt: (cpInfos?.cpcode || ""),
            action: onInputToggle
        });
    }
    const scanCouponCode = () => {
        togglePKHidden(currentInputBox);
        QRcodeScanner.openScanner(onScanFinish);
    }
    const startPayMoney = () => {
        callPayment(payAmounts, moneyInfo.D_C, moneyInfo.T_X, cpInfos?.cpcode, QR_CODE_PAYMENT_CODE, cpInfos?.ptcode);
    }
    const gotoSupportPayment = () => {
        DeviceEventEmitter.emit(eventEmitterName, {
            action: onSeePayments
        });
    }
    
    useEffect(() => {
        const evt3000 = DeviceEventEmitter.addListener(eventEmitterName, function(infos){
            switch(infos.action){
                case onInputChange:
                    if(infos.nth === iNthAmount){
                        setPayAmounts(infos.txt);
                    }
                    break;
                case onInputToggle:
                    setCurrentInputBox(infos.nth);
                    break;
                case onTransactionSuccess: //交易成功重置数据
                    setPayAmounts("");
                    setCpInfos(null);
                    setCurrentInputBox(iNthNone);
                    break;
                case onCouponInfo:
                    setCpInfos(infos.cpinfo);
                    break;
            }
        });
        return () => { 
            evt3000.remove();
        }
    }, []);
    
    useEffect(() => {
        const mi = calcPaymentInfo(payAmounts, cpInfos?.discount, cpInfos?.distype, cpInfos?.condition, appSettings.generalTaxRate);
        
        //加入防抖功能
        appSettings.customerDisplayShowPayAmountInfo && $debounce(CustomerDisplay.showPayAmountInfo, 800, {
            total: payAmounts,
            tax: mi.T_X,
            discount: mi.D_C,
            amount: mi.F_A,
            cysymbol: appSettings.regionalCurrencySymbol
        });
        
        setMoneyInfo(mi);
    }, [payAmounts, appSettings, cpInfos]);
    
    //二维码支付界面
    return (
        <ScrollView style={fxG1} contentContainerStyle={mhF}>
            <View style={[fxHC, styles.moneyLabel]}>
                <Text style={[fxG1, fs16]}>{i18n["input.amount"]}</Text>
                <Text style={tc99}>{appSettings.regionalCurrencyUnit}</Text>
            </View>
            <View style={styles.rowBox}>
                <Text style={[styles.moneyInput, currentInputBox===iNthAmount&&styles.InputActived]} onPress={toggleAmountInput}>{appSettings.regionalCurrencySymbol}{payAmounts}</Text>
            </View>
            <Pressable style={[fxHC, styles.couponLabel]} android_ripple={tcCC} onPress={scanCouponCode}>
                <Text style={[fxG1, fs16]}>{i18n["coupon"]}</Text>
                <Text style={[tcMC, mgRX]}>{i18n["qrcode.identify"]}</Text>
                <PosPayIcon name="qrcode-scan" color={appMainColor} size={24} />
            </Pressable>
            <View style={pdHX}>
                {!cpInfos ? 
                    <Text style={[styles.couponInput, styles.couponEmpty, currentInputBox===iNthCoupon&&styles.InputActived]} onPress={toggleCouponInput}>{i18n["coupon.enter.tip"]}</Text>
                :<>
                    <View style={styles.couponInfo}>
                        <Text style={[fs14, fwB]}>{cpInfos.title}&nbsp;<PosPayIcon name="check-fill" color={moneyInfo.D_C ? tcG0.color : tc99.color} size={14} /></Text>
                        <Text style={[fs12, moneyInfo.D_C ? tcG0 : tc99]}>{i18n[cpInfos.distype===DISCOUNT_TYPE_LJ ? "coupon.reduction" : "coupon.off"].cloze(cpInfos.condition, cpInfos.discount)}</Text>
                    </View>
                    <Text style={[styles.couponInput, currentInputBox===iNthCoupon&&styles.InputActived]} onPress={toggleCouponInput}>-{moneyInfo.D_C}</Text>
                </>}
            </View>
            <View style={[fxHC, styles.rowBox]}>
                <Text style={[fxG1, styles.paymentLabel]}>{i18n["payment.method"]}</Text>
                <Text style={[styles.paymentLabel, tc99]} onPress={gotoSupportPayment}>{i18n["payment.supports"]}</Text>
                <PosPayIcon name="right-arrow-double" style={{marginTop: 10}} color="#999" size={14} offset={2} />
            </View>
            <TouchableOpacity style={fxVM} onPress={startPayMoney} activeOpacity={0.5}>
                <Image style={styles.paymentScaning} source={LocalPictures.scanQRcode} />
                <Text style={[tcMC, mgTX]}>{i18n["qrcode.collect"]}</Text>
            </TouchableOpacity>
            <View style={fxG1}>{/* 占位专用 */}</View>
            {!!payAmounts && <View style={styles.paymentDetails}>
                <View style={fxHC}>
                    <Text style={[fs12, fxG1]}>{i18n["input.amount"]}</Text>
                    <Text style={fs12}><Text style={fwB}>{$tofixed(payAmounts)}</Text> {appSettings.regionalCurrencyUnit}</Text>
                </View>
                <View style={appSettings.generalTaxRate > 0 ? fxHC : dpN}>{/* 小于等于0，表示不使用税收功能！ */}
                    <Text style={fs12}>{i18n["tax"]}</Text>
                    <Text style={[fs12, tc99, fxG1]}>&nbsp;({appSettings.generalTaxRate}%)</Text>
                    <Text style={fs12}><Text style={fwB}>{moneyInfo.T_X}</Text> {appSettings.regionalCurrencyUnit}</Text>
                </View>
                <View style={fxHC}>
                    <Text style={[fs12, fxG1]}>{i18n["coupon.discount"]}</Text>
                    <Text style={[fs12, tcG0]}><Text style={fwB}>-{moneyInfo.D_C}</Text> {appSettings.regionalCurrencyUnit}</Text>
                </View>
                <TouchableOpacity style={fxHC} activeOpacity={0.5} onPress={showAmountCalcRule}>
                    <Text style={fs12}>{i18n["final.amount"]}</Text>
                    <PosPayIcon name="help-stroke" size={12} color={appMainColor} offset={5} />
                    <Text style={[fxG1, fs12, tcR0, taR]}><Text style={fwB}>{moneyInfo.F_A}</Text> {appSettings.regionalCurrencyUnit}</Text>
                </TouchableOpacity>
            </View>}
            <View style={{height: 20}}>{/* 占位用 */}</View>
        </ScrollView>
    );
}

//自定义标签项
function customTabItem(args){
    let iconName = null;
    switch(args.route.key){
        case "tabBankCard": iconName = "bank-card"; break;
        case "tabEWallet": iconName = "e-wallet"; break;
        case "tabQRCode": iconName = "qrcode-pay"; break;
    }
    
    return (
        <View style={fxHC}>
            <PosPayIcon name={iconName} color={args.focused ? styles.tabActived.color : styles.tabInactived.color} size={20} />
            <Text style={args.focused ? styles.tabActived : styles.tabInactived} numberOfLines={1}>{args.route.title}</Text>
        </View>
    )
}

//自定义顶部标签页
function customTabBar(props) {
    //是否显示页面标头
    const isehh = (props.navigationState.routes.length ? props.navigationState.routes[0].isehh : true); //is enable home header
    return (
        <TabBar
            {...props}
            scrollEnabled={true}
            renderLabel={customTabItem}
            indicatorStyle={styles.tabIndicator}
            tabStyle={styles.tabItem}
            style={isehh ? styles.tabBar1 : styles.tabBar2}
        />
    );
}

export default function IndexHome(props){
    const i18n = useI18N();
    const pkRef = useRef();
    const appSettings = useAppSettings();
    const [tabList, setTabList] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [inputIndex, setInputIndex] = useState(0);
    
    const openDrawer = () => {
        props.navigation.openDrawer();
    }
    const onTxtChange = (txt) => {
        DeviceEventEmitter.emit(eventEmitterName, { 
            nth: inputIndex, 
            txt: txt,
            action: onInputChange
        });
    }
    const gotoSettingPage = () => {
        props.navigation.navigate("设置页"); //跳转到设置页
    }
    const useTheCoupon = (cpinfo) => {
        DeviceEventEmitter.emit(eventEmitterName, {
            action: onCouponInfo,
            cpinfo: cpinfo
        });
    }
    
    useEffect(() => {
        const eventer9000 = DeviceEventEmitter.addListener(eventEmitterName, function(infos){
            switch(infos.action){
                case onInputToggle:
                    if(infos.nth === iNthAmount){
                        setInputIndex(infos.nth);
                        pkRef.current.initiText(infos.txt);
                    } else {
                        setInputIndex(iNthNone);
                        pkRef.current.clearText();
                    }
                    
                    if(infos.nth === iNthCoupon){
                        props.navigation.navigate(!infos.txt ? "优惠券查询" : "优惠券选择", { 
                            couponCode: infos.txt, 
                            onGoBack: useTheCoupon,
                        });
                    }
                    break;
                case onTransactionSuccess:
                    setInputIndex(iNthNone); //交易成功，重置一些信息
                    props.navigation.navigate("支付成功", infos); //如果交易成功，则跳转到交易成功页面
                    break;
                case onSeePayments:
                    props.navigation.navigate("支付合作商");
                    break;
            }
        });
        
        return () => {
            eventer9000.remove();
        }
    }, []);
    
    useEffect(() => {
        setTabList([
            { key: "tabBankCard", title: i18n["credit.card"], isehh: appSettings.isEnableHomeHeader },
            { key: "tabEWallet", title: i18n["e.wallet"] },
            { key: "tabQRCode", title: i18n["qrcode.pay"] },
        ]);
    }, [i18n, appSettings]);

    return (
        <View style={pgFF}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            {appSettings.isEnableHomeHeader &&
                <View style={[fxVM, styles.headerBox]}>
                    <ImageButton visible={appSettings.isEnableDrawer} source={LocalPictures.iconToggleDrawer} style={styles.toggleIcon} onPress={openDrawer} />
                    <Text style={fs20}>{i18n["tabbar.home"]}</Text>
                </View>
            }
            <TabView
                navigationState={{ index: tabIndex, routes: tabList }}
                renderScene={renderScene}
                onIndexChange={setTabIndex}
                initialLayout={styles.tabView}
                renderTabBar={customTabBar}
            />
            <PayKeyboard
                ref={pkRef} 
                fixed={true}
                visible={inputIndex > 0} 
                precision={0} 
                onSetting={appSettings.isEnableDrawer || appSettings.isEnableTabbar ? null : gotoSettingPage /* 两者都不显示时，则显示跳转到设置页的小图标 */}
                onChange={onTxtChange} 
                onClose={togglePKHidden} 
                onConfirm={togglePKHidden}
            />
        </View>
    );
}