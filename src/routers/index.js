import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import IndexIndex from "@/pages/index/index";
import IndexSplash from "@/pages/index/splash";
import IndexHome from "@/pages/index/home";
import MineIndex from "@/pages/mine/index";

const PosPayStack = createStackNavigator();

//非Tabs页面的顶部导航栏全局配置
const screenOptions = {
	// 自定义标题栏的样式。
	headerStyle: {
		// 背景颜色
		backgroundColor: "red",
		// 去掉标题栏底部阴影效果
		elevation: 0
	},
	// 控制是否显示页面的标题栏。
	headerShown: true,
	// 设置标题栏文本颜色。
	headerTintColor: "#FFF",
	// 设置标题文本的对齐方式
	headerTitleAlign: "left"
}

//无标题页样式选项
const noHeaderOptions = {
	headerShown: false, // 是否显示标题
    animationEnabled: false
}

const PosPayTabs = [
    {
        title: "主页",
        component: IndexHome,
        options: noHeaderOptions
    },
    {
        title: "个人中心",
        component: MineIndex,
        options: noHeaderOptions
    }
]

//路由页面列表
const PosPayRouters = [
    {
        title: "启动屏",
        component: IndexSplash,
        options: noHeaderOptions
    },
    {
        title: "应用首页",
        component: IndexIndex.initTabBar(PosPayTabs),
        options: noHeaderOptions
    }
]

export default function Routers(){
    return (
        <NavigationContainer>
            <PosPayStack.Navigator initialRouteName="启动屏" screenOptions={screenOptions}>
                {PosPayRouters.map(vxo => (
                	<PosPayStack.Screen
                		key={vxo.title}
                		name={vxo.title}
                		component={vxo.component}
                		options={vxo.options}
                	/>
                ))}
            </PosPayStack.Navigator>
        </NavigationContainer>
    )
}