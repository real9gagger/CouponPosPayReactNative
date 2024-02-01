import { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, StatusBar, BackHandler } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { createPosPayNavigator } from "@/routers/tabsCreater";
import { useI18N, useAppSettings } from "@/store/getter";
import PosPayIcon from "@/components/PosPayIcon";
import IndexHome from "@/pages/index/home";
import MineIndex from "@/pages/mine/index";

const DRAWER_ROUTE_NAME = "抽屉栏"; //路由名称，不需要翻译！

//底部标签栏
const PosPayTab = createPosPayNavigator();
const PosPayDrawer = createDrawerNavigator();

const styles = StyleSheet.create({
    titleBox: {
        paddingHorizontal: 16
    },
    titleLabel: {
        fontSize: 18,
        color: "#000",
        fontWeight: "bold",
        marginTop: 5,
        paddingTop: 13,
        paddingBottom: 10
    },
    titleSpliter: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#ccc"
    },
    itemLabel: {
        fontSize: 16,
        color: "#000",
        paddingLeft: 16
    },
    itemBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
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
        name: "个人中心",
        component: MineIndex,
        options: noHeaderOptions
    }
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
        key: "业务-退货",
        i18nLabel: "drawer.returns",
        iconName: "return-goods"
    },
    {
        key: "业务-打印",
        i18nLabel: "drawer.reprint",
        iconName: "printer-stroke"
    },
    {
        key: "合计",
        i18nLabel: "summation",
        iconName: ""
    },
    {
        key: "合计-日计",
        i18nLabel: "drawer.summary",
        iconName: "sub-total"
    },
    {
        key: "合计-打印",
        i18nLabel: "drawer.reprint",
        iconName: "printer-stroke"
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
        key: "系统-帮助",
        i18nLabel: "drawer.helps",
        iconName: "help-stroke"
    },
    {
        key: "系统-退出",
        i18nLabel: "exit",
        iconName: "turn-off"
    }
];

//我的标签栏
function MyTabs(){
    return (
        <PosPayTab.Navigator initialRouteName="主页">
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
    //抽屉列表中的项点击
    function onDrawerItemPress(itemKey){
        switch(itemKey){
            case "业务-销售": break;
            case "业务-退货": break;
            case "业务-打印": break;
            case "合计-日计": break;
            case "合计-打印": break;
            case "系统-设置": props.navigation.navigate("设置页"); break;
            case "系统-帮助": props.navigation.navigate("帮助页"); break;
            case "系统-退出": BackHandler.exitApp(); break;
        }
        props.navigation.closeDrawer();
    }

    return (
        <DrawerContentScrollView>
            {drawerItemList.map((vx, ix) => {
                if(!vx.iconName){
                    return (
                        <View key={vx.key} style={styles.titleBox}>
                            <Text style={[styles.titleLabel, ix&&styles.titleSpliter]}>{vx.label}</Text>
                        </View>
                    );
                } else {
                    return (
                        <Pressable key={vx.key} style={styles.itemBox} onPress={() => onDrawerItemPress(vx.key)} android_ripple={tcBB}>
                            <PosPayIcon name={vx.iconName} size={20} />
                            <Text style={styles.itemLabel}>{vx.label}</Text>
                        </Pressable>
                    )
                }
            })}
        </DrawerContentScrollView>
    );
}

//首页标签栏组件
export default function IndexIndex(props){
    const i18n = useI18N();
    const appSettings = useAppSettings();
    
    useEffect(() => {
        StatusBar.setBackgroundColor("#FFF", false);
        StatusBar.setHidden(false, "none");
    }, []);
    
    useEffect(() => {
        drawerItemList.forEach(vxo => {
            vxo.label = i18n[vxo.i18nLabel];
        });
        console.log("修改了语言设置...");
    }, [i18n]);
    
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