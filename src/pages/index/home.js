import { useEffect, useState, useRef } from "react";
import { ScrollView, View, Text, Pressable , Image, StatusBar, StyleSheet, TouchableOpacity, DeviceEventEmitter } from "react-native";
import { useI18N, useAppSettings } from "@/store/getter";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
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
    InputActived: {
        borderBottomColor: appMainColor,
        backgroundColor: "#e5faf3"
    },
    paymentLabel: {
        fontSize: 16,
        paddingTop: 10
    },
    paymentBox: {
        width: 100,
        height: 100,
        padding: 5,
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        marginTop: 5,
        marginRight: 5
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
        padding: 15,
        marginTop: 15
    },
    paymentQrcode: {
        width: 60,
        height: 60
    }
});
const renderScene = SceneMap({ tabBankCard, tabEWallet, tabQRCode });
const onInputToggle = "ON_INPUT_TOGGLE"; //切换输入框
const onInputChange = "ON_INPUT_CHANGE";
const bankCardList = [
    {
        logo: LocalPictures.logoChinaUnionpay,
        name: "银联/UnionPay",
        pmcode: "01" //Payment Code
    }
];
const eWalletList = [
    {
        logo: LocalPictures.logoIdCredit,
        name: "iD",
        pmcode: "02-01" //Payment Code
    },
    {
        logo: LocalPictures.logoJiaotongxiIC,
        name: "交通系IC",
        pmcode: "02-02"
    },
    {
        logo: LocalPictures.logoLetianEdy,
        name: "楽天Edy",
        pmcode: "02-03"
    },
    {
        logo: LocalPictures.logoWaon,
        name: "WAON",
        pmcode: "02-04"
    },
    {
        logo: LocalPictures.logoNanaco,
        name: "nanaco",
        pmcode: "02-05"
    },
    {
        logo: LocalPictures.logoQuicPay,
        name: "QUICPay",
        pmcode: "02-06"
    },
    {
        logo: LocalPictures.logoPitapa,
        name: "PiTaPa",
        pmcode: "02-07"
    }
];
const qrPayList = [
    {
        logo: null,
        name: "楽天ペイ",
        pmcode: "11" //Payment Code
    },
    {
        logo: null,
        name: "LINEPay",
        pmcode: "12"
    },
    {
        logo: null,
        name: "PayPay",
        pmcode: "13"
    },
    {
        logo: null,
        name: "d払い",
        pmcode: "14"
    },
    {
        logo: null,
        name: "auPay",
        pmcode: "15"
    },
    {
        logo: null,
        name: "メルペイ",
        pmcode: "16"
    },
    {
        logo: null,
        name: "銀行Pay",
        pmcode: "19"
    },
    {
        logo: null,
        name: "WeChatPay",
        pmcode: "21"
    },
    {
        logo: null,
        name: "Alipay",
        pmcode: "22" 
    },
    {
        logo: null,
        name: "銀聯",
        pmcode: "23"
    },
    {
        logo: null,
        name: "BankPay",
        pmcode: "35"
    }
];

//扫描二维码结束后调用
function onScanFinish(dat){
    if(dat.scanResult){
        DeviceEventEmitter.emit(onInputChange, { nth: 2, txt: dat.scanResult }); //发送数据给父组件
    }
}

