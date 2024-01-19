import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useI18N } from "@/store/getter";
import { defaultScreenOptions, PosPayRouterList } from "./screens";

const PosPayStack = createStackNavigator();

//需要多语言翻译的页面的索引
const i18nScreenList = PosPayRouterList.map((vxo, ixo) => (!vxo.i18nTitle ? -1 : ixo)).filter(ixo => (ixo >= 0));

export default function Routers(){
    const i18n = useI18N();
    
    for(const ixo of i18nScreenList){
        PosPayRouterList[ixo].options.title = i18n[PosPayRouterList[ixo].i18nTitle];
    }

    return (
        <NavigationContainer>
            <PosPayStack.Navigator initialRouteName="启动屏" screenOptions={defaultScreenOptions}>
                {PosPayRouterList.map(vxo => (
                	<PosPayStack.Screen
                		key={vxo.name}
                		name={vxo.name}
                		component={vxo.component}
                		options={vxo.options}
                        initialParams={vxo.params}
                	/>
                ))}
            </PosPayStack.Navigator>
        </NavigationContainer>
    )
}