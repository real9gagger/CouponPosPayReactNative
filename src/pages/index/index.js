import { createPosPayNavigator } from "@/routers/tabsCreater";
import { createDrawerNavigator } from "@react-navigation/drawer";

//底部标签栏
const PosPayTab = createPosPayNavigator();
const PosPayDrawer = createDrawerNavigator();

//首页标签栏组件 IndexIndex
export default {
    initTabBar: function(tabList){
        //初始化底部标签栏。必须返回一个函数！！！
        return () => (
            <PosPayTab.Navigator initialRouteName="主页">
                {tabList.map(item =>
                    <PosPayTab.Screen
                        key={item.title}
                        name={item.title}
                        component={item.component}
                        options={item.options}
                    />
                )}
            </PosPayTab.Navigator>
        );
    },
    initDrawer: function(drawerList){
        //必须返回一个函数
        return () => (
            <PosPayDrawer.Navigator initialRouteName="主页">
                {drawerList.map(item =>
                    <PosPayDrawer.Screen
                        key={item.title}
                        name={item.title}
                        component={item.component}
                        options={item.options}
                    />
                )}
            </PosPayDrawer.Navigator>
        );
    }
}