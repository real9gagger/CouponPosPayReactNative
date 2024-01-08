import { createPosPayNavigator } from "@/routers/tabs";
import { useSelector } from "react-redux";

//底部标签栏
const PosPayTab = createPosPayNavigator();

//首页标签栏组件
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
    }
}