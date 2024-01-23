import { useEffect } from "react";
import { View, Text, StyleSheet, BackHandler } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { PlatformPressable } from "@react-navigation/elements";
import { createPosPayNavigator } from "@/routers/tabsCreater";
import { PosPayTabList, noHeaderOptions } from "@/routers/screens";
import { useI18N } from "@/store/getter";
import PosPayIcon from "@/components/PosPayIcon";

//底部标签栏
const PosPayTab = createPosPayNavigator();
const PosPayDrawer = createDrawerNavigator();

const styles = StyleSheet.create({
    titleBox: {
        paddingHorizontal: 16
    },
    titleLabel: {
        fontSize: 20,
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
        fontSize: 18,
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
function MyTabs(arg0){
    const params = { enabledDrawer: (arg0 !== false) };
    return (
        <PosPayTab.Navigator initialRouteName="主页">
            {PosPayTabList.map(item =>
                <PosPayTab.Screen
                    key={item.name}
                    name={item.name}
                    component={item.component}
                    options={item.options}
                    initialParams={params}
                />
            )}
        </PosPayTab.Navigator>
    );
};

//自定义抽屉内容
function CustomDrawerContent(props) {   
    //console.log(props);
    
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
                        <PlatformPressable key={vx.key} style={styles.itemBox} onPress={() => onDrawerItemPress(vx.key)} pressColor="#ccc">
                            <PosPayIcon name={vx.iconName} size={20} />
                            <Text style={styles.itemLabel}>{vx.label}</Text>
                        </PlatformPressable>
                    )
                }
            })}
        </DrawerContentScrollView>
    );
}

//首页标签栏组件
export default function IndexIndex(props){
    const i18n = useI18N();
    
    if(!drawerItemList[0].label){//初始化！
        drawerItemList.forEach(vxo => {
            vxo.label = i18n[vxo.i18nLabel];
        });
    }
    
    useEffect(() => {
        console.log("语言类型改变了...");
        drawerItemList.forEach(vxo => {
            vxo.label = i18n[vxo.i18nLabel];
        });
    }, [i18n]);
    
    if(!!props.route.params?.enabledDrawer){//如果弃用抽屉
        return (
            <PosPayDrawer.Navigator screenOptions={noHeaderOptions} drawerContent={CustomDrawerContent}>
                <PosPayDrawer.Screen name="抽屉栏" component={MyTabs} />
            </PosPayDrawer.Navigator>
        );
    } else {
        return MyTabs(false);
    }
}