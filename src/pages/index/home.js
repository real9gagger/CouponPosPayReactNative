import { useEffect, useState, useRef } from "react";
import { View, Text, TouchableWithoutFeedback, TextInput, StatusBar, StyleSheet } from "react-native";
import { useI18N } from "@/store/getter";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import ImageButton from "@/components/ImageButton";
import PayKeyboard from "@/components/PayKeyboard";
import LocalPictures from "@/common/Pictures";
import PosPayIcon from "@/components/PosPayIcon";

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
        fontSize: 16,
        fontWeight: "bold",
        paddingLeft: 5
    },
    tabInactived: {
        color: "#666",
        fontSize: 16,
        paddingLeft: 5
    },
    tabView: {
        width: deviceDimensions.screenWidth
    },
    tabItem: {
        width: deviceDimensions.screenWidth / 3
    },
    moneyLabel: {
        fontSize: 20,
        paddingVertical: 5
    },
    moneyInput: {
        textAlign: "right",
        borderBottomColor: "#999",
        borderBottomWidth: StyleSheet.hairlineWidth,
        fontSize: 36,
        paddingBottom: 0,
        paddingRight: 10,
    },
    couponLabel: {
        flex: 1,
        fontSize: 20,
        paddingVertical: 5
    },
    couponInput: {
        textAlign: "right",
        borderBottomColor: "#999",
        borderBottomWidth: StyleSheet.hairlineWidth,
        fontSize: 30,
        paddingVertical: 4,
        paddingRight: 10
    },
    couponEmpty: {
        color: "#ccc"
    },
    InputActived: {
        borderBottomColor: appMainColor,
        backgroundColor: "#e5faf3"
    }
});

//银行卡
function tabBankCard(props){
    const i18n = useI18N();
    const pkRef = useRef();
    const [payAmounts, setPayAmounts] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [currentInputBox, setCurrentInputBox] = useState(1);
    
    const setInputValue = (txt) => {
        if(currentInputBox === 1){
            setPayAmounts(txt);
        } else {
            setCouponCode(txt);
        }
    }
    
    const toggleAmountInput = () => {
        setCurrentInputBox(1);        
        pkRef.current.initiText(payAmounts);
    }
    const toggleCouponInput = () => {
        setCurrentInputBox(2);
        pkRef.current.initiText(couponCode);
    }
    const togglePKHidden = () => {
        setCurrentInputBox(0);
    }
    
    return (<>
        <View style={pdX}>
            <Text style={styles.moneyLabel}>{i18n["input.amount.tip"]}</Text>
            <Text style={[styles.moneyInput, currentInputBox===1&&styles.InputActived]} onPress={toggleAmountInput}>{i18n["currency.symbol"]}{payAmounts}</Text>
        </View>
        <View style={pdHX}>
            <View style={fxHC}>
                <Text style={styles.couponLabel}>{i18n["coupon"]}</Text>
                <Text style={[tc99, mgRX]}>{i18n["qrcode.identify"]}</Text>
                <PosPayIcon name="qrcode-pay" color="#000" size={24} />
            </View>
            <Text 
                style={[styles.couponInput, !couponCode&&styles.couponEmpty, currentInputBox===2&&styles.InputActived]} 
                onPress={toggleCouponInput}>{couponCode || i18n["coupon.code"]}</Text>
        </View>
        <Text style={fxG1} onPress={togglePKHidden}>{/* 点我关闭键盘 */}</Text>
        <PayKeyboard ref={pkRef} visible={currentInputBox > 0} precision={2} onChange={setInputValue} onClose={togglePKHidden} />
    </>);
}

//电子钱包
function tabEWallet(){
    return <PayKeyboard precision={0} />
}

//二维码
function tabQRCode(){
    return <PayKeyboard precision={0} />
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

const renderScene = SceneMap({ tabBankCard, tabEWallet, tabQRCode });

export default function IndexHome(props){
    const i18n = useI18N();
    const [tabList, setTabList] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    
    const openDrawer = () => {
        props.navigation.openDrawer();
    }
    
    useEffect(() => {
        setTabList([
            { key: "tabBankCard", title: i18n["credit.card"] },
            { key: "tabEWallet", title: i18n["e.wallet"] },
            { key: "tabQRCode", title: i18n["qrcode.pay"] },
        ]);
    }, [i18n]);
    
    return (
        <View style={fxG1}>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <View style={[fxVM, styles.headerBox]}>
                <ImageButton source={LocalPictures.iconToggleDrawer} style={styles.toggleIcon} onPress={openDrawer} />
                <Text style={[taC,fs20]}>{i18n["tabbar.home"]}</Text>
            </View>
            <TabView
                navigationState={{ index: tabIndex, routes: tabList }}
                renderScene={renderScene}
                onIndexChange={setTabIndex}
                initialLayout={styles.tabView}
                renderTabBar={customTabBar}
                style={fxG1}
            />
        </View>
    );
}