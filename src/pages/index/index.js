import { useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { PlatformPressable } from "@react-navigation/elements";
import { createPosPayNavigator } from "@/routers/tabsCreater";
import { PosPayTabList, noHeaderOptions } from "@/routers/screens";
import { useI18N } from "@/store/getter";
import { dispatchUpdateUserInfo } from "@/store/setter";
import PosPayIcon from "@/components/PosPayIcon"

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
        paddingVertical: 10
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
        key: "业务-重新打印",
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
        key: "合计-重新打印",
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
        key: "系统-帮助与反馈",
        i18nLabel: "drawer.help",
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
    return (
        <DrawerContentScrollView {...props}>
            {drawerItemList.map((vx, ix) => {
                if(!vx.iconName){
                    return (
                        <View key={vx.key} style={styles.titleBox}>
                            <Text style={[styles.titleLabel, ix&&styles.titleSpliter]}>{vx.label}</Text>
                        </View>
                    );
                } else {
                    return (
                        <PlatformPressable key={vx.key} style={styles.itemBox} pressColor="#ccc" onPress={onDrawerItemPress}>
                            <PosPayIcon name={vx.iconName} size={20} />
                            <Text style={styles.itemLabel}>{vx.label}</Text>
                        </PlatformPressable>
                    )
                }
            })}
        </DrawerContentScrollView>
    );
}

//抽屉列表中的项点击
function onDrawerItemPress(evt){
    console.log(Object.keys(evt))
}

//获取商户信息
function getUserInfo(){
    $request("getPostInfo").then(res => {
        //console.log("获取用户信息成功::::", res);
        dispatchUpdateUserInfo(res);
    }).catch(err => {
        console.log("获取用户信息失败::::", err);
    });
}

//首页标签栏组件
export default function IndexIndex(props){
    const i18n = useI18N();
    
    if(!drawerItemList[0].label){//初始化！
        drawerItemList.forEach(vxo => {
            vxo.label = i18n[vxo.i18nLabel];
        });
    }
    
    useEffect(getUserInfo, []); //每次启动时更新用户信息！
    
    useEffect(() => {
        console.log("语言类型改变了...");
        drawerItemList.forEach(vxo => {
            vxo.label = i18n[vxo.i18nLabel];
        });
    }, [i18n]);
    
    console.log("eeeee...");
    
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