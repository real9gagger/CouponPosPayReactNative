import { useEffect, useState, useRef } from "react";
import { ScrollView, View, Text, Pressable, Image, StatusBar, StyleSheet, ActivityIndicator, TouchableOpacity, DeviceEventEmitter } from "react-native";
import { useI18N, getI18N, useAppSettings } from "@/store/getter";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { eWalletList, allPayTypeMap, CASH_PAYMENT_CODE, CREDIT_CARD_PAYMENT_CODE, QR_CODE_PAYMENT_CODE, DISCOUNT_TYPE_LJ, TRANSACTION_TYPE_RECEIVE } from "@/common/Statics";
import { parseCouponScanResult, queryCouponScanResult, checkCouponExpiration } from "@/utils/helper";
import { dispatchSetLastUsed } from "@/store/setter";
import CustomerDisplay from "@/modules/CustomerDisplay";
import LocalPictures from "@/common/Pictures";
import QRcodeScanner from "@/modules/QRcodeScanner";
import PaymentHelper from "@/modules/PaymentHelper";
import ImageButton from "@/components/ImageButton";
import PayKeyboard from "@/components/PayKeyboard";
import PosPayIcon from "@/components/PosPayIcon";
import GradientButton from "@/components/GradientButton";
import CollectInfoPanel from "@/components/CollectInfoPanel";

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
        paddingLeft: 2.5
    },
    tabInactived: {
        color: "#333",
        fontSize: 14,
        fontWeight: "bold",
        paddingLeft: 2.5
    },
    tabView: {
        width: deviceDimensions.screenWidth
    },
    tabItemElt1: {//等于小于1个标签页时使用的样式
        width: deviceDimensions.screenWidth / 1.0
    },
    tabItemEq2: {//等于2个标签页时使用的样式
        width: deviceDimensions.screenWidth / 2.0
    },
    tabItemEq3: {//等于3个标签页时使用的样式
        width: deviceDimensions.screenWidth / 3.0
    },
    tabItemEgt4: {//等于大于4个标签页时使用的样式
        width: deviceDimensions.screenWidth / 3.5
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
    queryingCouponBox: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "rgba(255,255,255,0.6)"
    }
});
const renderScene = SceneMap({ tabBankCard, tabEWallet, tabQRCode, tabCashPay });
const eventEmitterName = "HOME_EVENT_BUS"; //事件总枢纽
const onInputToggle = "ON_INPUT_TOGGLE"; //切换输入框
const onInputChange = "ON_INPUT_CHANGE"; //文本变化
const onTransactionSuccess = "ON_TRANSACTION_SUCCESS"; //建议成功时触发
const onSeePayments = "ON_SEE_PAYMENTS"; //查看支持的支付方式
const onCouponInfo = "ON_COUPON_INFO"; //接收到优惠券信息
const onViewCalcRule = "ON_VIEW_CALC_RULE"; //查看计算规则
const onQueryingCoupon = "ON_QUERYING_COUPON"; //正在查询优惠券
const iNthNone = 0;
const iNthAmount = 1;
const iNthCoupon = 2;

//扫描二维码结束后调用
function onScanFinish(dat){
    if(dat.scanResult){
        /* 扫码后原本是跳转到 “优惠券选择” 页，2024年4月7日弃用，改成扫码后直接计算优惠信息 DeviceEventEmitter.emit(eventEmitterName, {
            nth: iNthCoupon, 
            txt: dat.scanResult,
            action: onInputToggle
        }); */
        
        const theCoupon = parseCouponScanResult(dat.scanResult);
        if(theCoupon){
            if(!checkCouponExpiration(theCoupon.expiration)){
                return !$notify.error(getI18N("coupon.errmsg2")); //优惠券已过期
            }
            
            DeviceEventEmitter.emit(eventEmitterName, {
                cpinfo: theCoupon, 
                action: onCouponInfo,
            });
            
            dispatchSetLastUsed(theCoupon); //设置为正在使用的优惠券
        } else {
            //一秒钟还没找到优惠券？赶紧显示加载提示框！
            const timerID = setTimeout(() => {
                DeviceEventEmitter.emit(eventEmitterName, {
                    action: onQueryingCoupon,
                    querying: true
                });
            }, 1000);
            
            //2024年9月2日 如果格式不对，就到后台查吧！
            queryCouponScanResult(dat.scanResult).then(res => {
                clearTimeout(timerID);
                DeviceEventEmitter.emit(eventEmitterName, {
                    action: onQueryingCoupon,
                    querying: false
                });
                DeviceEventEmitter.emit(eventEmitterName, {
                    cpinfo: res, 
                    action: onCouponInfo,
                });
                dispatchSetLastUsed(res); //设置为正在使用的优惠券
            }).catch(err => {
                clearTimeout(timerID);
                DeviceEventEmitter.emit(eventEmitterName, {
                    action: onQueryingCoupon,
                    querying: false
                });
                $notify.error(getI18N("qrcode.failed")); //识别二维码失败
            });
        }
    } else {
        //取消扫码了
        //return !$notify.error(getI18N("qrcode.invalid")); //无效的二维码
    }
}

