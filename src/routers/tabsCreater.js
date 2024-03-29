/*
    2023年9月28日 自定义标签导航栏
*/
import { TouchableOpacity, View, Text, StyleSheet, Vibration } from "react-native";
import { createNavigatorFactory, useNavigationBuilder, TabRouter, TabActions } from "@react-navigation/native";
import { TabIconHome, TabIconShop, TabIconMine } from "@/components/TabBarIcon";
import { useI18N } from "@/store/getter";

const styles = StyleSheet.create({
    navigationContainer: {
        flexDirection: "column",
        flex: 1,
        overflow: "hidden"
    },
    contentContainer: {
        flex: 1,
        overflow: "hidden",
        backgroundColor: "#fff"
    },
    contentShow: {
        display: "flex",
        height: "100%"
    },
    contentHide: {
        display: "none"
    },
    tabbarContaner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0"
    },
    tabbarItem: {
        flex: 1,
        paddingVertical: 5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    tabbarLabel0: {
        fontSize: 10,
        marginTop: 0,
        color: "#666"
    },
    tabbarLabel1: {
        fontSize: 10,
        marginTop: 0,
        color: appMainColor
    }
});
const isTabsRendered = {}; //标签页是否首次渲染过了
const backBehavior = "none"; //后退按钮是否会导致标签切换到初始tab？ 如果是，则设切换到初始tab，否则什么也不做。 默认为切换到初始tab

function TheTabNavigator({ children, screenOptions, initialRouteName }) {
    
    //使用国际化多语言
    const i18n = useI18N();
    
    const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(TabRouter, {
        children,
        screenOptions,
        backBehavior,
        initialRouteName
    });
    
    //底部栏图标点击事件
    const onTabBarItemPress = (routeInfo) => {
        return function(){
            const event = navigation.emit({
                type: "onTabPress",
                target: routeInfo.key,
                canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
                navigation.dispatch({
                    ...TabActions.jumpTo(routeInfo.name),
                    target: state.key,
                });
                Vibration.vibrate(50);
            }
        }
    }

    //内容框渲染
    const onTabScreenRender = (routeInfo, routeIndex) => {
        const isActiving = (routeIndex === state.index);
        
        if(!isActiving){
            if(!isTabsRendered[routeIndex]){
                return null;
            }
        } else {
            isTabsRendered[routeIndex] = true;
        }
        
        return (<View 
            key={routeInfo.key} 
            style={isActiving ? styles.contentShow : styles.contentHide}>{descriptors[routeInfo.key].render()}</View>);
    }
    
    //底部栏图标渲染
    const onTabIconRender = (routeInfo, routeIndex) => {
        const isActiving = (routeIndex === state.index);
        const iconColor = (isActiving ? "" : "#aaa");
        const labelCss = (isActiving ? styles.tabbarLabel1 : styles.tabbarLabel0);
        const iconComp = [];
        
        switch(routeInfo.name){
            case "主页": 
                iconComp[0] = (<TabIconHome color={iconColor} key="100" />);
                iconComp[1] = (<Text style={labelCss} key="101">{i18n["tabbar.home"]}</Text>);
                break;
            case "店铺":
                iconComp[0] = (<TabIconShop color={iconColor}  key="200" />);
                iconComp[1] = (<Text style={labelCss} key="201">{i18n["tabbar.shop"]}</Text>);
                break;
            case "个人中心": 
                iconComp[0] = (<TabIconMine color={iconColor}  key="300" />);
                iconComp[1] = (<Text style={labelCss} key="301">{i18n["tabbar.mine"]}</Text>);
                break;
        }
        
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                key={routeInfo.key}
                onPress={onTabBarItemPress(routeInfo)}
                style={styles.tabbarItem}>{iconComp}</TouchableOpacity>
        )
    }

    return (
        <NavigationContent>
            <View style={styles.navigationContainer}>
                <View style={styles.contentContainer}>{state.routes.map(onTabScreenRender)}</View>
                <View style={styles.tabbarContaner}>{state.routes.map(onTabIconRender)}</View>
            </View>
        </NavigationContent>
    );
}

export const createPosPayNavigator = createNavigatorFactory(TheTabNavigator);