import { useEffect, useState, useRef } from "react";
import { ScrollView, View, Text, Image, StatusBar, StyleSheet, TouchableOpacity, DeviceEventEmitter } from "react-native";
import { useI18N } from "@/store/getter";
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
        color: "#666",
        fontSize: 14,
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
        lineHeight: 44
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
        lineHeight: 44
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
        width: 77,
        height: 77,
        padding: 5,
        backgroundColor: "#fff",
        borderColor: "#ccc",
        borderWidth: 1,
        marginRight: 5,
        marginBottom: 5
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

//标签视图内容
function myTabContent(props, tabType){
    
    const i18n = useI18N();
    const paymentList = useRef(tabType===1 ? bankCardList : (tabType===2 ? eWalletList : []));
    const [payAmounts, setPayAmounts] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [paymentIndex, setPaymentIndex] = useState(0);
    const [currentInputBox, setCurrentInputBox] = useState(1);
    
    const toggleAmountInput = () => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 1, txt: payAmounts }); //发送数据给父组件
        setCurrentInputBox(1);
    }
    const toggleCouponInput = () => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 2, txt: couponCode }); //发送数据给父组件
        setCurrentInputBox(2);
    }
    const togglePKHidden = () => {
        DeviceEventEmitter.emit(onInputToggle, { nth: 0, txt: "" }); //发送数据给父组件
        setCurrentInputBox(0);
    }
    
    useEffect(() => {
        const eventer1000 = DeviceEventEmitter.addListener(onInputChange, function(infos){
            if(infos.nth === 1){
                setPayAmounts(infos.txt);
            } else {
                setCouponCode(infos.txt);
            }
        });
        const eventer2000 = DeviceEventEmitter.addListener(onInputColse, function(nth){
            setCurrentInputBox(nth);
        });
        
        return () => { 
            eventer1000.remove();
            eventer2000.remove();
        }
    }, []);
    
    return (<ScrollView style={fxG1} contentContainerStyle={mhF}>
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
            {tabType !== 3 ? 
                paymentList.current.map((vx, ix) => (
                    <TouchableOpacity key={vx.name} activeOpacity={0.5} onPress={() => setPaymentIndex(ix)} style={[styles.paymentBox, paymentIndex===ix&&styles.paymentSelected]}>
                        <Image style={whF} source={vx.logo} />
                        <PosPayIcon visible={paymentIndex===ix} name="check-confirm" color={appMainColor} size={20} style={styles.paymentChecked} />
                    </TouchableOpacity>
                )): 
                (
                    <TouchableOpacity style={[fxVM, pdX]}>
                        <Image style={styles.paymentQrcode} source={LocalPictures.scanQRcode} />
                        <Text style={[tcMC, taC, mgTX]}>{i18n["qrcode.collect"]}</Text>
                    </TouchableOpacity>
                )
            }
        </View>
        <Text style={fxG1} onPress={togglePKHidden}>{/* 点我关闭键盘 */}</Text>
        <View style={pdX}>
            <GradientButton>{i18n["btn.collect"]}</GradientButton>
        </View>
    </ScrollView>);
}

//银行卡
function tabBankCard(props){
    return myTabContent(props, 1);
}

//电子钱包
function tabEWallet(props){
    return myTabContent(props, 2);
}

//二维码
function tabQRCode(props){
    return myTabContent(props, 3);
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
            <View style={[fxVM, styles.headerBox]}>
                <ImageButton source={LocalPictures.iconToggleDrawer} style={styles.toggleIcon} onPress={openDrawer} />
                <Text style={[taC,fs18]}>{i18n["tabbar.home"]}</Text>
            </View>
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