//调用支付功能
function callPayment(payMoney, disMoney, taxMoney, finalMoney, paymentCode, couponCode, promotionCode){
    if(/^0*$/.test(payMoney)){
        return !$notify.info(getI18N("input.amount.tip"));
    }
    
    //以下属性数据类型都是字符串！
    PaymentHelper.startPay({
        transactionType: TRANSACTION_TYPE_RECEIVE, //1-付款，2-取消付款，3-退款
        transactionMode: (runtimeEnvironment.isProduction ? "1" : "2"), //1-正常，2-练习
        paymentType: paymentCode,
        amount: finalMoney, //至少一块钱，否则报错
        tax: taxMoney, //税费
        slipNumber: "" //单据号码，取消付款或者退款时才用到！
    }, function(payRes){
        if(!payRes){
            $alert(getI18N("payment.errmsg1")); //不支持支付功能
        } else if(payRes.activityResultCode === 0 && payRes.transactionTime){//用户支付已成功
        
            if(payRes.amount != finalMoney){
                console.log(`POS机的交易金额（${payRes.amount}）和本APP的实际收款（${finalMoney}）不一致，交易金额已改为本APP的实际收款金额！`);
            }
            
            payRes.action = onTransactionSuccess;
            payRes.discountAmount = -disMoney; //优惠总金额（此处的 disMoney 大于等于 0，因此要改成负数）
            payRes.orderAmount = payMoney; //订单总金额
            payRes.amount = (runtimeEnvironment.isProduction ? payRes.amount : finalMoney); //练习模式返回的交易金额不对，因此需要特殊处理！
            payRes.couponCode = couponCode; //优惠码
            payRes.remark = (runtimeEnvironment.isProduction ? "" : "开发测试的数据");
            payRes.tax = (payRes.tax || taxMoney);
            payRes.distributorNumber = promotionCode; //分销码。历史原因导致命名为 “distributorNumber”（分销员编号）

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
            T_X: "0", //tax
            F_A: "0", //final amount
            D_C: "0", //discount
            D_A: false //discount available 
        };
    } else {
        //必须满足条件才能优惠
        const dddd = (!dc || tl < cd) ? 0 : (dt === DISCOUNT_TYPE_LJ ? Math.min(tl, dc) : (tl * dc / 100));
        const temp = (!rt) ? 0 : (tl * rt / 100); //计算税
        return {
            T_X: $tofixed(temp), //税
            F_A: $tofixed(+tl + temp - dddd), //实际收款金额
            D_C: $tofixed(dddd), //优惠金额（正数！）
            D_A: !!dddd //是否有优惠
        };
    }
}

//显示实际收款金额的计算规则
function showAmountCalcRule(){
    DeviceEventEmitter.emit(eventEmitterName, {
        action: onViewCalcRule
    });
}

//跳转到支持的支付方式
function gotoSupportPayment(){
    DeviceEventEmitter.emit(eventEmitterName, {
        action: onSeePayments
    });
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
        callPayment(
            payAmounts, 
            moneyInfo.D_C, 
            moneyInfo.T_X, 
            moneyInfo.F_A,
            CREDIT_CARD_PAYMENT_CODE,
            cpInfos?.cpcode, 
            cpInfos?.ptcode
        );
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
                    setCurrentInputBox(iNthCoupon);
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
            <TouchableOpacity style={pdHX} activeOpacity={0.6} onPress={toggleCouponInput}>
                {!cpInfos ? 
                    <Text style={[styles.couponInput, styles.couponEmpty, currentInputBox===iNthCoupon&&styles.InputActived]}>{i18n["coupon.enter.tip"]}</Text>
                :<>
                    <View style={styles.couponInfo}>
                        <Text style={[fs14, fwB]}>{cpInfos.title}&nbsp;<PosPayIcon name="check-fill" color={moneyInfo.D_A ? tcG0.color : tc99.color} size={14} /></Text>
                        <Text style={[fs12, moneyInfo.D_A ? tcG0 : tc99]}>{i18n[cpInfos.distype===DISCOUNT_TYPE_LJ ? "coupon.reduction" : "coupon.off"].cloze(cpInfos.condition, cpInfos.discount)}</Text>
                    </View>
                    <Text style={[styles.couponInput, currentInputBox===iNthCoupon&&styles.InputActived]}>-{moneyInfo.D_C}</Text>
                </>}
            </TouchableOpacity>
            <View style={[fxHC, styles.rowBox]}>
                <Text style={[fxG1, styles.paymentLabel]}>{i18n["payment.method"]}</Text>
                <Text style={styles.paymentLabel} onPress={gotoSupportPayment}>{i18n["credit.card"]}</Text>
            </View>
            <View style={[fxR, fxWP, pdHX]}>
                <TouchableOpacity activeOpacity={0.5} style={[styles.paymentBox, styles.paymentSelected]}>
                    <Image style={whF} source={LocalPictures.creditCardList} />
                    <PosPayIcon name="check-fill" color={appMainColor} size={20} style={styles.paymentChecked} />
                </TouchableOpacity>
            </View>
            <Text style={fxG1} onPress={togglePKHidden}>{/* 点我关闭键盘 */}</Text>
            <CollectInfoPanel
                visiable={!!payAmounts}
                currencyUnit={appSettings.regionalCurrencyUnit}
                taxRate={appSettings.generalTaxRate}
                labelOrderAmout={i18n["input.amount"]}
                labelTax={i18n["tax"]}
                labelDiscount={i18n["coupon.discount"]}
                labelFinalAmount={i18n["final.amount"]}
                orderAmout={$tofixed(payAmounts)}
                finalTax={moneyInfo.T_X}
                finalDiscount={moneyInfo.D_C}
                finalAmount={moneyInfo.F_A}
                onQuestion={showAmountCalcRule}
            />
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
        callPayment(
            payAmounts, 
            moneyInfo.D_C, 
            moneyInfo.T_X, 
            moneyInfo.F_A,
            eWalletList[paymentIndex].pmcode, 
            cpInfos?.cpcode, 
            cpInfos?.ptcode
        );
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
                    setCurrentInputBox(iNthCoupon);
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
            <TouchableOpacity style={pdHX} activeOpacity={0.6} onPress={toggleCouponInput}>
                {!cpInfos ? 
                    <Text style={[styles.couponInput, styles.couponEmpty, currentInputBox===iNthCoupon&&styles.InputActived]}>{i18n["coupon.enter.tip"]}</Text>
                :<>
                    <View style={styles.couponInfo}>
                        <Text style={[fs14, fwB]}>{cpInfos.title}&nbsp;<PosPayIcon name="check-fill" color={moneyInfo.D_A ? tcG0.color : tc99.color} size={14} /></Text>
                        <Text style={[fs12, moneyInfo.D_A ? tcG0 : tc99]}>{i18n[cpInfos.distype===DISCOUNT_TYPE_LJ ? "coupon.reduction" : "coupon.off"].cloze(cpInfos.condition, cpInfos.discount)}</Text>
                    </View>
                    <Text style={[styles.couponInput, currentInputBox===iNthCoupon&&styles.InputActived]}>-{moneyInfo.D_C}</Text>
                </>}
            </TouchableOpacity>
            <View style={[fxHC, styles.rowBox]}>
                <Text style={[fxG1, styles.paymentLabel]}>{i18n["payment.method"]}</Text>
                <Text style={styles.paymentLabel} onPress={gotoSupportPayment}>{eWalletList[paymentIndex].name}</Text>
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
            <CollectInfoPanel
                visiable={!!payAmounts}
                currencyUnit={appSettings.regionalCurrencyUnit}
                taxRate={appSettings.generalTaxRate}
                labelOrderAmout={i18n["input.amount"]}
                labelTax={i18n["tax"]}
                labelDiscount={i18n["coupon.discount"]}
                labelFinalAmount={i18n["final.amount"]}
                orderAmout={$tofixed(payAmounts)}
                finalTax={moneyInfo.T_X}
                finalDiscount={moneyInfo.D_C}
                finalAmount={moneyInfo.F_A}
                onQuestion={showAmountCalcRule}
            />
            <View style={pdX}>
                <GradientButton onPress={startPayMoney}>{i18n["btn.collect"]}</GradientButton>
            </View>
        </ScrollView>
    );
}