//银行卡
function tabBankCard(props){
    const i18n = useI18N();
    const [payAmounts, setPayAmounts] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [paymentIndex, setPaymentIndex] = useState(0);
    const [currentInputBox, setCurrentInputBox] = useState(1);
    
    const toggleAmountInput = () => {
        if(currentInputBox !== 1){
            DeviceEventEmitter.emit(onInputToggle, { nth: 1, txt: payAmounts }); //发送数据给父组件
        } else {
            DeviceEventEmitter.emit(onInputToggle, { nth: 0, txt: "" }); //发送数据给父组件
        }
    }
    const toggleCouponInput = () => {
        if(currentInputBox !== 2){
            DeviceEventEmitter.emit(onInputToggle, { nth: 2, txt: couponCode }); //发送数据给父组件
        } else {
            DeviceEventEmitter.emit(onInputToggle, { nth: 0, txt: "" }); //发送数据给父组件
        }
    }
    const togglePKHidden = () => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 0, txt: "" }); //发送数据给父组件
    }
    const togglePayment = (idx) => {
        return function() {
            setPaymentIndex(idx);
            if(currentInputBox !== 0){
                togglePKHidden();
            }
        }
    }
    const scanCouponCode = () => {
        if(currentInputBox !== 0){
            togglePKHidden();
        }
        QRcodeScanner.openScanner(onScanFinish);
    }
    const startPayMoney = () => {
        //以下属性数据类型都是字符串！
        PaymentHelper.startPay({
            transactionMode: (runtimeEnvironment.isProduction ? "1" : "2"), //1-正常，2-练习
            transactionType: "1", //1-付款，2-取消付款，3-退款
            paymentType: bankCardList[paymentIndex].pmcode,
            amount: (payAmounts || "0"),
            tax: "0",
            slipNumber: "" //单据号码，取消付款或者退款时用到
        }, function(payRes){
            console.log(payRes);
        });
    }
    
    useEffect(() => {
        const evt1000 = DeviceEventEmitter.addListener(onInputChange, function(infos){
            if(infos.nth === 1){
                setPayAmounts(infos.txt);
            } else {
                setCouponCode(infos.txt);
            }
        });
        const evt1001 = DeviceEventEmitter.addListener(onInputToggle, function(infos){
            setCurrentInputBox(infos.nth);
        });
        
        return () => { 
            evt1000.remove();
            evt1001.remove();
        }
    }, []);
    
    //银行卡支付界面
    return (
        <ScrollView style={fxG1} contentContainerStyle={mhF}>
            <View style={[fxHC, styles.moneyLabel]}>
                <Text style={[fxG1, fs16]}>{i18n["input.amount"]}</Text>
                <Text style={tcCC}>{i18n["currency.code"]}</Text>
            </View>
            <View style={styles.rowBox}>
                <Text style={[styles.moneyInput, currentInputBox===1&&styles.InputActived]} onPress={toggleAmountInput}>{i18n["currency.symbol"]}{payAmounts}</Text>
            </View>
            <Pressable style={[fxHC, styles.couponLabel]} android_ripple={tcCC} onPress={scanCouponCode}>
                <Text style={[fxG1, fs16]}>{i18n["coupon"]}</Text>
                <Text style={[tcMC, mgRX]}>{i18n["qrcode.identify"]}</Text>
                <PosPayIcon name="qrcode-scan" color={appMainColor} size={24} />
            </Pressable>
            <View style={pdHX}>
                <Text style={[styles.couponInput, !couponCode&&styles.couponEmpty, currentInputBox===2&&styles.InputActived]} onPress={toggleCouponInput}>{couponCode || i18n["coupon.enter.tip"]}</Text>
            </View>
            <View style={[fxHC, styles.rowBox]}>
                <Text style={[fxG1, styles.paymentLabel]}>{i18n["payment.method"]}</Text>
                <Text style={styles.paymentLabel}>{bankCardList[paymentIndex].name}</Text>
            </View>
            <View style={[fxR, fxWP, pdHX]}>
                {bankCardList.map((vx, ix) => (
                    <TouchableOpacity key={vx.name} activeOpacity={0.5} onPress={togglePayment(ix)} style={[styles.paymentBox, paymentIndex===ix&&styles.paymentSelected]}>
                        <Image style={whF} source={vx.logo} />
                        <PosPayIcon visible={paymentIndex===ix} name="check-fill" color={appMainColor} size={20} style={styles.paymentChecked} />
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={fxG1} onPress={togglePKHidden}>{/* 点我关闭键盘 */}</Text>
            <View style={pdX}><GradientButton onPress={startPayMoney}>{i18n["btn.collect"]}</GradientButton></View>
        </ScrollView>
    );
}

//电子钱包
function tabEWallet(props){
    const i18n = useI18N();
    const [payAmounts, setPayAmounts] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [paymentIndex, setPaymentIndex] = useState(0);
    const [currentInputBox, setCurrentInputBox] = useState(1);
    
    const toggleAmountInput = () => {
        if(currentInputBox !== 1){
            DeviceEventEmitter.emit(onInputToggle, { nth: 1, txt: payAmounts }); //发送数据给父组件
        } else {
            DeviceEventEmitter.emit(onInputToggle, { nth: 0, txt: "" }); //发送数据给父组件
        }
    }
    const toggleCouponInput = () => {
        if(currentInputBox !== 2){
            DeviceEventEmitter.emit(onInputToggle, { nth: 2, txt: couponCode }); //发送数据给父组件
        } else {
            DeviceEventEmitter.emit(onInputToggle, { nth: 0, txt: "" }); //发送数据给父组件
        }
    }
    const togglePKHidden = () => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 0, txt: "" }); //发送数据给父组件
    }
    const togglePayment = (idx) => {
        return function() {
            setPaymentIndex(idx);
            if(currentInputBox !== 0){
                togglePKHidden();
            }
        }
    }
    const scanCouponCode = () => {//点击钱包扫码识别
        if(currentInputBox !== 0){
            togglePKHidden();
        }
        QRcodeScanner.openScanner(onScanFinish);
    }
    
    useEffect(() => {
        const evt2000 = DeviceEventEmitter.addListener(onInputChange, function(infos){
            if(infos.nth === 1){
                setPayAmounts(infos.txt);
            } else {
                setCouponCode(infos.txt);
            }
        });
        const evt2001 = DeviceEventEmitter.addListener(onInputToggle, function(infos){
            setCurrentInputBox(infos.nth);
        });
        
        return () => { 
            evt2000.remove();
            evt2001.remove();
        }
    }, []);
    
    //电子钱包支付界面
    return (
        <ScrollView style={fxG1} contentContainerStyle={mhF}>
            <View style={[fxHC, styles.moneyLabel]}>
                <Text style={[fxG1, fs16]}>{i18n["input.amount"]}</Text>
                <Text style={tcCC}>{i18n["currency.code"]}</Text>
            </View>
            <View style={styles.rowBox}>
                <Text style={[styles.moneyInput, currentInputBox===1&&styles.InputActived]} onPress={toggleAmountInput}>{i18n["currency.symbol"]}{payAmounts}</Text>
            </View>
            <Pressable style={[fxHC, styles.couponLabel]} android_ripple={tcCC} onPress={scanCouponCode}>
                <Text style={[fxG1, fs16]}>{i18n["coupon"]}</Text>
                <Text style={[tcMC, mgRX]}>{i18n["qrcode.identify"]}</Text>
                <PosPayIcon name="qrcode-scan" color={appMainColor} size={24} />
            </Pressable>
            <View style={pdHX}>
                <Text style={[styles.couponInput, !couponCode&&styles.couponEmpty, currentInputBox===2&&styles.InputActived]} onPress={toggleCouponInput}>{couponCode || i18n["coupon.enter.tip"]}</Text>
            </View>
            <View style={[fxHC, styles.rowBox]}>
                <Text style={[fxG1, styles.paymentLabel]}>{i18n["payment.method"]}</Text>
                <Text style={styles.paymentLabel}>{eWalletList[paymentIndex].name}</Text>
            </View>
            <View style={[fxR, fxWP, pdHX]}>
                {eWalletList.map((vx, ix) => (
                    <TouchableOpacity key={vx.name} activeOpacity={0.5} onPress={togglePayment(ix)} style={[styles.paymentBox, paymentIndex===ix&&styles.paymentSelected]}>
                        <Image style={whF} source={vx.logo} />
                        <PosPayIcon visible={paymentIndex===ix} name="check-fill" color={appMainColor} size={20} style={styles.paymentChecked} />
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={fxG1} onPress={togglePKHidden}>{/* 点我关闭键盘 */}</Text>
            <View style={pdX}><GradientButton>{i18n["btn.collect"]}</GradientButton></View>
        </ScrollView>
    );
}

//二维码
function tabQRCode(props){
    const i18n = useI18N();
    const [payAmounts, setPayAmounts] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [currentInputBox, setCurrentInputBox] = useState(1);
    const [paymentName, setPaymentName] = useState("");
    
    const toggleAmountInput = () => {
        if(currentInputBox !== 1){
            DeviceEventEmitter.emit(onInputToggle, { nth: 1, txt: payAmounts }); //发送数据给父组件
        } else {
            DeviceEventEmitter.emit(onInputToggle, { nth: 0, txt: "" }); //发送数据给父组件
        }
    }
    const toggleCouponInput = () => {
        if(currentInputBox !== 2){
            DeviceEventEmitter.emit(onInputToggle, { nth: 2, txt: couponCode }); //发送数据给父组件
        } else {
            DeviceEventEmitter.emit(onInputToggle, { nth: 0, txt: "" }); //发送数据给父组件
        }
    }
    const togglePKHidden = () => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 0, txt: "" }); //发送数据给父组件
    }
    const scanCouponCode = () => {
        if(currentInputBox !== 0){
            togglePKHidden();
        }
        QRcodeScanner.openScanner(onScanFinish);
    }
    const startPayMoney = () => {
        //以下属性数据类型都是字符串！
        PaymentHelper.startPay({
            transactionMode: (runtimeEnvironment.isProduction ? "1" : "2"), //1-正常，2-练习
            transactionType: "1", //1-付款，2-取消付款，3-退款
            paymentType: "03", //扫描支付固定为 03
            amount: (payAmounts || "0"),
            tax: "0",
            slipNumber: "" //单据号码，取消付款或者退款时用到
        }, function(payRes){
            console.log(payRes);
        });
    }
    
    useEffect(() => {
        const evt3000 = DeviceEventEmitter.addListener(onInputChange, function(infos){
            if(infos.nth === 1){
                setPayAmounts(infos.txt);
            } else {
                setCouponCode(infos.txt);
            }
        });
        const evt3001 = DeviceEventEmitter.addListener(onInputToggle, function(infos){
            setCurrentInputBox(infos.nth);
        });
        
        return () => { 
            evt3000.remove();
            evt3001.remove();
        }
    }, []);
    
    //二维码支付界面
    return (
        <ScrollView style={fxG1} contentContainerStyle={mhF}>
            <View style={[fxHC, styles.moneyLabel]}>
                <Text style={[fxG1, fs16]}>{i18n["input.amount"]}</Text>
                <Text style={tcCC}>{i18n["currency.code"]}</Text>
            </View>
            <View style={styles.rowBox}>
                <Text style={[styles.moneyInput, currentInputBox===1&&styles.InputActived]} onPress={toggleAmountInput}>{i18n["currency.symbol"]}{payAmounts}</Text>
            </View>
            <Pressable style={[fxHC, styles.couponLabel]} android_ripple={tcCC} onPress={scanCouponCode}>
                <Text style={[fxG1, fs16]}>{i18n["coupon"]}</Text>
                <Text style={[tcMC, mgRX]}>{i18n["qrcode.identify"]}</Text>
                <PosPayIcon name="qrcode-scan" color={appMainColor} size={24} />
            </Pressable>
            <View style={pdHX}>
                <Text style={[styles.couponInput, !couponCode&&styles.couponEmpty, currentInputBox===2&&styles.InputActived]} onPress={toggleCouponInput}>{couponCode || i18n["coupon.enter.tip"]}</Text>
            </View>
            <View style={[fxHC, styles.rowBox]}>
                <Text style={[fxG1, styles.paymentLabel]}>{i18n["payment.method"]}</Text>
                <Text style={[styles.paymentLabel, !paymentName&&tcCC]}>{paymentName || i18n["qrcode.scan.tip"]}</Text>
            </View>
            <TouchableOpacity style={[fxVM, styles.paymentScaning]} activeOpacity={0.5} onPress={startPayMoney}>
                <Image style={styles.paymentQrcode} source={LocalPictures.scanQRcode} />
                <Text style={[tcMC, taC, mgTX]}>{i18n["qrcode.collect"]}</Text>
            </TouchableOpacity>
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
            <Text style={args.focused ? styles.tabActived : styles.tabInactived}>{args.route.title}</Text>
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
    const [inputIndex, setInputIndex] = useState(1);
    
    const openDrawer = () => {
        props.navigation.openDrawer();
    }
    const onTxtChange = (txt) => {
        DeviceEventEmitter.emit(onInputChange, { nth: inputIndex, txt: txt }); //发送数据给子组件
    }
    const onPkClose = (txt) => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 0, txt: "" }); //发送数据给子组件
    }
    const gotoSettingPage = () => {
        props.navigation.navigate("设置页");
    }
    
    useEffect(() => {
        const eventer9000 = DeviceEventEmitter.addListener(onInputToggle, function(infos){
            setInputIndex(infos.nth);
            pkRef.current.initiText(infos.txt);
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
                onSetting={gotoSettingPage}
                phoneMode={inputIndex===2} 
                onChange={onTxtChange} 
                onClose={onPkClose} 
                onConfirm={onPkClose}
            />
        </View>
    );
}