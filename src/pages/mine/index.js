import { useEffect } from "react";
import { ScrollView, View, Button, StatusBar, Text } from "react-native";
import AppPackageInfo from "@/modules/AppPackageInfo";

export default function MineIndex(props){
    return (
        <ScrollView>
            <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
            <Text style={fs20}>个人中心 {AppPackageInfo.getFullVersion()}</Text>
            <Button title="跳转到我的账户" onPress={() => props.navigation.navigate("我的账户")} />
            <Button title="跳转到设置" onPress={() => props.navigation.navigate("设置页")} />
        </ScrollView>
    )
}