//二维码收款
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
        callPayment(
            payAmounts, 
            moneyInfo.D_C, 
            moneyInfo.T_X, 
            moneyInfo.F_A,
            QR_CODE_PAYMENT_CODE, 
            cpInfos?.cpcode, 
            cpInfos?.ptcode
        );
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
                    setCurrentInputBox(iNthCoupon);
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
            <TouchableOpacity style={pdHX} activeOpacity={0.6} onPress={toggleCouponInput}>
                {!cpInfos ? 
                    <Text style={[styles.couponInput, styles.couponEmpty, currentInputBox===iNthCoupon&&styles.InputActived]}>{i18n["coupon.enter.tip"]}</Text>
                :<>
                    <View style={styles.couponInfo}>
                        <Text style={[fs14, fwB]}>{cpInfos.title}&nbsp;<PosPayIcon name="check-fill" color={moneyInfo.D_A ? tcG0.color : tc99.color} size={14} /></Text>
                        <Text style={[fs12, moneyInfo.D_A ? tcG0 : tc99]}>{i18n[cpInfos.distype===DISCOUNT_TYPE_LJ ? "coupon.reduction" : "coupon.off"].cloze(cpInfos.condition, cpInfos.discount)}</Text>
                    </View>
                    <Text style={[styles.couponInput, currentInputBox===iNthCoupon&&styles.InputActived]}>-{moneyInfo.D_C}</Text>
                </>}
            </TouchableOpacity>
            <View style={[fxHC, styles.rowBox]}>
                <Text style={[fxG1, styles.paymentLabel]}>{i18n["payment.method"]}</Text>
                <Text style={styles.paymentLabel} onPress={gotoSupportPayment}>{i18n["qrcode.pay"]}</Text>
            </View>
            <TouchableOpacity style={fxVM} onPress={startPayMoney} activeOpacity={0.5}>
                <Image style={styles.paymentScaning} source={LocalPictures.scanQRcode} />
                <Text style={[tcMC, mgTX]}>{i18n["qrcode.collect"]}</Text>
            </TouchableOpacity>
            <View style={fxG1}>{/* 占位专用 */}</View>
            <CollectInfoPanel
                visiable={!!payAmounts}
                currencyUnit={appSettings.regionalCurrencyUnit}
                taxRate={appSettings.generalTaxRate}
                labelOrderAmout={i18n["input.amount"]}
                labelTax={i18n["tax"]}
                labelDiscount={i18n["coupon.discount"]}
                labelFinalAmount={i18n["final.amount"]}
                orderAmout={$tofixed(payAmounts)}
                finalTax={moneyInfo.T_X}
                finalDiscount={moneyInfo.D_C}
                finalAmount={moneyInfo.F_A}
                onQuestion={showAmountCalcRule}
            />
            <View style={pdX}>
                <GradientButton onPress={startPayMoney}>{i18n["btn.collect"]}</GradientButton>
            </View>
        </ScrollView>
    );
}

