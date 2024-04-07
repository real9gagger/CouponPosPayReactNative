import { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, StatusBar, BackHandler } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { createPosPayNavigator } from "@/routers/tabsCreater";
import { useI18N, useAppSettings } from "@/store/getter";
import { dispatchResetUserInfo } from "@/store/setter";
import PosPayIcon from "@/components/PosPayIcon";
import IndexHome from "@/pages/index/home";
import MineIndex from "@/pages/mine/index";

const DRAWER_ROUTE_NAME = "抽屉栏"; //路由名称，不需要翻译！

//底部标签栏
const PosPayTab = createPosPayNavigator();
const PosPayDrawer = createDrawerNavigator();

const styles = StyleSheet.create({
    titleBox: {
        paddingHorizontal: 15
    },
    lineBox: {
        paddingHorizontal: 15,
        paddingVertical: 5
    },
    titleLabel: {
        fontSize: 16,
        color: "#000",
        fontWeight: "bold",
        marginTop: 5,
        paddingTop: 13,
        paddingBottom: 10
    },
    titleSpliter: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#d0d0d0"
    },
    itemLabel: {
        fontSize: 16,
        color: "#000",
        paddingLeft: 15,
        flex: 1
    },
    itemBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10
    }
});

//无标题页样式选项
const noHeaderOptions = {
	headerShown: false, // 是否显示标题
    animationEnabled: false
};

//首页底部标签栏列表
const posPayTabList = [
    {
        name: "主页",
        component: IndexHome,
        options: noHeaderOptions
    },
    {
        name: "店铺",
        component: MineIndex,
        options: noHeaderOptions
    },
    /* {
        name: "个人中心",
        component: null,
        options: noHeaderOptions
    } */
];

//抽屉列表
const drawerItemList = [
    {
        key: "业务",
        i18nLabel: "business",
        iconName: ""
    },
    {
        key: "业务-销售",
        i18nLabel: "drawer.sale",
        iconName: "sale-flag"
    },
    {
        key: "业务-退款",
        i18nLabel: "drawer.returns",
        iconName: "return-goods"
    },
    {
        key: "业务-打印",
        i18nLabel: "print",
        iconName: "printing"
    },
    {
        key: "业务-统计",
        i18nLabel: "statistics",
        iconName: "statistics"
    },
    {
        key: "系统",
        i18nLabel: "system",
        iconName: ""
    },
    {
        key: "系统-设置",
        i18nLabel: "setting",
        iconName: "system-setting"
    },
    {
        key: "系统-副屏",
        i18nLabel: "customer.display",
        iconName: "customer-display"
    },
    {
        key: "系统-打印",
        i18nLabel: "print.items",
        iconName: "printer-stroke"
    },
    {
        key: "系统-帮助",
        i18nLabel: "drawer.helps",
        iconName: "help-stroke"
    },
    {
        key: "其他",
        i18nLabel: "",
        iconName: ""
    },
    {
        key: "账户-登出",
        i18nLabel: "btn.logout",
        iconName: "logout"
    },
    {
        key: "软件-退出",
        i18nLabel: "exit",
        iconName: "turn-off"
    }
];

//我的标签栏
function MyTabs(){
    return (
        <PosPayTab.Navigator initialRouteName="主页" screenOptions={noHeaderOptions}>
            {posPayTabList.map(item =>
                <PosPayTab.Screen
                    key={item.name}
                    name={item.name}
                    component={item.component}
                    options={item.options}
                />
            )}
        </PosPayTab.Navigator>
    );
};

//自定义抽屉内容
function CustomDrawerContent(props) {
    const i18n = useI18N();
    
    const callUserLogout = () => {
        $confirm(i18n["account.logout.tip"], i18n["alert.title"]).then(() => {
            dispatchResetUserInfo(); //重置用户信息
            props.navigation.reset({ //清空路由，并跳转到登录页
                index: 0,
                routes: [{ name: "登录页" }]
            });
        });
    }
    
    //抽屉列表中的项点击
    function onDrawerItemPress(itemKey){
        switch(itemKey){
            case "业务-销售": props.navigation.navigate("订单列表"); break;
            case "业务-退款": props.navigation.navigate("订单退款"); break;
            case "业务-打印": props.navigation.navigate("订单打印"); break;
            case "业务-统计": props.navigation.navigate("订单统计"); break;
            case "系统-设置": props.navigation.navigate("设置页"); break;
            case "系统-副屏": props.navigation.navigate("顾客屏幕"); break;
            case "系统-打印": props.navigation.navigate("打印设置"); break;
            case "系统-帮助": props.navigation.navigate("帮助页"); break;
            case "账户-登出": callUserLogout(); break;
            case "软件-退出": BackHandler.exitApp(); break;
        }
        props.navigation.closeDrawer();
    }

    return (
        <DrawerContentScrollView contentContainerStyle={mhF}>
            {drawerItemList.map((vx, ix) => {
                if(!vx.iconName){
                    if(!vx.i18nLabel){
                        return (
                            <View key={vx.key} style={styles.lineBox}><View style={styles.titleSpliter}></View></View>
                        )
                    } else {
                        return (
                            <View key={vx.key} style={styles.titleBox}>
                                <Text style={[styles.titleLabel, ix&&styles.titleSpliter]}>{i18n[vx.i18nLabel]}</Text>
                            </View>
                        )
                    }
                } else {
                    return (
                        <Pressable key={vx.key} style={styles.itemBox} onPress={() => onDrawerItemPress(vx.key)} android_ripple={tcBB}>
                            <PosPayIcon name={vx.iconName} size={18} />
                            <Text style={styles.itemLabel}>{i18n[vx.i18nLabel]}</Text>
                        </Pressable>
                    )
                }
            })}
        </DrawerContentScrollView>
    );
}

//首页标签栏组件
export default function IndexIndex(props){
    const appSettings = useAppSettings();
    
    useEffect(() => {
        StatusBar.setBackgroundColor("#FFF", false);
        StatusBar.setHidden(false, "none");
    }, []);
    
    if(appSettings.isEnableDrawer){//如果启用抽屉
        //如果不启用底部标签栏（默认显示首页）
        return (
            <PosPayDrawer.Navigator screenOptions={noHeaderOptions} drawerContent={CustomDrawerContent}>
                <PosPayDrawer.Screen 
                    name={appSettings.isEnableTabbar ? DRAWER_ROUTE_NAME : posPayTabList[0].name}
                    component={appSettings.isEnableTabbar ? MyTabs : posPayTabList[0].component}
                    options={appSettings.isEnableTabbar ? noHeaderOptions : posPayTabList[0].options}
                />
            </PosPayDrawer.Navigator>
        );
    } else {
        if(appSettings.isEnableTabbar){
            return MyTabs();
        } else {//如果不启用底部标签栏
            return <IndexHome {...props} />;
        }
    }
}