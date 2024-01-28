import { useEffect, useState, useRef } from "react";
import { ScrollView, View, Text, Pressable , Image, StatusBar, StyleSheet, TouchableOpacity, DeviceEventEmitter } from "react-native";
import { useI18N, useAppSettings } from "@/store/getter";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import ImageButton from "@/components/ImageButton";
import PayKeyboard from "@/components/PayKeyboard";
import LocalPictures from "@/common/Pictures";
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
    tabBar: {
        backgroundColor: "#eee",
        elevation: 0, /* 禁用底部阴影效果 */
        borderTopColor: "#ccc",
        borderTopWidth: 0
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
    moneyLabel: {
        fontSize: 16,
        paddingVertical: 5
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
        flex: 1,
        fontSize: 16,
        paddingVertical: 5
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
        color: "#ccc",
        fontSize: 14
    },
    InputActived: {
        borderBottomColor: appMainColor,
        backgroundColor: "#e5faf3"
    },
    paymentBox: {
        width: 100,
        height: 100,
        padding: 5,
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        margin: 3
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
const onInputColse = "ON_INPUT_CLOSE";
const bankCardList = [
    {
        logo: LocalPictures.logoChinaUnionpay,
        name: "中国银联"
    }
];
const eWalletList = [
    {
        logo: LocalPictures.logoJiaotongxiIC,
        name: "交通系IC"
    },
    {
        logo: LocalPictures.logoLetianEdy,
        name: "乐天Edy"
    },
    {
        logo: LocalPictures.logoQuicPay,
        name: "QUICPay"
    },
    {
        logo: LocalPictures.logoNanaco,
        name: "nanaco"
    }
];

//银行卡
function tabBankCard(props){
    const i18n = useI18N();
    const [payAmounts, setPayAmounts] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [paymentIndex, setPaymentIndex] = useState(0);
    const [currentInputBox, setCurrentInputBox] = useState(1);
    const routeKey = props.route.key;
    
    const toggleAmountInput = () => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 1, txt: payAmounts, key: routeKey }); //发送数据给父组件
        setCurrentInputBox(1);
    }
    const toggleCouponInput = () => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 2, txt: couponCode, key: routeKey }); //发送数据给父组件
        setCurrentInputBox(2);
    }
    const togglePKHidden = () => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 0, txt: "", key: routeKey }); //发送数据给父组件
        setCurrentInputBox(0);
    }
    
    useEffect(() => {
        const evt1000 = DeviceEventEmitter.addListener(onInputChange, function(infos){
            if(infos.nth === 1){
                setPayAmounts(infos.txt);
            } else {
                setCouponCode(infos.txt);
            }
        });
        const evt1001 = DeviceEventEmitter.addListener(onInputColse, function(nth){
            if(nth === 0){
                setCurrentInputBox(0);
            }
        });
        const evt1002 = DeviceEventEmitter.addListener(onInputToggle, function(infos){
            if(infos.key !== routeKey){
                setCurrentInputBox(infos.nth);
            }
        });
        
        return () => { 
            evt1000.remove();
            evt1001.remove();
            evt1002.remove();
        }
    }, []);
    
    return (
        <ScrollView style={fxG1} contentContainerStyle={mhF}>
            <View style={pdX}>
                <Text style={styles.moneyLabel}>{i18n["input.amount.tip"]}</Text>
                <Text style={[styles.moneyInput, currentInputBox===1&&styles.InputActived]} onPress={toggleAmountInput}>{i18n["currency.symbol"]}{payAmounts}</Text>
            </View>
            <View style={pdHX}>
                <View style={fxHC}>
                    <Text style={styles.couponLabel}>{i18n["coupon"]}</Text>
                    <Text style={[tc99, mgRX]}>{i18n["qrcode.identify"]}</Text>
                    <PosPayIcon name="qrcode-scan" color="#000" size={24} />
                </View>
                <Text style={[styles.couponInput, !couponCode&&styles.couponEmpty, currentInputBox===2&&styles.InputActived]} onPress={toggleCouponInput}>{couponCode || i18n["coupon.code"]}</Text>
            </View>
            <View style={[fxR, fxJC, fxWP ,pdX]}>
                {bankCardList.map((vx, ix) => (
                    <TouchableOpacity key={vx.name} activeOpacity={0.5} onPress={() => setPaymentIndex(ix)} style={[styles.paymentBox, paymentIndex===ix&&styles.paymentSelected]}>
                        <Image style={whF} source={vx.logo} />
                        <PosPayIcon visible={paymentIndex===ix} name="check-confirm" color={appMainColor} size={20} style={styles.paymentChecked} />
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={fxG1} onPress={togglePKHidden}>{/* 点我关闭键盘 */}</Text>
            <View style={pdX}><GradientButton>{i18n["btn.collect"]}</GradientButton></View>
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
    const routeKey = props.route.key;
    
    const toggleAmountInput = () => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 1, txt: payAmounts, key: routeKey }); //发送数据给父组件
        setCurrentInputBox(1);
    }
    const toggleCouponInput = () => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 2, txt: couponCode, key: routeKey }); //发送数据给父组件
        setCurrentInputBox(2);
    }
    const togglePKHidden = () => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 0, txt: "", key: routeKey }); //发送数据给父组件
        setCurrentInputBox(0);
    }
    
    useEffect(() => {
        const evt2000 = DeviceEventEmitter.addListener(onInputChange, function(infos){
            if(infos.nth === 1){
                setPayAmounts(infos.txt);
            } else {
                setCouponCode(infos.txt);
            }
        });
        const evt2001 = DeviceEventEmitter.addListener(onInputColse, function(nth){
            if(nth === 0){
                setCurrentInputBox(0);
            }
        });
        const evt2002 = DeviceEventEmitter.addListener(onInputToggle, function(infos){
            if(infos.key !== routeKey){
                setCurrentInputBox(infos.nth);
            }
        });
        
        return () => { 
            evt2000.remove();
            evt2001.remove();
            evt2002.remove();
        }
    }, []);
    
    return (
        <ScrollView style={fxG1} contentContainerStyle={mhF}>
            <View style={pdX}>
                <Text style={styles.moneyLabel}>{i18n["input.amount.tip"]}</Text>
                <Text style={[styles.moneyInput, currentInputBox===1&&styles.InputActived]} onPress={toggleAmountInput}>{i18n["currency.symbol"]}{payAmounts}</Text>
            </View>
            <Pressable style={[fxHC, pdHX]} android_ripple={tcCC}>
                <Text style={styles.couponLabel}>{i18n["coupon"]}</Text>
                <Text style={[tcMC, mgRX]}>{i18n["qrcode.identify"]}</Text>
                <PosPayIcon name="qrcode-scan" color="#000" size={24} />
            </Pressable>
            <View style={pdHX}>
                <Text style={[styles.couponInput, !couponCode&&styles.couponEmpty, currentInputBox===2&&styles.InputActived]} onPress={toggleCouponInput}>{couponCode || i18n["coupon.code"]}</Text>
            </View>
            <View style={[fxR, fxJC, fxWP ,pdX]}>
                {eWalletList.map((vx, ix) => (
                    <TouchableOpacity key={vx.name} activeOpacity={0.5} onPress={() => setPaymentIndex(ix)} style={[styles.paymentBox, paymentIndex===ix&&styles.paymentSelected]}>
                        <Image style={whF} source={vx.logo} />
                        <PosPayIcon visible={paymentIndex===ix} name="check-confirm" color={appMainColor} size={20} style={styles.paymentChecked} />
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
    const routeKey = props.route.key;
    
    const toggleAmountInput = () => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 1, txt: payAmounts, key: routeKey }); //发送数据给父组件
        setCurrentInputBox(1);
    }
    const toggleCouponInput = () => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 2, txt: couponCode, key: routeKey }); //发送数据给父组件
        setCurrentInputBox(2);
    }
    const togglePKHidden = () => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 0, txt: "", key: routeKey }); //发送数据给父组件
        setCurrentInputBox(0);
    }
    
    useEffect(() => {
        const evt3000 = DeviceEventEmitter.addListener(onInputChange, function(infos){
            if(infos.nth === 1){
                setPayAmounts(infos.txt);
            } else {
                setCouponCode(infos.txt);
            }
        });
        const evt3001 = DeviceEventEmitter.addListener(onInputColse, function(nth){
            if(nth === 0){
                setCurrentInputBox(0);
            }
        });
        const evt3002 = DeviceEventEmitter.addListener(onInputToggle, function(infos){
            if(infos.key !== routeKey){
                setCurrentInputBox(infos.nth);
            }
        });
        
        return () => { 
            evt3000.remove();
            evt3001.remove();
            evt3002.remove();
        }
    }, []);
    
    return (
        <ScrollView style={fxG1} contentContainerStyle={mhF}>
            <View style={pdX}>
                <Text style={styles.moneyLabel}>{i18n["input.amount.tip"]}</Text>
                <Text style={[styles.moneyInput, currentInputBox===1&&styles.InputActived]} onPress={toggleAmountInput}>{i18n["currency.symbol"]}{payAmounts}</Text>
            </View>
            <View style={pdHX}>
                <View style={fxHC}>
                    <Text style={styles.couponLabel}>{i18n["coupon"]}</Text>
                    <Text style={[tc99, mgRX]}>{i18n["qrcode.identify"]}</Text>
                    <PosPayIcon name="qrcode-scan" color="#000" size={24} />
                </View>
                <Text style={[styles.couponInput, !couponCode&&styles.couponEmpty, currentInputBox===2&&styles.InputActived]} onPress={toggleCouponInput}>{couponCode || i18n["coupon.code"]}</Text>
            </View>
            <TouchableOpacity style={[fxVM, styles.paymentScaning]} activeOpacity={0.5}>
                <Image style={styles.paymentQrcode} source={LocalPictures.scanQRcode} />
                <Text style={[tcMC, taC, mgTX]}>{i18n["qrcode.collect"]}</Text>
            </TouchableOpacity>
            <Text style={fxG1} onPress={togglePKHidden}>{/* 点我关闭键盘 */}</Text>
            <View style={pdX}><GradientButton>{i18n["btn.collect"]}</GradientButton></View>
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
    return (
        <TabBar
            {...props}
            scrollEnabled={true}
            renderLabel={customTabItem}
            indicatorStyle={styles.tabIndicator}
            tabStyle={styles.tabItem}
            style={styles.tabBar}
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
        DeviceEventEmitter.emit(onInputColse, 0); //发送数据给子组件
        setInputIndex(0);
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
            { key: "tabBankCard", title: i18n["credit.card"] },
            { key: "tabEWallet", title: i18n["e.wallet"] },
            { key: "tabQRCode", title: i18n["qrcode.pay"] },
        ]);
    }, [i18n]);
    
    return (
        <View style={pgFF}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            {appSettings.isEnableHomeHeader &&
                <View style={[fxVM, styles.headerBox]}>
                    <ImageButton visible={appSettings.isEnableDrawer} source={LocalPictures.iconToggleDrawer} style={styles.toggleIcon} onPress={openDrawer} />
                    <Text style={fs18}>{i18n["tabbar.home"]}</Text>
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
                precision={2} 
                isPhoneMode={inputIndex===2} 
                onChange={onTxtChange} 
                onClose={onPkClose} 
                onConfirm={onPkClose}
            />
        </View>
    );
}