//现金收款
function tabCashPay(props){
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
        if(!payAmounts){
            return !$notify.info(i18n["input.amount.tip"]);
        }
        
        $confirm(i18n["cash.receive.tip"], i18n["alert.title"]).then(res => {
            callPayment(
                payAmounts, 
                moneyInfo.D_C, 
                moneyInfo.T_X, 
                moneyInfo.F_A,
                CASH_PAYMENT_CODE, 
                cpInfos?.cpcode, 
                cpInfos?.ptcode
            );
        }).catch(err => {
           console.log("收银员未收到现金...");
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
                    setCurrentInputBox(iNthCoupon);
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
    
    //现金支付界面
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
            <TouchableOpacity style={pdHX} activeOpacity={0.6} onPress={toggleCouponInput}>
                {!cpInfos ? 
                    <Text style={[styles.couponInput, styles.couponEmpty, currentInputBox===iNthCoupon&&styles.InputActived]}>{i18n["coupon.enter.tip"]}</Text>
                :<>
                    <View style={styles.couponInfo}>
                        <Text style={[fs14, fwB]}>{cpInfos.title}&nbsp;<PosPayIcon name="check-fill" color={moneyInfo.D_A ? tcG0.color : tc99.color} size={14} /></Text>
                        <Text style={[fs12, moneyInfo.D_A ? tcG0 : tc99]}>{i18n[cpInfos.distype===DISCOUNT_TYPE_LJ ? "coupon.reduction" : "coupon.off"].cloze(cpInfos.condition, cpInfos.discount)}</Text>
                    </View>
                    <Text style={[styles.couponInput, currentInputBox===iNthCoupon&&styles.InputActived]}>-{moneyInfo.D_C}</Text>
                </>}
            </TouchableOpacity>
            <View style={[fxHC, styles.rowBox]}>
                <Text style={[fxG1, styles.paymentLabel]}>{i18n["payment.method"]}</Text>
                <Text style={styles.paymentLabel} onPress={gotoSupportPayment}>{i18n["cash.pay"]}</Text>
            </View>
            <View style={[fxR, fxWP, pdHX]}>
                <View style={[styles.paymentBox, styles.paymentSelected]}>
                    <Image style={whF} source={LocalPictures.logoCashPay} />
                    <PosPayIcon name="check-fill" color={appMainColor} size={20} style={styles.paymentChecked} />
                </View>
            </View>
            <View style={fxG1}>{/* 占位专用 */}</View>
            <CollectInfoPanel
                visiable={!!payAmounts}
                currencyUnit={appSettings.regionalCurrencyUnit}
                taxRate={appSettings.generalTaxRate}
                labelOrderAmout={i18n["input.amount"]}
                labelTax={i18n["tax"]}
                labelDiscount={i18n["coupon.discount"]}
                labelFinalAmount={i18n["final.amount"]}
                orderAmout={$tofixed(payAmounts)}
                finalTax={moneyInfo.T_X}
                finalDiscount={moneyInfo.D_C}
                finalAmount={moneyInfo.F_A}
                onQuestion={showAmountCalcRule}
            />
            <View style={pdX}>
                <GradientButton onPress={startPayMoney}>{i18n["btn.collect"]}</GradientButton>
            </View>
        </ScrollView>
    );
}

//自定义标签项
function customTabLabel(args){
    return (
        <View style={fxHC}>
            <PosPayIcon name={allPayTypeMap[args.route.key]?.pticon} color={args.focused ? styles.tabActived.color : styles.tabInactived.color} size={18} />
            <Text style={args.focused ? styles.tabActived : styles.tabInactived} numberOfLines={1}>{args.route.title}</Text>
        </View>
    )
}

//自定义标签项（仅有一项标签页时调用）
function oneTabLabel(args){
    return (
        <View style={fxHC}>
            <PosPayIcon name={allPayTypeMap[args.route.key]?.pticon} color={styles.tabInactived.color} size={18} />
            <Text style={styles.tabInactived} numberOfLines={1}>{args.route.title}</Text>
        </View>
    )
}

//自定义顶部标签页
function customTabBar(props) {
    const tabCount = props.navigationState.routes.length;
    const tabItemStyle = 
        (tabCount <= 1 ? styles.tabItemElt1 :
        (tabCount <= 2 ? styles.tabItemEq2 :
        (tabCount <= 3 ? styles.tabItemEq3 : styles.tabItemEgt4)));
    const isehh = (tabCount ? props.navigationState.routes[0].isehh : true); //is enable home header
    
    return (
        <TabBar
            {...props}
            scrollEnabled={true}
            renderLabel={tabCount > 1 ? customTabLabel : oneTabLabel}
            indicatorStyle={tabCount > 1 ? styles.tabIndicator : bgTP}
            tabStyle={tabItemStyle}
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
    const [isQuerying, setIsQuerying] = useState(false);
    
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
                    if(infos.nth !== iNthNone){
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
                case onViewCalcRule:
                    props.navigation.navigate("金额计算规则");
                    break;
                case onQueryingCoupon:
                    setIsQuerying(infos.querying);
                    break;
            }
        });
        
        return () => {
            eventer9000.remove();
        }
    }, []);
    
    useEffect(() => {
        const tabs = [];
        
        if(appSettings.homePayTypeTabs && appSettings.homePayTypeTabs.length){
            for(const item of appSettings.homePayTypeTabs){
                if(!item.disabled){
                    tabs.push({
                        key: item.tabkey,
                        title: i18n[allPayTypeMap[item.tabkey].ptname],
                        isehh: appSettings.isEnableHomeHeader
                    });
                }
            }
        } else {
            for(const kkkk in allPayTypeMap){
                tabs.push({
                    key: kkkk,
                    title: i18n[allPayTypeMap[kkkk].ptname],
                    isehh: appSettings.isEnableHomeHeader
                });
            }
        }
        
        setTabList(tabs);
        
        if(tabIndex >= tabs.length){
            setTabIndex(0);
        }
    }, [i18n, appSettings]);
    
    //没有标签页先不渲染！
    if(!tabList.length){
        return null;
    }

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
            {isQuerying && 
                <View style={[styles.queryingCouponBox, fxVM]}>
                    <ActivityIndicator size={50} color={appMainColor} />
                    <Text style={[mgTX, fs14, tcMC, fwB]}>{i18n["coupon.querying"]}</Text>
                </View>
            }
        </View>
    );
}